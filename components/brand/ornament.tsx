import { cn } from "@/lib/utils";

/**
 * The garden ornament suite — twelve linocut motifs from the brand kit.
 *
 * The source PNGs are Sienna 900 on transparent. Rather than ship a tinted
 * copy per surface, each is used as a CSS mask so the motif takes
 * `currentColor` — one asset, every direction, grain preserved.
 *
 * `flower-04` is a placeholder name: the kit names eleven of the twelve.
 */
export const ORNAMENTS = [
  "xochitl",
  "six-petal",
  "marigold",
  "flower-04",
  "branch",
  "agave",
  "seed",
  "sprout",
  "sun",
  "double-moon",
  "hummingbird",
  "offering",
] as const;

export type OrnamentName = (typeof ORNAMENTS)[number];

export function Ornament({
  name,
  size = 24,
  className,
}: {
  name: OrnamentName;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: size,
        height: size,
        maskImage: `url(/brand/ornaments/${name}.png)`,
        WebkitMaskImage: `url(/brand/ornaments/${name}.png)`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

export const BORDERS = ["stepped-fret", "floral", "marigold-chain"] as const;

export type BorderName = (typeof BORDERS)[number];

/**
 * A repeating border strip. Tiles horizontally at whatever height it is
 * given, so it can run as a hairline rule or a full ornamental band.
 */
export function BorderStrip({
  name,
  height = 16,
  className,
}: {
  name: BorderName;
  height?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("w-full bg-current", className)}
      style={{
        height,
        maskImage: `url(/brand/borders/${name}.png)`,
        WebkitMaskImage: `url(/brand/borders/${name}.png)`,
        maskSize: "auto 100%",
        WebkitMaskSize: "auto 100%",
        maskRepeat: "repeat-x",
        WebkitMaskRepeat: "repeat-x",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
