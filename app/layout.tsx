import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/lenis-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { ConsentAnalytics } from "@/components/consent-analytics";
import { SiteIntro } from "@/components/site-intro";
import { LocaleDocumentSync } from "@/components/locale-document-sync";
import { getSiteUrl } from "@/lib/site-url";
import { ORGANIZATION_SAME_AS, brandMark, hreflangAlternates, pageSeoCopy } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-dictionary";
import { dirFor, localeHtmlLang, localeOg } from "@/lib/i18n";
import { estedad, vazirmatnLocal } from "@/lib/fonts-fa";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  adjustFontFallback: true,
  preload: true,
});

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
  weight: ["500", "600", "700"],
  preload: true,
});

const siteUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const home = pageSeoCopy("home", locale);
  const brand = brandMark(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: home.title,
      template: locale === "fa" ? `%s | ${brand}` : `%s | ${brand}`,
    },
    description: home.description,
    applicationName: brand,
    authors: [{ name: "Taban Niroo · Dena Power Line Insulators" }],
    creator: brand,
    publisher: brand,
    keywords:
      locale === "fa"
        ? [
            "مقره کامپوزیتی",
            "عایق فشار قوی",
            "مقره سیلیکونی",
            "مقره هیبریدی",
            "بوشینگ ترانسفورماتور",
            "متعلقات کابل",
            "IEC 61109",
            "IEC 62217",
            "تابان نیرو",
            "تولیدکننده مقره ایران",
          ]
        : [
            "composite insulator",
            "high-voltage insulator",
            "silicone insulator",
            "hybrid insulator",
            "transformer bushing",
            "cable accessories",
            "IEC 61109",
            "IEC 62217",
            "DPL",
            "Dena Power Line",
            "power transmission",
            "Iran insulator manufacturer",
            "عایق کامپوزیتی",
            "تابان نیرو",
          ],
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: localeOg(locale),
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
      siteName: brand,
      title: home.title,
      description: home.description,
      url: `/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: home.title,
      description: home.description,
    },
    icons: {
      icon: [
        {
          url: "/icon-light-32x32.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icon-dark-32x32.png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/icon.svg",
          type: "image/svg+xml",
        },
      ],
      apple: "/apple-icon.png",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: hreflangAlternates("/"),
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F5F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B0D" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = dirFor(locale);
  const lang = localeHtmlLang(locale);
  const home = pageSeoCopy("home", locale);
  const brand = brandMark(locale);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: locale === "fa" ? "تابان نیرو" : "Taban Niroo",
        alternateName:
          locale === "fa"
            ? "Taban Niroo"
            : "تابان نیرو",
        legalName: "Taban Niroo · Dena Power Line Insulators",
        url: `${siteUrl}/${locale}`,
        logo: `${siteUrl}/apple-icon.png`,
        image: `${siteUrl}/icon.svg`,
        foundingDate: "1997",
        description: home.description,
        inLanguage: lang,
        areaServed: [
          "IR",
          "IQ",
          "AF",
          "TR",
          "GH",
          "LR",
          "MA",
          "SO",
          "GR",
          "PE",
          "CO",
        ],
        knowsAbout:
          locale === "fa"
            ? [
                "مقره کامپوزیتی فشار قوی",
                "مقره هیبریدی",
                "بوشینگ ترانسفورماتور",
                "متعلقات کابل",
                "IEC 61109",
                "IEC 62217",
              ]
            : [
                "High-voltage composite insulators",
                "Hybrid insulators",
                "Transformer bushings",
                "Cable accessories",
                "IEC 61109",
                "IEC 62217",
              ],
        address: [
          {
            "@type": "PostalAddress",
            name: locale === "fa" ? "دفتر مرکزی" : "Headquarters",
            streetAddress: "Taban Niroo Bldg, Shiraz Special Economic Zone",
            addressLocality: "Shiraz",
            addressRegion: "Fars",
            addressCountry: "IR",
          },
          {
            "@type": "PostalAddress",
            name: locale === "fa" ? "دفتر تهران" : "Tehran office",
            streetAddress: "Office 9, No 64, Saeedi Ave, Africa St",
            addressLocality: "Tehran",
            addressCountry: "IR",
          },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+98-71-3717-5115",
            contactType: "sales",
            email: "info@taban-niroo.com",
            areaServed: "Worldwide",
            availableLanguage: ["en", "fa"],
          },
        ],
        sameAs: [...ORGANIZATION_SAME_AS],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: `${siteUrl}/${locale}`,
        name: brand,
        publisher: { "@id": `${siteUrl}#organization` },
        inLanguage: lang,
        description: home.description,
      },
    ],
  };

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${inter.variable} ${oswald.variable} ${estedad.variable} ${vazirmatnLocal.variable} ${locale === "fa" ? vazirmatnLocal.className : inter.className}`}
      suppressHydrationWarning
    >
      <body
        className={locale === "fa" ? "font-fa antialiased" : "font-sans antialiased"}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{if(sessionStorage.getItem("tn-intro-v2")==="1")document.documentElement.dataset.tnIntro="done"}catch(e){}})();`,
            }}
          />
          <a
            href="#main-content"
            className="fixed start-4 top-4 z-[100] -translate-y-[150%] rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background outline-offset-4 transition-transform duration-200 focus-visible:translate-y-0"
          >
            {locale === "fa" ? "پرش به محتوا" : "Skip to content"}
          </a>
          <LenisProvider />
          <LocaleDocumentSync />
          <SiteIntro />
          {children}
          <CookieConsent />
          <ConsentAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
