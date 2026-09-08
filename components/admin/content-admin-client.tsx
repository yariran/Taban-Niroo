"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  blockHasContent,
  type ContentBlock,
  type ContentItem,
  type SiteContent,
} from "@/lib/cms-content-types";
import {
  CONTENT_GROUPS,
  CONTENT_SECTIONS,
  FIELD_LABELS,
  type ContentFieldKey,
  type ContentSectionDef,
} from "@/lib/cms-content-registry";
import { localeHref, type Locale } from "@/lib/i18n";
import { AdminLocaleToggle } from "@/components/admin/admin-locale-toggle";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#d0d7e0] bg-white px-3 py-2.5 text-sm text-[#0f1720] outline-none transition focus:border-[#0f1720] focus:ring-2 focus:ring-[#0f1720]/10";

export function ContentAdminClient({ initial }: { initial: SiteContent }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [content, setContent] = useState(initial);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(initial),
  );
  const [group, setGroup] = useState<string>(CONTENT_GROUPS[0]);
  const [activeKey, setActiveKey] = useState(CONTENT_SECTIONS[0]!.key);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const dirty = JSON.stringify(content) !== savedSnapshot;
  const fieldDir = locale === "fa" ? "rtl" : "ltr";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CONTENT_SECTIONS.filter((s) => {
      if (s.group !== group) return false;
      if (!q) return true;
      return (
        s.label.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.key.toLowerCase().includes(q)
      );
    });
  }, [group, query]);

  const section =
    CONTENT_SECTIONS.find((s) => s.key === activeKey) ?? CONTENT_SECTIONS[0]!;
  const block: ContentBlock = section.get(content) ?? {};
  const previewHref = localeHref(locale, section.previewPath);

  function selectSection(def: ContentSectionDef) {
    startTransition(() => {
      setActiveKey(def.key);
      setGroup(def.group);
      setMessage(null);
    });
  }

  function patchBlock(patch: Partial<ContentBlock>) {
    setContent(section.set(content, { ...block, ...patch }));
  }

  function clearSection() {
    if (!window.confirm("همه فیلدهای این سکشن پاک شود؟ (پیش‌فرض سایت برمی‌گردد)")) {
      return;
    }
    setContent(section.set(content, {}));
  }

  async function switchLocale(next: Locale) {
    if (next === locale) return;
    if (
      dirty &&
      !window.confirm(
        "تغییرات ذخیره‌نشده برای این زبان از بین می‌رود. ادامه می‌دهید؟",
      )
    ) {
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/cms/content?locale=${next}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        setMessage({ kind: "err", text: "بارگذاری محتوای این زبان ناموفق بود" });
        return;
      }
      const data = (await res.json()) as SiteContent;
      setContent(data);
      setSavedSnapshot(JSON.stringify(data));
      setLocale(next);
      setMessage({
        kind: "ok",
        text:
          next === "fa"
            ? "در حال ویرایش نسخه فارسی — فیلد خالی روی سایت به انگلیسی برمی‌گردد."
            : "در حال ویرایش نسخه انگلیسی",
      });
    } catch {
      setMessage({ kind: "err", text: "خطای شبکه — دوباره تلاش کنید." });
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/cms/content?locale=${locale}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        updatedAt?: string;
      };
      if (!res.ok) {
        setMessage({ kind: "err", text: data.error ?? "ذخیره ناموفق بود" });
        return;
      }
      const next = { ...content, updatedAt: data.updatedAt ?? content.updatedAt };
      setContent(next);
      setSavedSnapshot(JSON.stringify(next));
      setMessage({
        kind: "ok",
        text: `ذخیره شد (${locale === "fa" ? "فارسی" : "EN"}). تغییرات روی سایت پس از بازخوانی دیده می‌شود.`,
      });
    } catch {
      setMessage({ kind: "err", text: "خطای شبکه — دوباره تلاش کنید." });
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file: File) {
    setBusy(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "content");
      const res = await fetch("/api/cms/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        url?: string;
      };
      if (!res.ok || !data.url) {
        setMessage({ kind: "err", text: data.error ?? "آپلود ناموفق" });
        return;
      }
      patchBlock({ image: data.url });
      setMessage({
        kind: "ok",
        text: "تصویر آپلود شد — برای اعمال روی سایت، «ذخیره» را بزنید.",
      });
    } finally {
      setBusy(false);
    }
  }

  function updateItem(index: number, patch: Partial<ContentItem>) {
    const items = [...(block.items ?? [])];
    items[index] = { ...items[index]!, ...patch };
    patchBlock({ items });
  }

  function addItem() {
    patchBlock({
      items: [...(block.items ?? []), { label: "", value: "", body: "" }],
    });
  }

  function removeItem(index: number) {
    patchBlock({
      items: (block.items ?? []).filter((_, i) => i !== index),
    });
  }

  const groupCounts = useMemo(() => {
    const map: Record<string, { total: number; filled: number }> = {};
    for (const g of CONTENT_GROUPS) map[g] = { total: 0, filled: 0 };
    for (const s of CONTENT_SECTIONS) {
      map[s.group]!.total += 1;
      if (blockHasContent(s.get(content))) map[s.group]!.filled += 1;
    }
    return map;
  }, [content]);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-20 -mx-2 mb-6 rounded-xl border border-[#d8dee6] bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              ویرایش محتوای سایت
            </h1>
            <p className="mt-0.5 text-xs text-[#5a6570]">
              زبان فعال:{" "}
              <span className="font-medium text-[#0f1720]">
                {locale === "fa" ? "فارسی" : "English"}
              </span>
              {" · "}
              فیلد خالی = متن پیش‌فرض / fallback انگلیسی ·{" "}
              {dirty ? (
                <span className="font-medium text-amber-700">تغییرات ذخیره‌نشده</span>
              ) : (
                <span className="text-emerald-700">همه‌چیز ذخیره شده</span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminLocaleToggle
              value={locale}
              onChange={(next) => void switchLocale(next)}
              disabled={busy}
            />
            <Link
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[#d0d7e0] bg-white px-3 py-2 text-sm text-[#0f1720] hover:bg-[#f4f6f8]"
            >
              پیش‌نمایش صفحه
            </Link>
            <button
              type="button"
              disabled={busy || !dirty}
              onClick={() => void save()}
              className="rounded-lg bg-[#0f1720] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              {busy ? "در حال ذخیره…" : "ذخیره تغییرات"}
            </button>
          </div>
        </div>
        {message && (
          <p
            className={`mt-2 text-sm ${
              message.kind === "ok" ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      {/* Page groups */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {CONTENT_GROUPS.map((g) => {
          const counts = groupCounts[g]!;
          const active = group === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGroup(g);
                const first = CONTENT_SECTIONS.find((s) => s.group === g);
                if (first) setActiveKey(first.key);
              }}
              className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                active
                  ? "bg-[#0f1720] text-white"
                  : "bg-white text-[#5a6570] ring-1 ring-[#d8dee6] hover:text-[#0f1720]"
              }`}
            >
              {g}
              <span
                className={`ms-1.5 text-[11px] ${
                  active ? "text-white/60" : "text-[#9aa3ad]"
                }`}
              >
                {counts.filled}/{counts.total}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Section list */}
        <aside className="rounded-xl border border-[#d8dee6] bg-white p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در این صفحه…"
            className={`${inputClass} mt-0`}
          />
          <nav className="mt-3 max-h-[62vh] space-y-0.5 overflow-auto">
            {filtered.map((s) => {
              const filled = blockHasContent(s.get(content));
              const selected = s.key === activeKey;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => selectSection(s)}
                  className={`flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-end text-sm transition ${
                    selected
                      ? "bg-[#0f1720] text-white"
                      : "hover:bg-[#f4f6f8] text-[#0f1720]"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      filled
                        ? selected
                          ? "bg-emerald-300"
                          : "bg-emerald-500"
                        : selected
                          ? "bg-white/30"
                          : "bg-[#d0d7e0]"
                    }`}
                    title={filled ? "دارای محتوای سفارشی" : "پیش‌فرض سایت"}
                  />
                  <span className="min-w-0 flex-1 leading-snug">{s.label}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-2 py-6 text-center text-xs text-[#5a6570]">
                موردی پیدا نشد.
              </p>
            )}
          </nav>
        </aside>

        {/* Editor */}
        <div
          className={`min-w-0 rounded-xl border border-[#d8dee6] bg-white p-5 md:p-6 ${
            isPending ? "opacity-70" : ""
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eef1f5] pb-4">
            <div>
              <p className="text-xs text-[#5a6570]">{section.group}</p>
              <h2 className="mt-1 text-lg font-semibold">{section.label}</h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#5a6570]">
                {section.description}
              </p>
            </div>
            <button
              type="button"
              onClick={clearSection}
              className="rounded-lg border border-[#e8b4b4] px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
            >
              پاک کردن سکشن
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {section.fields.map((field) => (
              <FieldEditor
                key={field}
                field={field}
                block={block}
                itemsHint={section.itemsHint}
                dir={fieldDir}
                locale={locale}
                onPatch={patchBlock}
                onUpload={uploadImage}
                onUpdateItem={updateItem}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                busy={busy}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  block,
  itemsHint,
  dir,
  locale,
  onPatch,
  onUpload,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  busy,
}: {
  field: ContentFieldKey;
  block: ContentBlock;
  itemsHint?: string;
  dir: "ltr" | "rtl";
  locale: Locale;
  onPatch: (patch: Partial<ContentBlock>) => void;
  onUpload: (file: File) => Promise<void>;
  onUpdateItem: (index: number, patch: Partial<ContentItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  busy: boolean;
}) {
  const label = FIELD_LABELS[field];
  const bodyPlaceholder =
    locale === "fa" ? "متن فارسی این سکشن…" : "متن انگلیسی سایت…";

  if (field === "image") {
    return (
      <div>
        <p className="text-sm font-medium text-[#0f1720]">{label}</p>
        <div className="mt-1.5 flex flex-wrap gap-2">
          <input
            value={block.image ?? ""}
            onChange={(e) => onPatch({ image: e.target.value || null })}
            className={`${inputClass} mt-0 flex-1`}
            dir="ltr"
            placeholder="/images/... یا URL"
          />
          <label className="cursor-pointer rounded-lg border border-[#d0d7e0] bg-[#f4f6f8] px-3 py-2.5 text-sm hover:bg-[#e8ecf0]">
            آپلود تصویر
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onUpload(f);
              }}
            />
          </label>
        </div>
        {block.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={block.image}
            alt=""
            className="mt-3 h-36 rounded-lg border border-[#e8ecf0] object-cover bg-[#f4f6f8]"
          />
        ) : null}
      </div>
    );
  }

  if (field === "items") {
    const items = block.items ?? [];
    return (
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-[#0f1720]">{label}</p>
          <button
            type="button"
            onClick={onAddItem}
            className="rounded-lg border border-[#d0d7e0] px-2.5 py-1 text-xs hover:bg-[#f4f6f8]"
          >
            + افزودن آیتم
          </button>
        </div>
        {itemsHint && (
          <p className="mt-1 text-xs text-[#5a6570]">{itemsHint}</p>
        )}
        <div className="mt-3 space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-[#e8ecf0] bg-[#f8fafc] p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5a6570]">آیتم {index + 1}</span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="text-xs text-red-600"
                >
                  حذف
                </button>
              </div>
              <input
                value={item.label}
                onChange={(e) => onUpdateItem(index, { label: e.target.value })}
                className={inputClass}
                dir={dir}
                placeholder="برچسب / عنوان"
              />
              <input
                value={item.value ?? ""}
                onChange={(e) => onUpdateItem(index, { value: e.target.value })}
                className={inputClass}
                dir={dir}
                placeholder="مقدار (اختیاری)"
              />
              <textarea
                rows={2}
                value={item.body ?? ""}
                onChange={(e) => onUpdateItem(index, { body: e.target.value })}
                className={inputClass}
                dir={dir}
                placeholder="توضیح (اختیاری)"
              />
            </div>
          ))}
          {items.length === 0 && (
            <p className="rounded-lg border border-dashed border-[#d0d7e0] px-4 py-8 text-center text-sm text-[#5a6570]">
              هنوز آیتمی نیست. با «افزودن آیتم» شروع کنید.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (field === "body") {
    return (
      <label className="block">
        <span className="text-sm font-medium text-[#0f1720]">{label}</span>
        <textarea
          rows={8}
          value={block.body ?? ""}
          onChange={(e) => onPatch({ body: e.target.value })}
          className={inputClass}
          dir={dir}
          placeholder={bodyPlaceholder}
        />
        <span className="mt-1 block text-[11px] text-[#8a949e]">
          پاراگراف‌ها را با یک خط خالی از هم جدا کنید.
        </span>
      </label>
    );
  }

  const value = (block[field] as string | undefined) ?? "";
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#0f1720]">{label}</span>
      <input
        value={value}
        onChange={(e) => onPatch({ [field]: e.target.value })}
        className={inputClass}
        dir={
          field === "ctaHref" || field === "ctaHref2" ? "ltr" : dir
        }
      />
    </label>
  );
}
