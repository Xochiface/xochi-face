import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

/**
 * This computer's own local-network IPv4 addresses, read each time the dev
 * server starts. Listing them in allowedDevOrigins lets a phone on the same
 * Wi-Fi (or this computer's iPhone hotspot) load the dev site — needed for
 * uploading photos straight from the phone in edit mode (see EDITING.md).
 *
 * Read at startup rather than hardcoded because hotspot and Wi-Fi addresses
 * change between connections. Only this machine's own addresses are trusted;
 * the setting has no effect on production builds.
 */
function localAddresses(): string[] {
  return Object.values(networkInterfaces())
    .flat()
    .filter((i): i is NonNullable<typeof i> => !!i && i.family === "IPv4" && !i.internal)
    .map((i) => i.address);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: localAddresses(),

  /** /practice became /about on 2026-11-18; services moved to /book. */
  async redirects() {
    return [{ source: "/practice", destination: "/about", permanent: true }];
  },
};

export default nextConfig;
