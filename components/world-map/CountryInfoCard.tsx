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
        /*
          A region, not `role="dialog" aria-modal="true"`. It was marked
          modal while focus was never moved into it and never restored — a
          trap announced with no trap built. It is an inline readout for
          the map behind it, so it is announced politely instead.

          There is no scrim any more either. The old one was a full-map
          `<button>` at z-40, which meant that with a card open every
          country underneath it was unreachable: selecting a second market
          took two clicks, and the first one only dimmed the map. Clicking
          away is handled on the SVG itself now, so markets switch
          directly.
        */
        <m.article
          key={country.name}
          aria-live="polite"
          aria-labelledby={`country-card-${country.name}`}
          className={`${styles.panel} ${styles.shortCard} absolute inset-x-4 bottom-3 z-50 mx-auto p-4 sm:inset-x-auto sm:bottom-4 sm:end-6 sm:mx-0 sm:p-5`}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
                  {country.name === "Iran" ? "Headquarters" : "Active market"}
                </p>
                <h3
                  id={`country-card-${country.name}`}
                  className="mt-1.5 text-xl font-semibold uppercase tracking-tight text-slate-50"
                >
                  {country.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={`Close ${country.name} details`}
                className={`${styles.closeGlyph} -me-1 -mt-1 grid h-7 w-7 flex-none place-items-center rounded-sm text-base leading-none`}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className={`${styles.panelRule} mt-4 grid grid-cols-2 pt-4`}>
              <div className="pe-4">
                <p className={`${styles.statValue} text-[1.75rem] font-semibold leading-none text-white`}>
                  +{country.projects}
                </p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Projects
                </p>
              </div>
              <div className={`${styles.statSplit} ps-4`}>
                <p className={`${styles.statValue} text-[1.75rem] font-semibold leading-none text-white`}>
                  {country.firstCooperation}
                </p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Since
                </p>
              </div>
            </div>

            <div className={`${styles.panelRule} mt-4 pt-4`}>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Products
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {country.products.map((product) => (
                  <li
                    key={product}
                    className={`${styles.productItem} flex gap-2.5 text-[13px] leading-snug text-slate-200`}
                  >
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          </m.article>
      ) : null}
    </AnimatePresence>
  );
}
