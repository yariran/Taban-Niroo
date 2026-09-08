import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";
import { getSiteContent } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";
import { getProductBySlugAsync } from "@/lib/cms-products";
import { pageSocialFor } from "@/lib/seo";
import { localeFromParams } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = await localeFromParams(params);
  return pageSocialFor("contact", lang);
}

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ ref?: string }>;
};

export default async function ContactPage({ params, searchParams }: Props) {
  const lang = await localeFromParams(params);
  const { ref: rawRef } = await searchParams;
  const productRef = rawRef?.trim() || undefined;
  const linkedProduct = productRef
    ? await getProductBySlugAsync(productRef, lang)
    : null;

  const content = await getSiteContent(lang);
  const hero = content.contact?.hero;
  const intro = content.contact?.intro;
  const eyebrow = cmsText(hero, "eyebrow", "Contact");
  const titleLine1 = cmsText(hero, "title", "Connect with");
  const titleLine2 = cmsText(hero, "ctaLabel", "Taban Niroo.");
  const body = cmsText(
    intro ?? hero,
    "body",
    "For project enquiries, technical discussions, and partnership opportunities, please share your details and our team will respond through the appropriate channel.",
  );
  const offices = content.contact?.offices?.items;
  const officeBlocks =
    offices?.length && offices.some((o) => o.label.trim())
      ? offices
      : [
          {
            label: "Headquarters",
            value: "Tel: +98 713 717 5115-7\nFax: +98 21 2629 3990",
            body: "Taban Niroo Building\nShiraz Special Economic Zone, Iran",
          },
          {
            label: "Tehran office",
            value: "Tel: +98 21 8821 6952\nFax: +98 21 2629 3990",
            body: "Office 9, No. 64, Saeedi Ave,\nAfrica St, Tehran, Iran",
          },
          {
            label: "Email",
            value: "",
            body: "info@taban-niroo.com",
          },
        ];

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-background">
        <div className="px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-24 lg:px-20 lg:pt-36 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                {eyebrow}
              </p>
              <h1 className="mt-4 font-hero-slogan text-brand-heading text-3xl font-bold uppercase tracking-tight md:text-4xl lg:text-5xl">
                <RevealWords as="span" className="block">
                  {titleLine1}
                </RevealWords>
                <RevealWords as="span" className="block" delay={140}>
                  {titleLine2}
                </RevealWords>
              </h1>
              <RevealUp
                as="p"
                delay={360}
                className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {body}
              </RevealUp>

              <ContactForm
                productRef={linkedProduct?.id ?? productRef}
                productName={linkedProduct?.name}
              />
            </div>

            <div className="space-y-10 rounded-2xl border border-border/80 bg-background/70 p-6 backdrop-blur md:p-8">
              {officeBlocks.map((office) => (
                <div key={office.label}>
                  <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                    {office.label}
                  </p>
                  {office.body ? (
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {office.label.toLowerCase() === "email" ? (
                        <a
                          className="underline underline-offset-2 hover:text-foreground"
                          href={`mailto:${office.body.trim()}`}
                        >
                          {office.body.trim()}
                        </a>
                      ) : (
                        office.body
                      )}
                    </p>
                  ) : null}
                  {office.value ? (
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {office.value}
                    </p>
                  ) : null}
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
