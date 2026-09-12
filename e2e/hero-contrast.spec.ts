import { expect, test, type Page } from "@playwright/test";
import { declineConsent, skipIntroViaTestFlag } from "./helpers/intro";

/**
 * Guards for the cinematic hero's contrast floor.
 *
 * `cinematic-hero.module.css` documents a measured contrast table and one
 * hard rule — "The ramp stops being useful past ~x=0.6W. That is the real
 * constraint on this layout: no line in the sequence may run wider, which
 * is a typographic budget, not a suggestion." Nothing enforced either, and
 * the table was a manual reading taken at four timestamps, so any later
 * edit to the copy, the type scale, the video or the ramps could walk a
 * line under the floor with nothing to catch it.
 *
 * The failure class: white copy over a moving image is the one place on
 * this site where contrast cannot be read off a stylesheet, because the
 * background is a video frame. So this measures the real composited pixels
 * rather than recomputing what the gradients ought to have produced —
 * replicating the ramps in code would only ever test the replica.
 *
 * Measuring that honestly is harder than it looks, and two earlier versions
 * of this spec were wrong in ways worth recording, because both reported a
 * pass against a hero with BOTH ramps disabled:
 *
 *   1. Sampling a crop that still contained the text. The glyphs are white,
 *      so they own the bright end of the histogram, and the ink/background
 *      boundary sits at whatever that line's glyph coverage happens to be.
 *      Picking a fixed percentile just read the darkest third of the crop.
 *   2. Hiding the ink and taking the brightest pixel in the rect. Closer,
 *      but a line's bounding rect also contains whatever else is painted
 *      there — the white scroll cue put 79 pure-white pixels inside the
 *      brandmark's box, none of them under a glyph, and one such pixel is
 *      enough to report 1.00:1.
 *
 * What it does now: screenshot the frame twice, once with the ink and once
 * with `color: transparent`, and difference them. Pixels that changed are
 * exactly where glyphs paint. The worst background is then the brightest
 * pixel of the ink-free frame RESTRICTED to that mask — the brightest thing
 * a glyph actually sits on, which is the number WCAG is about.
 */

/** Home visit with consent declined; intro bypassed via documented test flag. */
async function gotoHome(page: Page) {
  await declineConsent(page);
  await skipIntroViaTestFlag(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}

/** The stated budget: the side ramp has nothing left to give past 0.6W. */
const RAMP_USEFUL_TO = 0.6;

/**
 * Sample positions, as fractions of the HERO'S OWN runway — not of the
 * document. The hero is ~1800px of a ~19000px page, so page-relative
 * fractions put all but the first sample past the hero entirely; an earlier
 * version did that and measured two lines out of the eight in the table.
 */
const RUNWAY_FRACTIONS = [
  0.02, 0.08, 0.14, 0.2, 0.26, 0.32, 0.38, 0.44, 0.5, 0.56, 0.62, 0.68, 0.74,
  0.8, 0.86, 0.92,
];

/**
 * Minimum per-channel change between the inked and ink-free frames for a
 * pixel to count as glyph coverage. Above video noise and 8-bit rounding,
 * below the faintest anti-aliased edge that carries real ink.
 */
const INK_DELTA = 12;

type PaintedLine = {
  text: string;
  fontPx: number;
  /** WCAG large text: >= 24px regular, or >= 18.66px bold. */
  isLarge: boolean;
  color: [number, number, number];
  /** Inked rect of the text node, not the block box. */
  rect: { x: number; y: number; w: number; h: number };
  widthFraction: number;
};

/** Relative luminance, sRGB. */
function luminance([r, g, b]: [number, number, number]): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: [number, number, number], b: [number, number, number]) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Absolute scroll offsets covering the hero's sticky runway. */
async function runwayOffsets(page: Page): Promise<number[]> {
  const { top, height } = await page.evaluate(() => {
    const hero = document.querySelector("main section");
    const wrapper = hero?.closest("#main-content > *") ?? hero;
    const r = wrapper!.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  });
  return RUNWAY_FRACTIONS.map((f) => Math.round(top + height * f));
}

