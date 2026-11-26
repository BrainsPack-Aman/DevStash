import dns from "node:dns";

// Some networks (routers with DNS filtering) refuse to resolve Neon hostnames.
// When the system resolver fails for a *.neon.tech host, retry through public
// DNS. Does nothing when the system resolver works.

const INSTALLED = Symbol.for("devstash.dnsFallbackInstalled");

type LookupCallback = (
  error: NodeJS.ErrnoException | null,
  address?: string | dns.LookupAddress[],
  family?: number,
) => void;

function isNeonHost(hostname: string): boolean {
  return hostname === "neon.tech" || hostname.endsWith(".neon.tech");
}

export function installDnsFallback(): void {
  const globalWithFlag = globalThis as typeof globalThis & { [INSTALLED]?: boolean };
  if (globalWithFlag[INSTALLED]) return;
  globalWithFlag[INSTALLED] = true;

  const servers = (process.env.DNS_FALLBACK_SERVERS ?? "1.1.1.1,8.8.8.8")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);
  const resolver = new dns.Resolver();
  resolver.setServers(servers);

  const originalLookup = dns.lookup as unknown as (...args: unknown[]) => void;

  const lookupWithFallback = (hostname: string, ...rest: unknown[]): void => {
    const callback = rest.pop() as LookupCallback;
    const rawOptions = rest[0];
    const options: dns.LookupOptions =
      typeof rawOptions === "number"
        ? { family: rawOptions }
        : ((rawOptions as dns.LookupOptions | undefined) ?? {});

    originalLookup(hostname, ...rest, (error: NodeJS.ErrnoException | null, address?: string | dns.LookupAddress[], family?: number) => {
      if (!error || !isNeonHost(hostname) || options.family === 6) {
        callback(error, address, family);
        return;
      }

      resolver.resolve4(hostname, (resolveError, addresses) => {
        if (resolveError || addresses.length === 0) {
          callback(error);
          return;
        }
        if (options.all) {
          callback(null, addresses.map((resolved) => ({ address: resolved, family: 4 })));
        } else {
          callback(null, addresses[0], 4);
        }
      });
    });
  };

  dns.lookup = lookupWithFallback as unknown as typeof dns.lookup;
}
