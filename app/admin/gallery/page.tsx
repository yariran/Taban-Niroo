import { AdminShell } from "@/components/admin/admin-shell";
import { GalleryAdminClient } from "@/components/admin/gallery-admin-client";
import { cmsPasswordConfigured } from "@/lib/cms-auth";
import { blobConfigured } from "@/lib/cms-store";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAdmin();

  return (
    <AdminShell activePath="/admin/gallery">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold">گالری محصولات</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#5a6570]">
          تصاویر گالری محصول در صفحه اصلی. تا وقتی تصویری آپلود نشود، سایت از
          تصاویر پیش‌فرض کد استفاده می‌کند.
        </p>
        <div className="mt-8" dir="ltr">
          <GalleryAdminClient
            passwordConfigured={cmsPasswordConfigured()}
            blobConfigured={blobConfigured()}
            embedded
          />
        </div>
      </div>
    </AdminShell>
  );
}
