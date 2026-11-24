"use client";

import Image from "next/image";

import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import { useLocale } from "@/components/locale-link";
import type { Locale } from "@/lib/i18n";
import { getDictionarySync } from "@/lib/i18n/dictionary-catalog";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";
import { pageHeadingScale } from "@/lib/i18n/type-scale";
import { SITE_IMAGES } from "@/lib/site-images";
import { cn } from "@/lib/utils";

/**
 * Vision, Values & Mission — the "why" chapter of the Company page.
 *
 * The three statements below are taken from the Company Profile
 * (2025-2026). Values reuse the five culture principles named in the
 * same document ("Excellence in Innovation, Leadership by Example,
 * Integrity and Transparency, client focus, employee-centred approach")
 * — keep the labels intact unless the brand document changes.
 *
 * Layout mirrors the editorial vocabulary already used by
 * `WhyTabanSection`: eyebrow + display heading, then a hairline-divided
 * list. Vision and Mission read as two long-form statements; Values sit
 * underneath as a numbered grid.
 *
 * The client's switchyard photograph is the section's BACKGROUND, not a
 * plate inside it — it was a contained figure first, and the ground reads
 * better: the headline's literal subject sits behind the headline instead
 * of being announced twice. Legibility is carried by the gradient scrim in
 * the markup below, which is keyed to the `background` token so the text
 * tokens keep their designed contrast in both themes.
 */

type Value = {
  number: string;
  title: string;
  description: string;
};

const VISION: Record<Locale, string> = {
  en: "To be the reference manufacturer of composite insulation for high-voltage networks across the Middle East, Africa, South America and Eastern Europe — the supplier utilities specify when a line has to stay energised for thirty years.",
  fa: "سازندهٔ مرجع عایق کامپوزیتی برای شبکه‌های فشار قوی در خاورمیانه، آفریقا، آمریکای جنوبی و اروپای شرقی — تأمین‌کننده‌ای که شرکت‌های برق وقتی خطی باید سی سال برق‌دار بماند، نامش را در مشخصات می‌نویسند.",
};

const MISSION: Record<Locale, string> = {
  en: "To design, test and manufacture composite and hybrid insulators, transformer bushings and line hardware to IEC standards from 6 to 1000 kV, and to support them in the field with engineering judgement rather than a catalogue number.",
  fa: "طراحی، آزمون و تولید مقرهٔ کامپوزیتی و هیبریدی، بوشینگ ترانسفورماتور و یراق خط بر اساس استانداردهای IEC در محدودهٔ 6 تا 1000 kV، و پشتیبانی از آن‌ها در میدان با قضاوت مهندسی، نه با شمارهٔ کاتالوگ.",
};

const VALUES: Record<Locale, readonly Value[]> = {
  en: [
    {
      number: "01",
      title: "Excellence in innovation",
      description:
        "Research, tooling and testing capacity are funded ahead of demand, so new insulator families reach the field proven rather than promised.",
    },
    {
      number: "02",
      title: "Leadership by example",
      description:
        "Engineering discipline and workplace safety are set at management level and practised on the shop floor, not delegated to a policy document.",
    },
    {
      number: "03",
      title: "Integrity & transparency",
      description:
        "Test reports, material data and commercial terms are shared in full. Utilities specify our products on evidence, not assurance.",
    },
    {
      number: "04",
      title: "Client focus",
      description:
        "Bespoke fittings, site audits and pollution studies sit inside the relationship — we solve the network problem, not only the purchase order.",
    },
    {
      number: "05",
      title: "Employee-centred approach",
      description:
        "Skilled specialists and technocrats stay for decades. Continuity of people is what makes continuity of product quality possible.",
    },
  ],
  fa: [
    {
      number: "01",
      title: "برتری در نوآوری",
      description:
        "ظرفیت تحقیق، قالب‌سازی و آزمون پیش از تقاضا تأمین می‌شود، تا خانوادهٔ جدید مقره اثبات‌شده به میدان برسد، نه وعده‌داده‌شده.",
    },
    {
      number: "02",
      title: "پیشگامی در عمل",
      description:
        "نظم مهندسی و ایمنی محیط کار در سطح مدیریت تعیین و در سالن تولید اجرا می‌شود، نه واگذار به یک سند خط‌مشی.",
    },
    {
      number: "03",
      title: "درستی و شفافیت",
      description:
        "گزارش تست، داده‌های مواد و شرایط تجاری به‌طور کامل در اختیار قرار می‌گیرد. شرکت‌های برق محصول ما را بر پایهٔ شواهد انتخاب می‌کنند، نه اطمینان‌دادن.",
    },
    {
      number: "04",
      title: "تمرکز بر مشتری",
      description:
        "یراق سفارشی، بازدید سایت و مطالعهٔ آلودگی بخشی از همکاری است — ما مسئلهٔ شبکه را حل می‌کنیم، نه فقط سفارش خرید را.",
    },
    {
      number: "05",
      title: "رویکرد کارمندمحور",
      description:
        "متخصصان و کارشناسان فنی دهه‌ها می‌مانند. پیوستگی نیروی انسانی است که پیوستگی کیفیت محصول را ممکن می‌کند.",
    },
  ],
};

