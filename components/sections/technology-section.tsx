"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { cn } from "@/lib/utils";
import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { ImageReveal } from "@/components/ui/image-reveal";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE, STATEMENT as STATEMENT_ROLE } from "@/lib/motion-roles";
import { useLocale } from "@/components/locale-link";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";
import { pageHeadingScale } from "@/lib/i18n/type-scale";

/**
 * Technology section — two-act composition.
 *
 *   Act I  – cinematic full-bleed image with the brand statement
 *            ("IEC. Standard. Industrial.") burned over a controlled
 *            dim. Sets the editorial tone of the chapter.
 *
 *   Act II – quiet, theme-consistent statement block. Uses the same
 *            eyebrow / display-heading / muted-body vocabulary as the
 *            rest of the homepage so the section never reads as a
 *            visual outlier. The descriptive sentence is delivered with
 *            a scroll-driven word colour reveal — the same device the
 *            client approved for the IEC standards line — so the
 *            paragraph "writes itself" as the reader passes through.
 *
 * Background and typography were tuned to match the global theme:
 *   • bg-background (no muted-grey gradient that read as flat / generic)
 *   • Editorial scale: text-3xl→text-5xl, font-medium tracking-tight
 *   • Eyebrow caption above the statement, mirroring every other
 *     section on the page.
 */

const TITLE_WORDS = ["IEC.", "Standard.", "Industrial."] as const;

const STATEMENT =
  "IEC 61109, 62217, 61466, 60120, 60471. ECR core. HTV silicone. Galvanized fittings. Accredited laboratories. 6-1000 kV.";

