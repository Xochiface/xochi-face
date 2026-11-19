import { execFile } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import sharp from "sharp";
import ts from "typescript";

/**
 * Publishes the parts of an edit-mode package that can be applied exactly,
 * straight into the source, the moment "Save changes" is pressed.
 *
 *   Text     — found by parsing the code (TypeScript's own parser), not by
 *              search-and-replace: the edited wording must match exactly one
 *              string or run of JSX text, so it can't land in the wrong place
 *              or break the syntax around it.
 *   Photos   — cropped to the shape of the slot they replace and written over
 *              its file in assets/photos/.
 *   Deletes  — an element whose words are written in a page, like
 *              <p>Some words</p>, or come from the shared content file, like
 *              <h2>{voice.bloom}</h2>. Anything built from a list (one card
 *              of several) or wrapped in logic is left for a person.
 *   Colours  — the same elements, when their className is a plain string: the
 *              old colour class for that part (text, fill or border) is
 *              swapped for the new one.
 *
 * Everything else — moves, size changes, video, notes, added items, and anything that
 * didn't match exactly once — stays in the package for a developer, and the
 * result says so. Touched files are committed, so every save can be undone,
 * unless they already held someone's uncommitted work.
 *
 * Development only: the caller (app/api/edits/route.ts) never runs this in
 * production.
 */

