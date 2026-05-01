/**
 * Single source of truth for the Taban Niroo catalogue.
 *
 * The product list and shapes used to live inline in
 * `components/products/product-catalog-section.tsx` (1,000+ lines, the
 * data and the UI married). Centralising the data here lets:
 *
 *   • The catalogue grid (existing card / modal flow) keep its job.
 *   • Each product get its own indexable URL via
 *     `app/products/[slug]/page.tsx` (generateStaticParams + structured
 *     data + dynamic OG).
 *   • The dynamic sitemap know about every product without manual sync.
 *
 * Shapes mirror what the catalogue UI already expects so this refactor
 * is purely additive — no consumer needs to change.
 */

export type ProductTechnicalRow = {
  shedNo?: string;
  ratedVoltage?: string;
  sml?: string;
  couplingSize?: string;
  sectionLength?: string;
  arcingDistance?: string;
  shedDiameter?: string;
  shedSpacing?: string;
  minimumCreepage?: string;
  impulseWithstand?: string;
  wetWithstand?: string;
  weight?: string;
};

export type ProductVariant = {
  code: string;
  voltage: string;
  sectionLength?: string;
  creepage?: string;
  notes?: string;
  technical?: ProductTechnicalRow;
};

export type ProductFamilyId =
  | "Silicone Composite Insulators"
  | "Hybrid Insulators"
  | "Transformer Bushings"
  | "Cable Accessories"
  | "Overhead Feeder Line Composite"
  | "Creepage Extenders & Covers";

export type Product = {
  /** Stable kebab-case slug used in URLs. */
  id: string;
  name: string;
  family: ProductFamilyId;
  subFamily: string;
  catalogueRef: string;
  summary: string;
  applications: string;
  voltageClass?: string;
  standard?: string;
  /** Optional product image in `/public/images/...`. */
  image?: string | null;
  /** Sort key inside its family (existing semantics). */
  order: number;
  variants?: ProductVariant[];
};

/** Family metadata. */
export const FAMILY_ORDER: readonly ProductFamilyId[] = [
  "Silicone Composite Insulators",
  "Hybrid Insulators",
  "Transformer Bushings",
  "Cable Accessories",
  "Overhead Feeder Line Composite",
  "Creepage Extenders & Covers",
] as const;

export const FAMILY_INDEX: Record<ProductFamilyId, string> = {
  "Silicone Composite Insulators": "01",
  "Hybrid Insulators": "02",
  "Transformer Bushings": "03",
  "Cable Accessories": "04",
  "Overhead Feeder Line Composite": "05",
  "Creepage Extenders & Covers": "06",
};

export const FAMILY_SHORT: Record<ProductFamilyId, string> = {
  "Silicone Composite Insulators": "Composite",
  "Hybrid Insulators": "Hybrid",
  "Transformer Bushings": "Bushings",
  "Cable Accessories": "Cable",
  "Overhead Feeder Line Composite": "Feeder line",
  "Creepage Extenders & Covers": "Creepage",
};

export const FAMILY_ANCHOR: Record<ProductFamilyId, string> = {
  "Silicone Composite Insulators": "cat-silicone-composite-insulators",
  "Hybrid Insulators": "cat-hybrid-insulators",
  "Transformer Bushings": "cat-transformer-bushings",
  "Cable Accessories": "cat-cable-accessories",
  "Overhead Feeder Line Composite": "cat-overhead-feeder",
  "Creepage Extenders & Covers": "cat-creepage-extenders",
};

export const FAMILY_THUMBNAIL: Record<ProductFamilyId, string> = {
  "Silicone Composite Insulators": "/images/LONGROD_INSULATORS.png",
  "Hybrid Insulators": "/images/HYBRIDINSULATORS.png",
  "Transformer Bushings": "/images/TRANSFORMERBUSHINGS.png",
  "Cable Accessories": "/images/CABLEACCESSORIES.png",
  "Overhead Feeder Line Composite": "/images/CABLEACCESSORIES.png",
  "Creepage Extenders & Covers": "/images/CREEPAGEEXTENDERSANDCOVERS.png",
};

/**
 * Catalogue. Migrated 1:1 from `product-catalog-section.tsx`.
 */
