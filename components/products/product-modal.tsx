"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Mail, LayoutTemplate, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";
import { trapFocusKeydown } from "@/lib/focus-trap";
import { ScrollPan } from "@/components/ui/scroll-pan";
import {
  techTableBodyCellClass,
  techTableBodyStickyClass,
  techTableClass,
  techTableHeadCellClass,
  techTableHeadStickyClass,
} from "@/components/ui/tech-table";

/**
 * Technical specification row for one catalogue reference.
 *
 * Column layout is a 1:1 transcription of the printed datasheet: the
 * row begins with the Catalogue Number (pulled from `ProductVariant.code`)
 * and is followed by 11 measurement columns. Every field is optional —
 * when a value is missing the table renders "—" so the shape of the
 * row is preserved for procurement engineers.
 *
 * Field key → datasheet header (unit):
 *   shedNo           → "Shed No."                                (—)
 *   ratedVoltage     → "Rated Voltage"                           (kV)
 *   sml              → "Specified Mechanical Load"               (kN)
 *   couplingSize     → "Coupling Size"                           (—)
 *   sectionLength    → "Section Length  H"                       (mm)
 *   arcingDistance   → "Arcing Distance h"                       (mm)
 *   shedDiameter     → "Shed diameter  d1/d2"                    (mm)
 *   shedSpacing      → "Shed Spacing B"                          (mm)
 *   minimumCreepage  → "Minimum Creepage L"                      (mm)
 *   impulseWithstand → "Lightning impulse flashover — Positive"  (kV)
 *   impulseNegative  → "Lightning impulse flashover — Negative"  (kV)
 *   switchingWithstand → "Switching Impulse withstand Voltage" (kV)
 *   dryWithstand     → "Power frequency flashover — Dry"         (kV)
 *   wetWithstand     → "Power frequency flashover — Wet"         (kV)
 *   weight           → "Weight (for Reference)"                  (kg)
 */
export type TechnicalRow = {
  shedNo?: string;
  ratedVoltage?: string;
  sml?: string;
  couplingSize?: string;
  sectionLength?: string;
  arcingDistance?: string;
  shedDiameter?: string;
  shedSpacing?: string;
  minimumCreepage?: string;
  impulseWithstand?: string;
  impulseNegative?: string;
  switchingWithstand?: string;
  dryWithstand?: string;
  wetWithstand?: string;
  weight?: string;
};

/**
 * A single catalogue reference inside a product family.
 *
 * Modelled on the Taban Niroo 2026 Catalogue where every product title
 * (e.g. "Distribution Network Insulator") maps to a list of sized
 * variants identified by a DPL-code. The code itself encodes the
 * voltage class and section length (see the Coding Guide on the
 * products page), so only the deltas that are *not* already implied
 * by the code are stored explicitly here.
 */
export type ProductVariant = {
  code: string;
  voltage: string;
  sectionLength?: string;
  creepage?: string;
  notes?: string;
  /**
   * Per-row values for the full datasheet technical table. Left
   * partially or entirely empty until the test certificate values are
   * populated — the table fills missing cells with a visible dash.
   */
  technical?: TechnicalRow;
};

export type ProductSpec = {
  id: string;
  name: string;
  family: string;
  subFamily?: string;
  catalogueRef: string;
  summary: string;
  applications: string;
  voltageClass?: string;
  standard?: string;
  image?: string | null;
  /** Engineering drawing for the datasheet plate (shown when set). */
  drawing?: string | null;
  variants?: ProductVariant[];
};

/** Combined drawing + table view. Legacy `table` / `drawing` map to datasheet. */
export type ProductModalView = "picker" | "datasheet" | "table" | "drawing";

function resolveModalView(
  view: ProductModalView,
): "picker" | "datasheet" {
  return view === "picker" ? "picker" : "datasheet";
}

type ProductModalProps = {
  open: boolean;
  product: ProductSpec | null;
  initialView?: ProductModalView;
  onClose: () => void;
};

/** Body cells under the flashover headers. */
const TECH_CORE_COLUMNS = [
  "ratedVoltage",
  "sml",
  "sectionLength",
  "arcingDistance",
  "shedDiameter",
  "minimumCreepage",
] as const satisfies ReadonlyArray<keyof TechnicalRow>;

