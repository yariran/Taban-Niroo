"use client";

import dynamic from "next/dynamic";
import { HomeSectionSnap } from "@/components/home-section-snap";
import type { ContentBlock } from "@/lib/cms-content-types";

/**
 * Below-the-fold home sections — code-split so the first paint only pays
 * for Hero → Featured. Each chunk loads as the user approaches it.
 *
 * The Plant chunk now carries the 3.3 MB manufacturing mp4 behind its own
 * IntersectionObserver, so keeping every one of these on `next/dynamic`
 * matters more than it did before, not less.
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

const MaterialsScrollytellingSection = dynamic(
  () =>
    import("@/components/sections/materials-scrollytelling-section").then(
      (m) => m.MaterialsScrollytellingSection,
    ),
  { loading: () => <SectionSkeleton minH="min-h-[80vh]" /> },
);

const TechnologySection = dynamic(
  () =>
    import("@/components/sections/technology-section").then(
      (m) => m.TechnologySection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const PlantSection = dynamic(
  () =>
    import("@/components/sections/plant-section").then((m) => m.PlantSection),
  { loading: () => <SectionSkeleton minH="min-h-[45vh]" /> },
);

const CollectionSection = dynamic(
  () =>
    import("@/components/sections/collection-section").then(
      (m) => m.CollectionSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const WhyTabanSection = dynamic(
  () =>
    import("@/components/sections/why-taban-section").then(
      (m) => m.WhyTabanSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const CEOSection = dynamic(
  () =>
    import("@/components/sections/ceo-section").then((m) => m.CEOSection),
  { loading: () => <SectionSkeleton minH="min-h-[40vh]" /> },
);

type HomeDeferredProps = {
  engineering?: ContentBlock;
  materials?: ContentBlock;
  technology?: ContentBlock;
  gallery?: ContentBlock;
  collection?: ContentBlock;
  whyTaban?: ContentBlock;
  testimonials?: ContentBlock;
  ceo?: ContentBlock;
};

export function HomeDeferred({
  engineering,
  materials,
  technology,
  gallery,
  collection,
  whyTaban,
  testimonials,
  ceo,
}: HomeDeferredProps) {
  return (
    <>
      {/* ── ACT II tail ─────────────────────────────────────────── */}
      <HomeSectionSnap chapterId="engineering">
        <EngineeringDetailSection cms={engineering} />
      </HomeSectionSnap>

      {/* The three layers Engineering names, told against a held cutaway.
          Sits between the argument and the standards that certify it. */}
      <HomeSectionSnap chapterId="materials">
        <MaterialsScrollytellingSection cms={materials} />
      </HomeSectionSnap>

      <HomeSectionSnap chapterId="technology">
        <TechnologySection cms={technology} />
      </HomeSectionSnap>

      {/* ── ACT III — the evidence ──────────────────────────────── */}
      <HomeSectionSnap chapterId="plant">
        <PlantSection cms={gallery} />
      </HomeSectionSnap>

      <HomeSectionSnap chapterId="installations">
        <CollectionSection cms={collection} />
      </HomeSectionSnap>

      <HomeSectionSnap chapterId="why-taban">
        <WhyTabanSection cms={whyTaban} />
      </HomeSectionSnap>

      <HomeSectionSnap chapterId="ceo">
        <CEOSection cms={ceo} closing={testimonials} withClosing />
      </HomeSectionSnap>
    </>
  );
}
