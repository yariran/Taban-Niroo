import { Header } from "@/components/header";
import { HomeSnapProvider } from "@/components/home-snap-provider";
import { HomeSectionSnap } from "@/components/home-section-snap";
import { HeroSection } from "@/components/sections/hero-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { NewReleaseShowcaseSection } from "@/components/sections/new-release-showcase-section";
import { EngineeringDetailSection } from "@/components/sections/engineering-detail-section";
import { TechnologySection } from "@/components/sections/technology-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { CollectionSection } from "@/components/sections/collection-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { EditorialSection } from "@/components/sections/editorial-section";
import { WhyTabanSection } from "@/components/sections/why-taban-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CEOSection } from "@/components/sections/ceo-section";
import { FooterSection } from "@/components/sections/footer-section";

/**
 * Homepage reveal composition — final cinematic cut.
 *
 * Variant choreography rules applied here:
 *  • No two adjacent sections share the same reveal variant.
 *  • `parallax` is enabled only for sections that do NOT contain
 *    `position: sticky` descendants — PhilosophySection and
 *    GallerySection are intentionally excluded because their internal
 *    sticky-based parallax would break if an ancestor transform ever
 *    created a new containing block.
 *  • The hero sets its own cadence via `HeroSection`; its wrapper is
 *    the only one that claims full viewport height. All subsequent
 *    sections flow at their natural height so scrolling stays smooth.
 */
export default function Home() {
  return (
    <>
      <Header />
      <HomeSnapProvider>
        <main id="main-content">
          <HomeSectionSnap isFirst hideBoundary>
            <HeroSection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={1}
            total={12}
            chapter="New release"
          >
            <NewReleaseShowcaseSection />
          </HomeSectionSnap>

          {/* Philosophy — internal sticky parallax already exists.
              `stickyChild` keeps the entrance to opacity-only so the
              sticky child is never trapped inside a transformed
              ancestor (which would disable sticky positioning). */}
          <HomeSectionSnap
            variant="fade-up"
            stickyChild
            index={2}
            total={12}
            chapter="Philosophy"
          >
            <PhilosophySection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={3}
            total={12}
            chapter="Featured products"
          >
            <FeaturedProductsSection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={4}
            total={12}
            chapter="Engineering DNA"
          >
            <EngineeringDetailSection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={5}
            total={12}
            chapter="Technology"
          >
            <TechnologySection />
          </HomeSectionSnap>

          {/* Gallery — horizontal pin-and-pan depends on an internal
              `position: sticky` element. `stickyChild` restricts the
              entrance to an opacity fade so no ancestor transform ever
              creates a containing block that would cancel the pin. */}
          <HomeSectionSnap
            variant="fade-up"
            stickyChild
            index={6}
            total={12}
            chapter="Gallery"
          >
            <GallerySection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={7}
            total={12}
            chapter="Collection"
          >
            <CollectionSection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={8}
            total={12}
            chapter="History"
          >
            <TimelineSection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={9}
            total={12}
            chapter="On the factory floor"
          >
            <EditorialSection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={10}
            total={12}
            chapter="Why Taban Niroo"
          >
            <WhyTabanSection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={11}
            total={12}
            chapter="Testimonials"
          >
            <TestimonialsSection />
          </HomeSectionSnap>

          <HomeSectionSnap
            variant="fade-up"
            index={12}
            total={12}
            chapter="From the CEO"
          >
            <CEOSection />
          </HomeSectionSnap>

          <HomeSectionSnap compact variant="fade-up" hideBoundary>
            <FooterSection />
          </HomeSectionSnap>
        </main>
      </HomeSnapProvider>
    </>
  );
}