const TECH_FULL_ELECTRICAL = [
  "impulseWithstand",
  "impulseNegative",
  "dryWithstand",
  "wetWithstand",
] as const satisfies ReadonlyArray<keyof TechnicalRow>;

/** All non-MV-24/36 products: Lightning + Switching + Power. */
/** All non-MV-24/36 products: Switching + Lightning + Power. */
const TECH_HV_ELECTRICAL = [
  "switchingWithstand",
  "impulseWithstand",
  "wetWithstand",
] as const satisfies ReadonlyArray<keyof TechnicalRow>;

const FULL_ELECTRICAL_SUBHEADER_IDS = new Set([
  "line-post-24-36",
  "suspension-tension-24-36",
]);

function techBodyColumns(productId: string): readonly (keyof TechnicalRow)[] {
  if (FULL_ELECTRICAL_SUBHEADER_IDS.has(productId)) {
    return [...TECH_CORE_COLUMNS, ...TECH_FULL_ELECTRICAL, "weight"];
  }
  return [...TECH_CORE_COLUMNS, ...TECH_HV_ELECTRICAL, "weight"];
}
export function ProductModal({
  open,
  product,
  initialView = "datasheet",
  onClose,
}: ProductModalProps) {
  const [view, setView] = useState<"picker" | "datasheet">(
    resolveModalView(initialView),
  );
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setView(resolveModalView(initialView));
  }, [open, product?.id, initialView]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    lockBodyScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      trapFocusKeydown(e, dialogRef.current);
    };
    document.addEventListener("keydown", onKey);

    const frame = requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      unlockBodyScroll();
      cancelAnimationFrame(frame);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const title = useMemo(() => product?.name ?? "", [product]);

  if (!mounted || !open || !product) return null;

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-[100] flex items-end justify-center px-3 pb-[max(0.75rem,var(--sab))] pt-[max(0.75rem,var(--sat))] sm:items-center sm:px-4 sm:py-6 md:px-6 md:py-10"
      onMouseDown={handleBackdrop}
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in"
        aria-hidden
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 flex max-h-[min(100dvh,100%)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevate outline-none animate-scale-in"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-border/60 bg-card/95 px-5 py-4 md:px-7 md:py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>{product.family}</span>
              {product.subFamily && (
                <>
                  <span aria-hidden className="opacity-40">
                    ·
                  </span>
                  <span>{product.subFamily}</span>
                </>
              )}
              {product.voltageClass && (
                <>
                  <span aria-hidden className="opacity-40">
                    ·
                  </span>
                  <span>{product.voltageClass}</span>
                </>
              )}
            </div>
            <h2
              id="product-modal-title"
              className="mt-1 truncate text-xl font-semibold tracking-tight text-foreground md:text-2xl"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background text-foreground transition-colors hover:border-foreground"
          >
            <X size={16} aria-hidden />
          </button>
        </header>

        {/* Body */}
        <div
          className="scroll-pan-bar min-h-0 flex-1 overflow-y-auto overscroll-contain"
          data-lenis-prevent
          data-lenis-prevent-touch
        >
          {view === "picker" && (
            <PickerView onPickDatasheet={() => setView("datasheet")} />
          )}
          {view === "datasheet" && (
            <DatasheetView
              product={product}
              onBack={() => setView("picker")}
            />
          )}
        </div>

        {/* Footer actions */}
        <footer className="flex flex-col gap-3 border-t border-border/60 bg-muted/30 px-5 py-4 pb-[max(1rem,var(--sab))] sm:flex-row sm:items-center sm:justify-between md:px-7 md:pb-4">
          <p className="text-xs text-muted-foreground">
            {product.catalogueRef}
          </p>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <a
              href={`/contact?ref=${encodeURIComponent(product.id)}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:border-foreground sm:flex-initial"
            >
              <Mail size={14} aria-hidden />
              Enquire
            </a>
            <a
              href={`/contact?ref=${encodeURIComponent(product.id)}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-brand-burgundy sm:flex-initial"
            >
              <Mail size={14} aria-hidden />
              Request datasheet
            </a>
          </div>
        </footer>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

/**
 * Single entry into the combined datasheet (drawing slot above, table below).
 * Drawing art is withheld for now — the labelled slot stays for later assets.
 */
function PickerView({ onPickDatasheet }: { onPickDatasheet: () => void }) {
  return (
    <div className="px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Product documentation
        </p>
        <h3 className="font-hero-slogan mt-3 text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl">
          Drawing and technical table
        </h3>
      </div>

      <div className="mx-auto mt-8 max-w-md">
        <PickerCard
          icon={<LayoutTemplate size={26} aria-hidden strokeWidth={1.5} />}
          label="01"
          title="Table & drawing"
          description="Sectional drawing on top, full ratings table underneath."
          onClick={onPickDatasheet}
        />
      </div>
    </div>
  );
}

function PickerCard({
  icon,
  label,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex h-full flex-col items-start gap-5 overflow-hidden rounded-2xl border border-border/70 bg-background p-6 text-start transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-foreground hover:shadow-elevate",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity group-hover:opacity-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 28px)",
        }}
      />

      <span className="relative font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
        {label}
      </span>

      <span className="relative flex size-14 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-foreground transition-colors group-hover:border-brand-navy group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </span>

      <div className="relative">
        <p className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <span className="relative mt-auto inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
        Open
        <ArrowRight
          size={12}
          aria-hidden
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </button>
  );
}