/** Lines the reader can actually see right now, with their inked rects. */
async function paintedLines(page: Page): Promise<PaintedLine[]> {
  return page.evaluate(() => {
    const effectiveOpacity = (el: Element) => {
      let o = 1;
      let n: Element | null = el;
      while (n && n !== document.body) {
        const cs = getComputedStyle(n);
        if (cs.visibility === "hidden" || cs.display === "none") return 0;
        o *= parseFloat(cs.opacity) || 0;
        n = n.parentElement;
      }
      return o;
    };

    const hero = document.querySelector("main section");
    if (!hero) return [];
    const out: PaintedLine[] = [];

    for (const el of Array.from(hero.querySelectorAll("*"))) {
      if (el.children.length) continue;
      const text = (el.textContent ?? "").trim();
      if (text.length < 2) continue;

      // `sr-only` copy is clipped to 1px — present for assistive tech,
      // never painted, and must not be measured as if it were on screen.
      const box = el.getBoundingClientRect();
      if (box.width <= 2 || box.height <= 2) continue;
      if (effectiveOpacity(el) < 0.5) continue;
      if (box.bottom <= 0 || box.top >= window.innerHeight) continue;

      // The inked rect: a Range over the text node. The block box is wide
      // and mostly empty, so using it would drag in background the glyphs
      // never touch.
      const range = document.createRange();
      range.selectNodeContents(el);
      const r = range.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      if (r.bottom <= 0 || r.top >= window.innerHeight) continue;

      const cs = getComputedStyle(el);
      const m = cs.color.match(/[\d.]+/g) ?? ["255", "255", "255"];
      const fontPx = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;

      out.push({
        text: text.slice(0, 40),
        fontPx,
        isLarge: fontPx >= 24 || (fontPx >= 18.66 && weight >= 700),
        color: [Number(m[0]), Number(m[1]), Number(m[2])],
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        widthFraction: r.width / window.innerWidth,
      });
    }
    return out;
  });
}

/**
 * `color: transparent` rather than `visibility` or `opacity`: layout is
 * untouched, and — critically — `overlayCopy`'s opacity is driven from the
 * scroll loop off the scene opacities, so dimming a scene would also dim
 * the very scrim under test.
 */
const INK_OFF_CSS =
  "main section :is(h1,h2,h3,h4,p,span,div,a,li,strong,em,b){" +
  "color:transparent!important;text-shadow:none!important;" +
  "-webkit-text-fill-color:transparent!important}";

async function setInk(page: Page, on: boolean) {
  await page.evaluate(
    ([enable, css]) => {
      const existing = document.getElementById("tn-ink-off");
      if (enable) {
        existing?.remove();
        return;
      }
      if (existing) return;
      const style = document.createElement("style");
      style.id = "tn-ink-off";
      style.textContent = css as string;
      document.head.append(style);
    },
    [on, INK_OFF_CSS] as const,
  );
}

/**
 * Worst background luminance under each line's glyphs, from a pair of
 * full-viewport frames (inked / ink-free). Returns one RGB per input rect,
 * or null where the line turned out to paint no measurable ink.
 */
