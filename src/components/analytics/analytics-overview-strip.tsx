"use client";

import { cx } from "@/style";
import { Tooltip } from "@/components/ui/tooltip";
import type { AnalyticsOverview } from "@/types";
import { TOOLTIP_COPY } from "@/const/tooltip-const";

interface Props {
  overview: AnalyticsOverview;
}

function StatPill({
  label, value, sub, valueClass, delay, tooltip,
}: {
  label:      string;
  value:      string;
  sub?:       string;
  valueClass?: string;
  delay?:     number;
  tooltip:    string;
}) {
  return (
    <div
      className="flex-1 min-w-[140px] flex flex-col gap-1 px-5 py-4 rounded-xl bg-[#0d1117] border border-white/[0.065] hover:border-white/10 transition-colors duration-200"
      style={{ animationDelay: delay ? `${delay}ms` : "0ms" }}
    >
      <div className="flex items-center justify-between gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">{label}</span>
        <Tooltip content={tooltip} />
      </div>
      <span className={cx("font-mono text-[22px] tracking-[-0.03em] leading-none", valueClass ?? "text-white")}>{value}</span>
      {sub && <span className="font-mono text-[10px] text-white/25 mt-0.5">{sub}</span>}
    </div>
  );
}

export function AnalyticsOverviewStrip({ overview }: Props) {
  const {
    profitFactor, bestTrade, worstTrade,
    largestWinStreak, largestLossStreak,
    avgWinR, avgLossR, mostActivePair, mostActiveSession,
  } = overview;

  const pfClass = profitFactor >= 2 ? "text-emerald-400" : profitFactor >= 1 ? "text-white" : "text-red-400";

  return (
    <div className="flex flex-wrap gap-3">
      <StatPill label="Profit Factor" value={String(profitFactor)}   sub={profitFactor >= 2 ? "Strong edge" : profitFactor >= 1 ? "Positive" : "Losing"} valueClass={pfClass}          delay={0}   tooltip={TOOLTIP_COPY.profitFactor} />
      <StatPill label="Best Trade"    value={`+${bestTrade}R`}       sub="single trade"                                                                   valueClass="text-emerald-400" delay={60}  tooltip={TOOLTIP_COPY.bestTrade}    />
      <StatPill label="Worst Trade"   value={`${worstTrade}R`}       sub="single trade"                                                                   valueClass="text-red-400"     delay={120} tooltip={TOOLTIP_COPY.worstTrade}   />
      <StatPill label="Win Streak"    value={`${largestWinStreak}`}  sub={`loss streak: ${largestLossStreak}`}                                            valueClass="text-emerald-400" delay={180} tooltip={TOOLTIP_COPY.winStreak}    />
      <StatPill label="Avg Win"       value={`+${avgWinR}R`}         sub={`avg loss: -${avgLossR}R`}                                                      valueClass="text-emerald-400" delay={240} tooltip={TOOLTIP_COPY.avgWin}       />
      <StatPill label="Most Active"   value={mostActivePair || "—"}  sub={mostActiveSession}                                                                                            delay={300} tooltip={TOOLTIP_COPY.mostActive}   />
    </div>
  );
}