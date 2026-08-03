import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/product-editor";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  await requireAdmin();
  return (
    <AdminShell activePath="/admin/products">
      <ProductEditor isNew />
    </AdminShell>
  );
}
