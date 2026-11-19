import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BorderStrip, Ornament } from "@/components/brand/ornament";
import { photoAttrs, photos } from "@/content/photos";
import {
  benefits,
  letter,
  philosophy,
  site,
  techniques,
  voice,
} from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nicole and the practice behind Xochi Face — manual lymphatic drainage, Russian facial sculpting, and a long, quiet moment with yourself. Austin, Texas.",
};

/**
 * Who Nicole is and what the work is: her philosophy, what it does, how it is
 * done, and where to follow along. Services and prices live on /book; this
 * page ends by sending people there.
 */
export default function AboutPage() {
  return (
    <>
      <header className="bg-surface-sunken pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <p className="label-caps text-ink-soft">About</p>
          <h1 className="text-display text-ink mt-6 max-w-3xl">
            {voice.softness}
          </h1>
          <p className="text-lead text-ink-muted mt-8 max-w-2xl italic">
            {philosophy.welcome}
          </p>
        </div>
      </header>

      <div className="bg-surface">
        {/* Nicole ---------------------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-20">
            <div className="shadow-rest relative overflow-hidden rounded-md">
              <Image
                {...photoAttrs("founder")}
                src={photos.founder.src}
                alt={photos.founder.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 38vw, 90vw"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="label-caps text-ink-soft">{letter.role}</p>
              <h2 className="text-title text-ink mt-5">Nicole.</h2>
              <p className="text-lead text-ink mt-8 italic">
                {philosophy.why}
              </p>
              <p className="text-body text-ink-muted mt-6 italic">
                {philosophy.balance}
              </p>
              <p className="text-body text-ink-muted mt-5 italic">
                {philosophy.essence}
              </p>
              <Link
                href="/letter"
                className="label-caps text-ink-muted hover:text-ink duration-quick ease-exhale group mt-10 inline-flex items-center gap-3 transition-colors"
              >
                Read her letter
                <span className="duration-quick ease-exhale inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* What the work does — Nicole's five, in her own order ----------- */}
        <section className="bg-surface-sunken border-t border-rule/40">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
            <header className="mb-16 max-w-2xl">
              <p className="label-caps text-ink-soft">What it does</p>
              <h2 className="text-title text-ink mt-5">{voice.tend}</h2>
            </header>

            <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <li key={b.title}>
                  <span className="text-accent-sage">
                    <Ornament name={b.ornament} size={30} />
                  </span>
                  <h3 className="font-display text-ink mt-5 text-xl font-[350]">
                    {b.title}
                  </h3>
                  <p className="text-body text-ink-muted mt-3 italic">
                    {b.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The techniques -------------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <header className="mb-16 max-w-2xl">
            <p className="label-caps text-ink-soft">The techniques</p>
            <h2 className="text-title text-ink mt-5">
              slower than it sounds. nothing is forced.
            </h2>
          </header>

          <ul className="grid gap-px overflow-hidden rounded-md border border-rule/40 bg-rule/40 sm:grid-cols-2 lg:grid-cols-3">
            {techniques.map((t) => (
              <li key={t.name} className="bg-surface p-8">
                <span className="text-honey">
                  <Ornament name={t.ornament} size={28} />
                </span>
                <h3 className="font-display text-ink mt-5 text-xl leading-snug font-[350]">
                  {t.name}
                </h3>
                <p className="text-body text-ink-muted mt-3 italic">{t.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* What happens at the table -------------------------------------- */}
        <section className="night bg-surface text-ink">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-32">
            <div className="shadow-lift relative overflow-hidden rounded-md">
              <Image
                {...photoAttrs("stillness")}
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
                Then the sculpting, and the scalp, arms and hands — because the
                face does not hold tension in isolation. It is slower than it
                sounds. Nothing is forced.
              </p>

              <div className="text-accent-honey/50 mt-12 max-w-xs">
                <BorderStrip name="stepped-fret" height={16} />
              </div>
            </div>
          </div>
        </section>

        {/* Follow along ---------------------------------------------------- */}
        <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
          <div className="text-honey flex justify-center">
            <Ornament name="hummingbird" size={40} />
          </div>
          <p className="label-caps text-ink-soft mt-8">On Instagram</p>
          <h2 className="text-title text-ink mt-5">follow along.</h2>
          <p className="text-lead text-ink-muted mx-auto mt-6 max-w-lg italic">
            Recent work and notes from the table, as Nicole shares them.
          </p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps text-ink border-rule rounded-pill duration-quick ease-exhale hover:bg-surface-sunken mt-10 inline-block border px-8 py-4 transition-colors"
          >
            {site.instagramHandle}
          </a>
        </section>

        {/* Close ---------------------------------------------------------- */}
        <section className="bg-surface-sunken border-t border-rule/40">
          <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
            <h2 className="text-title text-ink">{voice.home}</h2>
            <p className="text-lead text-ink-muted mx-auto mt-8 max-w-lg italic">
              {site.location}, {site.availability}.
            </p>
            <Link
              href="/book"
              className="label-caps bg-primary text-primary-foreground shadow-rest hover:shadow-lift rounded-pill duration-quick ease-exhale mt-10 inline-block px-10 py-5 transition-all hover:-translate-y-0.5"
            >
              Book a session
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
