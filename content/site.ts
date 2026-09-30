import type { OrnamentName } from "@/components/brand/ornament";

/**
 * Site content.
 *
 * Two sources feed this file and they do not always agree:
 *
 *   1. The 2026 brand kit (design/brand-kit/) — the deliberate branding work.
 *   2. Nicole's live Instagram (@xochiface) and her live Google Appointments
 *      booking page, which is what clients can actually book today.
 *
 * Where they conflict, **live reality wins** and the conflict is flagged in a
 * comment. Publishing the kit's aspirational prices would put numbers on the
 * web that nobody can actually pay. See the notes on `services` below.
 *
 * Copy is written to the kit's six voice rules: second person, short
 * sentences, garden vocabulary as logic rather than costume, plain anatomy,
 * undersold spirituality. No emoji, no exclamation points, and none of
 * "unlock", "boost", or "transform". Nicole's own words are used throughout,
 * with emoji and hashtags stripped to meet that rule.
 *
 * PENDING marks a value she still needs to supply. Anything PENDING renders as
 * a visible placeholder rather than invented text.
 */
export const PENDING = "PENDING" as const;

export const site = {
  /**
   * The site reads "xochi" on the page. "Xochi Face" is the clarifier — it
   * carries the domain, the page titles, and search results, because other
   * brands use "Xochi". Once someone is here to book, the distinction has
   * already done its job.
   *
   * No terminal period, despite the kit setting the wordmark as "xochi face."
   */
  wordmark: "xochi",
  name: "Xochi Face",
  practitioner: "Nicole",
  practice: "lymphatic facials",
  positioning: "Lymphatic drainage facial specialist",
  location: "Austin, Texas",
  availability: "by appointment",
  parent: "Xochi Garden",
  year: 2026,

  /** Booking lives in content/booking.ts — one owner, so it cannot drift. */
  instagram: "https://www.instagram.com/xochiface/",
  instagramHandle: "@xochiface",

  /**
   * A client's Instagram post places the studio in "South Austin off William
   * Cannon". That is third-hand and not precise enough to publish, so the
   * address stays PENDING until Nicole confirms it.
   */
  address: PENDING,
  email: PENDING,
  hours: PENDING,
};

export const nav = [
  { href: "/practice", label: "The practice" },
  { href: "/letter", label: "A letter" },
  { href: "/book", label: "Book" },
] as const;

export type Service = {
  slug: string;
  eyebrow: string;
  name: string;
  summary: string;
  body: string;
  includes: readonly string[];
  price: string;
  duration: string;
  ornament: OrnamentName;
  featured?: boolean;
};

/**
 * The four services live on Nicole's Square booking page, read directly from
 * it on 2026-09-30. Names, prices, and durations mirror Square exactly — if
 * these disagree with the booking page, the booking page is right and this
 * file is stale.
 *
 * Note on the brand kit: it specifies a different menu again — "the ninety"
 * (90 min, $220), "the sixty" (60 min, $160), "the new moon" ($380/month).
 * Her real pricing has moved toward it (the 90 minute Lymphatic at $175 is
 * close to the kit's $220), but the naming and the monthly membership still
 * do not exist. The site follows what can actually be booked.
 */
export const services: readonly Service[] = [
  {
    slug: "xochi-signature",
    eyebrow: "The signature bloom",
    name: "Xochi Signature Facial",
    summary:
      "Draining the lymph and sculpting the face. Includes scalp, arm and hand massage.",
    body: "The full practice. We work the lymph toward its natural drainage points, then sculpt — cheekbones, jawline, the small muscles around the eyes. Scalp, arms, and hands are part of it, because the face does not hold tension in isolation. Most people fall asleep somewhere in the scalp massage.",
    includes: [
      "Manual lymphatic drainage",
      "Facial sculpting",
      "Scalp massage",
      "Arm and hand massage",
    ],
    price: "$125",
    duration: "60 min",
    ornament: "marigold",
    featured: true,
  },
  {
    slug: "ninety-minute-lymphatic",
    eyebrow: "The full arc",
    name: "90 minute Lymphatic",
    summary:
      "Extra love and care. Cleansing, lymphatic drainage, and a long finish with hot and cold stone gua sha and red light therapy.",
    body: "The longest session, and the least hurried. A facial cleanse first, then lymphatic drainage through the head, shoulders, arms and hands. It closes with hot and cold stone gua sha and red light therapy — the part most people do not want to get up from.",
    includes: [
      "Facial cleansing",
      "Manual lymphatic drainage",
      "Head, shoulder, arm and hand massage",
      "Hot and cold stone gua sha",
      "Red light therapy",
    ],
    price: "$175",
    duration: "90 min",
    ornament: "xochitl",
  },
  {
    slug: "thirty-minutes-in-heaven",
    eyebrow: "A shorter season",
    name: "30 minutes in heaven",
    summary:
      "All the benefits of a lymphatic facial, in half an hour. Includes décolleté, trapezius and neck massage.",
    body: "For when the hour is not there. We start where the face actually drains — the neck, the trapezius, the décolleté — and work upward. Shorter, but not rushed.",
    includes: [
      "Manual lymphatic drainage",
      "Décolleté and trapezius",
      "Neck release",
    ],
    price: "$80",
    duration: "30 min",
    ornament: "six-petal",
  },
  {
    slug: "new-client-special",
    eyebrow: "Your first visit",
    name: "New Client Special",
    summary:
      "The full signature facial, at a first-visit price. Includes scalp, hand and arm massage.",
    body: "The same hour as the signature facial — lymphatic drainage, sculpting, scalp, hands, and arms — offered once, for anyone who has not been to the table before.",
    includes: [
      "The full signature facial",
      "Scalp massage",
      "Hand and arm massage",
      "First visit only",
    ],
    price: "$100",
    duration: "60 min",
    ornament: "seed",
  },
] as const;

