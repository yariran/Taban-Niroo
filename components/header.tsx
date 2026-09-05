"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProductsMegaMenu } from "@/components/products-mega-menu";
import { cn } from "@/lib/utils";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";
import { trapFocusKeydown } from "@/lib/focus-trap";

const NAV_ITEMS = [
  ["Company", "/about", false] as const,
  ["Products", "/products", true] as const,
  ["Projects & Partners", "/projects", false] as const,
  ["Blog – R&D", "/blog", false] as const,
] as const;

const navLinkClass = (onDarkHero: boolean, isActive: boolean) =>
  cn(
    "relative inline-flex items-center whitespace-nowrap text-[12px] font-medium leading-none tracking-[-0.01em]",
    "transition-colors duration-300",
    onDarkHero
      ? isActive
        ? "text-white"
        : "text-white/75 hover:text-white"
      : isActive
        ? "text-brand-navy"
        : "text-foreground/70 hover:text-brand-burgundy",
  );

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const navItems = NAV_ITEMS;
  /** Home hero is dark: white text. All other routes (or scrolled home) use dark text. */
  const onDarkHero = isHome && !isScrolled;

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
    requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    lockBodyScroll();

    const id = requestAnimationFrame(() => {
      firstMobileLinkRef.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileMenu();
        return;
      }
      trapFocusKeydown(e, mobileNavRef.current);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      unlockBodyScroll();
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen, closeMobileMenu]);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center",
        "pt-[max(1rem,calc(0.75rem+var(--sat)))] px-4 sm:px-6 lg:px-8",
        "transition-[padding] duration-500 ease-[var(--ease-standard)]",
        isScrolled && "pt-[max(0.65rem,calc(0.45rem+var(--sat)))] px-3 sm:px-5",
      )}
    >
      <div
        className={cn(
          "glass-header-pill pointer-events-auto",
          "grid w-full max-w-[64rem] grid-cols-[1fr_auto_1fr] items-center",
          "rounded-full border px-3.5 sm:px-4 lg:px-5",
          "transition-[height,max-width,padding,border-color,box-shadow,background-color,backdrop-filter] duration-500 ease-[var(--ease-standard)]",
          isScrolled
            ? "glass-header-pill--compact h-9 max-w-[52rem] px-3 sm:px-3.5 lg:px-4"
            : "h-10 sm:h-11",
          onDarkHero ? "glass-header-pill--hero" : "glass-header-pill--default",
        )}
      >
        {/* Brand — left */}
        <Link
          href="/"
          className={cn(
            "justify-self-start shrink-0 font-semibold uppercase tracking-[0.2em]",
            "transition-[font-size,color] duration-500",
            isScrolled ? "text-[10px]" : "text-[11px]",
            onDarkHero ? "text-white" : "text-brand-navy",
          )}
        >
          Taban Niroo
        </Link>

        {/* Nav — centered */}
        <nav
          aria-label="Primary"
          className={cn(
            "hidden items-center justify-center md:flex",
            "transition-[gap] duration-500",
            isScrolled ? "gap-4 lg:gap-5" : "gap-5 lg:gap-7",
          )}
        >
          {navItems.map(([label, href, hasMega]) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            if (hasMega) {
              return (
                <ProductsMegaMenu
                  key={href}
                  isActive={isActive}
                  onDarkHero={onDarkHero}
                />
              );
            }

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={navLinkClass(onDarkHero, isActive)}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Actions — right (desktop) */}
        <div className="hidden items-center justify-end gap-1.5 md:flex">
          <ThemeToggle
            variant="ghost"
            compact
            className={cn(
              "rounded-full transition-[width,height] duration-500",
              isScrolled ? "size-7" : "size-8",
              onDarkHero
                ? "text-white hover:bg-white/15"
                : "text-foreground hover:bg-foreground/10",
            )}
          />
          <Link
            href="/contact"
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full font-medium leading-none",
              "transition-[height,padding,font-size,colors,box-shadow] duration-500",
              isScrolled
                ? "h-7 px-2.5 text-[11px]"
                : "pill-elevate h-7 px-3 text-[12px] sm:h-8 sm:px-3.5",
              /* `--brand-navy-deep`, not `--brand-navy`. The pill fill here
                 is a literal `bg-white` that does NOT invert, while
                 `--brand-navy` is the heading colour and DOES — it resolves
                 to #D7DADE in dark, which measured 1.4:1 on this pill and
                 made the site's primary CTA unreadable over the hero.
                 `--brand-navy-deep` is the fixed graphite (#0A0B0D in both
                 themes), so it stays pinned to the fill: 19.7:1 on white,
                 17.7:1 on the `brand-cream` hover. Same reasoning as the
                 `default` button variant — see components/ui/button.tsx. */
              onDarkHero
                ? "bg-white text-brand-navy-deep hover:bg-brand-cream"
                : "bg-primary text-primary-foreground hover:bg-brand-burgundy",
            )}
          >
            Contact
            <ArrowRight
              size={isScrolled ? 11 : 12}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Phone: theme + hamburger on the right */}
        <div className="col-start-3 flex items-center justify-end gap-1 md:hidden">
          <ThemeToggle
            variant="ghost"
            compact
            className={cn(
              "touch-target size-10 rounded-full",
              onDarkHero
                ? "text-white hover:bg-white/15"
                : "text-foreground hover:bg-foreground/10",
            )}
          />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "touch-target inline-flex size-10 items-center justify-center rounded-full transition-colors",
              onDarkHero
                ? "text-white hover:bg-white/15"
                : "text-foreground hover:bg-foreground/10",
            )}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-primary-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X size={18} aria-hidden />
            ) : (
              <Menu size={18} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {isMounted &&
        isMenuOpen &&
        createPortal(
          <>
            <button
              type="button"
              className="glass-mobile-scrim pointer-events-auto fixed inset-0 z-[48] md:hidden"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
            <div
              ref={mobileNavRef}
              id="mobile-primary-nav"
              className={cn(
                "glass-mobile-menu pointer-events-auto fixed inset-x-0 bottom-0 z-[49] md:hidden",
                "top-[calc(4.5rem+var(--sat))]",
                "flex flex-col overflow-y-auto overscroll-contain rounded-t-[1.35rem] border-t px-4 pt-2",
                "pb-[max(1rem,var(--sab))]",
                "[-webkit-overflow-scrolling:touch]",
                "pl-[max(1rem,var(--sal))] pr-[max(1rem,var(--sar))]",
                /* No `bg-zinc-950` here: `.glass-mobile-menu--hero` already
                   sets the ground, and the two are a same-specificity
                   conflict decided by emitted order — with zinc-950
                   (#09090B) being an off-palette near-miss of the scene
                   ground it was competing with. The utility class owns it. */
                onDarkHero
                  ? "glass-mobile-menu--hero border-white/10 text-white"
                  : "glass-mobile-menu--default border-border bg-background text-foreground",
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              data-lenis-prevent
            >
              <nav
                className={cn(
                  "flex flex-col divide-y",
                  onDarkHero ? "divide-white/10" : "divide-border/50",
                )}
                aria-label="Mobile primary"
              >
                {navItems.map(([label, href], index) => {
                  const isActive =
                    pathname === href || pathname.startsWith(`${href}/`);

                  return (
                    <Link
                      key={href}
                      ref={index === 0 ? firstMobileLinkRef : undefined}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "touch-target flex min-h-12 items-center justify-between py-3 text-[15px] font-medium tracking-tight transition-colors",
                        onDarkHero
                          ? isActive
                            ? "text-white"
                            : "text-white/72 active:text-white"
                          : isActive
                            ? "text-brand-navy"
                            : "text-foreground/70 active:text-brand-burgundy",
                      )}
                      onClick={closeMobileMenu}
                    >
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div
                className={cn(
                  "mt-3 border-t pt-3",
                  onDarkHero ? "border-white/10" : "border-border/50",
                )}
              >
                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className={cn(
                    "touch-target flex min-h-11 items-center justify-center gap-2 rounded-full text-[11px] font-medium uppercase tracking-[0.2em] transition-colors",
                    onDarkHero
                      ? "border border-white/20 bg-white/10 text-white hover:bg-white/16"
                      : "bg-primary text-primary-foreground hover:bg-brand-burgundy",
                  )}
                >
                  Contact
                  <ArrowRight size={12} aria-hidden />
                </Link>
              </div>
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
