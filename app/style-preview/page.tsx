import Image from "next/image";
import { PillNav } from "./_components/pill-nav";
import { Reveal } from "./_components/reveal";
import { Odometer } from "./_components/odometer";
import { SpecSelector } from "./_components/spec-selector";
import { ApplicationTabs } from "./_components/application-tabs";
import { InquiryForm } from "./_components/inquiry-form";

/**
 * `/style-preview` — a design sandbox, not a shipping page.
 *
 * Purpose: put REAL Taban Niroo content (the catalogue families, the IEC
 * standards, the KPIs from `lib/home-kpis.ts`, the addresses from the root
 * layout's structured data) inside the Terminal Industries visual language,
 * so the direction can be judged before `globals.css` or any production
 * section is touched.
 *
 * What was borrowed from Terminal, in rough order of how much each
 * contributes to the impression:
 *
 *   1. Two-voice type — display set TIGHT (-0.045em), micro-labels set
 *      WIDE (mono, uppercase, +0.18em). This is most of the effect.
 *   2. Numbered entry paths (01/02/03) that let a visitor self-select.
 *   3. An interactive instrument mid-page — theirs an ROI calculator,
 *      here a creepage estimator.
 *   4. Tabs organised by WHERE the part lives, not by product family.
 *   5. Hard black/paper alternation between chapters, with exactly one
 *      accent colour spent only on CTAs and numeric payoffs.
 *   6. Floating pill navigation over the scene.
 *
 * What was deliberately NOT borrowed: Terminal's acid green (the brief
 * keeps Taban Niroo's gold), and their scroll-pinned 3D render sequences,
 * which are a production budget rather than a design decision.
 *
 * Every factual claim here already exists somewhere in this repo. The one
 * exception is flagged inline at the pull-quote.
 */

const COUNTRIES = [
  "Iran",
  "Iraq",
  "Afghanistan",
  "Türkiye",
  "Ghana",
  "Liberia",
  "Morocco",
  "Somalia",
  "Greece",
  "Peru",
  "Colombia",
];

const PATHS = [
  {
    n: "01",
    kicker: "Distribution",
    title: "I run feeders at 11–36 kV",
    body: "Line post, pin-type, suspension and interphase spacers for the medium-voltage network. Standard sections, short lead time, priced per set.",
    cta: "See the MV range",
  },
  {
    n: "02",
    kicker: "Transmission",
    title: "I build lines at 63–230 kV",
    body: "Composite long rods with 80/120 and 160/210 BS couplings. Type-tested to IEC 61109 and 62217, with the report shipped alongside the sets.",
    cta: "See the HV range",
  },
  {
    n: "03",
    kicker: "EHV and station",
    title: "I specify 400 kV and above",
    body: "400–500 kV long rods, hybrid station posts, and hollow-core bushings to 1000 kV. Engineered against your pollution class and altitude, not a catalogue default.",
    cta: "Talk to engineering",
  },
];

const KPIS = [
  { value: "+80", label: "Projects delivered" },
  { value: "29", label: "Years in service" },
  { value: "10", label: "Countries served" },
  { value: "6–1000", label: "kV rated range" },
];

const STANDARDS = [
  { code: "IEC 61109", what: "Composite suspension and tension insulators" },
  { code: "IEC 62217", what: "Polymeric insulators — general definitions" },
  { code: "IEC 60137", what: "Insulated bushings above 1000 V" },
  { code: "IEC 60099-4", what: "Metal-oxide surge arresters" },
];

