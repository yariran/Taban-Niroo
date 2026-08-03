import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireCmsMutation } from "@/lib/cms-api";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonError, jsonOk, jsonTooMany } from "@/lib/api/response";
import { getProducts, writeProductsManifest } from "@/lib/cms-products";
import { rateLimit } from "@/lib/rate-limit";
import { productPatchSchema, productIdSchema } from "@/lib/schemas/cms";
import type { Product } from "@/lib/products";

type Ctx = { params: Promise<{ id: string }> };

function revalidateProductSurfaces(id: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/sitemap.xml");
}

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) {
    return jsonError(404, "Not found", { code: "not_found" });
  }
  return NextResponse.json(product, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const { id } = await ctx.params;
  const parsed = await parseJsonBody(request, productPatchSchema);
  if (!parsed.ok) return parsed.response;

  const patch = parsed.data;
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index < 0) {
    return jsonError(404, "Not found", { code: "not_found" });
  }

  let nextId = id;
  if (patch.id !== undefined) {
    const idCheck = productIdSchema.safeParse(patch.id);
    if (!idCheck.success) {
      return jsonError(400, "Invalid product id", { code: "validation_error" });
    }
    nextId = idCheck.data;
  }

  if (nextId !== id && products.some((p) => p.id === nextId)) {
    return jsonError(409, "Product id already exists", { code: "conflict" });
  }

  const updated: Product = {
    ...products[index]!,
    ...patch,
    id: nextId,
  } as Product;
  const next = [...products];
  next[index] = updated;
  await writeProductsManifest(next);
  revalidateProductSurfaces(id);
  if (nextId !== id) revalidateProductSurfaces(nextId);
  return jsonOk({ ok: true, product: updated });
}

export async function DELETE(request: Request, ctx: Ctx) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const { id } = await ctx.params;
  const products = await getProducts();
  if (!products.some((p) => p.id === id)) {
    return jsonError(404, "Not found", { code: "not_found" });
  }
  await writeProductsManifest(products.filter((p) => p.id !== id));
  revalidateProductSurfaces(id);
  return jsonOk({ ok: true });
}
