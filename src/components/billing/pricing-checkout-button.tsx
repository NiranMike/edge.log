"use client";

import { useState } from "react";
import { createCheckoutAction } from "@/lib/actions/billing-actions";
import { cx, ds } from "@/style";

export function PricingCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handle() {
    setLoading(true);
    setError(null);
    const result = await createCheckoutAction();
    if (result.ok) {
      window.location.href = result.data.url;
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handle}
        disabled={loading}
        className={cx(
          "group relative overflow-hidden w-full",
          ds.btnPrimary,
          "px-6 py-4 text-[11px] tracking-[0.18em]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        style={ds.clip12}
      >
        <span className={ds.btnShimmer} />
        <span className="relative z-10">
          {loading ? "Redirecting…" : "Start Pro →"}
        </span>
      </button>
      {error && (
        <p className="font-mono text-[10px] text-red-400/80 text-center">{error}</p>
      )}
    </div>
  );
}
