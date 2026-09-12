"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Ruler, Search, Table2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ProductModal,
  type ProductModalView,
  type ProductSpec,
  type ProductVariant,
} from "./product-modal";
import { PRODUCTS, listProducts, resolveProductImage } from "@/lib/products";
import { TechRef } from "@/components/ui/tech-ref";
import { LocaleLink, useLocale } from "@/components/locale-link";
import { CATALOGUE_UI, pickLocale } from "@/lib/i18n/section-copy";

type ProductItem = {
  id: string;
  name: string;
  family: string;
  subFamily: string;
  catalogueRef: string;
  summary: string;
  applications: string;
  voltageClass?: string;
  standard?: string;
  image?: string | null;
  order: number;
  variants?: ProductVariant[];
};

/**
 * Product list mirrors the structure of the Taban Niroo 2026 Catalogue.
 * Each product has `image: null` — replace with the final image path
 * (e.g. "/products/long-rod-distribution.jpg") when the visuals are ready.
 *
 * To populate the Technical Data table for a catalogue reference, add a
 * `technical` object on the corresponding variant — every field is
 * optional and any missing field renders as a dash in the datasheet.
 *
 * @example
 *   // Matches the 13-column, 26-row datasheet grid used across the
 *   // entire catalogue (Catalogue Number + Shed No. + 11 data columns).
 *   // Only the fields you populate are shown; any missing field
 *   // renders as a dash in the grid.
 *   {
 *     code: "DPL132-5160-80/120BS",
 *     voltage: "132 kV",
 *     technical: {
 *       shedNo: "—",
 *       ratedVoltage: "132",
 *       sml: "80/120",
 *       couplingSize: "16",
 *       sectionLength: "1460±25",
 *       arcingDistance: "1340",
 *       shedDiameter: "160/125",
 *       shedSpacing: "60",
 *       minimumCreepage: "5160",
 *       impulseWithstand: "660",
 *       wetWithstand: "275",
 *       weight: "8.000",
 *     },
 *   }
 */
const PRODUCT_ITEMS_FALLBACK: ProductItem[] = listProducts(
  PRODUCTS,
) as unknown as ProductItem[];

const FAMILY_ORDER = [
  "Silicone Composite Insulators",
  "Hybrid Insulators",
  "Transformer Bushings",
  "Cable Accessories",
  "Overhead Feeder Line Composite",
  "Creepage Extenders & Covers",
] as const;

const FAMILY_INDEX: Record<string, string> = {
  "Silicone Composite Insulators": "01",
  "Hybrid Insulators": "02",
  "Transformer Bushings": "03",
  "Cable Accessories": "04",
  "Overhead Feeder Line Composite": "05",
  "Creepage Extenders & Covers": "06",
};

const FAMILY_SHORT: Record<string, string> = {
  "Silicone Composite Insulators": "Composite",
  "Hybrid Insulators": "Hybrid",
  "Transformer Bushings": "Bushings",
  "Cable Accessories": "Cable",
  "Overhead Feeder Line Composite": "Feeder line",
  "Creepage Extenders & Covers": "Creepage",
};

const FAMILY_ANCHOR: Record<string, string> = {
  "Silicone Composite Insulators": "cat-silicone-composite-insulators",
  "Hybrid Insulators": "cat-hybrid-insulators",
  "Transformer Bushings": "cat-transformer-bushings",
  "Cable Accessories": "cat-cable-accessories",
  "Overhead Feeder Line Composite": "cat-overhead-feeder",
  "Creepage Extenders & Covers": "cat-creepage-extenders",
};

function toSpec(item: ProductItem): ProductSpec {
  return {
    id: item.id,
    name: item.name,
    family: item.family,
    subFamily: item.subFamily,
    catalogueRef: item.catalogueRef,
    summary: item.summary,
    applications: item.applications,
    voltageClass: item.voltageClass,
    standard: item.standard,
    image: resolveProductImage(item),
    variants: item.variants,
  };
}

/**
 * Product card visual — product image or family-mapped catalogue asset.
 */
