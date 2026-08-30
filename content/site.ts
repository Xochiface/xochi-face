import type { OrnamentName } from "@/components/brand/ornament";

/**
 * Site content.
 *
 * Copy is drawn from the brand kit wherever the kit provides it. Connective
 * copy is written to the kit's six voice rules: second person, short
 * sentences, garden vocabulary used as logic rather than costume, plain
 * anatomy, undersold spirituality. No emoji, no exclamation points, and none
 * of "unlock", "boost", or "transform".
 *
 * PENDING marks a value Nicole still needs to supply. Anything marked PENDING
 * is rendered as a visible placeholder rather than invented, so nothing
 * fictional can reach production by accident.
 */
export const PENDING = "PENDING" as const;

export const site = {
  name: "Xochi Face",
  wordmark: "xochi face.",
  practice: "lymphatic facials",
  location: "Austin, Texas",
  availability: "by appointment",
  parent: "Xochi Garden",
  year: 2026,

  /** Booking. Replace bookingUrl once the platform is chosen. */
  bookingUrl: PENDING,
  bookingPlatform: PENDING,
  email: PENDING,
  address: PENDING,
  hours: PENDING,
  instagram: PENDING,
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
};

export const services: readonly Service[] = [
  {
    slug: "the-ninety",
    eyebrow: "The signature bloom",
    name: "the ninety",
    summary:
      "Lymphatic drainage, buccal release, gua sha. A long, quiet moment with yourself — the full arc of the practice.",
    body: "The whole practice, unhurried. We begin at the neck and collarbone, because the face drains downward and nothing moves until that door is open. Then the jaw, the cheeks, the small muscles around the eyes. Buccal release works from inside the mouth, where the jaw holds what it has been holding. We finish with gua sha and a long, quiet stretch where you are not asked to do anything at all.",
    includes: [
      "Lymphatic drainage",
      "Buccal release",
      "Gua sha",
      "A long, quiet close",
    ],
    price: "$220",
    duration: "90 min",
    ornament: "marigold",
  },
  {
    slug: "the-sixty",
    eyebrow: "A shorter season",
    name: "the sixty",
    summary:
      "For return clients. Same hands, same room — half the time, all the breath.",
    body: "The same work, shaped to the hour. For those who have been to the table before and know what their face needs. We spend the time where you are holding it rather than moving through the whole arc. Same hands, same room.",
    includes: ["Lymphatic drainage", "Focused release", "Gua sha"],
    price: "$160",
    duration: "60 min",
    ornament: "six-petal",
  },
  {
    slug: "the-new-moon",
    eyebrow: "A monthly cycle",
    name: "the new moon",
    summary:
      "Two sessions a month, gua sha to take home, and a brief written reflection. For those who return with the moon.",
    body: "Lymph responds to rhythm more than intensity. Two sessions a month keeps the tissue moving rather than starting over each time. You take a gua sha stone home and a short written reflection after each visit — what your face was holding, and where.",
    includes: [
      "Two sessions each month",
      "A gua sha stone to take home",
      "A written reflection after each visit",
    ],
    price: "$380",
    duration: "Monthly",
    ornament: "double-moon",
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
} as const;

/** The founder's letter, from the kit's long-form page. */
export const letter = {
  eyebrow: "A letter from the gardener",
  season: "Spring 2026",
  title: "a letter from Nicole.",
  signature: "— Nicole",
  role: "Founder · Gardener · Practitioner",
  paragraphs: [
    "I'm so excited to be sharing this experience with others. To me, this work is not just about supporting the lymphatic system or sculpting the face — which is amazing in itself. There's also an exchange that happens deeper than the skin.",
    "My table is not just here to melt muscular tension away. It is prepared before you walk in the door, and set with intention — the intention of helping release the root cause of that tension.",
  ],
  pullQuote: "The table is set before you walk in the door.",
  closing: [
    "I know it might sound a little crazy, but it's interesting how our face is one of the greatest representatives of our emotions. Every part of it tells a story.",
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
