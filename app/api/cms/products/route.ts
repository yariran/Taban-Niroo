import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireCmsAuthResponse, requireCmsMutation } from "@/lib/cms-api";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonError, jsonOk, jsonTooMany } from "@/lib/api/response";
import {
  readProductsManifest,
  seedProductsFromCode,
  writeProductsManifest,
  getProducts,
} from "@/lib/cms-products";
import { rateLimit } from "@/lib/rate-limit";
import { productSchema, productsPutSchema } from "@/lib/schemas/cms";
import type { Product } from "@/lib/products";

function revalidateProductSurfaces() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath("/sitemap.xml");
}

/** Public catalogue read (for site / mega-menu). Auth not required. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const seed = url.searchParams.get("seed");

  if (seed === "1") {
    // Authenticated only — browsers often omit Origin on same-origin GET.
    const denied = await requireCmsAuthResponse();
    if (denied) return denied;
    const manifest = await seedProductsFromCode();
    revalidateProductSurfaces();
    return NextResponse.json(manifest);
  }

  const products = await getProducts();
  const { listProducts } = await import("@/lib/products");
  const listed = listProducts(products);
  const manifest = await readProductsManifest();
  return NextResponse.json(
    {
      version: 1,
      updatedAt: manifest.updatedAt,
      sourcedFromCms: manifest.products.length > 0,
      products: listed,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

/** Replace entire catalogue. Body: { products: Product[] } */
export async function PUT(request: Request) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const parsed = await parseJsonBody(request, productsPutSchema);
  if (!parsed.ok) return parsed.response;

  const manifest = await writeProductsManifest(
    parsed.data.products as Product[],
  );
  revalidateProductSurfaces();
  for (const p of manifest.products) {
    revalidatePath(`/products/${p.id}`);
  }
  return jsonOk({ ok: true, ...manifest });
}

/** Create one product. Body: Product */
export async function POST(request: Request) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const parsed = await parseJsonBody(request, productSchema);
  if (!parsed.ok) return parsed.response;

  const product = parsed.data as Product;
  const current = await getProducts();
  if (current.some((p) => p.id === product.id)) {
    return jsonError(409, "Product id already exists", {
      code: "conflict",
    });
  }

  const manifest = await writeProductsManifest([...current, product]);
  revalidateProductSurfaces();
  revalidatePath(`/products/${product.id}`);
  return jsonOk({ ok: true, product, ...manifest });
}
