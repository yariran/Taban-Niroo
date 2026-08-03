"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/industrial.mp4";

function shouldPlayVideo(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Manufacturing footage on all viewports — no poster / still underneath.
 * Skipped only when the visitor prefers reduced motion.
 */
export function EditorialSection() {
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

  return (
    <section className="bg-background" aria-label="Manufacturing footage">
      <div
        ref={containerRef}
        className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 md:aspect-[21/9]"
      >
        {allowVideo && shouldLoad ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            aria-label="Taban Niroo manufacturing footage"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        ) : null}
      </div>
    </section>
  );
}
