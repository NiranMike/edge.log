"use client";

import { cx } from "@/style";
import { Tooltip } from "@/components/ui/tooltip";
import { RLabel } from "../shared/r-label";
import type { WeekdayStat } from "@/types";
import { TOOLTIP_COPY } from "@/const/tooltip-const";

interface Props {
  weekdays: WeekdayStat[];
}

function getHeatColor(avgR: number, trades: number): string {
  if (trades === 0) return "bg-[var(--bg-overlay)] border-[var(--bd)]";
  if (avgR >= 1.5)  return "bg-emerald-400/25 border-emerald-400/30";
  if (avgR >= 0.5)  return "bg-emerald-400/12 border-emerald-400/15";
  if (avgR >= 0)    return "bg-emerald-400/[0.06] border-emerald-400/[0.08]";
  if (avgR >= -0.5) return "bg-red-400/[0.06] border-red-400/[0.08]";
  if (avgR >= -1.5) return "bg-red-400/12 border-red-400/15";
  return "bg-red-400/25 border-red-400/30";
}

export function WeekdayHeatmap({ weekdays }: Props) {
  const maxTrades = Math.max(...weekdays.map(d => d.trades), 1);

  return (
    <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--bd)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--bd)]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-px bg-[var(--ac-2)] opacity-50" />
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tx-3)]">Day of Week</h2>
          <Tooltip content={TOOLTIP_COPY.weekdayHeatmap} />
        </div>
        <span className="font-mono text-[10px] text-[var(--tx-4)]">Avg R per weekday</span>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {weekdays.map(day => {
          const heatCls = getHeatColor(day.avgR, day.trades);
          return (
            <div
              key={day.day}
              className={cx(
                "rounded-[8px] border px-3 py-3.5 transition-all duration-200 hover:scale-[1.02]",
                heatCls,
                day.trades === 0 ? "opacity-40" : "opacity-100",
              )}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--tx-3)] mb-2">
                {day.day}
              </p>

              {day.trades === 0 ? (
                <span className="font-mono text-[18px] text-[var(--tx-4)] leading-none">—</span>
              ) : (
                <RLabel value={day.avgR} size="md" showRatio={false} muted={false} />
              )}

              {day.trades > 0 && (
                <div className="flex items-center justify-between mt-1.5">
                  <span className="font-mono text-[9px] text-[var(--tx-4)]">{day.trades}t</span>
                  <span className="font-mono text-[9px] text-[var(--tx-3)]">{day.winRate}%</span>
                </div>
              )}

              <div className="mt-2 h-[2px] rounded-full bg-[var(--bd)] overflow-hidden">
                <div
                  className={cx(
                    "h-full rounded-full",
                    day.avgR >= 0 ? "bg-emerald-400/40" : "bg-red-400/40",
                  )}
                  style={{ width: `${(day.trades / maxTrades) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 px-5 py-3 border-t border-[var(--bd)]">
        <span className="font-mono text-[9px] text-[var(--tx-4)] uppercase tracking-[0.1em]">Intensity</span>
        <div className="flex items-center gap-1.5">
          {[
            "bg-red-400/25",
            "bg-red-400/12",
            "bg-red-400/[0.06]",
            "bg-emerald-400/[0.06]",
            "bg-emerald-400/12",
            "bg-emerald-400/25",
          ].map((cls, i) => (
            <div key={i} className={cx("w-5 h-[6px] rounded-[2px]", cls)} />
          ))}
        </div>
        <span className="font-mono text-[9px] text-[var(--tx-4)]">red = loss · green = win</span>
      </div>
    </div>
  );
}