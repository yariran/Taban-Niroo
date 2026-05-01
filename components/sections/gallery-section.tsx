"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SITE_IMAGES } from "@/lib/site-images";

/**
 * Horizontal gallery with sticky pinning.
 *
 * Earlier revision of this section pinned the viewport for the full
 * horizontal travel distance (≈ 3× viewport height on desktop, worse
 * on mobile). Users read that as "scroll got stuck" because each
 * wheel-tick moved the content only a fraction of a card. This pass
 * clamps the pinned range to at most `PIN_HEIGHT_MULTIPLIER × vh` and
 * maps that bounded vertical scroll to the full horizontal travel,
 * so the whole reel plays in at most two flicks of a trackpad.
 *
 * Other changes:
 *   - A low-cost scroll smoother (lerp) keeps the translate glued
 *     to the pointer without jitter during fast flicks.
 *   - A thin progress bar at the bottom of the pinned frame shows
 *     the reader how much of the reel is left.
 *   - The expensive 3D context (`perspective`) is removed. The GPU
 *     composited layer is already established by `translate3d`.
 */

const GALLERY_ALTS = [
  "Composite long rod insulator",
  "Transmission line insulator",
  "Post insulator installation",
  "Hybrid insulator",
  "Transformer bushing",
  "Cable accessories",
  "Interphase spacer",
  "DPL insulator product",
] as const;

/**
 * Maximum pinned section height, expressed as a multiple of viewport
 * height. Smaller number = less scroll needed to play the reel (but
 * also less resolution on the scrub). 1.8 feels natural on both
 * trackpad and mouse-wheel without being abrupt.
 */
const PIN_HEIGHT_MULTIPLIER = 1.8;

export function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  /**
   * Indirection ref for the lerp loop — `tick` recursively schedules
   * itself via this ref so the Next 16 `react-hooks/immutability`
   * rule does not flag a forward self-reference inside `useCallback`.
   */
  const tickRef = useRef<() => void>(() => {});
  const [pinnedHeight, setPinnedHeight] = useState<number | null>(null);

  const images = SITE_IMAGES.gallery.map((src, i) => ({
    src,
    alt: GALLERY_ALTS[i] ?? "Taban Niroo product",
  }));

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Horizontal distance the track must travel.
    const horizontalTravel = Math.max(0, containerWidth - viewportWidth);

    // Pin the section only long enough for a pleasant scrub — capped
    // at PIN_HEIGHT_MULTIPLIER × viewport height regardless of how
    // many images the reel has.
    const maxPinExtra = viewportHeight * PIN_HEIGHT_MULTIPLIER;
    const pinExtra = Math.min(horizontalTravel, maxPinExtra);

    // Section height = one screen (for the first frame) + the pin
    // budget (for the scrub). When there is no horizontal overflow
    // (e.g. extremely wide screens) we collapse back to a single
    // screen and the reel just sits statically.
    const total = viewportHeight + pinExtra;
    setPinnedHeight(total);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    // Also remeasure once images actually affect layout.
    const raf = requestAnimationFrame(measure);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [measure]);

  const tick = useCallback(() => {
    rafRef.current = null;

    const track = trackRef.current;
    const bar = progressBarRef.current;
    const section = galleryRef.current;
    const container = containerRef.current;
    if (!track || !section || !container) return;

    const rect = section.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Pin window runs from rect.top = 0 to rect.top = -(sectionHeight - vh).
    const pinRange = Math.max(1, sectionHeight - viewportHeight);
    const scrolled = Math.min(pinRange, Math.max(0, -rect.top));
    const progress = scrolled / pinRange;

    const horizontalTravel = Math.max(
      0,
      container.scrollWidth - viewportWidth
    );
    const target = progress * horizontalTravel;

    targetRef.current = target;

    // Lerp the current value toward target. 0.18 is a comfortable
    // smoothing factor — fast enough to feel direct, slow enough to
    // iron out wheel-tick noise.
    const delta = target - currentRef.current;
    if (Math.abs(delta) < 0.2) {
      currentRef.current = target;
    } else {
      currentRef.current += delta * 0.18;
    }

    track.style.transform = `translate3d(${-currentRef.current}px, 0, 0)`;
    if (bar) {
      bar.style.transform = `scaleX(${progress})`;
    }

    // Keep animating while we are still approaching the target.
    if (Math.abs(target - currentRef.current) > 0.2) {
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    }
  }, []);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  return (
    <section
      id="gallery"
      ref={galleryRef}
      className="relative bg-background"
      style={pinnedHeight ? { height: `${pinnedHeight}px` } : { minHeight: "100dvh" }}
      aria-label="Product gallery"
    >
      {/* Sticky frame */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div className="flex h-full items-center">
          <div
            ref={trackRef}
            className="will-change-transform"
            style={{
              transform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              touchAction: "pan-y",
            }}
          >
            <div
              ref={containerRef}
              className="flex gap-4 px-6 md:gap-6"
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative h-[65vh] w-[82vw] flex-shrink-0 overflow-hidden rounded-2xl ring-1 ring-border/50 dark:ring-white/[0.06] md:h-[72vh] md:w-[56vw] lg:w-[42vw]"
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 42vw, (min-width: 768px) 56vw, 82vw"
                    priority={index < 2}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hint pill — fades out as reel progresses, so users know to
            keep scrolling on the first pin. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-opacity duration-500 md:text-xs"
        >
          Scroll to pan →
        </div>

        {/* Progress rail + bar */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-1/2 h-px w-[54%] max-w-md -translate-x-1/2 overflow-hidden bg-foreground/10 dark:bg-white/10"
        >
          <div
            ref={progressBarRef}
            className="h-full origin-left bg-foreground dark:bg-white"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
