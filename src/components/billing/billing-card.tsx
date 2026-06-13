"use client";

import { useState }                                    from "react";
import { getPortalUrlAction, cancelSubscriptionAction } from "@/lib/actions/billing-actions";
import { UpgradeButton }                                from "@/components/billing/upgrade-button";
import { cx }                                           from "@/style";

interface Props {
  isPro:   boolean;
  status:  string | null;
  endsAt:  string | null;
}

export function BillingCard({ isPro, status, endsAt }: Props) {
  const [loading,      setLoading]      = useState(false);
  const [cancelling,   setCancelling]   = useState(false);
  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [successMsg,   setSuccessMsg]   = useState<string | null>(null);

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

  async function handleCancel() {
    setCancelling(true);
    setError(null);
    const result = await cancelSubscriptionAction();
    if (result.ok) {
      setSuccessMsg(result.data.message);
      setConfirmOpen(false);
    } else {
      setError(result.error);
    }
    setCancelling(false);
  }

  const isCancelled = status === "cancelled" || status === "expired" || status === "paused" || !!successMsg;

  return (
    <div className="rounded-xl bg-[#0d1117] border border-white/[0.065] p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25 mb-1.5">
            Current plan
          </p>
          <div className="flex items-center gap-2.5">
            <span className="font-display font-bold text-[22px] tracking-[-0.02em] text-white">
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
            <p className="font-mono text-[11px] text-white/30 mt-1">
              Access until {new Date(endsAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 px-3 py-2.5 rounded-lg bg-amber-400/[0.06] border border-amber-400/15">
          <p className="font-mono text-[11px] text-amber-400/80">{successMsg}</p>
        </div>
      )}

      {isPro ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPortal}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/[0.08] rounded-lg font-mono text-[11px] text-white/40 hover:text-white/60 hover:border-white/15 transition-colors duration-150 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                  Loading...
                </>
              ) : (
                "Manage billing"
              )}
            </button>

            {!isCancelled && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-[11px] text-white/25 hover:text-red-400/70 transition-colors duration-150"
              >
                Cancel renewal
              </button>
            )}
          </div>

          {/* Confirmation dialog */}
          {confirmOpen && (
            <div className="px-4 py-4 rounded-lg bg-red-400/[0.04] border border-red-400/15">
              <p className="font-mono text-[12px] text-white/50 mb-1">
                Are you sure you want to cancel?
              </p>
              <p className="font-mono text-[11px] text-white/25 mb-4">
                You&apos;ll keep access until the end of your current billing period. You can resubscribe anytime.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[11px] bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/15 transition-colors duration-150 disabled:opacity-50"
                >
                  {cancelling ? (
                    <>
                      <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Yes, cancel renewal"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-lg font-mono text-[11px] text-white/30 hover:text-white/50 transition-colors duration-150 disabled:opacity-50"
                >
                  Keep subscription
                </button>
              </div>
            </div>
          )}

          {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}
        </div>
      ) : (
        <div>
          <p className="font-mono text-[12px] text-white/35 leading-relaxed mb-4">
            Upgrade to unlock the full analytics dashboard, equity curve, session breakdown, and more.
          </p>
          <UpgradeButton />
        </div>
      )}
    </div>
  );
}
