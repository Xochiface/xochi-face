"use client";

import { useState } from "react";

import { UI_ATTR } from "./dom";
import {
  cssValue,
  eyeDropper,
  SWATCHES,
  TARGETS,
  tokenLabel,
  type ColorTarget,
  type ColorValue,
} from "./palette";

const ui = { [UI_ATTR]: "" };

/**
 * The colour chooser. Brand swatches first; an eyedropper for anything on the
 * screen (where the browser has one); a full picker for everything else.
 *
 * `targets` limits what can be coloured — an added ornament only has one
 * colour, a heading has text, fill and border.
 */
export function ColorPanel({
  targets = ["text", "fill", "border"],
  current,
  onPick,
  onClose,
  style,
}: {
  targets?: ColorTarget[];
  current: (target: ColorTarget) => ColorValue | null;
  onPick: (target: ColorTarget, value: ColorValue | null) => void;
  onClose: () => void;
  style?: React.CSSProperties;
}) {
  const [target, setTarget] = useState<ColorTarget>(targets[0]);
  const [error, setError] = useState<string | null>(null);
  const Dropper = eyeDropper();
  const selected = current(target);

  async function sample() {
    if (!Dropper) return;
    setError(null);
    try {
      const { sRGBHex } = await new Dropper().open();
      onPick(target, { hex: sRGBHex });
    } catch {
      /* closed with Esc — nothing to do */
    }
  }

  const isSelected = (v: ColorValue) =>
    !!selected &&
    (("token" in v && "token" in selected && v.token === selected.token) ||
      ("hex" in v && "hex" in selected && v.hex === selected.hex));

  return (
    <div
      {...ui}
      className="font-label fixed z-[94] w-[17.5rem] rounded-lg bg-[#2c1503] p-3 text-[0.6875rem] text-[#f7f1e2] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]"
      style={style}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        {targets.length > 1 ? (
          <div className="flex gap-0.5 rounded-md bg-white/5 p-0.5">
            {TARGETS.filter((t) => targets.includes(t.id)).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTarget(t.id)}
                className={`rounded px-2.5 py-1 uppercase tracking-[0.12em] ${
                  target === t.id ? "bg-[#f7f1e2] text-[#2c1503]" : "hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="uppercase tracking-[0.14em] text-[#dcbc82]">Colour</span>
        )}
        <button type="button" onClick={onClose} aria-label="Close colours" className="px-1.5 text-sm">
          ×
        </button>
      </div>

      {SWATCHES.map((group) => (
        <div key={group.group} className="mt-3">
          <p className="mb-1.5 uppercase tracking-[0.14em] text-[#dcbc82]/80">{group.group}</p>
          <div className="flex flex-wrap gap-1.5">
            {group.tokens.map((token) => (
              <button
                key={token}
                type="button"
                title={tokenLabel(token)}
                aria-label={tokenLabel(token)}
                onClick={() => onPick(target, { token })}
                className={`h-7 w-7 rounded-full border border-white/25 ${
                  isSelected({ token }) ? "ring-2 ring-[#c8a053] ring-offset-2 ring-offset-[#2c1503]" : ""
                }`}
                style={{ background: cssValue({ token }) }}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-3">
        {Dropper ? (
          <button
            type="button"
            onClick={sample}
            className="rounded-md bg-white/10 px-2.5 py-1.5 hover:bg-white/20"
            title="Pick any colour on the screen"
          >
            ⌖ Eyedropper
          </button>
        ) : null}
        <label
          className="flex cursor-pointer items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 hover:bg-white/20"
          title={Dropper ? "Choose any colour" : "Choose any colour — this browser has no eyedropper, but the picker may"}
        >
          <span
            className="h-3.5 w-3.5 rounded-full border border-white/40"
            style={{ background: selected && "hex" in selected ? selected.hex : "transparent" }}
          />
          Custom
          <input
            type="color"
            className="sr-only"
            value={selected && "hex" in selected ? selected.hex : "#8b5e3c"}
            onChange={(e) => onPick(target, { hex: e.target.value })}
          />
        </label>
        <button
          type="button"
          onClick={() => onPick(target, null)}
          disabled={!selected}
          className="ml-auto rounded-md px-2 py-1.5 hover:bg-white/10 disabled:opacity-30"
        >
          Clear
        </button>
      </div>
      {error ? <p className="mt-2 text-[#f0a493]">{error}</p> : null}
    </div>
  );
}
