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
  /** Paragraphs for the Practice page, after the summary. */
  body: readonly string[];
  includes: readonly string[];
  price: string;
  duration: string;
  ornament: OrnamentName;
  featured?: boolean;
};

/**
 * The services live on Nicole's Square booking page. Last read from it on
 * 2026-11-18, after she rewrote the descriptions there. Names, prices,
 * durations and wording mirror Square — if these disagree with the booking
 * page, the booking page is right and this file is stale.
 *
 * Square's first sentence or paragraph is the summary (the cards); the rest
 * is the body (the Practice page).
 *
 * Also on Square, deliberately not shown as a service card:
 *   - "30 minutes in heaven" (30 min, $80), left off at Jake's request on
 *     2026-11-16.
 *   - "Facial - Gift Certificate Booking" (free, 1 hr): a way to redeem, not
 *     a service. The Book page points to it instead; see `giftCertificate`.
 * The buccal massage add-on is in `addOns`, below.
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
      "A holistic cleansing facial that brings together lymphatic drainage, Russian facial sculpting, and Traditional Chinese Medicine-inspired scalp massage.",
    body: [
      "Each treatment is thoughtfully designed to support skin health, relieve facial tension, and encourage a refreshed, sculpted appearance.",
      "Finished with relaxing arm and hand massage for a complete experience of restoration and care.",
    ],
    includes: [
      "Cleansing",
      "Manual lymphatic drainage",
      "Russian facial sculpting",
      "Traditional Chinese Medicine-inspired scalp massage",
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
      "An extended holistic facial thoughtfully tailored to your skin's individual needs. Beginning with a customized cleanse and a carefully selected treatment mask, this experience brings together lymphatic drainage, Russian facial sculpting, and Traditional Chinese Medicine-inspired scalp massage.",
    body: [
      "With extra time dedicated to intentional touch and facial massage, the treatment supports lymphatic flow, releases facial tension, and promotes a refreshed, sculpted appearance.",
      "The experience concludes with the soothing warmth of hot stones and red light therapy, leaving you feeling restored, relaxed, and cared for from within.",
    ],
    includes: [
      "Customized cleanse and treatment mask",
      "Manual lymphatic drainage",
      "Russian facial sculpting",
      "Traditional Chinese Medicine-inspired scalp massage",
      "Extra time for facial massage",
      "Hot stones",
      "Red light therapy",
    ],
    price: "$175",
    duration: "90 min",
    ornament: "xochitl",
  },
  {
    slug: "new-client-special",
    eyebrow: "Your first visit",
    name: "New Client Special",
    summary:
      "The full signature facial, at a first-visit price. Includes scalp, hand and arm massage.",
    body: [
      "Our Signature Xochi Facial — lymphatic drainage, Russian facial sculpting, and Traditional Chinese Medicine-inspired scalp massage, finished with arm and hand massage — offered once, for anyone who has not been to the table before.",
    ],
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

export type AddOn = {
  slug: string;
  name: string;
  summary: string;
  availability: string;
  price: string;
  duration: string;
  ornament: OrnamentName;
};

/** Booked alongside a facial. From Square, 2026-11-18. */
export const addOns: readonly AddOn[] = [
  {
    slug: "buccal-massage",
    name: "Buccal Massage",
    summary:
      "A specialized facial massage combining gentle intra-oral and external techniques to work with the deeper muscles of the cheeks and jaw. This intentional treatment focuses on releasing muscular tension and complementing your facial sculpting experience, leaving the face feeling relaxed and refreshed.",
    availability: "Available as an add-on to any facial.",
    price: "$35",
    duration: "20 min",
    ornament: "double-moon",
  },
] as const;

/** Square's free "Facial - Gift Certificate Booking" service, as a pointer. */
export const giftCertificate = {
  title: "Holding a gift certificate?",
  body: "Choose “Facial - Gift Certificate Booking” in the calendar below, and bring your gift certificate to your appointment for redemption.",
} as const;

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
  thesis:
    "sometimes, the most beautiful thing you can do for yourself is slow down to find yourself in your breath.",
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
    "Inspired by Xochiquetzal, the Aztec goddess associated with beauty, fertility, flowers, and feminine creativity, XOCHI celebrates a beauty that is delicate yet abundant, ever-changing yet deeply rooted.",
  why: "I started Xochi because I saw how much of a difference manual lymphatic drainage makes — not just for a sculpted jawline, but for how we feel.",
  who: "A more intentional approach to skin health, facial massage, and lymphatic care. An invitation to slow down, release tension, and reconnect with yourself.",
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

/**
 * The name, and where it comes from. Nicole rewrote this on 2026-11-16:
 * it now points to Xochiquetzal rather than glossing "xochitl" (flower).
 */
export const etymology = {
  word: "XOCHI",
  source: "INSPIRED BY XOCHIQUETZAL",
  meaning: "a symbol of beauty, nature, and self-nurturing.",
  gloss:
    "And every flower blooms from within. Xochi is a practice rooted in that idea — that beauty isn't made, it's tended.",
} as const;
