"use client";

import { useState } from "react";

import { PortraitMark } from "@/components/brand/logo";
import { BORDERS, BorderStrip, ORNAMENTS, Ornament, type BorderName, type OrnamentName } from "@/components/brand/ornament";
import { site } from "@/content/site";

import { ColorPanel } from "./color-panel";
import { UI_ATTR } from "./dom";
import { cssValue, type ColorValue } from "./palette";
import { updatePage, type Insert } from "./store";

const ui = { [UI_ATTR]: "" };

/** What the Add menu offers. Photos are picked from the device first. */
export type AddChoice = { kind: Insert["kind"]; name: string };

const TEXT_STYLES: { name: string; label: string; className: string }[] = [
  { name: "heading", label: "Heading", className: "text-title text-ink" },
  { name: "paragraph", label: "Paragraph", className: "text-body text-ink-muted italic" },
  { name: "label", label: "Small label", className: "label-caps text-ink-soft" },
];

/** Sensible starting widths, in pixels. */
export const DEFAULT_WIDTH: Record<Insert["kind"], number> = {
  photo: 320,
  ornament: 56,
  border: 320,
  logo: 96,
  text: 360,
};

/** Ornaments, borders and the mark take the honey accent until recoloured;
 *  text and the wordmark start in ink, like the page around them. */
function defaultColor(item: Insert): string {
  return item.kind === "ornament" || item.kind === "border" ? "var(--color-honey)" : "var(--color-ink)";
}

/* -------------------------------------------------------------------------- */
/* The Add menu                                                               */
/* -------------------------------------------------------------------------- */

