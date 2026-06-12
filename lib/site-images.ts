/**
 * Central image URLs under /images/ (files in public/images/).
 * Missing files fall back to /placeholder.jpg — keep that file valid binary JPEG.
 */
export const SITE_IMAGES = {
  hero: "/images/hero-main.png",
  technology: "/images/_L7A7232.JPG",
  philosophyLongRod: "/images/philosophy-long-rod.jpg",
  philosophyPost: "/images/philosophy-post-insulator.png",
  projectMap: "/images/partners-map-light-mode.jpg",
  projectMapDark: "/images/partners-map-dark-mode.jpg",
  projectServices: "/images/project-services-panel.png",
  projectsHero: "/images/hero-main.png",
  productsHero: "/images/hero-main.png",
  testimonials: "/images/About.png",
  ceoPortrait: "/images/ceo-portrait.JPG",
  newRelease: "/images/new-release-line-post-insulator.jpg",
  featured: {
    longRod: "/images/LONGROD_INSULATORS.png",
    post: "/images/featured-post-line-station-railway-v2.jpg",
    hybrid: "/images/featured-hybrid-post-insulators-v2.jpg",
    transformerBushings: "/images/TRANSFORMERBUSHINGS.png",
    hollowCoreBushing: "/images/featured-hollow-core-bushing.jpg",
    cableAccessories: "/images/featured-cable-accessories-home.jpg",
    creepageExtenders: "/images/featured-creepage-extenders.png",
  },
  gallery: [
    "/images/_MG_0401.jpg",
    "/images/_MP_1268.jpg",
    "/images/_MP_1500.jpg",
    "/images/2X3B5599E copy.jpg",
    "/images/_MG_0387.jpg",
    "/images/DSC09974.jpg",
    "/images/_MP_1454.jpg",
    "/images/_MP_1312.jpg",
    "/images/gallery-factory-insulators.jpg",
    "/images/gallery-substation-insulators.jpg",
  ] as const,
  collection: {
    phaseSpacers: "/images/_MG_0387.jpg",
    creepageExtenders: "/images/CREEPAGEEXTENDERSANDCOVERS.png",
    cutOutFuse: "/images/CABLEACCESSORIES.png",
    surgeArrester: "/images/CABLEACCESSORIES.png",
    wireCovers: "/images/CREEPAGEEXTENDERSANDCOVERS.png",
    birdControl: "/images/CREEPAGEEXTENDERSANDCOVERS.png",
  },
} as const;
