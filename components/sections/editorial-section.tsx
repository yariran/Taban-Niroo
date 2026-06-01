"use client";

/**
 * Editorial section — manufacturing footage only.
 *
 * The KPI tile row that previously lived above the video has been
 * merged into the Why-Taban-Niroo chapter so the proof numbers sit
 * with the narrative they support. This wrapper now exists purely to
 * present the full-bleed factory video as a quiet cinematic interlude
 * between the engineering chapter and the testimonials.
 */
export function EditorialSection() {
  return (
    <section className="bg-background" aria-label="Manufacturing footage">
      <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/industrial.mp4"
          aria-label="Taban Niroo manufacturing footage"
        />
      </div>
    </section>
  );
}
