import { AdminShell } from "@/components/admin/admin-shell";
import { blobConfigured } from "@/lib/cms-store";
import { cmsPasswordConfigured } from "@/lib/cms-auth";
import { requireAdmin } from "@/lib/require-admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <AdminShell activePath="/admin/settings">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold">تنظیمات و راهنما</h1>

        <div className="rounded-xl border border-[#d8dee6] bg-white p-5 text-sm leading-relaxed text-[#5a6570]">
          <p className="font-medium text-[#0f1720]">وضعیت فعلی</p>
          <ul className="mt-3 list-disc space-y-1 pr-5">
            <li>
              CMS_ADMIN_USERNAME / CMS_ADMIN_PASSWORD:{" "}
              {cmsPasswordConfigured() ? "تنظیم شده" : "تنظیم نشده"}
            </li>
            <li>
              BLOB_READ_WRITE_TOKEN:{" "}
              {blobConfigured() ? "فعال" : "غیرفعال (ذخیره محلی در توسعه)"}
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-[#d8dee6] bg-white p-5 text-sm leading-relaxed text-[#5a6570]">
          <p className="font-medium text-[#0f1720]">راهنمای سریع کارفرما</p>
          <ol className="mt-3 list-decimal space-y-3 pr-5">
            <li>
              <span className="font-medium text-[#0f1720]">محصولات:</span> از منوی{" "}
              <Link href="/admin/products" className="text-[#0f1720] underline">
                محصولات
              </Link>{" "}
              شروع کنید. اگر لیست خالی است، «بارگذاری از کاتالوگ فعلی» را بزنید.
              برای هر محصول می‌توانید نام، خانواده، خلاصه، تصویر، واریانت و جدول
              فنی را ویرایش کنید.
            </li>
            <li>
              <span className="font-medium text-[#0f1720]">عکس‌ها:</span> در فرم
              محتوا یا محصول، دکمه «آپلود تصویر» را بزنید (JPEG/PNG/WebP/GIF تا
              ۸ مگابایت). بعد از آپلود ذخیره را فراموش نکنید.
            </li>
            <li>
              <span className="font-medium text-[#0f1720]">محتوای صفحات:</span> در{" "}
              <Link href="/admin/content" className="text-[#0f1720] underline">
                محتوای صفحات
              </Link>{" "}
              بر اساس صفحه (خانه، درباره، …) فیلدها را پر کنید. فیلد خالی = متن
              پیش‌فرض سایت. معنی فیلدهای رایج:
              <ul className="mt-2 list-disc space-y-1 pr-5">
                <li>
                  <strong>برچسب بالای عنوان (eyebrow)</strong> — خط کوچک بالای تیتر
                </li>
                <li>
                  <strong>عنوان / خط دوم / خط سوم</strong> — تیتر اصلی صفحه یا
                  سکشن
                </li>
                <li>
                  <strong>متن دکمه / لینک دکمه (cta)</strong> — دکمه فراخوان و
                  آدرس آن مثل <code className="font-mono text-xs">/contact</code>
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium text-[#0f1720]">گالری:</span> عکس‌های
              ریل افقی صفحه اصلی را از{" "}
              <Link href="/admin/gallery" className="text-[#0f1720] underline">
                گالری محصولات
              </Link>{" "}
              مدیریت کنید (جابه‌جایی، alt، حذف).
            </li>
            <li>
              <span className="font-medium text-[#0f1720]">بلاگ:</span> مطلب را
              به‌صورت پیش‌نویس بسازید، بعد «منتشر» کنید. لینک{" "}
              <span className="font-medium text-[#0f1720]">Blog – R&amp;D</span>{" "}
              همیشه در منوی سایت عمومی دیده می‌شود؛ مطالب منتشرشده روی همان صفحه
              ظاهر می‌شوند.
            </li>
            <li>
              <span className="font-medium text-[#0f1720]">پیش‌نمایش:</span> بعد از
              ذخیره، با «مشاهده سایت» صفحه را در تب جدید باز کنید و یک‌بار
              رفرش سخت بزنید.
            </li>
          </ol>
        </div>

        <div className="rounded-xl border border-[#d8dee6] bg-white p-5 text-sm leading-relaxed text-[#5a6570]">
          <p className="font-medium text-[#0f1720]">راه‌اندازی فنی (یک‌بار)</p>
          <ol className="mt-3 list-decimal space-y-2 pr-5">
            <li>
              در Vercel یک Blob Store بسازید و{" "}
              <code className="font-mono text-xs">BLOB_READ_WRITE_TOKEN</code> را
              ست کنید.
            </li>
            <li>
              رمز قوی در{" "}
              <code className="font-mono text-xs">CMS_ADMIN_PASSWORD</code> و{" "}
              <code className="font-mono text-xs">CMS_SESSION_SECRET</code> قرار
              دهید.
            </li>
            <li>
              برای فرم تماس: Resend؛ برای محدودیت درخواست: Upstash Redis.
            </li>
            <li>
              اختیاری:{" "}
              <code className="font-mono text-xs">SENTRY_DSN</code> برای گزارش
              خطا.
            </li>
            <li>
              قبل از دیپلوی:{" "}
              <code className="font-mono text-xs">npm run check-env:strict</code>
            </li>
          </ol>
        </div>
      </div>
    </AdminShell>
  );
}
