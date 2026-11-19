"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { ColorPanel } from "./color-panel";

import {
  UI_ATTR,
  applyMedia,
  applyPage,
  computedFontPx,
  describe,
  editTextInPlace,
  isEditUi,
  markOriginal,
  measure,
  find,
  pickAt,
  pickFile,
  plainText,
  resetElement,
  restoreMedia,
  setBodyCursor,
  setColor,
  setDeleted,
  setFontPx,
  setTranslate,
  slotOf,
  type Box,
} from "./dom";
import { AddPanel, DEFAULT_WIDTH, InsertItem, type AddChoice } from "./inserts";
import { classFor, type ColorTarget, type ColorValue } from "./palette";
import {
  accessStore,
  clearAll,
  countChanges,
  editStore,
  getState,
  markSaved,
  processAccessParam,
  removeApplied,
  updatePage,
  type EditState,
  type Insert,
  type MediaEdit,
  type Note,
} from "./store";

/**
 * Private edit mode.
 *
 * A button at the bottom of every page. In edit mode you can click any text to
 * select it, double-click to rewrite it, drag to move it (Shift keeps the drag
 * straight), resize it, recolour it, delete it, replace photos, add new
 * photos, logos, ornaments and text ("+ Add"), and pin notes anywhere.
 * Edits are a working draft kept in this browser until "Save changes":
 *
 *   - running locally (npm run dev): text, photos and simple deletions are
 *     published straight into the code and committed (lib/edits/apply.ts);
 *     the rest is written to edits/ for a developer.
 *   - on the live site: everything downloads as a file to send over.
 *
 * Nothing here can change the live site for anyone else.
 *
 * Visibility: always on in development. On the live site it is hidden unless
 * this browser has been switched on with ?xochi-edit (and off with
 * ?xochi-edit=off). See EDITING.md.
 */

const PAGES: [string, string][] = [
  ["/", "Home"],
  ["/about", "About"],
  ["/book", "Book"],
];

const ui = { [UI_ATTR]: "" };

export function EditMode() {
  const hasAccess = useSyncExternalStore(
    accessStore.subscribe,
    accessStore.getSnapshot,
    accessStore.getServerSnapshot,
  );
  useEffect(() => processAccessParam(), []);
  return hasAccess ? <EditTools /> : null;
}

type Selection = { el: HTMLElement; path: string; box: Box };

