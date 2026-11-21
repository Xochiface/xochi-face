import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Receives an edit-mode package, publishes what can be applied exactly (text,
 * photos, simple deletions — see lib/edits/apply.ts), and writes the whole
 * package into the project at edits/ with a record of what was applied and
 * what is left for a developer.
 *
 * Development only. Writing to disk from a request is not something a live
 * site should ever do, so in production this route does not exist (404) and
 * the edit toolbar downloads the package instead.
 *
 * The filename is generated here, never taken from the request, so a request
 * cannot choose where on disk it writes.
 */

const MAX_BYTES = 2_000_000;

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  const body = await request.text();
  if (body.length > MAX_BYTES) {
    return Response.json({ error: "Package too large" }, { status: 413 });
  }

  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    return Response.json({ error: "Not valid JSON" }, { status: 400 });
  }

  if (!data || typeof data !== "object" || (data as { kind?: unknown }).kind !== "xochi-edits") {
    return Response.json({ error: "Not an edit package" }, { status: 400 });
  }

  // Loaded only here, in development: the TypeScript parser is heavy, and the
  // live site never needs it.
  const { applyPackage } = await import("@/lib/edits/apply");
  let result;
  try {
    result = await applyPackage(data);
  } catch (error) {
    result = {
      applied: [],
      skipped: [],
      files: [],
      commit: null,
      pushed: false,
      commitNote: `Nothing was published — applying failed: ${String(error)}`,
    };
  }

  const dir = path.join(process.cwd(), "edits");
  await mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = `edits-${stamp}.json`;
  await writeFile(
    path.join(dir, file),
    JSON.stringify({ ...data, result }, null, 2),
    "utf8",
  );

  return Response.json({ path: `edits/${file}`, ...result });
}
