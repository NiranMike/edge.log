"use client";
// components/trades/delete-trade-button.tsx

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTradeAction } from "@/lib/actions/trade-action";

interface Props {
  tradeId: number;
  pair: string;
}

export function DeleteTradeButton({ tradeId, pair }: Props) {
  const [confirming,  setConfirming]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [isPending,   startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteTradeAction(tradeId);
      if (result.ok) {
        router.push("/trades");
        router.refresh();
      } else {
        setError(result.error ?? "Failed to delete trade.");
        setConfirming(false);
      }
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="px-5 py-[11px] rounded-[6px] font-mono text-[12px] tracking-[0.06em] text-red-400/40 border border-transparent hover:border-red-400/20 hover:text-red-400/70 hover:bg-red-400/[0.04] transition-all duration-200 cursor-pointer"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Confirm */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className={[
            "px-5 py-[11px] rounded-[6px] font-mono text-[12px] tracking-[0.06em] border transition-all duration-150 cursor-pointer",
            isPending
              ? "bg-red-400/[0.04] border-red-400/15 text-red-400/30 cursor-not-allowed"
              : "bg-red-400/[0.08] border-red-400/25 text-red-400 hover:bg-red-400/[0.14] hover:border-red-400/40",
          ].join(" ")}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-[9px] h-[9px] rounded-full border-[1.5px] border-red-400/20 border-t-red-400/60 inline-block animate-[spin_0.7s_linear_infinite]" />
              Deleting…
            </span>
          ) : (
            `Delete ${pair}`
          )}
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={() => { setConfirming(false); setError(null); }}
          disabled={isPending}
          className="px-5 py-[11px] rounded-[6px] font-mono text-[12px] tracking-[0.06em] text-[var(--tx-3)] border border-transparent hover:border-[var(--bd)] hover:text-[var(--tx-2)] transition-all duration-150 cursor-pointer disabled:opacity-40"
        >
          Cancel
        </button>
      </div>

      {/* Inline error */}
      {error && (
        <p className="font-mono text-[11px] text-red-400/70">↳ {error}</p>
      )}
    </div>
  );
}