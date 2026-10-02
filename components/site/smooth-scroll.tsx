"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/**
 * Site-wide smooth scrolling (Lenis).
 *
 * Lenis keeps native scrolling — it eases the real document scroll position
 * rather than translating a wrapper — so the pinned sticky hero, the header's
 * scroll listener, and `position: sticky` everywhere keep working unchanged.
 *
 * Tuned a little heavier than the library default (lerp 0.1) to match the kit's
 * "periods land like exhales": the page settles rather than stops. Touch stays
 * native — phone momentum is already good, and synced touch is the flakiest
 * part of the library.
 *
 * prefers-reduced-motion is honoured by default (respectReducedMotion): smoothing
 * switches off and anchor jumps become instant.
 */

// Clears the fixed header (96px at md+, 80px below) with a little air, matching
// the scroll-mt-28 already on in-page targets.
const ANCHOR_OFFSET = -112;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.08,
        wheelMultiplier: 0.9,
        anchors: { offset: ANCHOR_OFFSET },
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