export default function StylePreviewPage() {
  return (
    <div id="top" className="bg-[var(--tp-black)]">
      <PillNav />

      {/* ═══ HERO ══════════════════════════════════════════════════════
          Terminal's hero is a held cinematic scene with the sentence laid
          over it — no card, no scrim box, just type on the image with a
          gradient carrying the contrast. */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <Image
          src="/images/hero-main.jpg"
          alt="High-voltage transmission line at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,9,10,0.96)_0%,rgba(8,9,10,0.72)_32%,rgba(8,9,10,0.35)_60%,rgba(8,9,10,0.7)_100%)]"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-32 md:px-8 md:pb-20">
          <Reveal>
            <p className="tp-mono text-[10px] text-[var(--tp-gold)]">
              Shiraz · Iran — composite insulation since 1997
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="tp-display mt-7 max-w-[19ch] text-[clamp(2.6rem,7.6vw,6rem)]">
              We insulate the grid the country cannot afford to lose.
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="tp-body mt-8 max-w-[54ch] text-[clamp(1rem,1.7vw,1.25rem)] text-white/65">
              Silicone-housed composite insulators, hybrid station posts and
              transformer bushings — from the 11 kV feeder to the 1000 kV
              busbar.
            </p>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap gap-2.5">
              <a
                href="#selector"
                className="tp-btn tp-btn-gold tp-mono px-5 py-3.5"
              >
                Size my insulator
              </a>
              <a
                href="#contact"
                className="tp-btn tp-btn-ghost tp-mono px-5 py-3.5"
              >
                Request the catalogue
              </a>
            </div>
          </Reveal>
        </div>

        {/* Spec rail along the bottom edge — the rating-plate idea the
            production hero already uses, restated in Terminal's grammar. */}
        <div className="relative border-t border-[var(--tp-line-dark)] bg-black/45 backdrop-blur-sm">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-5 px-5 py-5 md:grid-cols-4 md:px-8">
            {[
              ["Rated voltage", "6–1000 kV"],
              ["Type-tested", "IEC 61109 · 62217"],
              ["Housing", "HTV silicone rubber"],
              ["Core", "ECR boron-free"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="tp-mono text-[9px] text-white/40">{k}</dt>
                <dd className="tp-num mt-2 text-[12px] text-[var(--tp-paper)]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ TRUST STRIP ═══════════════════════════════════════════════
          Terminal's is a client logo wall. Substituting served countries
          keeps the same beat without inventing customer names. */}
      <section className="border-b border-[var(--tp-line-dark)] py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="tp-body text-center text-[15px] text-white/45">
              Energising networks in ten countries
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12">
              {COUNTRIES.map((c) => (
                <li
                  key={c}
                  className="tp-mono text-[11px] text-white/30 transition-colors hover:text-white/70"
                >
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ═══ THREE PATHS ═══════════════════════════════════════════════
          The hardest-working structural idea on Terminal's page: instead of
          one CTA for everybody, three numbered doors that let the visitor
          say which kind of buyer they are. Set on paper — the ground flip
          is what marks the chapter. */}
      <section className="bg-[var(--tp-paper)] py-20 text-black md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <h2 className="tp-display max-w-[22ch] text-[clamp(1.9rem,4.4vw,3.25rem)]">
              Start where your network actually is.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--tp-line-light)] bg-[var(--tp-line-light)] md:grid-cols-3">
            {PATHS.map((p, i) => (
              <Reveal
                key={p.n}
                delay={i * 110}
                className="flex flex-col bg-white p-7 transition-colors hover:bg-[var(--tp-paper)] md:p-9"
              >
                <p className="tp-mono text-[10px] text-[var(--tp-gold-deep)]">
                  {p.n} &nbsp;{p.kicker}
                </p>
                <h3 className="tp-display mt-8 text-[clamp(1.35rem,2.2vw,1.75rem)]">
                  {p.title}
                </h3>
                <p className="tp-body mt-5 flex-1 text-[14px] text-black/55">
                  {p.body}
                </p>
                <a
                  href="#selector"
                  className="tp-mono mt-9 inline-flex items-center gap-2 text-[10px] text-black transition-colors hover:text-[var(--tp-gold-deep)]"
                >
                  {p.cta}
                  <svg
                    aria-hidden
                    viewBox="0 0 12 8"
                    className="h-2 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M0 4h10M7 1l3 3-3 3" />
                  </svg>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE INSTRUMENT ════════════════════════════════════════════ */}
      <section
        id="selector"
        className="scroll-mt-24 bg-[var(--tp-paper-2)] py-20 text-black md:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="tp-mono text-[10px] text-[var(--tp-gold-deep)]">
              Creepage estimator
            </p>
            <h2 className="tp-display mt-6 max-w-[20ch] text-[clamp(1.9rem,4.4vw,3.25rem)]">
              What creepage does your site actually need?
            </h2>
            <p className="tp-body mt-6 max-w-[54ch] text-[15px] text-black/55">
              Pollution class, altitude and system voltage decide the shed
              profile before anyone opens a catalogue. Set the three and see
              the number.
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-12">
            <SpecSelector />
          </Reveal>
        </div>
      </section>

      {/* ═══ KPI ODOMETER BAND ═════════════════════════════════════════ */}
      <section className="border-b border-[var(--tp-line-dark)] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="tp-mono text-[10px] text-[var(--tp-gold)]">
              Why Taban Niroo
            </p>
            <h2 className="tp-display mt-6 max-w-[24ch] text-[clamp(1.9rem,4.4vw,3.25rem)]">
              Twenty-nine years of insulators that are still in the air.
            </h2>
          </Reveal>

          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {KPIS.map((k, i) => (
              <Reveal key={k.label} delay={i * 100}>
                <dt className="tp-display text-[clamp(2.5rem,6vw,4rem)] text-[var(--tp-paper)]">
                  <Odometer value={k.value} />
                </dt>
                <dd className="tp-mono mt-4 text-[10px] text-white/40">
                  {k.label}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ APPLICATION TABS ══════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="tp-mono text-[10px] text-[var(--tp-gold)]">
              The range
            </p>
            <h2 className="tp-display mt-6 max-w-[20ch] text-[clamp(1.9rem,4.4vw,3.25rem)]">
              One catalogue, organised by where the part lives.
            </h2>
          </Reveal>

          <Reveal delay={150} className="mt-14">
            <ApplicationTabs />
          </Reveal>
        </div>
      </section>

      {/* ═══ STANDARDS + QUOTE ═════════════════════════════════════════ */}
      <section className="bg-[var(--tp-paper)] py-20 text-black md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="tp-mono text-[10px] text-[var(--tp-gold-deep)]">
                Tested, not asserted
              </p>
              <dl className="mt-8 divide-y divide-[var(--tp-line-light)] border-y border-[var(--tp-line-light)]">
                {STANDARDS.map((s) => (
                  <div key={s.code} className="py-5">
                    <dt className="tp-num text-[14px] text-black">{s.code}</dt>
                    <dd className="tp-body mt-1.5 text-[13px] text-black/50">
                      {s.what}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={140}>
              <p className="tp-mono text-[10px] text-[var(--tp-gold-deep)]">
                Built by the industry
              </p>
              {/* NOTE: Terminal runs a named customer testimonial here.
                  Attributed to the company rather than to a person, because
                  inventing a quote from a real utility engineer is not a
                  design decision to make in a sandbox. Swap in a real,
                  cleared quote before this pattern ships. */}
              <blockquote className="tp-display mt-8 text-[clamp(1.5rem,3vw,2.35rem)]">
                “A composite insulator is a twenty-five year promise. We build
                the ones we would hang over our own city.”
              </blockquote>
              <footer className="mt-8">
                <p className="tp-body text-[14px] text-black">Taban Niroo</p>
                <p className="tp-mono mt-2 text-[10px] text-black/45">
                  Dena Power Line Insulators · Shiraz
                </p>
              </footer>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="scroll-mt-24 border-b border-[var(--tp-line-dark)] py-20 md:py-28"
      >
        <div className="mx-auto grid max-w-6xl gap-14 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <h2 className="tp-display max-w-[14ch] text-[clamp(1.9rem,4.4vw,3.25rem)]">
              Tell us the line. We will tell you the set.
            </h2>
            <dl className="mt-12 space-y-7">
              {[
                [
                  "Works",
                  "Taban Niroo Bldg, Shiraz Special Economic Zone, Fars",
                ],
                ["Tehran office", "Office 9, No. 64, Saeedi Ave, Africa Blvd"],
                ["Telephone", "+98 71 3717 5115"],
                ["Email", "info@taban-niroo.com"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="tp-mono text-[9px] text-white/40">{k}</dt>
                  <dd className="tp-body mt-2.5 max-w-[34ch] text-[14px] text-white/75">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={140}>
            <InquiryForm />
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ════════════════════════════════════════════════════
          Terminal closes on an oversized wordmark that bleeds to the page
          edges — the last thing you see is the name at poster scale. */}
      <footer className="overflow-hidden pt-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-10 border-b border-[var(--tp-line-dark)] pb-14 sm:grid-cols-3">
            {[
              {
                h: "Range",
                items: [
                  "Silicone composite",
                  "Hybrid insulators",
                  "Transformer bushings",
                  "Cable accessories",
                ],
              },
              {
                h: "Company",
                items: ["About", "Plant", "Projects", "Blog"],
              },
              {
                h: "Legal",
                items: ["Privacy", "Terms", "Imprint"],
              },
            ].map((col) => (
              <div key={col.h}>
                <p className="tp-mono text-[9px] text-white/35">{col.h}</p>
                <ul className="mt-5 space-y-3">
                  {col.items.map((it) => (
                    <li key={it}>
                      <a
                        href="#top"
                        className="tp-body text-[14px] text-white/60 transition-colors hover:text-white"
                      >
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="tp-mono py-8 text-[9px] text-white/30">
            © 1997–2026 Taban Niroo · Dena Power Line Insulators
          </p>
        </div>

        <p
          aria-hidden
          className="tp-display -mb-[0.16em] w-full select-none px-2 text-center text-[clamp(3rem,15.5vw,14rem)] leading-[0.8] text-white/8"
        >
          TABAN NIROO
        </p>
      </footer>

      {/* Sandbox marker — this route is unlinked and noindexed, but anyone
          who lands on it should know immediately what they are looking at. */}
      <p className="tp-mono pointer-events-none fixed bottom-3 start-3 z-50 rounded-md border border-[var(--tp-line-dark)] bg-black/75 px-3 py-2 text-[9px] text-white/50 backdrop-blur">
        Style preview · not linked from the site
      </p>
    </div>
  );
}
