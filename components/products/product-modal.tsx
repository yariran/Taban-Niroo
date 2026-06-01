"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Download, Mail, Table2, Ruler, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
 *   impulseWithstand → "Full-Wave Impulse Withstand Voltage (Peak)" (kV)
 *   wetWithstand     → "1 Min Wet Power Frequency Withstand Voltage" (kV)
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
  variants?: ProductVariant[];
};

export type ProductModalView = "picker" | "table" | "drawing";

type ProductModalProps = {
  open: boolean;
  product: ProductSpec | null;
  initialView?: ProductModalView;
  onClose: () => void;
};

/**
 * Body column order — matches the two-row datasheet header (printed
 * catalogue layout). Placeholder slots render "—" (e.g. Negative, Dry).
 */
type TechBodyColumn =
  | { key: keyof TechnicalRow }
  | { placeholder: true };

const TECH_BODY_COLUMNS: readonly TechBodyColumn[] = [
  { key: "ratedVoltage" },
  { key: "sml" },
  { key: "couplingSize" },
  { key: "sectionLength" },
  { key: "arcingDistance" },
  { key: "shedDiameter" },
  { key: "minimumCreepage" },
  { key: "impulseWithstand" },
  { placeholder: true },
  { placeholder: true },
  { key: "wetWithstand" },
];

export function ProductModal({
  open,
  product,
  initialView = "picker",
  onClose,
}: ProductModalProps) {
  const [view, setView] = useState<ProductModalView>(initialView);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setView(initialView);
  }, [open, product?.id, initialView]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const frame = requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
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
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:px-6 md:py-10"
      onMouseDown={handleBackdrop}
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in"
        aria-hidden
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elevate outline-none animate-scale-in"
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
          className="scroll-pan-bar flex-1 overflow-y-auto overscroll-contain"
          data-lenis-prevent
        >
          {view === "picker" && (
            <PickerView
              onPickTable={() => setView("table")}
              onPickDrawing={() => setView("drawing")}
            />
          )}
          {view === "table" && (
            <TableView product={product} onBack={() => setView("picker")} />
          )}
          {view === "drawing" && (
            <DrawingView product={product} onBack={() => setView("picker")} />
          )}
        </div>

        {/* Footer actions */}
        <footer className="flex flex-col gap-3 border-t border-border/60 bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
          <p className="text-xs text-muted-foreground">
            {product.catalogueRef}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:border-foreground"
            >
              <Mail size={14} aria-hidden />
              Enquire
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground bg-foreground px-4 py-2 text-xs font-medium uppercase tracking-wider text-background transition-colors hover:bg-foreground/90"
            >
              <Download size={14} aria-hidden />
              Datasheet
            </a>
          </div>
        </footer>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

/**
 * The "pick one" moment: only two equal options — technical table vs drawing.
 * No summary text, no specs, no applications copy. Keeping it this focused is
 * what the product owner asked for ("two options appear and that's it").
 */