/**
 * Nicole's own five benefits, from her Instagram. Emoji and hashtags stripped
 * to meet the kit's voice rules; her substance and order kept.
 */
export const benefits = [
  {
    title: "Circulation, and the light that follows",
    body: "More blood flow means more oxygen and nutrients reaching the skin.",
    ornament: "sun",
  },
  {
    title: "Less puffiness",
    body: "Encouraging lymph flow reduces swelling and water retention, and relieves the pressure that allergies leave behind.",
    ornament: "double-moon",
  },
  {
    title: "Your own contours",
    body: "Cheekbones that read, a defined jaw, and a lift through tired brows. Nothing added.",
    ornament: "agave",
  },
  {
    title: "Clearing from within",
    body: "The work supports your body's own drainage pathways, moving stagnant lymph and releasing built-up tension.",
    ornament: "sprout",
  },
  {
    title: "Tension, released",
    body: "Jaw, neck, and facial tightness soften. Most people leave lighter and more grounded than they came.",
    ornament: "offering",
  },
] as const;

/** The anatomy line — the kit names body parts plainly; specificity is the warmth. */
export const anatomy = [
  "lips",
  "eyes",
  "forehead",
  "nose",
  "cheekbones",
  "chin",
] as const;

export const voice = {
  thesis: "sometimes the glow starts with releasing what you've been carrying.",
  bloom: "every flower blooms from within.",
  softness: "a return to softness.",
  moon: "come back with the moon.",
  table: "the table is set before you walk in the door.",
  exchange: "an exchange that happens deeper than the skin.",
  stories: "our face tells stories.",
  /** Nicole's own lines, from Instagram. */
  tend: "we don't realize how much tension the face holds until we tend to it.",
  returning: "beauty isn't about changing who we are — it's about returning to ourselves.",
  home: "restoration, reconnection, and coming home.",
} as const;

/** Nicole's words on why the practice exists. From her Instagram. */
export const philosophy = {
  welcome:
    "I've always believed that beauty isn't about adding more or changing yourself — it's about feeling good, and a lot of that has to do with clearing away what no longer serves us.",
  mission:
    "In Nahuatl, Xochitl means flower. That is exactly my mission: to help your natural features bloom by supporting your body's internal filtration system.",
  why: "I started Xochi because I saw how much of a difference manual lymphatic drainage makes — not just for a sculpted jawline, but for how we feel.",
  who: "Whether you're dealing with stubborn puffiness, sinus pressure, or you just need a deep nervous system reset, I'm here to help you come back to yourself.",
  balance:
    "A balance between physical change and soulful restoration. A practice that helps release tension, encourage flow, and create space for us to soften into ourselves again.",
  essence:
    "When we nurture both body and spirit, we give ourselves the opportunity to bloom.",
} as const;

/** The founder's letter. The kit's long-form page and her Instagram post agree. */
export const letter = {
  eyebrow: "A letter from the gardener",
  season: "Spring 2026",
  title: "a letter from Nicole.",
  signature: "— Nicole",
  role: "Founder · Gardener · Practitioner",
  paragraphs: [
    "I'm so excited to be sharing this experience with others. To me, this work is not just about supporting the lymphatic system or sculpting the face — which is amazing in itself. There's also an exchange that happens deeper than the skin.",
    "My table is not just here to melt muscular tension away. It is prepared before you walk in the door, and set with the intention of helping release the root cause of that tension.",
  ],
  pullQuote: "The table is set before you walk in the door.",
  closing: [
    "I know it might sound a little crazy, but it's interesting how our face is one of the greatest representatives of our emotions. Our lips, eyes, forehead, nose, cheekbones, and chin all tell stories.",
    "Our face holds more tension than we realize — and many people don't notice it until they feel it begin to release. Sometimes the glow starts with releasing what you've been carrying.",
  ],
  valediction: "with care,",
} as const;

/** The name means flower. */
export const etymology = {
  word: "xochitl",
  pronunciation: "/ˈsoːtʃitɬ/",
  language: "nahuatl",
  meaning: "it means flower.",
  gloss:
    "And every flower blooms from within. Xochi is a practice rooted in that idea — that beauty isn't made, it's tended.",
} as const;
