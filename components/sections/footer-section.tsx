"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "Blog – R&D", href: "/blog" },
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
          className="min-h-11 min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none md:min-h-0 md:text-xs"
          {...(state === "err" ? { "aria-invalid": true } : {})}
        />
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden className="sr-only" />
        <button
          type="submit"
          disabled={isSending}
          className="min-h-11 shrink-0 px-1 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50 md:min-h-0 md:text-[10px]"
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
  email?:
    | { display: string; href: string }
    | readonly { display: string; href: string }[]
    | null;
}) {
  const emails = email
    ? Array.isArray(email)
      ? email
      : [email]
    : [];

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-orange/90">
        {label}
      </p>
      <address className="mt-2 space-y-0.5 text-xs not-italic leading-snug text-white/65">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        <a href={phone.href} className="block tabular-nums text-white/80 transition-colors hover:text-brand-orange">
          Landline: {phone.display}
        </a>
        <span className="block tabular-nums">Fax: {fax}</span>
        {emails.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block text-white/80 transition-colors hover:text-brand-orange"
          >
            {item.display}
          </a>
        ))}
      </address>
    </div>
  );
}

export function FooterSection({
  cms,
}: { cms?: ContentBlock } = {}) {
  const year = new Date().getFullYear();
  const brandBlurb = cmsText(
    cms,
    "body",
    "Composite insulators · IEC-tested · Since 1997",
  );
  const brandName = cmsText(cms, "title", "Taban Niroo");
  const links = footerLinks;
  return (
    <footer className="border-t border-white/10 bg-brand-navy-deep text-white" role="contentinfo">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-12 md:py-11 lg:px-20">
        {/* Compact 4-column grid — one band, no stacked sections */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="text-sm font-medium text-white hover:text-brand-orange"
            >
              {brandName}
            </Link>
            <p className="mt-1.5 text-xs leading-snug text-white/60">
              {brandBlurb}
            </p>
            {/* Shown only when Resend Audience is configured in production.
                Set NEXT_PUBLIC_NEWSLETTER_ENABLED=true after RESEND_AUDIENCE_ID. */}
            {process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === "true" ? (
              <NewsletterSignup />
            ) : null}
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-orange/90">
              Site
            </p>
            <ul className="mt-2 space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/65 transition-colors hover:text-brand-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <OfficeCol
            label="Shiraz"
            lines={["Taban Niroo Bldg", "Shiraz Special Economic Zone, Iran"]}
            phone={{ display: "+98 713 717 5115-7", href: "tel:+987137175115" }}
            fax="+98 21 2264 4237"
            email={{ display: "info@taban-niroo.com", href: "mailto:info@taban-niroo.com" }}
          />

          <OfficeCol
            label="Tehran"
            lines={["Office 9, No. 64, Saeedi Ave", "Africa Blvd, Tehran"]}
            phone={{ display: "+98 21 8821 6952", href: "tel:+982188216952" }}
            fax="+98 21 2264 4237"
            email={[
              { display: "info@taban-niroo.com", href: "mailto:info@taban-niroo.com" },
              { display: "sales@taban-niroo.com", href: "mailto:sales@taban-niroo.com" },
            ]}
          />
        </div>

        {/* Bottom bar — standards + legal in one tight row */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="text-[10px] leading-relaxed text-white/45">
            <span className="font-mono tracking-wide">
              IEC 61109 · 62217 · 60137 · 61466 · 60120 · 60471
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-white/55">
            <span>© {year} Taban Niroo</span>
            {policyLinks.map((p) => (
              <Link key={p.href} href={p.href} className="hover:text-brand-orange">
                {p.label}
              </Link>
            ))}
            <a
              href="https://www.linkedin.com/company/taban-niroo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-orange"
            >
              LinkedIn
            </a>
            <a href="mailto:info@taban-niroo.com" className="hover:text-brand-orange">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
