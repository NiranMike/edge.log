"use client";

import { cx } from "@/style";
import type { RRHint } from "@/hooks/use-rr-hint";

interface Props {
  hint:      RRHint | null;
  className?: string;
}

/**
 * Drop this directly below your Take Profit <input>.
 *
 * Usage:
 *   const rrHint = useRRHint({ entry: watch("entryPrice"), stop: watch("stopLoss"),
 *                               takeProfit: watch("takeProfit"), direction: watch("direction") });
 *   <RRHintBadge hint={rrHint} />
 */
export function RRHintBadge({ hint, className }: Props) {
  if (!hint) return null;

  const great  = hint.r >= 2;
  const decent = hint.r >= 1;

  return (
    <div
      className={cx(
        "flex items-center gap-2 mt-1.5 px-2.5 py-1.5 rounded-lg border w-fit",
        "transition-all duration-200",
        great
          ? "bg-emerald-400/[0.06] border-emerald-400/15"
          : decent
          ? "bg-teal-400/[0.05]   border-teal-400/12"
          : "bg-white/[0.03]      border-white/[0.07]",
        className,
      )}
    >
      {/* pulse dot */}
      <span
        className={cx(
          "w-1.5 h-1.5 rounded-full shrink-0",
          great  ? "bg-emerald-400/70" :
          decent ? "bg-teal-400/60"    : "bg-white/20",
        )}
      />

      <span
        className={cx(
          "font-mono text-[11px] tracking-[0.02em]",
          great  ? "text-emerald-400/80" :
          decent ? "text-teal-400/70"    : "text-white/30",
        )}
      >
        +{hint.r}R target
      </span>

      <span className="font-mono text-[9px] text-white/15">·</span>

      <span className="font-mono text-[10px] text-white/25 tracking-[0.04em]">
        {hint.ratio} RR
      </span>

      {/* quality label */}
      {great && (
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-emerald-400/50 ml-1">
          good setup
        </span>
      )}
    </div>
  );
}