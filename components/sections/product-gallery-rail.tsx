"use client";

import { ScrollPan } from "@/components/ui/scroll-pan";
import type { GalleryItem } from "@/lib/gallery-cms";

export function ProductGalleryRail({
  items,
  panHint = "Scroll or drag to pan",
}: {
  items: GalleryItem[];
  panHint?: string;
}) {
  const display =
    items.length > 0
      ? items
      : Array.from({ length: 3 }, (_, i) => ({
          id: `placeholder-${i}`,
          src: "",
          alt: "",
          pathname: "",
        }));

  return (
    <section
      id="product-gallery"
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
          <div className="flex items-stretch gap-4 md:gap-6">
            {display.map((item, index) =>
              item.src ? (
                <div
                  key={item.id}
                  className="flex h-[40vh] flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-border/50 sm:h-[48vh] sm:p-6 md:h-[56vh] md:p-8 dark:ring-white/[0.06]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-auto max-w-none object-contain"
                  />
                </div>
              ) : (
                <div
                  key={item.id}
                  className="flex h-[40vh] w-[70vw] flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted/30 ring-1 ring-border/50 sm:h-[48vh] sm:w-[44vw] md:h-[56vh] md:w-[32vw] lg:w-[26vw] dark:ring-white/[0.06]"
                >
                  <span
                    aria-hidden
                    className="text-xs uppercase tracking-[0.22em] text-muted-foreground/60"
                  >
                    Add image
                  </span>
                </div>
              ),
            )}
          </div>
        </ScrollPan>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
        <span
          aria-hidden
          className="inline-block h-px w-6 bg-current opacity-60"
        />
        <span>{panHint}</span>
        <span
          aria-hidden
          className="inline-block h-px w-6 bg-current opacity-60"
        />
      </div>
    </section>
  );
}
