import localFont from "next/font/local";

/**
 * Persian type pair — self-hosted OFL files under `/fonts`.
 * Estedad = catalogue / display (Oswald’s role under `lang=fa`).
 * Vazirmatn = body / narrator (Inter’s role); Estedad sits as Latin fallback.
 */

export const estedad = localFont({
  src: [
    {
      path: "../fonts/estedad/Estedad-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/estedad/Estedad-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/estedad/Estedad-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/estedad/Estedad-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/estedad/Estedad-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-estedad",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});

export const vazirmatnLocal = localFont({
  src: [
    {
      path: "../fonts/vazirmatn/vazirmatn-wght.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/vazirmatn/vazirmatn-latin-wght.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/vazirmatn/vazirmatn-latin-ext-wght.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});
