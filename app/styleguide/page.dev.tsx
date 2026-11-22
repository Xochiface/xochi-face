import type { Metadata } from "next";
import {
  BORDERS,
  BorderStrip,
  Ornament,
  ORNAMENTS,
} from "@/components/brand/ornament";
import { Lockup, PortraitMark, Wordmark } from "@/components/brand/logo";
import { contrastRatio, grade } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Internal reference for the Xochi Face design system.",
  robots: { index: false, follow: false },
};

/* -------------------------------------------------------------------------- */

const BONE = [
  ["bone-50", "#FBF6EA"],
  ["bone-100", "#F7F1E2"],
  ["bone-200", "#F4ECD8"],
  ["bone-300", "#ECE1CB"],
  ["bone-400", "#E5D8BE"],
] as const;

const SIENNA = [
  ["sienna-300", "#B79A78"],
  ["sienna-500", "#8B5E3C"],
  ["sienna-700", "#6A3F22"],
  ["sienna-800", "#4A2A14"],
  ["sienna-900", "#3B1D04"],
] as const;

const ACCENT = [
  ["honey", "#C8A053"],
  ["honey-soft", "#DCBC82"],
  ["sage", "#6B7C4A"],
  ["blush", "#D4A89A"],
  ["petal", "#E6C9B8"],
] as const;

const SPACING = [
  [1, 4],
  [2, 8],
  [3, 12],
  [4, 16],
  [5, 24],
  [6, 32],
  [7, 48],
  [8, 64],
  [9, 96],
  [10, 144],
] as const;

const SERVICES = [
  {
    eyebrow: "The signature bloom",
    name: "the ninety",
    body: "Lymphatic drainage, buccal release, gua sha. A long, quiet moment with yourself — the full arc of the practice.",
    price: "$220",
    meta: "90 min",
    ornament: "marigold",
  },
  {
    eyebrow: "A shorter season",
    name: "the sixty",
    body: "For return clients. Same hands, same room — half the time, all the breath.",
    price: "$160",
    meta: "60 min",
    ornament: "six-petal",
  },
  {
    eyebrow: "A monthly cycle",
    name: "the new moon",
    body: "Two sessions a month, gua sha to take home, and a brief written reflection. For those who return with the moon.",
    price: "$380",
    meta: "Monthly",
    ornament: "double-moon",
  },
] as const;

/* -------------------------------------------------------------------------- */

