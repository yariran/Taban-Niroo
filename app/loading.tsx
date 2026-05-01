/**
 * Global Suspense fallback.
 *
 * Quiet, professional placeholder: a small mono-caps label and a thin
 * neutral hairline. Intentionally static — no spinner, no animation —
 * so the loading state never reads as a marketing flourish.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-6 py-24 text-foreground"
    >
      <p className="font-mono text-[10.5px] uppercase tracking-[0.32em] text-muted-foreground">
        Loading
      </p>

      <div
        aria-hidden
        className="mt-6 h-px w-[min(280px,72vw)] bg-foreground/20 dark:bg-white/15"
      />
    </div>
  );
}
