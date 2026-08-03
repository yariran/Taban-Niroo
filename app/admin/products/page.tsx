import { AdminShell } from "@/components/admin/admin-shell";
import { ProductsAdminList } from "@/components/admin/products-admin-list";
import { getProducts, readProductsManifest } from "@/lib/cms-products";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const [products, manifest] = await Promise.all([
    getProducts(),
    readProductsManifest(),
  ]);

  return (
    <AdminShell activePath="/admin/products">
      <ProductsAdminList
        products={products}
        sourcedFromCms={manifest.products.length > 0}
      />
    </AdminShell>
  );
}
