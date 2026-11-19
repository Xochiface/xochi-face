"use client";

import { useLenis } from "lenis/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { BookingEmbed } from "@/components/site/booking-embed";
import { booking, CALENDAR_ID, serviceBookingUrl } from "@/content/booking";
import { services } from "@/content/site";

/** Room left above the calendar for the fixed header (matches scroll-mt-28). */
const HEADER_CLEARANCE = 112;

/**
 * The Square calendar, opened on the service named in the URL (?service=…).
 *
 * The URL holds the choice so every way in agrees: a home-page card links
 * straight here with the service set, and "Book this facial" on the Book page
 * just changes it. Must sit inside a <Suspense> — reading the URL on the client
 * is what lets the rest of the page stay static.
 */
export function BookingCalendar() {
  const slug = useSearchParams().get("service");
  const service = services.find((s) => s.slug === slug);
  const lenis = useLenis();

  // Arriving with a service chosen (a home-page card links to ?service=x):
  // a phone lands on the calendar, below the list. A desktop shows the
  // calendar beside the list anyway, so it lands on the chosen facial.
  // Deliberately not a #hash link — the browser's own jump to it fought this.
  useEffect(() => {
    if (!service || !lenis) return;
    const frame = requestAnimationFrame(() => {
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const target = document.getElementById(
        wide ? service.slug : CALENDAR_ID,
      );
      if (!target) return;
      const y =
        window.scrollY + target.getBoundingClientRect().top - HEADER_CLEARANCE;
      lenis.scrollTo(y, { immediate: true });
    });
    return () => cancelAnimationFrame(frame);
    // Only on arrival: later choices on this page scroll themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis]);
  const src = booking.embedUrl
    ? serviceBookingUrl(booking.embedUrl, service?.squareId)
    : null;

  return (
    <BookingEmbed key={src ?? "none"} src={src} serviceName={service?.name} />
  );
}

/**
 * Points the calendar at one service. On a phone the calendar sits below the
 * list, so this also scrolls to it; on a desktop it is already in view beside
 * the list, and the page stays where it is.
 */
export function ChooseService({
  slug,
  children,
  className,
}: {
  slug: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const lenis = useLenis();

  return (
    <a
      // No #hash here: Lenis scrolls to any same-page anchor it sees clicked,
      // which would yank a desktop page down to the (already visible) calendar.
      href={`${pathname}?service=${slug}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        // history.replaceState rather than router.replace: Next keeps
        // useSearchParams in step with it, and it is not a navigation, so
        // Lenis (stopInertiaOnNavigate) does not cut the scroll below short.
        window.history.replaceState(null, "", `${pathname}?service=${slug}`);

        const calendar = document.getElementById(CALENDAR_ID);
        if (!calendar) return;
        const { top, bottom } = calendar.getBoundingClientRect();
        if (top >= 0 && bottom <= window.innerHeight) return;
        // An absolute position rather than the element: Lenis resolves an
        // element against its own idea of the scroll position, which lags if
        // anything has moved the page without it.
        const y = window.scrollY + top - HEADER_CLEARANCE;
        if (lenis) lenis.scrollTo(y);
        else window.scrollTo({ top: y });
      }}
    >
      {children}
    </a>
  );
}
