import type { ColorTarget, ColorValue } from "./palette";

/**
 * Edit-mode state.
 *
 * Two tiny external stores, read with useSyncExternalStore so server and
 * client agree on first render (both start "no access, no edits") and the
 * browser-only values arrive after hydration without a mismatch.
 *
 *   access — may this browser see the edit tools at all?
 *   edits  — the working draft: every change, per page, persisted to
 *            localStorage so refreshing or switching pages loses nothing.
 */

/* -------------------------------------------------------------------------- */
/* Access                                                                     */
/* -------------------------------------------------------------------------- */

const ACCESS_KEY = "xochi-edit-access";

/** URL switch for the live site: `?xochi-edit` turns the tools on in this
 *  browser, `?xochi-edit=off` turns them off again. */
export const ACCESS_PARAM = "xochi-edit";

const IS_DEV = process.env.NODE_ENV === "development";

const accessListeners = new Set<() => void>();

function readAccess(): boolean {
  if (IS_DEV) return true;
  try {
    return window.localStorage.getItem(ACCESS_KEY) === "1";
  } catch {
    return false;
  }
}

export const accessStore = {
  subscribe(cb: () => void) {
    accessListeners.add(cb);
    window.addEventListener("storage", cb);
    return () => {
      accessListeners.delete(cb);
      window.removeEventListener("storage", cb);
    };
  },
  getSnapshot: readAccess,
  getServerSnapshot: () => false,
};

/** Reads `?xochi-edit` from the current URL and remembers the choice. */
export function processAccessParam() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has(ACCESS_PARAM)) return;
  try {
    if (params.get(ACCESS_PARAM) === "off") window.localStorage.removeItem(ACCESS_KEY);
    else window.localStorage.setItem(ACCESS_KEY, "1");
  } catch {
    /* storage blocked — tools simply stay hidden */
  }
  accessListeners.forEach((cb) => cb());
}

/* -------------------------------------------------------------------------- */
/* Edits                                                                      */
/* -------------------------------------------------------------------------- */

/** Enough about an element for a person (or Claude) to find it in the code. */
export type ElementRef = {
  selector: string;
  tag: string;
  text: string;
  section: string | null;
};

export type TextEdit = { ref: ElementRef; original: string; edited: string };
export type MoveEdit = { ref: ElementRef; dx: number; dy: number };
export type SizeEdit = { ref: ElementRef; basePx: number; factor: number };
/** Removed from the page. `text` is its full original wording, so it can be
 *  found in the code — ElementRef.text is clipped. */
export type DeleteEdit = { ref: ElementRef; text: string };

/** A colour set on part of an element. Keyed by selector + target. */
export type ColorEdit = {
  ref: ElementRef;
  /** Full original wording, for finding the element in the code. */
  text: string;
  target: ColorTarget;
  value: ColorValue;
};

/** Something new dropped onto the page: placed by hand, built in by Claude. */
export type Insert = {
  id: string;
  kind: "photo" | "ornament" | "border" | "logo" | "text";
  /** Ornament or border name; "mark" | "wordmark" for logos;
   *  "heading" | "paragraph" | "label" for text. */
  name: string;
  /** Top-left, in page pixels. */
  x: number;
  y: number;
  /** Width in pixels; height follows the item. */
  w: number;
  color: ColorValue | null;
  text: string;
  /** Uploaded photo: preview URL and the file in edits/media/. */
  src: string | null;
  file: string | null;
  /** What it was dropped on, so it can be found in the code. */
  near: ElementRef | null;
};

/** A photo or video swapped into an image slot. */
export type MediaEdit = {
  ref: ElementRef;
  /** Which manifest slot this replaces (content/photos.ts), and its file. */
  slot: string | null;
  slotFile: string | null;
  needs: { width: number; height: number } | null;
  kind: "image" | "video";
  file: string;
  original: string;
  preview: string;
  originalName: string;
  width: number | null;
  height: number | null;
  bytes: number;
  converted: boolean;
  warnings: string[];
};
export type Note = {
  id: string;
  x: number;
  y: number;
  text: string;
  near: ElementRef | null;
};

