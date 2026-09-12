"use client";

import { useEffect, useState } from "react";

const LINKS = ["Products", "Technology", "Projects", "Company", "Contact"];

/**
 * Floating pill navigation.
 *
 * Terminal's header is a single rounded, glassy bar that hovers over the
 * scene rather than sitting on a full-width band. Two details do the work
 * and are easy to lose in a rebuild:
 *
 *   • the nav links stay sentence-case sans while the BUTTONS are mono
 *     uppercase — the contrast is what makes the CTAs read as controls;
 *   • the button labels wrap to two short lines instead of running wide,
 *     which is why the bar stays compact at 5 links + 3 actions.
 */
export function PillNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-5">
      <nav
        aria-label="Style preview"
        className={`pointer-events-auto flex w-full max-w-5xl items-center gap-1 rounded-2xl border px-2.5 py-2 backdrop-blur-xl transition-colors duration-300 md:gap-2 md:px-3 ${
          solid
            ? "border-white/12 bg-black/85"
            : "border-white/10 bg-black/55"
        }`}
      >
        {/* Wordmark — the mark is a solid tile, the name is tight sans. */}
        <a
          href="#top"
          className="me-1 flex shrink-0 items-center gap-2 rounded-lg px-1 py-1"
        >
          <span
            aria-hidden
            className="tp-mono grid h-6 w-6 place-items-center rounded bg-[var(--tp-gold)] text-[11px] text-[#1a1206]"
            style={{ letterSpacing: 0 }}
          >
            T
          </span>
          <span className="tp-display text-[15px] tracking-[-0.03em] text-[var(--tp-paper)]">
            Taban Niroo
          </span>
        </a>

        <ul className="ms-1 hidden items-center gap-0.5 lg:flex">
          {LINKS.map((label) => (
            <li key={label}>
              <a
                href="#top"
                className="tp-body flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] text-white/85 transition-colors hover:bg-white/8 hover:text-white"
              >
                {label}
                <svg
                  aria-hidden
                  viewBox="0 0 10 6"
                  className="h-[6px] w-[10px] opacity-60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <div className="ms-auto flex items-center gap-1.5 md:gap-2">
          <a
            href="tel:+987137175115"
            aria-label="Call sales"
            className="tp-btn tp-btn-ghost grid h-[38px] w-[38px] shrink-0 place-items-center px-0"
          >
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <path d="M5.2 2.5 6.6 5 5.3 6.4a8 8 0 0 0 4.3 4.3L11 9.4l2.5 1.4v2.1c0 .6-.5 1.1-1.1 1A11.4 11.4 0 0 1 2.1 3.6c0-.6.4-1.1 1-1.1h2.1Z" />
            </svg>
          </a>

          <a href="#selector" className="tp-btn tp-btn-gold tp-mono text-center">
            <span className="block leading-[1.25]">
              Explore
              <br />
              range
            </span>
          </a>

          <a
            href="#contact"
            className="tp-btn tp-btn-ghost tp-mono hidden text-center sm:inline-flex"
          >
            <span className="block leading-[1.25]">
              Request
              <br />
              quote
            </span>
          </a>

          <a
            href="#contact"
            className="tp-btn tp-btn-light tp-mono hidden text-center md:inline-flex"
          >
            <span className="block leading-[1.25]">
              Contact
              <br />
              us
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
}
