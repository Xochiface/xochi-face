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
};

export const booking: BookingConfig = {
  mode: "embed",
  provider: "Square",

  /**
   * Square gives merchants a <script> snippet that inserts an iframe pointing
   * at a widget URL (app.squareup.com/appointments/buyer/widget/…). Following
   * that URL shows it only redirects, twice, to the public booking page below.
   * So we frame the booking page directly: no third-party script on the site,
   * two fewer redirects, and — the reason it matters — the booking page
   * accepts a service in the path (…/services/<id>), opening the calendar on
   * that service. The widget URL does not; it 404s with a service appended.
   *
   * Verified 2026-11-18: the booking page sends no X-Frame-Options and no
   * frame-ancestors, so it embeds cleanly. (Google Appointments sends
   * X-Frame-Options SAMEORIGIN and cannot be embedded at all — that is why we
   * moved.)
   *
   * The merchant and location tokens are public, not secrets.
   */
  bookingUrl:
    "https://book.squareup.com/appointments/tx8afy4wdmiz9i/location/LCZ20MKVHF3Y5/services",
  embedUrl:
    "https://book.squareup.com/appointments/tx8afy4wdmiz9i/location/LCZ20MKVHF3Y5/services",
};

/**
 * The id the calendar sits under on /book, and the anchor service links point
 * at. Lives here, not beside the calendar component: a value exported from a
 * "use client" file reaches server components as a reference, not a string.
 */
export const CALENDAR_ID = "choose-a-time";

export const bookingReady = booking.mode !== "pending";
export const bookingInline = booking.mode === "embed" && Boolean(booking.embedUrl);

/**
 * The booking page opened on one service. Square keeps the chosen service in
 * its own storage, not the URL, so this is as far as a link can go: the
 * client lands on that service and presses Add, rather than finding it in the
 * list first.
 */
export function serviceBookingUrl(base: string, squareId?: string) {
  return squareId ? `${base}/${squareId}` : base;
}
