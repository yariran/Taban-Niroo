"use client";

import { LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  en: "EN",
  fa: "فارسی",
};

/**
 * Compact EN | FA control for CMS forms.
 * Does not navigate — parent owns load/save per locale.
 */
export function AdminLocaleToggle({
  value,
  onChange,
  disabled,
  className,
}: {
  value: Locale;
  onChange: (locale: Locale) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="زبان محتوای در حال ویرایش"
      className={cn(
        "inline-flex items-center rounded-lg border border-[#d0d7e0] bg-[#f4f6f8] p-0.5",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = code === value;
        return (
          <button
            key={code}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => onChange(code)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition",
              code === "en" && "font-mono tracking-[0.12em]",
              active
                ? "bg-[#0f1720] text-white shadow-sm"
                : "text-[#5a6570] hover:text-[#0f1720]",
              disabled && "opacity-50",
            )}
          >
            {LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
