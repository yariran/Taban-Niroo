"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, DraftingCompass } from "lucide-react";
import { cn } from "@/lib/utils";
import { RevealBlock } from "@/components/ui/reveal-text";
import { PRODUCTS } from "@/lib/products";
import { SITE_IMAGES } from "@/lib/site-images";

const NEW_PRODUCT_ID = "hollow-core-insulator";

/** Full catalogue frame (matches /public/images/new-release-hollow-core.jpg). */
const IMG_W = 2048;
const IMG_H = 1364;

const product =
  PRODUCTS.find((item) => item.id === NEW_PRODUCT_ID) ?? PRODUCTS[0];

const productHref = `/products/${product.id}`;

function ActionPill({ className }: { className?: string }) {
  const linkClass =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-transparent px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/75 transition-colors hover:border-foreground/12 hover:bg-foreground/5 hover:text-foreground md:min-h-0 md:px-4 md:py-2";

  return (
    <div
      className={cn(
        "glass-header-pill glass-header-pill--default mx-auto w-full max-w-md rounded-full border p-1.5",
        className,
      )}
    >
      <div className="flex items-stretch justify-center gap-1 sm:gap-1.5">
        <Link href={productHref} className={cn(linkClass, "flex-1 sm:flex-none")}>
          <FileText size={14} aria-hidden />
          Table
        </Link>
        <span className="my-2 w-px shrink-0 bg-border/80 dark:bg-white/15" aria-hidden />
        <Link href={productHref} className={cn(linkClass, "flex-1 sm:flex-none")}>
          <DraftingCompass size={14} aria-hidden />
          Drawing
        </Link>
      </div>
    </div>
  );
}

export function NewReleaseShowcaseSection() {
  return (
    <section
      id="new-release"
      className="relative bg-background"
      aria-labelledby="new-release-heading"
    >
      <div className="relative mx-auto w-full max-w-[1400px] px-4 pt-10 pb-12 max-[380px]:px-3 md:px-8 md:py-20 lg:px-10 lg:py-24 pb-[max(3rem,env(safe-area-inset-bottom))]">
        <div className="group overflow-hidden rounded-2xl border border-border/40 bg-card shadow-elevate dark:border-white/[0.08] dark:bg-card/50">
          <header className="border-b border-border/25 px-5 py-6 text-center dark:border-white/[0.06] md:px-10 md:py-7">
            <RevealBlock>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                New release
              </p>
            </RevealBlock>
            <h2
              id="new-release-heading"
              className="mx-auto mt-2 min-h-[1.05em] max-w-[16ch] text-balance text-[clamp(1.65rem,6.5vw,3.25rem)] font-semibold leading-[1.04] tracking-tight text-foreground"
            >
              {product.name || "\u00a0"}
            </h2>
            <p className="mx-auto mt-2 max-w-[34ch] text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              Homogeneous field. Silicone housed. 6-1000 kV class applications.
            </p>
          </header>

          {/* Full product photo — white frame blends with image; fills card width */}
          <div className="relative bg-white px-3 py-4 dark:bg-zinc-950/40 sm:px-5 sm:py-5 md:px-8 md:py-6">
            <Image
              src={SITE_IMAGES.newRelease}
              alt={product.name || "New release product"}
              width={IMG_W}
              height={IMG_H}
              priority
              quality={92}
              className="mx-auto h-auto w-full max-w-none object-contain"
              sizes="(min-width: 1280px) 1320px, 96vw"
            />
          </div>

          <div className="border-t border-border/30 bg-card/90 px-4 pb-6 pt-4 dark:border-white/[0.06] dark:bg-card/50 md:px-8 md:pb-7 md:pt-5">
            <ActionPill
              className={cn(
                "opacity-100",
                "md:opacity-0 md:transition-opacity md:duration-500",
                "md:group-hover:opacity-100",
                "[@media(hover:none)]:opacity-100",
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
