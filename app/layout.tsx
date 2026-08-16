import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/lenis-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { ConsentAnalytics } from "@/components/consent-analytics";
import { SiteIntro } from "@/components/site-intro";
import { getSiteUrl } from "@/lib/site-url";
import { ORGANIZATION_SAME_AS } from "@/lib/seo";
import "./globals.css";

/**
 * Self-hosted Inter (same typeface as rsms.me) via next/font — downloaded
 * at build time, served from `/_next/static`, no third-party font CDN on
 * the critical path.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  adjustFontFallback: true,
  preload: true,
});

/**
 * Display face for headlines only — tall, condensed, industrial-signage
 * character. Body copy and UI stay on Inter; Oswald is scoped to
 * `--font-hero-slogan` / `--font-hero` / `--font-headline` in globals.css.
 */
const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
  weight: ["500", "600", "700"],
  preload: true,
});

const siteDescription =
  "High-voltage composite insulators and power transmission. IEC-tested. 6-1000 kV. Shiraz, Iran.";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Taban Niroo | High-Voltage Composite Insulators",
    template: "%s | Taban Niroo",
  },
  description: siteDescription,
  applicationName: "Taban Niroo",
  authors: [{ name: "Taban Niroo · Dena Power Line Insulators" }],
  creator: "Taban Niroo",
  publisher: "Taban Niroo",
  keywords: [
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
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Taban Niroo",
    title: "Taban Niroo | High-Voltage Composite Insulators",
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Taban Niroo | High-Voltage Composite Insulators",
    description: siteDescription,
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
    canonical: "/",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /** Lets Android Chrome resize layout when the keyboard opens (contact form). */
  interactiveWidget: "resizes-content",
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EEE6" },
    { media: "(prefers-color-scheme: dark)", color: "#061428" },
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: "Taban Niroo",
      legalName: "Taban Niroo · Dena Power Line Insulators",
      url: siteUrl,
      logo: `${siteUrl}/apple-icon.png`,
      image: `${siteUrl}/icon.svg`,
      foundingDate: "1997",
      description: siteDescription,
      areaServed: ["IR", "IQ", "AF", "TR", "GH", "LR", "MA", "SO", "GR", "PE", "CO"],
      knowsAbout: [
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
          name: "Headquarters",
          streetAddress: "Taban Niroo Bldg, Shiraz Special Economic Zone",
          addressLocality: "Shiraz",
          addressRegion: "Fars",
          addressCountry: "IR",
        },
        {
          "@type": "PostalAddress",
          name: "Tehran office",
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
          availableLanguage: ["en"],
        },
      ],
      sameAs: [...ORGANIZATION_SAME_AS],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: "Taban Niroo",
      publisher: { "@id": `${siteUrl}#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
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
          {/* Skip intro flash on return visits within the same tab session. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{if(sessionStorage.getItem("tn-intro-seen")==="1")document.documentElement.dataset.tnIntro="done"}catch(e){}})();`,
            }}
          />
          <a
            href="#main-content"
            className="fixed left-4 top-4 z-[100] -translate-y-[150%] rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background outline-offset-4 transition-transform duration-200 focus-visible:translate-y-0"
          >
            Skip to content
          </a>
          <LenisProvider />
          <SiteIntro />
          {children}
          <CookieConsent />
          <ConsentAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