const run = promisify(execFile);
const ROOT = process.cwd();
const SOURCE_DIRS = ["app", "components", "content"];
const SKIP = [/^app\/api\//, /^app\/styleguide\//, /^components\/edit-mode\//];

type Ref = { selector: string; tag: string; text: string; section: string | null };

type PackagePage = {
  textEdits?: { element: Ref; original: string; edited: string }[];
  media?: {
    element: Ref;
    kind: "image" | "video";
    file: string;
    replaces: string | null;
    needs: { width: number; height: number } | null;
  }[];
  deleted?: { element: Ref; text: string }[];
  colors?: { element: Ref; text: string; target: "text" | "fill" | "border"; className: string }[];
};

export type Outcome = { page: string; selector: string; what: string };
export type ApplyResult = {
  applied: (Outcome & { kind: "text" | "media" | "delete" | "color" })[];
  skipped: (Outcome & { why: string })[];
  files: string[];
  commit: string | null;
  commitNote: string | null;
};

export async function applyPackage(pkg: {
  pages?: Record<string, PackagePage>;
}): Promise<ApplyResult> {
  const result: ApplyResult = { applied: [], skipped: [], files: [], commit: null, commitNote: null };
  const pages = Object.entries(pkg.pages ?? {});
  const sources = await loadSources();
  const pending = new Map<string, Splice[]>();
  const touched = new Set<string>();

  /* Text ------------------------------------------------------------------ */
  for (const [page, p] of pages) {
    for (const edit of p.textEdits ?? []) {
      const what = `“${clip(edit.original)}” → “${clip(edit.edited)}”`;
      const edited = edit.edited.trim();
      if (!edited) {
        result.skipped.push({ page, selector: edit.element.selector, what, why: "Left empty — use Delete to remove something." });
        continue;
      }
      if (/\n/.test(edited)) {
        result.skipped.push({ page, selector: edit.element.selector, what, why: "Has a line break, which needs setting by hand." });
        continue;
      }
      const found = pick(
        sources.flatMap((s) => s.literals.filter((l) => same(l.value, edit.original))),
        page,
      );
      if (typeof found === "string") {
        result.skipped.push({ page, selector: edit.element.selector, what, why: found });
        continue;
      }
      const entry = { page, selector: edit.element.selector, what, kind: "text" as const };
      queue(pending, found.file, { start: found.start, end: found.end, text: encode(found, edited), entries: [entry] });
      result.applied.push(entry);
    }
  }

  /* Deletes ---------------------------------------------------------------- */
  for (const [page, p] of pages) {
    for (const del of p.deleted ?? []) {
      const what = `<${del.element.tag}> “${clip(del.text || del.element.text)}”`;
      const found = pick(
        sources.flatMap((s) =>
          s.elements.filter((e) => e.deletable && sameTag(e.tag, del.element.tag) && same(e.text, del.text)),
        ),
        page,
      );
      if (typeof found === "string") {
        result.skipped.push({ page, selector: del.element.selector, what, why: found });
        continue;
      }
      const entry = { page, selector: del.element.selector, what, kind: "delete" as const };
      queue(pending, found.file, { ...found.span, text: "", entries: [entry] });
      result.applied.push(entry);
    }
  }

  /* Colours ---------------------------------------------------------------- */
  // Several colours on one element (text and fill, say) rewrite the same
  // className, so they're gathered per element and written once.
  const recolours = new Map<string, { at: Element; classes: string[]; entries: ApplyResult["applied"] }>();
  for (const [page, p] of pages) {
    for (const c of p.colors ?? []) {
      const selector = `${c.element.selector}|${c.target}`;
      const what = `${c.target} of <${c.element.tag}> “${clip(c.text || c.element.text)}” → ${c.className}`;
      const found = pick(
        sources.flatMap((s) =>
          s.elements.filter((e) => e.className && sameTag(e.tag, c.element.tag) && same(e.text, c.text)),
        ),
        page,
      );
      if (typeof found === "string") {
        result.skipped.push({ page, selector, what, why: found });
        continue;
      }
      const key = `${found.file}:${found.className!.start}`;
      const group = recolours.get(key) ?? { at: found, classes: found.className!.value.split(/\s+/).filter(Boolean), entries: [] };
      group.classes = swapColour(group.classes, c.target, c.className);
      const entry = { page, selector, what, kind: "color" as const };
      group.entries.push(entry);
      recolours.set(key, group);
      result.applied.push(entry);
    }
  }
  for (const { at, classes, entries } of recolours.values()) {
    const cls = at.className!;
    const q = cls.quote;
    queue(pending, at.file, { start: cls.start, end: cls.end, text: `${q}${classes.join(" ")}${q}`, entries });
  }

  /* Write source files ---------------------------------------------------- */
  const photoTargets = pages.flatMap(([, p]) =>
    (p.media ?? []).flatMap((m) => (m.replaces ? [m.replaces] : [])),
  );
  const dirtyBefore = await dirty([...pending.keys(), ...photoTargets]);
  for (const [file, splices] of pending) {
    const source = sources.find((s) => s.file === file)!;
    let text = source.text;
    const ordered = splices.sort((a, b) => b.start - a.start);
    // Two changes touching the same code (an edit inside a deleted element,
    // or two edits that resolved to one string) — apply neither, don't guess.
    const clash = new Set<Splice>();
    ordered.forEach((s, i) => {
      if (i > 0 && s.end > ordered[i - 1].start) clash.add(s).add(ordered[i - 1]);
    });
    for (const s of clash) {
      for (const entry of s.entries) {
        result.applied = result.applied.filter((a) => a !== entry);
        result.skipped.push({ ...entry, why: "Overlaps another change in the same place." });
      }
    }
    const clean = ordered.filter((s) => !clash.has(s));
    if (!clean.length) continue;
    for (const s of clean) text = text.slice(0, s.start) + s.text + text.slice(s.end);
    await writeFile(path.join(ROOT, file), text, "utf8");
    touched.add(file);
  }

  /* Photos ----------------------------------------------------------------- */
  for (const [page, p] of pages) {
    for (const m of p.media ?? []) {
      const what = `${m.replaces ?? "photo"} ← ${path.basename(m.file)}`;
      if (m.kind !== "image") {
        result.skipped.push({ page, selector: m.element.selector, what, why: "Video needs converting for the web first." });
        continue;
      }
      const from = safePath(m.file, "edits/media/");
      const to = m.replaces ? safePath(m.replaces, "assets/photos/") : null;
      if (!from || !to || !m.needs) {
        result.skipped.push({ page, selector: m.element.selector, what, why: "This image isn't one of the site's photo slots." });
        continue;
      }
      try {
        await cropInto(from, to, m.needs.width / m.needs.height);
        touched.add(m.replaces!);
        result.applied.push({ page, selector: m.element.selector, what, kind: "media" });
      } catch {
        result.skipped.push({ page, selector: m.element.selector, what, why: "Couldn't read the uploaded photo." });
      }
    }
  }

  /* Commit ----------------------------------------------------------------- */
  result.files = [...touched];
  if (touched.size) {
    const blocked = [...touched].filter((f) => dirtyBefore.has(f));
    if (blocked.length) {
      result.commitNote = `Published, but not committed: ${blocked.join(", ")} already had other unsaved work.`;
    } else {
      try {
        const files = [...touched];
        await run("git", ["add", "--", ...files], { cwd: ROOT });
        const summary = summarize(result.applied);
        await run("git", ["commit", "-m", `Edit mode: ${summary}`, "--", ...files], { cwd: ROOT });
        const { stdout } = await run("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT });
        result.commit = stdout.trim();
      } catch {
        result.commitNote = "Published, but the commit failed — the files are changed but not yet committed.";
      }
    }
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Reading the source                                                          */
/* -------------------------------------------------------------------------- */

type Literal = {
  file: string;
  start: number;
  end: number;
  kind: "string" | "template" | "jsx";
  quote: string;
  value: string;
};

type Element = {
  file: string;
  /** The element itself, widened to whole lines where it has them. */
  span: { start: number; end: number };
  tag: string;
  /** The words it renders, when they can be known from the code. */
  text: string;
  /** Sitting directly among other JSX children, so removable on its own. */
  deletable: boolean;
  /** className="…" when it's a plain string. */
  className: { start: number; end: number; quote: string; value: string } | null;
};

type Source = { file: string; text: string; literals: Literal[]; elements: Element[] };

async function loadSources(): Promise<Source[]> {
  const files: string[] = [];
  for (const dir of SOURCE_DIRS) await walk(dir, files);
  const parsed = await Promise.all(
    files.map(async (file) => {
      const text = await readFile(path.join(ROOT, file), "utf8");
      const sf = ts.createSourceFile(
        file,
        text,
        ts.ScriptTarget.Latest,
        true,
        file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      );
      return { file, text, sf };
    }),
  );
  // First pass: every "object.key" string the content files define, so an
  // element like <h2>{voice.bloom}</h2> can be matched by the words it shows.
  const values = new Map<string, string>();
  for (const { sf } of parsed) collectValues(sf, values);
  return parsed.map(({ file, text, sf }) => ({ file, text, ...scan(file, text, sf, values) }));
}

/** `export const voice = { bloom: "…" }` → "voice.bloom" ↦ "…". One level deep. */
function collectValues(sf: ts.SourceFile, out: Map<string, string>) {
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      let init = decl.initializer;
      while (init && (ts.isAsExpression(init) || ts.isSatisfiesExpression(init) || ts.isParenthesizedExpression(init))) {
        init = init.expression;
      }
      if (!init || !ts.isObjectLiteralExpression(init) || !ts.isIdentifier(decl.name)) continue;
      for (const prop of init.properties) {
        if (!ts.isPropertyAssignment(prop) || !(ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) continue;
        const v = prop.initializer;
        if (ts.isStringLiteral(v) || ts.isNoSubstitutionTemplateLiteral(v)) {
          out.set(`${decl.name.text}.${prop.name.text}`, v.text);
        }
      }
    }
  }
}

async function walk(dir: string, out: string[]) {
  let entries;
  try {
    entries = await readdir(path.join(ROOT, dir), { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const rel = `${dir}/${entry.name}`;
    if (SKIP.some((re) => re.test(`${rel}/`))) continue;
    if (entry.isDirectory()) await walk(rel, out);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith(".d.ts")) out.push(rel);
  }
}

function scan(file: string, text: string, sf: ts.SourceFile, values: Map<string, string>) {
  const literals: Literal[] = [];
  const elements: Element[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const parent = node.parent;
      const isModuleName =
        ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent) || ts.isExternalModuleReference(parent);
      if (!isModuleName) {
        const start = node.getStart(sf);
        literals.push({
          file,
          start,
          end: node.getEnd(),
          kind: ts.isStringLiteral(node) ? "string" : "template",
          quote: text[start],
          value: node.text,
        });
      }
    } else if (ts.isJsxText(node) && !node.containsOnlyTriviaWhiteSpaces) {
      const raw = text.slice(node.pos, node.end);
      const lead = raw.length - raw.trimStart().length;
      const trail = raw.length - raw.trimEnd().length;
      literals.push({
        file,
        start: node.pos + lead,
        end: node.end - trail,
        kind: "jsx",
        quote: "",
        value: jsxValue(raw),
      });
    }

    // An element whose words are knowable from the code: plain JSX text,
    // and/or {object.key} values from the content files. Elements fed from a
    // list ({s.name} inside a .map) can't be told apart, so aren't recorded.
    if (ts.isJsxElement(node)) {
      const tag = node.openingElement.tagName.getText(sf);
      const kids = node.children.filter((c) => !(ts.isJsxText(c) && c.containsOnlyTriviaWhiteSpaces));
      const words = kids.map((c) => {
        if (ts.isJsxText(c)) return jsxValue(text.slice(c.pos, c.end));
        if (ts.isJsxExpression(c) && c.expression && ts.isPropertyAccessExpression(c.expression)) {
          return values.get(c.expression.getText(sf)) ?? null;
        }
        return null;
      });
      if (kids.length && words.every((w) => w !== null)) {
        const attr = node.openingElement.attributes.properties.find(
          (a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText(sf) === "className",
        );
        const init = attr?.initializer;
        const className =
          init && ts.isStringLiteral(init)
            ? { start: init.getStart(sf), end: init.getEnd(), quote: text[init.getStart(sf)], value: init.text }
            : null;
        elements.push({
          file,
          span: wholeLines(text, node.getStart(sf), node.getEnd()),
          tag,
          text: words.join(" "),
          deletable: ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent),
          className,
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return { literals, elements };
}

/** The text a run of JSX renders: lines trimmed and joined, entities decoded. */
function jsxValue(raw: string) {
  const joined = raw
    .split(/\r?\n/)
    .map((line, i, all) => {
      let l = line;
      if (i > 0) l = l.trimStart();
      if (i < all.length - 1) l = l.trimEnd();
      return l;
    })
    .filter((l, i, all) => l !== "" || all.length === 1)
    .join(" ");
  return decodeEntities(joined);
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  middot: "·",
};

function decodeEntities(s: string) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, name: string) => {
    if (name[0] === "#") {
      const code = name[1] === "x" || name[1] === "X" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[name.toLowerCase()] ?? m;
  });
}

/* -------------------------------------------------------------------------- */
/* Choosing and writing                                                        */
/* -------------------------------------------------------------------------- */

function norm(s: string) {
  return s.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function same(a: string, b: string) {
  return norm(a) !== "" && norm(a) === norm(b);
}

/** The page's own file, e.g. "/book" → app/(site)/book/page.tsx. */
function pageFile(page: string) {
  return `app/(site)${page === "/" ? "" : page}/page.tsx`;
}

/**
 * Exactly one match, or a reason why not. Wording that appears on several
 * pages (a button label, say) is accepted when exactly one of the matches is
 * in the file for the page it was edited on.
 */
function pick<T extends { file: string }>(matches: T[], page: string): T | string {
  if (matches.length === 1) return matches[0];
  if (matches.length === 0) {
    return "Couldn't find this wording on its own in the code — it's probably assembled from several pieces.";
  }
  const local = matches.filter((m) => m.file === pageFile(page));
  if (local.length === 1) return local[0];
  return `This wording appears in ${matches.length} places, so it's not clear which one to change.`;
}

function encode(at: Literal, value: string) {
  if (at.kind === "jsx") {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
      .replace(/\{/g, "&#123;")
      .replace(/\}/g, "&#125;");
  }
  if (at.kind === "template") {
    return `\`${value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}\``;
  }
  const q = at.quote === "'" ? "'" : '"';
  const body = value
    .replace(/\\/g, "\\\\")
    .replace(new RegExp(q, "g"), `\\${q}`)
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return `${q}${body}${q}`;
}

type Splice = {
  start: number;
  end: number;
  text: string;
  entries: ApplyResult["applied"];
};

/** The DOM reports <Link> as an <a>. */
function sameTag(codeTag: string, domTag: string) {
  return codeTag === domTag || (codeTag === "Link" && domTag === "a");
}

/** Colour names the site's Tailwind theme defines — so "text-ink" is a colour
 *  but "text-body" (a size) is not, and "border-rule/40" is but "border-t" is not. */
const COLOUR =
  "(?:bone-\\d+|sienna-\\d+|honey(?:-soft)?|sage|blush|petal|ink(?:-muted|-soft)?|surface(?:-raised|-sunken)?|rule|accent-(?:honey|sage|blush)|accent(?:-foreground)?|primary(?:-foreground)?|secondary(?:-foreground)?|muted(?:-foreground)?|background|foreground|card(?:-foreground)?|popover(?:-foreground)?|destructive|border|input|ring|white|black|transparent|current|inherit|\\[(?:#|rgb|hsl|oklch|color:|var\\().*\\])(?:/\\d+)?";

const PREFIX = { text: "text", fill: "bg", border: "border" } as const;

/** Swap one part's colour class, leaving size, spacing and everything else. */
function swapColour(classes: string[], target: "text" | "fill" | "border", next: string) {
  const old = new RegExp(`^(?:[a-z-]+:)*${PREFIX[target]}-${COLOUR}$`);
  // Only unprefixed classes are replaced; hover:/md: variants are left alone.
  const kept = classes.filter((c) => !(old.test(c) && !c.includes(":")));
  if (target === "border" && !kept.some((c) => /^border(?:-[trblxy])?(?:-\d+)?$/.test(c))) kept.push("border");
  return [...kept, next];
}

function queue(map: Map<string, Splice[]>, file: string, splice: Splice) {
  const list = map.get(file) ?? [];
  list.push(splice);
  map.set(file, list);
}

/** Widen a removal to whole lines when the element sits on lines of its own,
 *  so deleting it doesn't leave a blank, indented line behind. */
function wholeLines(text: string, start: number, end: number) {
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = text.indexOf("\n", end);
  const lineEnd = nextBreak === -1 ? text.length : nextBreak + 1;
  const before = text.slice(lineStart, start);
  const after = text.slice(end, lineEnd);
  return before.trim() === "" && after.trim() === "" ? { start: lineStart, end: lineEnd } : { start, end };
}

/* -------------------------------------------------------------------------- */
/* Photos                                                                      */
/* -------------------------------------------------------------------------- */

/** A project-relative path, confined to one folder. */
function safePath(rel: string, folder: string) {
  const clean = rel.replace(/\\/g, "/");
  if (!clean.startsWith(folder) || clean.includes("..")) return null;
  if (!/^[\w./-]+$/.test(clean)) return null;
  return path.join(ROOT, clean);
}

/** The largest crop of the slot's shape the photo allows — never enlarged —
 *  centred on whatever sharp judges the subject. */
async function cropInto(from: string, to: string, ratio: number) {
  const meta = await sharp(from).metadata();
  if (!meta.width || !meta.height) throw new Error("unreadable");
  let width = meta.width;
  let height = Math.round(width / ratio);
  if (height > meta.height) {
    height = meta.height;
    width = Math.round(height * ratio);
  }
  await sharp(from)
    .resize(width, height, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(to);
}

/* -------------------------------------------------------------------------- */
/* Git                                                                         */
/* -------------------------------------------------------------------------- */

async function dirty(files: string[]) {
  if (!files.length) return new Set<string>();
  try {
    const { stdout } = await run("git", ["status", "--porcelain", "--", ...files], { cwd: ROOT });
    return new Set(
      stdout
        .split("\n")
        .filter(Boolean)
        .map((line) => line.slice(3).replace(/^"|"$/g, "")),
    );
  } catch {
    return new Set(files);
  }
}

function summarize(applied: ApplyResult["applied"]) {
  const count = (k: string) => applied.filter((a) => a.kind === k).length;
  const parts = [
    count("text") && `${count("text")} text change${count("text") > 1 ? "s" : ""}`,
    count("media") && `${count("media")} photo${count("media") > 1 ? "s" : ""}`,
    count("delete") && `${count("delete")} removal${count("delete") > 1 ? "s" : ""}`,
    count("color") && `${count("color")} colour${count("color") > 1 ? "s" : ""}`,
  ].filter(Boolean);
  return parts.join(", ");
}

function clip(s: string, n = 60) {
  const t = norm(s);
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}