function PickerView({
  onPickTable,
  onPickDrawing,
}: {
  onPickTable: () => void;
  onPickDrawing: () => void;
}) {
  return (
    <div className="px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Choose a view
        </p>
        <h3 className="font-hero-slogan mt-3 text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl">
          Technical data or engineering drawing?
        </h3>
      </div>

      <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
        <PickerCard
          icon={<Table2 size={26} aria-hidden strokeWidth={1.5} />}
          label="01"
          title="Technical table"
          description="Ratings, dimensions, mechanical and environmental values."
          onClick={onPickTable}
        />
        <PickerCard
          icon={<Ruler size={26} aria-hidden strokeWidth={1.5} />}
          label="02"
          title="Product drawing"
          description="Sectional diagram and reference geometry."
          onClick={onPickDrawing}
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
        "group relative flex h-full flex-col items-start gap-5 overflow-hidden rounded-2xl border border-border/70 bg-background p-6 text-left transition-all duration-300",
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

      <span className="relative flex size-14 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-foreground transition-colors group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
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
 * Renders the full 12-column datasheet grid used across the catalogue.
 * Row count follows the number of variants defined for the product.
 *
 * Layout choices:
 *   • Two-row navy header — matches the printed catalogue grid (rowspan
 *     labels + grouped flashover columns with Positive/Negative and
 *     Dry/Wet sub-headers).
 *   • Sticky first column — the Type / catalogue reference stays on-screen
 *     while the reader pans horizontally on narrow viewports.
 *   • Uniform dash placeholder — every missing cell renders "—" so the
 *     overall rhythm of the grid survives data-less drafts.
 */
function TechnicalDataTable({ product }: { product: ProductSpec }) {
  const rows = buildTechRows(product);

  return (
    <ScrollPan
      ariaLabel={`${product.name} technical data`}
      fadeFrom="from-card"
      className="rounded-2xl border border-border/70"
      passVerticalScroll
    >
      <table className={cn(techTableClass, "min-w-[1050px]")}>
        <thead>
          <tr>
            <th rowSpan={2} scope="col" className={techTableHeadStickyClass}>
              Type
            </th>
            <th rowSpan={2} scope="col" className={techTableHeadCellClass}>
              Rated System Voltage (kV)
            </th>
            <th rowSpan={2} scope="col" className={techTableHeadCellClass}>
              Specified mechanical load (kN)
            </th>
            <th rowSpan={2} scope="col" className={techTableHeadCellClass}>
              Coupling Size
            </th>
            <th rowSpan={2} scope="col" className={techTableHeadCellClass}>
              Section length (mm)
            </th>
            <th rowSpan={2} scope="col" className={techTableHeadCellClass}>
              Arcing distance (mm)
            </th>
            <th rowSpan={2} scope="col" className={techTableHeadCellClass}>
              Diameter of shed (mm)
            </th>
            <th rowSpan={2} scope="col" className={techTableHeadCellClass}>
              Creepage distance (mm)
            </th>
            <th colSpan={2} scope="colgroup" className={techTableHeadCellClass}>
              Lightning impulse flashover voltage (kV)
            </th>
            <th colSpan={2} scope="colgroup" className={techTableHeadCellClass}>
              Power frequency flashover voltage (kV)
            </th>
          </tr>
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
        </thead>

        <tbody>
          {rows.map((row, idx) => {
            const isLast = idx === rows.length - 1;
            return (
              <tr key={`${row.code || "empty"}-${idx}`} className="bg-background">
                <td
                  className={cn(
                    techTableBodyStickyClass,
                    !isLast && "border-b border-border/70",
                  )}
                >
                  {row.code || <span className="text-muted-foreground/50">—</span>}
                </td>
                {TECH_BODY_COLUMNS.map((col, i) => {
                  const value =
                    "key" in col ? row.technical?.[col.key] : undefined;
                  return (
                    <td
                      key={i}
                      className={cn(
                        techTableBodyCellClass,
                        i !== TECH_BODY_COLUMNS.length - 1 &&
                          "border-r border-border/70",
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

function TableView({
  product,
  onBack,
}: {
  product: ProductSpec;
  onBack: () => void;
}) {
  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;

  return (
    <div>
      <BackBar onBack={onBack} label="Technical table" />
      <div className="p-5 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Technical data
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
            <p className="max-w-[18rem] text-right text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {product.standard}
            </p>
          )}
        </div>

        <TechnicalDataTable product={product} />

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Drag, swipe, or use the scrollbar to see all columns. All
          dimensions in millimetres (mm) unless stated otherwise; voltages in
          kilovolts (kV); mechanical loads in kilonewtons (kN). Values are
          typed per product reference and confirmed by the individual test
          report on request.
        </p>
      </div>
    </div>
  );
}

function DrawingView({
  product,
  onBack,
}: {
  product: ProductSpec;
  onBack: () => void;
}) {
  return (
    <div>
      <BackBar onBack={onBack} label="Product drawing" />
      <div className="p-5 md:p-7">
        <div
          className="relative overflow-hidden rounded-2xl border border-border/70 bg-background"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 40px)",
          }}
        >
          <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 px-6 py-12 text-center md:min-h-[420px]">
            <span className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-muted/50 text-foreground">
              <Ruler size={18} aria-hidden />
            </span>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Drawing placeholder
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Insert the sectional drawing and reference dimensions for{" "}
              <span className="text-foreground">{product.name}</span>. Recommended
              format: vector SVG or high-resolution PNG.
            </p>
            <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="rounded-full border border-border bg-background px-2.5 py-1">
                SVG preferred
              </span>
              <span className="rounded-full border border-border bg-background px-2.5 py-1">
                Aspect 4:3
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { k: "Section view", v: "—" },
            { k: "Reference height", v: "—" },
            { k: "Coupling type", v: "—" },
          ].map((i) => (
            <div
              key={i.k}
              className="rounded-xl border border-border/60 bg-muted/20 p-3"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {i.k}
              </p>
              <p className="mt-1 text-sm text-foreground">{i.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
