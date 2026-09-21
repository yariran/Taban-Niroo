"use client";

import { useEffect, useRef } from "react";
import { LocaleLink } from "@/components/locale-link";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { smoothstep01 } from "@/lib/use-scroll-scene";
import styles from "./cinematic-hero.module.css";

/**
 * Cinematic hero — scroll IS the shutter.
 *
 * One 10s product film of a composite insulator under water, and one
 * viewport of scroll that runs it. Nothing autoplays: `scrollY` maps to
 * `video.currentTime`, so the reader is moving the film, not watching a
 * background loop with words on top. Four lines of copy claim bands of
 * the same runway and cross-fade in place.
 *
 *   0 %  …  12 %   silence — the wide establishing shot, no words on it
 *  12 % …  38 %   Built for the elements
 *  34 % …  58 %   Engineered for reliability
 *  55 % …  80 %   Composite insulation + the one factual line
 *  77 % … 100 %   Taban Niroo + the only link in the frame
 *
 * ─── Why this does not use `useScrollScene` ───────────────────────────
 *
 * The hook (and `hero-section.tsx`, which inlines the same loop) puts
 * scroll progress in React state, so the whole subtree re-renders on every
 * scroll frame. That is affordable for three fading divs. It is not
 * affordable next to a video decoder: at 120Hz it is ~120 reconciliations
 * a second competing with seek work, and it would also mean holding
 * `currentTime` in state, which is the one thing a scrubbed video must
 * never do.
 *
 * So the geometry convention is shared — tall `track` wrapping a
 * `sticky top-0` stage, progress = `-rect.top / (trackHeight - vh)` — and
 * the easing primitive is imported rather than re-derived, but the writes
 * go straight to the DOM through refs inside one rAF loop. Zero renders
 * after mount.
 */

/** Matches the real asset; `video.duration` wins once metadata lands. */
const FILM_SECONDS = 10;

/**
 * How hard the rendered playhead chases the scroll playhead, per frame.
 *
 * This is the whole reason the film doesn't strobe. Raw `p * duration`
 * assigned every frame asks the decoder for a different random-access
 * point ~120 times a second; it can't serve them, drops most, and the
 * result reads as a flipbook. Lerping means consecutive requests land
 * inside the same GOP, where a browser decodes forward instead of
 * re-seeking — so a fast flick still arrives at the right frame, it just
 * arrives a beat later, which is what "cinematic" looks like anyway.
 */
const PLAYHEAD_LERP = 0.14;

/** Below ~1½ frames of 24fps there is nothing new to show. */
const SEEK_EPSILON = 1 / 16;

/** Idle frame at which the reduced-motion and poster-less first paint sit. */
const STILL_FRAME_SECONDS = 3.2;

type Band = {
  /** [start, end] of the fade-in, as fractions of the runway. */
  enter: readonly [number, number];
  /** [start, end] of the fade-out. Omitted = the scene holds to the end. */
  exit?: readonly [number, number];
};

/**
 * Bands hand off rather than genuinely overlap, and that is a correction
 * made against the running page, not a preference.
 *
 * A wide crossover was tried first — outgoing still at ~20% while the
 * incoming rose — on the theory that the exit lift would separate them
 * vertically. It does not: these headlines are ~65px a line and two lines
 * tall, so a 45px offset interleaves the two blocks and the frame reads as
 * a double exposure. Fading one out and the next in, with a ~2% whisper of
 * crossover and a short wordless breath between, is what actually reads as
 * a dissolve at this size. (Apple's product pages do the same thing, for
 * the same reason.)
 *
 * The breath is ~20px of scroll — long enough to feel deliberate, far too
 * short to read as a page that has stopped working, and the product is
 * still on screen throughout it.
 */
const BANDS: readonly Band[] = [
  { enter: [0.12, 0.21], exit: [0.3, 0.36] },
  { enter: [0.35, 0.44], exit: [0.51, 0.57] },
  { enter: [0.56, 0.65], exit: [0.72, 0.78] },
  { enter: [0.77, 0.86] },
] as const;

