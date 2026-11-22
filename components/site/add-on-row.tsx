import { Ornament } from "@/components/brand/ornament";
import type { AddOn } from "@/content/site";

/**
 * An add-on, set as a quiet strip beneath the service cards: it is booked
 * alongside a facial, so it should read as secondary to them.
 *
 * `compact` is the Home version: the first sentence of the summary, labelled
 * and explained. The Book page shows the whole summary under its own "Add to
 * any facial" heading, so it skips the label and the availability line.
 */
export function AddOnRow({
  addOn,
  compact = false,
}: {
  addOn: AddOn;
  compact?: boolean;
}) {
  const summary = compact ? firstSentence(addOn.summary) : addOn.summary;

  return (
    <div
      id={compact ? undefined : addOn.slug}
      className="grid scroll-mt-28 gap-6 rounded-md border border-rule/40 p-8 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-10"
    >
      <div className="text-honey">
        <Ornament name={addOn.ornament} size={36} />
      </div>

      <div>
        {compact ? <p className="label-caps text-ink-soft mb-3">Add-on</p> : null}
        <h3 className="font-display text-ink text-[1.6875rem] leading-[1.15] font-[350]">
          {addOn.name}
        </h3>
        <p className="text-body text-ink-muted mt-4 max-w-2xl italic">
          {compact ? `${summary} ${addOn.availability}` : summary}
        </p>
      </div>

      <div className="flex items-baseline gap-6 border-t border-rule/40 pt-5 md:flex-col md:items-end md:gap-2 md:border-t-0 md:pt-0">
        <span className="font-display text-ink text-2xl font-[350]">
          {addOn.price}
        </span>
        <span className="label-caps text-ink-soft">{addOn.duration}</span>
      </div>
    </div>
  );
}

function firstSentence(text: string) {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}
