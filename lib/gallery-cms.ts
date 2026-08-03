import { SITE_IMAGES } from "@/lib/site-images";
import {
  readCmsJson,
  writeCmsJson,
  uploadCmsFile,
  deleteCmsAsset,
  blobConfigured,
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
} from "@/lib/cms-store";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  pathname: string;
};

export type GalleryManifest = {
  version: 1;
  updatedAt: string;
  items: GalleryItem[];
};

const MANIFEST_PATHNAME = "cms/product-gallery.json";

export { blobConfigured, ALLOWED_IMAGE_TYPES };
export const MAX_GALLERY_BYTES = MAX_UPLOAD_BYTES;

function emptyManifest(): GalleryManifest {
  return { version: 1, updatedAt: new Date().toISOString(), items: [] };
}

function staticFallbackItems(): GalleryItem[] {
  return SITE_IMAGES.productGallery
    .filter((item) => Boolean(item.src))
    .map((item, index) => ({
      id: `static-${index}`,
      src: item.src,
      alt: item.alt,
      pathname: item.src,
    }));
}

export async function readGalleryManifest(): Promise<GalleryManifest> {
  return readCmsJson(MANIFEST_PATHNAME, emptyManifest());
}

export async function writeGalleryManifest(
  manifest: GalleryManifest,
): Promise<void> {
  const next: GalleryManifest = {
    ...manifest,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  await writeCmsJson(MANIFEST_PATHNAME, next);
}

export async function getProductGalleryItems(): Promise<GalleryItem[]> {
  try {
    const manifest = await readGalleryManifest();
    if (manifest.items.length > 0) return manifest.items;
  } catch (err) {
    console.error("[gallery-cms] getProductGalleryItems", err);
  }
  return staticFallbackItems();
}

export async function uploadGalleryFile(
  file: File,
  alt: string,
  prevalidated?: { mime: string; buffer: Buffer },
): Promise<GalleryItem> {
  const asset = await uploadCmsFile(file, "gallery", prevalidated);
  const id = asset.pathname.split("/").pop()?.replace(/\.\w+$/, "") ??
    `${Date.now().toString(36)}`;
  return {
    id,
    src: asset.url,
    alt: alt.trim() || "Taban Niroo product",
    pathname: asset.pathname,
  };
}

export async function deleteGalleryAsset(pathname: string): Promise<void> {
  if (!pathname || pathname.startsWith("static-") || pathname.startsWith("/images/")) {
    return;
  }
  await deleteCmsAsset(pathname);
}
