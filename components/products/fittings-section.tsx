import { Link as LinkIcon } from "lucide-react";

/**
 * End-fitting / coupling options available across the Taban Niroo
 * insulator families. Wording and designations follow IEC 60120 (ball
 * and socket) and IEC 60471 (clevis and tongue) which are the two
 * standards referenced in the 2026 catalogue for coupling geometry.
 */
const FITTINGS: {
  code: string;
  title: string;
  standard: string;
  description: string;
}[] = [
  {
    code: "01",
    title: "Ball & Socket",
    standard: "IEC 60120",
    description:
      "Standard suspension coupling for long rod and composite cap-and-pin insulators. Available in 16, 20 and 24 mm ball classes depending on the specified mechanical load.",
  },
  {
    code: "02",
    title: "Clevis & Tongue",
    standard: "IEC 60471",
    description:
      "Pinned coupling used where articulation in one plane is required — typical on tension sets and dead-ends for distribution and sub-transmission lines.",
  },
  {
    code: "03",
    title: "Y-Clevis / Eye",
    standard: "IEC 60471",
    description:
      "Y-clevis and eye fittings that mate with shackles, links and balance plates on transmission hardware assemblies.",
  },
  {
    code: "04",
    title: "Flange",
    standard: "Manufacturer-specific",
    description:
      "Flange terminations used on post insulators, station posts, transformer bushings and hollow cores. PCD and bolt pattern are issued on the individual drawing.",
  },
];

export function FittingsSection() {
  return (
    <section
      id="fittings"
      className="scroll-mt-28 border-t border-border/50 bg-background dark:border-white/[0.06]"
    >
      <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
          <div>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>End fittings</span>
              <span className="inline-flex h-px w-10 bg-foreground/40" />
            </div>
            <h2 className="font-hero-slogan mt-4 text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              Couplings
              <br />
              &amp; terminals.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              All long rod and post families can be supplied with the
              following IEC-standard couplings. Geometry and load class are
              confirmed per project on the approved drawing.
            </p>

            <p className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <LinkIcon size={12} aria-hidden />
              Couplings follow IEC 60120 &amp; IEC 60471
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {FITTINGS.map((f) => (
              <li
                key={f.code}
                className="interactive-lift rounded-2xl border border-border/40 bg-card/90 p-5 shadow-elevate dark:border-white/[0.08] dark:bg-card/50 md:p-6"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {f.code} · {f.standard}
                </p>
                <p className="font-hero-slogan mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {f.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
