import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PortraitMark } from "@/components/brand/logo";
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
    "Nicole, her letter, and the practice behind Xochi Face — manual lymphatic drainage, Russian facial sculpting, and a long, quiet moment with yourself. Austin, Texas.",
};

/**
 * Who Nicole is and what the work is: her philosophy, her letter, what the
 * work does, how it is done, and where to follow along. Services and prices
 * live on /book; this page ends by sending people there.
 *
 * The letter was its own page until 2026-11-19; /letter now redirects to
 * #letter here (next.config.ts).
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
              <h2 className="text-title text-ink">Nicole.</h2>
              <p className="label-caps text-ink-soft mt-3">
                {site.credential} · {site.location}
              </p>
              <p className="text-lead text-ink mt-8 italic">
                {philosophy.why}
              </p>
              <p className="text-body text-ink-muted mt-6 italic">
                {philosophy.balance}
              </p>
              <p className="text-body text-ink-muted mt-5 italic">
                {philosophy.essence}
              </p>
            </div>
          </div>
        </section>

        {/* The letter — set like the kit's long-form comp ------------------ */}
        <article
          id="letter"
          className="bg-surface-sunken scroll-mt-20 border-t border-rule/40"
        >
          <header className="mx-auto max-w-3xl px-5 pt-24 pb-16 text-center md:px-10 md:pt-32">
            <p className="label-caps text-ink-soft">
              {letter.eyebrow} · {letter.season}
            </p>

            <div className="text-ink my-10 flex justify-center">
              <PortraitMark size={88} />
            </div>

            <h2 className="text-display text-ink">
              a letter <em className="font-poetic font-light">from</em> Nicole.
            </h2>

            <div className="text-honey mt-12">
              <BorderStrip name="marigold-chain" height={18} />
            </div>
          </header>

          <div className="mx-auto max-w-2xl px-5 pb-24 md:px-10 md:pb-32">
            <p className="text-lead text-ink first-letter:font-display first-letter:text-ink first-letter:mr-3 first-letter:float-left first-letter:text-[5.5rem] first-letter:leading-[0.78] first-letter:font-[350] italic">
              {letter.paragraphs[0]}
            </p>

            {letter.paragraphs.slice(1).map((p) => (
              <p key={p} className="text-lead text-ink-muted mt-8 italic">
                {p}
              </p>
            ))}

            <figure className="border-y border-rule/50 my-16 py-12 text-center">
              <p className="text-quote font-poetic text-ink font-light italic">
                {letter.pullQuote}
              </p>
            </figure>

            <p className="text-lead text-ink-muted italic">{letter.closing[0]}</p>

            <p className="text-lead text-ink-muted mt-16 italic">
              {letter.closing[1]}
            </p>

            <footer className="mt-16">
              <p className="font-poetic text-ink-soft text-xl italic">
                {letter.valediction}
              </p>
              <p className="font-display text-ink mt-3 text-5xl font-[350] italic">
                {letter.signature}
              </p>
              <p className="label-caps text-ink-soft mt-8">{letter.role}</p>
            </footer>
          </div>
        </article>

        {/* What the work does — Nicole's five, in her own order ----------- */}
        <section className="border-t border-rule/40">
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
        <section className="bg-surface-sunken border-t border-rule/40">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
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
          </div>
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
