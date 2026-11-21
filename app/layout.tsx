import type { Metadata } from "next";
import { Cormorant_Garamond, Fraunces, Outfit } from "next/font/google";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import "./globals.css";

/**
 * The three faces of the Xochi Face brand kit.
 *
 * All three are variable fonts, so the kit's exact weights are reachable —
 * notably Fraunces at Light/350, which is not a static Google weight.
 * Fraunces declares the `opsz` axis so display type can open up its optical
 * size; see the h1/h2/h3 rule in globals.css.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  // Share previews and canonical links need absolute URLs.
  metadataBase: new URL("https://xochiface.com"),
  title: {
    default: "Xochi Face — Lymphatic Facials in Austin, Texas",
    template: "%s · Xochi Face",
  },
  description:
    "Manual lymphatic drainage and facial sculpting — and a long, quiet moment with yourself. By appointment in Austin, Texas.",
  openGraph: {
    type: "website",
    siteName: "Xochi Face",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${cormorant.variable} ${outfit.variable}`}
    >
      {/* Lenis sets html/body height:auto, so min-height is pinned to the
          viewport (svh) rather than a percentage of an auto-height parent. */}
      <body className="flex min-h-svh flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
