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
          ? "bg-[var(--ac-1-dim)] border-[var(--ac-1-ring)]"
          : decent
          ? "bg-[var(--ac-2-dim)] border-[var(--ac-2-ring)]"
          : "bg-[var(--bg-overlay)] border-[var(--bd)]",
        className,
      )}
    >
      {/* pulse dot */}
      <span
        className={cx(
          "w-1.5 h-1.5 rounded-full shrink-0",
          great  ? "bg-[var(--ac-1)]" :
          decent ? "bg-[var(--ac-2)]" : "bg-[var(--tx-4)]",
        )}
      />

      <span
        className={cx(
          "font-mono text-[11px] tracking-[0.02em]",
          great  ? "text-[var(--ac-1)]" :
          decent ? "text-[var(--ac-2)]" : "text-[var(--tx-3)]",
        )}
      >
        +{hint.r}R target
      </span>

      <span className="font-mono text-[9px] text-[var(--tx-4)]">·</span>

      <span className="font-mono text-[10px] text-[var(--tx-3)] tracking-[0.04em]">
        {hint.ratio} RR
      </span>

      {/* quality label */}
      {great && (
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--ac-1)] opacity-50 ml-1">
          good setup
        </span>
      )}
    </div>
  );
}