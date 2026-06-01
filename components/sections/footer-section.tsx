"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

const policyLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Imprint", href: "/imprint" },
] as const;

function NewsletterSignup() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const formMounted = useRef<number>(0);

  useEffect(() => {
    formMounted.current = Date.now();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sending") return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setErrorText("Invalid email");
      setState("err");
      return;
    }

    const formEl = e.currentTarget;
    const honeypot =
      (formEl.elements.namedItem("_hp") as HTMLInputElement | null)?.value ?? "";

    setState("sending");
    setErrorText(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          _hp: honeypot,
          _t: formMounted.current || Date.now(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
      };
      if (!res.ok || !data.ok) {
        setErrorText(data.error ?? "Try again");
        setState("err");
        return;
      }
      setEmail("");
      setState("ok");
      window.setTimeout(() => setState("idle"), 4000);
    } catch {
      setErrorText("Network error");
      setState("err");
    }
  };

  const isSending = state === "sending";

  return (
    <form onSubmit={onSubmit} className="mt-3 max-w-[220px]" noValidate>
      <div className="flex items-center gap-2 border-b border-border/80 pb-1.5">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          disabled={isSending}
          className="min-w-0 flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          {...(state === "err" ? { "aria-invalid": true } : {})}
        />
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden className="sr-only" />
        <button
          type="submit"
          disabled={isSending}
          className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          {isSending ? "…" : state === "ok" ? "Done" : "Join"}
        </button>
      </div>
      {state === "err" && errorText && (
        <p className="mt-1 text-[10px] text-destructive">{errorText}</p>
      )}
    </form>
  );
}

function OfficeCol({
  label,
  lines,
  phone,
  fax,
  email,
}: {
  label: string;
  lines: readonly string[];
  phone: { display: string; href: string };
  fax: string;
  email?: { display: string; href: string } | null;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <address className="mt-2 space-y-0.5 text-xs not-italic leading-snug text-muted-foreground">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        <a href={phone.href} className="block tabular-nums hover:text-foreground">
          {phone.display}
        </a>
        <span className="block tabular-nums">Fax {fax}</span>
        {email && (
          <a href={email.href} className="block hover:text-foreground">
            {email.display}
          </a>
        )}
      </address>
    </div>
  );
}

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-background" role="contentinfo">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-12 md:py-11 lg:px-20">
        {/* Compact 4-column grid — one band, no stacked sections */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:opacity-80"
            >
              Taban Niroo
            </Link>
            <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
              Composite insulators · IEC-tested · Since 1997
            </p>
            <NewsletterSignup />
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Site
            </p>
            <ul className="mt-2 space-y-1">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <OfficeCol
            label="Shiraz"
            lines={["Taban Niroo Bldg", "Shiraz SEZ, Iran"]}
            phone={{ display: "+98 713 717 5115-7", href: "tel:+987137175115" }}
            fax="+98 21 2629 3990"
          />

          <OfficeCol
            label="Tehran"
            lines={["No 64, Saeedi Ave", "Africa St"]}
            phone={{ display: "+98 21 8821 6952", href: "tel:+982188216952" }}
            fax="+98 21 2629 3990"
            email={{ display: "info@taban-niroo.com", href: "mailto:info@taban-niroo.com" }}
          />
        </div>

        {/* Bottom bar — standards + legal in one tight row */}
        <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-5 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="text-[10px] leading-relaxed text-muted-foreground/80">
            <span className="font-mono tracking-wide">
              IEC 61109 · 62217 · 60137 · 61466 · 60120 · 60471
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
            <span>© {year} Taban Niroo</span>
            {policyLinks.map((p) => (
              <Link key={p.href} href={p.href} className="hover:text-foreground">
                {p.label}
              </Link>
            ))}
            <a
              href="https://www.linkedin.com/company/taban-niroo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              LinkedIn
            </a>
            <a href="mailto:info@taban-niroo.com" className="hover:text-foreground">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
