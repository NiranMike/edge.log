"use client";

import { cx } from "@/style";
import { Tooltip } from "@/components/ui/tooltip";
import { RLabel } from "../shared/r-label";
import type { AnalyticsOverview } from "@/types";
import { TOOLTIP_COPY } from "@/const/tooltip-const";
import { TiltCard } from "../ui/tilt-card";

interface Props {
  overview: AnalyticsOverview;
}

type Accent = "emerald" | "teal" | "red" | "neutral";

const GLOW: Record<Accent, string> = {
  emerald: "bg-emerald-400/[0.05] group-hover:bg-emerald-400/[0.10]",
  teal:    "bg-teal-400/[0.04] group-hover:bg-teal-400/[0.08]",
  red:     "bg-red-400/[0.04] group-hover:bg-red-400/[0.07]",
  neutral: "bg-white/[0.02] group-hover:bg-white/[0.04]",
};

const LINE: Record<Accent, string> = {
  emerald: "via-emerald-400/30",
  teal:    "via-teal-400/25",
  red:     "via-red-400/20",
  neutral: "via-white/[0.08]",
};

function StatPill({
  label, value, sub, valueClass, delay, tooltip, accent = "neutral",
}: {
  label:       string;
  value:       string;
  sub?:        string;
  valueClass?: string;
  delay?:      number;
  tooltip:     string;
  accent?:     Accent;
}) {
  return (
    <TiltCard
      className={cx(
        "relative flex-1 min-w-[140px] flex flex-col gap-1 px-5 py-4 rounded-xl overflow-hidden",
        "bg-gradient-to-b from-[#10141a] to-[#0d1117]",
        "border border-white/[0.06]",
        "hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
        "transition-all duration-200 group",
      )}
      style={{ animationDelay: delay ? `${delay}ms` : "0ms" }}
    >
      {/* Top accent line */}
      <div className={cx(
        "absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent to-transparent",
        LINE[accent],
        "opacity-50 group-hover:opacity-100 transition-opacity duration-300",
      )} />

      {/* Corner glow */}
      <div className={cx(
        "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] pointer-events-none transition-all duration-500",
        GLOW[accent],
      )} />

      <div className="relative flex items-center justify-between gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">{label}</span>
        <Tooltip content={tooltip} />
      </div>
      <span className={cx("relative font-mono text-[22px] tracking-[-0.03em] leading-none", valueClass ?? "text-white")}>
        {value}
      </span>
      {sub && <span className="relative font-mono text-[10px] text-white/25 mt-0.5">{sub}</span>}
    </TiltCard>
  );
}

function RStatPill({
  label, value, sub, delay, tooltip, accent = "neutral",
}: {
  label:   string;
  value:   number;
  sub?:    string;
  delay?:  number;
  tooltip: string;
  accent?: Accent;
}) {
  return (
    <TiltCard
      className={cx(
        "relative flex-1 min-w-35 flex flex-col gap-1 px-5 py-4 rounded-xl overflow-hidden",
        "bg-gradient-to-b from-[#10141a] to-[#0d1117]",
        "border border-white/[0.06]",
        "hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
        "transition-all duration-200 group",
      )}
      style={{ animationDelay: delay ? `${delay}ms` : "0ms" }}
    >
      {/* Top accent line */}
      <div className={cx(
        "absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent to-transparent",
        LINE[accent],
        "opacity-50 group-hover:opacity-100 transition-opacity duration-300",
      )} />

      {/* Corner glow */}
      <div className={cx(
        "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] pointer-events-none transition-all duration-500",
        GLOW[accent],
      )} />

      <div className="relative flex items-center justify-between gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">{label}</span>
        <Tooltip content={tooltip} />
      </div>
      <div className="relative">
        <RLabel value={Number(value.toFixed(2))} size="md" />
      </div>
      {sub && <span className="relative font-mono text-[10px] text-white/25 mt-0.5">{sub}</span>}
    </TiltCard>
  );
}

export function AnalyticsOverviewStrip({ overview }: Props) {
  const {
    profitFactor, bestTrade, worstTrade,
    largestWinStreak, largestLossStreak,
    avgWinR, avgLossR, mostActivePair, mostActiveSession,
  } = overview;

  const pfAccent: Accent =
    profitFactor >= 2 ? "emerald" :
    profitFactor >= 1 ? "teal"    : "red";

  const pfClass =
    profitFactor >= 2 ? "text-emerald-400" :
    profitFactor >= 1 ? "text-white"        : "text-red-400";

  return (
    <div className="flex flex-wrap gap-3">
      <StatPill
        label="Profit Factor"
        value={String(profitFactor.toFixed(2))}
        sub={profitFactor >= 2 ? "Strong edge" : profitFactor >= 1 ? "Positive" : "Losing"}
        valueClass={pfClass}
        delay={0}
        tooltip={TOOLTIP_COPY.profitFactor}
        accent={pfAccent}
      />

      <RStatPill
        label="Best Trade"
        value={bestTrade}
        sub="single trade"
        delay={60}
        tooltip={TOOLTIP_COPY.bestTrade}
        accent="emerald"
      />
      <RStatPill
        label="Worst Trade"
        value={worstTrade}
        sub="single trade"
        delay={120}
        tooltip={TOOLTIP_COPY.worstTrade}
        accent="red"
      />

      <StatPill
        label="Win Streak"
        value={String(largestWinStreak)}
        sub={`loss streak: ${largestLossStreak}`}
        valueClass="text-emerald-400"
        delay={180}
        tooltip={TOOLTIP_COPY.winStreak}
        accent="emerald"
      />

      <RStatPill
        label="Avg Win"
        value={avgWinR}
        sub={`avg loss: -${avgLossR}R`}
        delay={240}
        tooltip={TOOLTIP_COPY.avgWin}
        accent={avgWinR >= 0 ? "emerald" : "red"}
      />

      <StatPill
        label="Most Active"
        value={mostActivePair || "—"}
        sub={mostActiveSession}
        delay={300}
        tooltip={TOOLTIP_COPY.mostActive}
        accent="neutral"
      />
    </div>
  );
}
