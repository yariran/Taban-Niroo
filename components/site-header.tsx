import { Header } from "@/components/header";
import { getDictionary } from "@/lib/i18n/get-dictionary";

/** Always exposes primary nav including Blog – R&D. */
export async function SiteHeader() {
  const dict = await getDictionary();
  return (
    <Header
      brand={dict.brand}
      contactLabel={dict.nav.contact}
      navItems={[
        { label: dict.nav.company, href: "/about", hasMega: false },
        { label: dict.nav.products, href: "/products", hasMega: true },
        { label: dict.nav.projects, href: "/projects", hasMega: false },
        { label: dict.nav.blog, href: "/blog", hasMega: false },
      ]}
    />
  );
}
