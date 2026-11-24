export type Dictionary = {
  skipToContent: string;
  brand: string;
  nav: {
    company: string;
    products: string;
    projects: string;
    blog: string;
    contact: string;
  };
  language: {
    label: string;
    en: string;
    fa: string;
  };
  cookie: {
    body: string;
    accept: string;
    decline: string;
  };
  intro: {
    /** Small line under the progress bar on the cinematic intro. */
    tagline: string;
    skip: string;
  };
  home: {
    heroBody: string;
    tagline: string;
    explore: string;
    contact: string;
  };
  projects: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title1: string;
    title2: string;
    heroBody: string;
    regionsEyebrow: string;
    introBody: string;
    introNote: string;
    casesEyebrow: string;
    casesTitle: string;
    casesLead: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    regions: { label: string; body: string }[];
    cases: {
      region: string;
      title: string;
      detail: string;
      tags: string[];
    }[];
  };
  contact: {
    send: string;
    name: string;
    email: string;
    company: string;
    whatsapp: string;
    message: string;
    sending: string;
    success: string;
    error: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    imprint: string;
  };
  /** App chrome: nav landmarks, error/empty states, shared affordances. */
  ui: {
    loading: string;
    retry: string;
    goHome: string;
    contactSupport: string;
    errorEyebrow: string;
    errorTitle: string;
    errorReference: string;
    errorBody: string;
    notFoundTitle: string;
    notFoundBody: string;
    backToHome: string;
    legal: string;
    home: string;
    siteLinks: string;
    done: string;
    join: string;
    landline: string;
    fax: string;
    lastUpdated: string;
    email: string;
    breadcrumbAria: string;
    primaryNavAria: string;
    mobileNavAria: string;
    footerNavAria: string;
    siteMenuAria: string;
    closeMenu: string;
    chapterNavAria: string;
    jumpTo: string;
    companyChaptersAria: string;
    cookieNoticeAria: string;
    interludeAria: string;
    honeypot: string;
    back: string;
  };
  /** Product surfaces: mega-menu, catalogue, detail page, modal. */
  productsUi: {
    rangeAria: string;
    rangeLabel: string;
    seeAll: string;
    browseFamily: string;
    refsSuffix: string;
    standard: string;
    requestQuote: string;
    backToFamily: string;
    typicalApplications: string;
    availableReferences: string;
    swipeHint: string;
    dragHint: string;
    relatedReferences: string;
    viewFamily: string;
    viewDetail: string;
    detailPage: string;
    closeDetails: string;
    enquire: string;
    requestDatasheet: string;
    documentation: string;
    documentationLede: string;
    tableAndDrawing: string;
    productDrawing: string;
    productDrawingLede: string;
    drawingSoon: string;
    requestDrawing: string;
    technicalTable: string;
    noVariants: string;
    galleryAria: string;
    addImage: string;
    fullCatalogue: string;
    allCategories: string;
    codingGuide: string;
    codingGuideRead: string;
    codingGuideCode: string;
    endFittings: string;
    couplings: string;
    profileCriteria: string;
    details: string;
    codingGuideBody: string;
    fittingsBody: string;
    couplingsTail: string;
    tableFootnote: string;
    pickerDescription: string;
    datasheetRefsOne: string;
    datasheetRefsMany: string;
    drawingAltSuffix: string;
    drawingSoonBefore: string;
    drawingSoonAfter: string;
    technicalDataSuffix: string;
    openDetailAria: string;
    openOverviewAria: string;
    catalogueSearchHint: string;
    requestTestReports: string;
    couplingsStandardsNote: string;
    segment: string;
    family: string;
    subFamily: string;
    voltageClass: string;
    voltageClassSentence: string;
    standards: string;
    standardsAndTesting: string;
    briefEyebrow: string;
    whyEyebrow: string;
    technicalEyebrow: string;
    sameFamilyEyebrow: string;
    newProduct: string;
    newProductAlt: string;
    capDistributionTransmission: string;
    capPostTypes: string;
    capSiliconePorcelain: string;
    capPolymerHoused: string;
    capPatented: string;
    standardsBody: string;
  };
  /** Company page stat strip and imagery. */
  aboutUi: {
    founded: string;
    projects: string;
    ratedVoltage: string;
    countries: string;
    companyProfile: string;
    profileBody: string;
    activitiesBody: string;
    cultureBody: string;
    towersAlt: string;
  };
  offices: {
    shiraz: string;
    tehran: string;
    shirazLines: readonly string[];
    tehranLines: readonly string[];
  };
  ceo: {
    name: string;
    role: string;
    roleShort: string;
    portraitAlt: string;
    plantAlt: string;
  };
  map: {
    title: string;
    subtitle: string;
    aria: string;
    selectHint: string;
    projects: string;
    since: string;
    products: string;
    closeAria: string;
  };
  /** Home/section labels and image alternatives. */
  sections: {
    builtFor: string;
    heroElements: string;
    heroReliability: string;
    heroInsulation: string;
    engineeredForReliability: string;
    engineeredFor: string;
    compositeInsulation: string;
    composite: string;
    heroLede: string;
    exploreSolutions: string;
    heroSubline: string;
    heroAlt: string;
    longRodAlt: string;
    postHybridAlt: string;
    technologyAria: string;
    technologyAlt: string;
    plantAria: string;
    panHint: string;
    liveSpec: string;
    engineeringRecord: string;
    provenLine: string;
    proofHeadline: string;
    hybridShort: string;
    vision: string;
    mission: string;
    values: string;
    contactEngineering: string;
    heroSrHeading: string;
    philosophySummary: string;
    blogEmptyEyebrow: string;
    blogEmptyBody: string;
    footerBlurb: string;
  };
};