export const PRODUCTS: readonly Product[] = [
  // ── 01 · Silicone Composite Insulators ──
  {
    id: "long-rod-distribution",
    name: "Distribution Network Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Long Rod Insulator",
    catalogueRef: "DPL-20 · DPL-33 series",
    summary:
      "Composite long rod insulator for medium-voltage distribution networks. HTV silicone housing over an ECR fiberglass core with hot-dip galvanized forged-steel end fittings.",
    applications: "Medium-voltage distribution lines",
    voltageClass: "20 – 33 kV",
    standard: "IEC 61109 · IEC 61466 · IEC 60120 / 60471",
    image: null,
    order: 11,
  },
  {
    id: "long-rod-transmission",
    name: "Transmission Network Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Long Rod Insulator",
    catalogueRef: "DPL 63 · 132 · 230 · 400 series",
    summary:
      "High-strength composite long rod for transmission corridors up to 400 kV. Homogenized electrical field across end fittings and sealed triple-junction point against moisture infiltration.",
    applications: "Transmission lines · Suspension & tension",
    voltageClass: "63 – 400 kV",
    standard: "IEC 61109 · IEC 61192",
    image: null,
    order: 12,
  },
  {
    id: "interphase-spacer-mv",
    name: "Interphase Spacer — Medium Voltage",
    family: "Silicone Composite Insulators",
    subFamily: "Interphase Spacer",
    catalogueRef: "DPL MV · phase-to-phase",
    summary:
      "Medium-voltage phase-to-phase composite spacer with armour grip suspension. Prevents flashover between conductors under galloping, wind and ice loading.",
    applications: "Distribution line galloping control",
    voltageClass: "up to 33 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 21,
  },
  {
    id: "interphase-spacer-hv",
    name: "Interphase Spacer — High Voltage",
    family: "Silicone Composite Insulators",
    subFamily: "Interphase Spacer",
    catalogueRef: "DPL 63 · 132 · 230 · 400 T.T",
    summary:
      "High-voltage phase-to-phase composite spacer. Stabilizes line geometry on long spans, controls galloping amplitude and maintains electrical clearance to earthed structures.",
    applications: "Transmission line spacer · AGS mounted",
    voltageClass: "66 – 400 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 22,
    variants: [
      { code: "DPL 63 T.T", voltage: "63 kV", notes: "Phase-to-phase spacer" },
      { code: "DPL 132 T.T", voltage: "132 kV", notes: "Phase-to-phase spacer" },
      { code: "DPL 230 T.T", voltage: "230 kV", notes: "Phase-to-phase spacer" },
      { code: "DPL 400 T.T", voltage: "400 kV", notes: "Phase-to-phase spacer" },
    ],
  },
  {
    id: "line-post-pin-type",
    name: "Line Post Insulator (Pin-Type)",
    family: "Silicone Composite Insulators",
    subFamily: "Composite Post",
    catalogueRef: "DPL 20-550/620/700 · DPL 33-980/1180/1440",
    summary:
      "Composite pin-type line post for distribution hardware. Large-diameter FRP core absorbs cantilever and bending loads while the silicone housing maintains hydrophobicity.",
    applications: "Distribution line post",
    voltageClass: "20 – 33 kV",
    standard: "IEC 61109 · IEC 62217 · IEC 60120",
    image: null,
    order: 31,
    variants: [
      { code: "DPL 20-550", voltage: "20 kV", sectionLength: "550 mm" },
      { code: "DPL 20-620", voltage: "20 kV", sectionLength: "620 mm" },
      { code: "DPL 20-700", voltage: "20 kV", sectionLength: "700 mm" },
      { code: "DPL 33-980", voltage: "33 kV", sectionLength: "980 mm" },
      { code: "DPL 33-1180", voltage: "33 kV", sectionLength: "1180 mm" },
      { code: "DPL 33-1440", voltage: "33 kV", sectionLength: "1440 mm" },
    ],
  },
  {
    id: "line-post-cross-arm",
    name: "Line Post Insulator (Cross-Arm)",
    family: "Silicone Composite Insulators",
    subFamily: "Composite Post",
    catalogueRef: "Cross-arm line post",
    summary:
      "Insulated cross-arm geometry for compact line configurations. Enables voltage upgrades inside existing corridors and reduces right-of-way requirements.",
    applications: "Compact lines · Urban & forest ROW",
    voltageClass: "20 · 33 · 63 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 32,
    variants: [
      { code: "DPL 20 CA", voltage: "20 kV", notes: "Cross-arm class" },
      { code: "DPL 33 CA", voltage: "33 kV", notes: "Cross-arm class" },
      { code: "DPL 63 CA", voltage: "63 kV", notes: "Cross-arm class" },
    ],
  },
  {
    id: "line-post-pivot-type",
    name: "Line Post Insulator (Pivot Type)",
    family: "Silicone Composite Insulators",
    subFamily: "Composite Post",
    catalogueRef: "DPL 63-2340 · 132-4520 · 230-9860 · 400-14120 LP",
    summary:
      "Pivot-type line post engineered for high-voltage overhead lines with fluctuating conductor angles. Combines silicone and fiberglass for severe outdoor duty.",
    applications: "HV overhead lines · Flexible angles",
    voltageClass: "63 – 400 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 33,
    variants: [
      { code: "DPL 63-2340 LP", voltage: "63 kV", sectionLength: "2340 mm" },
      { code: "DPL 132-4520 LP", voltage: "132 kV", sectionLength: "4520 mm" },
      { code: "DPL 230-9860 LP", voltage: "230 kV", sectionLength: "9860 mm" },
      { code: "DPL 400-14120 LP", voltage: "400 kV", sectionLength: "14120 mm" },
    ],
  },
  {
    id: "station-post-insulator",
    name: "Station Post Insulator",
    family: "Silicone Composite Insulators",
    subFamily: "Composite Post",
    catalogueRef: "DPL 173/204/325/650/1050/1550 PI",
    summary:
      "Busbar and station-class post insulator for substation mechanical support combined with electrical insulation duty up to 420 kV.",
    applications: "Substation busbar · Station post",
    voltageClass: "20 – 400 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 34,
    variants: [
      { code: "DPL 173 PI", voltage: "up to 52 kV", sectionLength: "173 mm" },
      { code: "DPL 204 PI", voltage: "up to 72.5 kV", sectionLength: "204 mm" },
      { code: "DPL 325 PI", voltage: "up to 123 kV", sectionLength: "325 mm" },
      { code: "DPL 650 PI", voltage: "up to 170 kV", sectionLength: "650 mm" },
      { code: "DPL 1050 PI", voltage: "up to 245 kV", sectionLength: "1050 mm" },
      { code: "DPL 1550 PI", voltage: "up to 420 kV", sectionLength: "1550 mm" },
    ],
  },
  {
    id: "railway-insulator-type-1",
    name: "Railway Insulator — Type 1",
    family: "Silicone Composite Insulators",
    subFamily: "Railway",
    catalogueRef: "Railway Type 1 · 610 / 770 mm",
    summary:
      "Type 1 composite railway insulator for electrified catenary. Short section length with 6 – 8 kN cantilever and 60 – 80 kN tension rating.",
    applications: "Railway catenary · Type 1",
    voltageClass: "25 kV AC",
    standard: "Railway IEC standards",
    image: null,
    order: 41,
    variants: [
      { code: "DPL Railway T1-610", voltage: "25 kV AC", sectionLength: "610 mm", notes: "6 kN cantilever · 60 kN tension" },
      { code: "DPL Railway T1-770", voltage: "25 kV AC", sectionLength: "770 mm", notes: "8 kN cantilever · 80 kN tension" },
    ],
  },
  {
    id: "railway-insulator-type-2",
    name: "Railway Insulator — Type 2",
    family: "Silicone Composite Insulators",
    subFamily: "Railway",
    catalogueRef: "Railway Type 2 · 820 mm",
    summary:
      "Type 2 railway insulator with increased section length and 12 kN cantilever / 100 kN tension load. Creepage 1400 mm for medium pollution routes.",
    applications: "Railway catenary · Type 2",
    voltageClass: "25 kV AC",
    standard: "Railway IEC standards",
    image: null,
    order: 42,
    variants: [
      { code: "DPL Railway T2-820", voltage: "25 kV AC", sectionLength: "820 mm", creepage: "1400 mm", notes: "12 kN cantilever · 100 kN tension" },
    ],
  },
  {
    id: "railway-insulator-type-3",
    name: "Railway Insulator — Type 3",
    family: "Silicone Composite Insulators",
    subFamily: "Railway",
    catalogueRef: "Railway Type 3 · 880 mm",
    summary:
      "Heavy-duty Type 3 railway insulator with 16 kN cantilever and 120 kN tension load. 8,000 N·m torsion rating for severe dynamic rail duty.",
    applications: "Railway catenary · Type 3 heavy duty",
    voltageClass: "25 kV AC",
    standard: "Railway IEC standards",
    image: null,
    order: 43,
    variants: [
      { code: "DPL Railway T3-880", voltage: "25 kV AC", sectionLength: "880 mm", notes: "16 kN cantilever · 120 kN tension · 8,000 N·m torsion" },
    ],
  },

  // ── 02 · Hybrid Insulators (Silicone – Ceramic) ──
  {
    id: "hybrid-pin-type",
    name: "Hybrid Pin-Type Insulator",
    family: "Hybrid Insulators",
    subFamily: "Silicone – Ceramic",
    catalogueRef: "DPL 20-760/790/880 · DPL 33-990/1080",
    summary:
      "Hybrid line post combining the mechanical rigidity of a porcelain core with silicone hydrophobicity. Patented Taban Niroo family engineered for polluted environments.",
    applications: "Distribution pin-type · Polluted zones",
    voltageClass: "20 – 33 kV",
    standard: "IEC 62896 · IEC 62217 · IEC 60383-1",
    image: null,
    order: 11,
    variants: [
      { code: "DPL 20-760 H-L", voltage: "20 kV", sectionLength: "760 mm" },
      { code: "DPL 20-790 H-L", voltage: "20 kV", sectionLength: "790 mm" },
      { code: "DPL 20-880 H-P", voltage: "20 kV", sectionLength: "880 mm" },
      { code: "DPL 33-990 H-L", voltage: "33 kV", sectionLength: "990 mm" },
      { code: "DPL 33-1080 H-P", voltage: "33 kV", sectionLength: "1080 mm" },
    ],
  },
  {
    id: "hybrid-post",
    name: "Hybrid Post Insulator",
    family: "Hybrid Insulators",
    subFamily: "Silicone – Ceramic",
    catalogueRef: "DPL 325 · 650 · 1050 · 1800 HPI",
    summary:
      "Station-class hybrid post with porcelain core and silicone housing. Thinner sheds, extended creepage and superior pollution performance for industrial, desert and coastal sites.",
    applications: "Substation post · Industrial · Coastal",
    voltageClass: "63 – 400 kV",
    standard: "IEC 61109 · IEC 62217",
    image: null,
    order: 12,
    variants: [
      { code: "DPL 325 HPI", voltage: "up to 123 kV", sectionLength: "325 mm" },
      { code: "DPL 650 HPI", voltage: "up to 170 kV", sectionLength: "650 mm" },
      { code: "DPL 1050 HPI", voltage: "up to 245 kV", sectionLength: "1050 mm" },
      { code: "DPL 1800 HPI", voltage: "up to 420 kV", sectionLength: "1800 mm" },
    ],
  },

  // ── 03 · Transformer Bushings ──
  {
    id: "polymer-bushing",
    name: "Polymer Bushing",
    family: "Transformer Bushings",
    subFamily: "Polymer",
    catalogueRef: "DPL 11-510 · 20-828 · 33-1180 · 52-1570 B",
    summary:
      "Lightweight silicone-housed transformer bushing with excellent anti-pollution, anti-UV and explosion-resistant performance. No surface coating or regular washing required.",
    applications: "Transformer interface · Switchgear",
    voltageClass: "11 – 52 kV",
    standard: "IEC 60137",
    image: null,
    order: 11,
    variants: [
      { code: "DPL 11-510 B", voltage: "11 kV", sectionLength: "510 mm" },
      { code: "DPL 20-828 B", voltage: "20 kV", sectionLength: "828 mm" },
      { code: "DPL 33-1180 B", voltage: "33 kV", sectionLength: "1180 mm" },
      { code: "DPL 52-1570 B", voltage: "52 kV", sectionLength: "1570 mm" },
    ],
  },
  {
    id: "station-post-hybrid-bushing-ceramic",
    name: "Station Post Hybrid Bushing — Silicone-Ceramic",
    family: "Transformer Bushings",
    subFamily: "Station Post Hybrid",
    catalogueRef: "DPL 20-690 · 33-1012 PB (ceramic)",
    summary:
      "Hybrid bushing combining porcelain and silicone for station posts, power transformers and circuit breakers. UV and pollution resistant with reduced flashover risk.",
    applications: "Substation · Power transformer",
    voltageClass: "20 – 33 kV",
    standard: "IEC 60137",
    image: null,
    order: 21,
    variants: [
      { code: "DPL 20-690 PB", voltage: "20 kV", sectionLength: "690 mm" },
      { code: "DPL 33-1012 PB", voltage: "33 kV", sectionLength: "1012 mm" },
    ],
  },
  {
    id: "station-post-hybrid-bushing-resin",
    name: "Station Post Hybrid Bushing — Silicone-Resin",
    family: "Transformer Bushings",
    subFamily: "Station Post Hybrid",
    catalogueRef: "DPL 20-860-630 · 33-1430-630",
    summary:
      "Silicone-resin variant of the station post hybrid bushing for indoor / outdoor substations with long operational life and low maintenance.",
    applications: "Indoor · Outdoor substations",
    voltageClass: "20 – 33 kV",
    standard: "IEC 60137",
    image: null,
    order: 22,
    variants: [
      { code: "DPL 20-860-630", voltage: "20 kV", sectionLength: "860 mm", notes: "Lower section 630 mm" },
      { code: "DPL 33-1430-630", voltage: "33 kV", sectionLength: "1430 mm", notes: "Lower section 630 mm" },
    ],
  },
  {
    id: "plug-in-bushing",
    name: "Plug In Bushing",
    family: "Transformer Bushings",
    subFamily: "Plug In",
    catalogueRef: "Plug in bushing",
    summary:
      "Plug-in transformer bushing for compact switchgear and transformer interfaces. Quick installation geometry and reliable sealing against moisture and dust.",
    applications: "Compact switchgear · Transformer plug-in",
    voltageClass: "up to 52 kV",
    standard: "IEC 60137",
    image: null,
    order: 31,
  },
  {
    id: "hollow-core-insulator",
    name: "Hollow Core Insulator",
    family: "Transformer Bushings",
    subFamily: "Hollow Core",
    catalogueRef: "Hollow core insulator",
    summary:
      "Silicone-housed hollow core insulator for instrument transformers, circuit breakers and bushings. Explosion-resistant profile with homogeneous electrical field distribution.",
    applications: "Instrument transformers · Circuit breakers",
    voltageClass: "up to 420 kV",
    standard: "IEC 60137 · IEC 62155",
    image: null,
    order: 41,
  },

  // ── 04 · Cable Accessories ──
  {
    id: "outdoor-termination",
    name: "Outdoor Termination",
    family: "Cable Accessories",
    subFamily: "Terminations",
    catalogueRef: "DPL-TS063 · TS0132 · TS0230",
    summary:
      "Outdoor termination for high-voltage underground cables connecting to overhead lines, switchgears and transformers. Hydrophobic silicone sheds for severe outdoor exposure.",
    applications: "HV cable to overhead interface",
    voltageClass: "63 – 230 kV",
    standard: "IEC standards",
    image: null,
    order: 11,
    variants: [
      { code: "DPL-TS063", voltage: "63 kV", notes: "Outdoor termination" },
      { code: "DPL-TS0132", voltage: "132 kV", notes: "Outdoor termination" },
      { code: "DPL-TS0230", voltage: "230 kV", notes: "Outdoor termination" },
    ],
  },
  {
    id: "silicone-joint",
    name: "Silicone Joint — Cross-Bonding & Straight",
    family: "Cable Accessories",
    subFamily: "Joints",
    catalogueRef: "DPL JXH / JSH 63-132 · JXH / JSH 230",
    summary:
      "Silicone cross-bonding and straight joints for HV cable networks. Stress-controlled sealing designed for long service under moisture and contamination.",
    applications: "HV cable joints",
    voltageClass: "132 – 230 kV",
    standard: "IEC standards",
    image: null,
    order: 12,
    variants: [
      { code: "JXH 63-132", voltage: "63 – 132 kV", notes: "Cross-bonding joint" },
      { code: "JSH 63-132", voltage: "63 – 132 kV", notes: "Straight joint" },
      { code: "JXH 230", voltage: "230 kV", notes: "Cross-bonding joint" },
      { code: "JSH 230", voltage: "230 kV", notes: "Straight joint" },
    ],
  },

  // ── 05 · Overhead Feeder Line Composite ──
  {
    id: "cutout-fuse-type-a",
    name: "Composite Cut Out Fuse — Type A",
    family: "Overhead Feeder Line Composite",
    subFamily: "Cut Out Fuse",
    catalogueRef: "DPL 20-1345-100 CU · DPL 33-1850-100 CU",
    summary:
      "Composite-housed cutout fuse protecting transformers and lines from overcurrent events. Weather-resistant body, serves as manual isolator during maintenance.",
    applications: "Distribution protection · Isolation",
    voltageClass: "20 – 33 kV",
    standard: "IEC standards",
    image: null,
    order: 11,
    variants: [
      { code: "DPL 20-1345-100 CU", voltage: "20 kV", sectionLength: "1345 mm", notes: "Type A · 100 A" },
      { code: "DPL 33-1850-100 CU", voltage: "33 kV", sectionLength: "1850 mm", notes: "Type A · 100 A" },
    ],
  },
  {
    id: "cutout-fuse-type-b",
    name: "Composite Cut Out Fuse — Type B",
    family: "Overhead Feeder Line Composite",
    subFamily: "Cut Out Fuse",
    catalogueRef: "DPL 20-1450-100 CU · DPL 33-1850-100 CU",
    summary:
      "Type B variant of the composite cut out fuse family with extended creepage for polluted distribution feeders.",
    applications: "Distribution protection · Polluted zones",
    voltageClass: "20 – 33 kV",
    standard: "IEC standards",
    image: null,
    order: 12,
    variants: [
      { code: "DPL 20-1450-100 CU", voltage: "20 kV", sectionLength: "1450 mm", notes: "Type B · 100 A" },
      { code: "DPL 33-1850-100 CU", voltage: "33 kV", sectionLength: "1850 mm", notes: "Type B · 100 A" },
    ],
  },
  {
    id: "surge-arrester",
    name: "Composite Surge Arrester (Distribution)",
    family: "Overhead Feeder Line Composite",
    subFamily: "Surge Arrester",
    catalogueRef: "Distribution class arrester",
    summary:
      "Distribution-class composite surge arrester protecting equipment from lightning, switching and temporary overvoltage events with ground lead disconnector.",
    applications: "Substation · Distribution line protection",
    voltageClass: "24 – 36 kV",
    standard: "IEC 60099-4 · ANSI C62.11",
    image: null,
    order: 21,
  },

  // ── 06 · Creepage Extenders & Covers ──
  {
    id: "creepage-line",
    name: "Creepage Extender — Line Insulator",
    family: "Creepage Extenders & Covers",
    subFamily: "Creepage Extender",
    catalogueRef: "Retrofit creepage extender",
    summary:
      "Retrofit creepage extender for line insulators. Increases surface leakage path in polluted or coastal environments without replacing the insulator.",
    applications: "Retrofit · Line insulators",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 11,
  },
  {
    id: "creepage-post",
    name: "Creepage Extender — Post Insulator",
    family: "Creepage Extenders & Covers",
    subFamily: "Creepage Extender",
    catalogueRef: "Retrofit creepage extender",
    summary:
      "Retrofit creepage extender for post insulators. Extends creepage distance to reduce surface discharges and the risk of flashover.",
    applications: "Retrofit · Post insulators",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 12,
  },
  {
    id: "silicone-wire-cover",
    name: "Silicone Wire Cover",
    family: "Creepage Extenders & Covers",
    subFamily: "Covers",
    catalogueRef: "Silicone wire cover",
    summary:
      "Silicone cover for overhead line conductors. Improves insulation at close-proximity points and reduces wildlife-related faults.",
    applications: "Conductor protection",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 21,
  },
  {
    id: "bird-repellent-cover",
    name: "Bird-Repellent Insulator Cover",
    family: "Creepage Extenders & Covers",
    subFamily: "Covers",
    catalogueRef: "Bird repellent cover",
    summary:
      "Protective cover with bird-repellent geometry reducing animal-induced outages on exposed insulators and hardware.",
    applications: "Animal-induced outage prevention",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 22,
  },
  {
    id: "composite-insulator-cover",
    name: "Composite Insulator Cover",
    family: "Creepage Extenders & Covers",
    subFamily: "Covers",
    catalogueRef: "Composite insulator cover",
    summary:
      "Protective silicone cover for insulators in polluted environments. Extends maintenance intervals and reduces leakage currents.",
    applications: "Insulator protection",
    voltageClass: "All classes",
    standard: "Retrofit accessory",
    image: null,
    order: 23,
  },
];

/** Lookup helpers used across pages, sitemap, dynamic OG. */
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === slug);
}

export function getAllProductSlugs(): string[] {
  return PRODUCTS.map((p) => p.id);
}

export function getProductsByFamily(): Record<ProductFamilyId, Product[]> {
  const grouped = {} as Record<ProductFamilyId, Product[]>;
  for (const f of FAMILY_ORDER) grouped[f] = [];
  for (const p of PRODUCTS) {
    grouped[p.family].push(p);
  }
  for (const f of FAMILY_ORDER) {
    grouped[f].sort((a, b) => a.order - b.order);
  }
  return grouped;
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const target = getProductBySlug(slug);
  if (!target) return [];
  return PRODUCTS.filter(
    (p) => p.id !== slug && p.family === target.family,
  ).slice(0, limit);
}
