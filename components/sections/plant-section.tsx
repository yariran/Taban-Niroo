"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SITE_IMAGES } from "@/lib/site-images";
import { ScrollPan } from "@/components/ui/scroll-pan";
import { ImageReveal } from "@/components/ui/image-reveal";
import { RevealBlock } from "@/components/ui/reveal-text";
import { RevealUp } from "@/components/ui/reveal-words";
import { Beat } from "@/components/ui/beat";
import { BEAT, EVIDENCE, STATEMENT } from "@/lib/motion-roles";
import type { ContentBlock } from "@/lib/cms-content";
import { cmsText } from "@/lib/cms-resolve";

/**
 * Act III opener — wordless evidence of the plant.
 *
 * Merges what used to be two separate, unlabelled sections sitting three
 * chapters apart: a 21:9 manufacturing video with no heading, and a
 * horizontal product rail with no heading. Both were the same thing —
 * visual proof of the factory — so they now read as one chapter with one
 * header, which is what lets the rail feel like a continuation of the
 * footage rather than an unrelated carousel.
 *
 * The video's lazy loader is preserved exactly as it was: an
 * IntersectionObserver gates the `<source>` so the 3.3 MB mp4 never lands
 * on the critical path.
 */

const VIDEO_SRC = "/videos/industrial.mp4";
/**
 * First frame of `industrial.mp4`, centre-cropped to the 21:9 the plate
 * renders at.
 *
 * The plate is gated twice — `prefers-reduced-motion` blocks the video
 * outright, and an IntersectionObserver unmounts it whenever the section
 * leaves the viewport. Both paths used to leave a 540px band of pure black
 * in the middle of Act III. A poster means the frame always holds an
 * image, and the video, when it runs, simply starts moving.
 */
const VIDEO_POSTER = "/images/plant-plate-poster.jpg";

const GALLERY_ALTS = [
  "Composite long rod insulator",
  "Post insulator installation",
  "Hybrid insulator",
  "Transformer bushing",
  "Interphase spacer",
  "DPL insulator product",
] as const;

function shouldPlayVideo(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PlantSection({ cms }: { cms?: ContentBlock } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    setAllowVideo(shouldPlayVideo());
  }, []);

  useEffect(() => {
    if (!allowVideo) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldLoad(entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [allowVideo]);

  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {});
  }, [shouldLoad]);

  const eyebrow = cmsText(cms, "eyebrow", "Manufacturing");
  const title = cmsText(cms, "title", "On the factory floor.");
  const body = cmsText(
    cms,
    "body",
    "Moulding, assembly and routine test — Shiraz Special Economic Zone.",
  );

  const images = SITE_IMAGES.gallery.map((src, i) => ({
    src,
    alt: GALLERY_ALTS[i] ?? "Taban Niroo product",
  }));

  return (
    <section id="plant" className="bg-background" aria-label="On the factory floor">
      <Beat className="px-6 pb-10 pt-16 md:px-12 md:pb-12 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <RevealBlock delayMs={BEAT.first} distance={EVIDENCE.distance}>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy">
              {eyebrow}
            </p>
          </RevealBlock>

          <RevealUp
            as="h2"
            delay={BEAT.headline}
            duration={STATEMENT.duration}
            distance={STATEMENT.distance}
            /*
              Oswald uppercase — the section-heading voice.

              This heading was the last editorial h2 on the home feed still
              set in Inter sentence case. Every other section (Featured,
              Engineering, Technology, Installations, Why Taban, CEO) opens
              eyebrow → Oswald uppercase h2, and the exception here was not
              carrying a meaning: it sits on the ordinary page ground with
              the same eyebrow above it, so it read as drift rather than as
              a change of register. Sentence-case Inter stays reserved for
              type inside a held full-bleed scene, where `.type-cinema` is
              the narrator's voice.
            */
            className="font-hero-slogan text-brand-heading mt-5 text-balance text-3xl font-semibold uppercase tracking-tight md:text-4xl lg:text-5xl"
          >
            {title}
          </RevealUp>

          <RevealBlock
            delayMs={BEAT.lede}
            distance={EVIDENCE.distance}
            className="mt-5 max-w-2xl md:mt-6"
          >
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {body}
            </p>
          </RevealBlock>
        </div>
      </Beat>

      {/*
        Fixed aspect box owns the layout so the lazily-swapped video can
        never resize its container (CLS). The parallax lives on an inner,
        deliberately oversized layer: the outer box clips, so up to 20px
        of drift never exposes an edge, and the layer carries no transform
        of its own for `useElementParallax` to clobber.
      */}
      <Beat>
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 md:aspect-[21/9]">
          <div
            data-parallax="0.94"
            data-parallax-max="20"
            className="absolute inset-x-0 -inset-y-[4%]"
          >
            <ImageReveal className="absolute inset-0">
              {/* Same grade the R&D plates give this exact footage — the
                  home feed was the one place `industrial.mp4` played
                  ungraded, so the site's own establishing shot looked
                  flatter here than it does on the inner routes.
                  `.cine-grade` is `position: relative`, so it nests inside
                  the absolute layer rather than sharing it. */}
              <div ref={containerRef} className="absolute inset-0">
                {/* `--muted` for the same reason the CEO plate carries it:
                    this clip is lit against a saturated cobalt sweep, which
                    is by some distance the loudest colour on a page built
                    from graphite and one gold. */}
                <div className="cine-grade cine-grade--muted h-full w-full">
                  {/* Poster sits underneath at all times; the video, when it
                      is allowed to run, covers it. No cross-fade — they are
                      the same frame, so there is nothing to fade between. */}
                  <Image
                    src={VIDEO_POSTER}
                    alt=""
                    aria-hidden
                    fill
                    className="object-cover"
                    sizes="100vw"
                    quality={80}
                  />
                  {allowVideo && shouldLoad ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      poster={VIDEO_POSTER}
                      className="absolute inset-0 h-full w-full object-cover"
                      aria-label="Taban Niroo manufacturing footage"
                    >
                      <source src={VIDEO_SRC} type="video/mp4" />
                    </video>
                  ) : null}
                </div>
              </div>
            </ImageReveal>
          </div>
        </div>
      </Beat>

      <Beat className="py-12 md:py-16">
        <div className="relative">
          <ScrollPan
            className="px-0"
            innerClassName="px-6 pb-3 md:px-8 lg:px-10"
            ariaLabel="Scrollable product gallery"
            edgeFades
            fadeFrom="from-background"
            passVerticalScroll
          >
            <RevealBlock
              className="flex gap-4 md:gap-6"
              delayMs={BEAT.first}
              distance={EVIDENCE.distance}
              durationMs={EVIDENCE.duration}
              stagger={EVIDENCE.stagger}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative h-[min(58vh,22rem)] w-[min(80vw,22rem)] flex-shrink-0 overflow-hidden rounded-2xl ring-1 ring-border/50 dark:ring-white/[0.06] md:h-[min(64vh,26rem)] md:w-[min(56vw,28rem)] lg:h-[min(68vh,30rem)] lg:w-[min(42vw,32rem)]"
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-none"
                    sizes="(min-width: 1024px) 42vw, (min-width: 768px) 56vw, 80vw"
                    quality={75}
                    decoding="async"
                  />
                </div>
              ))}
            </RevealBlock>
          </ScrollPan>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
          <span aria-hidden className="inline-block h-px w-6 bg-current opacity-60" />
          <span>Scroll or drag to pan</span>
          <span aria-hidden className="inline-block h-px w-6 bg-current opacity-60" />
        </div>
      </Beat>
    </section>
  );
}
