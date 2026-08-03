import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/product-editor";
import { getProductBySlugAsync } from "@/lib/cms-products";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const product = await getProductBySlugAsync(id);
  if (!product) notFound();

  return (
    <AdminShell activePath="/admin/products">
      <ProductEditor isNew={false} initial={product} />
    </AdminShell>
  );
}
