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
export type HideEdit = { ref: ElementRef };
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
  hidden: Record<string, HideEdit>;
  notes: Note[];
};

export type EditState = {
  pages: Record<string, PageEdits>;
  lastSaved: { at: string; where: string } | null;
};

const EDITS_KEY = "xochi-edits-v1";
const EMPTY: EditState = { pages: {}, lastSaved: null };

export function emptyPage(): PageEdits {
  return { text: {}, moves: {}, size: {}, hidden: {}, notes: [] };
}

let state: EditState = EMPTY;
let loaded = false;
const editListeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(EDITS_KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    state = EMPTY;
  }
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
  const current = state.pages[path] ?? emptyPage();
  set({ ...state, pages: { ...state.pages, [path]: fn(current) } });
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
      Object.keys(p.hidden).length +
      p.notes.filter((note) => note.text.trim()).length,
    0,
  );
}