export function AddPanel({
  onChoose,
  onClose,
}: {
  onChoose: (choice: AddChoice) => void;
  onClose: () => void;
}) {
  const tile =
    "flex flex-col items-center justify-center gap-1 rounded-md bg-white/5 p-2 text-[0.625rem] hover:bg-white/15";
  return (
    <div
      {...ui}
      className="font-label pointer-events-auto max-h-[60vh] w-[22rem] max-w-full overflow-y-auto rounded-lg bg-[#2c1503] p-3 text-[0.6875rem] text-[#f7f1e2] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]"
      data-lenis-prevent
    >
      <div className="flex items-center justify-between">
        <span className="uppercase tracking-[0.14em] text-[#dcbc82]">Add to the page</span>
        <button type="button" onClick={onClose} aria-label="Close" className="px-1.5 text-sm">
          ×
        </button>
      </div>

      <p className="mt-3 mb-1.5 uppercase tracking-[0.14em] text-[#dcbc82]/80">Photo &amp; text</p>
      <div className="grid grid-cols-4 gap-1.5">
        <button type="button" className={tile} onClick={() => onChoose({ kind: "photo", name: "photo" })}>
          <span className="text-base">⇪</span>
          Photo
        </button>
        {TEXT_STYLES.map((t) => (
          <button key={t.name} type="button" className={tile} onClick={() => onChoose({ kind: "text", name: t.name })}>
            <span className="text-base">T</span>
            {t.label}
          </button>
        ))}
      </div>

      <p className="mt-3 mb-1.5 uppercase tracking-[0.14em] text-[#dcbc82]/80">Logo</p>
      <div className="grid grid-cols-4 gap-1.5">
        <button type="button" className={tile} onClick={() => onChoose({ kind: "logo", name: "mark" })}>
          <PortraitMark size={30} className="text-[#f7f1e2]" />
          Mark
        </button>
        <button type="button" className={tile} onClick={() => onChoose({ kind: "logo", name: "wordmark" })}>
          <span className="font-display text-lg leading-none">{site.wordmark}</span>
          Wordmark
        </button>
      </div>

      <p className="mt-3 mb-1.5 uppercase tracking-[0.14em] text-[#dcbc82]/80">Ornaments</p>
      <div className="grid grid-cols-6 gap-1.5">
        {ORNAMENTS.map((name) => (
          <button
            key={name}
            type="button"
            title={name.replace(/-/g, " ")}
            aria-label={name.replace(/-/g, " ")}
            className={`${tile} aspect-square`}
            onClick={() => onChoose({ kind: "ornament", name })}
          >
            <Ornament name={name} size={26} className="text-[#dcbc82]" />
          </button>
        ))}
      </div>

      <p className="mt-3 mb-1.5 uppercase tracking-[0.14em] text-[#dcbc82]/80">Borders</p>
      <div className="grid gap-1.5">
        {BORDERS.map((name) => (
          <button
            key={name}
            type="button"
            className={`${tile} items-stretch`}
            onClick={() => onChoose({ kind: "border", name })}
          >
            <BorderStrip name={name} height={12} className="text-[#dcbc82]" />
            <span className="text-center">{name.replace(/-/g, " ")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* An added item on the page                                                  */
/* -------------------------------------------------------------------------- */

export function InsertItem({
  item,
  path,
  active,
  selected,
  onSelect,
  onGuide,
}: {
  item: Insert;
  path: string;
  /** Edit mode is on: the item can be selected and changed. */
  active: boolean;
  selected: boolean;
  onSelect: (id: string | null) => void;
  /** Shows the Shift-drag guide line, shared with the page's own elements. */
  onGuide: (guide: { axis: "x" | "y"; at: number } | null) => void;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [colours, setColours] = useState<{ top: number; left: number } | null>(null);
  const [editing, setEditing] = useState(false);
  const x = pos?.x ?? item.x;
  const y = pos?.y ?? item.y;
  const color = item.color ? cssValue(item.color) : defaultColor(item);

  function update(patch: Partial<Insert>) {
    updatePage(path, (p) => ({ ...p, inserts: p.inserts.map((i) => (i.id === item.id ? { ...i, ...patch } : i)) }));
  }

  function remove() {
    updatePage(path, (p) => ({ ...p, inserts: p.inserts.filter((i) => i.id !== item.id) }));
    onSelect(null);
  }

  function startDrag(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    onSelect(item.id);
    const sx = e.pageX;
    const sy = e.pageY;
    let nx = item.x;
    let ny = item.y;
    const onMove = (ev: PointerEvent) => {
      let mx = ev.pageX - sx;
      let my = ev.pageY - sy;
      if (ev.shiftKey) {
        if (Math.abs(mx) >= Math.abs(my)) my = 0;
        else mx = 0;
      }
      nx = Math.round(item.x + mx);
      ny = Math.round(item.y + my);
      setPos({ x: nx, y: ny });
      onGuide(
        ev.shiftKey
          ? mx !== 0
            ? { axis: "x", at: ny - window.scrollY }
            : { axis: "y", at: nx - window.scrollX }
          : null,
      );
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      onGuide(null);
      setPos(null);
      update({ x: nx, y: ny });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const resize = (factor: number) => update({ w: Math.max(16, Math.round(item.w * factor)) });
  const tool = "rounded-md px-2 py-1 text-[0.6875rem] hover:bg-white/15";

  return (
    <div
      {...ui}
      data-insert={item.id}
      className={`absolute z-[84] ${active ? "cursor-pointer" : "pointer-events-none"}`}
      style={{ top: y, left: x, width: item.w, color }}
      onClick={(e) => {
        if (!active) return;
        e.stopPropagation();
        onSelect(item.id);
      }}
      onDoubleClick={(e) => {
        if (!active || item.kind !== "text") return;
        e.stopPropagation();
        setEditing(true);
      }}
    >
      {selected && active ? (
        <div className="pointer-events-none absolute -inset-1.5 rounded-sm outline outline-2 outline-[#c8a053]" />
      ) : null}

      <Body item={item} editing={editing} onText={(text) => { update({ text }); setEditing(false); }} />

      {selected && active ? (
        <div
          className="font-label absolute bottom-full left-0 mb-2.5 flex items-center gap-0.5 whitespace-nowrap rounded-lg bg-[#2c1503] p-1 text-[#f7f1e2] shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="px-1.5 text-[0.625rem] uppercase text-[#dcbc82]">
            {item.kind === "photo" ? "photo" : item.name.replace(/-/g, " ")}
          </span>
          <button type="button" onPointerDown={startDrag} className={`${tool} cursor-grab`} title="Drag to move — hold Shift to keep it straight">
            ⠿ Move
          </button>
          <button type="button" className={tool} onClick={() => resize(0.9)} title="Smaller">
            −
          </button>
          <button type="button" className={tool} onClick={() => resize(1.1)} title="Larger">
            +
          </button>
          {item.kind === "text" ? (
            <button type="button" className={tool} onClick={() => setEditing(true)}>
              ✎ Text
            </button>
          ) : null}
          {item.kind !== "photo" ? (
            <button
              type="button"
              className={tool}
              onClick={(e) => {
                const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setColours(colours ? null : { top: r.bottom + 8, left: Math.min(r.left, window.innerWidth - 296) });
              }}
            >
              ◐ Colour
            </button>
          ) : null}
          <button type="button" className={`${tool} hover:text-[#f0a493]`} onClick={remove}>
            Delete
          </button>
        </div>
      ) : null}

      {selected && active && colours ? (
        <ColorPanel
          targets={["text"]}
          current={() => item.color}
          onPick={(_, value: ColorValue | null) => update({ color: value })}
          onClose={() => setColours(null)}
          style={{ top: colours.top, left: colours.left }}
        />
      ) : null}
    </div>
  );
}

function Body({ item, editing, onText }: { item: Insert; editing: boolean; onText: (text: string) => void }) {
  switch (item.kind) {
    case "photo":
      // An uploaded preview from the local dev server — next/image has nothing to optimise here.
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={item.src ?? ""} alt="" className="block h-auto w-full rounded-md" draggable={false} />;
    case "ornament":
      return <Ornament name={item.name as OrnamentName} size={item.w} />;
    case "border":
      return <BorderStrip name={item.name as BorderName} height={Math.max(8, Math.round(item.w / 18))} />;
    case "logo":
      return item.name === "mark" ? (
        <PortraitMark size={item.w} />
      ) : (
        <span className="font-display block leading-none font-[350]" style={{ fontSize: item.w / 2.6 }}>
          {site.wordmark}
        </span>
      );
    case "text": {
      const style = TEXT_STYLES.find((t) => t.name === item.name) ?? TEXT_STYLES[1];
      return (
        <p
          className={style.className}
          style={{ color: "inherit" }}
          contentEditable={editing}
          suppressContentEditableWarning
          ref={(el) => {
            if (editing && el && document.activeElement !== el) el.focus();
          }}
          onBlur={(e) => onText(e.currentTarget.textContent ?? "")}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              (e.currentTarget as HTMLElement).blur();
            }
          }}
        >
          {item.text}
        </p>
      );
    }
  }
}
