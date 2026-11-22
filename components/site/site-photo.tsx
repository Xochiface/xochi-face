import Image from "next/image";

import { cn } from "@/lib/utils";
import { framingStyle, photoAttrs, photos, type PhotoName } from "@/content/photos";

/**
 * A site photo in its spot.
 *
 * The spot keeps the shape set in content/photos.ts (\`ratio\`) whatever the
 * photo's own shape, and the photo's \`framing\` chooses which part shows —
 * so a photo can be reframed (edit mode's Reframe) without re-cropping the
 * file. \`fill\` skips the frame for spots whose parent already sizes it (the
 * hero).
 */
export function SitePhoto({
  name,
  sizes,
  className,
  fill = false,
  priority = false,
}: {
  name: PhotoName;
  sizes: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}) {
  const photo = photos[name];
  const image = (
    <Image
      {...photoAttrs(name)}
      src={photo.src}
      alt={photo.alt}
      fill
      priority={priority}
      placeholder="blur"
      sizes={sizes}
      className="object-cover"
      style={framingStyle("framing" in photo ? photo.framing : undefined)}
    />
  );
  if (fill) return image;
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: photo.ratio }}
    >
      {image}
    </div>
  );
}
