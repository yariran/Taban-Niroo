"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hero spec ticker — engineering dashboard strip.
 *
 * A thin, always-on horizontal band placed directly under the hero
 * media. Shows four rotating engineering data points (voltage range,
 * active since, patents, countries) cycling once every five seconds.
 * The cycle is paused when `prefers-reduced-motion: reduce` is
 * detected; in that case all four entries are shown statically as a
 * single grid.
 *
 * Visual language:
 *  - `font-mono` (`tabular-nums`) — reads as a control-room readout.
 *  - Hairline border top + bottom (matches blueprint dividers).
 *  - No new colour tokens; everything in `foreground/65` for legibility
 *    against both pale and dark hero shots.
 */
const TICKER: readonly { label: string; value: string }[] = [
  { label: "RATED VOLTAGE", value: "6-1000 kV" },
  { label: "Active since", value: "1997" },
  { label: "Registered patents", value: "03" },
  { label: "Served countries", value: "10" },
  { label: "Production line", value: "Shiraz SEZ, Iran" },
  { label: "Compliance", value: "IEC 61109 · 62217" },
];

export function HeroSpecTicker() {
  const [i, setI] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setI((p) => (p + 1) % TICKER.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="border-y border-border/50 bg-background dark:border-white/[0.06]">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-5 py-5 text-[11px] uppercase tracking-[0.18em] text-foreground/65 sm:px-6 md:grid-cols-4 md:px-8 lg:grid-cols-6 lg:px-10">
          {TICKER.map((t) => (
            <div key={t.label} className="flex flex-col">
              <span className="text-foreground/45">{t.label}</span>
              <span className="mt-1 font-mono tabular text-foreground">{t.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active spec + the next one (preview tucked under), gives a cinematic depth cue.
  const current = TICKER[i];
  const next = TICKER[(i + 1) % TICKER.length];

  return (
    <div className="relative border-y border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/70 supports-[backdrop-filter]:backdrop-blur-md dark:border-white/[0.06]">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-4 sm:px-6 md:px-8 lg:px-10">
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:inline">
          Live spec
        </span>
        <span
          aria-hidden
          className="hidden h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400 md:inline-block"
        />
        <div className="relative flex-1 overflow-hidden">
          <SpecRow current={current} next={next} index={i} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground tabular">
          {String(i + 1).padStart(2, "0")} / {String(TICKER.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

type Spec = (typeof TICKER)[number];
function SpecRow({ current, next, index }: { current: Spec; next: Spec; index: number }) {
  return (
    <div key={index} className="relative h-6 md:h-7">
      {/* Outgoing row could be implemented with two layers + transition,
          but a fresh keyed mount with CSS animation is simpler and
          equally cinematic. */}
      <div
        className={cn(
          "absolute inset-0 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-foreground/80 md:text-xs",
          "animate-[reveal-up_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        )}
      >
        <span className="text-foreground/55">{current.label}</span>
        <span aria-hidden className="text-foreground/30">·</span>
        <span className="font-mono tabular text-foreground">{current.value}</span>
        <span aria-hidden className="ml-auto hidden text-foreground/30 sm:inline">
          next
        </span>
        <span aria-hidden className="hidden text-foreground/45 sm:inline">
          {next.label}
        </span>
      </div>
    </div>
  );
}
