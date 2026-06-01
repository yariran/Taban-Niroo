import { cn } from "@/lib/utils";

/** Printed datasheet header — dark navy, white type, hairline grid. */
export const techTableClass =
  "tech-table w-full border-separate border-spacing-0 text-sm";

export const techTableHeadCellClass =
  "tech-table__head border border-white/40 bg-[#1a3052] px-2 py-2.5 text-center align-middle text-[11px] font-medium leading-snug text-white";

export const techTableHeadStickyClass = cn(
  techTableHeadCellClass,
  "sticky left-0 z-20 px-4 text-left",
);

export const techTableBodyCellClass =
  "whitespace-nowrap border-white/10 px-2 py-2.5 text-center text-foreground/85 dark:border-white/[0.08]";

export const techTableBodyStickyClass = cn(
  techTableBodyCellClass,
  "sticky left-0 z-10 bg-background px-4 text-left font-mono text-[12px] text-foreground",
);
