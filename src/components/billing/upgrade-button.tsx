"use client";

import { useState }              from "react";
import { createCheckoutAction }  from "@/lib/actions/billing-actions";
import { cx }                    from "@/style";

interface Props {
  label?:     string;
  className?: string;
  variant?:   "primary" | "ghost";
}

export function UpgradeButton({ label = "Upgrade to Pro", className, variant = "primary" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleClick() {
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
    <div className="flex flex-col cursor-pointer items-start gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={cx(
          "inline-flex items-center gap-2 cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary"
            ? "px-5 py-2.5 bg-[var(--ac-2)] text-[var(--bg-base)] font-bold hover:opacity-90 rounded-lg"
            : "px-4 py-2 border border-[var(--ac-2-ring)] text-[var(--ac-2)] hover:bg-[var(--ac-2-dim)] rounded-lg",
          className,
        )}
      >
        {loading ? (
          <>
            <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
            Redirecting…
          </>
        ) : (
          <>
            <span>⚡</span>
            {label}
          </>
        )}
      </button>
      {error && (
        <p className="font-mono text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
}