"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Terminal's "One Modular Platform" tab block, retargeted.
 *
 * Their tabs walk the visitor through the physical journey of a trailer —
 * AT THE GATE → IN THE YARD → AT THE DOCK → ACROSS OPERATIONS. The move is
 * to organise the catalogue by WHERE THE PART LIVES rather than by product
 * family, which is what makes a technical range legible to a buyer who
 * doesn't already know the family names. Taban Niroo's grid has the same
 * spatial spine: line → pole → substation → network.
 */
const TABS = [
  {
    key: "line",
    label: "On the line",
    title: "Long-rod suspension and tension insulators",
    body: "Silicone-housed composite long rods from 24 kV to 500 kV. An ECR core takes the mechanical load, the shed profile carries the creepage, and the whole unit weighs a fraction of the porcelain string it replaces — so it can be strung by a crew rather than by a crane.",
    image: "/images/LONGROD_INSULATORS.jpg",
    alt: "Composite long-rod insulators on a transmission line",
    specs: ["24–500 kV", "IEC 61109", "70–300 kN SML"],
  },
  {
    key: "pole",
    label: "At the pole",
    title: "Line post, pin-type and interphase spacers",
    body: "Distribution hardware for 11 kV through 36 kV feeders: line post and pin-type units, phase-to-phase spacers that hold conductor separation through wind span, and cutout fuse housings. Built for networks where a single outage takes out a district.",
    image: "/images/featured-post-line-station-railway-v3.jpg",
    alt: "Line post insulators on a distribution pole",
    specs: ["11–36 kV", "IEC 62217", "Interphase spacers"],
  },
  {
    key: "substation",
    label: "In the substation",
    title: "Station posts and hollow-core bushings",
    body: "Hybrid station posts and hollow-core transformer bushings up to 1000 kV. Silicone housing over a composite tube means no shattering under internal fault — the failure mode that keeps substation engineers awake is designed out rather than mitigated.",
    image: "/images/hollow-core-bushing.jpg",
    alt: "Hollow-core composite transformer bushing",
    specs: ["Up to 1000 kV", "IEC 60137", "Hybrid housing"],
  },
  {
    key: "network",
    label: "Across the network",
    title: "Cable accessories and creepage extenders",
    body: "Terminations, joints and separable connectors, plus creepage extenders and animal-guard covers that retrofit onto existing porcelain. The cheapest way to survive a pollution season is often not a new insulator but a booster shed on the one you already have.",
    image: "/images/featured-cable-accessories.jpg",
    alt: "Composite cable accessories and terminations",
    specs: ["Retrofit", "IEC 60099-4", "Animal guards"],
  },
] as const;

export function ApplicationTabs() {
  const [active, setActive] = useState(0);
  const tab = TABS[active]!;

  return (
    <div>
      {/* Tab rail — mono, uppercase, underlined on select. Terminal keeps
          these full width and evenly spread so they read as a route, not
          as a menu. */}
      <div
        role="tablist"
        aria-label="Where the part lives"
        className="flex flex-wrap gap-x-1 gap-y-2 border-b border-[var(--tp-line-dark)]"
      >
        {TABS.map((t, i) => (
          <button
            key={t.key}
            role="tab"
            id={`tp-tab-${t.key}`}
            aria-selected={i === active}
            aria-controls={`tp-panel-${t.key}`}
            onClick={() => setActive(i)}
            className={`tp-mono relative -mb-px border-b-2 px-3 py-4 text-[10px] transition-colors md:px-5 ${
              i === active
                ? "border-[var(--tp-gold)] text-[var(--tp-gold)]"
                : "border-transparent text-white/45 hover:text-white/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`tp-panel-${tab.key}`}
        aria-labelledby={`tp-tab-${tab.key}`}
        /* Keyed so the panel re-mounts and re-plays its fade on every tab
           change — without the key React reuses the node and the switch
           lands with no motion at all. */
        key={tab.key}
        className="grid animate-[tp-fade_0.5s_var(--tp-ease)_both] gap-10 pt-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16 lg:pt-14"
      >
        <div>
          <h3 className="tp-display max-w-[16ch] text-[clamp(1.75rem,3.4vw,2.75rem)]">
            {tab.title}
          </h3>
          <p className="tp-body mt-6 max-w-[46ch] text-[15px] text-white/60">
            {tab.body}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {tab.specs.map((s) => (
              <li
                key={s}
                className="tp-num rounded-md border border-[var(--tp-line-dark)] px-3 py-1.5 text-[12px] text-white/70"
              >
                {s}
              </li>
            ))}
          </ul>

          <a
            href="#selector"
            className="tp-btn tp-btn-ghost tp-mono mt-9 inline-flex"
          >
            More
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
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--tp-ink-2)] lg:aspect-[16/11]">
          <Image
            src={tab.image}
            alt={tab.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
          />
        </div>
      </div>

      <style>{`
        @keyframes tp-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes tp-fade { from { opacity: 1; } to { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}
