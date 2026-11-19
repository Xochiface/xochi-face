import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { BorderStrip, Ornament } from "@/components/brand/ornament";
import { AddOnRow } from "@/components/site/add-on-row";
import {
  BookingCalendar,
  ChooseService,
} from "@/components/site/booking-calendar";
import { BookingEmbed } from "@/components/site/booking-embed";
import {
  booking,
  bookingInline,
  bookingReady,
  CALENDAR_ID,
} from "@/content/booking";
import {
  addOns,
  giftCertificate,
  PENDING,
  services,
  site,
  voice,
} from "@/content/site";

export const metadata: Metadata = {
  title: "Book a session",
  description:
    "Lymphatic facials in Austin, Texas — the Xochi Signature Facial, The Goddess Facial, and a new client special. Choose a facial and book a time.",
};

const primaryButton =
  "label-caps bg-primary text-primary-foreground shadow-rest hover:shadow-lift rounded-pill duration-quick ease-exhale inline-block px-8 py-4 text-center transition-all hover:-translate-y-0.5";

/**
 * The one booking page. Every facial is described once, here, beside the
 * calendar: choosing one opens Square on that service. On large screens the
 * calendar stays in view while the list scrolls past it.
 */
export default function BookPage() {
  return (
    <>
      <header className="bg-surface-sunken pt-40 pb-16 md:pt-52 md:pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="label-caps text-ink-soft">Book a session</p>
          <h1 className="text-display text-ink mt-6 max-w-3xl">
            {voice.slowDown}
          </h1>
          <p className="text-lead text-ink-muted mt-8 max-w-xl italic">
            {site.location}, {site.availability}. Choose a facial, then pick a
            time in the calendar.
          </p>
        </div>
      </header>

      <div className="bg-surface">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16 xl:gap-24">
          {/* The facials ------------------------------------------------- */}
          <div className="min-w-0">
            {services.map((s, i) => (
              <article
                key={s.slug}
                id={s.slug}
                className={`scroll-mt-28 ${i > 0 ? "mt-16 border-t border-rule/40 pt-16" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-honey">
                    <Ornament name={s.ornament} size={32} />
                  </span>
                  <p className="label-caps text-ink-soft">{s.eyebrow}</p>
                </div>

                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
                  <h2 className="text-title text-ink">{s.name}</h2>
                  <p className="flex items-baseline gap-5">
                    <span className="font-display text-ink text-3xl font-[350]">
                      {s.price}
                    </span>
                    <span className="label-caps text-ink-soft">
                      {s.duration}
                    </span>
                  </p>
                </div>

                <p className="text-lead text-ink-muted mt-6 italic">
                  {s.summary}
                </p>
                {s.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-body text-ink-muted mt-5 italic"
                  >
                    {paragraph}
                  </p>
                ))}

                <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {s.includes.map((item) => (
                    <li
                      key={item}
                      className="text-body text-ink flex items-start gap-3"
                    >
                      <span className="text-accent-sage mt-1">
                        <Ornament name="sprout" size={16} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  {bookingInline ? (
                    <ChooseService slug={s.slug} className={primaryButton}>
                      Book {s.name}
                    </ChooseService>
                  ) : bookingReady ? (
                    <a
                      href={booking.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={primaryButton}
                    >
                      Book {s.name}
                    </a>
                  ) : null}
                </div>
              </article>
            ))}

            <div className="mt-16 border-t border-rule/40 pt-16">
              <p className="label-caps text-ink-soft mb-8">Add to any facial</p>
              <div className="space-y-6">
                {addOns.map((a) => (
                  <AddOnRow key={a.slug} addOn={a} />
                ))}
              </div>
              <p className="text-body text-ink-muted mt-6 italic">
                Add it in the calendar, after you choose your facial.
              </p>
            </div>

            <div className="mt-16 flex items-start gap-5 rounded-md border border-dashed border-rule p-8">
              <span className="text-accent-sage">
                <Ornament name="offering" size={26} />
              </span>
              <div>
                <p className="font-display text-ink text-xl font-[350]">
                  {giftCertificate.title}
                </p>
                <p className="text-body text-ink-muted mt-2 italic">
                  {giftCertificate.body}
                </p>
              </div>
            </div>
          </div>

          {/* The calendar ------------------------------------------------ */}
          {bookingInline ? (
            <div
              id={CALENDAR_ID}
              className="min-w-0 scroll-mt-28 lg:sticky lg:top-28 lg:self-start"
            >
              <Suspense fallback={<BookingEmbed src={null} />}>
                <BookingCalendar />
              </Suspense>
            </div>
          ) : !bookingReady ? (
            <div className="rounded-md border border-dashed border-rule px-8 py-10 text-center lg:self-start">
              <p className="label-caps text-ink-soft">Not yet connected</p>
              <p className="text-body text-ink-muted mt-4 italic">
                Set <code className="text-ink">mode</code> and{" "}
                <code className="text-ink">embedUrl</code> in{" "}
                <code className="text-ink">content/booking.ts</code>.
              </p>
            </div>
          ) : null}
        </div>

        {/* Before you come ------------------------------------------------ */}
        <section className="night bg-surface text-ink">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
            <div className="grid gap-12 md:grid-cols-2 md:gap-20">
              <div>
                <p className="label-caps text-ink-soft">Before you come</p>
                <h2 className="text-title text-ink mt-6">a few small things.</h2>
                <div className="text-accent-honey/45 mt-10 max-w-xs">
                  <BorderStrip name="floral" height={14} />
                </div>
              </div>

              <ul className="space-y-8">
                {[
                  [
                    "Come with a clean face if you can",
                    "If not, we cleanse at the table. It costs us five minutes and nothing else.",
                  ],
                  [
                    "The work starts below the jaw",
                    "Neck, trapezius, décolleté — that is where the face actually drains. An open or loose neckline helps.",
                  ],
                  [
                    "Give yourself somewhere soft to go after",
                    "Lymph keeps moving for a while. Most people would rather not go straight into a meeting.",
                  ],
                  [
                    "Tell us what your face is holding",
                    "Jaw, brow, cheekbones. Naming it plainly helps more than you would think.",
                  ],
                ].map(([title, body]) => (
                  <li
                    key={title}
                    className="border-b border-rule/25 pb-8 last:border-b-0"
                  >
                    <h3 className="font-display text-ink text-xl font-[350]">
                      {title}
                    </h3>
                    <p className="text-body text-ink-muted mt-3 italic">{body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Questions ------------------------------------------------------- */}
        <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
          <h2 className="text-title text-ink">a question first?</h2>
          <p className="text-lead text-ink-muted mx-auto mt-8 max-w-lg italic">
            If you are not sure which facial is yours, read about the practice —
            or come find us.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link
              href="/about"
              className="label-caps text-ink border-rule rounded-pill duration-quick ease-exhale hover:bg-surface-sunken border px-8 py-4 transition-colors"
            >
              About Xochi
            </Link>
            {site.email !== PENDING ? (
              <a
                href={`mailto:${site.email}`}
                className="label-caps bg-primary text-primary-foreground rounded-pill px-8 py-4"
              >
                Write to us
              </a>
            ) : (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps text-ink border-rule rounded-pill duration-quick ease-exhale hover:bg-surface-sunken border px-8 py-4 transition-colors"
              >
                {site.instagramHandle}
              </a>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
