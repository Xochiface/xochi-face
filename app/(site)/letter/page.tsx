import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PortraitMark } from "@/components/brand/logo";
import { BorderStrip } from "@/components/brand/ornament";
import { photos } from "@/content/photos";
import { anatomy, letter, site } from "@/content/site";

export const metadata: Metadata = {
  title: "A letter from Nicole",
  description:
    "The founder's letter — on lymphatic work, the face as a representative of our emotions, and releasing what you've been carrying.",
};

export default function LetterPage() {
  return (
    <article className="bg-surface">
      {/* Masthead, following the kit's long-form comp -------------------- */}
      <header className="mx-auto max-w-3xl px-5 pt-40 pb-16 text-center md:px-10 md:pt-52">
        <p className="label-caps text-ink-soft">
          {letter.eyebrow} · {letter.season}
        </p>

        <div className="text-ink my-10 flex justify-center">
          <PortraitMark size={88} />
        </div>

        <h1 className="text-display text-ink">
          a letter <em className="font-poetic font-light">from</em> Nicole.
        </h1>

        <div className="text-honey mt-12">
          <BorderStrip name="marigold-chain" height={18} />
        </div>
      </header>

      {/* Body ------------------------------------------------------------ */}
      <div className="mx-auto max-w-2xl px-5 pb-16 md:px-10">
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

        {/* The anatomy list, plainly named — specificity is the warmth. */}
        <ul className="text-ink-soft my-14 flex flex-wrap justify-center gap-x-10 gap-y-5">
          {anatomy.map((part) => (
            <li key={part} className="font-poetic text-2xl italic">
              {part}
            </li>
          ))}
        </ul>

        <p className="text-lead text-ink-muted italic">{letter.closing[1]}</p>

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

      {/* Portrait -------------------------------------------------------- */}
      <div className="mx-auto max-w-2xl px-5 pb-24 md:px-10">
        <div className="shadow-rest relative overflow-hidden rounded-md">
          <Image
            src={photos.founder.src}
            alt={photos.founder.alt}
            placeholder="blur"
            sizes="(min-width: 768px) 42rem, 90vw"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Close ----------------------------------------------------------- */}
      <section className="night bg-surface text-ink">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
          <p className="eyebrow-caps text-ink-soft">You&rsquo;re invited</p>
          <h2 className="text-title text-ink mt-8">
            come sit at the table.
          </h2>
          <p className="text-lead text-ink-muted mx-auto mt-8 max-w-md italic">
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
    </article>
  );
}
