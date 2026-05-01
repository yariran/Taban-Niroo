import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronRight, Send } from "lucide-react";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";
import { RevealUp, RevealWords } from "@/components/ui/reveal-words";
import { ScrollPan } from "@/components/ui/scroll-pan";
import {
  FAMILY_ANCHOR,
  FAMILY_INDEX,
  FAMILY_THUMBNAIL,
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
  PRODUCTS,
} from "@/lib/products";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      title: "Product not found",
      description: "The requested product reference does not exist.",
    };
  }

  const title = `${product.name}${product.voltageClass ? ` · ${product.voltageClass}` : ""}`;
  const description = product.summary;

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/products/${product.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.id);
  const familyIdx = FAMILY_INDEX[product.family];
  const thumbnail = FAMILY_THUMBNAIL[product.family];
  const siteUrl = getSiteUrl();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    category: product.family,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Taban Niroo · DPL",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Taban Niroo",
      url: siteUrl,
    },
    image: thumbnail ? `${siteUrl}${thumbnail}` : undefined,
    additionalProperty: [
      product.voltageClass && {
        "@type": "PropertyValue",
        name: "Voltage class",
        value: product.voltageClass,
      },
      product.standard && {
        "@type": "PropertyValue",
        name: "Standards",
        value: product.standard,
      },
      product.subFamily && {
        "@type": "PropertyValue",
        name: "Sub-family",
        value: product.subFamily,
      },
    ].filter(Boolean),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.family,
        item: `${siteUrl}/products#${FAMILY_ANCHOR[product.family]}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${siteUrl}/products/${product.id}`,
      },
    ],
  };

  const benefits = deriveBenefits(product);

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="grain-layer opacity-30" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
          style={{
            backgroundImage:
              "radial-gradient(120% 70% at 50% 0%, rgb(var(--accent-volt) / 0.10), transparent 55%)",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 md:px-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14 lg:px-20">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
            >
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <ChevronRight size={11} aria-hidden strokeWidth={1.7} />
              <Link
                href="/products"
                className="transition-colors hover:text-foreground"
              >
                Products
              </Link>
              <ChevronRight size={11} aria-hidden strokeWidth={1.7} />
              <Link
                href={`/products#${FAMILY_ANCHOR[product.family]}`}
                className="transition-colors hover:text-foreground"
              >
                {product.family}
              </Link>
            </nav>

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              {familyIdx} · {product.subFamily}
            </p>

            <RevealWords
              as="h1"
              className="mt-5 block font-medium leading-[1.04] tracking-tight text-foreground text-[clamp(2.25rem,5.5vw,3.85rem)]"
            >
              {product.name}
            </RevealWords>

            <RevealUp delay={140}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {product.summary}
              </p>
            </RevealUp>

            <RevealUp delay={220}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href={`/contact?ref=${encodeURIComponent(product.id)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  <Send size={14} aria-hidden strokeWidth={1.75} />
                  Request a quote
                </Link>
                <Link
                  href={`/products#${FAMILY_ANCHOR[product.family]}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
                >
                  <ArrowLeft size={14} aria-hidden strokeWidth={1.75} />
                  Back to family
                </Link>
              </div>
            </RevealUp>
          </div>

          {/* Visual block */}
          <RevealUp delay={260}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/40 bg-muted/30 shadow-elevate dark:border-white/[0.08] dark:bg-white/[0.025]">
              <Image
                src={thumbnail}
                alt={`${product.family} — ${product.name}`}
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 100vw"
                className="object-cover"
                priority
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
              />
              <div className="grain-layer opacity-50" aria-hidden />

              <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                DPL · {product.catalogueRef}
              </div>

              {product.voltageClass && (
                <div className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                  {product.voltageClass}
                </div>
              )}
            </div>
          </RevealUp>
        </div>
      </section>

      {/* Spec strip */}
      <section className="border-y border-border/50 bg-muted/20 dark:border-white/[0.06] dark:bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 md:grid-cols-4 md:px-12 lg:px-20">
          <SpecTile label="Family" value={product.family} />
          <SpecTile label="Sub-family" value={product.subFamily} />
          <SpecTile
            label="Voltage class"
            value={product.voltageClass ?? "—"}
            tabular
          />
          <SpecTile label="Standards" value={product.standard ?? "—"} small />
        </div>
      </section>

      {/* Body */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 md:px-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16 lg:px-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              01 · Engineering brief
            </p>
            <RevealUp>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/85 md:text-[17px] md:leading-[1.7]">
                <p>{product.summary}</p>
                <p>
                  <span className="font-medium text-foreground">
                    Typical applications.
                  </span>{" "}
                  {product.applications}
                  {product.voltageClass &&
                    ` Voltage class ${product.voltageClass}.`}
                </p>
                {product.standard && (
                  <p>
                    <span className="font-medium text-foreground">
                      Standards &amp; testing.
                    </span>{" "}
                    {product.standard}.
                  </p>
                )}
              </div>
            </RevealUp>
          </div>

          <RevealUp delay={140}>
            <aside>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                02 · Why this insulator
              </p>
              <ul className="mt-6 space-y-4">
                {benefits.map((b) => (
                  <li
                    key={b.title}
                    className="card-spotlight rounded-xl border border-border/50 bg-card/70 p-4 dark:border-white/[0.06] dark:bg-card/40"
                  >
                    <p className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                      {b.tag}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold tracking-tight text-foreground">
                      {b.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {b.body}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </RevealUp>
        </div>
      </section>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <section className="border-t border-border/60 bg-muted/15 py-20 dark:border-white/[0.06] dark:bg-white/[0.02] md:py-24">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  03 · Variants
                </p>
                <h2 className="mt-3 font-medium leading-tight tracking-tight text-foreground text-[clamp(1.6rem,3.4vw,2.25rem)]">
                  Available references.
                </h2>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {product.variants.length} ref.
              </span>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/60 shadow-elevate dark:border-white/[0.08] dark:bg-card/40">
              <ScrollPan
                ariaLabel={`${product.name} variants table`}
                fadeFrom="from-card"
                className="rounded-2xl"
              >
                <table className="w-full min-w-[640px] border-collapse text-left text-sm tabular">
                  <thead>
                    <tr className="bg-muted/30 dark:bg-white/[0.02]">
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Code
                      </th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Voltage
                      </th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Section length
                      </th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Creepage
                      </th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((v) => (
                      <tr
                        key={v.code}
                        className="border-t border-border/40 transition-colors hover:bg-muted/20 dark:border-white/[0.05] dark:hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-3 font-medium text-foreground">
                          {v.code}
                        </td>
                        <td className="px-5 py-3 text-foreground/85">
                          {v.voltage}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {v.sectionLength ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {v.creepage ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {v.notes ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollPan>
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground md:hidden">
              Swipe sideways to see all columns.
            </p>
            <p className="mt-3 hidden text-[11px] text-muted-foreground md:block">
              Drag the table or use the scrollbar to see all columns.
            </p>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-background py-20 md:py-24">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  04 · In the same family
                </p>
                <h2 className="mt-3 font-medium leading-tight tracking-tight text-foreground text-[clamp(1.5rem,3vw,2.1rem)]">
                  Related references.
                </h2>
              </div>
              <Link
                href={`/products#${FAMILY_ANCHOR[product.family]}`}
                className="hidden items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-foreground/70 md:inline-flex"
              >
                View family
                <ArrowUpRight size={12} aria-hidden />
              </Link>
            </div>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/products/${r.id}`}
                    className="group interactive-lift flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/80 dark:border-white/[0.08] dark:bg-card/40"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40 dark:bg-white/[0.02]">
                      <Image
                        src={FAMILY_THUMBNAIL[r.family]}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
                        className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                      />
                      <div className="grain-layer opacity-40" aria-hidden />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {FAMILY_INDEX[r.family]} · {r.subFamily}
                      </p>
                      <p className="mt-2 text-base font-semibold tracking-tight text-foreground">
                        {r.name}
                      </p>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                        {r.summary}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[10.5px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors group-hover:text-foreground">
                        View detail
                        <ArrowUpRight size={11} aria-hidden />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FooterSection />
    </main>
  );
}

function SpecTile({
  label,
  value,
  small,
  tabular,
}: {
  label: string;
  value: string;
  small?: boolean;
  tabular?: boolean;
}) {
  return (
    <div className="bg-background px-5 py-6 dark:bg-background/40 md:px-7 md:py-8">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-2 leading-tight tracking-tight text-foreground ${
          small ? "text-[13.5px] leading-snug" : "text-base font-medium md:text-lg"
        } ${tabular ? "tabular" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * Lightweight, deterministic benefit derivation.
 *
 * Instead of authoring a separate "benefits" array on every product (which
 * ages quickly), the page synthesises three short value props from the
 * product's family and subFamily. Stable, hand-curated copy per category.
 */
function deriveBenefits(p: (typeof PRODUCTS)[number]) {
  const base = [
    {
      tag: "Hydrophobicity",
      title: "Self-cleaning silicone housing",
      body: "HTV silicone sheds repel pollution, salt and moisture so leakage currents stay low between cleanings.",
    },
    {
      tag: "Mechanical",
      title: "ECR fiberglass core",
      body: "Boron-free ECR fiberglass rod absorbs cantilever and tension loads with no creep over the design life.",
    },
    {
      tag: "Service life",
      title: "Sealed triple-junction point",
      body: "End fittings are hermetically sealed against moisture infiltration, the most common failure mode in HV insulators.",
    },
  ];

  if (p.family === "Hybrid Insulators") {
    base[1] = {
      tag: "Dielectric",
      title: "Porcelain core, silicone skin",
      body: "Mechanical rigidity of ceramic with the hydrophobic surface of silicone — engineered for polluted environments.",
    };
  }
  if (p.family === "Transformer Bushings") {
    base[2] = {
      tag: "Safety",
      title: "Explosion-resistant housing",
      body: "Composite housing absorbs internal pressure rises far better than ceramic; no shattering at fault.",
    };
  }
  if (p.family === "Cable Accessories") {
    base[0] = {
      tag: "Sealing",
      title: "Stress-controlled silicone",
      body: "Molded silicone insert manages the electrical stress at the conductor-screen junction without lubricant migration.",
    };
  }
  if (p.family === "Overhead Feeder Line Composite") {
    base[2] = {
      tag: "Operability",
      title: "Field-serviceable hardware",
      body: "Composite-bodied switchgear designed for fast field swaps with standard hot-line tools.",
    };
  }
  if (p.family === "Creepage Extenders & Covers") {
    base[1] = {
      tag: "Retrofit",
      title: "Drop-in upgrade path",
      body: "Adds creepage to an existing fleet without replacing core hardware — extends asset life by years.",
    };
  }

  return base;
}
