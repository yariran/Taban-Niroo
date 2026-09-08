"use client";

import { useMemo, useState } from "react";
import { Odometer } from "./odometer";

/**
 * The Taban Niroo equivalent of Terminal's ROI calculator.
 *
 * Terminal puts an interactive instrument in the middle of the page — the
 * visitor types their own numbers in and gets a figure back. That is the
 * single strongest structural idea on their site, and it transplants: for
 * an insulator maker the natural instrument is a creepage estimator.
 *
 * The arithmetic is real, per IEC 60815-1:
 *
 *   creepage = RUSCD × (Um / √3) × ka
 *   ka       = e^(m·(H − 1000) / 8150)   for H > 1000 m, m = 0.5
 *
 * RUSCD is the reference unified specific creepage distance for the site
 * pollution severity class, quoted against the phase-to-earth voltage —
 * hence the √3. This is an indicative figure for specification, not a
 * design guarantee, and the panel says so.
 */

const POLLUTION_CLASSES = [
  {
    key: "a",
    name: "Very light",
    ruscd: 22.0,
    note: "Inland, low density, no industry, > 50 km from sea",
  },
  {
    key: "b",
    name: "Light",
    ruscd: 27.8,
    note: "Rural, light industry, 10–50 km from sea",
  },
  {
    key: "c",
    name: "Medium",
    ruscd: 34.7,
    note: "Suburban, moderate industry, 3–10 km from sea",
  },
  {
    key: "d",
    name: "Heavy",
    ruscd: 43.3,
    note: "Dense industry, city exhaust, close to coast",
  },
  {
    key: "e",
    name: "Very heavy",
    ruscd: 53.7,
    note: "Desert salt, chemical fume, direct sea spray",
  },
] as const;

const VOLTAGES = [24, 36, 72.5, 145, 245, 420, 550] as const;

function recommend(um: number) {
  if (um <= 36)
    return {
      family: "Silicone Composite — distribution",
      ref: "DPL11 · DPL15 · DPL24 · DPL36 — TC / BS / 6L series",
    };
  if (um <= 72.5)
    return {
      family: "Silicone Composite — suspension / tension",
      ref: "DPL63 · DPL110 — 80/120 BS series",
    };
  if (um <= 145)
    return {
      family: "Silicone Composite — suspension / tension",
      ref: "DPL132 · DPL161 — 80/120 · 160/210 BS series",
    };
  if (um <= 245)
    return {
      family: "Silicone Composite — suspension / tension",
      ref: "DPL220 · DPL230 — 120 · 160/210 BS series",
    };
  if (um <= 420)
    return {
      family: "Silicone Composite · Hybrid station post",
      ref: "DPL400 — 160/210 · 300 BS series",
    };
  return {
    family: "Silicone Composite · Hybrid station post",
    ref: "DPL400 — 160/210 · 300 BS series (500 kV)",
  };
}

