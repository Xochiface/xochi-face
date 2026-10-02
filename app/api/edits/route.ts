import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Receives an edit-mode package and writes it into the project at edits/,
 * so a developer can read and apply it directly.
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

  const dir = path.join(process.cwd(), "edits");
  await mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = `edits-${stamp}.json`;
  await writeFile(path.join(dir, file), JSON.stringify(data, null, 2), "utf8");

  return Response.json({ path: `edits/${file}` });
}
