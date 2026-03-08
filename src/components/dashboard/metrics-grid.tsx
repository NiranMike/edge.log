"use client";
// components/dashboard/MetricsGrid.tsx

import type { TradeMetrics } from "@/types";
import { cx } from "@/style";

interface Props {
  metrics: TradeMetrics;
  className?: string;
  // Optional: pass the last N R-values to render a mini equity curve
  rHistory?: number[];
}

// ── Mood helpers ──────────────────────────────────────────────────────────────
function getExpectancyMood(e: number): { color: string; label: string; desc: string } {
  if (e > 1)    return { color: "text-emerald-400", label: "Strong edge",   desc: "You have a real statistical advantage." };
  if (e > 0.3)  return { color: "text-emerald-400", label: "Positive edge", desc: "Keep refining. It's working." };
  if (e > 0)    return { color: "text-amber-400",   label: "Marginal edge", desc: "Positive, but thin. Stay disciplined." };
  if (e > -0.3) return { color: "text-amber-400",   label: "Near breakeven",desc: "Almost there — review your exits." };
  return             { color: "text-red-400",     label: "Losing edge",   desc: "Don't increase size. Diagnose first." };
}

function getWinRateColor(wr: number): string {
  if (wr >= 65) return "text-emerald-400";
  if (wr >= 50) return "text-white";
  if (wr >= 40) return "text-amber-400";
  return "text-red-400";
}

// ── Mini sparkline ────────────────────────────────────────────────────────────
function EquityCurve({ rValues }: { rValues: number[] }) {
  if (rValues.length < 2) return null;

  // Build cumulative R series
  const cum: number[] = [];
  let running = 0;
  for (const r of rValues) {
    running += r;
    cum.push(running);
  }

  const min = Math.min(...cum);
  const max = Math.max(...cum);
  const range = max - min || 1;
  const W = 80, H = 28;

  const pts = cum.map((v, i) => {
    const x = (i / (cum.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  });

  const isPositive = cum[cum.length - 1] >= 0;
  const color = isPositive ? "#4ade80" : "#f87171";

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className="opacity-60">
      <polyline
        points={pts.join(" ")}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* End dot */}
      <circle
        cx={W}
        cy={H - ((cum[cum.length - 1] - min) / range) * H}
        r="2"
        fill={color}
      />
    </svg>
  );
}

// ── Streak badge ──────────────────────────────────────────────────────────────
function StreakBadge({ rHistory }: { rHistory: number[] }) {
  if (!rHistory || rHistory.length === 0) return null;

  let streak = 0;
  const isWin = rHistory[rHistory.length - 1] > 0;

  for (let i = rHistory.length - 1; i >= 0; i--) {
    if ((rHistory[i] > 0) === isWin) streak++;
    else break;
  }

  if (streak < 2) return null;

  return (
    <span className={cx(
      "inline-flex items-center gap-1 px-2 py-[2px] rounded font-mono text-[9px] uppercase tracking-[0.12em] border",
      isWin
        ? "text-emerald-400/70 bg-emerald-400/[0.06] border-emerald-400/15"
        : "text-red-400/70 bg-red-400/[0.06] border-red-400/15",
    )}>
      {isWin ? "▲" : "▼"} {streak} streak
    </span>
  );
}

// ── Single metric card ────────────────────────────────────────────────────────
function MetricCard({
  label, value, sub, colorClass, large, delay, children,
}: {
  label:      string;
  value:      string;
  sub:        string;
  colorClass?: string;
  large?:     boolean;
  delay?:     number;
  children?:  React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "relative rounded-xl border border-white/[0.065] bg-[#0d1117] overflow-hidden",
        "hover:border-white/10 transition-all duration-200 group",
        large ? "px-6 py-6" : "px-5 py-5",
      )}
      style={{ animationDelay: delay ? `${delay}ms` : "0ms" }}
    >
      {/* Subtle top-edge accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25 mb-3">
        {label}
      </div>

      <div className={cx(
        "font-mono font-medium leading-none tracking-[-0.04em] mb-2",
        large ? "text-[34px]" : "text-[26px]",
        colorClass ?? "text-white",
      )}>
        {value}
      </div>

      <div className="font-mono text-[11px] text-white/35 leading-relaxed">
        {sub}
      </div>

      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function MetricsGrid({ metrics, className, rHistory = [] }: Props) {
  const { totalTrades, winRate, avgR, totalR, expectancy } = metrics;

  const exp     = getExpectancyMood(expectancy);
  const wrColor = getWinRateColor(winRate);

  const wins   = totalTrades > 0 ? Math.round((winRate / 100) * totalTrades)       : 0;
  const losses = totalTrades > 0 ? Math.round((1 - winRate / 100) * totalTrades)   : 0;

  // Win rate bar width
  const wrPct = Math.min(100, Math.max(0, winRate));

  return (
    <div className={cx("grid grid-cols-5 gap-3", className)}>

      {/* ── Expectancy (large, hero card) ── */}
      <MetricCard
        label="Expectancy"
        value={`${expectancy >= 0 ? "+" : ""}${expectancy}R`}
        sub={exp.desc}
        colorClass={exp.color}
        large
        delay={0}
      >
        <span className={cx(
          "inline-block font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-[3px] rounded border",
          exp.color,
          expectancy >= 0
            ? "bg-emerald-400/[0.05] border-emerald-400/15"
            : "bg-amber-400/[0.05] border-amber-400/15",
        )}>
          {exp.label}
        </span>
      </MetricCard>

      {/* ── Win Rate ── */}
      <MetricCard
        label="Win Rate"
        value={`${winRate}%`}
        sub={`${wins}W · ${losses}L`}
        colorClass={wrColor}
        delay={60}
      >
        {/* Progress bar */}
        <div className="h-[2px] w-full bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className={cx(
              "h-full rounded-full transition-all duration-700",
              winRate >= 50 ? "bg-emerald-400/50" : "bg-amber-400/50",
            )}
            style={{ width: `${wrPct}%` }}
          />
        </div>
      </MetricCard>

      {/* ── Avg R ── */}
      <MetricCard
        label="Avg R / Trade"
        value={`${avgR >= 0 ? "+" : ""}${avgR}R`}
        sub="per closed trade"
        colorClass={avgR >= 0 ? "text-emerald-400" : "text-red-400"}
        delay={120}
      >
        {rHistory.length > 0 && <StreakBadge rHistory={rHistory} />}
      </MetricCard>

      {/* ── Total R (with equity curve) ── */}
      <MetricCard
        label="Total R"
        value={`${totalR >= 0 ? "+" : ""}${totalR}R`}
        sub="cumulative P&L in R"
        colorClass={totalR >= 0 ? "text-emerald-400" : "text-red-400"}
        delay={180}
      >
        {rHistory.length > 1 && <EquityCurve rValues={rHistory} />}
      </MetricCard>

      {/* ── Trade Count ── */}
      <MetricCard
        label="Trades"
        value={String(totalTrades)}
        sub="logged in journal"
        delay={240}
      >
        <div className="font-mono text-[9px] text-white/18 tracking-[0.08em]">
          {totalTrades < 20
            ? `${20 - totalTrades} more for statistical significance`
            : totalTrades < 100
            ? `${100 - totalTrades} until 100-trade benchmark`
            : "Sufficient sample size ✓"}
        </div>
      </MetricCard>

    </div>
  );
}