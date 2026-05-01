import React from "react";
import type { Metadata, Viewport } from "next";
import { Oswald } from "next/font/google";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/syne/index.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/lenis-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteDescription =
  "High-voltage composite insulators and power transmission. IEC-tested. 11 kV–1000 kV. Shiraz, Iran.";

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
    canonical: siteUrl,
  },
};

const fontHeroSlogan = Oswald({
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hero-slogan",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
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
      logo: `${siteUrl}/icon.svg`,
      foundingDate: "1998",
      description: siteDescription,
      areaServed: ["IR", "IQ", "AF", "GH", "LR", "MA", "SO", "GR", "PE", "CO"],
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
      sameAs: ["https://www.taban-niroo.com"],
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
      className={fontHeroSlogan.variable}
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
          <a
            href="#main-content"
            className="fixed left-4 top-4 z-[100] -translate-y-[150%] rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background outline-offset-4 transition-transform duration-200 focus-visible:translate-y-0"
          >
            Skip to content
          </a>
          <LenisProvider />
          {children}
          <CookieConsent />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
