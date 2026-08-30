import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BorderStrip, Ornament } from "@/components/brand/ornament";
import { photos } from "@/content/photos";
import { services, site, voice } from "@/content/site";

export const metadata: Metadata = {
  title: "The practice",
  description:
    "Lymphatic drainage, buccal release, and gua sha. Three ways to come to the table, in Austin, Texas.",
};

export default function PracticePage() {
  return (
    <>
      <header className="bg-surface-sunken pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="label-caps text-ink-soft">The practice</p>
          <h1 className="text-display text-ink mt-6 max-w-3xl">
            {voice.softness}
          </h1>
          <p className="text-lead text-ink-muted mt-8 max-w-xl italic">
            Three ways to come to the table. The whole arc, a shorter season, or
            a rhythm you keep.
          </p>
        </div>
      </header>

      <div className="bg-surface">
        {services.map((s, i) => (
          <section
            key={s.slug}
            id={s.slug}
            className={`scroll-mt-28 border-t border-rule/40 ${
              i % 2 === 1 ? "bg-surface-sunken" : ""
            }`}
          >
            <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-20 md:px-10 md:py-28">
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="text-honey mb-6">
                  <Ornament name={s.ornament} size={44} />
                </div>
                <p className="label-caps text-ink-soft">{s.eyebrow}</p>
                <h2 className="text-title text-ink mt-4">{s.name}</h2>

                <div className="mt-8 flex items-baseline gap-6">
                  <span className="font-display text-ink text-3xl font-[350]">
                    {s.price}
                  </span>
                  <span className="label-caps text-ink-soft">{s.duration}</span>
                </div>

                <Link
                  href="/book"
                  className="label-caps bg-primary text-primary-foreground shadow-rest hover:shadow-lift rounded-pill duration-quick ease-exhale mt-10 inline-block px-8 py-4 transition-all hover:-translate-y-0.5"
                >
                  Book {s.name}
                </Link>
              </div>

              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="text-lead text-ink-muted italic">{s.summary}</p>
                <p className="text-body text-ink-muted mt-6 italic">{s.body}</p>

                <ul className="mt-10 space-y-4 border-t border-rule/40 pt-8">
                  {s.includes.map((item) => (
                    <li
                      key={item}
                      className="text-body text-ink flex items-center gap-4"
                    >
                      <span className="text-accent-sage">
                        <Ornament name="sprout" size={18} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}

        {/* What happens at the table -------------------------------------- */}
        <section className="night bg-surface text-ink">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-32">
            <div className="shadow-lift relative overflow-hidden rounded-md">
              <Image
                src={photos.stillness.src}
                alt={photos.stillness.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 44vw, 90vw"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="label-caps text-ink-soft">What happens</p>
              <h2 className="text-title text-ink mt-6">{voice.table}</h2>
              <p className="text-body text-ink-muted mt-8 italic">
                We begin at the neck and collarbone, because the face drains
                downward and nothing moves until that door is open. Then the
                jaw, the cheeks, the small muscles around the eyes.
              </p>
              <p className="text-body text-ink-muted mt-5 italic">
                Buccal release works from inside the mouth, with gloves, where
                the jaw holds what it has been holding. It is slower than it
                sounds. Nothing is forced.
              </p>

              <div className="text-accent-honey/50 mt-12 max-w-xs">
                <BorderStrip name="stepped-fret" height={16} />
              </div>
            </div>
          </div>
        </section>

        {/* Close ---------------------------------------------------------- */}
        <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
          <h2 className="text-title text-ink">{voice.moon}</h2>
          <p className="text-lead text-ink-muted mx-auto mt-8 max-w-lg italic">
            {site.location}, {site.availability}.
          </p>
          <Link
            href="/book"
            className="label-caps bg-primary text-primary-foreground shadow-rest hover:shadow-lift rounded-pill duration-quick ease-exhale mt-10 inline-block px-10 py-5 transition-all hover:-translate-y-0.5"
          >
            Book a session
          </Link>
        </section>
      </div>
    </>
  );
}
