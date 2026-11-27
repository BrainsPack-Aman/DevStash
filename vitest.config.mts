import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests cover server actions and utilities, so they run in Node.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
