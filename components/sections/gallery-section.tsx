"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { ScrollPan } from "@/components/ui/scroll-pan";

/**
 * Stable horizontal gallery.
 *
 * The previous sticky+scroll-scrub implementation could shimmer on fine
 * line details during vertical scroll (especially on high-DPI displays).
 * This version keeps the same visual style but switches to a native
 * horizontal pan area, which is jitter-free and predictable.
 */

const GALLERY_ALTS = [
  "Composite long rod insulator",
  "Transmission line insulator",
  "Post insulator installation",
  "Hybrid insulator",
  "Transformer bushing",
  "Cable accessories",
  "Interphase spacer",
  "DPL insulator product",
  "Long rod insulators on the production floor",
  "High-voltage insulators at a substation installation",
] as const;

export function GallerySection() {
  const images = SITE_IMAGES.gallery.map((src, i) => ({
    src,
    alt: GALLERY_ALTS[i] ?? "Taban Niroo product",
  }));

  return (
    <section
      id="gallery"
      className="bg-background py-12 md:py-16"
      aria-label="Product gallery"
    >
      <div className="relative">
        <ScrollPan
          className="px-0"
          innerClassName="px-6 pb-3 md:px-8 lg:px-10"
          ariaLabel="Scrollable product gallery"
          edgeFades={false}
          passVerticalScroll
        >
          <div className="flex gap-4 md:gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-[58vh] w-[80vw] flex-shrink-0 overflow-hidden rounded-2xl ring-1 ring-border/50 dark:ring-white/[0.06] md:h-[64vh] md:w-[56vw] lg:h-[68vh] lg:w-[42vw]"
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, (min-width: 768px) 56vw, 80vw"
                  priority={index < 2}
                />
              </div>
            ))}
          </div>
        </ScrollPan>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
        <span
          aria-hidden
          className="inline-block h-px w-6 bg-current opacity-60"
        />
        <span>Scroll or drag to pan</span>
        <span
          aria-hidden
          className="inline-block h-px w-6 bg-current opacity-60"
        />
      </div>
    </section>
  );
}
