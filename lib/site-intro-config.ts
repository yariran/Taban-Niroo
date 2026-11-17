/**
 * Cinematic brand intro kill switch.
 *
 * Lives in its own module — not in `components/site-intro.tsx` — so the e2e
 * suite can import it without pulling a `"use client"` component (and React,
 * `next/navigation`, the dictionary catalogue…) into the Playwright process.
 * Same shape and same reason as `FA_LOCALE_ENABLED` in `lib/i18n/config.ts`.
 *
 * While this is `false` the plate never mounts, so `[data-site-intro]` never
 * exists and the specs that exercise the lock/unlock path skip themselves
 * instead of failing. Flip to `true` to re-enable the intro and they run again.
 */
export const INTRO_ENABLED = false;
