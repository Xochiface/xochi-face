import Image from "next/image";
import Link from "next/link";

import { PortraitMark } from "@/components/brand/logo";
import { BorderStrip, Ornament } from "@/components/brand/ornament";
import { photos } from "@/content/photos";
import {
  anatomy,
  etymology,
  letter,
  philosophy,
  services,
  site,
  voice,
} from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — pinned. Everything below scrolls up over it.               */}
      {/* ---------------------------------------------------------------- */}
      <section className="night bg-surface text-ink sticky top-0 h-svh overflow-hidden">
        {/*
          The photograph is a 3:4 portrait. Stretched across a landscape
          viewport it becomes an extreme macro — a nose at two feet wide — so on
          desktop it takes the right half only, where the panel ratio is close
          to the source and the crop stays gentle. On mobile the viewport is
          already portrait, so it runs full-bleed behind the type.
        */}
        <div className="absolute inset-0 md:left-[56%]">
          <Image
            src={photos.hero.src}
            alt={photos.hero.alt}
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-[62%_center]"
          />
          {/* Mobile: type sits over the image, so it needs a real scrim. */}
          <div
            aria-hidden="true"
            className="from-sienna-900 via-sienna-900/55 to-sienna-900/20 absolute inset-0 bg-gradient-to-t md:hidden"
          />
          {/* Desktop: only feather the left edge into the sienna panel. */}
          <div
            aria-hidden="true"
            className="from-sienna-900 absolute inset-0 hidden bg-gradient-to-r via-transparent to-transparent md:block"
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-5 pb-16 md:justify-center md:px-10 md:pb-0">
          <div className="max-w-[38rem]">
            <PortraitMark size={64} className="mb-8 md:mb-10" />
            <p className="eyebrow-caps text-ink-muted">
              {site.practice} · {site.location}
            </p>
            <h1 className="text-display text-ink mt-6">{voice.bloom}</h1>
            <p className="text-lead text-ink-muted mt-8 max-w-xl italic">
              Manual lymphatic drainage and facial sculpting — and a long, quiet
              moment with yourself.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/book"
                className="label-caps bg-primary text-primary-foreground shadow-rest hover:shadow-lift rounded-pill duration-quick ease-exhale px-8 py-4 transition-all hover:-translate-y-0.5"
              >
                Book a session
              </Link>
              <Link
                href="/practice"
                className="label-caps text-ink border-rule rounded-pill duration-quick ease-exhale hover:bg-surface-raised border px-8 py-4 transition-colors"
              >
                The practice
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Everything below rides over the pinned hero. */}
      <div className="bg-surface relative z-10">
        {/* -------------------------------------------------------------- */}
        {/* The name                                                        */}
        {/* -------------------------------------------------------------- */}
        <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-36">
          <p className="label-caps text-ink-soft">The name</p>
          <p className="font-display text-ink mt-8 text-4xl font-[350] md:text-5xl">
            {etymology.word}
          </p>
          <p className="font-label text-ink-soft mt-4 text-sm tracking-widest">
            {etymology.pronunciation} · {etymology.language}
          </p>
          <h2 className="text-title text-ink mt-10">{etymology.meaning}</h2>
          <p className="text-lead text-ink-muted mx-auto mt-8 max-w-2xl italic">
            {philosophy.mission}
          </p>

          <div className="text-rule mx-auto mt-16 max-w-xs">
            <BorderStrip name="floral" height={14} />
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* The thesis                                                      */}
        {/* -------------------------------------------------------------- */}
        <section className="bg-surface-sunken">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-36">
            <div className="shadow-rest relative overflow-hidden rounded-md">
              <Image
                src={photos.stillLife.src}
                alt={photos.stillLife.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 44vw, 90vw"
                className="h-full w-full object-cover"
              />
            </div>

            <blockquote>
              <p className="label-caps text-ink-soft">From the table</p>
              <p className="text-quote font-poetic text-ink mt-8 font-light italic">
                {voice.thesis}
              </p>
              <footer className="label-caps text-ink-soft mt-10">
                — Nicole, founder
              </footer>
            </blockquote>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* The practice — three services                                   */}
        {/* -------------------------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
          <header className="mb-16 max-w-2xl">
            <p className="label-caps text-ink-soft">The practice</p>
            <h2 className="text-title text-ink mt-5">{voice.returning}</h2>
            <p className="text-lead text-ink-muted mt-6 italic">
              {philosophy.who}
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/practice#${s.slug}`}
                className="bg-surface-raised shadow-rest hover:shadow-lift duration-calm ease-exhale group flex flex-col rounded-md border border-rule/40 p-8 transition-all hover:-translate-y-1"
              >
                <div className="text-honey mb-6">
                  <Ornament name={s.ornament} size={36} />
                </div>
                <p className="label-caps text-ink-soft">{s.eyebrow}</p>
                <h3 className="font-display text-ink mt-3 text-[1.6875rem] leading-[1.15] font-[350]">{s.name}</h3>
                <p className="text-body text-ink-muted mt-5 flex-1 italic">
                  {s.summary}
                </p>
                <div className="mt-8 flex items-baseline justify-between border-t border-rule/40 pt-5">
                  <span className="font-display text-ink text-2xl font-[350]">
                    {s.price}
                  </span>
                  <span className="label-caps text-ink-soft">{s.duration}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* What the face holds                                             */}
        {/* -------------------------------------------------------------- */}
        <section className="night bg-surface text-ink">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-36">
            <div>
              <p className="label-caps text-ink-soft">{voice.stories}</p>
              <h2 className="text-title text-ink mt-6">
                our face holds more tension than we realize.
              </h2>
              <p className="text-lead text-ink-muted mt-8 italic">
                And many people don&rsquo;t notice it until they feel it begin
                to release.
              </p>

              <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-4">
                {anatomy.map((part) => (
                  <li
                    key={part}
                    className="font-poetic text-ink-muted flex items-center gap-3 text-xl italic"
                  >
                    <span className="text-accent-honey">
                      <Ornament name="six-petal" size={14} />
                    </span>
                    {part}
                  </li>
                ))}
              </ul>
            </div>

            <div className="shadow-lift relative overflow-hidden rounded-md">
              <Image
                src={photos.stillness.src}
                alt={photos.stillness.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 44vw, 90vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* The letter                                                      */}
        {/* -------------------------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-36">
          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-20">
            <div className="shadow-rest relative overflow-hidden rounded-md">
              <Image
                src={photos.founder.src}
                alt={photos.founder.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 38vw, 90vw"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="label-caps text-ink-soft">{letter.eyebrow}</p>
              <h2 className="text-title text-ink mt-5">{letter.title}</h2>
              <p className="text-body text-ink-muted mt-8 italic">
                {letter.paragraphs[0]}
              </p>
              <p className="text-quote font-poetic text-ink my-10 font-light italic">
                {letter.pullQuote}
              </p>
              <Link
                href="/letter"
                className="label-caps text-ink-muted hover:text-ink duration-quick ease-exhale group inline-flex items-center gap-3 transition-colors"
              >
                Read the letter
                <span className="duration-quick ease-exhale inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Invitation                                                      */}
        {/* -------------------------------------------------------------- */}
        <section className="night bg-surface text-ink">
          <div className="mx-auto max-w-3xl px-5 py-28 text-center md:px-10 md:py-40">
            <p className="eyebrow-caps text-ink-soft">You&rsquo;re invited</p>
            <h2 className="text-title text-ink mt-8">{voice.moon}</h2>
            <p className="text-lead text-ink-muted mx-auto mt-8 max-w-lg italic">
              {site.location}, {site.availability}. The table is set before you
              walk in the door.
            </p>
            <Link
              href="/book"
              className="label-caps bg-primary text-primary-foreground shadow-rest hover:shadow-lift rounded-pill duration-quick ease-exhale mt-12 inline-block px-10 py-5 transition-all hover:-translate-y-0.5"
            >
              Book a session
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
