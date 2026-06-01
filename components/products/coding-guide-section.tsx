import { ScanLine } from "lucide-react";

/**
 * DPL coding guide.
 *
 * Static reference section that teaches the reader how to parse a Taban
 * Niroo DPL reference (e.g. `DPL 33-1180 PI`). Only content that is
 * explicitly documented in company profile materials is used
 * here — no ratings are invented. Style matches the existing `Standards`
 * section so the page stays visually consistent.
 */
const SEGMENTS: {
  token: string;
  title: string;
  description: string;
}[] = [
  {
    token: "DPL",
    title: "Family prefix",
    description:
      "Identifies the product as a Taban Niroo design (Dehkade Power Line). Every DPL reference on this site begins with this prefix.",
  },
  {
    token: "33",
    title: "System voltage",
    description:
      "Nominal line voltage in kV (for example 11, 20, 33, 63, 132, 230 or 400). For station-class posts and hybrid posts the number is replaced by the section length directly (e.g. DPL 325 PI).",
  },
  {
    token: "1180",
    title: "Section length (mm)",
    description:
      "The four-digit number after the dash is the section length of the insulator housing in millimetres. Read together with the voltage it uniquely identifies a variant inside the family.",
  },
  {
    token: "PI",
    title: "Family suffix",
    description:
      "Two- to three-letter suffix marking the product family: PI = Post Insulator, HPI = Hybrid Post, LP = Line Post, PB = Polymer Bushing (ceramic core), B = Bushing, CU = Cut-Out Fuse, CA = Cross-Arm, H-L / H-P = Hybrid Line / Pin type, T.T = Phase-to-phase spacer.",
  },
];

export function CodingGuideSection() {
  return (
    <section
      id="coding-guide"
      className="scroll-mt-28 border-t border-border/50 bg-background dark:border-white/[0.06]"
    >
      <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
          <div>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>Coding guide</span>
              <span className="inline-flex h-px w-10 bg-foreground/40" />
            </div>
            <h2 className="font-hero-slogan mt-4 text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              Read any
              <br />
              DPL code.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Every Taban Niroo product carries a short DPL reference. Once
              you know the four segments below you can read section length,
              voltage class and family at a glance — no datasheet needed.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-5 py-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <ScanLine
                size={18}
                aria-hidden
                className="text-foreground"
                strokeWidth={1.5}
              />
              <p className="font-mono text-sm text-foreground">
                DPL&nbsp;33-1180&nbsp;PI
              </p>
            </div>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2">
            {SEGMENTS.map((s, i) => (
              <li
                key={s.token}
                className="interactive-lift rounded-2xl border border-border/40 bg-card/90 p-5 shadow-elevate dark:border-white/[0.08] dark:bg-card/50 md:p-6"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} · Segment
                </p>
                <p className="font-hero-slogan mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {s.token}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/70">
                  {s.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
