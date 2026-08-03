import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireCmsMutation } from "@/lib/cms-api";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonError, jsonOk, jsonTooMany } from "@/lib/api/response";
import {
  deleteGalleryAsset,
  readGalleryManifest,
  uploadGalleryFile,
  writeGalleryManifest,
  type GalleryItem,
} from "@/lib/gallery-cms";
import { validateImageUpload } from "@/lib/cms-store";
import { rateLimit } from "@/lib/rate-limit";
import {
  galleryDeleteSchema,
  galleryPutSchema,
} from "@/lib/schemas/cms";

function revalidateGallerySurfaces() {
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

/** Public list for the site + admin. */
export async function GET() {
  const manifest = await readGalleryManifest();
  return NextResponse.json(manifest, {
    headers: { "Cache-Control": "no-store" },
  });
}

/** Upload one or more images. multipart/form-data: files + optional alt */
export async function POST(request: Request) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-upload");
  if (!limited.ok) {
    return jsonTooMany("Too many uploads. Try again later.", limited.retryAfterSec);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, "Invalid form data", { code: "invalid_form" });
  }

  const altDefault = String(form.get("alt") ?? "").trim();
  const files = form
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return jsonError(400, "No files uploaded.", { code: "validation_error" });
  }
  if (files.length > 20) {
    return jsonError(400, "Upload at most 20 files at a time.", {
      code: "validation_error",
    });
  }

  const validatedFiles: { file: File; mime: string; buffer: Buffer }[] = [];
  for (const file of files) {
    const validated = await validateImageUpload(file);
    if (!validated.ok) {
      return jsonError(400, `${file.name}: ${validated.error}`, {
        code: "validation_error",
      });
    }
    validatedFiles.push({
      file,
      mime: validated.mime,
      buffer: validated.buffer,
    });
  }

  const manifest = await readGalleryManifest();
  const added: GalleryItem[] = [];

  try {
    for (const { file, mime, buffer } of validatedFiles) {
      const item = await uploadGalleryFile(file, altDefault || file.name, {
        mime,
        buffer,
      });
      added.push(item);
      manifest.items.push(item);
    }
  } catch (err) {
    console.error("[cms-gallery] upload", err);
    return jsonError(500, "Upload failed.", { code: "upload_failed" });
  }

  await writeGalleryManifest(manifest);
  revalidateGallerySurfaces();
  return jsonOk({ ok: true, added, items: manifest.items });
}

/**
 * Replace full ordered list (reorder / edit alts).
 * Body: { items: GalleryItem[] }
 */
export async function PUT(request: Request) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const parsed = await parseJsonBody(request, galleryPutSchema);
  if (!parsed.ok) return parsed.response;

  const current = await readGalleryManifest();
  const byId = new Map(current.items.map((i) => [i.id, i]));
  const nextItems: GalleryItem[] = [];

  for (const raw of parsed.data.items) {
    const existing = byId.get(raw.id);
    if (!existing) continue;
    nextItems.push({
      ...existing,
      alt: (raw.alt ?? existing.alt).trim() || existing.alt,
    });
  }

  const manifest = {
    version: 1 as const,
    updatedAt: new Date().toISOString(),
    items: nextItems,
  };
  await writeGalleryManifest(manifest);
  revalidateGallerySurfaces();
  return jsonOk({ ok: true, items: manifest.items });
}

/** Delete by id. Body: { id: string } */
export async function DELETE(request: Request) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const parsed = await parseJsonBody(request, galleryDeleteSchema);
  if (!parsed.ok) return parsed.response;

  const { id } = parsed.data;
  const manifest = await readGalleryManifest();
  const target = manifest.items.find((i) => i.id === id);
  if (!target) {
    return jsonError(404, "Not found", { code: "not_found" });
  }

  await deleteGalleryAsset(target.pathname);
  manifest.items = manifest.items.filter((i) => i.id !== id);
  await writeGalleryManifest(manifest);
  revalidateGallerySurfaces();
  return jsonOk({ ok: true, items: manifest.items });
}
