"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { SITE_IMAGES } from "@/lib/site-images";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";
import { RevealBlock, RevealText } from "@/components/ui/reveal-text";
import { ImageReveal } from "@/components/ui/image-reveal";

/**
 * Philosophy — same sticky scrub on every viewport size.
 * Only `prefers-reduced-motion` switches to a static stacked layout.
 * Resizing the browser must not swap motion systems mid-scroll.
 */
export function PhilosophySection({ cms }: { cms?: ContentBlock } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [sectionEntered, setSectionEntered] = useState(false);
  const [alpineTranslateX, setAlpineTranslateX] = useState(-100);
  const [forestTranslateX, setForestTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);
  const title = cmsText(cms, "title", "Composite & Hybrid.");

  const staticLayout = reduceMotion;
  const effectiveEntered = staticLayout || sectionEntered;
  const alpineX = staticLayout ? 0 : alpineTranslateX;
  const forestX = staticLayout ? 0 : forestTranslateX;
  const titleOp = staticLayout ? 0 : titleOpacity;

  const updateTransforms = useCallback(() => {
    if (staticLayout) return;
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;

    const scrollableRange = Math.max(sectionHeight - windowHeight, 1);
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));

    setAlpineTranslateX((1 - progress) * -100);
    setForestTranslateX((1 - progress) * 100);
    setTitleOpacity(1 - progress);
  }, [staticLayout]);

  useEffect(() => {
    if (staticLayout) return;

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateTransforms);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateTransforms();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransforms, staticLayout]);

  useEffect(() => {
    if (staticLayout) return;
    const el = enterRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionEntered(true);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 12% 0px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [staticLayout]);

  const cardClass =
    "relative aspect-[4/3] max-h-[min(38dvh,20rem)] w-full overflow-hidden rounded-2xl bg-white shadow-elevate ring-1 ring-inset ring-brand-navy/10 dark:bg-zinc-900/80 dark:ring-white/10 sm:max-h-[min(42dvh,22rem)] xl:max-h-[min(48dvh,28rem)]";

  return (
    <section id="philosophy" className="bg-background">
      <div
        ref={enterRef}
        className={
          staticLayout
            ? undefined
            : effectiveEntered
              ? "animate-[next-section-in_0.65s_cubic-bezier(0.22,0.98,0.22,1)_forwards]"
              : "translate-y-8 scale-[0.985] opacity-100"
        }
        style={
          !staticLayout && effectiveEntered
            ? { animationFillMode: "forwards" as const }
            : undefined
        }
      >
        <div
          ref={sectionRef}
          className="relative"
          style={{ height: staticLayout ? "auto" : "160vh" }}
        >
          <div
            className={
              staticLayout
                ? "flex min-h-0 items-center justify-center py-12 md:py-16 lg:py-20"
                : "sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden"
            }
          >
            <div className="relative w-full">
              {staticLayout && (
                <RevealText
                  as="h2"
                  delayMs={80}
                  stepMs={70}
                  className="mb-6 px-6 text-center text-[clamp(2rem,8vw,4.5rem)] font-medium leading-[0.95] tracking-tighter text-brand-navy md:mb-8"
                >
                  {title}
                </RevealText>
              )}
              {!staticLayout && (
                <div
                  className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                  style={{ opacity: titleOp }}
                >
                  <h2 className="px-6 text-center text-[clamp(2rem,7vw,6rem)] font-medium leading-[0.95] tracking-tighter text-brand-navy">
                    {title}
                  </h2>
                </div>
              )}

              {/* Always 2-up so resize never swaps stacked ↔ side-by-side motion */}
              <div className="relative z-10 grid grid-cols-2 gap-2 px-4 sm:gap-4 sm:px-6 md:gap-6 md:px-12 lg:px-20">
                <div
                  className={cardClass}
                  style={{
                    transform: `translate3d(${alpineX}%, 0, 0)`,
                    WebkitTransform: `translate3d(${alpineX}%, 0, 0)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {staticLayout ? (
                    <ImageReveal className="absolute inset-0" delayMs={120}>
                      <Image
                        src={SITE_IMAGES.philosophyLongRod}
                        alt="Long rod and transmission network insulators"
                        fill
                        className="object-contain object-center p-1.5 sm:p-2 md:p-3"
                        sizes="45vw"
                      />
                    </ImageReveal>
                  ) : (
                    <Image
                      src={SITE_IMAGES.philosophyLongRod}
                      alt="Long rod and transmission network insulators"
                      fill
                      className="object-contain object-center p-1.5 sm:p-2 md:p-3"
                      sizes="45vw"
                    />
                  )}
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6">
                    <span className="rounded-full bg-brand-navy/90 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm">
                      Long Rod Insulators
                    </span>
                  </div>
                </div>

                <div
                  className={cardClass}
                  style={{
                    transform: `translate3d(${forestX}%, 0, 0)`,
                    WebkitTransform: `translate3d(${forestX}%, 0, 0)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {staticLayout ? (
                    <ImageReveal className="absolute inset-0" delayMs={220}>
                      <Image
                        src={SITE_IMAGES.philosophyPost}
                        alt="Post and hybrid insulators"
                        fill
                        className="object-contain object-center p-1.5 sm:p-2 md:p-3"
                        sizes="45vw"
                      />
                    </ImageReveal>
                  ) : (
                    <Image
                      src={SITE_IMAGES.philosophyPost}
                      alt="Post and hybrid insulators"
                      fill
                      className="object-contain object-center p-1.5 sm:p-2 md:p-3"
                      sizes="45vw"
                    />
                  )}
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6">
                    <span className="rounded-full bg-brand-navy/90 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm">
                      Post Insulators
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-28">
          <RevealBlock
            className="mx-auto max-w-3xl text-center"
            delayMs={100}
            distance={20}
            stagger={90}
          >
            <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
              Product range
            </p>
            <p className="mt-6 text-balance text-lg leading-relaxed text-muted-foreground md:mt-8 md:text-xl lg:text-2xl">
              High-voltage composite accessories. Long rod, post, hybrid
              insulators. Transformer bushings. Cable accessories. IEC-tested.
              6-1000 kV.
            </p>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
