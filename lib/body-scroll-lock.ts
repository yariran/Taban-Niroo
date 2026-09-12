/**
 * iOS-safe body scroll lock.
 * Uses position:fixed + scrollY restore so rubber-banding doesn't scroll
 * the page behind modals / drawers (overflow:hidden alone is not enough).
 */

let lockCount = 0;
let savedScrollY = 0;

export function lockBodyScroll(): void {
  if (typeof document === "undefined") return;
  if (lockCount === 0) {
    savedScrollY = window.scrollY;
    const body = document.body;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  }
  lockCount += 1;
}

export function unlockBodyScroll(): void {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  const body = document.body;
  body.style.overflow = "";
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  window.scrollTo(0, savedScrollY);
  // Intro (and other locks) collapse scrollHeight while active; Lenis must remeasure.
  try {
    window.dispatchEvent(new Event("resize"));
    (window as Window & { __tnLenis?: { resize?: () => void } }).__tnLenis?.resize?.();
  } catch {
    /* ignore */
  }
}
