"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProductsMegaMenu } from "@/components/products-mega-menu";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  ["About Us", "/about", false] as const,
  ["Products", "/products", true] as const,
  ["Projects & Partners", "/projects", false] as const,
  ["Blog – R&D", "/blog", false] as const,
] as const;

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

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

    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    const id = requestAnimationFrame(() => {
      firstMobileLinkRef.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen, closeMobileMenu]);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center",
        "transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isScrolled ? "px-3 pt-2 md:px-6 md:pt-3" : "px-4 pt-4 md:px-8 md:pt-6",
      )}
    >
      <div
        className={cn(
          "glass-header-pill pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-3 rounded-full border px-3 py-1.5 sm:gap-4 sm:px-4 md:px-5 md:py-2",
          "transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          onDarkHero ? "glass-header-pill--hero" : "glass-header-pill--default",
        )}
      >
        <Link
          href="/"
          className={cn(
            "hidden text-[11px] font-semibold uppercase tracking-[0.22em] md:inline-flex",
            "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            onDarkHero ? "text-white" : "text-foreground",
          )}
        >
          Taban Niroo
        </Link>

        <nav
          aria-label="Primary"
          className={cn(
            "hidden md:flex md:items-center md:gap-5",
            "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            onDarkHero ? "text-white/80" : "text-foreground/75",
          )}
        >
          {NAV_ITEMS.map(([label, href, hasMega]) => {
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
                className={[
                  "relative text-[13px] font-medium",
                  "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  onDarkHero
                    ? isActive
                      ? "text-white after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-white"
                      : "hover:text-white"
                    : isActive
                      ? "text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-foreground"
                      : "hover:text-foreground",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "hidden items-center gap-2 md:flex",
            "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            onDarkHero ? "text-white" : "text-foreground",
          )}
        >
          <ThemeToggle
            variant="ghost"
            compact
            className={cn(
              "size-7 rounded-full",
              onDarkHero
                ? "text-white hover:bg-white/15"
                : "text-foreground hover:bg-foreground/10",
            )}
          />
          <Link
            href="/contact"
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium",
              "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              onDarkHero
                ? "bg-white text-zinc-900 hover:bg-white/90"
                : "bg-foreground text-background hover:bg-foreground/90",
            )}
          >
            Contact
            <ArrowRight size={12} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile contents (same pill, just different children) */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link
            href="/"
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.2em]",
              onDarkHero ? "text-white" : "text-foreground",
            )}
          >
            Taban Niroo
          </Link>

          <div className="flex items-center gap-1.5">
            <ThemeToggle
              variant="ghost"
              compact
              className={cn(
                "touch-target size-11 rounded-full md:size-7",
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
                "touch-target inline-flex size-11 items-center justify-center rounded-full transition-colors md:size-7",
                onDarkHero
                  ? "text-white hover:bg-white/15"
                  : "text-foreground hover:bg-foreground/10",
              )}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-primary-nav"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
            </button>
          </div>
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
              id="mobile-primary-nav"
              className={cn(
                "glass-mobile-menu pointer-events-auto fixed inset-x-0 bottom-0 z-[49] md:hidden",
                "top-[calc(3.75rem+env(safe-area-inset-top,0px))]",
                "flex flex-col overflow-y-auto overscroll-contain rounded-t-[1.35rem] border-t px-4 pt-2",
                "pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
                "[-webkit-overflow-scrolling:touch]",
                onDarkHero
                  ? "glass-mobile-menu--hero border-white/10 bg-zinc-950 text-white"
                  : "glass-mobile-menu--default border-border bg-background text-foreground",
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              data-lenis-prevent
            >
              <nav
                className={cn(
                  "flex flex-col",
                  onDarkHero ? "divide-white/10" : "divide-border/50",
                  "divide-y",
                )}
                aria-label="Mobile primary"
              >
                {NAV_ITEMS.map(([label, href], index) => {
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
                            ? "text-foreground"
                            : "text-foreground/70 active:text-foreground",
                      )}
                      onClick={closeMobileMenu}
                    >
                      <span>{label}</span>
                      {isActive && (
                        <span
                          className={cn(
                            "font-mono text-[10px] uppercase tracking-[0.2em]",
                            onDarkHero ? "text-white/55" : "text-muted-foreground",
                          )}
                          aria-hidden
                        >
                          Now
                        </span>
                      )}
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
                      : "border border-foreground/15 bg-foreground text-background hover:bg-foreground/90",
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
