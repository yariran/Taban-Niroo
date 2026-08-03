"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { ScrollPan } from "@/components/ui/scroll-pan";

/**
 * Horizontal product gallery — static images, pan to browse.
 */

const GALLERY_ALTS = [
  "Composite long rod insulator",
  "Post insulator installation",
  "Hybrid insulator",
  "Transformer bushing",
  "Interphase spacer",
  "DPL insulator product",
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
          edgeFades
          fadeFrom="from-background"
          passVerticalScroll
        >
          <div className="flex gap-4 md:gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-[min(58vh,22rem)] w-[min(80vw,22rem)] flex-shrink-0 overflow-hidden rounded-2xl ring-1 ring-border/50 dark:ring-white/[0.06] md:h-[min(64vh,26rem)] md:w-[min(56vw,28rem)] lg:h-[min(68vh,30rem)] lg:w-[min(42vw,32rem)]"
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover transition-none"
                  sizes="(min-width: 1024px) 42vw, (min-width: 768px) 56vw, 80vw"
                  quality={75}
                  decoding="async"
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