/** Entrance travel, px. Enough to read as a lift; short of a slide. */
const ENTER_RISE = 30;
/** Exit travel, px — shorter than the entrance, so leaving is quieter. */
const EXIT_LIFT = 16;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function CinematicHeroSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

  const reduceMotion = usePrefersReducedMotion();

  /**
   * Prime the element for scrubbing.
   *
   * Two things have to happen before `currentTime` does anything useful,
   * and both are easy to miss:
   *
   *  1. Metadata, for `duration`.
   *  2. A decoded frame. Mobile Safari and some Android builds will hold a
   *     blank surface for a video that has never played, and a seek on a
   *     never-started element can be ignored outright. A muted
   *     `play()`/`pause()` pair costs one frame and settles both.
   *
   * Runs in its own effect (not the scroll loop) so it happens exactly
   * once, whether or not motion is reduced — the still frame needs it too.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const saveData = Boolean(connection?.saveData);
    const slowNet =
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    /**
     * Full mp4 download waits for the first meaningful scroll into the
     * runway. Metadata-only first paint keeps the ~0.5MB film off LCP;
     * Save-Data / 2G never upgrades past metadata.
     */
    const upgradeToFull = () => {
      if (cancelled || saveData || slowNet) return;
      if (video.dataset.tnFull === "1") return;
      video.dataset.tnFull = "1";
      video.preload = "auto";
      if (video.readyState < 3) video.load();
    };

    const prime = () => {
      if (cancelled) return;
      void video
        .play()
        .then(() => {
          video.pause();
          if (reduceMotion && Number.isFinite(video.duration)) {
            video.currentTime = Math.min(
              STILL_FRAME_SECONDS,
              video.duration - 0.05,
            );
          }
        })
        .catch(() => {
          /* Autoplay refused (rare while muted) — seeking still works. */
        });
    };

    const onScrollIntent = () => {
      if (cancelled) return;
      const track = trackRef.current;
      if (!track) {
        upgradeToFull();
        return;
      }
      const rect = track.getBoundingClientRect();
      const runway = Math.max(track.offsetHeight - window.innerHeight, 1);
      const p = clamp01(-rect.top / runway);
      if (p > 0.008 || rect.top < window.innerHeight * 0.85) {
        upgradeToFull();
        window.removeEventListener("scroll", onScrollIntent);
      }
    };

    if (video.readyState >= 1) {
      prime();
    } else {
      video.addEventListener("loadedmetadata", prime, { once: true });
    }

    window.addEventListener("scroll", onScrollIntent, { passive: true });

    let idleHandle: number | undefined;
    const warmIfVisible = () => {
      const track = trackRef.current;
      if (!track || cancelled) return;
      const rect = track.getBoundingClientRect();
      if (rect.bottom > 80 && rect.top < window.innerHeight) {
        upgradeToFull();
      }
    };
    if (typeof requestIdleCallback === "function") {
      idleHandle = requestIdleCallback(warmIfVisible, { timeout: 3500 });
    } else {
      idleHandle = window.setTimeout(warmIfVisible, 2800);
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", prime);
      window.removeEventListener("scroll", onScrollIntent);
      if (typeof cancelIdleCallback === "function") {
        cancelIdleCallback(idleHandle as number);
      }
      window.clearTimeout(idleHandle as number);
    };
  }, [reduceMotion]);

  /**
   * The runway loop.
   *
   * Gated on an IntersectionObserver: no rAF runs while the hero is off
   * screen, which is most of the page. Reads are batched ahead of writes
   * inside the frame so nothing forces a second layout.
   */
  useEffect(() => {
    if (reduceMotion) return;

    const track = trackRef.current;
    if (!track) return;

    let rafId = 0;
    let running = false;
    /** Rendered playhead, in seconds. Deliberately NOT React state. */
    let playhead = 0;
    /** Last value written to `<html data-tn-dark-hero>`; write-on-change. */
    let darkHero: boolean | null = null;

    const setDarkHero = (next: boolean) => {
      if (darkHero === next) return;
      darkHero = next;
      const root = document.documentElement;
      if (next) root.dataset.tnDarkHero = "true";
      else delete root.dataset.tnDarkHero;
    };

    const frame = () => {
      // ── read ────────────────────────────────────────────────────────
      const rect = track.getBoundingClientRect();
      const viewport = window.innerHeight;
      /**
       * The stage's own height, not `viewport`.
       *
       * `.stage` is sized in `svh`, so on a phone it is a different number
       * from `window.innerHeight` the whole time the toolbar is sliding.
       * Using the viewport here made the denominator larger than the pin's
       * real travel, so `p` topped out below 1 on mobile and the fourth
       * band — the brandmark and the one link in the frame — never reached
       * the 0.85 its `pointer-events` is gated on. The CTA was literally
       * unclickable on a phone and fine on every desktop it was tested on.
       * `viewport` is still the right measure for the dark-header test
       * below, which is about what the reader can see, not about travel.
       */
      const stageH = stageRef.current?.offsetHeight || viewport;
      const runway = Math.max(track.offsetHeight - stageH, 1);
      const p = clamp01(-rect.top / runway);
      const video = videoRef.current;
      const duration =
        video && Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : FILM_SECONDS;

      // ── write ───────────────────────────────────────────────────────
      let loudest = 0;
      for (let i = 0; i < BANDS.length; i += 1) {
        const node = sceneRefs.current[i];
        if (!node) continue;
        const band = BANDS[i]!;
        const enter = smoothstep01(
          (p - band.enter[0]) / (band.enter[1] - band.enter[0]),
        );
        const exit = band.exit
          ? smoothstep01((p - band.exit[0]) / (band.exit[1] - band.exit[0]))
          : 0;
        const opacity = enter * (1 - exit);
        if (opacity > loudest) loudest = opacity;

        const y = (1 - enter) * ENTER_RISE - exit * EXIT_LIFT;
        node.style.opacity = opacity.toFixed(3);
        node.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        /* Hidden scenes leave the a11y tree and hit-testing entirely, so
           the CTA can never be focused or clicked while invisible. */
        node.style.visibility = opacity > 0.02 ? "visible" : "hidden";
        node.style.pointerEvents = opacity > 0.85 ? "auto" : "none";
      }

      /* The scrim rises with the loudest line and relaxes between them —
         the product is at its clearest in the silences. */
      if (overlayRef.current) {
        overlayRef.current.style.opacity = (loudest * 0.85).toFixed(3);
      }

      /**
       * 2%, not the 4% a still plate would want.
       *
       * The film performs its own push-in — wide establishing shot into
       * the sheds — so CSS scale here is only there to keep the very
       * first and last frames from feeling static at the ends of the
       * runway. Any more and it double-zooms a 1280px source and the
       * droplet edges go soft, which is the one thing this footage
       * cannot afford.
       */
      if (videoWrapRef.current) {
        videoWrapRef.current.style.transform = `scale(${(1 + p * 0.02).toFixed(4)})`;
      }

      if (cueRef.current) {
        cueRef.current.style.opacity = (1 - smoothstep01(p / 0.06)).toFixed(3);
      }

      /* Light header text for as long as the dark stage is under it. */
      setDarkHero(rect.bottom > 96 && rect.top < viewport);

      // ── playhead ────────────────────────────────────────────────────
      if (video) {
        const target = p * duration;
        const delta = target - playhead;
        playhead += Math.abs(delta) < 0.002 ? delta : delta * PLAYHEAD_LERP;
        if (
          video.readyState >= 1 &&
          !video.seeking &&
          Math.abs(video.currentTime - playhead) > SEEK_EPSILON
        ) {
          video.currentTime = playhead;
        }
      }

      if (running) rafId = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafId);
      setDarkHero(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else stop();
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(track);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [reduceMotion]);

  /**
   * Decorative by definition: every word the film says is also real text
   * in the DOM below, so there is nothing here for an AT user to miss.
   * No controls, no PiP, no audio track played — and `tabIndex={-1}`
   * because a hidden, contentless media element in the tab order is pure
   * noise.
   */
  const videoEl = (
    <video
      ref={videoRef}
      className={styles.video}
      muted
      loop={false}
      playsInline
      preload="metadata"
      poster="/images/taban-hero-poster.jpg"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/videos/taban-hero.mp4" type="video/mp4" />
    </video>
  );

  const heading = (
    <h1 className="sr-only">
      Taban Niroo — composite insulators, hybrid insulators and transformer
      bushings for high-voltage power transmission
    </h1>
  );

  /* Copy is English inside an RTL document on /fa — same as the proof
     band's lede. `dir="ltr"` keeps the terminal punctuation on the
     correct side until the translations land. */
  if (reduceMotion) {
    return (
      <section className="relative" dir="ltr">
        {heading}
        <div className={styles.staticStage}>
          <div className={styles.videoWrap}>{videoEl}</div>
          <div className={styles.overlayBase} aria-hidden />
          <div className={styles.staticCopy}>
            <p className={styles.headline}>
              <span className={styles.line}>Built for </span>
              <span className={styles.lineSoft}>the elements</span>
            </p>
            <p className={styles.staticLine}>Engineered for reliability</p>
            <p className={styles.staticLine}>Composite insulation</p>
            <p className={styles.support}>
              Designed for demanding power transmission environments.
            </p>
            <div className={styles.staticBrand}>
              <p className={styles.brandmark}>Taban Niroo</p>
              <div className={styles.ctaRow}>
                <LocaleLink href="/products" className={styles.cta}>
                  Explore our solutions
                  <CtaArrow />
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative" dir="ltr">
      {heading}

      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage}>
          <div ref={videoWrapRef} className={styles.videoWrap}>
            {videoEl}
          </div>

          <div className={styles.overlayBase} aria-hidden />
          <div ref={overlayRef} className={styles.overlayCopy} aria-hidden />

          <div className={styles.sceneStack}>
            <div
              ref={(node) => {
                sceneRefs.current[0] = node;
              }}
              className={styles.scene}
            >
              <div className={styles.sceneInner}>
                {/*
                  The trailing space inside the first span is load-bearing.
                  Two `display: block` spans with no whitespace between them
                  read out as "Built forthe elements" — CSS collapses the
                  space at the end of a line so nothing moves visually, but
                  the accessible name and the text a crawler sees are both
                  correct only if it is there.
                */}
                <p className={styles.headline}>
                  <span className={styles.line}>Built for </span>
                  <span className={styles.lineSoft}>the elements</span>
                </p>
              </div>
            </div>

            <div
              ref={(node) => {
                sceneRefs.current[1] = node;
              }}
              className={styles.scene}
            >
              <div className={styles.sceneInner}>
                <p className={styles.headline}>
                  <span className={styles.line}>Engineered for </span>
                  <span className={styles.lineSoft}>reliability</span>
                </p>
              </div>
            </div>

            <div
              ref={(node) => {
                sceneRefs.current[2] = node;
              }}
              className={styles.scene}
            >
              <div className={styles.sceneInner}>
                {/*
                  Two lines, not one, and that is a legibility fix rather
                  than a taste call: set on a single line this runs to
                  x≈668 on a 1024 stage, which is past the point where the
                  reading ramp has decayed to nothing, and the tail of the
                  word lands on bare macro highlights at 1.9:1 — under the
                  3.0 floor for large text. Broken, it stays inside the
                  ramp at ~5:1 and picks up the same two-line rhythm as
                  the scenes either side of it.
                */}
                <h2 className={styles.headline}>
                  <span className={styles.line}>Composite </span>
                  <span className={styles.lineSoft}>insulation</span>
                </h2>
                <p className={styles.support}>
                  Designed for demanding power transmission environments.
                </p>
              </div>
            </div>

            <div
              ref={(node) => {
                sceneRefs.current[3] = node;
              }}
              className={styles.scene}
            >
              <div className={styles.sceneInner}>
                <p className={styles.brandmark}>Taban Niroo</p>
                <div className={styles.ctaRow}>
                  <LocaleLink href="/products" className={styles.cta}>
                    Explore our solutions
                    <CtaArrow />
                  </LocaleLink>
                </div>
              </div>
            </div>
          </div>

          <div ref={cueRef} className={styles.cue} aria-hidden />
        </div>
      </div>
    </section>
  );
}

/** The "→" of the CTA, drawn rather than typed so its weight matches the
    type instead of whatever the fallback font ships. */
function CtaArrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className={styles.ctaArrow}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 8h11M9.5 4 13.5 8l-4 4" />
    </svg>
  );
}
