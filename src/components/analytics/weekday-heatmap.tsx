"use client";

import { cx } from "@/style";
import type { WeekdayStat } from "@/types";

interface Props {
  weekdays: WeekdayStat[];
}

function getHeatColor(avgR: number, trades: number): string {
  if (trades === 0) return "bg-white/[0.03] border-white/[0.05]";
  if (avgR >= 1.5)  return "bg-emerald-400/25 border-emerald-400/30";
  if (avgR >= 0.5)  return "bg-emerald-400/12 border-emerald-400/15";
  if (avgR >= 0)    return "bg-emerald-400/[0.06] border-emerald-400/[0.08]";
  if (avgR >= -0.5) return "bg-red-400/[0.06] border-red-400/[0.08]";
  if (avgR >= -1.5) return "bg-red-400/12 border-red-400/15";
  return "bg-red-400/25 border-red-400/30";
}

function getTextColor(avgR: number, trades: number): string {
  if (trades === 0) return "text-white/15";
  if (avgR >= 0.5)  return "text-emerald-400";
  if (avgR >= 0)    return "text-emerald-400/60";
  if (avgR >= -0.5) return "text-red-400/60";
  return "text-red-400";
}

export function WeekdayHeatmap({ weekdays }: Props) {
  const maxTrades = Math.max(...weekdays.map(d => d.trades), 1);

  return (
    <div className="rounded-xl bg-[#0d1117] border border-white/[0.065] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-px bg-teal-400/50" />
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">Day of Week</h2>
        </div>
        <span className="font-mono text-[10px] text-white/15">Avg R per weekday</span>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {weekdays.map(day => {
          const heatCls = getHeatColor(day.avgR, day.trades);
          const textCls = getTextColor(day.avgR, day.trades);
          return (
            <div key={day.day} className={cx("rounded-[8px] border px-3 py-3.5 transition-all duration-200 hover:scale-[1.02]", heatCls, day.trades === 0 ? "opacity-40" : "opacity-100")}>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30 mb-2">{day.day}</p>
              <p className={cx("font-mono text-[18px] tracking-[-0.03em] leading-none mb-1.5", textCls)}>
                {day.trades === 0 ? "—" : `${day.avgR >= 0 ? "+" : ""}${day.avgR}R`}
              </p>
              {day.trades > 0 && (
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-[9px] text-white/20">{day.trades}t</span>
                  <span className="font-mono text-[9px] text-white/30">{day.winRate}%</span>
                </div>
              )}
              <div className="mt-2 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                <div className={cx("h-full rounded-full", day.avgR >= 0 ? "bg-emerald-400/40" : "bg-red-400/40")} style={{ width: `${(day.trades / maxTrades) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 px-5 py-3 border-t border-white/[0.04]">
        <span className="font-mono text-[9px] text-white/15 uppercase tracking-[0.1em]">Intensity</span>
        <div className="flex items-center gap-1.5">
          {["bg-red-400/25","bg-red-400/12","bg-red-400/[0.06]","bg-emerald-400/[0.06]","bg-emerald-400/12","bg-emerald-400/25"].map((cls, i) => (
            <div key={i} className={cx("w-5 h-[6px] rounded-[2px]", cls)} />
          ))}
        </div>
        <span className="font-mono text-[9px] text-white/15">red = loss · green = win</span>
      </div>
    </div>
  );
}