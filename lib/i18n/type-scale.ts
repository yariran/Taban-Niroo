import type { Locale } from "@/lib/i18n/config";

/** Call-site display clamps — CSS cannot override arbitrary per-heading sizes. */
export function heroSloganClamp(lang: Locale): string {
  return lang === "fa"
    ? "text-[clamp(1.6rem,5.4vw,4.6rem)]"
    : "text-[clamp(2.4rem,7vw,5.5rem)]";
}

export function philosophyStaticClamp(lang: Locale): string {
  return lang === "fa"
    ? "text-[clamp(1.6rem,6.2vw,3.6rem)]"
    : "text-[clamp(2rem,8vw,4.5rem)]";
}

export function philosophyStickyClamp(lang: Locale): string {
  return lang === "fa"
    ? "text-[clamp(1.6rem,5.4vw,4.6rem)]"
    : "text-[clamp(2rem,7vw,6rem)]";
}

/** Page h1 / section h2 ladder used across about, projects, materials, … */
export function pageHeadingScale(lang: Locale): string {
  return lang === "fa"
    ? "text-2xl md:text-3xl lg:text-[2.5rem]"
    : "text-3xl md:text-4xl lg:text-5xl";
}
