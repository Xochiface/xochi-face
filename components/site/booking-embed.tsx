"use client";

import { useEffect, useRef, useState } from "react";

import { Ornament } from "@/components/brand/ornament";
import { booking } from "@/content/booking";

/**
 * The booking frame.
 *
 * Holds the provider's booking flow inline so the client never leaves the site.
 * Everything outside the iframe is ours: the frame, the header, the loading
 * state, and the fallback if the provider fails to load or is blocked by the
 * client's browser (tracking-prevention settings block third-party frames more
 * often than people expect, so the escape hatch is not decorative).
 */
export function BookingEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [stalled, setStalled] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // If the provider has not painted within a reasonable window, surface the
  // direct link rather than leaving the client watching a placeholder.
  useEffect(() => {
    if (loaded) return;
    const timer = setTimeout(() => setStalled(true), 12000);
    return () => clearTimeout(timer);
  }, [loaded]);

  if (!booking.embedUrl) return null;

  return (
    <div className="bg-surface-raised shadow-rest overflow-hidden rounded-md border border-rule/40">
      <div className="flex items-center justify-between gap-4 border-b border-rule/40 px-6 py-5">
        <p className="label-caps text-ink">Choose a time</p>
        <p className="label-caps text-ink-soft hidden sm:block">
          Secure booking via {booking.provider}
        </p>
      </div>

      <div className="relative" style={{ minHeight: booking.minHeight ?? 720 }}>
        {!loaded ? (
          <div className="bg-surface-raised absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center">
            <span
              className={`text-accent-honey ${stalled ? "" : "animate-pulse"}`}
            >
              <Ornament name="marigold" size={40} />
            </span>

            {stalled ? (
              <>
                <p className="text-body text-ink-muted max-w-sm italic">
                  The calendar is taking longer than it should. Your browser may
                  be blocking it.
                </p>
                <a
                  href={booking.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps bg-primary text-primary-foreground shadow-rest hover:shadow-lift rounded-pill duration-quick ease-exhale px-8 py-4 transition-all hover:-translate-y-0.5"
                >
                  Open booking in a new tab
                </a>
              </>
            ) : (
              <p className="font-poetic text-ink-soft text-xl italic">
                opening the calendar
              </p>
            )}
          </div>
        ) : null}

        <iframe
          ref={frameRef}
          src={booking.embedUrl}
          title={`Book a session — ${booking.provider}`}
          onLoad={() => setLoaded(true)}
          allow="payment"
          loading="lazy"
          className="h-full w-full border-0"
          style={{ minHeight: booking.minHeight ?? 720 }}
        />
      </div>

      <div className="border-t border-rule/40 px-6 py-4 text-center">
        <a
          href={booking.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="label-caps text-ink-soft hover:text-ink duration-quick ease-exhale transition-colors"
        >
          Having trouble? Open booking in a new tab
        </a>
      </div>
    </div>
  );
}
