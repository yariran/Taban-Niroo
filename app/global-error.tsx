"use client";

import { useEffect } from "react";

/**
 * Global error boundary — fallback for failures in the root layout
 * itself (CSS missing, providers throwing, etc.). Must own its own
 * `<html>`/`<body>` because layout has not rendered.
 *
 * Kept intentionally minimal and dependency-free — uses inline styles so
 * even a missing `globals.css` still leaves the user with something
 * legible and recoverable.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Critical · application boundary
          </p>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              marginTop: "1.25rem",
            }}
          >
            We can&apos;t render this page right now.
          </h1>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Please retry. If the problem persists, write to{" "}
            <a
              href="mailto:info@taban-niroo.com"
              style={{ color: "#7dd3fc", textDecoration: "underline" }}
            >
              info@taban-niroo.com
            </a>
            .
          </p>
          {error?.digest && (
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Reference · {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            type="button"
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              background: "#fafafa",
              color: "#0a0a0a",
              border: "none",
            }}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
