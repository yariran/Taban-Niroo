"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Printer,
  Send,
} from "lucide-react";

const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Projects & Partners", href: "/projects" },
  { label: "Blog – R&D", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

const policyLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Imprint", href: "/imprint" },
] as const;

const STANDARDS_BADGES = [
  { code: "IEC 61109", title: "Composite suspension" },
  { code: "IEC 62217", title: "Polymeric HV insulators" },
  { code: "IEC 60137", title: "AC > 1000 V bushings" },
  { code: "IEC 60099-4", title: "Surge arresters" },
  { code: "IEC 61466", title: "String insulator units" },
  { code: "IEC 60120 / 60471", title: "Couplings" },
];

const SOCIAL_LINKS = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/taban-niroo",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:info@taban-niroo.com",
  },
] as const;

const OFFICES = [
  {
    id: "hq",
    label: "Headquarters",
    lines: ["Taban Niroo Bldg", "Shiraz Special Economic Zone, Iran"],
    phone: { display: "+98 713 717 5115-7", href: "tel:+987137175115" },
    fax: "+98 21 2629 3990",
    email: null,
  },
  {
    id: "tehran",
    label: "Tehran office",
    lines: ["Office 9, No 64, Saeedi Ave", "Africa St, Tehran"],
    phone: { display: "+98 21 8821 6952", href: "tel:+982188216952" },
    fax: "+98 21 2629 3990",
    email: { display: "info@taban-niroo.com", href: "mailto:info@taban-niroo.com" },
  },
] as const;

/**
 * Lightweight client-side newsletter form.
 *
 * No backend wiring is shipped on purpose — the brochure site does not
 * need a list yet. The optimistic UX (validate, "thanks", reset) lets
 * the marketing team plug a real provider in later by swapping the
 * handler to a `fetch("/api/newsletter")` call.
 */
function NewsletterSignup() {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState("err");
      return;
    }
    // Optimistic UI — backend integration is intentionally future work.
    setState("ok");
    setEmail("");
    window.setTimeout(() => setState("idle"), 4500);
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 max-w-sm" noValidate>
      <label
        htmlFor="newsletter-email"
        className="text-[11px] uppercase tracking-[0.2em] text-foreground/80"
      >
        Quarterly engineering brief
      </label>
      <div className="mt-2 flex items-center overflow-hidden rounded-full border border-border bg-background/60 transition-colors focus-within:border-foreground">
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          className="flex-1 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          aria-invalid={state === "err"}
        />
        <button
          type="submit"
          aria-label="Subscribe to the engineering brief"
          className="inline-flex h-10 items-center gap-1.5 border-l border-border px-4 text-[11px] font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <Send size={13} aria-hidden strokeWidth={1.7} />
          Subscribe
        </button>
      </div>
      <p
        className="mt-2 min-h-[1.1rem] text-[11px] leading-relaxed text-muted-foreground"
        aria-live="polite"
      >
        {state === "ok" &&
          "Thanks — we'll add you to the next quarterly brief."}
        {state === "err" && (
          <span className="text-destructive">
            Please enter a valid e-mail address.
          </span>
        )}
        {state === "idle" &&
          "Quarterly. Engineering, no marketing. One-click unsubscribe."}
      </p>
    </form>
  );
}

export function FooterSection() {
  return (
    <footer className="bg-background" role="contentinfo">
      {/* Certifications strip */}
      <div className="border-t border-border/70 bg-muted/15 dark:border-white/[0.06] dark:bg-white/[0.025]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-12 md:py-7 lg:px-20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/80">
            Type-tested in accredited laboratories
          </p>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {STANDARDS_BADGES.map((s) => (
              <li
                key={s.code}
                className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/80 dark:border-white/[0.08]"
                title={s.title}
              >
                {s.code}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/80 px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          {/* Brand + newsletter */}
          <div>
            <Link href="/" className="text-lg font-medium text-foreground">
              Taban Niroo
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              High-voltage composite insulators. Power transmission. IEC.
              Shiraz, Iran. Since 1998.
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">
              Dena Power Line Insulators · DPL
            </p>

            <NewsletterSignup />

            <ul className="mt-8 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <Icon size={15} strokeWidth={1.75} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu */}
          <nav aria-labelledby="footer-nav-heading">
            <h2
              id="footer-nav-heading"
              className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80"
            >
              Menu
            </h2>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      aria-hidden
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Offices */}
          {OFFICES.map((office) => (
            <div key={office.id}>
              <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80">
                {office.label}
              </h2>
              <address className="space-y-3 text-sm not-italic leading-relaxed text-muted-foreground">
                <p className="flex items-start gap-2">
                  <MapPin
                    size={14}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-foreground/60"
                    strokeWidth={1.75}
                  />
                  <span>
                    {office.lines.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone
                    size={14}
                    aria-hidden
                    className="shrink-0 text-foreground/60"
                    strokeWidth={1.75}
                  />
                  <a
                    href={office.phone.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {office.phone.display}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Printer
                    size={14}
                    aria-hidden
                    className="shrink-0 text-foreground/60"
                    strokeWidth={1.75}
                  />
                  <span>Fax {office.fax}</span>
                </p>
                {office.email && (
                  <p className="flex items-center gap-2">
                    <Mail
                      size={14}
                      aria-hidden
                      className="shrink-0 text-foreground/60"
                      strokeWidth={1.75}
                    />
                    <a
                      href={office.email.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {office.email.display}
                    </a>
                  </p>
                )}
              </address>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/80 px-6 py-6 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Taban Niroo. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {policyLinks.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="transition-colors hover:text-foreground"
              >
                {p.label}
              </Link>
            ))}
            <span aria-hidden className="hidden md:inline text-foreground/30">·</span>
            <a
              href="https://www.taban-niroo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              taban-niroo.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
