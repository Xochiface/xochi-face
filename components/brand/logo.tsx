import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The portrait mark.
 *
 * Masked rather than drawn as an <img> so it inherits `currentColor` and works
 * in both reading directions. Kept deliberately standalone and unstyled beyond
 * size — it is the intended subject of the animated landing sequence, so it
 * should stay easy to isolate, scale, and hand to a motion layer.
 *
 * Minimum height per the kit is 80px digital; below that use the wordmark alone.
 */
export function PortraitMark({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Xochi Face"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: size,
        height: size,
        maskImage: "url(/brand/mark/portrait-mark.png)",
        WebkitMaskImage: "url(/brand/mark/portrait-mark.png)",
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

/**
 * The wordmark is live text, not artwork — the kit sets it in Fraunces
 * Light/350. Rendering it as text keeps it selectable, searchable, and crisp
 * at any size.
 *
 * The string comes from content/site.ts so there is one place to change it.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[1.75rem] leading-none font-[350] tracking-[-0.01em]",
        className,
      )}
    >
      {site.wordmark}
    </span>
  );
}

/**
 * The primary lockup — portrait, wordmark, and the practice line stacked.
 * The kit reserves this for covers, signage, and anywhere with room to breathe.
 * Clear space equals one x-height of the wordmark.
 */
export function Lockup({
  markSize = 120,
  className,
}: {
  markSize?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <PortraitMark size={markSize} />
      <Wordmark />
      <span className="label-caps text-ink-soft">lymphatic facials</span>
    </div>
  );
}
