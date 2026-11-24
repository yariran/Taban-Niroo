import type { Metadata } from "next";
import localFont from "next/font/local";
import "./preview.css";

/**
 * Route layout for the design sandbox.
 *
 * Scoped here rather than in the root layout on purpose — Geist Mono is
 * Terminal's label face and is only needed by this route. Loading it
 * globally would add a font to every page for a demo.
 *
 * Self-hosted like every other face on this site (`fonts/README.md`). It is
 * an internal, noindex sandbox, but `next build` builds this route too, so
 * a `next/font/google` import here would have kept the whole build dependent
 * on reaching Google — which is the failure the other faces were moved to
 * avoid. One variable file, no weight list, for the same reasons as those.
 */
const geistMono = localFont({
  src: [
    {
      path: "../../fonts/geist-mono/geist-mono-latin-wght.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Style Preview — Terminal-language study",
  description:
    "Internal design sandbox: Taban Niroo content in the Terminal Industries visual language.",
  robots: { index: false, follow: false },
};

export default function StylePreviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`tp ${geistMono.variable}`}>{children}</div>;
}
