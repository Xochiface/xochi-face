import Link from "next/link";

import { PortraitMark, Wordmark } from "@/components/brand/logo";
import { BorderStrip } from "@/components/brand/ornament";
import { anatomy, nav, PENDING, site, voice } from "@/content/site";

/** Values Nicole has not supplied yet render as a visible marker, never invented. */
function Pending({ label }: { label: string }) {
  return (
    <span className="label-caps text-ink-soft/60 border border-rule/30 px-2 py-1">
      {label} — to come
    </span>
  );
}

export function Footer() {
  return (
    <footer className="night bg-surface text-ink">
      <div className="text-accent-honey/45">
        <BorderStrip name="marigold-chain" height={18} />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-col items-center text-center">
          <PortraitMark size={84} />
          <h2 className="text-title text-ink mt-10 max-w-xl">{voice.bloom}</h2>
          <p className="eyebrow-caps text-ink-soft mt-8">{voice.moon}</p>
        </div>

        <div className="mx-auto my-16 max-w-sm text-ink-soft/40">
          <BorderStrip name="floral" height={14} />
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Wordmark className="text-ink" />
            <p className="label-caps text-ink-soft mt-4">{site.practice}</p>
            <p className="text-body text-ink-muted mt-6 italic">
              {site.location} · {site.availability}
            </p>
          </div>

          <nav className="flex flex-col gap-4">
            <p className="label-caps text-ink-soft">The garden</p>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body text-ink-muted hover:text-ink duration-quick ease-exhale w-fit italic transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/styleguide"
              className="text-body text-ink-soft/60 hover:text-ink-muted duration-quick ease-exhale mt-2 w-fit text-sm italic transition-colors"
            >
              Styleguide (internal)
            </Link>
          </nav>

          <div className="flex flex-col items-start gap-3">
            <p className="label-caps text-ink-soft mb-1">Find us</p>
            {site.address === PENDING ? (
              <Pending label="Address" />
            ) : (
              <p className="text-body text-ink-muted italic">{site.address}</p>
            )}
            {site.email === PENDING ? (
              <Pending label="Email" />
            ) : (
              <a
                href={`mailto:${site.email}`}
                className="text-body text-ink-muted hover:text-ink italic"
              >
                {site.email}
              </a>
            )}
            {site.instagram === PENDING ? (
              <Pending label="Instagram" />
            ) : (
              <a
                href={site.instagram}
                className="text-body text-ink-muted hover:text-ink italic"
              >
                Instagram
              </a>
            )}
          </div>
        </div>

        <p className="eyebrow-caps text-ink-soft/70 mt-20 text-center text-[0.8125rem]">
          {anatomy.join(" · ")}
        </p>

        <p className="label-caps text-ink-soft/60 mt-8 text-center">
          {site.parent} · {site.location} · {site.year}
        </p>
      </div>
    </footer>
  );
}
