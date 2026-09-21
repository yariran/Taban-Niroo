"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { AdminLocaleToggle } from "@/components/admin/admin-locale-toggle";
import type { Locale } from "@/lib/i18n";
import { joinLocalized, splitLocalized } from "@/lib/i18n/localize";
import {
  FAMILY_ORDER,
  type Product,
  type ProductFamilyId,
  type ProductTechnicalRow,
  type ProductVariant,
} from "@/lib/products";

const inputClass =
  "mt-1.5 w-full rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm";

type TextPair = { en: string; fa: string };
type LocalizedDrafts = {
  subFamily: TextPair;
  summary: TextPair;
  applications: TextPair;
};

/** Specs + meta + Latin name; bilingual copy lives in `LocalizedDrafts`. */
type ProductShell = Omit<
  Product,
  "subFamily" | "summary" | "applications"
>;

function draftsFrom(p?: Product): LocalizedDrafts {
  return {
    subFamily: splitLocalized(p?.subFamily),
    summary: splitLocalized(p?.summary),
    applications: splitLocalized(p?.applications),
  };
}

function shellFrom(p?: Product): ProductShell {
  if (!p) {
    return {
      id: "",
      name: "",
      family: FAMILY_ORDER[0],
      catalogueRef: "",
      voltageClass: "",
      standard: "",
      image: null,
      order: 0,
      variants: [],
    };
  }
  return {
    id: p.id,
    name: p.name,
    family: p.family,
    catalogueRef: p.catalogueRef,
    voltageClass: p.voltageClass,
    standard: p.standard,
    image: p.image,
    order: p.order,
    hidden: p.hidden,
    variants: p.variants,
  };
}

const TECH_FIELDS: { key: keyof ProductTechnicalRow; label: string }[] = [
  { key: "shedNo", label: "Shed No." },
  { key: "ratedVoltage", label: "Rated voltage" },
  { key: "sml", label: "SML" },
  { key: "couplingSize", label: "Coupling" },
  { key: "sectionLength", label: "Section length" },
  { key: "arcingDistance", label: "Arcing distance" },
  { key: "shedDiameter", label: "Shed diameter" },
  { key: "shedSpacing", label: "Shed spacing" },
  { key: "minimumCreepage", label: "Min creepage" },
  { key: "impulseWithstand", label: "Impulse +" },
  { key: "impulseNegative", label: "Impulse −" },
  { key: "switchingWithstand", label: "Switching impulse" },
  { key: "dryWithstand", label: "Dry withstand" },
  { key: "wetWithstand", label: "Wet withstand" },
  { key: "weight", label: "Weight" },
];

