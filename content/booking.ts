/**
 * Booking — the one place that knows where bookings happen.
 *
 * Bookings run on Nicole's Square Appointments page, and the site links to it.
 *
 * Until 2026-11-21 that page was embedded in a frame on /book. It looked
 * right, but Square needs cookies to hold a booking together, and phones
 * (Safari by default) and most current browsers block cookies inside another
 * site's frame. So the moment a visitor pressed Add, Square jumped out to its
 * own page anyway. Linking makes that hand-off deliberate — and one tap
 * shorter. Keeping visitors on the site for the whole booking would mean
 * building the booking screens against Square's Bookings API instead.
 *
 * The merchant and location tokens in the URL are public, not secrets.
 */
export const booking = {
  provider: "Square",
  /** Every service, to choose from. */
  bookingUrl:
    "https://book.squareup.com/appointments/tx8afy4wdmiz9i/location/LCZ20MKVHF3Y5/services",
} as const;

/**
 * Square's page for one service (…/services/<id>), which opens on that
 * service ready to Add — the visitor skips finding it in the list. Square
 * keeps the chosen service in its own storage, so a link can't pre-add it.
 * IDs live on each service in content/site.ts.
 */
export function serviceBookingUrl(squareId?: string) {
  return squareId ? `${booking.bookingUrl}/${squareId}` : booking.bookingUrl;
}
