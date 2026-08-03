import { getProductGalleryItems } from "@/lib/gallery-cms";
import { getSiteContent } from "@/lib/cms-content";
import { ProductGalleryRail } from "@/components/sections/product-gallery-rail";
import { cmsText } from "@/lib/cms-resolve";

/**
 * Product gallery — loads images from the CMS (`/admin/gallery`) when
 * present, otherwise falls back to `SITE_IMAGES.productGallery`.
 */
export async function ProductGallerySection() {
  const [items, content] = await Promise.all([
    getProductGalleryItems(),
    getSiteContent(),
  ]);
  const label = cmsText(
    content.home.productGallery ?? content.home.gallery,
    "title",
    "Scroll or drag to pan",
  );
  return <ProductGalleryRail items={items} panHint={label} />;
}
