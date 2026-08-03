import {
  PRODUCTS,
  hasTechnicalTable,
  isProductListed,
  listProducts,
  type Product,
} from "@/lib/products";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";

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

/** Full catalogue including hidden drafts — admin / CMS writes. */
export async function getProducts(): Promise<Product[]> {
  try {
    const manifest = await readProductsManifest();
    if (manifest.products.length > 0) return manifest.products;
  } catch (err) {
    console.error("[cms-products] getProducts", err);
  }
  return [...PRODUCTS];
}

/** Public catalogue — hidden / empty-datasheet products omitted. */
export async function getPublicProducts(): Promise<Product[]> {
  return listProducts(await getProducts());
}

export async function getProductBySlugAsync(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  const product = products.find((p) => p.id === slug);
  if (!product || !isProductListed(product)) return undefined;
  return product;
}

/** Admin / internal: resolve by slug even when hidden. */
export async function getProductBySlugAdminAsync(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === slug);
}

export async function getAllProductSlugsAsync(): Promise<string[]> {
  return (await getPublicProducts()).map((p) => p.id);
}

export async function getRelatedProductsAsync(
  slug: string,
  limit = 3,
): Promise<Product[]> {
  const products = await getPublicProducts();
  const target = products.find((p) => p.id === slug);
  if (!target) return [];
  return products
    .filter((p) => p.id !== slug && p.family === target.family)
    .slice(0, limit);
}

export async function seedProductsFromCode(): Promise<ProductsManifest> {
  return writeProductsManifest([...PRODUCTS]);
}

export { hasTechnicalTable, isProductListed, listProducts };
