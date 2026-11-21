import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

import IMAGE_WIDTHS from "./lib/image-widths.json";

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

const DEFAULT_EXTENSIONS = ["tsx", "ts", "jsx", "js"];

/**
 * Two shapes of the same site.
 *
 * Development (`npm run dev`, on this computer): the full Next.js server, with
 * edit mode's save and upload routes. Those routes are named route.dev.ts and
 * only exist here, via pageExtensions.
 *
 * Production (`npm run build`): a static export to out/, hosted on Cloudflare
 * as plain files. Everything a static host can't do is handled at build time
 * or by Cloudflare instead —
 *   - photos: resized ahead of time by scripts/size-images.mjs, picked by
 *     lib/image-loader.ts (there is no image server to resize on request);
 *   - redirects: public/_redirects, which Cloudflare reads;
 *   - edit mode's routes: left out entirely (they write to this computer's
 *     disk, which a host can't do — on the live site Save downloads a file).
 */
export default function config(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      allowedDevOrigins: localAddresses(),
      pageExtensions: [...DEFAULT_EXTENSIONS, "dev.ts"],

      // Mirrors public/_redirects, which serves the same purpose live.
      async redirects() {
        return [
          { source: "/practice", destination: "/about", permanent: true },
          { source: "/letter", destination: "/about#letter", permanent: true },
        ];
      },
    };
  }

  return {
    output: "export",
    pageExtensions: DEFAULT_EXTENSIONS,
    images: {
      loader: "custom",
      loaderFile: "./lib/image-loader.ts",
      deviceSizes: IMAGE_WIDTHS.device,
      imageSizes: IMAGE_WIDTHS.image,
    },
  };
}
