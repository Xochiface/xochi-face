"use client";

import { useLenis } from "lenis/react";
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
 *
 * `src` is null while the chosen service is still being read from the URL;
 * the frame shows its loading state and nothing else. `serviceName` labels
 * the frame when it opened on one service. Give it a `key` per service so the
 * loading state resets when the service changes.
 *
 * On large screens the frame sizes to the viewport, so it can sit sticky
 * beside the service list without running off the bottom of the screen.
 */
export function BookingEmbed({
  src,
  serviceName,
}: {
  src: string | null;
  serviceName?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [stalled, setStalled] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const lenis = useLenis();

  /**
   * Square moves focus inside its page a moment after loading, and the
   * browser scrolls our page to show the focused element — measured at 170px
   * on a desktop, in one jump, about 250ms after load. For a short window
   * after each load, undo any scroll the visitor did not make themselves.
   */
  function holdScrollAfterLoad() {
    const y = window.scrollY;
    let touched = false;
    const userMoved = () => (touched = true);
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    const onScroll = () => {
      if (touched || Math.abs(window.scrollY - y) < 2) return;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y });
    };
    inputs.forEach((type) =>
      window.addEventListener(type, userMoved, { passive: true }),
    );
    window.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(() => {
      inputs.forEach((type) => window.removeEventListener(type, userMoved));
      window.removeEventListener("scroll", onScroll);
    }, 1500);
  }

  // If the provider has not painted within a reasonable window, surface the
  // direct link rather than leaving the client watching a placeholder.
  useEffect(() => {
    if (loaded) return;
    const timer = setTimeout(() => setStalled(true), 12000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="bg-surface-raised shadow-rest overflow-hidden rounded-md border border-rule/40">
      <div className="flex items-center justify-between gap-4 border-b border-rule/40 px-6 py-5">
        <p className="label-caps text-ink shrink-0">Choose a time</p>
        <p className="label-caps text-ink-soft min-w-0 truncate">
          {serviceName ?? `Secure booking via ${booking.provider}`}
        </p>
      </div>

      <div className="relative h-[760px] lg:h-[calc(100svh-15rem)] lg:min-h-[520px]">
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

        {src ? (
          <iframe
            ref={frameRef}
            src={src}
            title={`Book a session — ${booking.provider}`}
            onLoad={() => {
              setLoaded(true);
              holdScrollAfterLoad();
            }}
            // Lets Apple Pay and Google Pay work inside the frame. Square's
            // own snippet names app.squareup.com, but that URL only redirects:
            // the page that actually loads is on book.squareup.com.
            allow="payment https://book.squareup.com"
            className="block h-full w-full border-0"
          />
        ) : null}
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