export function VisionValuesSection({ cms }: { cms?: ContentBlock } = {}) {
  const locale = useLocale();
  const dict = getDictionarySync(locale);
  const eyebrow = cmsText(
    cms,
    "eyebrow",
    locale === "fa" ? "چشم‌انداز، ارزش‌ها و مأموریت" : "Vision, Values & Mission",
  );
  const title = cmsText(
    cms,
    "title",
    locale === "fa"
      ? "ساخته‌شده برای شبکه، نه برای فصل مالی."
      : "Built to carry the grid, not the quarter.",
  );
  const vision = cmsText(cms, "body", VISION[locale]);
  /** `ContentBlock` has a single body slot — vision owns it, mission stays fixed. */
  const mission = MISSION[locale];
  const plate = cmsImage(cms, SITE_IMAGES.visionSwitchyard) ?? SITE_IMAGES.visionSwitchyard;

  const cmsItems = cms?.items?.filter((i) => i.label.trim() && i.body?.trim()) ?? [];
  const values: readonly Value[] =
    cmsItems.length > 0
      ? cmsItems.map((i, idx) => ({
          number: String(idx + 1).padStart(2, "0"),
          title: i.label,
          description: i.body!.trim(),
        }))
      : VALUES[locale];

  return (
    <section
      className="relative isolate overflow-hidden bg-background"
      aria-labelledby="vision-heading"
    >
      {/*
        The photograph is the chapter's ground, not an illustration in it.

        `alt=""`: as a background it is decorative. A screen reader reaching
        this section should hear the eyebrow and the heading, not a sentence
        about corona rings read out before them.

        The scrim is what makes this legible, and it is a GRADIENT because
        the text is not evenly distributed. Only the eyebrow and the display
        heading sit in the upper band, so the photograph is allowed to come
        through there; Vision, Mission and the five values are a long run of
        small type lower down, and the scrim closes to near-opaque behind
        them. It is keyed to `background` rather than to black or white so
        every existing text token keeps the contrast it was designed for in
        both themes — see the measured figures in the section note below.

        Dark mode needs the heavier hand: the photograph is a pale dusk sky,
        so a light scrim over it stays light and the dark theme's near-white
        type would be reading against a mid-grey.

        Measured on the rendered pixels at 1440, after the reshape below
        (modal background colour of each text block's own box, against its
        computed colour):

                        light    dark    floor
          eyebrow        4.92    8.11     4.5
          headline      14.82   13.78     3    (large)
          vision body    5.68    7.32     4.5
          value body     5.77    6.86     4.5

        At 375 the two tiers that sit directly on the photograph band come
        to 8.46 (eyebrow) and 13.37 (heading), measured the same way.

        A note on the method, because it bit once: the background of a crop
        is its luminance PERCENTILE, not its modal colour. The mode is the
        background only while the glyphs are a minority of the pixels, and
        a large bold heading on a phone is not — sampled that way the mobile
        heading reported a white background and a 1.11 ratio, which was the
        type measuring itself.

        The eyebrow is the tier with the least headroom and the one to
        re-measure first if these stops are ever reopened: small gold type,
        sitting in the band where the scrim is thinnest, with the crop
        moving under it as the viewport changes. The heading will pass
        whatever happens — it only owes 3:1.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/*
          The photograph covers the whole section from `md` up, and only a
          band at the top below it.

          `object-cover` fills the box by scaling to its LONGER side, and on
          a phone this section is 375 wide by about 1820 tall. A 4:3 frame
          covering that is scaled 1.6x by height, which leaves roughly a
          sixth of its width on screen — a vertical slice of one insulator,
          magnified past the point where it reads as a switchyard at all.
          Capping the band at 22rem puts the crop back near the frame's own
          proportions, and the mask fades its lower edge out instead of
          ending on a seam.
        */}
        <div className="absolute inset-x-0 top-0 h-[22rem] [mask-image:linear-gradient(to_bottom,black_62%,transparent)] md:inset-0 md:h-auto md:[mask-image:none]">
          <Image
            src={plate}
            alt=""
            fill
            sizes="100vw"
            quality={88}
            /*
              The source is a phone frame of a dusk yard: low contrast and
              low saturation before anything is laid over it. Under a scrim
              it stopped reading as a photograph and started reading as a
              smudge, so it gets its own grade here. This is the picture's
              own correction, deliberately separate from the scrim above —
              the scrim's job is contrast for the type, this one's is
              legibility for the subject.
            */
            className="object-cover object-[center_28%] [filter:contrast(1.14)_saturate(1.2)]"
          />
        </div>
        {/*
          TWO scrims, because the text is not spread evenly over the frame.

          A single even scrim was tried first and it was the wrong shape: to
          protect the densest line of small type it had to be closed
          everywhere, so the photograph was washed out everywhere — including
          the whole right-hand half of the heading band, where nothing is
          printed at all.

          So: the VERTICAL one carries the section's own shape. It barely
          touches the heading band and closes to near-opaque by the time the
          Vision and Mission columns start, because from there down every
          line is small type running the full width.

          The HORIZONTAL one lives only in the heading band and only on the
          reading side. The heading is capped at `max-w-3xl`, so beyond it
          there is open frame, and that is where the photograph is let
          through almost untouched.

          The two multiply where they overlap. Behind the eyebrow — the tier
          with the least headroom — they still come to roughly the same
          cover as the flat scrim did, so its contrast is unchanged; out on
          the open side the cover drops to about a third.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/15 via-background/90 via-[38%] to-background/[0.97] dark:from-background/30 dark:via-background/[0.94] dark:via-[38%] dark:to-background/[0.98]" />
        <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-r from-background/75 via-background/45 via-[52%] to-transparent dark:from-background/80 dark:via-background/50" />
      </div>

      <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <div className="border-t border-border pt-12 md:pt-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
            {eyebrow}
          </p>

          <h2 id="vision-heading" className="mt-4 max-w-3xl">
            <RevealText
              as="span"
              className={cn(
                "block font-hero-slogan text-brand-heading font-bold uppercase leading-[1.05] tracking-tight",
                pageHeadingScale(locale),
              )}
            >
              {title}
            </RevealText>
          </h2>

          <div className="mt-12 grid gap-10 border-t border-border pt-10 md:mt-16 md:grid-cols-2 md:gap-16 md:pt-12">
            <RevealBlock>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy">
                {dict.sections.vision}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {vision}
              </p>
            </RevealBlock>
            <RevealBlock delayMs={220}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy">
                {dict.sections.mission}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {mission}
              </p>
            </RevealBlock>
          </div>

          <p className="mt-16 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy md:mt-20">
            {dict.sections.values}
          </p>
          <RevealBlock as="ul" className="mt-6">
            {values.map((value) => (
              <li
                key={value.number}
                className="grid gap-2 border-t border-border py-6 md:grid-cols-[4rem_minmax(0,14rem)_minmax(0,1fr)] md:items-baseline md:gap-8 md:py-7"
              >
                {/* Undiluted: `/70` measured 3.06:1 light / 4.13:1 dark on
                    12px, both under the 4.5 floor. `--muted-foreground` is
                    already the de-emphasis tier — thinning it further just
                    invented a second, failing one. */}
                <span className="font-mono text-xs text-muted-foreground tabular">
                  {value.number}
                </span>
                <h3 className="text-base font-medium text-brand-heading md:text-lg">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {value.description}
                </p>
              </li>
            ))}
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
