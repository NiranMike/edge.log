"use client";

import { cx } from "@/style";
import { Tooltip } from "@/components/ui/tooltip";
import { RLabel } from "../shared/r-label";
import type { DirectionStat } from "@/types";
import { TOOLTIP_COPY } from "@/const/tooltip-const";

interface Props {
  directions: DirectionStat[];
}

function DirectionCard({ stat }: { stat: DirectionStat }) {
  const isLong = stat.direction === "LONG";

  return (
    <div className={cx(
      "flex-1 min-w-[140px] rounded-xl border p-5 transition-colors duration-200",
      isLong
        ? "bg-emerald-400/[0.03] border-emerald-400/[0.1] hover:border-emerald-400/20"
        : "bg-red-400/[0.03] border-red-400/[0.1] hover:border-red-400/20",
    )}>
      <div className="flex items-center gap-2 mb-4">
        <span className={cx("font-mono text-[11px] tracking-[0.08em]", isLong ? "text-emerald-400" : "text-red-400")}>
          {isLong ? "▲" : "▼"}
        </span>
        <span className={cx("font-mono text-[11px] uppercase tracking-[0.14em]", isLong ? "text-emerald-400/70" : "text-red-400/70")}>
          {stat.direction}
        </span>
        <span className="font-mono text-[10px] text-[var(--tx-4)] ml-auto">{stat.trades} trades</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--tx-4)]">Win Rate</p>
            <Tooltip content={TOOLTIP_COPY.winRate} />
          </div>
          <p className={cx(
            "font-mono text-[20px] tracking-[-0.03em] leading-none",
            stat.winRate >= 50
              ? (isLong ? "text-[var(--win)]" : "text-[var(--loss)]")
              : "text-[var(--tx-2)]",
          )}>
            {stat.winRate}%
          </p>
        </div>

        {/* Avg R */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--tx-4)]">Avg R</p>
            <Tooltip content={TOOLTIP_COPY.avgR} />
          </div>
          <RLabel value={stat.avgR} size="md" />
        </div>

        <div className="col-span-2">
          <div className="flex items-center gap-1.5 mb-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--tx-4)]">Total R</p>
            <Tooltip content={TOOLTIP_COPY.totalR} />
          </div>
          <RLabel value={stat.totalR} size="sm" />
        </div>
      </div>

      <div className="mt-4 h-[3px] rounded-full bg-[var(--bd)] overflow-hidden">
        <div
          className={cx("h-full rounded-full transition-all duration-700", isLong ? "bg-emerald-400/50" : "bg-red-400/50")}
          style={{ width: `${stat.winRate}%` }}
        />
      </div>
    </div>
  );
}

export function DirectionBias({ directions }: Props) {
  return (
    <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--bd)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--bd)]">
        <div className="w-4 h-px bg-[var(--ac-2)] opacity-50" />
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tx-3)]">Direction Bias</h2>
        <Tooltip content={TOOLTIP_COPY.directionBias} />
      </div>

      <div className="p-5">
        {directions.every(d => d.trades === 0) ? (
          <p className="font-mono text-[12px] text-[var(--tx-3)] text-center py-6">No data</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            {directions.map(stat => (
              <DirectionCard key={stat.direction} stat={stat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}