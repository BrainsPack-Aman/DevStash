// Lets the Prisma CLI reach Neon on networks whose DNS refuses Neon hostnames.
//
// Prisma's native migration engine only uses the system resolver. When the
// system can't resolve the database host, this module resolves it through
// public DNS and starts a relay on 127.0.0.1 that forwards Prisma's connection
// to Neon over TLS (real hostname as SNI, full certificate validation).
// The relay lives inside the Prisma CLI process, so it starts and stops with
// each command and nothing needs to be run separately.

import dns from "node:dns";
import net from "node:net";
import tls from "node:tls";

// Commands that open a database connection. Others (generate, validate...) need no relay.
const CONNECTING_COMMANDS = new Set(["migrate", "db", "studio"]);

const PLACEHOLDER_URL = /ep-xxxx|USER:PASSWORD|\.REGION\./;
const SSL_REQUEST_CODE = 80877103;
const GSSENC_REQUEST_CODE = 80877104;
const SSL_REQUEST = Buffer.from([0, 0, 0, 8, 4, 210, 22, 47]);
const CONNECT_TIMEOUT_MS = 10_000;
const DIAL_ATTEMPTS = 3;

function getDnsServers(env) {
  return (env.DNS_FALLBACK_SERVERS ?? "1.1.1.1,8.8.8.8")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);
}

export function isPlaceholderUrl(value) {
  return !value || PLACEHOLDER_URL.test(value);
}

// DIRECT_URL (Neon's non-pooled string) when it is real; otherwise DATABASE_URL
// with "-pooler" removed, because Prisma's advisory locks need the direct host.
export function getMigrationUrl(env = process.env) {
  if (!isPlaceholderUrl(env.DIRECT_URL)) return env.DIRECT_URL;
  if (isPlaceholderUrl(env.DATABASE_URL)) return undefined;

  const url = new URL(env.DATABASE_URL);
  url.hostname = url.hostname.replace("-pooler", "");
  return url.toString();
}

function canSystemResolve(host) {
  return new Promise((resolve) => dns.lookup(host, (error) => resolve(!error)));
}

async function resolveWithFallback(host, servers) {
  const resolver = new dns.promises.Resolver({ timeout: 3000, tries: 2 });
  resolver.setServers(servers);
  return resolver.resolve4(host);
}

function connectTcp(address, port) {
  return new Promise((resolve, reject) => {
    const socket = net.connect({ host: address, port, timeout: CONNECT_TIMEOUT_MS }, () => {
      socket.setTimeout(0);
      resolve(socket);
    });
    socket.once("error", reject);
    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error(`Timed out connecting to ${address}:${port}`));
    });
  });
}

function readOnce(socket) {
  return new Promise((resolve, reject) => {
    socket.once("data", resolve);
    socket.once("error", reject);
  });
}

// Opens a TLS connection to Postgres: SSLRequest, then a TLS upgrade with the
// real hostname as SNI. Certificate validation stays on. A transient failure
// (reset, handshake hiccup) is retried a few times across all known addresses
// before the client connection is dropped.
async function dialUpstream(addresses, host, port, debug) {
  let lastError = new Error("No addresses to connect to");
  for (let attempt = 1; attempt <= DIAL_ATTEMPTS; attempt++) {
    for (const address of addresses) {
      try {
        const socket = await connectTcp(address, port);
        socket.write(SSL_REQUEST);
        const reply = await readOnce(socket);
        if (reply[0] !== 0x53) throw new Error("Neon did not accept TLS");
        return await new Promise((resolve, reject) => {
          const secure = tls.connect({ socket, servername: host }, () => resolve(secure));
          secure.once("error", reject);
        });
      } catch (error) {
        lastError = error;
        debug?.(`upstream attempt ${attempt} to ${address} failed:`, error.code ?? error.message);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
  }
  throw lastError;
}

function startRelay({ host, port, addresses, debug = () => {} }) {
  const server = net.createServer((client) => {
    debug("client connected");
    client.on("error", (error) => {
      debug("client error:", error.code);
      client.destroy();
    });
    client.on("close", () => debug("client closed"));

    let buffered = Buffer.alloc(0);

    const onData = async (chunk) => {
      buffered = Buffer.concat([buffered, chunk]);

      // The loopback leg is plain. If the client asks for encryption, decline:
      // the relay encrypts the leg that crosses the network.
      while (buffered.length >= 8) {
        const code = buffered.readInt32BE(4);
        if (code !== SSL_REQUEST_CODE && code !== GSSENC_REQUEST_CODE) break;
        client.write("N");
        buffered = buffered.subarray(8);
      }

      if (buffered.length < 8 || buffered.length < buffered.readInt32BE(0)) return;

      client.off("data", onData);
      client.pause();
      try {
        const upstream = await dialUpstream(addresses, host, port, debug);
        debug("upstream TLS connected");
        upstream.on("error", () => client.destroy());
        upstream.on("close", () => client.destroy());
        client.on("close", () => upstream.destroy());
        upstream.write(buffered);
        client.pipe(upstream);
        upstream.pipe(client);
        client.resume();
      } catch (error) {
        debug("upstream failed:", error.code ?? error.message);
        client.destroy();
      }
    };

    client.on("data", onData);
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

// Returns the URL Prisma should use. Starts a relay only when the command
// connects to the database AND the system DNS can't resolve the host.
export async function resolveDatabaseUrl({ argv = process.argv, env = process.env, log = console.error } = {}) {
  const migrationUrl = getMigrationUrl(env);
  if (!migrationUrl) return "";

  const command = argv.slice(2).find((arg) => !arg.startsWith("-"));
  if (!CONNECTING_COMMANDS.has(command)) return migrationUrl;

  const url = new URL(migrationUrl);
  const host = url.hostname;
  if (await canSystemResolve(host)) return migrationUrl;

  const servers = getDnsServers(env);
  let addresses;
  try {
    addresses = await resolveWithFallback(host, servers);
  } catch {
    log(`[neon-relay] Could not resolve ${host} with the system DNS or ${servers.join(", ")}.`);
    return migrationUrl;
  }

  const debug = env.NEON_RELAY_DEBUG ? (...parts) => log("[neon-relay:debug]", ...parts) : undefined;
  if (debug) {
    let last = Date.now();
    setInterval(() => {
      const now = Date.now();
      if (now - last > 1000) debug(`event loop was blocked for ${now - last} ms`);
      last = now;
    }, 200).unref();
  }
  const relay = await startRelay({ host, port: Number(url.port || 5432), addresses, debug });
  relay.unref(); // never keep the CLI alive just for the relay
  const relayPort = relay.address().port;
  log(`[neon-relay] System DNS can't resolve ${host}; relaying via 127.0.0.1:${relayPort} (DNS: ${servers.join(", ")}).`);

  // user and password keep their original percent-encoding from the source URL.
  return `postgresql://${url.username}:${url.password}@127.0.0.1:${relayPort}/${url.pathname.slice(1)}?sslmode=disable`;
}
