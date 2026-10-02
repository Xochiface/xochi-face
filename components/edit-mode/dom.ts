import type { ElementRef, PageEdits } from "./store";

/** Everything belonging to the edit tools carries this, so the tools never
 *  select or count themselves. */
export const UI_ATTR = "data-edit-ui";

/** Clicking lands on the nearest of these. "Select parent" walks further up
 *  when you want to move a whole block rather than one line. */
const SELECTABLE =
  "h1,h2,h3,h4,h5,h6,p,a,button,li,blockquote,label,figcaption,dt,dd,img,span,code,em,strong";

export function isEditUi(el: Element | null): boolean {
  return !!el?.closest(`[${UI_ATTR}]`);
}

export function pickTarget(el: Element | null): HTMLElement | null {
  if (!el || isEditUi(el)) return null;
  const hit = el.closest(SELECTABLE) ?? el;
  if (hit === document.body || hit === document.documentElement) return null;
  return hit as HTMLElement;
}

/** A stable path from <body> using tag + nth-of-type, ignoring the edit UI so
 *  opening a note never shifts the paths of the page's own elements. */
export function selectorFor(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.body) {
    const parent: Element | null = node.parentElement;
    if (!parent) break;
    const tag = node.tagName.toLowerCase();
    const same = Array.from(parent.children).filter(
      (c) => c.tagName === node!.tagName && !c.hasAttribute(UI_ATTR),
    );
    parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(node) + 1})` : tag);
    node = parent;
  }
  return ["body", ...parts].join(" > ");
}

export function find(selector: string): HTMLElement | null {
  try {
    return document.querySelector<HTMLElement>(selector);
  } catch {
    return null;
  }
}

function clip(s: string, n = 100) {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

/**
 * Once an element's text is edited, its source-code wording is remembered on
 * the element. Descriptions always use that original, so an edit package never
 * refers to wording that only exists in the draft — "the section headed X"
 * must name an X that can actually be found in the code.
 */
const ORIGINAL = "xochiOriginal";

export function markOriginal(el: HTMLElement, original: string | null) {
  if (original === null) delete el.dataset[ORIGINAL];
  else el.dataset[ORIGINAL] = original;
}

function sourceText(el: Element): string {
  const h = el as HTMLElement;
  return h.dataset?.[ORIGINAL] ?? h.innerText ?? el.textContent ?? "";
}

/** Human-readable context: the element's own text plus the heading of the
 *  section it sits in. This is what makes an edit findable in source code. */
export function describe(el: Element): ElementRef {
  const container = el.closest("section, header, footer, article, nav, main");
  const heading = container?.querySelector("h1, h2, h3");
  const own = el instanceof HTMLImageElement ? `[image] ${el.alt}` : sourceText(el);
  return {
    selector: selectorFor(el),
    tag: el.tagName.toLowerCase(),
    text: clip(own),
    section: heading ? clip(sourceText(heading), 60) : container ? container.tagName.toLowerCase() : null,
  };
}

/** Apply a page's saved edits to the live DOM. Idempotent — safe to rerun. */
export function applyPage(page: PageEdits | undefined, { includeText }: { includeText: boolean }) {
  if (!page) return;

  if (includeText) {
    for (const [sel, edit] of Object.entries(page.text)) {
      const el = find(sel);
      if (el && el.innerText.trim() === edit.original.trim()) {
        markOriginal(el, edit.original);
        el.innerText = edit.edited;
      }
    }
  }

  for (const [sel, m] of Object.entries(page.moves)) {
    const el = find(sel);
    if (el) el.style.transform = `translate(${m.dx}px, ${m.dy}px)`;
  }

  for (const [sel, s] of Object.entries(page.size)) {
    const el = find(sel);
    if (el) el.style.fontSize = `${Math.round(s.basePx * s.factor * 10) / 10}px`;
  }

  for (const [sel, m] of Object.entries(page.media ?? {})) {
    const el = find(sel);
    if (el instanceof HTMLImageElement) applyMedia(el, m.kind, m.preview);
  }

  for (const sel of Object.keys(page.hidden)) {
    const el = find(sel);
    if (el) {
      el.style.opacity = "0.18";
      el.style.outline = "1px dashed currentColor";
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Photos and video                                                           */
/* -------------------------------------------------------------------------- */

const MEDIA_ATTR = "data-xochi-media";

/** The site photo under a point, looking through colour overlays and scrims
 *  that sit on top of it (the hero has two). Maps a preview video back to the
 *  <img> it stands in for, since edits are keyed by the image. */
export function imageAt(x: number, y: number): HTMLImageElement | null {
  for (const el of document.elementsFromPoint(x, y)) {
    if (isEditUi(el)) continue;
    if (el instanceof HTMLImageElement) return el;
    if (el.hasAttribute(MEDIA_ATTR) && el.previousElementSibling instanceof HTMLImageElement) {
      return el.previousElementSibling;
    }
  }
  return null;
}

/**
 * Like pickTarget, but a click on empty space selects the photo beneath it.
 *
 * "Empty space" means the click didn't land on any text element — it hit a
 * wrapper, an overlay or a scrim. Checking whether that wrapper *contains* text
 * isn't enough: the hero's content block spans the full width, over the photo,
 * and holds the headline, so it always "has text" even where you clicked on
 * bare photograph. Containers stay reachable with "↑ Parent".
 */
export function pickAt(target: Element | null, x: number, y: number): HTMLElement | null {
  if (!target || isEditUi(target)) return null;
  if (target instanceof HTMLImageElement) return target;
  if (target.hasAttribute(MEDIA_ATTR)) return imageAt(x, y);
  if (!target.closest(SELECTABLE)) return imageAt(x, y) ?? pickTarget(target);
  return pickTarget(target);
}

/** The manifest slot an image belongs to (set by photoAttrs in content/photos.ts). */
export function slotOf(img: HTMLImageElement) {
  const [w, h] = (img.dataset.photoMin ?? "").split("x").map(Number);
  return {
    slot: img.dataset.photo ?? null,
    slotFile: img.dataset.photoFile ?? null,
    needs: w && h ? { width: w, height: h } : null,
  };
}

/** Show an uploaded photo or video in place of a site image. */
export function applyMedia(img: HTMLImageElement, kind: "image" | "video", preview: string) {
  if (img.dataset.xochiSrc === undefined) {
    img.dataset.xochiSrc = img.getAttribute("src") ?? "";
    img.dataset.xochiSrcset = img.getAttribute("srcset") ?? "";
    img.dataset.xochiSizes = img.getAttribute("sizes") ?? "";
  }
  const existing = img.nextElementSibling;
  const existingVideo = existing?.hasAttribute(MEDIA_ATTR) ? (existing as HTMLVideoElement) : null;

  // The draft is re-applied every time it changes. A video already showing
  // this file is left alone, so it doesn't restart on every unrelated edit.
  if (kind === "video" && existingVideo?.dataset.src === preview) {
    img.style.visibility = "hidden";
    return;
  }
  existingVideo?.remove();

  if (kind === "image") {
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.src = preview;
    img.style.visibility = "";
    return;
  }

  // A video takes the image's exact box: same classes, same inline layout.
  const video = document.createElement("video");
  video.setAttribute(MEDIA_ATTR, "");
  video.dataset.src = preview;
  video.className = img.className;
  video.style.cssText = img.style.cssText;
  // The image may already be hidden from an earlier pass; never copy that.
  video.style.visibility = "visible";
  video.style.backgroundImage = "";
  video.style.objectFit = "cover";
  video.src = preview;
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  img.after(video);
  img.style.visibility = "hidden";
  void video.play().catch(() => {});
}

export function restoreMedia(img: HTMLImageElement) {
  const sibling = img.nextElementSibling;
  if (sibling?.hasAttribute(MEDIA_ATTR)) sibling.remove();
  if (img.dataset.xochiSrc !== undefined) {
    img.src = img.dataset.xochiSrc;
    if (img.dataset.xochiSrcset) img.setAttribute("srcset", img.dataset.xochiSrcset);
    if (img.dataset.xochiSizes) img.setAttribute("sizes", img.dataset.xochiSizes);
    delete img.dataset.xochiSrc;
    delete img.dataset.xochiSrcset;
    delete img.dataset.xochiSizes;
  }
  img.style.visibility = "";
}

/** Open the system file picker. On an iPhone this offers the photo library
 *  and the camera. Must be called from inside a tap or click. */
export function pickFile(accept: string, onFile: (file: File) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.setAttribute(UI_ATTR, "");
  input.style.display = "none";
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    input.remove();
    if (file) onFile(file);
  });
  document.body.append(input);
  input.click();
}

/* -------------------------------------------------------------------------- */
/* Direct manipulation — kept here so the React component never mutates DOM  */
/* nodes held in state.                                                        */
/* -------------------------------------------------------------------------- */

export type Box = { top: number; left: number; width: number; height: number };

export function measure(el: Element): Box {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function setTranslate(el: HTMLElement, dx: number, dy: number) {
  el.style.transform = dx || dy ? `translate(${dx}px, ${dy}px)` : "";
}

export function setFontPx(el: HTMLElement, px: number | null) {
  el.style.fontSize = px === null ? "" : `${px}px`;
}

export function computedFontPx(el: Element): number {
  return parseFloat(getComputedStyle(el).fontSize) || 16;
}

export function setHiddenStyle(el: HTMLElement, hidden: boolean) {
  el.style.opacity = hidden ? "0.18" : "";
  el.style.outline = hidden ? "1px dashed currentColor" : "";
}

export function setBodyCursor(cursor: string) {
  document.body.style.cursor = cursor;
}

/**
 * Turn an element into an inline text editor. Enter commits, Shift+Enter adds
 * a line break, Escape cancels, paste is forced to plain text so formatting
 * from Word or Google Docs can't leak into the page.
 */
export function editTextInPlace(
  el: HTMLElement,
  onDone: (before: string, after: string) => void,
) {
  const before = el.innerText;
  el.contentEditable = "true";
  el.spellcheck = true;
  el.focus();

  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);

  // Enter and Escape finish the edit directly; losing focus (clicking away) is
  // the fallback. Not relying on the blur event alone matters: browsers skip
  // focus events entirely when the window itself doesn't have focus.
  let done = false;
  const finish = (commit: boolean) => {
    if (done) return;
    done = true;
    el.removeEventListener("keydown", onKey);
    el.removeEventListener("paste", onPaste);
    el.removeEventListener("blur", onBlur);
    el.removeAttribute("contenteditable");
    if (!commit) el.innerText = before;
    onDone(before, commit ? el.innerText : before);
    el.blur();
  };

  const onKey = (e: KeyboardEvent) => {
    e.stopPropagation(); // keep arrow keys from nudging the element while typing
    if (e.key === "Escape") {
      finish(false);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      finish(true);
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain") ?? "";
    document.execCommand("insertText", false, text);
  };

  const onBlur = () => finish(true);

  el.addEventListener("keydown", onKey);
  el.addEventListener("paste", onPaste);
  el.addEventListener("blur", onBlur);
}

/** Undo every inline change on one element and restore its original text. */
export function resetElement(el: HTMLElement, originalText?: string) {
  el.style.transform = "";
  el.style.fontSize = "";
  el.style.opacity = "";
  el.style.outline = "";
  if (originalText !== undefined) el.innerText = originalText;
  markOriginal(el, null);
  if (el instanceof HTMLImageElement) restoreMedia(el);
}