function ProductVisual({
  item,
  codeLabel,
}: {
  item: ProductItem;
  codeLabel: string;
}) {
  const src = resolveProductImage(item);

  if (src) {
    return (
      <>
        <Image
          src={src}
          alt={item.name}
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute start-3 top-3 rounded-full border border-white/30 bg-black/45 px-2 py-0.5 text-[10px] tracking-wider text-white backdrop-blur-sm">
          <TechRef>{codeLabel}</TechRef>
        </div>
        {item.voltageClass && (
          <div className="absolute end-3 top-3 rounded-full border border-white/30 bg-black/45 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            <TechRef>{item.voltageClass}</TechRef>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className="absolute inset-0 bg-muted/50 dark:bg-white/[0.03]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 32px)",
      }}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,var(--surface-glow),transparent_70%)] opacity-80" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span
          dir="ltr"
          className="font-hero-slogan text-[clamp(2.2rem,5vw,3.4rem)] font-bold tracking-tight text-foreground/25 [unicode-bidi:isolate]"
        >
          {codeLabel}
        </span>
        <span className="max-w-[16rem] text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/50">
          {item.subFamily}
        </span>
      </div>
      {item.voltageClass && (
        <div className="absolute end-3 top-3 rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-foreground/70 backdrop-blur-sm">
          {item.voltageClass}
        </div>
      )}
    </div>
  );
}

type ModalState = { item: ProductItem; view: ProductModalView } | null;

/**
 * Product card surface.
 *
 * Design intent: the two documentation options the user keeps asking for —
 * "Technical table" and "Product drawing" — must be visible on the card
 * itself, not hidden one click deep. The card is therefore split into:
 *   1. A clickable visual/title region that opens the overview/picker.
 *   2. Two explicit action buttons that jump straight to Table or Drawing.
 *
 * Nested interactive elements are implemented as sibling buttons inside an
 * article (never buttons-inside-buttons) to stay semantically valid.
 */
