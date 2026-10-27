/**
 * Central image URLs under /images/ (files in public/images/).
 * Missing files fall back to /placeholder.jpg — keep that file valid binary JPEG.
 */
export const SITE_IMAGES = {
  hero: "/images/hero-main.jpg",
  technology: "/images/technology-plate-v2.jpg",
  philosophyLongRod: "/images/philosophy-long-rod-v2.jpg",
  philosophyPost: "/images/philosophy-post-insulator-v2.png",
  /**
   * Blog R&D — Pollution performance cinema runway.
   * Intro plate is separate so the title beat does not reuse criterion 01.
   * Then one plate per IEC 60815-3 criterion, in order 01–06.
   */
  pollutionCriteriaIntro: "/images/rnd/pollution-00-intro.jpg",
  pollutionCriteria: [
    "/images/rnd/pollution-01-alternating-shed.jpg",
    "/images/rnd/pollution-02-spacing-overhang.jpg",
    "/images/rnd/pollution-03-minimum-distance-v2.jpg",
    "/images/rnd/pollution-04-creepage-clearance.jpg",
    "/images/rnd/pollution-05-shed-angle.jpg",
    "/images/rnd/pollution-06-creepage-factor.jpg",
  ] as const,
  projectMap: "/images/partners-map-light-mode.jpg",
  projectMapDark: "/images/partners-map-dark-mode.jpg",
  projectServices: "/images/project-services-panel.png",
  projectsHero: "/images/hero-main.jpg",
  aboutHero: "/images/about-hero-towers.jpg",
  testimonials: "/images/ceo-closing-factory-v2.jpg",
  ceoPortrait: "/images/ceo-letter-portrait-v5.jpg",
  newRelease: "/images/new-release-line-post-insulator.jpg",
  featured: {
    longRod: "/images/featured-long-rod-v2.jpg",
    post: "/images/featured-post-insulators-v5.jpg",
    hybrid: "/images/featured-hybrid-post-insulators-v2.jpg",
    transformerBushings: "/images/featured-transformer-bushings-v2.jpg",
    hollowCoreBushing: "/images/featured-hollow-core-bushing.jpg",
    cableAccessories: "/images/featured-cable-accessories-home.jpg",
    creepageExtenders: "/images/featured-creepage-extenders.jpg",
  },
  gallery: [
    "/images/_MG_0401.jpg",
    "/images/_MP_1500.jpg",
    "/images/2X3B5599E-copy.jpg",
    "/images/_MG_0387.jpg",
    "/images/_MP_1454.jpg",
    "/images/_MP_1312.jpg",
  ] as const,
  /**
   * Product gallery — horizontal pan rail. Add entries with `src` + descriptive
   * `alt` (helps Google Images). Drop files into /public/images first.
   */
  productGallery: [
    {
      src: "/images/product-gallery-phase-spacer.png",
      alt: "Phase to phase spacer for overhead transmission lines",
    },
    {
      src: "/images/product-gallery-cutout-fuses-v2.png",
      alt: "Composite cutout fuses Type A and Type B",
    },
    {
      src: "/images/product-gallery-post-insulators.png",
      alt: "High-voltage composite post insulators",
    },
  ] as const,
  collection: {
    phaseSpacers: "/images/_MG_0387.jpg",
    creepageExtenders: "/images/CREEPAGEEXTENDERSANDCOVERS.jpg",
    cutOutFuse: "/images/CABLEACCESSORIES.png",
    surgeArrester: "/images/CABLEACCESSORIES.png",
    wireCovers: "/images/CREEPAGEEXTENDERSANDCOVERS.jpg",
    birdControl: "/images/CREEPAGEEXTENDERSANDCOVERS.jpg",
  },
} as const;
