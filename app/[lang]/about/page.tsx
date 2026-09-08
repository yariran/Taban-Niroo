import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SITE_IMAGES } from "@/lib/site-images";
import { CEOSection } from "@/components/sections/ceo-section";
import { SiteFooter } from "@/components/site-footer";
import { SocialResponsibilitySection } from "@/components/sections/social-responsibility-section";
import { VisionValuesSection } from "@/components/sections/vision-values-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { CompanyChapterIndex } from "@/components/company-section-nav";
import { ChapterRail } from "@/components/chapter-rail";
import { COMPANY_CHAPTERS } from "@/lib/company-chapters";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";
import { CountUp } from "@/components/ui/count-up";
import { getSiteContent } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";
import { pageSocialFor } from "@/lib/seo";
import { localeFromParams } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = await localeFromParams(params);
  return pageSocialFor("about", lang);
}

/** `ChapterRail` takes `title`; the index takes `label`. Same five chapters. */
const COMPANY_RAIL_CHAPTERS = COMPANY_CHAPTERS.map((chapter) => ({
  id: chapter.id,
  title: chapter.label,
}));

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await localeFromParams(params);
  const content = await getSiteContent(lang);
  const hero = content.about?.hero;
  const story = content.about?.story;
  const eyebrow = cmsText(hero, "eyebrow", "About Taban Niroo");
  const titleLine1 = cmsText(hero, "title", "High-voltage expertise.");
  const titleLine2 = cmsText(hero, "titleLine2", "Engineered in Shiraz.");
  const intro = cmsText(
    hero,
    "body",
    "With a legacy spanning more than 20 years, Taban Niroo is a leading name in the Middle East's power sector, specializing in high-voltage transmission solutions and composite insulator manufacturing. Founded in 1997, the company has built its reputation on innovation, quality, and workplace safety.",
  );
  const storyBody = cmsText(
    story,
    "body",
    "Based in the Shiraz Special Economic Zone, Taban Niroo manufactures a full range of medium and high-voltage composite insulators, hybrid insulators, transformer bushings, and accessories for markets across the Middle East, Africa, South America, and Eastern Europe.",
  );
  const heroImage = cmsImage(hero, SITE_IMAGES.hero) ?? SITE_IMAGES.hero;

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SiteHeader />
      <ChapterRail chapters={COMPANY_RAIL_CHAPTERS} />

      {/* Contents strip — first thing on the route, above the story itself.
          Owns the top padding that clears the fixed header. */}
      <div className="px-6 pt-24 md:px-12 md:pt-28 lg:px-20 lg:pt-32">
        <CompanyChapterIndex />
      </div>

      <section id="about-us" data-chapter-id="about-us" className="bg-background">
        <div className="px-6 pt-14 pb-20 md:px-12 md:pt-16 md:pb-24 lg:px-20 lg:pt-20 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                {eyebrow}
              </p>
              <h1 className="mt-4 font-hero-slogan text-brand-heading text-3xl font-bold uppercase tracking-tight md:text-4xl lg:text-5xl">
                <RevealWords as="span" className="block">
                  {titleLine1}
                </RevealWords>
                <RevealWords as="span" className="block" delay={140}>
                  {titleLine2}
                </RevealWords>
              </h1>
              <RevealUp as="p" delay={420} className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {intro}
              </RevealUp>
              <RevealUp as="p" delay={520} className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {storyBody}
              </RevealUp>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-6 border-t border-border pt-8 md:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                    Founded
                  </p>
                  <p className="mt-2 text-xl font-medium text-brand-navy tabular">
                    <CountUp to={1997} duration={1700} />
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                    Projects
                  </p>
                  <p className="mt-2 text-xl font-medium text-brand-navy tabular">
                    <CountUp to={80} prefix="+" />
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                    RATED VOLTAGE
                  </p>
                  <p className="mt-2 text-xl font-medium text-brand-navy tabular">
                    6-1000 kV
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                    Countries
                  </p>
                  <p className="mt-2 text-xl font-medium text-brand-navy tabular">
                    <CountUp to={10} />
                  </p>
                </div>
              </div>
            </div>

            <div className="cine-grade relative h-[320px] overflow-hidden rounded-2xl bg-secondary md:h-[380px]">
              {heroImage.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImage}
                  alt="High-voltage composite insulators at Taban Niroo"
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                />
              ) : (
                <Image
                  src={heroImage}
                  alt="High-voltage composite insulators at Taban Niroo"
                  fill
                  priority
                  className="object-cover grayscale"
                />
              )}
              <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-background/70 via-transparent to-background/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="px-6 pb-8 md:px-12 md:pb-12 lg:px-20 lg:pb-16">
          <div className="grid gap-12 border-t border-border pt-12 lg:grid-cols-3 lg:gap-16">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                Company profile
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Under the leadership of Managing Director Asadollah Zamani, Taban Niroo combines
                engineering discipline with a strong culture of safety and responsibility. Our team
                of skilled specialists and technocrats focuses on long-term performance and dependable
                operation in the field.
              </p>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground lg:col-span-2">
              <p>
                Our core activities include the design and manufacturing of high-voltage electrical
                composite accessories, from distribution and transmission line insulators to station
                post insulators, railway insulators, hybrid insulators, transformer bushings, and
                cable accessories.
              </p>
              <p>
                Taban Niroo’s culture is built around Excellence in Innovation, Leadership by Example,
                Integrity and Transparency, a strong client focus, and an employee-centred approach.
                These principles guide our decisions and ensure that every product is engineered for
                consistent performance over its service life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter order matches COMPANY_CHAPTERS. `data-chapter-id` feeds ChapterRail. */}
      <div data-chapter-id="ceo">
        <CEOSection cms={content.home.ceo} />
      </div>

      <div id="vision" data-chapter-id="vision">
        <VisionValuesSection cms={content.about?.values} />
      </div>

      <div id="history" data-chapter-id="history">
        <TimelineSection cms={content.home.timeline} />
      </div>

      <div id="sustainability" data-chapter-id="sustainability">
        <SocialResponsibilitySection cms={content.about?.social} />
      </div>

      <SiteFooter cms={content.footer} />
    </main>
  );
}

