"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/industrial.mp4";

/**
 * Editorial section — manufacturing footage only.
 *
 * Video loads only when the block nears the viewport so the 6 MB asset
 * does not compete with above-the-fold images on cold Vercel visits.
 */
export function EditorialSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.12, rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !videoRef.current) return;
    videoRef.current.load();
    void videoRef.current.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <section className="bg-background" aria-label="Manufacturing footage">
      <div
        ref={containerRef}
        className="relative aspect-[16/9] w-full overflow-hidden bg-muted/30 md:aspect-[21/9]"
      >
        {shouldLoad ? (
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