async function worstBackgroundUnderGlyphs(
  page: Page,
  rects: PaintedLine["rect"][],
): Promise<Array<[number, number, number] | null>> {
  await setInk(page, true);
  const inked = (await page.screenshot()).toString("base64");
  await setInk(page, false);
  const bare = (await page.screenshot()).toString("base64");
  await setInk(page, true);

  return page.evaluate(
    async ({ inkedSrc, bareSrc, rects, delta }) => {
      const load = async (src: string) => {
        const img = new Image();
        img.src = `data:image/png;base64,${src}`;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        c.getContext("2d")!.drawImage(img, 0, 0);
        return c.getContext("2d")!;
      };
      const a = await load(inkedSrc);
      const b = await load(bareSrc);
      const f = (v: number) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      };

      return rects.map((r) => {
        const x = Math.max(0, Math.floor(r.x));
        const y = Math.max(0, Math.floor(r.y));
        const w = Math.max(1, Math.ceil(r.w));
        const h = Math.max(1, Math.ceil(r.h));
        const A = a.getImageData(x, y, w, h).data;
        const B = b.getImageData(x, y, w, h).data;

        let best = -1;
        let rgb: [number, number, number] | null = null;
        for (let i = 0; i < A.length; i += 4) {
          // Did a glyph paint here? Only then is this pixel's background
          // something the reader has to read text against.
          const changed =
            Math.abs(A[i] - B[i]) > delta ||
            Math.abs(A[i + 1] - B[i + 1]) > delta ||
            Math.abs(A[i + 2] - B[i + 2]) > delta;
          if (!changed) continue;
          const l =
            0.2126 * f(B[i]) + 0.7152 * f(B[i + 1]) + 0.0722 * f(B[i + 2]);
          if (l > best) {
            best = l;
            rgb = [B[i], B[i + 1], B[i + 2]];
          }
        }
        return rgb;
      });
    },
    { inkedSrc: inked, bareSrc: bare, rects, delta: INK_DELTA },
  );
}

test.describe("cinematic hero contrast", () => {
  test("no painted line exceeds the ramp's useful width", async ({ page }) => {
    await gotoHome(page);

    const offenders: string[] = [];
    let seen = 0;

    for (const y of await runwayOffsets(page)) {
      await page.evaluate((to) => window.scrollTo(0, to), y);
      await page.waitForTimeout(400);

      for (const line of await paintedLines(page)) {
        seen++;
        if (line.widthFraction > RAMP_USEFUL_TO) {
          offenders.push(
            `"${line.text}" runs ${(line.widthFraction * 100).toFixed(1)}% of the ` +
              `viewport (budget ${RAMP_USEFUL_TO * 100}%) at scroll ${y}px`,
          );
        }
      }
    }

    expect(
      seen,
      "sampled no painted hero copy — the runway or the scene sequence moved",
    ).toBeGreaterThan(0);

    expect(
      offenders,
      `Hero copy must stay inside the side ramp. Past ~0.6W the ramp has faded ` +
        `to transparent, so a longer line is painted straight onto the video:\n` +
        offenders.join("\n"),
    ).toEqual([]);
  });

  test("every painted line clears its WCAG floor on the composited frame", async ({
    page,
  }) => {
    await gotoHome(page);

    const failures: string[] = [];
    let measured = 0;

    for (const y of await runwayOffsets(page)) {
      await page.evaluate((to) => window.scrollTo(0, to), y);
      // Let the scroll-driven scene opacities and `overlayCopy` settle
      // before the frame is captured, or the sample reads a mid-fade state
      // the reader never sits in front of.
      await page.waitForTimeout(500);

      const lines = await paintedLines(page);
      if (!lines.length) continue;

      const backgrounds = await worstBackgroundUnderGlyphs(
        page,
        lines.map((l) => l.rect),
      );

      lines.forEach((line, i) => {
        const bg = backgrounds[i];
        // No differing pixels means the line painted nothing measurable —
        // mid-fade, or clipped. Nothing to assert against.
        if (!bg) return;
        measured++;

        const ratio = contrast(line.color, bg);
        const floor = line.isLarge ? 3.0 : 4.5;
        if (ratio < floor) {
          failures.push(
            `"${line.text}" (${line.fontPx.toFixed(0)}px) measured ` +
              `${ratio.toFixed(2)}:1 against a floor of ${floor}:1 at scroll ${y}px`,
          );
        }
      });
    }

    // A hero that paints no copy at all would satisfy every assertion above
    // while having quietly broken, so require the sampling to have seen it.
    expect(
      measured,
      "sampled no painted hero copy — the scene sequence or the scroll " +
        "runway changed and this spec is no longer measuring anything",
    ).toBeGreaterThan(0);

    expect(
      failures,
      `Hero copy sits on a video frame, so contrast is a measured property, ` +
        `not a declared one:\n${failures.join("\n")}`,
    ).toEqual([]);
  });
});
