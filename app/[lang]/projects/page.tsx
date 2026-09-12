import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SITE_IMAGES } from "@/lib/site-images";
import { SiteFooter } from "@/components/site-footer";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";
import { getSiteContent } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";
import { pageSocialFor } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LocaleLink } from "@/components/locale-link";
import { localeFromParams } from "@/lib/i18n";
import { pageHeadingScale } from "@/lib/i18n/type-scale";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return pageSocialFor("projects", locale);
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFromParams(params);
  const dict = await getDictionary(locale);
  const content = await getSiteContent(locale);
  const hero = content.projects?.hero;
  const intro = content.projects?.intro;

  const useCmsHero = locale === "en";
  const eyebrow = useCmsHero
    ? cmsText(hero, "eyebrow", dict.projects.eyebrow)
    : dict.projects.eyebrow;
  const titleLine1 = useCmsHero
    ? cmsText(hero, "title", dict.projects.title1)
    : dict.projects.title1;
  const titleLine2 = useCmsHero
    ? cmsText(hero, "ctaLabel", dict.projects.title2)
    : dict.projects.title2;
  const heroBody = useCmsHero
    ? cmsText(hero, "body", dict.projects.heroBody)
    : dict.projects.heroBody;
  const introBody = useCmsHero
    ? cmsText(intro, "body", dict.projects.introBody)
    : dict.projects.introBody;
  const heroImage =
    cmsImage(hero, SITE_IMAGES.projectsHero) ?? SITE_IMAGES.projectsHero;

  const regions =
    locale === "en" &&
    content.projects?.regions?.items?.length &&
    content.projects.regions.items.some((i) => i.label.trim())
      ? content.projects.regions.items.map((r) => ({
          label: r.label,
          body: r.body || r.value || "",
        }))
      : dict.projects.regions;

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-background">
        <div className="px-6 pb-20 pt-28 md:px-12 md:pb-24 md:pt-32 lg:px-20 lg:pb-28 lg:pt-36">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
                {eyebrow}
              </p>
              <h1
                className={cn(
                  "font-hero-slogan text-brand-heading mt-4 font-bold uppercase tracking-tight",
                  pageHeadingScale(locale),
                )}
              >
                <RevealWords as="span" className="block">
                  {titleLine1}
                </RevealWords>
                <RevealWords as="span" className="block" delay={140}>
                  {titleLine2}
                </RevealWords>
              </h1>
              <RevealUp
                as="p"
                delay={380}
                className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {heroBody}
              </RevealUp>
            </div>

            <div className="cine-grade relative h-[320px] overflow-hidden bg-secondary md:h-[380px]">
              {heroImage.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImage}
                  alt="Transmission infrastructure in operation"
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                />
              ) : (
                <Image
                  src={heroImage}
                  alt="Transmission infrastructure in operation"
                  fill
                  className="object-cover grayscale"
                />
              )}
              <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-background/70 via-transparent to-background/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="px-6 pb-16 md:px-12 md:pb-20 lg:px-20">
          <div className="grid gap-10 border-t border-border pt-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
                {dict.projects.regionsEyebrow}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                {introBody}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {dict.projects.introNote}
              </p>
            </div>

            <div className="grid gap-0 text-sm text-muted-foreground">
              {regions.map((region) => (
                <div
                  key={region.label}
                  className="border-b border-border py-5 first:pt-0 last:border-b-0"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-burgundy">
                    {region.label}
                  </p>
                  <p className="mt-2 leading-relaxed">{region.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-brand-navy-soft dark:bg-brand-navy-soft">
        <div className="px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
              {dict.projects.casesEyebrow}
            </p>
            <h2 className="font-hero-slogan text-brand-heading mt-3 max-w-2xl text-2xl font-semibold uppercase tracking-tight md:text-3xl lg:text-4xl">
              {dict.projects.casesTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {dict.projects.casesLead}
            </p>

            <ul className="mt-12 grid gap-0 border-t border-border md:mt-16">
              {dict.projects.cases.map((item, i) => (
                <li
                  key={item.title}
                  className="grid grid-cols-1 gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8 md:py-10"
                >
                  <p className="font-mono text-xs tabular-nums text-muted-foreground md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="md:col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-burgundy">
                      {item.region}
                    </p>
                    <h3 className="mt-2 text-lg font-medium tracking-tight text-brand-navy md:text-xl">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed text-muted-foreground md:col-span-5">
                    {item.detail}
                  </p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-2 md:col-span-3 md:justify-end">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-brand-navy-deep">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-end md:justify-between md:px-12 md:py-20 lg:px-20">
          <div className="max-w-xl">
            <h2 className="font-hero-slogan text-2xl font-semibold uppercase tracking-tight text-brand-cream md:text-3xl">
              {dict.projects.ctaTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-cream/70 md:text-base">
              {dict.projects.ctaBody}
            </p>
          </div>
          <LocaleLink
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center bg-brand-orange px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-navy-deep transition-[filter] hover:brightness-110"
          >
            {dict.projects.ctaButton}
          </LocaleLink>
        </div>
      </section>

      <SiteFooter cms={content.footer} />
    </main>
  );
}