export function SpecSelector() {
  const [um, setUm] = useState<number>(145);
  const [classIndex, setClassIndex] = useState(2);
  const [altitude, setAltitude] = useState(1200);

  const pollution = POLLUTION_CLASSES[classIndex]!;

  const result = useMemo(() => {
    const phaseToEarth = um / Math.sqrt(3);
    const ka =
      altitude > 1000 ? Math.exp((0.5 * (altitude - 1000)) / 8150) : 1;
    const creepage = pollution.ruscd * phaseToEarth * ka;
    return {
      phaseToEarth,
      ka,
      creepage,
      /** Rounded up to the nearest 10 mm, the way a spec is actually written. */
      spec: Math.ceil(creepage / 10) * 10,
    };
  }, [um, altitude, pollution]);

  const pick = recommend(um);

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--tp-line-light)] bg-[var(--tp-line-light)] lg:grid-cols-[1.05fr_1fr]">
      {/* ── Inputs ───────────────────────────────────────────────── */}
      <div className="bg-[var(--tp-paper)] p-6 md:p-9">
        <p className="tp-mono text-[10px] text-[var(--tp-gold-deep)]">
          Step 01 — Your site
        </p>

        <fieldset className="mt-7">
          <legend className="tp-body text-[13px] text-black/55">
            Highest system voltage, U<sub>m</sub>
          </legend>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {VOLTAGES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setUm(v)}
                aria-pressed={um === v}
                className={`tp-num rounded-md border px-3 py-2 text-[13px] transition-colors ${
                  um === v
                    ? "border-black bg-black text-[var(--tp-paper)]"
                    : "border-[var(--tp-line-light)] bg-white text-black/70 hover:border-black/35"
                }`}
              >
                {v} kV
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-9">
          <legend className="tp-body text-[13px] text-black/55">
            Site pollution severity — IEC 60815-1
          </legend>

          <div className="mt-4 flex items-baseline justify-between gap-4">
            <p className="tp-display text-[26px] text-black">
              <span className="uppercase text-[var(--tp-gold-deep)]">
                {pollution.key}
              </span>{" "}
              {pollution.name}
            </p>
            <p className="tp-num text-[13px] text-black/55">
              {pollution.ruscd.toFixed(1)} mm/kV
            </p>
          </div>

          <input
            type="range"
            min={0}
            max={POLLUTION_CLASSES.length - 1}
            step={1}
            value={classIndex}
            onChange={(e) => setClassIndex(Number(e.target.value))}
            aria-label="Site pollution severity class"
            className="tp-range mt-5"
          />
          <div className="mt-3 flex justify-between">
            {POLLUTION_CLASSES.map((c, i) => (
              <span
                key={c.key}
                className={`tp-mono text-[10px] ${
                  i === classIndex ? "text-black" : "text-black/35"
                }`}
              >
                {c.key}
              </span>
            ))}
          </div>
          <p className="tp-body mt-4 text-[13px] text-black/55">
            {pollution.note}
          </p>
        </fieldset>

        <fieldset className="mt-9">
          <legend className="tp-body text-[13px] text-black/55">
            Altitude above sea level
          </legend>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={4000}
              step={100}
              value={altitude}
              onChange={(e) => setAltitude(Number(e.target.value) || 0)}
              aria-label="Altitude in metres"
              className="tp-num w-32 rounded-md border border-[var(--tp-line-light)] bg-white px-3 py-2 text-[14px] text-black outline-none focus-visible:border-black"
            />
            <span className="tp-mono text-[10px] text-black/45">metres</span>
            {result.ka > 1 && (
              <span className="tp-num text-[12px] text-[var(--tp-gold-deep)]">
                k<sub>a</sub> = {result.ka.toFixed(3)}
              </span>
            )}
          </div>
        </fieldset>
      </div>

      {/* ── Readout ──────────────────────────────────────────────── */}
      <div className="bg-[var(--tp-ink)] p-6 text-[var(--tp-paper)] md:p-9">
        <p className="tp-mono text-[10px] text-[var(--tp-gold)]">
          Step 02 — Your requirement
        </p>

        <p className="tp-body mt-7 text-[13px] text-white/55">
          Minimum creepage distance, phase to earth
        </p>
        <p className="tp-display mt-2 text-[clamp(2.75rem,7vw,4.5rem)] text-[var(--tp-gold)]">
          <Odometer value={String(result.spec)} />
          <span className="ms-2 align-baseline text-[0.32em] tracking-[0.16em] text-white/50">
            MM
          </span>
        </p>

        <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {[
            {
              k: "Phase-to-earth voltage",
              v: `${result.phaseToEarth.toFixed(1)} kV`,
            },
            {
              k: "Reference USCD",
              v: `${pollution.ruscd.toFixed(1)} mm/kV`,
            },
            {
              k: "Altitude correction",
              v: `× ${result.ka.toFixed(3)}`,
            },
            {
              k: "Unrounded",
              v: `${result.creepage.toFixed(0)} mm`,
            },
          ].map((row) => (
            <div
              key={row.k}
              className="flex items-baseline justify-between gap-4 py-3.5"
            >
              <dt className="tp-body text-[13px] text-white/55">{row.k}</dt>
              <dd className="tp-num text-[14px] text-[var(--tp-paper)]">
                {row.v}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <p className="tp-mono text-[10px] text-white/45">Suggested range</p>
          <p className="tp-display mt-2.5 text-[20px] text-[var(--tp-paper)]">
            {pick.family}
          </p>
          <p className="tp-num mt-2 text-[12px] text-white/50">{pick.ref}</p>
        </div>

        <p className="tp-mono mt-8 text-[9px] leading-[1.7] text-white/35">
          Indicative only — per IEC 60815-1. Final creepage is set by the
          project specification and type-test report.
        </p>
      </div>
    </div>
  );
}
