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
  priority,
  ...props
}: FadeImageProps) {
  const reduceMotion = usePrefersReducedMotion();
  const eager = Boolean(priority);
  const [isVisible, setIsVisible] = useState(reduceMotion || eager);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion || eager) return;

    let timer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = window.setTimeout(() => {
            setIsVisible(true);
          }, fadeDelay);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: "480px 0px",
      },
    );

    const node = ref.current;
    if (node) observer.observe(node);

    return () => {
      observer.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [fadeDelay, eager, reduceMotion]);

  const revealed = isLoaded && (reduceMotion || isVisible);

  return (
    <div ref={ref} className="relative h-full w-full">
      <Image
        {...props}
        alt={alt ?? ""}
        priority={priority}
        decoding="async"
        quality={props.quality ?? 80}
        className={`${className || ""} transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          revealed ? "opacity-100" : "opacity-0"
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
