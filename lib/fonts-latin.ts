import localFont from "next/font/local";

/**
 * Latin type — self-hosted, the Latin counterpart to `fonts-fa.ts`.
 *
 * NOTHING HERE IS FETCHED AT BUILD TIME. Both faces used to come from
 * `next/font/google`, which downloads the file from Google while the site
 * builds. That is a network dependency in the build, and it is not
 * theoretical: a clean build failed outright with "Failed to fetch `Oswald`
 * from Google Fonts" on a momentary blip, and minutes later a dev server
 * served 500s on every route because Inter could not be reached either —
 * both times with nothing wrong in the repository. A build that needs the
 * internet to succeed fails in CI for reasons no commit explains, so the
 * files are committed, exactly as the Persian pair already was.
 *
 * ONE VARIABLE FILE EACH, no `weight` list. Asking Google for static
 * instances of a variable family was its own, separate bug: the CSS API
 * answers those with dynamic-subset URLs (`/l/font?kit=...&skey=...`) that
 * Turbopack's font replacer rejects, which filled every cold dev start with
 * resolve errors.
 *
 * `latin` only, which is what both Google loaders were configured for, so
 * glyph coverage is unchanged and characters outside it fall back per glyph
 * exactly as before. Add a `-latin-ext-` file beside one of these if that
 * ever needs to change.
 *
 * `adjustFontFallback` keeps a metric-matched fallback face so the swap does
 * not reflow. The Persian faces pass `false` because neither Arial nor Times
 * is a sane metric source for Arabic script; for these two Latin grotesques
 * Arial is the closer of the two options `next/font/local` offers.
 */

/** Body / narrator — `--font-inter`, the default `font-sans`. */
export const inter = localFont({
  src: [
    {
      path: "../fonts/inter/inter-latin-wght.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: true,
});

/**
 * Display / catalogue — `--font-hero`, `--font-headline` and
 * `--font-hero-slogan` all resolve to it (see `globals.css`). Oswald's `wght`
 * axis runs 200-700 and the three weights this site uses on that role — 500,
 * 600 and 700 — all sit inside it.
 */
export const oswald = localFont({
  src: [
    {
      path: "../fonts/oswald/oswald-latin-wght.woff2",
      weight: "200 700",
      style: "normal",
    },
  ],
  variable: "--font-oswald",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: true,
});
