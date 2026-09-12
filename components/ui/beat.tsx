"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * One clock per section.
 *
 * Before this, every reveal primitive mounted its OWN IntersectionObserver
 * with its own threshold and rootMargin. On a tall section (Engineering DNA
 * is ~2000px) the headline could fire six hundred pixels of scroll before
 * the card grid below it. The beats were independent events that merely
 * happened to be near each other — which is why the page read as
 * machine-assembled even where the individual animations were fine.
 *
 * `<Beat>` mounts a single observer and publishes `entered` through
 * context. Primitives inside it skip their own observation and use pure
 * delay offsets from the shared clock (see `BEAT` in `lib/motion-roles.ts`),
 * so a section resolves as one composed phrase.
 *
 * Outside a `<Beat>` — all of `/about`, `/products`, `/blog` — `useBeat()`
 * returns `null` and every primitive falls back to self-observation. That
 * keeps this change scoped to the home page with zero regression risk
 * elsewhere.
 *
 * Tall sections take more than one `<Beat>`: budget roughly one per 1.2
 * viewports of content, otherwise the bottom of the section animates
 * while it is still off screen.
 */

type BeatContextValue = {
  /** True once the section has crossed the trigger line. Never resets. */
  entered: boolean;
};

const BeatContext = createContext<BeatContextValue | null>(null);

/**
 * Returns the enclosing section clock, or `null` when the caller is not
 * inside a `<Beat>`. Primitives MUST treat `null` as "observe yourself".
 */
export function useBeat(): BeatContextValue | null {
  return useContext(BeatContext);
}

export function Beat({
  children,
  className,
  /**
   * Fraction of the viewport height the section top must cross before the
   * phrase starts. 0.82 puts the trigger just below the fold, so the
   * opening beat is already resolving as the section becomes readable.
   */
  triggerAt = 0.82,
}: {
  children: ReactNode;
  className?: string;
  triggerAt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion: everything is already in its final state, so the
    // clock starts fired. Primitives still branch on their own, but this
    // keeps the context honest rather than reporting a pending phrase.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setEntered(true);
      return;
    }

    // Bottom margin pulled in so intersection means "top crossed the
    // trigger line", not "the very first pixel touched the fold".
    const bottomInset = Math.round((1 - triggerAt) * 100);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: `0px 0px -${bottomInset}% 0px` },
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [triggerAt]);

  return (
    <BeatContext.Provider value={{ entered }}>
      <div ref={ref} className={className} data-beat={entered ? "in" : "pre"}>
        {children}
      </div>
    </BeatContext.Provider>
  );
}
