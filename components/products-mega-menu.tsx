"use client";

import {
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FAMILY_ANCHOR,
  FAMILY_INDEX,
  FAMILY_ORDER,
  FAMILY_THUMBNAIL,
  PRODUCTS,
  type ProductFamilyId,
} from "@/lib/products";

/**
 * Products mega-menu trigger + panel.
 *
 * Drops in beside the other nav items in the header. The trigger
 * looks like a normal nav link (so it inherits the existing
 * `onDarkHero` colour transitions). On hover or keyboard focus a
 * panel opens beneath the header showing the six product families
 * with thumbnails, counts and the top three references inside each.
 *
 * Behaviour:
 *  • Hover-open with a small close-delay so cursor jitter into the
 *    panel doesn't immediately dismiss it.
 *  • Keyboard: Enter / Space / ArrowDown opens, Escape closes,
 *    focus is restored to the trigger.
 *  • Click outside or scroll to dismiss.
 *  • Mobile (<md) collapses to a plain link — handled by the parent
 *    Header component, so this file only renders the desktop trigger.
 */
type Props = {
  isActive: boolean;
  onDarkHero: boolean;
};

export function ProductsMegaMenu({ isActive, onDarkHero }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  /** Cancel any pending close when the cursor returns. */
  const cancelClose = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = (delay = 160) => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), delay);
  };

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      // Focus the first link after the panel mounts.
      requestAnimationFrame(() => {
        panelRef.current
          ?.querySelector<HTMLAnchorElement>("[data-mm-firstlink]")
          ?.focus();
      });
    }
  };

  const grouped: Record<ProductFamilyId, string[]> = {} as Record<
    ProductFamilyId,
    string[]
  >;
  for (const f of FAMILY_ORDER) grouped[f] = [];
  for (const p of PRODUCTS) grouped[p.family].push(p.name);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={() => scheduleClose()}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKey}
        className={cn(
          "flex items-center gap-1.5 border-b border-transparent pb-0.5 text-sm font-medium",
          "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          onDarkHero
            ? isActive
              ? "border-white text-white"
              : "hover:text-white"
            : isActive
              ? "border-foreground text-foreground"
              : "hover:text-foreground"
        )}
      >
        Products
        <ChevronDown
          size={13}
          aria-hidden
          strokeWidth={1.8}
          className={cn(
            "transition-transform duration-300",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <div
        ref={panelRef}
        role="menu"
        aria-label="Product range"
        onMouseEnter={cancelClose}
        onMouseLeave={() => scheduleClose()}
        className={cn(
          "fixed left-1/2 top-[68px] z-[55] w-[min(1080px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl border border-border/70 bg-background/95 shadow-elevate backdrop-blur-xl",
          "supports-[backdrop-filter]:bg-background/85",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "dark:border-white/[0.08]",
          open
            ? "pointer-events-auto -translate-x-1/2 translate-y-0 opacity-100"
            : "pointer-events-none -translate-x-1/2 -translate-y-2 opacity-0"
        )}
      >
        <div className="p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Product range
            </p>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-foreground/70"
            >
              See all
              <ArrowRight size={12} aria-hidden />
            </Link>
          </div>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FAMILY_ORDER.map((family, idx) => {
              const count = grouped[family].length;
              return (
                <li key={family} role="none">
                  <Link
                    role="menuitem"
                    data-mm-firstlink={idx === 0 ? "true" : undefined}
                    href={`/products#${FAMILY_ANCHOR[family]}`}
                    onClick={() => setOpen(false)}
                    className="group flex h-full gap-3 rounded-xl border border-border/40 bg-card/70 p-3 transition-colors hover:border-foreground hover:bg-card dark:border-white/[0.06] dark:bg-card/60"
                  >
                    <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-md bg-muted dark:bg-white/[0.03]">
                      <Image
                        src={FAMILY_THUMBNAIL[family]}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.06] group-hover:grayscale-0"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {FAMILY_INDEX[family]} · {count} ref.
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-snug tracking-tight text-foreground">
                        {family}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted-foreground">
                        {grouped[family].slice(0, 2).join(" · ")}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[10.5px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors group-hover:text-foreground">
                        Browse family
                        <ArrowRight
                          size={10}
                          aria-hidden
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
