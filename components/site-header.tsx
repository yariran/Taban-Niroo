import { Header } from "@/components/header";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { isBlogEnabledForLocale } from "@/lib/i18n";

/**
 * Primary nav. Blog – R&D appears only in locales that have posts; see
 * `isBlogEnabledForLocale`.
 */
export async function SiteHeader() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return (
    <Header
      brand={dict.brand}
      contactLabel={dict.nav.contact}
      navItems={[
        { label: dict.nav.company, href: "/about", hasMega: false },
        { label: dict.nav.products, href: "/products", hasMega: true },
        { label: dict.nav.projects, href: "/projects", hasMega: false },
        ...(isBlogEnabledForLocale(locale)
          ? [{ label: dict.nav.blog, href: "/blog", hasMega: false }]
          : []),
      ]}
    />
  );
}
