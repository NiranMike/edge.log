"use client";

import type { TradeMetrics } from "@/types";
import { cx } from "@/style";
import { RLabel } from "../shared/r-label";

interface Props {
  metrics:    TradeMetrics;
  className?: string;
  rHistory?:  number[];
}

function getExpectancyMood(e: number) {
  if (e > 1)    return { color: "text-[var(--win)]",  label: "Strong edge",    desc: "You have a real statistical advantage." };
  if (e > 0.3)  return { color: "text-[var(--win)]",  label: "Positive edge",  desc: "Keep refining. It's working." };
  if (e > 0)    return { color: "text-[var(--ac-2)]", label: "Marginal edge",  desc: "Positive, but thin. Stay disciplined." };
  if (e > -0.3) return { color: "text-[var(--ac-2)]", label: "Near breakeven", desc: "Almost there — review your exits." };
  return             { color: "text-[var(--loss)]",   label: "Losing edge",    desc: "Don't increase size. Diagnose first." };
}

function getWinRateColor(wr: number) {
  if (wr >= 65) return "text-[var(--win)]";
  if (wr >= 50) return "text-[var(--tx-1)]";
  if (wr >= 40) return "text-[var(--ac-2)]";
  return "text-[var(--loss)]";
}

/* Mini sparkline for equity curve */
function EquityCurve({ rValues }: { rValues: number[] }) {
  if (rValues.length < 2) return null;
  const cum: number[] = [];
  let running = 0;
  for (const r of rValues) { running += r; cum.push(running); }
  const min = Math.min(...cum), max = Math.max(...cum);
  const range = max - min || 1;
  const W = 80, H = 28;
  const pts = cum.map((v, i) => {
    const x = (i / (cum.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const isPos   = cum[cum.length - 1] >= 0;
  const color   = isPos ? "var(--win)" : "var(--loss)";
  const dotY    = H - ((cum[cum.length - 1] - min) / range) * (H - 2) - 1;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className="opacity-70">
      <defs>
        <linearGradient id="ecGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <polyline
        points={pts.join(" ")}
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <circle cx={W} cy={dotY} r="2.5" fill={color} />
    </svg>
  );
}

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
    <span
      className="inline-flex items-center gap-1 px-2 py-[2px] font-mono text-[9px] uppercase tracking-[0.12em] border rounded"
      style={{
        color:            isWin ? "var(--win)"  : "var(--loss)",
        background:       isWin ? "var(--win-dim)" : "var(--loss-dim)",
        borderColor:      isWin ? "var(--ac-1-ring)" : "rgba(239,68,68,0.15)",
      }}
    >
      {isWin ? "▲" : "▼"} {streak} streak
    </span>
  );
}

/* ── Card shell ─────────────────────────────────────────────────────────── */
function MetricCard({
  label, sub, accent, children, delay,
}: {
  label:     string;
  sub:       string;
  accent?:   "win" | "loss" | "ac2" | "none";
  children?: React.ReactNode;
  delay?:    number;
}) {
  const accentColor =
    accent === "win"  ? "var(--win)"  :
    accent === "loss" ? "var(--loss)" :
    accent === "ac2"  ? "var(--ac-2)" :
    "var(--ac-1)";

  return (
    <div
      className={cx(
        "relative overflow-hidden group",
        "bg-[var(--bg-card)] border border-[var(--bd)]",
        "hover:border-[var(--bd-hi)] transition-all duration-300",
        "px-4 py-4 sm:px-5 sm:py-5",
      )}
      style={{
        clipPath: "polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))",
        animationDelay: delay ? `${delay}ms` : "0ms",
      }}
    >
      {/* Top edge glow — visible on hover */}
      <div
        className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
      />

      {/* Subtle corner accent */}
      <span
        className="absolute top-0 right-0 w-[10px] h-[10px] opacity-0 group-hover:opacity-60 transition-opacity duration-300"
        style={{ borderTop: `1px solid ${accentColor}`, borderRight: `1px solid ${accentColor}` }}
      />

      {/* Label */}
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--tx-4)] mb-3">
        {label}
      </div>

      {/* Value slot */}
      <div className="mb-2">{children}</div>

      {/* Sub */}
      <div className="font-mono text-[10px] sm:text-[11px] text-[var(--tx-3)] leading-relaxed">
        {sub}
      </div>
    </div>
  );
}

