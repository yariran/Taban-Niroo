import { SiteHeader } from "@/components/site-header";
import { HomeSnapProvider } from "@/components/home-snap-provider";
import { HomeSectionSnap } from "@/components/home-section-snap";
import { ChapterRail } from "@/components/chapter-rail";
import { HeroSection } from "@/components/sections/hero-section";
import { ProofBandSection } from "@/components/sections/proof-band-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { HomeDeferred } from "@/components/home-deferred";
import { SiteFooter } from "@/components/site-footer";
import { getSiteContent } from "@/lib/cms-content";
import { HOME_CHAPTERS } from "@/lib/home-chapters";
import { localeFromParams } from "@/lib/i18n";
import { pageSocialFor } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = await localeFromParams(params);
  return pageSocialFor("home", lang);
}

/**
 * Home page — ten chapters in three acts.
 *
 *   ACT I   Who we are            Hero · Proof
 *   ACT II  What we make, and why Philosophy · Featured · Engineering · Technology
 *   ACT III Proof                 Plant · Footprint · Why Taban · CEO
 *
 * Motion is NOT configured here. Each section applies the three roles
 * from `lib/motion-roles.ts` to its own content, inside a `<Beat>` that
 * gives the section one shared clock. The wrapper below contributes
 * structure only.
 *
 * That is a deliberate reversal. This file used to declare a per-section
 * `variant` under the rule "no two adjacent sections share the same
 * reveal variant" — a rule about avoiding repetition rather than about
 * meaning, which is exactly what made the page read as generated. The
 * grammar now repeats on purpose: a language is three words used many
 * times, not nine words used once each.
 *
 * Chapter ids come from `HOME_CHAPTERS`, whose array order is the page
 * order and the rail numbering, so those three can no longer disagree.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await localeFromParams(params);
  const content = await getSiteContent(lang);
  const railChapters = HOME_CHAPTERS.map((c) => ({
    id: c.id,
    title: c.label,
    act: c.act,
  }));

  return (
    <>
      <SiteHeader />
      <ChapterRail chapters={railChapters} />
      <HomeSnapProvider>
        <main id="main-content">
          {/* ── ACT I ─────────────────────────────────────────────── */}
          <HomeSectionSnap isFirst hideBoundary chapterId="hero">
            <HeroSection
              cms={content.home.hero}
              newRelease={content.home.newRelease}
            />
          </HomeSectionSnap>

          {/* Proof before narrative — the credibility numbers land in the
              first scroll, not at section ten. */}
          <HomeSectionSnap hideBoundary chapterId="proof">
            <ProofBandSection
              cms={content.home.proof}
              legacy={content.home.whyTaban}
            />
          </HomeSectionSnap>

          {/* ── ACT II ────────────────────────────────────────────── */}
          <HomeSectionSnap chapterId="philosophy">
            <PhilosophySection cms={content.home.philosophy} />
          </HomeSectionSnap>

          <HomeSectionSnap chapterId="featured-products">
            <FeaturedProductsSection cms={content.home.featured} />
          </HomeSectionSnap>

          {/* ── ACT II tail + ACT III, code-split ─────────────────── */}
          <HomeDeferred
            engineering={content.home.engineering}
            materials={content.home.materials}
            technology={content.home.technology}
            gallery={content.home.gallery}
            collection={content.home.collection}
            whyTaban={content.home.whyTaban}
            testimonials={content.home.testimonials}
            ceo={content.home.ceo}
          />

          {/* No chapter and no role: the tail going quiet is the contrast
              that makes the rest of the page read as chosen. */}
          <HomeSectionSnap hideBoundary>
            <SiteFooter cms={content.footer} />
          </HomeSectionSnap>
        </main>
      </HomeSnapProvider>
    </>
  );
}
