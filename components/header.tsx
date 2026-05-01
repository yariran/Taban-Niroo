"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => {
      firstMobileLinkRef.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen, closeMobileMenu]);

  const showHeaderSurface = !isHome || isScrolled;

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center",
        "border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        showHeaderSurface
          ? "border-border/45 shadow-[0_14px_40px_-18px_rgba(0,0,0,0.12)] supports-[backdrop-filter]:bg-background/72 supports-[backdrop-filter]:backdrop-blur-xl dark:border-white/[0.08] dark:shadow-[0_18px_48px_-16px_rgba(0,0,0,0.55)] dark:supports-[backdrop-filter]:bg-background/55"
          : "border-transparent bg-transparent shadow-none backdrop-blur-0",
      )}
    >
      <div className="pointer-events-none flex w-full max-w-6xl items-center justify-between gap-4 px-5 pt-4 sm:px-6 md:px-8 lg:px-10">
        <Link
          href="/"
          className={[
            "pointer-events-auto hidden text-sm font-semibold uppercase tracking-[0.2em] md:inline-flex",
            "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            onDarkHero ? "text-white" : "text-foreground",
          ].join(" ")}
        >
          Taban Niroo
        </Link>

        <nav
          aria-label="Primary"
          className={[
            "pointer-events-auto hidden md:flex md:items-center md:gap-7",
            "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            onDarkHero ? "text-white/78" : "text-foreground/75",
          ].join(" ")}
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
                  "border-b border-transparent pb-0.5 text-sm font-medium",
                  "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  onDarkHero
                    ? isActive
                      ? "border-white text-white"
                      : "hover:text-white"
                    : isActive
                      ? "border-foreground text-foreground"
                      : "hover:text-foreground",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div
          className={[
            "pointer-events-auto hidden items-center gap-3 md:flex",
            "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            onDarkHero ? "text-white" : "text-foreground",
          ].join(" ")}
        >
          <ThemeToggle
            variant={onDarkHero ? "ghost" : "outline"}
            compact
            className={
              onDarkHero
                ? "border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                : "border-black/15 bg-white/70 backdrop-blur-sm"
            }
          />
          <Link
            href="/contact"
            className={[
              "group flex items-center gap-2 text-sm font-medium",
              "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              onDarkHero ? "text-white/90 hover:text-white" : "text-foreground/85 hover:text-foreground",
            ].join(" ")}
          >
            <span
              className={[
                "inline-flex size-7 items-center justify-center rounded-full",
                "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                onDarkHero ? "bg-white text-zinc-900" : "bg-foreground text-background",
              ].join(" ")}
            >
              <ArrowRight size={14} aria-hidden />
            </span>
            Contact
          </Link>
        </div>

        <div
          className={[
            "pointer-events-auto flex w-full items-center justify-between rounded-full border px-4 py-2 md:hidden",
            "transition-[background-color,border-color,color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            onDarkHero
              ? "border-white/30 bg-white/20 text-white backdrop-blur-md"
              : "border-black/10 bg-white/90 text-foreground shadow-md backdrop-blur-xl",
          ].join(" ")}
        >
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-inherit"
          >
            Taban Niroo
          </Link>

          <ThemeToggle
            variant={onDarkHero ? "ghost" : "outline"}
            compact
            className={
              onDarkHero
                ? "border border-white/30 text-white hover:bg-white/15 hover:text-white"
                : ""
            }
          />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={[
              "rounded-full p-2 transition-colors",
              onDarkHero ? "text-white" : "text-foreground",
            ].join(" ")}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-primary-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X size={22} aria-hidden />
            ) : (
              <Menu size={22} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className="pointer-events-auto fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] md:hidden"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          />
          <div
            id="mobile-primary-nav"
            className="pointer-events-auto fixed inset-x-4 top-[4.5rem] z-40 max-h-[min(70vh,calc(100dvh-6rem))] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background/95 px-6 py-8 shadow-lg backdrop-blur-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-lenis-prevent
          >
            <nav className="flex flex-col gap-6" aria-label="Mobile primary">
              {NAV_ITEMS.map(([label, href], index) => (
                <Link
                  key={href}
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  href={href}
                  className={[
                    "rounded-xl px-3 py-2 text-lg transition-colors",
                    pathname === href || pathname.startsWith(`${href}/`)
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-muted",
                  ].join(" ")}
                  onClick={closeMobileMenu}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
