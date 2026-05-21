"use client";

import { useState }             from "react";
import { getPortalUrlAction }   from "@/lib/actions/billing-actions";
import { UpgradeButton }        from "@/components/billing/upgrade-button";
import { cx }                   from "@/style";

interface Props {
  isPro:   boolean;
  status:  string | null;
  endsAt:  string | null;
}

export function BillingCard({ isPro, status, endsAt }: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    const result = await getPortalUrlAction();
    if (result.ok) {
      window.location.href = result.data.url;
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  const isCancelled = status === "cancelled";

  return (
    <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--bd)] p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--tx-3)] mb-1.5">
            Current plan
          </p>
          <div className="flex items-center gap-2.5">
            <span className="font-display font-bold text-[22px] tracking-[-0.02em] text-[var(--tx-1)]">
              {isPro ? "Pro" : "Free"}
            </span>
            {isPro && (
              <span className={cx(
                "font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border",
                isCancelled
                  ? "bg-amber-400/8 border-amber-400/20 text-amber-400"
                  : "bg-teal-400/8 border-teal-400/20 text-teal-400",
              )}>
                {isCancelled ? "Cancels soon" : "Active"}
              </span>
            )}
          </div>
          {isPro && isCancelled && endsAt && (
            <p className="font-mono text-[11px] text-[var(--tx-3)] mt-1">
              Access until {new Date(endsAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
        </div>
      </div>

      {isPro ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={openPortal}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--bd)] rounded-lg font-mono text-[11px] text-[var(--tx-3)] hover:text-[var(--tx-2)] hover:border-[var(--bd-hi)] transition-colors duration-150 disabled:opacity-50 w-fit"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                Loading…
              </>
            ) : (
              "Manage billing →"
            )}
          </button>
          {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}
        </div>
      ) : (
        <div>
          <p className="font-mono text-[12px] text-[var(--tx-3)] leading-relaxed mb-4">
            Upgrade to unlock the full analytics dashboard, equity curve, session breakdown, and more.
          </p>
          <UpgradeButton />
        </div>
      )}
    </div>
  );
}