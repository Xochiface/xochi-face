import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Receives a photo or video from edit mode and stores it in edits/media/.
 *
 * Development only — returns 404 in production, where edit mode can't upload.
 *
 * Photos are made web-ready on arrival:
 *   - iPhone HEIC is converted to JPEG (sharp can't read HEIC, so heic-convert
 *     decodes it first). Uploading from the iPhone itself usually arrives as
 *     JPEG already, because iOS converts on upload.
 *   - EXIF orientation is applied, so portrait shots don't arrive sideways.
 *   - The long edge is capped at 3200px. Phone photos are far larger than the
 *     site needs; nothing is ever upscaled (withoutEnlargement).
 *   - All metadata is removed, including GPS. iPhone photos record where they
 *     were taken, and that shouldn't leak onto a public website.
 *
 * The untouched original is kept in edits/media/originals/ (git-ignored)
 * for the final crop. Videos are stored as-is: converting them for the web
 * needs ffmpeg, which happens when the edits are applied.
 *
 * Filenames are generated here; nothing from the request picks a path.
 */

const MAX_IMAGE_BYTES = 60 * 1024 * 1024;
const MAX_VIDEO_BYTES = 300 * 1024 * 1024;
const LONG_EDGE = 3200;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".avif"]);
const VIDEO_EXT = new Set([".mov", ".mp4", ".m4v", ".webm"]);

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Expected a file upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "No file received" }, { status: 400 });
  }

  const slot = String(form.get("slot") ?? "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 40) || "photo";
  const ext = path.extname(file.name).toLowerCase();
  const type = file.type.toLowerCase();
  const isVideo = type.startsWith("video/") || VIDEO_EXT.has(ext);
  const isHeic = /heic|heif/.test(type) || ext === ".heic" || ext === ".heif";
  const isImage = !isVideo && (type.startsWith("image/") || IMAGE_EXT.has(ext));

  if (!isImage && !isVideo) {
    return Response.json({ error: "That isn't a photo or video file" }, { status: 415 });
  }
  if (file.size > (isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
    return Response.json(
      { error: `File is too large (limit ${isVideo ? "300MB for video" : "60MB for photos"})` },
      { status: 413 },
    );
  }

  const dir = path.join(process.cwd(), "edits", "media");
  const originals = path.join(dir, "originals");
  await mkdir(originals, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const base = `${stamp}-${slot}`;
  const safeExt = /^\.[a-z0-9]{2,5}$/.test(ext) ? ext : isVideo ? ".mov" : ".jpg";
  const originalName = path.basename(file.name).slice(0, 120);
  const bytes = Buffer.from(await file.arrayBuffer());

  /* Video — keep as-is. */
  if (isVideo) {
    const name = `${base}${safeExt}`;
    await writeFile(path.join(dir, name), bytes);
    return Response.json({
      kind: "video",
      file: `edits/media/${name}`,
      original: `edits/media/${name}`,
      preview: `/api/edits/media/${name}`,
      originalName,
      width: null,
      height: null,
      bytes: bytes.length,
      converted: false,
      note: "Kept as uploaded. It will be compressed and converted to a web format when applied.",
    });
  }

  /* Photo — store the original, then make a web-ready JPEG. */
  await writeFile(path.join(originals, `${base}${safeExt}`), bytes);

  let input: Buffer = bytes;
  let converted = false;
  try {
    if (isHeic) {
      const { default: convert } = await import("heic-convert");
      input = Buffer.from(await convert({ buffer: bytes, format: "JPEG", quality: 0.95 }));
      converted = true;
    }

    const meta = await sharp(input).metadata();
    const rotated = (meta.orientation ?? 1) >= 5;
    const sourceWidth = rotated ? meta.height : meta.width;
    const sourceHeight = rotated ? meta.width : meta.height;

    const out = await sharp(input)
      .rotate()
      .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    const name = `${base}.jpg`;
    await writeFile(path.join(dir, name), out.data);

    return Response.json({
      kind: "image",
      file: `edits/media/${name}`,
      original: `edits/media/originals/${base}${safeExt}`,
      preview: `/api/edits/media/${name}`,
      originalName,
      width: out.info.width,
      height: out.info.height,
      sourceWidth: sourceWidth ?? null,
      sourceHeight: sourceHeight ?? null,
      bytes: out.info.size,
      converted,
      note: converted ? "Converted from iPhone HEIC to JPEG." : null,
    });
  } catch {
    return Response.json(
      { error: "Couldn't read that photo. Try exporting it as a JPEG, or upload it straight from the phone." },
      { status: 422 },
    );
  }
}
