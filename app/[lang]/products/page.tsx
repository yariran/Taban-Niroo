import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CodingGuideSection } from "@/components/products/coding-guide-section";
import { FittingsSection } from "@/components/products/fittings-section";
import { ProductCatalogSection } from "@/components/products/product-catalog-section";
import { SiteFooter } from "@/components/site-footer";
import { getPublicProducts } from "@/lib/cms-products";
import { getSiteContent } from "@/lib/cms-content";
import { cmsImage, cmsText } from "@/lib/cms-resolve";
import { SITE_IMAGES } from "@/lib/site-images";
import { RevealWords } from "@/components/ui/reveal-words";
import { pageSocialFor } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { localeFromParams } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = await localeFromParams(params);
  return pageSocialFor("products", lang);
}

const STANDARDS = [
  { code: "IEC 61109", title: "Composite suspension & tension insulators" },
  { code: "IEC 62217", title: "Polymeric HV insulators – general" },
  { code: "IEC 61466", title: "Composite string insulator units" },
  { code: "IEC 60120", title: "Ball and socket couplings dimensions" },
  { code: "IEC 60471", title: "Clevis and tongue couplings dimensions" },
  { code: "IEC 60137", title: "Insulated bushings – AC > 1000 V" },
];

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await localeFromParams(params);
  const [products, content] = await Promise.all([
    getPublicProducts(lang),
    getSiteContent(lang),
  ]);
  const hero = content.products?.hero;
  const standards = content.products?.standards;
  const eyebrow = cmsText(hero, "eyebrow", "Product range");
  const title1 = cmsText(hero, "title", "The insulation");
  const title2 = cmsText(hero, "titleLine2", "portfolio for");
  const title3 = cmsText(hero, "titleLine3", "power networks.");
  const body = cmsText(
    hero,
    "body",
    "Six engineered product families — composite insulators, hybrid technology, transformer bushings, cable accessories, overhead feeder protection and retrofit creepage solutions. Built to IEC standards and field-proven worldwide.",
  );
  const cta1 = cmsText(hero, "ctaLabel", "Browse all products");
  const cta1Href = cmsText(hero, "ctaHref", "#product-explorer");
  const cta2 = cmsText(hero, "ctaLabel2", "Technical enquiry");
  const cta2Href = cmsText(hero, "ctaHref2", "/contact");
  const heroImage = cmsImage(hero, SITE_IMAGES.productsHero) ?? SITE_IMAGES.productsHero;
  const stdEyebrow = cmsText(standards, "eyebrow", "Standards & testing");
  const stdTitle = cmsText(standards, "title", "Type-tested.\nRoutine-tested.");
  const stdBody = cmsText(
    standards,
    "body",
    "Products are designed, type-tested and routine-tested at accredited laboratories. Performance is verified under pollution, mechanical strength and electrical withstand conditions for each family.",
  );
  const stdCta = cmsText(standards, "ctaLabel", "Request test reports");
  const stdCtaHref = cmsText(standards, "ctaHref", "/contact");
  const stdItems =
    standards?.items?.length && standards.items.some((i) => i.label.trim())
      ? standards.items.map((i) => ({ code: i.label, title: i.body || i.value || "" }))
      : STANDARDS;

  const siteUrl = getSiteUrl();
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Taban Niroo product range",
    description:
      "Medium and high-voltage composite and hybrid insulators, bushings, and accessories.",
    url: `${siteUrl}/products`,
    isPartOf: { "@id": `${siteUrl}#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 48).map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/products/${p.id}`,
        name: p.name,
      })),
    },
  };

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Hero — single, direct, ends in a clear CTA to the product explorer */}
      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(0,0,0,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.8)_1px,transparent_1px)] [background-size:80px_80px] dark:opacity-[0.08] dark:[background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_85%_15%,var(--surface-glow),transparent_65%)]" />

        <div className="relative px-6 pt-32 pb-16 md:px-12 md:pt-40 md:pb-20 lg:px-20 lg:pt-44 lg:pb-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:mb-14"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Taban Niroo
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">Products</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:items-end">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-burgundy">
                <span className="inline-flex h-px w-10 bg-brand-burgundy/50" />
                <span>{eyebrow}</span>
              </div>
              <h1 className="font-hero-slogan text-brand-heading mt-6 text-[clamp(2.6rem,6.4vw,5.2rem)] font-bold uppercase leading-[0.92] tracking-[-0.012em]">
                <RevealWords as="span" className="block">
                  {title1}
                </RevealWords>
                <RevealWords
                  as="span"
                  className="block text-brand-navy/55"
                  delay={150}
                >
                  {title2}
                </RevealWords>
                <RevealWords as="span" className="block" delay={300}>
                  {title3}
                </RevealWords>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {body}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={cta1Href}
                  className="group pill-elevate inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-all hover:bg-brand-burgundy"
                >
                  <LayoutGrid size={16} aria-hidden />
                  {cta1}
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href={cta2Href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-navy/25 bg-transparent px-6 py-3 text-sm font-medium uppercase tracking-wider text-brand-navy transition-all hover:border-brand-navy/50 hover:bg-brand-navy-soft"
                >
                  {cta2}
                </Link>
              </div>

              <p className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <Search size={12} aria-hidden />
                28 product references · Search by voltage, DPL code or family
              </p>
            </div>

            <div className="relative">
              <div className="cine-grade relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/50 shadow-elevate dark:border-white/[0.08]">
                <Image
                  src={heroImage}
                  alt="Composite and hybrid insulators in service"
                  fill
                  className="object-cover grayscale"
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  unoptimized={heroImage.startsWith("http")}
                />
                <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                <div className="absolute start-5 top-5 z-[3] inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  Field-proven
                </div>
                <div className="absolute bottom-5 start-5 end-5 z-[3] border-t border-white/20 pt-3 text-white">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                    Reference fleet
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    400 kV &amp; 800 kV transmission corridors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductCatalogSection products={products} />

      {/* DPL coding guide — helps procurement read any DPL reference */}
      <CodingGuideSection />

      {/* IEC end-fittings / couplings available across insulator families */}
      <FittingsSection />

      {/* Standards */}
      <section className="border-t border-border/50 bg-background dark:border-white/[0.06]">
        <div className="px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-burgundy">
                <span>{stdEyebrow}</span>
                <span className="inline-flex h-px w-10 bg-brand-burgundy/50" />
              </div>
              <h2 className="font-hero-slogan text-brand-heading mt-4 text-3xl font-bold uppercase tracking-tight md:text-4xl">
                {stdTitle.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {stdBody}
              </p>
              <Link
                href={stdCtaHref}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-brand-navy transition-colors hover:text-brand-burgundy"
              >
                {stdCta}
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {stdItems.map((s) => (
                <div
                  key={s.code}
                  className="interactive-lift rounded-2xl border border-border/40 bg-card/90 p-5 shadow-elevate dark:border-white/[0.08] dark:bg-card/50 md:p-6"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Standard
                  </p>
                  <p className="font-hero-slogan mt-2 text-2xl font-bold tracking-tight text-foreground">
                    {s.code}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter cms={content.footer} />
    </main>
  );
}