function Section({
  id,
  label,
  title,
  note,
  children,
}: {
  id: string;
  label: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-rule/50 py-16">
      <header className="mb-10 max-w-2xl">
        <p className="label-caps text-ink-soft mb-3">{label}</p>
        <h2 className="text-subtitle text-ink">{title}</h2>
        {note ? (
          <p className="text-body text-ink-muted mt-4 italic">{note}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function Swatch({
  token,
  hex,
  on,
}: {
  token: string;
  hex: string;
  on: string;
}) {
  const ratio = contrastRatio(hex, on);
  return (
    <div className="min-w-0">
      <div
        className="rounded-md shadow-rest h-24 w-full border border-rule/40"
        style={{ backgroundColor: hex }}
      />
      <p className="label-caps text-ink mt-3">{token}</p>
      <p className="font-label text-ink-soft mt-1 text-xs tracking-wide tabular-nums">
        {hex.toUpperCase()}
      </p>
      <p className="font-label text-ink-soft mt-0.5 text-xs tabular-nums">
        {ratio.toFixed(2)}:1 · {grade(ratio)}
      </p>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 border-b border-rule/40 py-8 last:border-b-0 md:grid-cols-[13rem_1fr] md:gap-10">
      <p className="label-caps text-ink-soft pt-2">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export default function StyleguidePage() {
  return (
    <main className="bg-surface text-ink min-h-full">
      {/* Masthead --------------------------------------------------------- */}
      <header className="border-b border-rule/50 px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="label-caps text-ink-soft mb-6">
            Internal reference · not a public page
          </p>
          <h1 className="text-display text-ink max-w-3xl">
            the design system, on one board.
          </h1>
          <p className="text-lead text-ink-muted mt-8 max-w-2xl italic">
            Every token in the Xochi Face brand kit, rendered at real size in a
            real browser — so we can judge the material before anything gets
            built on it.
          </p>

          <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
            {[
              ["color", "Color"],
              ["directions", "Directions"],
              ["type", "Type"],
              ["mark", "The mark"],
              ["ornaments", "Ornaments"],
              ["borders", "Borders"],
              ["buttons", "Buttons"],
              ["fields", "Fields"],
              ["cards", "Service cards"],
              ["form", "Form"],
              ["space", "Space & shape"],
            ].map(([id, name]) => (
              <a
                key={id}
                href={`#${id}`}
                className="label-caps text-ink-soft hover:text-ink duration-quick ease-exhale underline-offset-8 transition-colors hover:underline"
              >
                {name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 md:px-12">
        {/* Color ---------------------------------------------------------- */}
        <Section
          id="color"
          label="Color · 01"
          title="Bone, sienna, and five accents."
          note="Contrast is measured against the surface each color actually sits on — bone against Sienna 900 ink, sienna against Bone 100."
        >
          <div className="space-y-12">
            <div>
              <p className="eyebrow-caps text-ink-muted mb-5">Bone</p>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {BONE.map(([token, hex]) => (
                  <Swatch key={token} token={token} hex={hex} on="#3B1D04" />
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow-caps text-ink-muted mb-5">Sienna</p>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {SIENNA.map(([token, hex]) => (
                  <Swatch key={token} token={token} hex={hex} on="#F7F1E2" />
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow-caps text-ink-muted mb-5">Accents</p>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {ACCENT.map(([token, hex]) => (
                  <Swatch key={token} token={token} hex={hex} on="#F7F1E2" />
                ))}
              </div>
              <p className="text-body text-ink-muted mt-6 max-w-2xl italic">
                As text on bone, honey lands at 2.16:1 and blush at 1.89:1 —
                both well under AA. Sage reaches 4.04:1, also short. Searching
                for the nearest AA-safe version of each is where it gets
                interesting: sage can be fixed invisibly (
                <span className="text-accent-sage not-italic">#607545</span>,
                4.51:1, a ΔE of 3.6 — you cannot see the difference), but honey
                and blush cannot. Any version of them that clears 4.5:1 has
                stopped being honey or blush.
              </p>
              <p className="text-body text-ink-muted mt-4 max-w-2xl italic">
                So the rule is not &ldquo;darken the accents.&rdquo; It is that{" "}
                <strong className="text-ink font-normal not-italic">
                  the accents are ink on sienna and ornament on bone.
                </strong>{" "}
                On the night side they are their true selves and clear AA
                comfortably — honey-soft 8.48:1, blush 7.24:1, sage 6.20:1. On
                bone they carry ornaments, rules, and surfaces, where contrast
                minimums do not apply. The{" "}
                <code className="font-label text-ink text-sm">--accent-*</code>{" "}
                tokens hold the AA-safe substitutions for the rare case where an
                accent must be small text on bone.
              </p>
            </div>
          </div>
        </Section>

        {/* Directions ----------------------------------------------------- */}
        <Section
          id="directions"
          label="Color · 02"
          title="Two reading directions."
          note="Add .night to any element and every semantic token re-resolves beneath it. Sections can invert independently of the page."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-md shadow-rest border border-rule/40 p-10">
              <p className="label-caps text-ink-soft mb-6">The practice</p>
              <h3 className="text-subtitle text-ink">a return to softness.</h3>
              <p className="text-body text-ink-muted mt-5 italic">
                Sienna ink on bone — the everyday reading direction. Where the
                brand lives most of the time.
              </p>
              <p className="label-caps text-ink-soft mt-8">
                Bone surface · sienna ink
              </p>
            </div>

            <div className="night bg-surface text-ink rounded-md shadow-rest border border-rule/40 p-10">
              <p className="label-caps text-ink-soft mb-6">You&rsquo;re invited</p>
              <h3 className="text-subtitle text-ink">
                come back with the moon.
              </h3>
              <p className="text-body text-ink-muted mt-5 italic">
                Bone ink on sienna — for invitations, the night side of the
                brand, moments worth marking.
              </p>
              <p className="label-caps text-ink-soft mt-8">
                Sienna surface · bone ink
              </p>
            </div>
          </div>
        </Section>

        {/* Type ----------------------------------------------------------- */}
        <Section
          id="type"
          label="Typography"
          title="Three families, one voice."
          note="Fraunces carries the display line, Cormorant Garamond the poetic body, Outfit every label at 0.20em — matched to the lockup."
        >
          <Row label="Display · Fraunces 350">
            <p className="text-display text-ink">
              every flower blooms from within
            </p>
            <p className="font-label text-ink-soft mt-4 text-xs">
              clamp(44px → 84px) · line-height 1.02 · tracking -0.018em
            </p>
          </Row>

          <Row label="Title · Fraunces 350">
            <p className="text-title text-ink">a return to softness</p>
            <p className="font-label text-ink-soft mt-4 text-xs">
              clamp(34px → 60px) · line-height 1.06
            </p>
          </Row>

          <Row label="Subtitle · Fraunces 350">
            <p className="text-subtitle text-ink">the ninety</p>
            <p className="font-label text-ink-soft mt-4 text-xs">
              clamp(28px → 44px) · line-height 1.12
            </p>
          </Row>

          <Row label="Quote · Cormorant 300 italic">
            <p className="text-quote font-poetic text-ink-muted font-light italic">
              sometimes the glow starts with releasing what you&rsquo;ve been
              carrying.
            </p>
            <p className="font-label text-ink-soft mt-4 text-xs">
              clamp(24px → 38px) · lyrical, embodied
            </p>
          </Row>

          <Row label="Lead · Cormorant">
            <p className="text-lead text-ink-muted italic">
              Lymphatic drainage, buccal release, gua sha — and a long, quiet
              moment with yourself.
            </p>
            <p className="font-label text-ink-soft mt-4 text-xs">
              clamp(20px → 26px) · line-height 1.58
            </p>
          </Row>

          <Row label="Body · Cormorant">
            <p className="text-body text-ink-muted max-w-prose">
              Our face holds more tension than we realize — and many people
              don&rsquo;t notice it until they feel it begin to release. The
              table is not just here to melt muscular tension away. It is
              prepared before you walk in the door, and set with intention.
            </p>
            <p className="font-label text-ink-soft mt-4 text-xs">
              clamp(17px → 19px) · line-height 1.72
            </p>
          </Row>

          <Row label="Eyebrow · Outfit">
            <p className="eyebrow-caps text-ink">
              Austin · Texas · by appointment
            </p>
            <p className="font-label text-ink-soft mt-4 text-xs">
              clamp(15px → 22px) · tracking 0.20em
            </p>
          </Row>

          <Row label="Label · Outfit">
            <p className="label-caps text-ink">Book a session</p>
            <p className="font-label text-ink-soft mt-4 text-xs">
              13px · tracking 0.20em · buttons and microcopy
            </p>
          </Row>
        </Section>

        {/* Mark ----------------------------------------------------------- */}
        <Section
          id="mark"
          label="The mark"
          title="Portrait, wordmark, lockup."
          note="The mark is masked, not drawn — it takes currentColor, so it works in either direction from one file. Minimum height 80px; below that, wordmark alone."
        >
          <div className="grid items-start gap-10 md:grid-cols-3">
            <div className="text-ink flex flex-col items-center gap-5">
              <Lockup markSize={132} />
              <p className="label-caps text-ink-soft">Primary lockup</p>
            </div>

            <div className="text-ink flex flex-col items-center justify-center gap-5 self-stretch">
              <PortraitMark size={132} />
              <p className="label-caps text-ink-soft">Portrait mark</p>
            </div>

            <div className="text-ink flex flex-col items-center justify-center gap-5 self-stretch">
              <Wordmark />
              <p className="label-caps text-ink-soft">Wordmark</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="bg-surface-sunken text-ink flex items-center justify-center gap-8 rounded-md border border-rule/40 p-10">
              <PortraitMark size={80} />
              <PortraitMark size={56} />
              <PortraitMark size={40} />
            </div>
            <div className="night bg-surface text-ink flex items-center justify-center gap-8 rounded-md p-10">
              <PortraitMark size={80} />
              <span className="text-accent-honey">
                <PortraitMark size={56} />
              </span>
              <span className="text-accent-blush">
                <PortraitMark size={40} />
              </span>
            </div>
          </div>
          <p className="text-body text-ink-muted mt-5 italic">
            80px, 56px, and 40px. The two smaller sizes are below the kit&rsquo;s
            stated minimum and are shown here only to confirm where the detail
            actually collapses — the flowers close up first.
          </p>
        </Section>

        {/* Ornaments ------------------------------------------------------ */}
        <Section
          id="ornaments"
          label="Custom graphics · 01"
          title="The garden ornament suite."
          note="Twelve linocut motifs. Masked to currentColor, so the same twelve files serve every surface and accent."
        >
          <div className="text-ink grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-6">
            {ORNAMENTS.map((name) => (
              <div
                key={name}
                className="bg-surface-raised rounded-md shadow-rest hover:shadow-lift duration-calm ease-exhale flex flex-col items-center gap-4 border border-rule/40 p-5 transition-shadow"
              >
                <Ornament name={name} size={52} />
                <p className="font-label text-ink-soft text-center text-[0.6875rem] tracking-wide">
                  {name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-8">
            <span className="text-ink">
              <Ornament name="xochitl" size={44} />
            </span>
            <span className="text-accent-honey">
              <Ornament name="marigold" size={44} />
            </span>
            <span className="text-accent-sage">
              <Ornament name="sprout" size={44} />
            </span>
            <span className="text-sienna-500">
              <Ornament name="sun" size={44} />
            </span>
            <span className="text-ink-soft">
              <Ornament name="hummingbird" size={44} />
            </span>
          </div>
          <p className="text-body text-ink-muted mt-5 italic">
            Sienna, honey, sage, and two tints of the ink — one asset each.
          </p>
        </Section>

        {/* Borders -------------------------------------------------------- */}
        <Section
          id="borders"
          label="Custom graphics · 02"
          title="Three repeating strips."
          note="Tiled horizontally at any height. These are the brand's section transitions — neither reference site has an equivalent."
        >
          <div className="space-y-10">
            {BORDERS.map((name) => (
              <div key={name}>
                <p className="label-caps text-ink-soft mb-4">{name}</p>
                <div className="text-ink">
                  <BorderStrip name={name} height={22} />
                </div>
              </div>
            ))}
          </div>

          <div className="night bg-surface text-ink mt-10 rounded-md p-10">
            <p className="label-caps text-ink-soft mb-5">
              On sienna, in honey
            </p>
            <span className="text-accent-honey block">
              <BorderStrip name="marigold-chain" height={20} />
            </span>
          </div>
        </Section>

        {/* Buttons -------------------------------------------------------- */}
        <Section
          id="buttons"
          label="Components · 01"
          title="Buttons."
          note="Pill for actions, per the kit. Transitions run on the exhale easing at 220ms — present, never eager."
        >
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              className="label-caps bg-primary text-primary-foreground shadow-rest hover:shadow-lift duration-quick ease-exhale rounded-pill px-8 py-4 transition-all hover:-translate-y-0.5"
            >
              Book a session
            </button>

            <button
              type="button"
              className="label-caps text-ink duration-quick ease-exhale rounded-pill border border-rule px-8 py-4 transition-colors hover:bg-surface-sunken"
            >
              The garden
            </button>

            <button
              type="button"
              className="label-caps text-ink-muted hover:text-ink duration-quick ease-exhale group inline-flex items-center gap-3 transition-colors"
            >
              Read the journal
              <span className="duration-quick ease-exhale inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>

            <button
              type="button"
              disabled
              className="label-caps text-ink-soft rounded-pill cursor-not-allowed border border-rule/50 px-8 py-4 opacity-50"
            >
              Fully booked
            </button>
          </div>

          <div className="night bg-surface mt-8 rounded-md p-10">
            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                className="label-caps bg-primary text-primary-foreground duration-quick ease-exhale rounded-pill px-8 py-4 transition-all hover:-translate-y-0.5"
              >
                Book a session
              </button>
              <button
                type="button"
                className="label-caps text-ink duration-quick ease-exhale rounded-pill border border-rule px-8 py-4 transition-colors hover:bg-surface-raised"
              >
                The garden
              </button>
            </div>
          </div>
        </Section>

        {/* Fields --------------------------------------------------------- */}
        <Section
          id="fields"
          label="Components · 02"
          title="Form fields."
          note="Underline rather than box — closer to the kit's printed forms, and quieter on a bone surface."
        >
          <div className="grid max-w-2xl gap-8 sm:grid-cols-2">
            <label className="block">
              <span className="label-caps text-ink-soft">Name</span>
              <input
                type="text"
                placeholder="how shall we greet you"
                className="font-poetic text-ink placeholder:text-ink-soft/70 focus:border-ink duration-quick ease-exhale mt-3 w-full border-0 border-b border-ink-soft bg-transparent pb-3 text-lg italic transition-colors outline-none"
              />
            </label>

            <label className="block">
              <span className="label-caps text-ink-soft">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="font-poetic text-ink placeholder:text-ink-soft/70 focus:border-ink duration-quick ease-exhale mt-3 w-full border-0 border-b border-ink-soft bg-transparent pb-3 text-lg italic transition-colors outline-none"
              />
            </label>
          </div>
        </Section>

        {/* Service cards -------------------------------------------------- */}
        <Section
          id="cards"
          label="Components · 03"
          title="Service cards."
          note="The whole practice is three services. That is the site's biggest advantage over the references — no filtering, no categories, no hunting."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <article
                key={s.name}
                className="bg-surface-raised shadow-rest hover:shadow-lift duration-calm ease-exhale group flex flex-col rounded-md border border-rule/40 p-8 transition-shadow"
              >
                {/* Ornament, not text — true honey, no AA substitution. */}
                <div className="text-honey mb-6">
                  <Ornament name={s.ornament} size={36} />
                </div>
                <p className="label-caps text-ink-soft">{s.eyebrow}</p>
                <h3 className="text-subtitle text-ink mt-3">{s.name}</h3>
                <p className="text-body text-ink-muted mt-5 flex-1 italic">
                  {s.body}
                </p>
                <div className="mt-8 flex items-baseline justify-between border-t border-rule/40 pt-5">
                  <span className="font-display text-ink text-2xl font-[350]">
                    {s.price}
                  </span>
                  <span className="label-caps text-ink-soft">{s.meta}</span>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Long-form / invitation ----------------------------------------- */}
        <Section
          id="form"
          label="Composition"
          title="A block, assembled."
          note="Not a page design — a check that the tokens hold together when stacked: eyebrow, display, rule, quote, label."
        >
          <div className="night bg-surface text-ink rounded-md px-8 py-20 text-center md:px-16">
            <p className="eyebrow-caps text-ink-soft">
              Thank you · come back with the moon
            </p>

            <div className="text-accent-honey mx-auto my-10 flex justify-center">
              <PortraitMark size={72} />
            </div>

            <h3 className="text-title text-ink mx-auto max-w-2xl">
              every flower blooms from within.
            </h3>

            <div className="text-ink-soft/60 mx-auto my-12 max-w-md">
              <BorderStrip name="floral" height={16} />
            </div>

            <p className="text-quote font-poetic text-ink-muted mx-auto max-w-xl font-light italic">
              lips · eyes · forehead · nose · cheekbones · chin
            </p>

            <p className="label-caps text-ink-soft mt-12">
              Xochi Garden · Austin, Texas · 2026
            </p>
          </div>
        </Section>

        {/* Space & shape -------------------------------------------------- */}
        <Section
          id="space"
          label="Space & shape"
          title="A generous breath."
          note="The kit's ten-step scale maps exactly onto Tailwind's 4px base, so no custom spacing utilities were needed."
        >
          <Row label="Spacing scale">
            <div className="space-y-2">
              {SPACING.map(([step, px]) => (
                <div key={step} className="flex items-center gap-5">
                  <span className="font-label text-ink-soft w-8 text-xs tabular-nums">
                    {step}
                  </span>
                  <div
                    className="bg-sienna-300 h-3 rounded-sm"
                    style={{ width: px }}
                  />
                  <span className="font-label text-ink-soft text-xs tabular-nums">
                    {px}px
                  </span>
                </div>
              ))}
            </div>
          </Row>

          <Row label="Radii">
            <div className="flex flex-wrap gap-6">
              {[
                ["none", "rounded-none"],
                ["md · cards", "rounded-md"],
                ["pill · buttons", "rounded-pill"],
                ["petal", "rounded-petal"],
              ].map(([name, cls]) => (
                <div key={name} className="flex flex-col items-center gap-3">
                  <div
                    className={`bg-surface-raised shadow-rest h-24 w-24 border border-rule/40 ${cls}`}
                  />
                  <span className="font-label text-ink-soft text-xs">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </Row>

          <Row label="Shadows">
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-surface-raised shadow-rest h-24 w-40 rounded-md" />
                <span className="font-label text-ink-soft text-xs">
                  rest · a whisper
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="bg-surface-raised shadow-lift h-24 w-40 rounded-md" />
                <span className="font-label text-ink-soft text-xs">
                  lift · on hover
                </span>
              </div>
            </div>
          </Row>

          <Row label="Motion">
            <div className="space-y-3">
              <p className="text-body text-ink-muted italic">
                Hover any card above. Easing is{" "}
                <code className="font-label text-ink text-sm">
                  --ease-exhale
                </code>{" "}
                — cubic-bezier(0.22, 1, 0.36, 1). It decelerates hard and settles
                without bounce, which is the closest motion equivalent to the
                kit&rsquo;s &ldquo;periods land like exhales.&rdquo;
              </p>
              <p className="text-body text-ink-muted italic">
                Durations: quick 220ms, calm 420ms, slow 720ms. All motion is
                disabled under prefers-reduced-motion.
              </p>
            </div>
          </Row>
        </Section>

        <footer className="border-t border-rule/50 py-16">
          <p className="text-body text-ink-soft italic">
            Xochi Face design system · derived from Brand Kit 2026 v0.1 · this
            page is internal and excluded from indexing.
          </p>
        </footer>
      </div>
    </main>
  );
}