function BackBar({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 bg-muted/20 px-5 py-3 md:px-7">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground transition-colors hover:border-foreground"
      >
        <ArrowLeft size={12} aria-hidden />
        Back
      </button>
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

type DatasheetRow = { code: string; technical?: TechnicalRow };

/** One table row per populated product variant (no blank padding rows). */
function buildTechRows(product: ProductSpec): DatasheetRow[] {
  return (product.variants ?? []).map((v) => ({
    code: v.code,
    technical: v.technical,
  }));
}

/**
 * Technical data table.
 * 24/36 kV Suspension + Line Post keep Pos/Neg + Dry/Wet sub-headers.
 * All other products: Lightning + Power group titles only (Pos + Wet values).
 */
function TechnicalDataTable({ product }: { product: ProductSpec }) {
  const rows = buildTechRows(product);
  const fullElectrical = FULL_ELECTRICAL_SUBHEADER_IDS.has(product.id);
  const hasSwitching = !fullElectrical;
  const bodyColumns = techBodyColumns(product.id);
  const rowSpan = fullElectrical ? 2 : 1;

  return (
    <ScrollPan
      ariaLabel={`${product.name} technical data`}
      fadeFrom="from-card"
      className="rounded-2xl border border-border/70"
      passVerticalScroll
    >
      <table
        className={cn(
          techTableClass,
          fullElectrical || hasSwitching ? "min-w-[980px]" : "min-w-[820px]",
        )}
      >
        <thead>
          <tr>
            <th rowSpan={rowSpan} scope="col" className={techTableHeadStickyClass}>
              Type
            </th>
            <th rowSpan={rowSpan} scope="col" className={techTableHeadCellClass}>
              Rated System Voltage (kV)
            </th>
            <th rowSpan={rowSpan} scope="col" className={techTableHeadCellClass}>
              Specified mechanical load (kN)
            </th>
            <th rowSpan={rowSpan} scope="col" className={techTableHeadCellClass}>
              Section length (mm)
            </th>
            <th rowSpan={rowSpan} scope="col" className={techTableHeadCellClass}>
              Arcing distance (mm)
            </th>
            <th rowSpan={rowSpan} scope="col" className={techTableHeadCellClass}>
              Diameter of shed (mm)
            </th>
            <th rowSpan={rowSpan} scope="col" className={techTableHeadCellClass}>
              Creepage distance (mm)
            </th>
            {fullElectrical ? (
              <>
                <th
                  colSpan={2}
                  scope="colgroup"
                  className={techTableHeadCellClass}
                >
                  Lightning impulse flashover voltage (kV)
                </th>
                <th
                  colSpan={2}
                  scope="colgroup"
                  className={techTableHeadCellClass}
                >
                  Power frequency flashover voltage (kV)
                </th>
              </>
            ) : (
              <>
                {hasSwitching ? (
                  <th scope="col" className={techTableHeadCellClass}>
                    Switching Impulse withstand Voltage (kV)
                  </th>
                ) : null}
                <th scope="col" className={techTableHeadCellClass}>
                  Lightning impulse flashover voltage (kV)
                </th>
                <th scope="col" className={techTableHeadCellClass}>
                  Wet Power frequency flashover voltage (kV)
                </th>
              </>
            )}
            <th rowSpan={rowSpan} scope="col" className={techTableHeadCellClass}>
              Weight
            </th>
          </tr>
          {fullElectrical ? (
            <tr>
              <th scope="col" className={techTableHeadCellClass}>
                Positive
              </th>
              <th scope="col" className={techTableHeadCellClass}>
                Negative
              </th>
              <th scope="col" className={techTableHeadCellClass}>
                Dry
              </th>
              <th scope="col" className={techTableHeadCellClass}>
                Wet
              </th>
            </tr>
          ) : null}
        </thead>

        <tbody>
          {rows.map((row, idx) => {
            const isLast = idx === rows.length - 1;
            return (
              <tr
                key={`${row.code || "empty"}-${idx}`}
                className="bg-background"
              >
                <td
                  className={cn(
                    techTableBodyStickyClass,
                    !isLast && "border-b border-border/70",
                  )}
                >
                  {row.code || (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </td>
                {bodyColumns.map((key, i) => {
                  const value = row.technical?.[key];
                  return (
                    <td
                      key={key}
                      className={cn(
                        techTableBodyCellClass,
                        i !== bodyColumns.length - 1 &&
                          "border-e border-border/70",
                        !isLast && "border-b border-border/70",
                      )}
                    >
                      {value && value.trim().length > 0 ? (
                        value
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollPan>
  );
}

function DatasheetView({
  product,
  onBack,
}: {
  product: ProductSpec;
  onBack: () => void;
}) {
  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;
  /** When false, all drawings stay as labelled placeholders. */
  const SHOW_PRODUCT_DRAWINGS = true;
  const drawingSrc = SHOW_PRODUCT_DRAWINGS
    ? product.drawing?.trim() || null
    : null;

  return (
    <div>
      <BackBar onBack={onBack} label="Table & drawing" />
      <div className="space-y-10 p-5 md:p-7">
        {/* Drawing — top (placeholder until assets are ready) */}
        <section aria-labelledby="product-drawing-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
            <div>
              <p
                id="product-drawing-heading"
                className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
              >
                Product drawing
              </p>
              <p className="mt-1 text-sm text-foreground/85">
                Sectional diagram and reference geometry.
              </p>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-background"
            style={
              drawingSrc
                ? undefined
                : {
                    backgroundImage:
                      "repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 40px)",
                  }
            }
          >
            {drawingSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={drawingSrc}
                alt={`${product.name} engineering drawing`}
                className="mx-auto max-h-[min(52vh,420px)] w-full object-contain p-4 md:p-6"
              />
            ) : (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-12 text-center md:min-h-[340px]">
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-muted/50 text-foreground">
                  <LayoutTemplate size={18} aria-hidden />
                </span>
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Drawing coming soon
                </p>
                <p className="max-w-md text-sm text-muted-foreground">
                  The sectional drawing for{" "}
                  <span className="text-foreground">{product.name}</span> will
                  appear here. Request it from our engineering team in the
                  meantime.
                </p>
                <a
                  href={`/contact?ref=${encodeURIComponent(product.id)}`}
                  className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-brand-burgundy"
                >
                  <Mail size={14} aria-hidden />
                  Request drawing
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Table — bottom */}
        <section aria-labelledby="product-table-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
            <div>
              <p
                id="product-table-heading"
                className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
              >
                Technical table
              </p>
              <p className="mt-1 text-sm text-foreground/85">
                {hasVariants ? (
                  <>
                    {variants.length} product reference
                    {variants.length === 1 ? "" : "s"} in datasheet.
                  </>
                ) : (
                  <>No variant rows defined for this product yet.</>
                )}
              </p>
            </div>
            {product.standard && (
              <p className="max-w-[18rem] text-end text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {product.standard}
              </p>
            )}
          </div>

          <TechnicalDataTable product={product} />

          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Drag, swipe, or use the scrollbar to see all columns. All
            dimensions in millimetres (mm) unless stated otherwise; voltages in
            kilovolts (kV); mechanical loads in kilonewtons (kN).
          </p>
        </section>
      </div>
    </div>
  );
}
