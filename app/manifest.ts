import type { MetadataRoute } from "next";

/**
 * Web app manifest — drives "Add to homescreen" on Android/Chromium and
 * gives the site a proper installable identity. Colour tokens mirror
 * `globals.css` so dark/light mode bootstraps with the right hue.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Taban Niroo · Dena Power Line Insulators",
    short_name: "Taban Niroo",
    description:
      "High-voltage composite insulators and power transmission. IEC-tested. 11 kV–1000 kV. Shiraz, Iran.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon-dark-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
