"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { SITE_IMAGES } from "@/lib/site-images";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [sectionEntered, setSectionEntered] = useState(false);
  const [alpineTranslateX, setAlpineTranslateX] = useState(-100);
  const [forestTranslateX, setForestTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);

  const effectiveEntered = reduceMotion || sectionEntered;
  const alpineX = reduceMotion ? 0 : alpineTranslateX;
  const forestX = reduceMotion ? 0 : forestTranslateX;
  const titleOp = reduceMotion ? 0 : titleOpacity;

  const updateTransforms = useCallback(() => {
    if (reduceMotion) return;
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    // Calculate progress based on scroll position
    const scrollableRange = Math.max(sectionHeight - windowHeight, 1);
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    
    // Alpine comes from left (-100% to 0%)
    setAlpineTranslateX((1 - progress) * -100);
    
    // Forest comes from right (100% to 0%)
    setForestTranslateX((1 - progress) * 100);
    
    // Title fades out as blocks come together
    setTitleOpacity(1 - progress);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(updateTransforms);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransforms();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransforms, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const el = enterRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionEntered(true);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 12% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [reduceMotion]);

  return (
    <section id="philosophy" className="bg-background">
      <div
        ref={enterRef}
        className={
          reduceMotion
            ? undefined
            : effectiveEntered
              ? "animate-[next-section-in_0.65s_cubic-bezier(0.22,0.98,0.22,1)_forwards]"
              : "translate-y-8 scale-[0.985] opacity-100"
        }
        style={
          !reduceMotion && effectiveEntered
            ? { animationFillMode: "forwards" as const }
            : undefined
        }
      >
      {/* Scroll-Animated Product Grid */}
      <div
        ref={sectionRef}
        className="relative"
        style={{ height: reduceMotion ? "auto" : "200vh" }}
      >
        <div
          className={
            reduceMotion
              ? "flex min-h-[100dvh] items-center justify-center py-12"
              : "sticky top-0 flex h-screen items-center justify-center"
          }
        >
          <div className="relative w-full">
            {/* Title - positioned behind the blocks */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              style={{ opacity: titleOp }}
            >
              <h2 className="text-[12vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[10vw] lg:text-[8vw] text-center px-6">
                Composite & Hybrid.
              </h2>
            </div>

            {/* Product Grid */}
            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              {/* Alpine Image - comes from left */}
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-inset ring-white/25"
                style={{
                  transform: `translate3d(${alpineX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${alpineX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src={SITE_IMAGES.philosophyLongRod}
                  alt="Long rod and transmission network insulators"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    Long Rod Insulators
                  </span>
                </div>
              </div>

              {/* Forest Image - comes from right */}
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-inset ring-white/25"
                style={{
                  transform: `translate3d(${forestX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${forestX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src={SITE_IMAGES.philosophyPost}
                  alt="Post and hybrid insulators"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    Post Insulators
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36 lg:pb-14">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Product range
          </p>
          <p className="mt-8 leading-relaxed text-muted-foreground text-3xl text-center">
            High-voltage composite accessories. Long rod, post, hybrid insulators. Transformer bushings. Cable accessories. IEC-tested. 11 kV–1000 kV.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}

