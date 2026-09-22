"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutTemplate, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/products";
import { SITE_IMAGES } from "@/lib/site-images";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";

const NEW_PRODUCT_ID = "line-post-pivot-type";
const NEW_RELEASE_ALT = "New Product: 63 & 132 kV Line Post Insulator";

/** Full catalogue frame (matches /public/images/new-release-line-post-insulator.jpg). */
const IMG_W = 1024;
const IMG_H = 650;

/**
 * Split catalogue titles like "63 & 132 kV Line Post Insulator" into
 * a display name + a quiet voltage spec — keeps SI units out of the
 * headline so they read as engineering data, not display copy.
 */
function splitVoltageTitle(raw: string): { name: string; voltages: string[] } {
  const match = raw.match(
    /^((?:\d+\s*(?:&\s*|–\s*|-\s*)?)+)\s*kV\s+(.+)$/i,
  );
  if (!match) {
    return { name: raw, voltages: [] };
  }
  const voltages = match[1]!
    .split(/\s*(?:&|–|-)\s*/)
    .map((v) => v.trim())
    .filter(Boolean);
  return { name: match[2]!.trim(), voltages };
}

function ReleaseHeading({
  eyebrow,
  title,
  embedded = false,
}: {
  eyebrow: string;
  title: string;
  embedded?: boolean;
}) {
  const { name, voltages } = splitVoltageTitle(title);
  const fullLabel =
    voltages.length > 0 ? `${voltages.join(" & ")} kV ${name}` : title;

  return (
    <header className="flex flex-col items-center text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-burgundy sm:text-[11px]">
        {eyebrow}
      </p>
      <h2
        id="new-release-heading"
        className={cn(
          "mt-3 max-w-[18ch] text-balance font-hero-slogan font-semibold uppercase leading-[1.08] tracking-tight text-brand-navy",
          embedded
            ? "text-[clamp(1.5rem,3.8vw,2.15rem)]"
            : "text-[clamp(1.65rem,4vw,2.5rem)]",
        )}
      >
        {name}
        <span className="sr-only">
          {voltages.length > 0 ? `, ${voltages.join(" & ")} kV` : ""}
        </span>
      </h2>

      {voltages.length > 0 ? (
        <p
          className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] tabular-nums tracking-[0.14em] text-muted-foreground sm:text-xs"
          aria-hidden
        >
          {voltages.map((v, i) => (
            <span key={v} className="inline-flex items-center gap-2">
              {i > 0 ? (
                <span className="text-brand-navy/25" aria-hidden>
                  ·
                </span>
              ) : null}
              <span>
                <span className="text-brand-navy/80">{v}</span>
                <span className="ms-1 text-[0.85em] normal-case tracking-normal text-muted-foreground">
                  kV
                </span>
              </span>
            </span>
          ))}
        </p>
      ) : null}

      <span className="sr-only">{fullLabel}</span>
    </header>
  );
}

function SpecActions({
  productHref,
  compact = false,
}: {
  productHref: string;
  compact?: boolean;
}) {
  const itemClass = cn(
    "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.18em] text-brand-navy/70 transition-colors",
    "hover:text-brand-navy",
    compact
      ? "min-h-9 px-3 text-[10px]"
      : "min-h-10 px-4 text-[11px]",
  );

  return (
    <div className="flex items-center justify-center gap-0">
      <Link href={productHref} className={itemClass}>
        <LayoutTemplate size={compact ? 13 : 14} aria-hidden />
        Table & drawing
      </Link>
      <span
        className="mx-1 h-3.5 w-px shrink-0 bg-brand-navy/15"
        aria-hidden
      />
      <Link
        href={productHref}
        className={cn(itemClass, "text-brand-burgundy hover:text-brand-burgundy-strong")}
      >
        Details
        <ArrowRight size={compact ? 12 : 13} aria-hidden />
      </Link>
    </div>
  );
}

export function NewReleaseShowcaseSection({
  cms,
  productId,
  /** Compact panel for sticky hero scene C (no outer page padding). */
  embedded = false,
}: {
  cms?: ContentBlock;
  productId?: string;
  embedded?: boolean;
} = {}) {
  const id = productId || NEW_PRODUCT_ID;
  const product = PRODUCTS.find((item) => item.id === id) ?? PRODUCTS[0]!;
  const productHref = cmsText(cms, "ctaHref", `/products/${product.id}`);
  const eyebrow = cmsText(cms, "eyebrow", "New Product");
  const title = cmsText(cms, "title", "63 & 132 kV Line Post Insulator");
  const image =
    cmsImage(cms, SITE_IMAGES.newRelease) ?? SITE_IMAGES.newRelease;

  const media = image.startsWith("http") ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image}
      alt={NEW_RELEASE_ALT}
      className={cn(
        "mx-auto h-auto w-full object-contain object-center",
        embedded
          ? "max-h-[min(48vh,380px)]"
          : "max-h-[min(56vh,520px)]",
      )}
    />
  ) : (
    <Image
      src={image}
      alt={NEW_RELEASE_ALT}
      width={IMG_W}
      height={IMG_H}
      priority={embedded}
      quality={75}
      className={cn(
        "mx-auto h-auto w-full object-contain object-center",
        embedded
          ? "max-h-[min(48vh,380px)]"
          : "max-h-[min(56vh,520px)]",
      )}
      sizes="(min-width: 1280px) 900px, 92vw"
    />
  );

  if (embedded) {
    return (
      <div
        id="new-release"
        className="flex h-full w-full flex-col items-center justify-center bg-background px-5 py-10 sm:px-8 md:px-12"
        aria-labelledby="new-release-heading"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <ReleaseHeading eyebrow={eyebrow} title={title} embedded />
          <div
            className="mt-5 h-px w-10 bg-gradient-to-r from-transparent via-brand-navy/25 to-transparent"
            aria-hidden
          />

          {/* Same plate as the standalone showcase and the featured grid:
              this shot is a white-ground studio render, and unplated it
              floated as a hard white rectangle on the graphite scene. */}
          <div className="product-plate mt-6 w-full overflow-hidden rounded-2xl p-4 sm:mt-8 sm:p-6">
            {media}
          </div>

          <div className="mt-6 border-t border-brand-navy/10 pt-5 sm:mt-8 sm:pt-6">
            <SpecActions productHref={productHref} compact />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      id="new-release"
      className="relative bg-background"
      aria-labelledby="new-release-heading"
    >
      <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 md:px-10 md:py-24 pb-[max(3rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col items-center text-center">
          <ReleaseHeading eyebrow={eyebrow} title={title} />
          <div
            className="mt-5 h-px w-12 bg-gradient-to-r from-transparent via-brand-navy/25 to-transparent"
            aria-hidden
          />

          {/* The photograph gets the shared catalogue plate; the actions
              strip stays on the card surface, outside it — `.product-plate`
              multiplies its whole child group, which would eat the links. */}
          <div className="mt-10 w-full overflow-hidden rounded-2xl border border-brand-navy/10 bg-card shadow-elevate dark:border-white/[0.08]">
            <div className="product-plate px-4 pt-6 sm:px-8 sm:pt-8">
              {media}
            </div>
            <div className="border-t border-brand-navy/10 px-4 py-5 dark:border-white/[0.08] sm:px-8 sm:py-6">
              <SpecActions productHref={productHref} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