/* ── Grid ────────────────────────────────────────────────────────────────── */
export function MetricsGrid({ metrics, className, rHistory = [] }: Props) {
  const { totalTrades, winRate, avgR, totalR, expectancy } = metrics;
  const exp     = getExpectancyMood(expectancy);
  const wrColor = getWinRateColor(winRate);
  const wins    = totalTrades > 0 ? Math.round((winRate / 100) * totalTrades)      : 0;
  const losses  = totalTrades > 0 ? Math.round((1 - winRate / 100) * totalTrades)  : 0;
  const wrPct   = Math.min(100, Math.max(0, winRate));

  return (
    <div className={cx("grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3", className)}>

      {/* ── Expectancy ── */}
      <div className="col-span-2 md:col-span-1">
        <MetricCard
          label="Expectancy"
          sub={exp.desc}
          accent={expectancy >= 0 ? "win" : "loss"}
          delay={0}
        >
          <div className="flex items-baseline gap-2 mb-2">
            <span
              className={cx(
                "font-display font-black leading-none tracking-[-0.05em] tabular-nums",
                exp.color,
              )}
              style={{
                fontSize: "clamp(26px,3vw,32px)",
                textShadow: expectancy >= 0
                  ? "0 0 24px var(--win-dim)"
                  : "0 0 24px var(--loss-dim)",
              }}
            >
              {expectancy >= 0 ? "+" : ""}{expectancy}R
            </span>
          </div>
          <span
            className="inline-block font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-[3px] border"
            style={{
              color: accentVar(exp.color),
              background: expectancy >= 0 ? "var(--win-dim)"  : "var(--loss-dim)",
              borderColor: expectancy >= 0 ? "var(--ac-1-ring)" : "rgba(239,68,68,0.2)",
            }}
          >
            {exp.label}
          </span>
        </MetricCard>
      </div>

      {/* ── Win Rate ── */}
      <MetricCard
        label="Win Rate"
        sub={`${wins}W · ${losses}L`}
        accent={winRate >= 50 ? "win" : "ac2"}
        delay={60}
      >
        <span
          className={cx(
            "font-display font-black leading-none tracking-[-0.05em] tabular-nums",
            wrColor,
          )}
          style={{
            fontSize: "clamp(24px,3vw,30px)",
            textShadow: winRate >= 50 ? "0 0 20px var(--win-dim)" : undefined,
          }}
        >
          {winRate}%
        </span>
        <div className="h-[2px] w-full bg-[var(--bd)] rounded-full overflow-hidden mt-3">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${wrPct}%`,
              background: winRate >= 50 ? "var(--win)" : "var(--ac-2)",
              opacity: 0.5,
            }}
          />
        </div>
      </MetricCard>

      {/* ── Avg R ── */}
      <MetricCard
        label="Avg R / Trade"
        sub="per closed trade"
        accent={avgR >= 0 ? "win" : "loss"}
        delay={120}
      >
        <div className="mb-2">
          <RLabel value={avgR} size="md" />
        </div>
        {rHistory.length > 0 && <StreakBadge rHistory={rHistory} />}
      </MetricCard>

      {/* ── Total R ── */}
      <MetricCard
        label="Total R"
        sub="cumulative, all trades"
        accent={totalR >= 0 ? "win" : "loss"}
        delay={180}
      >
        <div className="mb-2">
          <RLabel value={totalR} size="md" />
        </div>
        {rHistory.length > 1 && <EquityCurve rValues={rHistory} />}
      </MetricCard>

      {/* ── Trades count ── */}
      <MetricCard
        label="Trades"
        sub={
          totalTrades < 20
            ? `${20 - totalTrades} more for significance`
            : totalTrades < 100
            ? `${100 - totalTrades} until 100-trade mark`
            : "Sufficient sample ✓"
        }
        accent="none"
        delay={240}
      >
        <span
          className="font-display font-black leading-none tracking-[-0.05em] tabular-nums text-[var(--tx-1)]"
          style={{ fontSize: "clamp(24px,3vw,30px)" }}
        >
          {totalTrades}
        </span>
      </MetricCard>

    </div>
  );
}

/* Helper — extract a raw CSS var string from a className like "text-[var(--win)]" */
function accentVar(cls: string): string {
  const m = cls.match(/\(([^)]+)\)/);
  return m ? m[1] : "currentColor";
}
