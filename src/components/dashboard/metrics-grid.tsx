"use client";

import type { TradeMetrics } from "@/types";
import { cx } from "@/style";
import { RLabel } from "../shared/r-label";
import { CountUp } from "../ui/count-up";
import { TiltCard } from "../ui/tilt-card";

interface Props {
  metrics:   TradeMetrics;
  className?: string;
  rHistory?:  number[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function getExpectancyMood(e: number): { color: string; label: string; desc: string; accent: Accent } {
  if (e > 1)    return { color: "text-emerald-400", label: "Strong edge",    desc: "You have a real statistical advantage.", accent: "emerald" };
  if (e > 0.3)  return { color: "text-emerald-400", label: "Positive edge",  desc: "Keep refining. It's working.",          accent: "emerald" };
  if (e > 0)    return { color: "text-teal-400",    label: "Marginal edge",  desc: "Positive, but thin. Stay disciplined.", accent: "teal"    };
  if (e > -0.3) return { color: "text-teal-400",    label: "Near breakeven", desc: "Almost there. Review your exits.",     accent: "teal"    };
  return             { color: "text-red-400",       label: "Losing edge",    desc: "Don't increase size. Diagnose first.",  accent: "red"     };
}

function getWinRateColor(wr: number): string {
  if (wr >= 65) return "text-emerald-400";
  if (wr >= 50) return "text-white";
  if (wr >= 40) return "text-teal-400";
  return "text-red-400";
}

// ─── Equity curve sparkline ───────────────────────────────────────────────────

function EquityCurve({ rValues }: { rValues: number[] }) {
  if (rValues.length < 2) return null;

  const cum: number[] = [];
  let running = 0;
  for (const r of rValues) { running += r; cum.push(running); }

  const final      = cum[cum.length - 1];
  const isPositive = final >= 0;
  const color      = isPositive ? "#4ade80" : "#f87171";
  const gradId     = isPositive ? "ec-pos" : "ec-neg";

  const W = 200, H = 52, padY = 5;
  const min = Math.min(0, ...cum);
  const max = Math.max(0, ...cum);
  const range = max - min || 1;

  const toX = (i: number) => (i / (cum.length - 1)) * W;
  const toY = (v: number) => H - padY - ((v - min) / range) * (H - padY * 2);

  const zeroY = toY(0);
  const pts   = cum.map((v, i) => `${toX(i)},${toY(v)}`);
  const lineD = `M ${pts.join(" L ")}`;
  const fillD = `M ${toX(0)},${zeroY} L ${pts.join(" L ")} L ${toX(cum.length - 1)},${zeroY} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} fill="none" preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <line x1={0} y1={zeroY} x2={W} y2={zeroY} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="3 4" />
      <path d={fillD} fill={`url(#${gradId})`} />
      <path d={lineD} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={toX(cum.length - 1)} cy={toY(final)} r="2.5" fill={color} />
    </svg>
  );
}

// ─── Streak badge ─────────────────────────────────────────────────────────────

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


function MetricCard({
  label, sub, large, delay, accent = "neutral", children,
}: {
  label: string; sub: string;
  large?: boolean; delay?: number; accent?: Accent; children?: React.ReactNode;
}) {
  return (
    <TiltCard
      className={cx(
        "relative rounded-xl border border-white/[0.06] overflow-hidden",
        "bg-gradient-to-b from-[#10141a] to-[#0d1117]",
        "hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
        "transition-all duration-200 group",
        large ? "px-4 py-4 sm:px-6 sm:py-6" : "px-4 py-4 sm:px-5 sm:py-5",
      )}
      style={{ animationDelay: delay ? `${delay}ms` : "0ms" }}
    >
      {/* Top accent line */}
      <div className={cx(
        "absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent to-transparent",
        LINE[accent],
        "opacity-50 group-hover:opacity-100 transition-opacity duration-300",
      )} />

      {/* Corner ambient glow */}
      <div className={cx(
        "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] pointer-events-none transition-all duration-500",
        GLOW[accent],
      )} />

      {/* Content */}
      <div className="relative">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25 mb-2 sm:mb-3">
          {label}
        </div>

        <div className={large ? "mb-3" : "mb-2"}>
          {children}
        </div>

        <div className="font-mono text-[10px] sm:text-[11px] text-white/35 leading-relaxed">
          {sub}
        </div>
      </div>
    </TiltCard>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export function MetricsGrid({ metrics, className, rHistory = [] }: Props) {
  const { totalTrades, winRate, avgR, totalR, expectancy } = metrics;
  const exp     = getExpectancyMood(expectancy);
  const wrColor = getWinRateColor(winRate);
  const wins    = totalTrades > 0 ? Math.round((winRate / 100) * totalTrades)     : 0;
  const losses  = totalTrades > 0 ? Math.round((1 - winRate / 100) * totalTrades) : 0;
  const wrPct   = Math.min(100, Math.max(0, winRate));

  const totalRAccent: Accent = totalR >= 0 ? "emerald" : "red";
  const avgRAccent: Accent   = avgR >= 0 ? "emerald" : "red";
  const wrAccent: Accent     = winRate >= 50 ? "emerald" : winRate >= 40 ? "teal" : "red";

  return (
    <div className={cx(
      "grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3",
      className,
    )}>

      {/* Expectancy */}
      <div className="col-span-2 md:col-span-1">
        <MetricCard label="Expectancy" sub={exp.desc} large delay={0} accent={exp.accent}>
          <RLabel value={expectancy} size="lg" showRatio={false} />
          <span className={cx(
            "inline-block font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-[3px] rounded border mt-2",
            exp.color,
            expectancy >= 0
              ? "bg-emerald-400/[0.05] border-emerald-400/15"
              : "bg-teal-400/[0.05] border-teal-400/15",
          )}>
            {exp.label}
          </span>
        </MetricCard>
      </div>

      {/* Win Rate */}
      <MetricCard label="Win Rate" sub={`${wins}W · ${losses}L`} delay={60} accent={wrAccent}>
        <CountUp
          value={winRate}
          decimals={1}
          suffix="%"
          className={cx(
            "font-mono font-medium text-[20px] sm:text-[26px] leading-none tracking-[-0.04em]",
            wrColor,
          )}
        />
        <div className="h-[3px] w-full bg-white/[0.05] rounded-full overflow-hidden mt-3">
          <div
            className={cx(
              "h-full rounded-full transition-all duration-700",
              winRate >= 50 ? "bg-emerald-400/50" : "bg-teal-400/50",
            )}
            style={{ width: `${wrPct}%` }}
          />
        </div>
      </MetricCard>

      {/* Avg R */}
      <MetricCard label="Avg R / Trade" sub="per closed trade" delay={120} accent={avgRAccent}>
        <RLabel value={avgR} size="md" />
        {rHistory.length > 0 && <div className="mt-2"><StreakBadge rHistory={rHistory} /></div>}
      </MetricCard>

      {/* Total R — equity curve card */}
      <TiltCard
        className={cx(
          "relative rounded-xl border border-white/[0.06] overflow-hidden",
          "bg-gradient-to-b from-[#10141a] to-[#0d1117]",
          "hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
          "transition-all duration-200 group",
        )}
        style={{ animationDelay: "180ms" }}
      >
        {/* Top accent line */}
        <div className={cx(
          "absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent to-transparent",
          LINE[totalRAccent],
          "opacity-50 group-hover:opacity-100 transition-opacity duration-300",
        )} />

        {/* Corner glow */}
        <div className={cx(
          "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] pointer-events-none transition-all duration-500",
          GLOW[totalRAccent],
        )} />

        {/* Bottom glow matching curve color */}
        {rHistory.length > 1 && (
          <div className={cx(
            "absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full blur-[30px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            totalR >= 0 ? "bg-emerald-400/[0.06]" : "bg-red-400/[0.05]",
          )} />
        )}

        <div className="relative px-4 pt-4 sm:px-5 sm:pt-5 pb-2">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25 mb-2 sm:mb-3">
            Total R
          </div>
          <div className="mb-1">
            <RLabel value={totalR} size="md" />
          </div>
          <div className="font-mono text-[10px] sm:text-[11px] text-white/35">
            cumulative P&L in R
          </div>
        </div>
        {rHistory.length > 1
          ? <div className="relative mt-2"><EquityCurve rValues={rHistory} /></div>
          : <div className="pb-4" />
        }
      </TiltCard>

      {/* Trades */}
      <MetricCard label="Trades" sub="logged in journal" delay={240} accent="neutral">
        <CountUp
          value={totalTrades}
          className="font-mono font-medium text-[20px] sm:text-[26px] leading-none tracking-[-0.04em] text-white"
        />
        <div className="font-mono text-[9px] text-white/18 tracking-[0.08em] mt-2">
          {totalTrades < 20
            ? `${20 - totalTrades} more for significance`
            : totalTrades < 100
            ? `${100 - totalTrades} until 100-trade mark`
            : "Sufficient sample ✓"}
        </div>
      </MetricCard>

    </div>
  );
}