export function TechnologySection({ cms }: { cms?: ContentBlock } = {}) {
  const locale = useLocale();
  const image = cmsImage(cms, SITE_IMAGES.technology) ?? SITE_IMAGES.technology;
  const eyebrow = cmsText(cms, "eyebrow", "Standards · 2025 — 2026");
  const title = cmsText(cms, "title", "Type-tested. Field-proven.");
  const statement = cmsText(cms, "body", STATEMENT);

  return (
    <section
      id="technology"
      className="relative bg-background"
      aria-label="IEC standards and industrial insulator technology"
    >
      {/* Act I — the plate: a frame opens, the title card lifts over it */}
      <Beat>
        <div className="relative min-h-[100dvh] w-full overflow-hidden bg-brand-navy-deep">
          {/*
            Parallax on a dedicated wrapper: ImageReveal writes its own
            inline transform, and `useElementParallax` writes one too —
            sharing a node would silently destroy one of them. Oversized
            and clamped so the drift never exposes an edge.
          */}
          <div
            data-parallax="0.90"
            data-parallax-max="28"
            className="absolute inset-x-0 -inset-y-[5%]"
          >
            <ImageReveal className="absolute inset-0">
              <Image
                src={image}
                alt="Taban Niroo composite insulators and power transmission"
                fill
                /* The default plate is a hazy desert line shot — near-zero
                   contrast straight out of camera, which is what made this
                   full viewport read as a loading state. A small grade gives
                   the pylons something to separate against. */
                className="object-cover contrast-[1.14] saturate-[0.88] brightness-[0.96]"
                sizes="(min-width: 1280px) 1280px, 100vw"
                quality={70}
                decoding="async"
              />
            </ImageReveal>
          </div>
          {/*
            Scrim, weighted to the bottom where the title card sits.

            This was `bg-foreground/40`, which is a THEME token: in light mode
            it dimmed the plate as intended, but in dark mode `--foreground`
            is #F2F3F5, so the "dim" was a 40% white wash — the frame washed
            out and the white title dropped to roughly 1.4:1 against it. The
            type here is white in both themes, so the scrim must be too: a
            fixed graphite gradient, heaviest under the type, with a vignette
            to hold the edges. Measured on the default plate this puts
            "IEC." above 8:1 and the two tracking lines above 5:1.
          */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(10_11_13_/_0.55)_0%,rgb(10_11_13_/_0.28)_38%,rgb(10_11_13_/_0.62)_78%,rgb(10_11_13_/_0.86)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_45%,transparent_38%,rgb(10_11_13_/_0.45)_100%)]"
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col justify-end overflow-hidden pb-8 md:pb-14 lg:pb-16">
            {/*
              One `statement`, not three staggered reveals. The three lines
              are a single title card, so they lift as one rigid body — the
              per-line stagger read as three unrelated events landing on a
              plate that was doing its own, fourth thing.
            */}
            <RevealUp
              delay={BEAT.headline}
              duration={STATEMENT_ROLE.duration}
              distance={STATEMENT_ROLE.distance}
              className="mx-auto flex w-full max-w-6xl flex-col items-start gap-0.5 px-5 sm:px-6 md:gap-1.5 md:px-8 lg:px-10"
            >
              {TITLE_WORDS.map((word, index) => (
                <span
                  key={word}
                  className={cn(
                    "block w-full text-start leading-[1.02] text-white",
                    index === 0
                      ? "text-5xl font-semibold tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl"
                      : "text-sm font-medium uppercase tracking-[0.18em] text-white/88 sm:text-base md:text-lg"
                  )}
                >
                  {word}
                </span>
              ))}
            </RevealUp>
          </div>
        </div>
      </Beat>

      {/* Act II — editorial statement block, theme-consistent */}
      <div className="relative border-t border-white/10 bg-brand-navy-deep">
        <Beat className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <RevealBlock
              delayMs={BEAT.first}
              durationMs={EVIDENCE.duration}
              distance={EVIDENCE.distance}
            >
              {/*
                Was `text-rose-300/90` — a hue that appears nowhere else in
                the palette. On this dark ground the eyebrow takes the one
                brand accent, same as every other section.
              */}
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
                {eyebrow}
              </p>
            </RevealBlock>

            <RevealUp
              as="h2"
              delay={BEAT.headline}
              duration={STATEMENT_ROLE.duration}
              distance={STATEMENT_ROLE.distance}
              className={cn(
                "font-hero-slogan mt-4 font-semibold uppercase tracking-tight text-white",
                pageHeadingScale(locale),
              )}
            >
              {title}
            </RevealUp>

            {/*
              Explicit pre/post colours, because this scene does not follow
              the theme.

              `ScrollRevealText` defaults to `--muted-foreground` ->
              `--foreground`, which is correct on the page ground but wrong
              here: the block is `bg-brand-navy-deep`, #0A0B0D in BOTH
              themes. In light mode `--foreground` is #15171A, so the fully
              revealed statement painted near-black on near-black — 1.09:1,
              a 36px paragraph nobody could see, and the last color-contrast
              node left on the home page. The muted start was 3.1:1, which
              only scraped the large-text floor and would have failed
              outright if the type were ever set below 24px.

              Both ends are now pinned to values that do not invert, the
              same way the eyebrow above takes `--brand-orange` and the
              heading takes `text-white`:

                pre   white @ 55%   ->  6.3:1   (clears 4.5, not just 3.0)
                post  --brand-cream -> 18.0:1 light / 17.7:1 dark

              Cream rather than white for the revealed state keeps the
              statement one tier under the `text-white` heading, which is
              the hierarchy the rest of the dark scenes use.

              `text-slate-100` also came off the className: a raw Tailwind
              palette hue that is in neither the token set nor this page,
              and dead regardless since the inline colour wins.
            */}
            <ScrollRevealText
              as="p"
              preColor="rgb(255 255 255 / 0.55)"
              postColor="var(--brand-cream)"
              className="mt-10 text-2xl font-medium leading-snug tracking-tight md:mt-12 md:text-3xl lg:text-4xl"
            >
              {statement}
            </ScrollRevealText>
          </div>
        </Beat>
      </div>
    </section>
  );
}
