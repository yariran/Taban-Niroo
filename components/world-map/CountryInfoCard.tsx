import { AnimatePresence, m, useReducedMotion } from "motion/react";

import type { CountryDetails } from "./country-data";
import styles from "./industrial-world-map.module.css";

type CountryInfoCardProps = {
  country: CountryDetails | null;
  onClose: () => void;
};

export function CountryInfoCard({ country, onClose }: CountryInfoCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {country ? (
        <>
          <m.button
            key="scrim"
            type="button"
            aria-label="Close country details"
            className={`${styles.cardScrim} absolute inset-0 z-40 cursor-pointer border-0`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            onClick={onClose}
          />
          <m.article
            key={country.name}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`country-card-${country.name}`}
            className={`${styles.panel} ${styles.shortCard} absolute inset-x-4 bottom-3 z-50 mx-auto rounded-2xl p-4 sm:inset-x-auto sm:bottom-4 sm:right-6 sm:mx-0 sm:p-5`}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 40, scale: reduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 28, scale: reduceMotion ? 1 : 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-orange/80">
                  {country.name === "Iran" ? "Headquarters" : "Active market"}
                </p>
                <h3
                  id={`country-card-${country.name}`}
                  className="text-2xl font-semibold tracking-tight text-slate-50"
                >
                  {country.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs uppercase tracking-[0.14em] text-slate-300 transition hover:border-white/20 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className={`${styles.metric} rounded-xl px-3.5 py-3`}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Projects
                </p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {country.projects}
                </p>
              </div>
              <div className={`${styles.metric} rounded-xl px-3.5 py-3`}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Since
                </p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {country.firstCooperation}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-white/[0.07] pt-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Products
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {country.products.map((product) => (
                  <span
                    key={product}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-200"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </m.article>
        </>
      ) : null}
    </AnimatePresence>
  );
}
