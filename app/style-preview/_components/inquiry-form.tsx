"use client";

import { useState } from "react";

const INTENTS = [
  "Technical datasheet",
  "Type-test reports",
  "Budget quotation",
  "Factory visit",
] as const;

/**
 * Contact block, styled after Terminal's closing form.
 *
 * Two details are load-bearing in theirs: the intent options are selectable
 * chips rather than a dropdown (so the visitor's job is one tap, and the
 * sales team gets a qualified lead), and every field label is mono
 * uppercase at 10px while the input text itself is large. Inert by design —
 * this route is a design sandbox and posts nowhere.
 */
export function InquiryForm() {
  const [picked, setPicked] = useState<string[]>([INTENTS[0]]);
  const [sent, setSent] = useState(false);

  const toggle = (intent: string) =>
    setPicked((prev) =>
      prev.includes(intent)
        ? prev.filter((p) => p !== intent)
        : [...prev, intent],
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-8"
    >
      <fieldset>
        <legend className="tp-mono text-[10px] text-white/45">
          What do you need?
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {INTENTS.map((intent) => {
            const on = picked.includes(intent);
            return (
              <button
                key={intent}
                type="button"
                onClick={() => toggle(intent)}
                aria-pressed={on}
                className={`tp-body rounded-full border px-4 py-2 text-[13px] transition-colors ${
                  on
                    ? "border-[var(--tp-gold)] bg-[var(--tp-gold)] text-[#1a1206]"
                    : "border-[var(--tp-line-dark)] text-white/70 hover:border-white/35"
                }`}
              >
                {intent}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        {[
          { id: "tp-name", label: "Name", type: "text", ph: "Your name" },
          { id: "tp-org", label: "Utility / EPC", type: "text", ph: "Company" },
          {
            id: "tp-email",
            label: "Work email",
            type: "email",
            ph: "you@utility.com",
          },
          { id: "tp-country", label: "Country", type: "text", ph: "Country" },
        ].map((f) => (
          <div key={f.id}>
            <label
              htmlFor={f.id}
              className="tp-mono block text-[10px] text-white/45"
            >
              {f.label}
            </label>
            <input
              id={f.id}
              type={f.type}
              placeholder={f.ph}
              className="tp-body mt-3 w-full border-b border-[var(--tp-line-dark)] bg-transparent pb-2.5 text-[15px] text-[var(--tp-paper)] outline-none transition-colors placeholder:text-white/25 focus-visible:border-[var(--tp-gold)]"
            />
          </div>
        ))}
      </div>

      <div>
        <label
          htmlFor="tp-spec"
          className="tp-mono block text-[10px] text-white/45"
        >
          Line voltage and quantity
        </label>
        <textarea
          id="tp-spec"
          rows={2}
          placeholder="e.g. 400 kV, 1,200 sets, pollution class d"
          className="tp-body mt-3 w-full resize-none border-b border-[var(--tp-line-dark)] bg-transparent pb-2.5 text-[15px] text-[var(--tp-paper)] outline-none transition-colors placeholder:text-white/25 focus-visible:border-[var(--tp-gold)]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="tp-btn tp-btn-gold tp-mono px-6 py-3">
          Send inquiry
        </button>
        <p
          aria-live="polite"
          className="tp-mono text-[9px] leading-[1.7] text-white/35"
        >
          {sent
            ? "Style preview — nothing was sent."
            : "Same-day reply · Shiraz GMT+3:30"}
        </p>
      </div>
    </form>
  );
}
