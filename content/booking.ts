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
  // Currently live: the Google Appointments page linked from her Instagram bio.
  // To move to Square: set mode "embed", provider "Square", and paste the
  // booking-site URL into both bookingUrl and embedUrl. Nothing else changes.
  mode: "link",
  provider: "Google Appointments",
  bookingUrl: "https://calendar.app.google/rpzrynpBtDiMooha6",
  minHeight: 720,
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
