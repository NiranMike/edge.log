"use client";

import { useEffect } from "react";

// Catches errors thrown by the root layout itself. Next.js requires this file
// to render its own <html>/<body> since the layout that would normally supply
// them is what crashed. Kept dependency-free (no shared fonts/components) so
// it can render even if something in the layout's imports is broken.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#07090d" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
            fontFamily: "ui-monospace, 'JetBrains Mono', monospace",
          }}
        >
          <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>

            <div
              style={{
                width: 56, height: 56, borderRadius: "9999px",
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: "#f87171" }}>
                <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10.29 3.86l-8.18 14.18A1.5 1.5 0 0 0 3.42 20.5h17.16a1.5 1.5 0 0 0 1.3-2.46L13.71 3.86a1.5 1.5 0 0 0-2.6 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 style={{ fontSize: 20, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
              Application error
            </h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 32 }}>
              Something broke at the application level. Reloading usually fixes it.
            </p>

            {error.digest && (
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", marginBottom: 24 }}>
                Error ref: {error.digest}
              </p>
            )}

            <button
              type="button"
              onClick={() => reset()}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 8, border: "none",
                background: "#4ade80", color: "#07090d", fontFamily: "inherit",
                fontSize: 12, fontWeight: 500, cursor: "pointer",
              }}
            >
              Reload
            </button>

          </div>
        </div>
      </body>
    </html>
  );
}
