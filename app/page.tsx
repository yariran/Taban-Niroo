import { SiteHeader } from "@/components/site-header";
import { HomeSnapProvider } from "@/components/home-snap-provider";
import { HomeSectionSnap } from "@/components/home-section-snap";
import { HeroSection } from "@/components/sections/hero-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { HomeDeferred } from "@/components/home-deferred";
import { SiteFooter } from "@/components/site-footer";
import { getSiteContent } from "@/lib/cms-content";

/**
 * Homepage reveal composition — final cinematic cut.
 *
 * Above-the-fold sections load eagerly. Everything from Engineering DNA
 * downward is code-split via `HomeDeferred` so the initial JS/CSS
 * budget stays closer to a brochure page than a twelve-section film.
 *
 * Variant choreography rules:
 *  • No two adjacent sections share the same reveal variant.
 *  • `parallax` is enabled only for sections without sticky descendants.
 *  • The hero is the only full-viewport wrapper; later sections flow
 *    at natural height.
 */
export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <SiteHeader />
      <HomeSnapProvider>
        <main id="main-content">
          <HomeSectionSnap isFirst hideBoundary stickyChild>
            <HeroSection
              cms={content.home.hero}
              newRelease={content.home.newRelease}
            />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="curtain"
            stickyChild
            index={1}
            total={12}
            chapter="Philosophy"
          >
            <PhilosophySection cms={content.home.philosophy} />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="rise"
            index={2}
            total={12}
            chapter="Featured products"
            parallax
          >
            <FeaturedProductsSection cms={content.home.featured} />
          </HomeSectionSnap>

          <HomeDeferred
            engineering={content.home.engineering}
            technology={content.home.technology}
            collection={content.home.collection}
            timeline={content.home.timeline}
            whyTaban={content.home.whyTaban}
            testimonials={content.home.testimonials}
            ceo={content.home.ceo}
          />

          <HomeSectionSnap compact variant="dolly" hideBoundary>
            <SiteFooter cms={content.footer} />
          </HomeSectionSnap>
        </main>
      </HomeSnapProvider>
    </>
  );
}
