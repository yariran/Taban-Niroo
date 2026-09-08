import {
  PRODUCTS,
  hasTechnicalTable,
  isProductListed,
  listProducts,
  localizeProduct,
  type Product,
  type ResolvedProduct,
} from "@/lib/products";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/get-dictionary";

export type ProductsManifest = {
  version: 1;
  updatedAt: string;
  products: Product[];
};

const PATHNAME = "cms/products.json";

function emptyManifest(): ProductsManifest {
  return { version: 1, updatedAt: new Date().toISOString(), products: [] };
}

export async function readProductsManifest(): Promise<ProductsManifest> {
  return readCmsJson(PATHNAME, emptyManifest());
}

export async function writeProductsManifest(
  products: Product[],
): Promise<ProductsManifest> {
  const manifest: ProductsManifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    products,
  };
  await writeCmsJson(PATHNAME, manifest);
  return manifest;
}

/** Full catalogue including hidden drafts — admin / CMS writes (raw localized fields). */
export async function getProducts(): Promise<Product[]> {
  try {
    const manifest = await readProductsManifest();
    if (manifest.products.length > 0) return manifest.products;
  } catch (err) {
    console.error("[cms-products] getProducts", err);
  }
  return [...PRODUCTS];
}

async function resolveLocale(locale?: Locale): Promise<Locale> {
  if (locale && isLocale(locale)) return locale;
  try {
    return await getLocale();
  } catch {
    return DEFAULT_LOCALE;
  }
}

/** Public catalogue — hidden omitted; text resolved for locale. */
export async function getPublicProducts(
  locale?: Locale,
): Promise<ResolvedProduct[]> {
  const loc = await resolveLocale(locale);
  return listProducts(await getProducts()).map((p) => localizeProduct(p, loc));
}

export async function getProductBySlugAsync(
  slug: string,
  locale?: Locale,
): Promise<ResolvedProduct | undefined> {
  const loc = await resolveLocale(locale);
  const products = await getProducts();
  const product = products.find((p) => p.id === slug);
  if (!product || !isProductListed(product)) return undefined;
  return localizeProduct(product, loc);
}

/** Admin / internal: resolve by slug even when hidden (raw). */
export async function getProductBySlugAdminAsync(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === slug);
}

export async function getAllProductSlugsAsync(): Promise<string[]> {
  return listProducts(await getProducts()).map((p) => p.id);
}

export async function getRelatedProductsAsync(
  slug: string,
  limit = 3,
  locale?: Locale,
): Promise<ResolvedProduct[]> {
  const loc = await resolveLocale(locale);
  const products = listProducts(await getProducts()).map((p) =>
    localizeProduct(p, loc),
  );
  const target = products.find((p) => p.id === slug);
  if (!target) return [];
  return products
    .filter((p) => p.id !== slug && p.family === target.family)
    .slice(0, limit);
}

export async function seedProductsFromCode(): Promise<ProductsManifest> {
  return writeProductsManifest([...PRODUCTS]);
}

export { hasTechnicalTable, isProductListed, listProducts, localizeProduct };