export type PageEdits = {
  text: Record<string, TextEdit>;
  moves: Record<string, MoveEdit>;
  size: Record<string, SizeEdit>;
  deleted: Record<string, DeleteEdit>;
  media: Record<string, MediaEdit>;
  colors: Record<string, ColorEdit>;
  inserts: Insert[];
  notes: Note[];
};

export type EditState = {
  pages: Record<string, PageEdits>;
  lastSaved: { at: string; where: string } | null;
};

const EDITS_KEY = "xochi-edits-v1";
const EMPTY: EditState = { pages: {}, lastSaved: null };

export function emptyPage(): PageEdits {
  return { text: {}, moves: {}, size: {}, deleted: {}, media: {}, colors: {}, inserts: [], notes: [] };
}

let state: EditState = EMPTY;
let loaded = false;
const editListeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(EDITS_KEY);
    if (raw) state = migrate({ ...EMPTY, ...JSON.parse(raw) });
  } catch {
    state = EMPTY;
  }
}

/** Drafts from before "Hide" became "Delete" kept hidden elements under
 *  `hidden`; carry them over as deletions. */
function migrate(s: EditState): EditState {
  const pages: EditState["pages"] = {};
  for (const [path, p] of Object.entries(s.pages)) {
    const old = (p as { hidden?: Record<string, { ref: ElementRef }> }).hidden ?? {};
    const deleted = { ...p.deleted };
    for (const [sel, h] of Object.entries(old)) deleted[sel] ??= { ref: h.ref, text: h.ref.text };
    const { hidden: _drop, ...rest } = p as PageEdits & { hidden?: unknown };
    void _drop;
    pages[path] = { ...emptyPage(), ...rest, deleted };
  }
  return { ...s, pages };
}

function persist() {
  try {
    window.localStorage.setItem(EDITS_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — edits live for this tab only */
  }
}

function set(next: EditState) {
  state = next;
  persist();
  editListeners.forEach((cb) => cb());
}

export const editStore = {
  subscribe(cb: () => void) {
    load();
    editListeners.add(cb);
    return () => editListeners.delete(cb);
  },
  getSnapshot(): EditState {
    load();
    return state;
  },
  getServerSnapshot: (): EditState => EMPTY,
};

/** Immutable update of one page's edits. */
export function updatePage(path: string, fn: (page: PageEdits) => PageEdits) {
  load();
  // Spread over an empty page so drafts saved before a field existed still work.
  const current = { ...emptyPage(), ...state.pages[path] };
  set({ ...state, pages: { ...state.pages, [path]: fn(current) } });
}

/** Drop the edits that "Save changes" has published into the code. */
export function removeApplied(applied: { page: string; selector: string; kind: string }[]) {
  load();
  const pages = { ...state.pages };
  for (const a of applied) {
    const p = pages[a.page];
    if (!p) continue;
    if (a.kind === "color") {
      // Colour edits are keyed "selector|target"; the reply carries the key.
      const colors = { ...p.colors };
      delete colors[a.selector];
      pages[a.page] = { ...p, colors };
      continue;
    }
    const field = a.kind === "text" ? "text" : a.kind === "media" ? "media" : "deleted";
    const next = { ...p[field] };
    delete next[a.selector];
    pages[a.page] = { ...p, [field]: next };
  }
  set({ ...state, pages });
}

export function markSaved(where: string) {
  load();
  set({ ...state, lastSaved: { at: new Date().toISOString(), where } });
}

export function clearAll() {
  set(EMPTY);
}

export function getState(): EditState {
  load();
  return state;
}

export function countChanges(s: EditState): number {
  return Object.values(s.pages).reduce(
    (n, p) =>
      n +
      Object.keys(p.text).length +
      Object.keys(p.moves).length +
      Object.keys(p.size).length +
      Object.keys(p.deleted ?? {}).length +
      Object.keys(p.media ?? {}).length +
      Object.keys(p.colors ?? {}).length +
      (p.inserts ?? []).length +
      p.notes.filter((note) => note.text.trim()).length,
    0,
  );
}
