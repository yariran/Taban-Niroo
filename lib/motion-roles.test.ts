import { describe, expect, it } from "vitest";
import {
  BEAT,
  EVIDENCE,
  PLATE,
  ROLE_SPECS,
  STATEMENT,
  type MotionRole,
} from "@/lib/motion-roles";

/**
 * Guardrail against the regression this whole refactor exists to undo.
 *
 * The previous system had eleven named variants that were perceptually
 * one variant: all translate 8-16px + optional scale 0.98-1.02 + fade,
 * over 860-980ms. Nothing in the codebase could tell you that, so it
 * survived for a long time and made the page read as generated.
 *
 * These tests encode "the roles are actually distinguishable" as a
 * property that CI checks, so adding a fourth role — or quietly retuning
 * an existing one until it collides with its neighbour — fails loudly.
 */

const ROLES: MotionRole[] = ["statement", "evidence", "plate"];

/** Every unordered pair of roles. */
const PAIRS: [MotionRole, MotionRole][] = ROLES.flatMap((a, i) =>
  ROLES.slice(i + 1).map((b) => [a, b] as [MotionRole, MotionRole]),
);

describe("motion role separation", () => {
  /**
   * Two roles are perceptually distinct when ANY of these holds:
   *
   *   (a) duration ratio >= 2x — well past the ~15-20% JND for duration;
   *   (b) exactly one of them translates — a categorical difference in
   *       the primary gesture, which is the strongest separator available
   *       (this is what makes `plate` distinct from `statement` despite
   *       their durations being only 1.27x apart);
   *   (c) both translate and the distance ratio is >= 2.5x.
   *
   * The old variants satisfied NONE of these against each other.
   */
  it.each(PAIRS)("%s and %s are perceptually distinct", (a, b) => {
    const specA = ROLE_SPECS[a];
    const specB = ROLE_SPECS[b];

    const durationRatio =
      Math.max(specA.duration, specB.duration) /
      Math.min(specA.duration, specB.duration);

    const translatesA = specA.distance > 0;
    const translatesB = specB.distance > 0;
    const gestureDiffers = translatesA !== translatesB;

    const distanceRatio =
      translatesA && translatesB
        ? Math.max(specA.distance, specB.distance) /
          Math.min(specA.distance, specB.distance)
        : Infinity;

    const distinct =
      durationRatio >= 2 || gestureDiffers || distanceRatio >= 2.5;

    expect(
      distinct,
      `${a} vs ${b}: duration ratio ${durationRatio.toFixed(2)}x, ` +
        `distance ratio ${distanceRatio === Infinity ? "n/a" : distanceRatio.toFixed(2) + "x"}, ` +
        `gesture differs: ${gestureDiffers}. ` +
        `At least one separator must hold — see the header comment in lib/motion-roles.ts.`,
    ).toBe(true);
  });

  it("keeps plate as the only role without translation", () => {
    // Removing the gesture the rest of the page is built from is what
    // makes a plate read as a frame opening rather than a block sliding.
    const withoutTranslate = ROLES.filter((r) => ROLE_SPECS[r].distance === 0);
    expect(withoutTranslate).toEqual(["plate"]);
  });

  it("orders durations statement < plate and evidence < statement", () => {
    // evidence is a tick, statement is an arrival, plate is the slowest
    // thing on the page. If this ordering inverts, the grammar's meaning
    // inverts with it.
    expect(EVIDENCE.duration).toBeLessThan(STATEMENT.duration);
    expect(STATEMENT.duration).toBeLessThan(PLATE.duration);
  });
});

describe("beat grid", () => {
  it("is strictly increasing", () => {
    const beats = [BEAT.first, BEAT.headline, BEAT.lede, BEAT.group];
    const sorted = [...beats].sort((x, y) => x - y);
    expect(beats).toEqual(sorted);
    expect(new Set(beats).size).toBe(beats.length);
  });

  it("resolves the whole phrase inside a comfortable scroll dwell", () => {
    // Last beat plus the longest role that can sit on it. Beyond ~2s the
    // tail animates while the reader is already leaving the section.
    const longest = BEAT.group + STATEMENT.duration;
    expect(longest).toBeLessThanOrEqual(2000);
  });
});

describe("evidence stagger", () => {
  it("caps its tail so long lists stay in phase", () => {
    // Uncapped, a nine-item list ran 9 * 55 = 495ms of stagger on top of
    // its own 420ms — a tail long enough to desynchronise from the beat.
    const tail = EVIDENCE.staggerCap * EVIDENCE.stagger;
    expect(tail).toBeLessThanOrEqual(EVIDENCE.duration);
  });
});
