import type { Metadata } from "next";
import Link from "next/link";

import { BorderStrip, Ornament } from "@/components/brand/ornament";
import { PENDING, services, site, voice } from "@/content/site";

export const metadata: Metadata = {
  title: "Book a session",
  description:
    "Book a lymphatic facial with Xochi Face in Austin, Texas. By appointment.",
};

const bookingReady = site.bookingUrl !== PENDING;

export default function BookPage() {
  return (
    <>
      <header className="bg-surface-sunken pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="label-caps text-ink-soft">Booking</p>
          <h1 className="text-display text-ink mt-6 max-w-3xl">
            {voice.moon}
          </h1>
          <p className="text-lead text-ink-muted mt-8 max-w-xl italic">
            {site.location}, {site.availability}. Choose your season below.
          </p>
        </div>
      </header>

      <div className="bg-surface">
        {/* Choose a session --------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.slug}
                className="bg-surface-raised shadow-rest flex flex-col rounded-md border border-rule/40 p-8"
              >
                <div className="text-honey mb-6">
                  <Ornament name={s.ornament} size={36} />
                </div>
                <p className="label-caps text-ink-soft">{s.eyebrow}</p>
                <h2 className="text-subtitle text-ink mt-3">{s.name}</h2>
                <p className="text-body text-ink-muted mt-5 flex-1 italic">
                  {s.summary}
                </p>
                <div className="mt-8 flex items-baseline justify-between border-t border-rule/40 pt-5">
                  <span className="font-display text-ink text-2xl font-[350]">
                    {s.price}
                  </span>
                  <span className="label-caps text-ink-soft">{s.duration}</span>
                </div>

                {bookingReady ? (
                  <a
                    href={site.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-caps bg-primary text-primary-foreground shadow-rest hover:shadow-lift rounded-pill duration-quick ease-exhale mt-6 block px-6 py-4 text-center transition-all hover:-translate-y-0.5"
                  >
                    Choose a time
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-describedby="booking-pending"
                    className="label-caps text-ink-soft rounded-pill mt-6 cursor-not-allowed border border-rule/50 px-6 py-4 opacity-55"
                  >
                    Choose a time
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Integration point --------------------------------------------- */}
        {!bookingReady ? (
          <section className="mx-auto max-w-3xl px-5 pb-20 md:px-10 md:pb-28">
            <div
              id="booking-pending"
              className="rounded-md border border-dashed border-rule px-8 py-10 text-center"
            >
              <div className="text-accent-sage mb-5 flex justify-center">
                <Ornament name="seed" size={30} />
              </div>
              <p className="label-caps text-ink-soft">Not yet connected</p>
              <p className="text-lead text-ink-muted mx-auto mt-5 max-w-lg italic">
                The scheduling platform hasn&rsquo;t been chosen yet. Once it
                is, these buttons open the real calendar — the layout does not
                change.
              </p>
              <p className="font-label text-ink-soft mx-auto mt-6 max-w-lg text-xs">
                Set <code className="text-ink">bookingUrl</code> in{" "}
                <code className="text-ink">content/site.ts</code> to switch this
                page over.
              </p>
            </div>
          </section>
        ) : null}

        {/* Before you come ----------------------------------------------- */}
        <section className="night bg-surface text-ink">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
            <div className="grid gap-12 md:grid-cols-2 md:gap-20">
              <div>
                <p className="label-caps text-ink-soft">Before you come</p>
                <h2 className="text-title text-ink mt-6">
                  a few small things.
                </h2>
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
                    <p className="text-body text-ink-muted mt-3 italic">
                      {body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Questions ------------------------------------------------------ */}
        <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
          <h2 className="text-title text-ink">a question first?</h2>
          <p className="text-lead text-ink-muted mx-auto mt-8 max-w-lg italic">
            If you are not sure which session is yours, read the practice — or
            write, once there is somewhere to write to.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link
              href="/practice"
              className="label-caps text-ink border-rule rounded-pill duration-quick ease-exhale hover:bg-surface-sunken border px-8 py-4 transition-colors"
            >
              The practice
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
