/**
 * Central image URLs under /images/ (files in public/images/).
 * Missing files fall back to /placeholder.jpg — keep that file valid binary JPEG.
 */
export const SITE_IMAGES = {
  hero: "/images/hero-main.jpg",
  technology: "/images/_L7A7232.JPG",
  philosophyLongRod: "/images/philosophy-long-rod.jpg",
  philosophyPost: "/images/philosophy-post-insulator.png",
  projectMap: "/images/partners-map-light-mode.jpg",
  projectMapDark: "/images/partners-map-dark-mode.jpg",
  projectServices: "/images/project-services-panel.png",
  projectsHero: "/images/hero-main.jpg",
  productsHero: "/images/hero-main.jpg",
  testimonials: "/images/About.jpg",
  ceoPortrait: "/images/ceo-portrait.JPG",
  newRelease: "/images/new-release-line-post-insulator.jpg",
  featured: {
    longRod: "/images/LONGROD_INSULATORS.jpg",
    post: "/images/featured-post-line-station-railway-v3.jpg",
    hybrid: "/images/featured-hybrid-post-insulators-v2.jpg",
    transformerBushings: "/images/TRANSFORMERBUSHINGS.png",
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
      src: "/images/product-gallery-cutout-fuses.png",
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
