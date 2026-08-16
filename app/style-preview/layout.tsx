import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./preview.css";

/**
 * Route layout for the design sandbox.
 *
 * Scoped here rather than in the root layout on purpose — Geist Mono is
 * Terminal's label face and is only needed by this route. Loading it
 * globally would add a font to every page for a demo.
 */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
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
