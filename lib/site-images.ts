/**
 * Central image URLs under /images/ (files in public/images/).
 * Missing files fall back to /placeholder.jpg — keep that file valid binary JPEG.
 */
export const SITE_IMAGES = {
  hero: "/images/hero-main.png",
  technology: "/images/_L7A7232.JPG",
  philosophyLongRod: "/images/Long.jpg",
  philosophyPost: "/images/400kV-Post Hybrid Housing.png",
  projectMap: "/images/partners-map.png",
  projectServices: "/images/project-services-panel.png",
  projectsHero: "/images/hero-main.png",
  productsHero: "/images/hero-main.png",
  testimonials: "/images/About.png",
  ceoPortrait: "/images/ceo-portrait.JPG",
  featured: {
    longRod: "/images/LONGROD_INSULATORS.png",
    post: "/images/PostInsulators.png",
    hybrid: "/images/HYBRIDINSULATORS.png",
    transformerBushings: "/images/TRANSFORMERBUSHINGS.png",
    cableAccessories: "/images/CABLEACCESSORIES.png",
    creepageExtenders: "/images/CREEPAGEEXTENDERSANDCOVERS.png",
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
