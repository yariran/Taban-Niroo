"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface FadeImageProps extends Omit<ImageProps, "onLoad"> {
  fadeDelay?: number;
}

export function FadeImage({
  className,
  fadeDelay = 0,
  alt,
  ...props
}: FadeImageProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(reduceMotion);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, fadeDelay);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [fadeDelay, reduceMotion]);

  const revealed = isLoaded && (reduceMotion || isVisible);

  return (
    <div ref={ref} className="relative h-full w-full">
      <Image
        {...props}
        alt={alt ?? ""}
        className={`${className || ""} transition-all duration-700 ease-out motion-reduce:transition-none ${
          revealed ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setIsVisible(true);
        }}
      />
    </div>
  );
}
