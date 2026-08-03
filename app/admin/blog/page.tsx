import { AdminShell } from "@/components/admin/admin-shell";
import { BlogAdminList } from "@/components/admin/blog-admin-list";
import { readBlogManifest } from "@/lib/cms-blog";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdmin();
  const { posts } = await readBlogManifest();

  return (
    <AdminShell activePath="/admin/blog">
      <BlogAdminList posts={posts} />
    </AdminShell>
  );
}
