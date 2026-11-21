import { open, stat } from "node:fs/promises";
import path from "node:path";

/**
 * Serves an uploaded file back from edits/media/ so edit mode can preview it
 * in place. Development only.
 *
 * Supports byte ranges: Safari on iPhone won't play a video at all unless the
 * server can answer partial requests.
 *
 * Only plain filenames from edits/media/ are served — no slashes, no "..",
 * nothing outside that folder.
 */

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  const { file } = await params;
  if (!/^[\w.-]+$/.test(file) || file.includes("..")) {
    return new Response("Bad name", { status: 400 });
  }

  const full = path.join(process.cwd(), "edits", "media", file);
  let size: number;
  try {
    const info = await stat(full);
    if (!info.isFile()) throw new Error("not a file");
    size = info.size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");

  let start = 0;
  let end = size - 1;
  if (range) {
    if (range[1] === "" && range[2] !== "") {
      start = Math.max(0, size - Number(range[2])); // suffix range: last N bytes
    } else {
      start = Number(range[1] || 0);
      if (range[2] !== "") end = Math.min(Number(range[2]), size - 1);
    }
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
  }

  const length = end - start + 1;
  const handle = await open(full, "r");
  try {
    const buffer = new Uint8Array(length);
    await handle.read(buffer, 0, length, start);
    return new Response(buffer, {
      status: range ? 206 : 200,
      headers: {
        "Content-Type": type,
        "Content-Length": String(length),
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
        ...(range ? { "Content-Range": `bytes ${start}-${end}/${size}` } : {}),
      },
    });
  } finally {
    await handle.close();
  }
}
