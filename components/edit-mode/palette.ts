/**
 * Colours for edit mode: the brand swatches, and how a chosen colour is shown
 * in the page (inline style) and written into the code (a Tailwind class).
 *
 * A swatch is a palette token, so it follows the site's tokens if they're ever
 * retuned. A custom colour (eyedropper or picker) is a plain hex value.
 */

export type ColorValue = { token: string } | { hex: string };

/** Which part of an element a colour applies to. */
export type ColorTarget = "text" | "fill" | "border";

export const TARGETS: { id: ColorTarget; label: string; prefix: string }[] = [
  { id: "text", label: "Text", prefix: "text" },
  { id: "fill", label: "Fill", prefix: "bg" },
  { id: "border", label: "Border", prefix: "border" },
];

/** The brand palette, as content/globals.css defines it, in reading order. */
export const SWATCHES: { group: string; tokens: string[] }[] = [
  { group: "Ink", tokens: ["ink", "ink-muted", "ink-soft"] },
  { group: "Sienna", tokens: ["sienna-900", "sienna-800", "sienna-700", "sienna-500", "sienna-300"] },
  { group: "Bone", tokens: ["bone-50", "bone-100", "bone-200", "bone-300", "bone-400"] },
  { group: "Accents", tokens: ["honey", "honey-soft", "sage", "blush", "petal"] },
];

/** Friendly names for the swatch tooltips. */
export function tokenLabel(token: string) {
  return token.replace(/-/g, " ").replace(/^ink$/, "ink (adapts to dark sections)");
}

/**
 * The raw palette values from app/globals.css. Tailwind only outputs the
 * colour variables the site already uses, so a swatch nobody has used yet
 * (petal, say) needs its value spelled out until the class lands in the code.
 */
const HEX: Record<string, string> = {
  "bone-50": "#fbf6ea",
  "bone-100": "#f7f1e2",
  "bone-200": "#f4ecd8",
  "bone-300": "#ece1cb",
  "bone-400": "#e5d8be",
  "sienna-300": "#b79a78",
  "sienna-500": "#8b5e3c",
  "sienna-700": "#6a3f22",
  "sienna-800": "#4a2a14",
  "sienna-900": "#3b1d04",
  honey: "#c8a053",
  "honey-soft": "#dcbc82",
  sage: "#6b7c4a",
  blush: "#d4a89a",
  petal: "#e6c9b8"
};

export function cssValue(v: ColorValue) {
  if ("hex" in v) return v.hex;
  const fallback = HEX[v.token];
  return fallback ? `var(--color-${v.token}, ${fallback})` : `var(--color-${v.token})`;
}

/** The Tailwind class that sets this colour, e.g. text-sienna-700 or bg-[#a1b2c3]. */
export function classFor(target: ColorTarget, v: ColorValue) {
  const prefix = TARGETS.find((t) => t.id === target)!.prefix;
  return "token" in v ? `${prefix}-${v.token}` : `${prefix}-[${v.hex}]`;
}

export function styleProp(target: ColorTarget) {
  return target === "text" ? "color" : target === "fill" ? "backgroundColor" : "borderColor";
}

/** "rgb(12, 34, 56)" → "#0c2238". The eyedropper returns hex already. */
export function toHex(css: string) {
  const m = css.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return css;
  return `#${m
    .slice(0, 3)
    .map((n) => Math.round(Number(n)).toString(16).padStart(2, "0"))
    .join("")}`;
}

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };

/** The browser eyedropper — samples any pixel on screen. Chrome and Edge on a
 *  computer have it; Safari and phones don't, so callers fall back to the
 *  colour picker (whose own panel includes an eyedropper in Chrome). */
export function eyeDropper(): EyeDropperCtor | null {
  return typeof window !== "undefined" && "EyeDropper" in window
    ? (window as unknown as { EyeDropper: EyeDropperCtor }).EyeDropper
    : null;
}
