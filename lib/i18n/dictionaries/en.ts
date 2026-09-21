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
};
