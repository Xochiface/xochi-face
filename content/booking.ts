/**
 * Booking configuration — the single owner of how booking works.
 *
 * Deliberately provider-agnostic. Switching from Google Appointments to Square,
 * Cal.com, or anything else is a change to this file only: no component edits,
 * no layout changes. `/book` reads `mode` and renders accordingly.
 *
 *   "link"    — send the client out to the provider's own page. Works today,
 *               but the client leaves the site and the provider's UI takes over.
 *   "embed"   — the provider's booking flow runs inline, inside a frame styled
 *               to the brand. The client never leaves.
 *   "pending" — no provider connected; the page renders a visible placeholder
 *               rather than a dead button.
 *
 * An honest note on "embed": the iframe's *interior* is the provider's markup on
 * their origin, so we cannot restyle it from here. What we control is everything
 * around it — the frame, the surrounding composition, the selection step, the
 * loading state, and the fact that the client stays on the site. That is most of
 * the perceived difference, but it is not all of it. Owning the interior too
 * means building against the provider's API instead (see README notes).
 */
export type BookingMode = "link" | "embed" | "pending";

export type BookingConfig = {
  mode: BookingMode;
  /** Display name, shown in the reassurance line beneath the frame. */
  provider: string;
  /** Always set when known — the embed falls back to this if it cannot load. */
  bookingUrl: string;
  /** iframe src. Often differs from bookingUrl; check the provider's embed docs. */
  embedUrl?: string;
  /** Starting height in px. The frame grows on larger viewports. */
  minHeight?: number;
};

export const booking: BookingConfig = {
  mode: "embed",
  provider: "Square",

  /**
   * Square gives merchants a <script> snippet to paste. We deliberately do not
   * use it. Reading that script shows it does exactly one useful thing — insert
   * an iframe pointing at the widget URL below — plus some defensive handling
   * for Wix and Weebly page editors that does not apply to us. Embedding the
   * iframe ourselves avoids running third-party JavaScript on the site, and
   * lets us own the loading state, the height, and the fallback.
   *
   * Verified: the widget sends no X-Frame-Options, and its enforced CSP sets no
   * frame-ancestors, so it embeds cleanly. (Google Appointments sends
   * X-Frame-Options SAMEORIGIN and cannot be embedded at all — that is why we
   * moved.)
   *
   * Both IDs are the public merchant and location tokens from her embed
   * snippet, not secrets.
   */
  bookingUrl:
    "https://book.squareup.com/appointments/tx8afy4wdmiz9i/location/LCZ20MKVHF3Y5/services",
  embedUrl:
    "https://app.squareup.com/appointments/buyer/widget/tx8afy4wdmiz9i/LCZ20MKVHF3Y5",
  minHeight: 760,
};

export const bookingReady = booking.mode !== "pending";
export const bookingInline = booking.mode === "embed" && Boolean(booking.embedUrl);

/** The three steps shown above the booking frame. */
export const bookingSteps = [
  {
    ordinal: "01",
    title: "Choose your session",
    body: "The full hour, a shorter visit, or your first time at the table.",
    ornament: "seed",
  },
  {
    ordinal: "02",
    title: "Pick a time",
    body: "Availability is live. You will get a confirmation straight away.",
    ornament: "sprout",
  },
  {
    ordinal: "03",
    title: "Come as you are",
    body: "A clean face helps but is not required. We cleanse at the table.",
    ornament: "xochitl",
  },
] as const;
