/**
 * The home page's motion grammar — three roles, assigned by narrative
 * function and repeated deliberately.
 *
 * ## Why this file exists
 *
 * The previous system declared eleven "cinematic" variants (`curtain`,
 * `iris`, `dolly`, `focus-pull`, `veil`, …). Every one of them resolved
 * to the same gesture: translate up 8-16px, optionally scale 0.98-1.02,
 * fade, over 860-980ms. `curtain` and `tilt-top` differed by 20ms. None
 * performed the technique it was named after. The page therefore had
 * the vocabulary of cinema and none of the motion — which is precisely
 * why it read as machine-generated rather than art-directed.
 *
 * Varying one axis by magnitude cannot fix that: 860ms vs 980ms is a 14%
 * delta, below the ~15-20% just-noticeable difference for duration, and
 * 8px vs 16px of travel on a section 800-2000px tall subtends a fraction
 * of a degree. So the three roles below differ on ORTHOGONAL axes:
 *
 *   1. which property carries the motion (translate / translate / scale+clip)
 *   2. whether the section moves as one body or as parts
 *   3. how long visible motion persists
 *
 * Three verbs, not three amounts. `lib/motion-roles.test.ts` asserts the
 * separation numerically so nine-lookalikes cannot grow back.
 *
 * ## The invariant
 *
 * A role's transform must NEVER be applied to an ancestor of a
 * `position: sticky` node — it drags the sticky subtree for the duration
 * of the entrance. Roles attach to leaf content blocks, not to section
 * wrappers. (`philosophy-section.tsx` shipped exactly this bug: a
 * translate keyframe on an ancestor of its own sticky stage.)
 */

/** Roles are presets over the existing reveal primitives, not new components. */
export type MotionRole = "statement" | "evidence" | "plate";

/**
 * The section beat grid.
 *
 * Every home section snaps its offsets to these four values. Before this,
 * `delayMs` across sections was 40/80/90/100/110/120/140/180/200/220/280/380
 * — a random walk that reads, correctly, as arrhythmia.
 *
 * Pair with `<Beat>`, which gives a section ONE observer: without it each
 * primitive mounted its own, so on a 2000px section the headline could
 * fire 600px of scroll before the grid below it. Independent events that
 * merely happen to be adjacent never cohere into a phrase.
 */
export const BEAT = {
  /** Eyebrow / kicker. */
  first: 0,
  /** The headline. */
  headline: 120,
  /** Lede paragraph under the headline. */
  lede: 320,
  /** The supporting group: cards, list, KPI row. */
  group: 520,
} as const;

/**
 * `statement` — LIFT. One heavy thing arrives.
 *
 * Rigid body: the whole block travels as a unit, no internal stagger.
 * Still perceptibly settling at ~700ms, which is what makes it read as
 * an arrival rather than an appearance.
 *
 * Maps to `RevealUp` (`components/ui/reveal-words.tsx`).
 */
export const STATEMENT = {
  distance: 44,
  duration: 1100,
  /** Late trigger — the claim should land after the reader commits to the section. */
  threshold: 0.25,
} as const;

/**
 * `evidence` — RIPPLE. Many light things tick in.
 *
 * The container never moves; only its children do, 14px each. Visually
 * static by ~180ms — a tick, not an arrival. The stagger cap matters:
 * uncapped, a nine-item list ran an 800ms tail that desynchronised from
 * everything around it.
 *
 * Maps to `RevealBlock` (`components/ui/reveal-text.tsx`).
 */
export const EVIDENCE = {
  distance: 14,
  duration: 420,
  stagger: 55,
  /** Children past this index all share the last delay. */
  staggerCap: 6,
  /** Early trigger — supporting detail should already be settling when the eye arrives. */
  threshold: 0.05,
} as const;

/**
 * `plate` — APERTURE. A frame opens and an image relaxes.
 *
 * The ONLY role with zero translate. Translate-up is the gesture the rest
 * of the page is built from, so removing it is the strongest separator
 * available. `scale 1.06 → 1` produces radial, inward edge motion — a
 * different vector field from any vertical slide — and the clip opening
 * from below adds an event no other role has.
 *
 * Maps to `ImageReveal` (`components/ui/image-reveal.tsx`).
 */
export const PLATE = {
  scaleFrom: 1.06,
  /** A settle, not a wipe. A full `inset(0 0 100% 0)` is a different, showier device. */
  clipFrom: "inset(0 0 14% 0)",
  opacityFrom: 0.55,
  duration: 1400,
  threshold: 0.15,
} as const;

/**
 * Machine-readable role table. Consumed only by `motion-roles.test.ts`,
 * which asserts pairwise perceptual separation — the guardrail that
 * stops this collapsing back into eleven identical variants.
 */
export const ROLE_SPECS: Record<
  MotionRole,
  { duration: number; distance: number; properties: readonly string[] }
> = {
  statement: {
    duration: STATEMENT.duration,
    distance: STATEMENT.distance,
    properties: ["transform", "opacity"],
  },
  evidence: {
    duration: EVIDENCE.duration,
    distance: EVIDENCE.distance,
    properties: ["transform", "opacity"],
  },
  plate: {
    duration: PLATE.duration,
    distance: 0,
    properties: ["transform", "opacity", "clip-path"],
  },
};
