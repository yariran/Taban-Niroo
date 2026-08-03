import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/require-admin";
import { readProductsManifest } from "@/lib/cms-products";
import { readSiteContent } from "@/lib/cms-content";
import { readBlogManifest } from "@/lib/cms-blog";
import { readGalleryManifest } from "@/lib/gallery-cms";
import { blobConfigured } from "@/lib/cms-store";
import { cmsPasswordConfigured } from "@/lib/cms-auth";
import { PRODUCTS } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [productsManifest, content, blog, gallery] = await Promise.all([
    readProductsManifest(),
    readSiteContent(),
    readBlogManifest(),
    readGalleryManifest(),
  ]);

  const productCount =
    productsManifest.products.length || PRODUCTS.length;
  const usingCmsProducts = productsManifest.products.length > 0;
  const publishedPosts = blog.posts.filter((p) => p.status === "published")
    .length;

  const cards = [
    {
      href: "/admin/products",
      title: "محصولات",
      value: String(productCount),
      note: usingCmsProducts
        ? "از مخزن CMS"
        : "پیش‌فرض کد (هنوز seed نشده)",
    },
    {
      href: "/admin/gallery",
      title: "گالری",
      value: String(gallery.items.length),
      note: gallery.items.length
        ? "تصاویر سفارشی"
        : "پیش‌فرض سایت",
    },
    {
      href: "/admin/content",
      title: "محتوا",
      value: content.updatedAt ? "فعال" : "—",
      note: "سکشن‌ها و صفحات",
    },
    {
      href: "/admin/blog",
      title: "بلاگ",
      value: `${publishedPosts} / ${blog.posts.length}`,
      note: "منتشرشده / کل",
    },
  ];

  return (
    <AdminShell activePath="/admin">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold">خلاصه وضعیت</h1>
        <p className="mt-2 text-sm text-[#5a6570]">
          مدیریت محتوای سایت تابان نیرو — تغییرات بدون نیاز به دیپلوی کد اعمال
          می‌شوند.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-xl border border-[#d8dee6] bg-white p-5 transition hover:border-[#0f1720]/40"
            >
              <p className="text-sm text-[#5a6570]">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-[#5a6570]">{card.note}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-[#d8dee6] bg-white p-5 text-sm">
          <p className="font-medium">وضعیت زیرساخت</p>
          <ul className="mt-3 space-y-1.5 text-[#5a6570]">
            <li>
              نام کاربری / رمز:{" "}
              {cmsPasswordConfigured() ? "تنظیم شده" : "تنظیم نشده"}
            </li>
            <li>
              Vercel Blob:{" "}
              {blobConfigured()
                ? "فعال (پروداکشن)"
                : "غیرفعال — ذخیره محلی در dev"}
            </li>
          </ul>
          <Link
            href="/admin/settings"
            className="mt-4 inline-block text-[#0f1720] underline underline-offset-2"
          >
            راهنمای تنظیمات
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
