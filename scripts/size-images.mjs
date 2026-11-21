/**
 * Runs after `next build`: makes every size each photo can be shown at, so
 * the static live site needs no image server (see lib/image-loader.ts).
 *
 * For each photo Next copied into out/_next/static/media/, writes
 * out/_img/<name>-<width>.webp for every width in lib/image-widths.json.
 * Never enlarges: a width beyond the photo's own is written at its real size,
 * under the requested name, so every srcset entry exists.
 */
import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();
const MEDIA = path.join(ROOT, "out", "_next", "static", "media");
const OUT = path.join(ROOT, "out", "_img");
const widths = JSON.parse(await readFile(path.join(ROOT, "lib", "image-widths.json"), "utf8"));
const WIDTHS = [...new Set([...widths.device, ...widths.image])].sort((a, b) => a - b);

let files = [];
try {
  files = (await readdir(MEDIA)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
} catch {
  console.log("size-images: no photos in the build, nothing to do.");
  process.exit(0);
}

await mkdir(OUT, { recursive: true });
let made = 0;
for (const file of files) {
  const name = file.replace(/\.[^.]+$/, "");
  const input = path.join(MEDIA, file);
  const { width: own } = await sharp(input).metadata();
  await Promise.all(
    WIDTHS.map(async (w) => {
      await sharp(input)
        .resize({ width: Math.min(w, own ?? w), withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(OUT, `${name}-${w}.webp`));
      made++;
    }),
  );
}
console.log(`size-images: ${made} sizes for ${files.length} photos.`);
