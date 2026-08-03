import { promises as fs } from "node:fs";
import path from "node:path";
import { put, del, list } from "@vercel/blob";
import { mimeMatchesSniff, sniffImageMime } from "@/lib/image-sniff";

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "cms");

function localPathFor(pathname: string): string {
  return path.join(
    LOCAL_DATA_DIR,
    pathname.replace(/^cms\//, "").replace(/\//g, "__"),
  );
}

export async function readCmsJson<T>(pathname: string, fallback: T): Promise<T> {
  try {
    if (blobConfigured()) {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      const { blobs } = await list({ prefix: pathname, limit: 5, token });
      const hit = blobs.find((b) => b.pathname === pathname);
      if (!hit) return fallback;
      const res = await fetch(hit.url, { cache: "no-store" });
      if (!res.ok) return fallback;
      return (await res.json()) as T;
    }

    const raw = await fs.readFile(localPathFor(pathname), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Persist CMS JSON with a local `.bak` snapshot and atomic rename on disk.
 * Blob overwrites use allowOverwrite (Vercel Blob has its own durability).
 */
export async function writeCmsJson<T>(pathname: string, data: T): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (blobConfigured()) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    // Keep a single previous revision (pathname + ".prev") for rollback.
    try {
      const { blobs } = await list({ prefix: pathname, limit: 2, token });
      const hit = blobs.find((b) => b.pathname === pathname);
      if (hit) {
        const prev = await fetch(hit.url, { cache: "no-store" });
        if (prev.ok) {
          await put(`${pathname}.prev`, await prev.text(), {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: "application/json",
            token,
          });
        }
      }
    } catch (err) {
      console.warn("[cms-store] backup skipped", err);
    }

    await put(pathname, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      token,
    });
    return;
  }

  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
  const target = localPathFor(pathname);
  try {
    await fs.copyFile(target, `${target}.bak`);
  } catch {
    /* no prior file */
  }
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, body, "utf8");
  await fs.rename(tmp, target);
}

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function safeExt(name: string, mime: string): string {
  const fromName = path.extname(name).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(fromName)) {
    return fromName === ".jpeg" ? ".jpg" : fromName;
  }
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  return ".jpg";
}

export type UploadedAsset = {
  url: string;
  pathname: string;
};

export type UploadValidation =
  | { ok: true; mime: string; buffer: Buffer }
  | { ok: false; error: string };

/** Size + declared MIME + magic-byte sniff. */
export async function validateImageUpload(
  file: File,
): Promise<UploadValidation> {
  if (!file || file.size === 0) {
    return { ok: false, error: "file required" };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "File larger than 8 MB." };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "Unsupported type. Use JPEG, PNG, WebP, or GIF.",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageMime(buffer);
  if (!sniffed) {
    return {
      ok: false,
      error: "File content is not a valid image.",
    };
  }
  if (!mimeMatchesSniff(file.type, sniffed)) {
    return {
      ok: false,
      error: "Declared file type does not match file contents.",
    };
  }

  return { ok: true, mime: sniffed, buffer };
}

export async function uploadCmsFile(
  file: File,
  folder = "uploads",
  prevalidated?: { mime: string; buffer: Buffer },
): Promise<UploadedAsset> {
  let validated: { mime: string; buffer: Buffer };
  if (prevalidated) {
    validated = prevalidated;
  } else {
    const result = await validateImageUpload(file);
    if (!result.ok) throw new Error(result.error);
    validated = { mime: result.mime, buffer: result.buffer };
  }

  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${id}${safeExt(file.name, validated.mime)}`;

  if (blobConfigured()) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const pathname = `cms/${folder}/${filename}`;
    const blob = await put(pathname, validated.buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: validated.mime,
      token,
    });
    return { url: blob.url, pathname: blob.pathname };
  }

  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  const diskPath = path.join(LOCAL_UPLOAD_DIR, filename);
  await fs.writeFile(diskPath, validated.buffer);
  return {
    url: `/uploads/cms/${filename}`,
    pathname: `/uploads/cms/${filename}`,
  };
}

export async function deleteCmsAsset(pathname: string): Promise<void> {
  if (!pathname || pathname.startsWith("/images/")) return;

  if (blobConfigured() && !pathname.startsWith("/")) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    await del(pathname, { token });
    return;
  }

  if (pathname.startsWith("/uploads/")) {
    const diskPath = path.join(process.cwd(), "public", pathname);
    await fs.unlink(diskPath).catch(() => {});
  }
}
