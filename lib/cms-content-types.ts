export type ContentItem = {
  label: string;
  value?: string;
  body?: string;
};

export type ContentBlock = {
  eyebrow?: string;
  title?: string;
  titleLine2?: string;
  titleLine3?: string;
  body?: string;
  image?: string | null;
  ctaLabel?: string;
  ctaHref?: string;
  ctaLabel2?: string;
  ctaHref2?: string;
  items?: ContentItem[];
};

export type SiteContent = {
  version: 1;
  updatedAt: string;
  home: {
    hero?: ContentBlock;
    newRelease?: ContentBlock;
    philosophy?: ContentBlock;
    featured?: ContentBlock;
    technology?: ContentBlock;
    engineering?: ContentBlock;
    gallery?: ContentBlock;
    collection?: ContentBlock;
    timeline?: ContentBlock;
    testimonials?: ContentBlock;
    whyTaban?: ContentBlock;
    ceo?: ContentBlock;
    productGallery?: ContentBlock;
  };
  about?: {
    hero?: ContentBlock;
    story?: ContentBlock;
    profile?: ContentBlock;
    values?: ContentBlock;
    social?: ContentBlock;
  };
  projects?: {
    hero?: ContentBlock;
    intro?: ContentBlock;
    regions?: ContentBlock;
  };
  contact?: {
    hero?: ContentBlock;
    intro?: ContentBlock;
    offices?: ContentBlock;
  };
  products?: {
    hero?: ContentBlock;
    standards?: ContentBlock;
  };
  blog?: {
    hero?: ContentBlock;
    rndOverview?: ContentBlock;
    pollution?: ContentBlock;
    hybrid?: ContentBlock;
    patents?: ContentBlock;
  };
  legal?: {
    terms?: ContentBlock;
    privacy?: ContentBlock;
    imprint?: ContentBlock;
  };
  footer?: ContentBlock;
};

export function emptySiteContent(): SiteContent {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    home: {},
    about: {},
    projects: {},
    contact: {},
    products: {},
    blog: {},
    legal: {},
    footer: {},
  };
}

export function blockHasContent(block: ContentBlock | undefined): boolean {
  if (!block) return false;
  return Boolean(
    block.eyebrow?.trim() ||
      block.title?.trim() ||
      block.titleLine2?.trim() ||
      block.titleLine3?.trim() ||
      block.body?.trim() ||
      block.image ||
      block.ctaLabel?.trim() ||
      block.ctaHref?.trim() ||
      block.ctaLabel2?.trim() ||
      (block.items && block.items.length > 0),
  );
}