export function ProductEditor({
  initial,
  isNew,
}: {
  initial?: Product;
  isNew: boolean;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [product, setProduct] = useState<ProductShell>(() => shellFrom(initial));
  const [drafts, setDrafts] = useState<LocalizedDrafts>(() =>
    draftsFrom(initial),
  );
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fieldDir = locale === "fa" ? "rtl" : "ltr";

  function update<K extends keyof ProductShell>(
    key: K,
    value: ProductShell[K],
  ) {
    setProduct((prev) => ({ ...prev, [key]: value }));
  }

  function updateText<K extends keyof LocalizedDrafts>(
    key: K,
    value: string,
  ) {
    setDrafts((prev) => ({
      ...prev,
      [key]: { ...prev[key], [locale]: value },
    }));
  }

  function updateVariant(index: number, patch: Partial<ProductVariant>) {
    setProduct((prev) => {
      const variants = [...(prev.variants ?? [])];
      variants[index] = { ...variants[index]!, ...patch };
      return { ...prev, variants };
    });
  }

  function updateTech(
    index: number,
    key: keyof ProductTechnicalRow,
    value: string,
  ) {
    setProduct((prev) => {
      const variants = [...(prev.variants ?? [])];
      const v = variants[index]!;
      variants[index] = {
        ...v,
        technical: { ...(v.technical ?? {}), [key]: value },
      };
      return { ...prev, variants };
    });
  }

  async function uploadImage(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "products");
      const res = await fetch("/api/cms/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        url?: string;
      };
      if (!res.ok || !data.url) {
        setError(data.error ?? "آپلود ناموفق");
        return;
      }
      update("image", data.url);
      setStatus("تصویر آپلود شد");
    } catch {
      setError("خطای شبکه");
    } finally {
      setBusy(false);
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setStatus(null);
    if (!product.name.trim()) {
      setError("نام (لاتین) الزامی است");
      setBusy(false);
      return;
    }
    try {
      const payload: Product = {
        ...product,
        id: product.id.trim(),
        name: product.name.trim(),
        subFamily: joinLocalized(drafts.subFamily.en, drafts.subFamily.fa),
        summary: joinLocalized(drafts.summary.en, drafts.summary.fa),
        applications: joinLocalized(
          drafts.applications.en,
          drafts.applications.fa,
        ),
        image: product.image || null,
        variants: product.variants?.length ? product.variants : undefined,
      };

      const res = isNew
        ? await fetch("/api/cms/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/cms/products/${initial!.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "ذخیره ناموفق");
        return;
      }
      setStatus("ذخیره شد");
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("خطای شبکه");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/products"
            className="text-sm text-[#5a6570] hover:text-[#0f1720]"
          >
            ← بازگشت به لیست
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">
            {isNew ? "افزودن محصول" : "ویرایش محصول"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminLocaleToggle value={locale} onChange={setLocale} disabled={busy} />
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-[#0f1720] px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {busy ? "در حال ذخیره…" : "ذخیره"}
          </button>
        </div>
      </div>

      {(status || error) && (
        <p className={`text-sm ${error ? "text-red-600" : "text-[#5a6570]"}`}>
          {error ?? status}
        </p>
      )}

      <p className="text-xs text-[#5a6570]">
        نام محصول همیشه لاتین است. زیرخانواده / خلاصه / کاربردها به‌ازای زبان
        ویرایش می‌شوند. مشخصات فنی (کد، ولتاژ، ابعاد) مشترک‌اند. فارسی خالی → روی
        سایت انگلیسی نمایش داده می‌شود.
      </p>

      <section className="space-y-4 rounded-xl border border-[#d8dee6] bg-white p-5">
        <h2 className="font-medium">اطلاعات پایه</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="شناسه (slug URL)">
            <input
              required
              value={product.id}
              onChange={(e) => update("id", e.target.value)}
              className={inputClass}
              dir="ltr"
            />
          </Field>
          <Field label="نام (Latin)">
            <input
              required
              value={product.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              dir="ltr"
            />
          </Field>
          <Field label="خانواده">
            <select
              value={product.family}
              onChange={(e) =>
                update("family", e.target.value as ProductFamilyId)
              }
              className={inputClass}
              dir="ltr"
            >
              {FAMILY_ORDER.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={
              locale === "fa" ? "زیرخانواده (فارسی)" : "زیرخانواده (English)"
            }
          >
            <input
              value={drafts.subFamily[locale]}
              onChange={(e) => updateText("subFamily", e.target.value)}
              className={inputClass}
              dir={fieldDir}
            />
          </Field>
          <Field label="مرجع کاتالوگ">
            <input
              value={product.catalogueRef}
              onChange={(e) => update("catalogueRef", e.target.value)}
              className={inputClass}
              dir="ltr"
            />
          </Field>
          <Field label="ترتیب (order)">
            <input
              type="number"
              value={product.order}
              onChange={(e) => update("order", Number(e.target.value) || 0)}
              className={inputClass}
              dir="ltr"
            />
          </Field>
          <Field label="کلاس ولتاژ">
            <input
              value={product.voltageClass ?? ""}
              onChange={(e) => update("voltageClass", e.target.value)}
              className={inputClass}
              dir="ltr"
            />
          </Field>
          <Field label="استاندارد">
            <input
              value={product.standard ?? ""}
              onChange={(e) => update("standard", e.target.value)}
              className={inputClass}
              dir="ltr"
            />
          </Field>
        </div>
        <Field
          label={locale === "fa" ? "خلاصه (فارسی)" : "خلاصه (English)"}
        >
          <textarea
            rows={3}
            value={drafts.summary[locale]}
            onChange={(e) => updateText("summary", e.target.value)}
            className={inputClass}
            dir={fieldDir}
          />
        </Field>
        <Field
          label={
            locale === "fa" ? "کاربردها (فارسی)" : "کاربردها (English)"
          }
        >
          <textarea
            rows={2}
            value={drafts.applications[locale]}
            onChange={(e) => updateText("applications", e.target.value)}
            className={inputClass}
            dir={fieldDir}
          />
        </Field>
        <Field label="تصویر محصول">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={product.image ?? ""}
              onChange={(e) => update("image", e.target.value || null)}
              className={`${inputClass} flex-1`}
              dir="ltr"
              placeholder="/images/... یا URL"
            />
            <label className="cursor-pointer rounded-md border border-[#cfd6de] px-3 py-2 text-sm">
              آپلود
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadImage(f);
                }}
              />
            </label>
          </div>
          {product.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt=""
              className="mt-3 h-28 rounded-md border border-[#e8ecf0] object-contain bg-white p-2"
            />
          )}
        </Field>
      </section>

      <section className="space-y-4 rounded-xl border border-[#d8dee6] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-medium">واریانت‌ها و جدول فنی</h2>
          <button
            type="button"
            className="rounded-md border border-[#cfd6de] px-3 py-1.5 text-sm"
            onClick={() =>
              update("variants", [
                ...(product.variants ?? []),
                { code: "", voltage: "" },
              ])
            }
          >
            افزودن واریانت
          </button>
        </div>

        {(product.variants ?? []).map((variant, vi) => (
          <div
            key={vi}
            className="space-y-3 rounded-lg border border-[#e8ecf0] p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">واریانت {vi + 1}</p>
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() =>
                  update(
                    "variants",
                    (product.variants ?? []).filter((_, i) => i !== vi),
                  )
                }
              >
                حذف
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="کد">
                <input
                  value={variant.code}
                  onChange={(e) => updateVariant(vi, { code: e.target.value })}
                  className={inputClass}
                  dir="ltr"
                />
              </Field>
              <Field label="ولتاژ">
                <input
                  value={variant.voltage}
                  onChange={(e) =>
                    updateVariant(vi, { voltage: e.target.value })
                  }
                  className={inputClass}
                  dir="ltr"
                />
              </Field>
              <Field label="طول بخش">
                <input
                  value={variant.sectionLength ?? ""}
                  onChange={(e) =>
                    updateVariant(vi, { sectionLength: e.target.value })
                  }
                  className={inputClass}
                  dir="ltr"
                />
              </Field>
              <Field label="خزش">
                <input
                  value={variant.creepage ?? ""}
                  onChange={(e) =>
                    updateVariant(vi, { creepage: e.target.value })
                  }
                  className={inputClass}
                  dir="ltr"
                />
              </Field>
            </div>
            <Field label="یادداشت">
              <input
                value={variant.notes ?? ""}
                onChange={(e) => updateVariant(vi, { notes: e.target.value })}
                className={inputClass}
                dir="ltr"
              />
            </Field>
            <details className="rounded-md bg-[#f4f6f8] p-3">
              <summary className="cursor-pointer text-sm font-medium">
                جدول فنی
              </summary>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {TECH_FIELDS.map((f) => (
                  <label key={f.key} className="block text-xs text-[#5a6570]">
                    {f.label}
                    <input
                      value={variant.technical?.[f.key] ?? ""}
                      onChange={(e) => updateTech(vi, f.key, e.target.value)}
                      className={`${inputClass} mt-1`}
                      dir="ltr"
                    />
                  </label>
                ))}
              </div>
            </details>
          </div>
        ))}

        {(product.variants ?? []).length === 0 && (
          <p className="text-sm text-[#5a6570]">
            هنوز واریانتی تعریف نشده. برای جداول فنی، واریانت اضافه کنید.
          </p>
        )}
      </section>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm text-[#5a6570]">
      {label}
      <div className="mt-0">{children}</div>
    </label>
  );
}
