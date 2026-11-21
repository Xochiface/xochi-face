/**
 * next/image loader for the static live site.
 *
 * There's no image server on Cloudflare's free static hosting, so every size a
 * photo can be shown at is made ahead of time by scripts/size-images.mjs, as
 * /_img/<name>-<width>.webp. This only names the file; the browser still picks
 * the right width for the screen from srcset, exactly as with Next's own
 * optimiser. Widths are listed in lib/image-widths.json.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/_next/static/media/")) return src;
  const name = src.slice(src.lastIndexOf("/") + 1).replace(/\.[^.]+$/, "");
  return `/_img/${name}-${width}.webp`;
}