function ProductCard({
  item,
  codeLabel,
  onOpen,
  ui,
}: {
  item: ProductItem;
  codeLabel: string;
  onOpen: (item: ProductItem, view?: ProductModalView) => void;
  ui: (typeof CATALOGUE_UI)["en"] | (typeof CATALOGUE_UI)["fa"];
}) {
  return (
    <article className="group interactive-lift relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/90 text-start shadow-elevate dark:border-white/[0.08] dark:bg-card/50">
      <button
        type="button"
        onClick={() => onOpen(item, "picker")}
        aria-label={`Open ${item.name} overview`}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-t-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
      >
        <ProductVisual item={item} codeLabel={codeLabel} />
      </button>

      <div className="flex flex-1 flex-col gap-3 border-t border-border/30 p-5 dark:border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {item.subFamily}
          </span>
          {item.voltageClass && (
            <span className="rounded-full border border-foreground/20 bg-foreground/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-foreground/80">
              {item.voltageClass}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpen(item, "picker")}
          aria-label={
            item.name.trim()
              ? undefined
              : `Open product ${item.id} overview`
          }
          className="text-start text-base font-semibold leading-snug tracking-tight text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground md:text-lg"
        >
          <TechRef className="font-semibold font-sans">
            {item.name.trim() || item.catalogueRef || item.id}
          </TechRef>
        </button>

        {/* Two primary options — exactly as requested: clicking either opens
            the corresponding content inside the product modal on this page. */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpen(item, "table")}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            aria-label={`${ui.viewTable}: ${item.name}`}
          >
            <Table2 size={13} aria-hidden strokeWidth={1.75} />
            {ui.viewTable}
          </button>
          <button
            type="button"
            onClick={() => onOpen(item, "drawing")}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            aria-label={`${ui.viewDrawing}: ${item.name}`}
          >
            <Ruler size={13} aria-hidden strokeWidth={1.75} />
            {ui.viewDrawing}
          </button>
        </div>

        <Link
          href={`/products/${item.id}`}
          className="mt-2 inline-flex min-h-11 items-center gap-1 self-start py-2 text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground md:min-h-0 md:py-0"
          aria-label={`Open detail page for ${item.name}`}
        >
          Detail page
          <ArrowUpRight
            size={11}
            aria-hidden
            strokeWidth={1.75}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}

export function ProductCatalogSection({
  products,
}: {
  products?: ProductItem[];
} = {}) {
  const locale = useLocale();
  const ui = pickLocale(CATALOGUE_UI, locale);
  const PRODUCT_ITEMS: ProductItem[] = products?.length
    ? products
    : PRODUCT_ITEMS_FALLBACK;

  const [query, setQuery] = useState("");
  const [activeFamily, setActiveFamily] = useState<string>("All");
  const [modalState, setModalState] = useState<ModalState>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  /**
   * A single entry point for opening a product. Callers pass which view the
   * modal should land on so the two card-level shortcuts ("Table" / "Drawing")
   * go straight to the relevant content instead of forcing an extra step.
   */
  const openProduct = useCallback(
    (item: ProductItem, view: ProductModalView = "picker") => {
      setModalState({ item, view });
    },
    [],
  );

  const orderedFamilies = useMemo(
    () => FAMILY_ORDER.filter((f) => PRODUCT_ITEMS.some((p) => p.family === f)),
    [PRODUCT_ITEMS],
  );

  const familyCounts = useMemo(() => {
    const c: Record<string, number> = { All: PRODUCT_ITEMS.length };
    for (const f of orderedFamilies) {
      c[f] = PRODUCT_ITEMS.filter((p) => p.family === f).length;
    }
    return c;
  }, [orderedFamilies, PRODUCT_ITEMS]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCT_ITEMS.filter((item) => {
      const familyOk = activeFamily === "All" || item.family === activeFamily;
      if (!familyOk) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.family.toLowerCase().includes(q) ||
        item.subFamily.toLowerCase().includes(q) ||
        item.catalogueRef.toLowerCase().includes(q) ||
        item.applications.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        (item.voltageClass ?? "").toLowerCase().includes(q)
      );
    });
  }, [activeFamily, query, PRODUCT_ITEMS]);

  /**
   * Groups results by family only. Sub-family is surfaced as a small tag on
   * each card rather than a third header level, so the catalogue reads as a
   * simple two-level tree (Family → Products) and stops overwhelming users.
   */
  const groupedFiltered = useMemo(() => {
    const map: Record<string, ProductItem[]> = {};
    for (const item of filteredItems) {
      if (!map[item.family]) map[item.family] = [];
      map[item.family]!.push(item);
    }
    for (const family of Object.keys(map)) {
      map[family]!.sort((a, b) => a.order - b.order);
    }
    return map;
  }, [filteredItems]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const entry = Object.entries(FAMILY_ANCHOR).find(([, a]) => a === hash);
    if (entry) setActiveFamily(entry[0]);
  }, []);

  const closeModal = useCallback(() => setModalState(null), []);

  return (
    <section
      id="product-explorer"
      ref={sectionRef}
      className="scroll-mt-28 border-y border-border/50 bg-background dark:border-white/[0.06]"
    >
      <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sticky family navigator */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {ui.rangeEyebrow}
            </p>
            <h2 className="mt-3 text-lg font-medium tracking-tight text-foreground">
              {ui.browseByFamily}
            </h2>

            <nav
              aria-label={ui.familyNavAria}
              className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-card/90 shadow-elevate dark:border-white/[0.08] dark:bg-card/50"
            >
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveFamily("All")}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 border-b border-border/40 px-4 py-3 text-start text-sm transition-colors dark:border-white/[0.06]",
                      activeFamily === "All"
                        ? "bg-muted/40 text-foreground"
                        : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                    )}
                    aria-pressed={activeFamily === "All"}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        00
                      </span>
                      <span className="font-medium">{ui.allProducts}</span>
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {familyCounts.All}
                    </span>
                  </button>
                </li>
                {orderedFamilies.map((family, i) => {
                  const isActive = activeFamily === family;
                  const isLast = i === orderedFamilies.length - 1;
                  return (
                    <li key={family}>
                      <button
                        type="button"
                        onClick={() => setActiveFamily(family)}
                        className={cn(
                          "flex w-full items-start justify-between gap-3 px-4 py-3 text-start text-sm transition-colors",
                          !isLast &&
                            "border-b border-border/40 dark:border-white/[0.06]",
                          isActive
                            ? "bg-muted/40 text-foreground"
                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                        )}
                        aria-pressed={isActive}
                      >
                        <span className="flex items-start gap-3">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {FAMILY_INDEX[family]}
                          </span>
                          <span className="font-medium leading-snug">
                            {family}
                          </span>
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {familyCounts[family] ?? 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-6 rounded-2xl border border-border/40 bg-muted/30 p-5 dark:border-white/[0.06] dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {ui.procurement}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {ui.procurementBody}
              </p>
              <LocaleLink
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:text-foreground/70"
              >
                {ui.engineeringRequest}
                <ArrowRight size={14} aria-hidden />
              </LocaleLink>
            </div>
          </aside>

          <div>
            {activeFamily !== "All" && (
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                <TechRef>{activeFamily}</TechRef>
              </p>
            )}
            <h3 className="font-hero-slogan mt-3 text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? ui.product : ui.products}
              {/* `text-foreground/45` measured 2.89:1 light — under even the
                  3.0 large-text floor this 36px bold heading gets. The
                  trailing clause still reads as secondary against the count
                  beside it: 5.8:1 vs 16.5:1. */}
              <span className="text-muted-foreground">
                {activeFamily === "All" && !query.trim()
                  ? ui.acrossAll
                  : ui.matchFilter}
              </span>
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {ui.viewsHintBefore}
              <span className="text-foreground">{ui.viewTable}</span>
              {ui.viewsHintMid}
              <span className="text-foreground">{ui.viewDrawing}</span>
              {ui.viewsHintAfter}
            </p>

            {/* Mobile family chips — keep the sidebar nav reachable on small screens */}
            <div
              role="region"
              aria-label={ui.filterAria}
              tabIndex={0}
              className="mt-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-foreground/30 lg:hidden [&::-webkit-scrollbar]:hidden"
            >
              <button
                type="button"
                onClick={() => setActiveFamily("All")}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors",
                  activeFamily === "All"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={activeFamily === "All"}
              >
                {ui.all} · {familyCounts.All}
              </button>
              {orderedFamilies.map((family) => {
                const isActive = activeFamily === family;
                return (
                  <button
                    key={family}
                    type="button"
                    onClick={() => setActiveFamily(family)}
                    className={cn(
                      "min-h-11 shrink-0 rounded-full border px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors",
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                    aria-pressed={isActive}
                  >
                    {FAMILY_SHORT[family] ?? family} · {familyCounts[family] ?? 0}
                  </button>
                );
              })}
            </div>

            {/* Search + counters */}
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/90 p-3 shadow-elevate dark:border-white/[0.08] dark:bg-card/50 md:flex-row md:items-center md:justify-between md:p-4">
              <div className="relative w-full md:max-w-[380px]">
                <Search
                  size={16}
                  aria-hidden
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ui.searchPlaceholder}
                  className="h-11 w-full rounded-full border border-border bg-background ps-9 pe-9 text-base text-foreground outline-none transition-colors focus:border-foreground md:h-10 md:text-sm"
                  aria-label={ui.searchAria}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={ui.clearSearch}
                  >
                    <X size={14} aria-hidden />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="rounded-full border border-border bg-background px-2.5 py-1">
                  {ui.total} {PRODUCT_ITEMS.length}
                </span>
                <span className="rounded-full border border-foreground bg-foreground px-2.5 py-1 text-background">
                  {ui.showing} {filteredItems.length}
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="mt-10">
              {filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    {ui.noResults}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveFamily("All");
                    }}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:text-foreground/70"
                  >
                    {ui.resetFilters}
                    <ArrowRight size={14} aria-hidden />
                  </button>
                </div>
              ) : (
                <div className="space-y-14">
                  {orderedFamilies
                    .filter((f) => groupedFiltered[f])
                    .map((family) => {
                      const items = groupedFiltered[family]!;
                      // Hide the family header when the user has already
                      // scoped the view to a single family — avoids a redundant
                      // title and lets the grid read as a clean result list.
                      const showFamilyHeader =
                        activeFamily === "All" && !query.trim();

                      return (
                        <section
                          key={family}
                          id={FAMILY_ANCHOR[family]}
                          className="scroll-mt-28"
                        >
                          {showFamilyHeader && (
                            <div className="mb-6 flex items-end justify-between gap-4 border-b border-border/40 pb-4 dark:border-white/[0.06]">
                              <div className="flex items-end gap-3">
                                <span className="font-mono text-xs text-muted-foreground">
                                  {FAMILY_INDEX[family]}
                                </span>
                                <h4 className="font-hero-slogan text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl">
                                  <TechRef className="font-bold font-sans uppercase">
                                    {family}
                                  </TechRef>
                                </h4>
                              </div>
                              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                {items.length}{" "}
                                {items.length === 1 ? ui.item : ui.items}
                              </span>
                            </div>
                          )}

                          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {items.map((item, idx) => {
                              const codeLabel = `${FAMILY_INDEX[family]}.${String(
                                idx + 1,
                              ).padStart(2, "0")}`;
                              return (
                                <li key={item.id}>
                                  <ProductCard
                                    item={item}
                                    codeLabel={codeLabel}
                                    onOpen={openProduct}
                                    ui={ui}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        </section>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        open={modalState !== null}
        product={modalState ? toSpec(modalState.item) : null}
        initialView={modalState?.view ?? "picker"}
        onClose={closeModal}
      />
    </section>
  );
}
