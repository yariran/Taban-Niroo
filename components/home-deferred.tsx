"use client";

import dynamic from "next/dynamic";
import { HomeSectionSnap } from "@/components/home-section-snap";
import type { ContentBlock } from "@/lib/cms-content-types";

/**
 * Below-the-fold home sections — code-split so the first paint only
 * pays for Hero → Featured. Each chunk loads as the user approaches
 * (or immediately after hydration for SSR HTML).
 */

function SectionSkeleton({ minH = "min-h-[50vh]" }: { minH?: string }) {
  return <div className={`w-full ${minH}`} aria-hidden />;
}

const EngineeringDetailSection = dynamic(
  () =>
    import("@/components/sections/engineering-detail-section").then(
      (m) => m.EngineeringDetailSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const TechnologySection = dynamic(
  () =>
    import("@/components/sections/technology-section").then(
      (m) => m.TechnologySection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const GallerySection = dynamic(
  () =>
    import("@/components/sections/gallery-section").then(
      (m) => m.GallerySection,
    ),
  { loading: () => <SectionSkeleton minH="min-h-[40vh]" /> },
);

const CollectionSection = dynamic(
  () =>
    import("@/components/sections/collection-section").then(
      (m) => m.CollectionSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const TimelineSection = dynamic(
  () =>
    import("@/components/sections/timeline-section").then(
      (m) => m.TimelineSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const EditorialSection = dynamic(
  () =>
    import("@/components/sections/editorial-section").then(
      (m) => m.EditorialSection,
    ),
  { loading: () => <SectionSkeleton minH="min-h-[45vh]" /> },
);

const WhyTabanSection = dynamic(
  () =>
    import("@/components/sections/why-taban-section").then(
      (m) => m.WhyTabanSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/testimonials-section").then(
      (m) => m.TestimonialsSection,
    ),
  { loading: () => <SectionSkeleton minH="min-h-[35vh]" /> },
);

const CEOSection = dynamic(
  () =>
    import("@/components/sections/ceo-section").then((m) => m.CEOSection),
  { loading: () => <SectionSkeleton minH="min-h-[40vh]" /> },
);

type HomeDeferredProps = {
  engineering?: ContentBlock;
  technology?: ContentBlock;
  collection?: ContentBlock;
  timeline?: ContentBlock;
  whyTaban?: ContentBlock;
  testimonials?: ContentBlock;
  ceo?: ContentBlock;
};

export function HomeDeferred({
  engineering,
  technology,
  collection,
  timeline,
  whyTaban,
  testimonials,
  ceo,
}: HomeDeferredProps) {
  return (
    <>
      <HomeSectionSnap
        variant="dolly"
        index={4}
        total={12}
        chapter="Engineering DNA"
        parallax
      >
        <EngineeringDetailSection cms={engineering} />
      </HomeSectionSnap>

      <HomeSectionSnap
        variant="zoom"
        index={5}
        total={12}
        chapter="Technology"
      >
        <TechnologySection cms={technology} />
      </HomeSectionSnap>

      <HomeSectionSnap
        compact
        hideBoundary
        index={6}
        total={12}
        chapter="Gallery"
      >
        <GallerySection />
      </HomeSectionSnap>

      <HomeSectionSnap
        variant="iris"
        index={7}
        total={12}
        chapter="Collection"
        compact
        hideBoundary
        className="h-[100svh] max-h-[100svh]"
      >
        <CollectionSection cms={collection} />
      </HomeSectionSnap>

      <HomeSectionSnap
        variant="tilt-top"
        index={8}
        total={12}
        chapter="History"
      >
        <TimelineSection cms={timeline} />
      </HomeSectionSnap>

      <HomeSectionSnap
        variant="focus-pull"
        index={9}
        total={12}
        chapter="On the factory floor"
      >
        <EditorialSection />
      </HomeSectionSnap>

      <HomeSectionSnap
        variant="veil"
        index={10}
        total={12}
        chapter="Why Taban Niroo"
        parallax
      >
        <WhyTabanSection cms={whyTaban} />
      </HomeSectionSnap>

      <HomeSectionSnap
        variant="fade-up"
        index={11}
        total={12}
        chapter="Testimonials"
      >
        <TestimonialsSection cms={testimonials} />
      </HomeSectionSnap>

      <HomeSectionSnap
        variant="rise"
        index={12}
        total={12}
        chapter="From the CEO"
      >
        <CEOSection cms={ceo} />
      </HomeSectionSnap>
    </>
  );
}