function EditTools() {
  const pathname = usePathname();
  const router = useRouter();
  const edits = useSyncExternalStore(editStore.subscribe, editStore.getSnapshot, editStore.getServerSnapshot);
  const page = edits.pages[pathname];

  const [active, setActive] = useState(false);
  const [rawSelection, setSelection] = useState<Selection | null>(null);
  const [hover, setHover] = useState<Box | null>(null);
  const [placingNote, setPlacingNote] = useState(false);
  // "+ Add": the menu, the item waiting to be placed, and the selected one.
  const [addOpen, setAddOpen] = useState(false);
  const [placing, setPlacing] = useState<Omit<Insert, "id" | "x" | "y" | "near"> | null>(null);
  const [selectedInsert, setSelectedInsert] = useState<string | null>(null);
  const [colorsOpen, setColorsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [saving, setSaving] = useState(false);
  // A straight-line guide while Shift-dragging: which way, and where.
  const [guide, setGuide] = useState<{ axis: "x" | "y"; at: number } | null>(null);

  // A selection belongs to the page it was made on.
  const selection = rawSelection?.path === pathname ? rawSelection : null;
  const changes = countChanges(edits);

  /* Apply the saved draft whenever a page opens, and restyle on every edit. */
  useEffect(() => {
    const t = setTimeout(() => applyPage(getState().pages[pathname], { includeText: true }), 80);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    applyPage(page, { includeText: false });
  }, [page]);

  useEffect(() => {
    setBodyCursor(active && (placingNote || placing) ? "crosshair" : "");
    return () => setBodyCursor("");
  }, [active, placingNote, placing]);

  /* ---------------------------------------------------------------------- */
  /* Recording edits                                                         */
  /* ---------------------------------------------------------------------- */

  function refresh(el: HTMLElement) {
    setSelection({ el, path: pathname, box: measure(el) });
  }

  function editText(el: HTMLElement) {
    if (el instanceof HTMLImageElement) return;
    const path = pathname;
    editTextInPlace(el, (before, after) => {
      const selector = describe(el).selector;
      const original = getState().pages[path]?.text[selector]?.original ?? before;
      const unchanged = after.trim() === original.trim();
      // Remember the source wording before describing, so the record — and
      // anything later described inside this section — names the original.
      markOriginal(el, unchanged ? null : original);
      const ref = describe(el);
      updatePage(path, (p) => {
        const text = { ...p.text };
        if (unchanged) delete text[selector];
        else text[selector] = { ref, original, edited: after };
        return { ...p, text };
      });
      refresh(el);
    });
  }

  function moveBy(el: HTMLElement, ddx: number, ddy: number) {
    const ref = describe(el);
    const cur = getState().pages[pathname]?.moves[ref.selector];
    commitMove(el, (cur?.dx ?? 0) + ddx, (cur?.dy ?? 0) + ddy);
  }

  function commitMove(el: HTMLElement, dx: number, dy: number) {
    const ref = describe(el);
    setTranslate(el, dx, dy);
    updatePage(pathname, (p) => {
      const moves = { ...p.moves };
      if (!dx && !dy) delete moves[ref.selector];
      else moves[ref.selector] = { ref: moves[ref.selector]?.ref ?? ref, dx, dy };
      return { ...p, moves };
    });
    refresh(el);
  }

  function startDrag(e: React.PointerEvent, el: HTMLElement) {
    e.preventDefault();
    const ref = describe(el);
    const cur = getState().pages[pathname]?.moves[ref.selector];
    const baseX = cur?.dx ?? 0;
    const baseY = cur?.dy ?? 0;
    const startX = e.clientX;
    const startY = e.clientY;
    let dx = baseX;
    let dy = baseY;
    const onMove = (ev: PointerEvent) => {
      let mx = ev.clientX - startX;
      let my = ev.clientY - startY;
      // Shift keeps the move straight: whichever way it has gone further wins.
      if (ev.shiftKey) {
        if (Math.abs(mx) >= Math.abs(my)) my = 0;
        else mx = 0;
      }
      dx = Math.round(baseX + mx);
      dy = Math.round(baseY + my);
      setTranslate(el, dx, dy);
      const box = measure(el);
      setGuide(
        ev.shiftKey
          ? mx !== 0
            ? { axis: "x", at: box.top + box.height / 2 }
            : { axis: "y", at: box.left + box.width / 2 }
          : null,
      );
      refresh(el);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setGuide(null);
      commitMove(el, dx, dy);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function resize(el: HTMLElement, delta: number) {
    const ref = describe(el);
    updatePage(pathname, (p) => {
      const size = { ...p.size };
      const cur = size[ref.selector];
      const basePx = cur?.basePx ?? computedFontPx(el);
      const factor = Math.round(((cur?.factor ?? 1) + delta) * 100) / 100;
      if (factor === 1) {
        delete size[ref.selector];
        setFontPx(el, null);
      } else {
        size[ref.selector] = { ref: cur?.ref ?? ref, basePx, factor };
        setFontPx(el, Math.round(basePx * factor * 10) / 10);
      }
      return { ...p, size };
    });
    refresh(el);
  }

  function deleteElement(el: HTMLElement) {
    const ref = describe(el);
    const text = el.dataset.xochiOriginal ?? plainText(el);
    setDeleted(el, true);
    updatePage(pathname, (p) => ({ ...p, deleted: { ...p.deleted, [ref.selector]: { ref, text } } }));
    setSelection(null);
    setHover(null);
    flash("Deleted. “Undo delete” in the bar brings it back.", 4000);
  }

  /** Brings back the most recent deletion on this page. */
  function undoDelete() {
    const deleted = getState().pages[pathname]?.deleted ?? {};
    const last = Object.keys(deleted).at(-1);
    if (!last) return;
    const el = find(last);
    if (el) setDeleted(el, false);
    updatePage(pathname, (p) => {
      const next = { ...p.deleted };
      delete next[last];
      return { ...p, deleted: next };
    });
    if (el) refresh(el);
  }

  function flash(message: string, ms = 6000) {
    setToast(message);
    setTimeout(() => setToast(null), ms);
  }

  function replaceMedia(img: HTMLImageElement) {
    const path = pathname;
    pickFile("image/*,video/*", async (file) => {
      const { slot, slotFile, needs } = slotOf(img);
      setToast(`Uploading ${file.name}…`);

      const body = new FormData();
      body.append("file", file);
      body.append("slot", slot ?? "photo");

      let res: Response;
      try {
        res = await fetch("/api/edits/media", { method: "POST", body });
      } catch {
        flash("Upload failed — is the dev server still running?");
        return;
      }
      if (res.status === 404) {
        flash("Photo uploads only work while running the site locally. Send the photo along with your saved edits instead.", 9000);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        flash(data.error ?? "That upload didn't work.");
        return;
      }

      // Honest notes about fit, shown now and carried into the package.
      const warnings: string[] = [];
      if (data.note) warnings.push(data.note);
      if (data.kind === "image" && needs && data.width && data.height) {
        if (data.width < needs.width || data.height < needs.height) {
          warnings.push(
            `This photo is ${data.width}×${data.height}; this spot is best at ${needs.width}×${needs.height} or larger, so it may look slightly soft.`,
          );
        }
        const want = needs.width / needs.height;
        const have = data.width / data.height;
        if (Math.abs(have - want) / want > 0.04) {
          warnings.push("It's a different shape from this spot, so it will be cropped to fit — the preview shows roughly what stays.");
        }
      }
      if (data.kind === "video" && data.bytes > 40 * 1024 * 1024) {
        warnings.push(`At ${Math.round(data.bytes / 1024 / 1024)}MB this video is heavy for a website; it will be trimmed and compressed.`);
      }

      const ref = describe(img);
      const media: MediaEdit = {
        ref,
        slot,
        slotFile,
        needs,
        kind: data.kind,
        file: data.file,
        original: data.original,
        preview: data.preview,
        originalName: data.originalName,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
        converted: !!data.converted,
        warnings,
      };
      applyMedia(img, media.kind, media.preview);
      updatePage(path, (p) => ({ ...p, media: { ...p.media, [ref.selector]: media } }));
      refresh(img);
      flash(warnings.length ? `Replaced. ${warnings.join(" ")}` : "Replaced.", warnings.length ? 11000 : 4000);
    });
  }

  function reset(el: HTMLElement) {
    const ref = describe(el);
    const k = ref.selector;
    const original = getState().pages[pathname]?.text[k]?.original;
    resetElement(el, original);
    updatePage(pathname, (p) => {
      const strip = <T,>(rec: Record<string, T>) => {
        const next = { ...rec };
        delete next[k];
        return next;
      };
      const colors = Object.fromEntries(Object.entries(p.colors).filter(([key]) => !key.startsWith(`${k}|`)));
      return { ...p, text: strip(p.text), moves: strip(p.moves), size: strip(p.size), deleted: strip(p.deleted), media: strip(p.media), colors };
    });
    refresh(el);
  }

  /* Colour ---------------------------------------------------------------- */

  const colorKey = (selector: string, target: ColorTarget) => `${selector}|${target}`;

  function currentColor(el: HTMLElement, target: ColorTarget): ColorValue | null {
    const key = colorKey(describe(el).selector, target);
    return getState().pages[pathname]?.colors?.[key]?.value ?? null;
  }

  function recolor(el: HTMLElement, target: ColorTarget, value: ColorValue | null) {
    const ref = describe(el);
    const key = colorKey(ref.selector, target);
    const text = el.dataset.xochiOriginal ?? plainText(el);
    setColor(el, target, value);
    updatePage(pathname, (p) => {
      const colors = { ...p.colors };
      if (value) colors[key] = { ref, text, target, value };
      else delete colors[key];
      return { ...p, colors };
    });
  }

  /* Adding new things ------------------------------------------------------ */

  function chooseToAdd(choice: AddChoice) {
    setAddOpen(false);
    setSelection(null);
    const base = { kind: choice.kind, name: choice.name, w: DEFAULT_WIDTH[choice.kind], color: null, text: "", src: null, file: null };
    if (choice.kind === "text") {
      setPlacing({ ...base, text: choice.name === "label" ? "A new label" : choice.name === "heading" ? "a new heading." : "New words here." });
      return;
    }
    if (choice.kind !== "photo") {
      setPlacing(base);
      return;
    }
    pickFile("image/*", async (file) => {
      setToast(`Uploading ${file.name}…`);
      const body = new FormData();
      body.append("file", file);
      body.append("slot", "added");
      let res: Response;
      try {
        res = await fetch("/api/edits/media", { method: "POST", body });
      } catch {
        flash("Upload failed — is the dev server still running?");
        return;
      }
      if (res.status === 404) {
        flash("Photo uploads only work while running the site locally.", 8000);
        return;
      }
      const data = await res.json();
      if (!res.ok || data.kind !== "image") {
        flash(data.error ?? "That needs to be a photo.");
        return;
      }
      setPlacing({ ...base, src: data.preview, file: data.file });
      flash("Now click where the photo should go.", 5000);
    });
  }

  function placeAt(pageX: number, pageY: number, near: Element | null) {
    if (!placing) return;
    const item: Insert = {
      ...placing,
      id: Math.random().toString(36).slice(2, 9),
      x: Math.round(pageX),
      y: Math.round(pageY),
      near: near && !isEditUi(near) ? describe(near) : null,
    };
    updatePage(pathname, (p) => ({ ...p, inserts: [...p.inserts, item] }));
    setPlacing(null);
    setSelectedInsert(item.id);
  }

  function addNote(x: number, y: number, near: Element | null) {
    const note: Note = {
      id: Math.random().toString(36).slice(2, 9),
      x: Math.round(x),
      y: Math.round(y),
      text: "",
      near: near && !isEditUi(near) ? describe(near) : null,
    };
    updatePage(pathname, (p) => ({ ...p, notes: [...p.notes, note] }));
  }

  /* ---------------------------------------------------------------------- */
  /* Page interaction while editing                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!active) return;

    // Capture phase, ahead of React and Next's <Link>: in edit mode a click
    // selects; it never navigates or submits.
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isEditUi(target) || (target as HTMLElement).isContentEditable) return;
      e.preventDefault();
      e.stopPropagation();
      setColorsOpen(false);
      setSelectedInsert(null);
      // Page position from the viewport position plus scroll: the same thing
      // as pageX/pageY for a real click, and also right for synthetic ones.
      const px = e.clientX + window.scrollX;
      const py = e.clientY + window.scrollY;
      if (placing) {
        placeAt(px, py, target);
        return;
      }
      if (placingNote) {
        addNote(px, py, target);
        setPlacingNote(false);
        return;
      }
      const el = pickAt(target, e.clientX, e.clientY);
      setSelection(el ? { el, path: pathname, box: measure(el) } : null);
    };

    const onDblClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isEditUi(target)) return;
      e.preventDefault();
      const el = pickAt(target, e.clientX, e.clientY);
      if (el) {
        setSelection({ el, path: pathname, box: measure(el) });
        editText(el);
      }
    };

    const onMove = (e: MouseEvent) => {
      const el = pickAt(e.target as Element, e.clientX, e.clientY);
      setHover(el ? measure(el) : null);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPlacingNote(false);
        setPlacing(null);
        setAddOpen(false);
        setColorsOpen(false);
        setSelection(null);
        setSelectedInsert(null);
        return;
      }
      const step = e.shiftKey ? 10 : 1;
      const arrows: Record<string, [number, number]> = {
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
      };
      const d = arrows[e.key];
      if (d && rawSelection && rawSelection.path === pathname) {
        e.preventDefault();
        moveBy(rawSelection.el, d[0], d[1]);
      }
    };

    const onScroll = () => {
      setHover(null);
      setSelection((s) => (s ? { ...s, box: measure(s.el) } : s));
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("dblclick", onDblClick, true);
    document.addEventListener("mousemove", onMove, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("dblclick", onDblClick, true);
      document.removeEventListener("mousemove", onMove, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // The handlers read the latest selection, page and note mode on each run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, placingNote, placing, pathname, rawSelection]);

  /* ---------------------------------------------------------------------- */
  /* Save / discard                                                          */
  /* ---------------------------------------------------------------------- */

  async function save() {
    setSaving(true);
    const pkg = buildPackage(getState());
    let reply: SaveReply | null = null;
    try {
      const res = await fetch("/api/edits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(pkg),
      });
      if (res.ok) reply = await res.json();
    } catch {
      /* no local server — fall through to a download */
    }

    if (!reply) {
      download(pkg);
      markSaved("your Downloads folder");
      setSaving(false);
      flash(`Saved ${pkg.changeCount} changes to your Downloads folder — send the file over to apply them.`, 8000);
      return;
    }

    // What was published is now in the code: let the page show the real
    // thing, and take it out of the draft so it isn't applied twice.
    for (const a of reply.applied) {
      if (a.page !== pathname) continue;
      const el = find(a.selector);
      if (!el) continue;
      if (a.kind === "text") markOriginal(el, null);
      if (a.kind === "media" && el instanceof HTMLImageElement) restoreMedia(el);
    }
    removeApplied(reply.applied);
    markSaved(reply.path);
    setSaving(false);
    setSelection(null);
    router.refresh();

    const published = reply.applied.length;
    const waiting = pkg.changeCount - published;
    const parts = [
      published
        ? `Published ${published} change${published > 1 ? "s" : ""} to the site.`
        : "Nothing could be published automatically.",
      waiting ? `${waiting} more saved for Claude to apply.` : "",
      reply.commitNote ?? "",
    ];
    flash(parts.filter(Boolean).join(" "), 10000);
  }

  function discard() {
    if (!confirmDiscard) {
      setConfirmDiscard(true);
      setTimeout(() => setConfirmDiscard(false), 4000);
      return;
    }
    clearAll();
    window.location.reload();
  }

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  const btn =
    "font-label rounded-pill px-3.5 py-2 text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-quick ease-exhale";

  return createPortal(
    <>
      {/* Notes for this page */}
      {page?.notes.map((note) => (
        <NoteCard key={note.id} note={note} path={pathname} />
      ))}

      {/* Things added with "+ Add" */}
      {page?.inserts.map((item) => (
        <InsertItem
          key={item.id}
          item={item}
          path={pathname}
          active={active}
          selected={selectedInsert === item.id}
          onSelect={(id) => {
            setSelectedInsert(id);
            setSelection(null);
          }}
          onGuide={setGuide}
        />
      ))}

      {/* Hover + selection outlines */}
      {active && hover && !placingNote && !placing ? (
        <div
          {...ui}
          className="pointer-events-none fixed z-[90] rounded-sm outline outline-1 outline-dashed outline-[#c8a053]"
          style={{ top: hover.top - 3, left: hover.left - 3, width: hover.width + 6, height: hover.height + 6 }}
        />
      ) : null}

      {active && selection ? (
        <SelectionTools
          selection={selection}
          onEditText={() => editText(selection.el)}
          onDrag={(e) => startDrag(e, selection.el)}
          onSize={(d) => resize(selection.el, d)}
          onDelete={() => deleteElement(selection.el)}
          onNote={() =>
            addNote(
              selection.box.left + selection.box.width + window.scrollX + 12,
              selection.box.top + window.scrollY,
              selection.el,
            )
          }
          onParent={() => {
            const parent = selection.el.parentElement;
            if (parent && parent !== document.body) refresh(parent);
          }}
          onReset={() => reset(selection.el)}
          onReplace={() => {
            if (selection.el instanceof HTMLImageElement) replaceMedia(selection.el);
          }}
          onColor={() => setColorsOpen((v) => !v)}
          onClose={() => {
            setSelection(null);
            setColorsOpen(false);
          }}
        />
      ) : null}

      {active && selection && colorsOpen ? (
        <ColorPanel
          current={(target) => currentColor(selection.el, target)}
          onPick={(target, value) => recolor(selection.el, target, value)}
          onClose={() => setColorsOpen(false)}
          style={{
            top: Math.min(Math.max(selection.box.top + 8, 64), window.innerHeight - 340),
            left: Math.max(8, Math.min(selection.box.left, window.innerWidth - 296)),
          }}
        />
      ) : null}

      {guide ? (
        <div
          {...ui}
          className="pointer-events-none fixed z-[93] border-dashed border-[#c8a053]"
          style={
            guide.axis === "x"
              ? { left: 0, right: 0, top: guide.at, borderTopWidth: 1 }
              : { top: 0, bottom: 0, left: guide.at, borderLeftWidth: 1 }
          }
        />
      ) : null}

      {/* Toast, hint and bar stack in one column, so a two-row bar never
          slides underneath the messages above it. */}
      <div
        {...ui}
        className="pointer-events-none fixed bottom-5 left-1/2 z-[95] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col items-center gap-2"
      >
        {/* Toast */}
        {toast ? (
          <div
            {...ui}
            role="status"
            className="bg-sienna-900 text-bone-100 shadow-lift font-label pointer-events-auto max-w-xl rounded-md px-5 py-3 text-center text-xs"
          >
            {toast}
          </div>
        ) : null}

        {active && placing ? (
          <p
            {...ui}
            className="font-label pointer-events-auto rounded-pill bg-[#c8a053] px-3 py-1 text-center text-[0.6875rem] tracking-wide text-[#2c1503]"
          >
            Click where it should go · Esc to cancel
          </p>
        ) : null}

        {active && addOpen ? <AddPanel onChoose={chooseToAdd} onClose={() => setAddOpen(false)} /> : null}

        {active && !selection && !placingNote && !placing && !addOpen ? (
          <p
            {...ui}
            className="font-label hidden rounded-pill bg-[#2c1503]/80 px-3 py-1 text-center text-[0.625rem] tracking-wide text-[#ece1cb] sm:block"
          >
            Click to select · double-click to rewrite · drag ⠿ to move (hold shift to keep it straight) · arrows nudge · Esc to deselect
          </p>
        ) : null}

        {/* Bottom bar */}
        <div
          {...ui}
          className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-[1.75rem] bg-[#2c1503]/95 p-1.5 text-[#f7f1e2] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur"
        >
          {!active ? (
            <button type="button" className={`${btn} hover:bg-white/10`} onClick={() => setActive(true)}>
              ✎ Edit
              {changes ? (
                <span className="ml-2 rounded-full bg-[#c8a053] px-2 py-0.5 text-[#2c1503]">{changes}</span>
              ) : null}
            </button>
          ) : (
            <>
              <span className="font-label px-2 text-[0.625rem] uppercase tracking-[0.18em] text-[#dcbc82]">
                Edit mode
              </span>

              <div className="flex items-center gap-0.5 rounded-pill bg-white/5 p-0.5">
                {PAGES.map(([href, label]) => (
                  <button
                    key={href}
                    type="button"
                    onClick={() => {
                      setSelection(null);
                      router.push(href);
                    }}
                    className={`${btn} ${pathname === href ? "bg-[#f7f1e2] text-[#2c1503]" : "hover:bg-white/10"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setPlacing(null);
                  setAddOpen((v) => !v);
                }}
                className={`${btn} ${addOpen || placing ? "bg-[#c8a053] text-[#2c1503]" : "hover:bg-white/10"}`}
              >
                + Add
              </button>

              <button
                type="button"
                onClick={() => setPlacingNote((v) => !v)}
                className={`${btn} ${placingNote ? "bg-[#c8a053] text-[#2c1503]" : "hover:bg-white/10"}`}
              >
                {placingNote ? "Click to place note" : "+ Note"}
              </button>

              {Object.keys(page?.deleted ?? {}).length ? (
                <button type="button" onClick={undoDelete} className={`${btn} hover:bg-white/10`}>
                  ↺ Undo delete
                </button>
              ) : null}

              <button
                type="button"
                disabled={saving || !changes}
                onClick={save}
                className={`${btn} bg-[#c8a053] text-[#2c1503] hover:bg-[#dcbc82] disabled:opacity-40`}
              >
                {saving ? "Publishing…" : `Save changes${changes ? ` (${changes})` : ""}`}
              </button>

              <button
                type="button"
                onClick={discard}
                disabled={!changes}
                className={`${btn} hover:bg-white/10 disabled:opacity-30 ${confirmDiscard ? "text-[#e8a090]" : ""}`}
              >
                {confirmDiscard ? "Click again to discard all" : "Discard"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActive(false);
                  setSelection(null);
                  setPlacingNote(false);
                  setHover(null);
                }}
                className={`${btn} hover:bg-white/10`}
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}

/* -------------------------------------------------------------------------- */

function SelectionTools({
  selection,
  onColor,
  onEditText,
  onDrag,
  onSize,
  onDelete,
  onNote,
  onParent,
  onReset,
  onClose,
  onReplace,
}: {
  selection: Selection;
  onReplace: () => void;
  onColor: () => void;
  onEditText: () => void;
  onDrag: (e: React.PointerEvent) => void;
  onSize: (delta: number) => void;
  onDelete: () => void;
  onNote: () => void;
  onParent: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const { box, el } = selection;
  const isImage = el instanceof HTMLImageElement;
  const tool =
    "font-label rounded-md px-2 py-1.5 text-[0.6875rem] text-[#f7f1e2] hover:bg-white/15 disabled:opacity-30";

  // Above the selection if there's room; below it if that's still on screen;
  // otherwise just inside its top edge (tall things like the hero photo).
  const vw = window.innerWidth;
  const barWidth = Math.min(isImage ? 360 : 540, vw - 16);
  const top =
    box.top > 56
      ? box.top - 46
      : box.top + box.height + 64 < window.innerHeight
        ? box.top + box.height + 10
        : Math.max(box.top, 72) + 12;
  const left = Math.max(8, Math.min(box.left, vw - barWidth - 8));

  return (
    <>
      <div
        {...ui}
        className="pointer-events-none fixed z-[91] rounded-sm outline outline-2 outline-[#c8a053]"
        style={{ top: box.top - 4, left: box.left - 4, width: box.width + 8, height: box.height + 8 }}
      />
      <div
        {...ui}
        className="fixed z-[92] flex flex-wrap items-center gap-0.5 rounded-lg bg-[#2c1503] p-1 shadow-lg"
        style={{ top, left, maxWidth: vw - 16 }}
      >
        <span className="font-label px-1.5 text-[0.625rem] uppercase text-[#dcbc82]">
          {isImage ? (el.dataset.photo ?? "photo") : el.tagName.toLowerCase()}
        </span>
        {isImage ? (
          <button
            type="button"
            className={`${tool} bg-[#c8a053] text-[#2c1503] hover:bg-[#dcbc82]`}
            onClick={onReplace}
            title="Replace with a photo or video from this device"
          >
            ⇪ Replace
          </button>
        ) : null}
        <button
          type="button"
          onPointerDown={onDrag}
          className={`${tool} cursor-grab active:cursor-grabbing`}
          title="Drag to move — hold Shift to keep it straight"
        >
          ⠿ Move
        </button>
        {!isImage ? (
          <>
            <button type="button" className={tool} onClick={onEditText}>
              ✎ Text
            </button>
            <button type="button" className={tool} onClick={() => onSize(-0.05)} title="Smaller text">
              A−
            </button>
            <button type="button" className={tool} onClick={() => onSize(0.05)} title="Larger text">
              A+
            </button>
          </>
        ) : null}
        {!isImage ? (
          <button type="button" className={tool} onClick={onColor} title="Text, fill and border colour">
            ◐ Colour
          </button>
        ) : null}
        <button type="button" className={`${tool} hover:text-[#f0a493]`} onClick={onDelete} title="Remove from the page">
          Delete
        </button>
        <button type="button" className={tool} onClick={onNote}>
          Note
        </button>
        <button type="button" className={tool} onClick={onParent} title="Select the containing block">
          ↑ Parent
        </button>
        <button type="button" className={tool} onClick={onReset} title="Undo all changes to this element">
          Reset
        </button>
        <button type="button" className={tool} onClick={onClose} aria-label="Deselect">
          ×
        </button>
      </div>
    </>
  );
}

function NoteCard({ note, path }: { note: Note; path: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const x = pos?.x ?? note.x;
  const y = pos?.y ?? note.y;

  function update(patch: Partial<Note>) {
    updatePage(path, (p) => ({ ...p, notes: p.notes.map((n) => (n.id === note.id ? { ...n, ...patch } : n)) }));
  }

  function startDrag(e: React.PointerEvent) {
    e.preventDefault();
    const sx = e.pageX;
    const sy = e.pageY;
    let nx = note.x;
    let ny = note.y;
    const onMove = (ev: PointerEvent) => {
      nx = Math.round(note.x + ev.pageX - sx);
      ny = Math.round(note.y + ev.pageY - sy);
      setPos({ x: nx, y: ny });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setPos(null);
      update({ x: nx, y: ny, near: describeAt(nx, ny) ?? note.near });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div
      {...ui}
      className="absolute z-[85] w-60 rounded-md bg-[#f4e3b5] text-[#2c1503] shadow-[0_10px_30px_-10px_rgba(59,29,4,0.45)]"
      style={{ top: y, left: x }}
    >
      <div
        onPointerDown={startDrag}
        className="font-label flex cursor-grab items-center justify-between rounded-t-md bg-[#c8a053] px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.14em]"
      >
        <span>⠿ Note</span>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => updatePage(path, (p) => ({ ...p, notes: p.notes.filter((n) => n.id !== note.id) }))}
          aria-label="Delete note"
          className="px-1 text-sm leading-none"
        >
          ×
        </button>
      </div>
      <textarea
        data-lenis-prevent
        autoFocus={!note.text}
        defaultValue={note.text}
        onChange={(e) => update({ text: e.target.value })}
        placeholder="What should change here?"
        rows={3}
        className="font-label block w-full resize-y rounded-b-md bg-transparent p-2.5 text-xs leading-relaxed outline-none placeholder:text-[#8b5e3c]"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function describeAt(pageX: number, pageY: number) {
  const el = document.elementFromPoint(pageX - window.scrollX, pageY - window.scrollY);
  return el && !isEditUi(el) ? describe(el) : null;
}

type Package = ReturnType<typeof buildPackage>;

/** What app/api/edits/route.ts says back after publishing. */
type SaveReply = {
  path: string;
  applied: { page: string; selector: string; what: string; kind: "text" | "media" | "delete" | "color" }[];
  skipped: { page: string; selector: string; what: string; why: string }[];
  commit: string | null;
  commitNote: string | null;
};

function buildPackage(s: EditState) {
  const pages = Object.fromEntries(
    Object.entries(s.pages)
      .map(([path, p]) => [
        path,
        {
          textEdits: Object.values(p.text).map((t) => ({ element: t.ref, original: t.original, edited: t.edited })),
          moves: Object.values(p.moves).map((m) => ({ element: m.ref, dx: m.dx, dy: m.dy })),
          textSize: Object.values(p.size).map((z) => ({
            element: z.ref,
            fromPx: z.basePx,
            toPx: Math.round(z.basePx * z.factor * 10) / 10,
            factor: z.factor,
          })),
          deleted: Object.values(p.deleted ?? {}).map((d) => ({ element: d.ref, text: d.text })),
          media: Object.values(p.media ?? {}).map((m) => ({
            element: m.ref,
            slot: m.slot,
            replaces: m.slotFile,
            needs: m.needs,
            kind: m.kind,
            file: m.file,
            original: m.original,
            originalName: m.originalName,
            width: m.width,
            height: m.height,
            bytes: m.bytes,
            convertedFromHeic: m.converted,
            warnings: m.warnings,
          })),
          colors: Object.values(p.colors ?? {}).map((c) => ({
            element: c.ref,
            text: c.text,
            target: c.target,
            value: c.value,
            className: classFor(c.target, c.value),
          })),
          inserts: (p.inserts ?? []).map((i) => ({
            kind: i.kind,
            name: i.name,
            text: i.text || null,
            color: i.color ? classFor("text", i.color) : null,
            file: i.file,
            position: { x: i.x, y: i.y },
            width: i.w,
            droppedOn: i.near,
          })),
          notes: p.notes
            .filter((n) => n.text.trim())
            .map((n) => ({ text: n.text, near: n.near, position: { x: n.x, y: n.y } })),
        },
      ] as const)
      .filter(
        ([, p]) =>
          p.textEdits.length +
          p.moves.length +
          p.textSize.length +
          p.deleted.length +
          p.media.length +
          p.colors.length +
          p.inserts.length +
          p.notes.length,
      ),
  );
  return {
    kind: "xochi-edits" as const,
    version: 1,
    createdAt: new Date().toISOString(),
    origin: window.location.origin,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    changeCount: countChanges(s),
    howToRead:
      "Positions (dx/dy) are pixel nudges at the viewport size above. Each element carries its tag, its text and the heading of its section so it can be found in source. Inserts are new items placed at page coordinates (x/y from the top-left of the page, at the viewport above); droppedOn is the element under the drop point. Colours give the Tailwind class to apply.",
    pages,
  };
}

function download(pkg: Package) {
  const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `xochi-edits-${pkg.createdAt.slice(0, 19).replace(/[:T]/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
