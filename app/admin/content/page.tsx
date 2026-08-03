import { AdminShell } from "@/components/admin/admin-shell";
import { ContentAdminClient } from "@/components/admin/content-admin-client";
import { getSiteContent } from "@/lib/cms-content";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  await requireAdmin();
  const content = await getSiteContent();

  return (
    <AdminShell activePath="/admin/content">
      <ContentAdminClient initial={content} />
    </AdminShell>
  );
}
