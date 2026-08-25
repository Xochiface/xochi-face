import type { Metadata } from "next";
import { Cormorant_Garamond, Fraunces, Outfit } from "next/font/google";
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
  title: {
    default: "Xochi Face — Lymphatic Facials in Austin, Texas",
    template: "%s · Xochi Face",
  },
  description:
    "Lymphatic drainage, buccal release, gua sha — and a long, quiet moment with yourself. By appointment in Austin, Texas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${cormorant.variable} ${outfit.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
