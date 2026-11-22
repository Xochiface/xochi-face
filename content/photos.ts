import type { StaticImageData } from "next/image";

import founder from "@/assets/photos/founder.jpg";
import garden from "@/assets/photos/garden.jpg";
import hero from "@/assets/photos/hero.jpg";
import stillLife from "@/assets/photos/still-life.jpg";
import stillness from "@/assets/photos/stillness.jpg";

/**
 * Photography manifest.
 *
 * Every image on the site resolves through here. All current files are
 * PLACEHOLDERS — free-licence stock from Unsplash, chosen to match the tone
 * and crop of the real photography, not to stand in for it.
 *
 * To swap in a real photo: overwrite the file in assets/photos/ keeping the
 * same filename and aspect ratio. Nothing else changes and no layout reflows,
 * because every consumer reads `ratio` from this manifest rather than
 * hardcoding dimensions.
 *
 * `brief` is the shot description — see SHOT-LIST.md, which is generated from
 * these entries and is what Nicole shoots against.
 */
export type Photo = {
  src: StaticImageData;
  alt: string;
  ratio: string;
  brief: string;
  placeholder: boolean;
  /**
   * Which part of the photo shows in its spot. x/y are the point to keep
   * centred, in percent across and down the photo; zoom ≥ 1 enlarges around
   * that point. Set from edit mode's Reframe; centred and unzoomed if absent.
   */
  framing?: Framing;
};

export type Framing = { x: number; y: number; zoom: number };

export const CENTRED: Framing = { x: 50, y: 50, zoom: 1 };

/** CSS for a framing, for an <img> that fills its frame with object-fit: cover. */
export function framingStyle(f: Framing = CENTRED) {
  const at = `${f.x}% ${f.y}%`;
  return {
    objectPosition: at,
    ...(f.zoom > 1 ? { transform: `scale(${f.zoom})`, transformOrigin: at } : {}),
  };
}

export const photos = {
  hero: {
    src: hero,
    framing: { x: 62, y: 50, zoom: 1 },
    alt: "A woman resting with her eyes closed in warm, low afternoon light.",
    ratio: "3 / 4",
    brief:
      "Vertical 3:4. A face at rest, eyes closed, three-quarter or profile. Warm low sun or window light — sienna and amber, no cool tones. Subject sits to one side of frame with generous negative space on the opposite side for the wordmark. Skin texture visible; do not retouch smooth.",
    placeholder: true,
  },
  stillness: {
    src: stillness,
    alt: "A close crop of a jaw and neck in soft, warm light.",
    ratio: "4 / 5",
    brief:
      "Vertical 4:5. Very close crop — jaw, neck, collarbone, or hands at the face mid-treatment. Shallow depth of field, warm bokeh. This is the intimacy shot; it should feel like being in the room, not observing it.",
    placeholder: true,
  },
  stillLife: {
    src: stillLife,
    alt: "A dried stem resting on soft cream linen.",
    ratio: "1 / 1",
    brief:
      "Square 1:1. Still life on bone-toned linen — facial oil, gua sha stone, dried marigold, folded cloth. Overhead or raking side light. Everything in the bone family; nothing white, nothing cool. This carries the texture breaks between sections.",
    placeholder: true,
  },
  founder: {
    src: founder,
    alt: "Nicole, seated at a café table beside a tall arrangement of roses.",
    ratio: "4 / 5",
    framing: { x: 49, y: 68, zoom: 1.3 },
    brief:
      "Vertical 4:5. Nicole, calm and direct to camera, warm ground behind her — ochre, clay, or bone wall. Natural light. Not a headshot: shoulders in, room around her. This sits beside the letter and needs to feel like a person, not a business.",
    // Nicole's own photo, swapped in from edit mode on 2026-11-21.
    placeholder: false,
  },
  garden: {
    src: garden,
    alt: "A marigold in bloom.",
    ratio: "4 / 5",
    brief:
      "Vertical 4:5. Cempasúchil / marigold — the brand's own flower. Warm ground preferred; the current placeholder has a cool green background that fights the palette, so this is the highest-priority replacement of the set.",
    placeholder: true,
  },
} satisfies Record<string, Photo>;

export type PhotoName = keyof typeof photos;

/** The file each slot is stored as in assets/photos/. */
export const photoFiles: Record<PhotoName, string> = {
  hero: "hero.jpg",
  stillness: "stillness.jpg",
  stillLife: "still-life.jpg",
  founder: "founder.jpg",
  garden: "garden.jpg",
};

/**
 * Tags an <Image> with its slot so edit mode can say exactly which photo a
 * replacement is for, which file it lands in, and how large it needs to be.
 * Spread onto the component: `<Image {...photoAttrs("hero")} … />`.
 */
export function photoAttrs(name: PhotoName) {
  const { width, height } = photos[name].src;
  return {
    "data-photo": name,
    "data-photo-file": `assets/photos/${photoFiles[name]}`,
    "data-photo-min": `${width}x${height}`,
    "data-photo-ratio": photos[name].ratio,
  };
}
