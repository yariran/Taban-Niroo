import { describe, expect, it } from "vitest";
import { hreflangAlternates, pageSocial, pageSocialFor } from "@/lib/seo";

describe("pageSocial hreflang", () => {
  it("emits en, fa-IR, and x-default", () => {
    const alt = hreflangAlternates("/products");
    expect(alt).toEqual({
      en: "/en/products",
      "fa-IR": "/fa/products",
      "x-default": "/en/products",
    });
  });

  it("sets canonical for the active locale", () => {
    const meta = pageSocial({
      title: "Products",
      description: "Catalogue",
      path: "/products",
      locale: "fa",
    });
    expect(meta.alternates?.canonical).toBe("/fa/products");
    expect(meta.alternates?.languages?.["fa-IR"]).toBe("/fa/products");
    expect(meta.openGraph?.locale).toBe("fa_IR");
  });

  it("uses independent FA copy via pageSocialFor", () => {
    const fa = pageSocialFor("home", "fa");
    const en = pageSocialFor("home", "en");
    expect(String(fa.title)).toContain("تابان نیرو");
    expect(String(en.title)).toContain("Taban Niroo");
    expect(fa.description).not.toBe(en.description);
  });
});