export const en: Dictionary = {
  skipToContent: "Skip to content",
  brand: "Taban Niroo",
  nav: {
    company: "Company",
    products: "Products",
    projects: "Projects & Partners",
    blog: "Blog – R&D",
    contact: "Contact",
  },
  language: {
    label: "Language",
    en: "EN",
    fa: "FA",
  },
  cookie: {
    body: "We use cookies for first-party analytics.",
    accept: "Accept",
    decline: "Decline",
  },
  intro: {
    tagline: "Power Transmission",
    skip: "Skip",
  },
  home: {
    heroBody: "IEC-tested composite insulation for high-voltage networks.",
    tagline: "Shaping Tomorrow's Solution Today",
    explore: "View products",
    contact: "Request enquiry",
  },
  projects: {
    metaTitle: "Projects & partners",
    metaDescription:
      "Taban Niroo insulators in transmission and distribution projects across the Middle East, Africa, and South America.",
    eyebrow: "Projects & partners",
    title1: "Power transmission.",
    title2: "Regional reach.",
    heroBody:
      "Taban Niroo supports high-voltage projects across the Middle East, Africa, and South America. Our composite and hybrid insulators are installed on overhead lines and in substations in demanding climatic and pollution conditions.",
    regionsEyebrow: "Regions served",
    introBody:
      "Taban Niroo products are installed in projects across Africa, South America, the Middle East, and parts of Europe. We support utilities and industrial partners in both new-build and retrofit applications.",
    introNote:
      "Experience in different grid configurations, voltage levels, and environmental conditions allows our engineering teams to help select appropriate insulator designs and creepage distances for each project.",
    casesEyebrow: "Selected deployments",
    casesTitle: "Where the product earns its rating plate.",
    casesLead:
      "Representative applications from utility and industrial partners. Voltage classes and product families reflect the engineering brief for each site.",
    ctaTitle: "Planning a line or retrofit?",
    ctaBody:
      "Share voltage class, pollution zone, and mechanical load — our engineers will recommend a fitting family.",
    ctaButton: "Talk to an engineer",
    regions: [
      {
        label: "Africa",
        body: "Projects in Liberia, Morocco, Ghana, and Somalia, supporting overhead transmission and distribution networks.",
      },
      {
        label: "South America & Europe",
        body: "Installations in Peru and Colombia, as well as projects in Greece, using composite and hybrid solutions tailored to local requirements.",
      },
      {
        label: "Middle East & Asia",
        body: "Projects in Iraq and Afghanistan, together with extensive experience in Iran’s transmission network, across a range of voltage classes.",
      },
    ],
    cases: [
      {
        region: "Iran",
        title: "Transmission corridors · domestic grid",
        detail:
          "Long-rod and hybrid post insulators across 63–400 kV corridors, specified for altitude, desert pollution, and long creepage.",
        tags: ["63–400 kV", "Long rod", "Hybrid post"],
      },
      {
        region: "Iraq",
        title: "Substation & line rebuilds",
        detail:
          "Composite housings selected for high salinity and dust; type-tested families aligned to IEC 61109 / 62217.",
        tags: ["IEC 61109", "Pollution zone", "Station post"],
      },
      {
        region: "Ghana · Liberia",
        title: "Distribution & coastal feeders",
        detail:
          "Silicone-housed units for humid, coastal climates where porcelain hydrophobicity recovery is insufficient.",
        tags: ["Distribution", "Coastal", "HTV silicone"],
      },
      {
        region: "Peru · Colombia",
        title: "Andean and tropical spans",
        detail:
          "Mechanical ratings tuned for altitude and mixed pollution; hybrid designs where porcelain cores are preferred.",
        tags: ["Altitude", "Hybrid", "OHL"],
      },
    ],
  },
  contact: {
    send: "Send message",
    name: "Full name",
    email: "Work email",
    company: "Company",
    whatsapp: "WhatsApp",
    message: "Message",
    sending: "Sending…",
    success: "Thank you — your message has been received.",
    error: "Something went wrong. Please try again.",
  },
  footer: {
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    imprint: "Imprint",
  },
  ui: {
    loading: "Loading",
    retry: "Retry",
    goHome: "Go to homepage",
    contactSupport: "Contact support",
    errorEyebrow: "Error · interrupt",
    errorTitle: "Something interrupted the signal.",
    errorReference: "Reference ·",
    errorBody:
      "A part of this page failed to render. Our log already received the incident — you can retry, return to the homepage, or write to us directly.",
    notFoundTitle: "Page not found",
    notFoundBody:
      "The page you requested does not exist or has been moved.",
    backToHome: "Back to home",
    legal: "Legal",
    home: "Home",
    siteLinks: "Site",
    done: "Done",
    join: "Join",
    landline: "Landline:",
    fax: "Fax:",
    lastUpdated: "Last updated ·",
    email: "Email",
    breadcrumbAria: "Breadcrumb",
    primaryNavAria: "Primary",
    mobileNavAria: "Mobile primary",
    footerNavAria: "Footer navigation",
    siteMenuAria: "Site menu",
    closeMenu: "Close menu",
    chapterNavAria: "Chapter navigation",
    jumpTo: "Jump to {title}",
    companyChaptersAria: "Company chapters",
    cookieNoticeAria: "Cookie & analytics notice",
    interludeAria: "Interlude",
    honeypot: "Leave this field empty",
    back: "Back",
  },
  productsUi: {
    rangeAria: "Product range",
    rangeLabel: "Product range",
    seeAll: "See all",
    browseFamily: "Browse family",
    refsSuffix: "ref.",
    standard: "Standard",
    requestQuote: "Request a quote",
    backToFamily: "Back to family",
    typicalApplications: "Typical applications.",
    availableReferences: "Available references.",
    swipeHint: "Swipe sideways to see all columns.",
    dragHint: "Drag the table or use the scrollbar to see all columns.",
    relatedReferences: "Related references.",
    viewFamily: "View family",
    viewDetail: "View detail",
    detailPage: "Detail page",
    closeDetails: "Close product details",
    enquire: "Enquire",
    requestDatasheet: "Request datasheet",
    documentation: "Product documentation",
    documentationLede: "Drawing and technical table",
    tableAndDrawing: "Table & drawing",
    productDrawing: "Product drawing",
    productDrawingLede: "Sectional diagram and reference geometry.",
    drawingSoon: "Drawing coming soon",
    requestDrawing: "Request drawing",
    technicalTable: "Technical table",
    noVariants: "No variant rows defined for this product yet.",
    galleryAria: "Product gallery",
    addImage: "Add image",
    fullCatalogue: "Full catalogue",
    allCategories: "All product categories",
    codingGuide: "Coding guide",
    codingGuideRead: "Read any",
    codingGuideCode: "code.",
    endFittings: "End fittings",
    couplings: "Couplings",
    profileCriteria: "Profile criteria",
    details: "Details",
    codingGuideBody:
      "Every Taban Niroo product carries a short DPL reference. Once you know the four segments below you can read section length, voltage class and family at a glance — no datasheet needed.",
    fittingsBody:
      "All long rod and post families can be supplied with the following IEC-standard couplings. Geometry and load class are confirmed per project on the approved drawing.",
    couplingsTail: "& terminals.",
    tableFootnote:
      "Drag, swipe, or use the scrollbar to see all columns. All dimensions in millimetres (mm) unless stated otherwise; voltages in kilovolts (kV); mechanical loads in kilonewtons (kN).",
    pickerDescription:
      "Sectional drawing on top, full ratings table underneath.",
    datasheetRefsOne: "1 product reference in datasheet.",
    datasheetRefsMany: "{count} product references in datasheet.",
    drawingAltSuffix: "engineering drawing",
    drawingSoonBefore: "The sectional drawing for",
    drawingSoonAfter:
      "will appear here. Request it from our engineering team in the meantime.",
    technicalDataSuffix: "technical data",
    openDetailAria: "Open detail page for {name}",
    openOverviewAria: "Open {name} overview",
    catalogueSearchHint:
      "{count} product references · Search by voltage, DPL code or family",
    requestTestReports: "Request test reports",
    couplingsStandardsNote: "Couplings follow IEC 60120 & IEC 60471",
    segment: "Segment",
    family: "Family",
    subFamily: "Sub-family",
    voltageClass: "Voltage class",
    voltageClassSentence: "Voltage class {value}.",
    standards: "Standards",
    standardsAndTesting: "Standards & testing.",
    briefEyebrow: "Engineering brief",
    whyEyebrow: "Why this insulator",
    technicalEyebrow: "Technical data",
    sameFamilyEyebrow: "In the same family",
    newProduct: "New Product",
    newProductAlt: "New Product: 63 & 132 kV Line Post Insulator",
    capDistributionTransmission: "Distribution & Transmission",
    capPostTypes: "Line Post, Station Post, Railway",
    capSiliconePorcelain: "Silicone & porcelain",
    capPolymerHoused: "Polymer housed",
    capPatented: "Patented product",
    standardsBody:
      "Products are designed, type-tested and routine-tested at accredited laboratories. Performance is verified under pollution, mechanical strength and electrical withstand conditions for each family.",
  },
  aboutUi: {
    founded: "Founded",
    projects: "Projects",
    ratedVoltage: "RATED VOLTAGE",
    countries: "Countries",
    companyProfile: "Company profile",
    profileBody:
      "Under the leadership of Managing Director Asadollah Zamani, Taban Niroo combines engineering discipline with a strong culture of safety and responsibility. Our team of skilled specialists and technocrats focuses on long-term performance and dependable operation in the field.",
    activitiesBody:
      "Our core activities include the design and manufacturing of high-voltage electrical composite accessories, from distribution and transmission line insulators to station post insulators, railway insulators, hybrid insulators, and transformer bushings.",
    cultureBody:
      "Taban Niroo\u2019s culture is built around Excellence in Innovation, Leadership by Example, Integrity and Transparency, a strong client focus, and an employee-centred approach. These principles guide our decisions and ensure that every product is engineered for consistent performance over its service life.",
    towersAlt: "High-voltage transmission towers at dawn",
  },
  offices: {
    shiraz: "Shiraz",
    tehran: "Tehran",
    shirazLines: [
      "Taban Niroo Bldg",
      "Shiraz Especial Economic Zone, Iran",
    ],
    tehranLines: ["Office 9, No. 64, Saeedi Ave", "Africa Blvd, Tehran"],
  },
  ceo: {
    name: "Asadollah Zamani",
    role: "Chief Executive Officer",
    roleShort: "CEO, Taban Niroo",
    portraitAlt: "Asadollah Zamani, CEO of Taban Niroo",
    plantAlt: "Taban Niroo manufacturing, Shiraz Especial Economic Zone",
  },
  map: {
    title: "Global delivery footprint",
    subtitle: "Power infrastructure cooperation network",
    aria: "Interactive world map showing selected project markets",
    selectHint: "Select a highlighted market",
    projects: "Projects",
    since: "Since",
    products: "Products",
    closeAria: "Close {name} details",
  },
  sections: {
    builtFor: "Built for ",
    heroElements: "the elements",
    heroReliability: "reliability",
    heroInsulation: "insulation",
    engineeredForReliability: "Engineered for reliability",
    engineeredFor: "Engineered for ",
    compositeInsulation: "Composite insulation",
    composite: "Composite ",
    heroLede: "Designed for demanding power transmission environments.",
    exploreSolutions: "Explore our solutions",
    heroSubline:
      "High-voltage composite insulators for power transmission.",
    heroAlt:
      "Taban Niroo high-voltage composite insulators and power transmission equipment",
    longRodAlt: "Long rod and transmission network insulators",
    postHybridAlt: "Post and hybrid insulators",
    technologyAria: "IEC standards and industrial insulator technology",
    technologyAlt:
      "High-voltage transmission line with composite insulation",
    plantAria: "On the factory floor",
    panHint: "Scroll or drag to pan",
    liveSpec: "Live spec",
    engineeringRecord: "Engineering record",
    provenLine: "Proven on energised networks across markets.",
    proofHeadline: "+24 Years of Engineering",
    hybridShort: "In short, our hybrid insulators offer",
    vision: "Vision",
    mission: "Mission",
    values: "Values",
    contactEngineering: "Contact engineering",
    heroSrHeading:
      "Taban Niroo — composite insulators, hybrid insulators and transformer bushings for high-voltage power transmission",
    philosophySummary:
      "High-voltage composite accessories. Long rod, post, hybrid insulators. Transformer bushings. IEC-tested. 6-1000 kV.",
    blogEmptyEyebrow: "R&D notes",
    blogEmptyBody:
      "Technical articles on composite insulation, IEC testing, and field performance will appear here. Meanwhile, explore the product catalogue or send a project enquiry.",
    footerBlurb: "Composite insulators · IEC-tested · Since 1997",
  },
};
