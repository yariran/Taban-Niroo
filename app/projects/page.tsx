import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SITE_IMAGES } from "@/lib/site-images";
import { SiteFooter } from "@/components/site-footer";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";
import { getSiteContent } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";
import { pageSocial } from "@/lib/seo";

export const metadata: Metadata = pageSocial({
  title: "Projects & partners",
  description:
    "Taban Niroo insulators in transmission and distribution projects across the Middle East, Africa, and South America.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const content = await getSiteContent();
  const hero = content.projects?.hero;
  const intro = content.projects?.intro;
  const eyebrow = cmsText(hero, "eyebrow", "Projects & partners");
  const titleLine1 = cmsText(hero, "title", "Power transmission.");
  const titleLine2 = cmsText(hero, "ctaLabel", "Regional reach.");
  const heroBody = cmsText(
    hero,
    "body",
    "Taban Niroo supports high-voltage projects across the Middle East, Africa, and South America. Our composite and hybrid insulators are installed on overhead lines and in substations in demanding climatic and pollution conditions.",
  );
  const introBody = cmsText(
    intro,
    "body",
    "Taban Niroo products are installed in projects across Africa, South America, the Middle East, and parts of Europe. We support utilities and industrial partners in both new-build and retrofit applications.",
  );
  const heroImage =
    cmsImage(hero, SITE_IMAGES.projectsHero) ?? SITE_IMAGES.projectsHero;

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-background">
        <div className="px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-24 lg:px-20 lg:pt-36 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
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
              <RevealUp
                as="p"
                delay={380}
                className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {heroBody}
              </RevealUp>
            </div>

            <div className="cine-grade relative h-[320px] overflow-hidden rounded-2xl bg-secondary md:h-[380px]">
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
        <div className="px-6 pb-24 md:px-12 md:pb-28 lg:px-20 lg:pb-32">
          <div className="grid gap-10 border-t border-border pt-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                {cmsText(intro, "eyebrow", "Regions served")}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                {introBody}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Experience in different grid configurations, voltage levels, and environmental
                conditions allows our engineering teams to help select appropriate insulator designs
                and creepage distances for each project.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-muted-foreground">
              {(
                content.projects?.regions?.items?.length &&
                content.projects.regions.items.some((i) => i.label.trim())
                  ? content.projects.regions.items
                  : [
                      {
                        label: "Africa",
                        body: "Projects in Liberia, Morocco, Ghana, and Somalia, supporting overhead transmission and distribution networks.",
                      },
                      {
                        label: "South America & Europe",
                        body: "Installations in Peru and Colombia, as well as projects in Greece, using composite and hybrid solutions tailored to local requirements.",
                      },
                      {
                        label: "Middle East & Asia",
                        body: "Projects in Iraq and Afghanistan, together with extensive experience in Iran’s transmission network, across a range of voltage classes.",
                      },
                    ]
              ).map((region) => (
                <div
                  key={region.label}
                  className="rounded-xl border border-border/70 bg-background/70 p-4"
                >
                  <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                    {region.label}
                  </p>
                  <p className="mt-2">{region.body || region.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter cms={content.footer} />
    </main>
  );
}

