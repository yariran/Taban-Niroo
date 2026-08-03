import { AdminShell } from "@/components/admin/admin-shell";
import { BlogEditor } from "@/components/admin/blog-editor";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminNewBlogPage() {
  await requireAdmin();
  return (
    <AdminShell activePath="/admin/blog">
      <BlogEditor isNew />
    </AdminShell>
  );
}
