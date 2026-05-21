"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import type { Trade } from "@/types";
import {
  buildDayStats,
  buildMonthStat,
  buildMonthGrid,
  getAvailableMonths,
} from "@/lib/calendar-util";
import type { DayStat, CalendarCell } from "@/lib/calendar-util";
import { cx } from "@/style";

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDayColors(stat: DayStat | null, isFuture: boolean) {
  if (!stat || isFuture) return { bg: "", border: "", text: "", rText: "" };

  if (stat.isBreakeven) return {
    bg:     "bg-[var(--bg-overlay)]",
    border: "border-[var(--bd)]",
    text:   "text-[var(--tx-3)]",
    rText:  "text-[var(--tx-3)]",
  };

  if (stat.isProfit) {
    const shades = [
      { bg: "bg-emerald-400/[0.06]", border: "border-emerald-400/15", rText: "text-emerald-400/60" },
      { bg: "bg-emerald-400/[0.10]", border: "border-emerald-400/25", rText: "text-emerald-400/75" },
      { bg: "bg-emerald-400/[0.16]", border: "border-emerald-400/35", rText: "text-emerald-400/90" },
      { bg: "bg-emerald-400/[0.22]", border: "border-emerald-400/50", rText: "text-emerald-400"    },
    ];
    const s = shades[stat.intensity] ?? shades[3];
    return { ...s, text: "text-[var(--tx-2)]" };
  }

  // Loss
  const shades = [
    { bg: "bg-red-400/[0.06]", border: "border-red-400/15", rText: "text-red-400/60" },
    { bg: "bg-red-400/[0.10]", border: "border-red-400/25", rText: "text-red-400/75" },
    { bg: "bg-red-400/[0.16]", border: "border-red-400/35", rText: "text-red-400/90" },
    { bg: "bg-red-400/[0.22]", border: "border-red-400/50", rText: "text-red-400"    },
  ];
  const s = shades[stat.intensity] ?? shades[3];
  return { ...s, text: "text-[var(--tx-2)]" };
}

function DayTooltip({ stat, date }: { stat: DayStat; date: string }) {
  const d = new Date(date + "T12:00:00");
  return (
    <div className="absolute z-50 bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-40 pointer-events-none">
      <div className="bg-[var(--bg-elevated)] border border-[var(--bd-hi)] rounded-md shadow-[0_16px_48px_rgba(0,0,0,0.5)] px-3 py-2.5">
        <p className="font-mono text-[10px] text-[var(--tx-3)] mb-1.5">
          {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </p>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="font-mono text-[10px] text-[var(--tx-3)]">Total R</span>
            <span className={cx(
              "font-mono text-[11px] font-medium",
              stat.isProfit ? "text-[var(--win)]" : stat.isLoss ? "text-[var(--loss)]" : "text-[var(--tx-3)]",
            )}>
              {stat.totalR >= 0 ? "+" : ""}{stat.totalR}R
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-[10px] text-[var(--tx-3)]">Trades</span>
            <span className="font-mono text-[10px] text-[var(--tx-2)]">{stat.trades}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-[10px] text-[var(--tx-3)]">Win rate</span>
            <span className="font-mono text-[10px] text-[var(--tx-2)]">{stat.winRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-[10px] text-[var(--tx-3)]">W / L</span>
            <span className="font-mono text-[10px] text-[var(--tx-2)]">{stat.wins} / {stat.losses}</span>
          </div>
        </div>
        {/* Caret */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-white/[0.12]" />
      </div>
    </div>
  );
}

function DayCell({ cell }: { cell: CalendarCell }) {
  const [hovered, setHovered] = useState(false);

  if (!cell.date || cell.dayNum === null) {
    return <div className="aspect-square sm:aspect-auto sm:h-[88px]" />;
  }

  const colors = getDayColors(cell.stat, cell.isFuture);
  const hasStat = !!cell.stat;

  return (
    <div
      className="relative"
      onMouseEnter={() => hasStat && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cx(
        "relative flex flex-col justify-between aspect-square sm:aspect-auto sm:h-[88px] p-1.5 sm:p-2 rounded-[6px] border transition-all duration-150",
        cell.isToday
          ? "border-[var(--ac-2-ring)] bg-[var(--ac-2-dim)]"
          : hasStat && !cell.isFuture
          ? cx(colors.bg, colors.border, "hover:brightness-110 cursor-default")
          : "border-[var(--bd)] bg-[var(--bg-overlay)]",
        cell.isFuture && "opacity-30",
      )}>
        {/* Day number */}
        <div className="flex items-center justify-between">
          <span className={cx(
            "font-mono text-[11px] sm:text-[12px] leading-none",
            cell.isToday
              ? "text-[var(--ac-2)] font-medium"
              : hasStat && !cell.isFuture
              ? colors.text
              : "text-[var(--tx-4)]",
          )}>
            {cell.dayNum}
          </span>
          {/* Trade count dot/number */}
          {hasStat && !cell.isFuture && (
            <span className="font-mono text-[9px] text-[var(--tx-3)] leading-none hidden sm:block">
              {cell.stat!.trades}t
            </span>
          )}
        </div>

        {/* R value */}
        {hasStat && !cell.isFuture && (
          <div className="mt-auto">
            <span className={cx(
              "font-mono text-[10px] sm:text-[11px] font-medium leading-none block",
              colors.rText,
            )}>
              {cell.stat!.totalR >= 0 ? "+" : ""}{cell.stat!.totalR}R
            </span>
            {/* Trade count on mobile */}
            <span className="font-mono text-[8px] text-[var(--tx-4)] mt-0.5 block sm:hidden">
              {cell.stat!.trades} trade{cell.stat!.trades > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {hovered && hasStat && cell.stat && (
        <DayTooltip stat={cell.stat} date={cell.date} />
      )}
    </div>
  );
}

function MonthSummary({
  totalR, trades, winRate, tradingDays, profitDays, lossDays,
}: {
  totalR: number; trades: number; winRate: number;
  tradingDays: number; profitDays: number; lossDays: number;
}) {
  if (trades === 0) return null;

  const isPositive = totalR > 0;
  const isNegative = totalR < 0;

  return (
    <div className={cx(
      "flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 rounded-[6px] border mb-5",
      isPositive ? "bg-emerald-400/[0.04] border-emerald-400/12" :
      isNegative ? "bg-red-400/[0.04] border-red-400/12" :
                   "bg-[var(--bg-overlay)] border-[var(--bd)]",
    )}>
      {[
        {
          label: "Month R",
          value: `${totalR >= 0 ? "+" : ""}${totalR}R`,
          color: isPositive ? "text-[var(--win)]" : isNegative ? "text-[var(--loss)]" : "text-[var(--tx-3)]",
        },
        { label: "Trades",       value: String(trades),     color: "text-[var(--tx-2)]" },
        { label: "Win rate",     value: `${winRate}%`,      color: "text-[var(--tx-2)]" },
        { label: "Trading days", value: String(tradingDays), color: "text-[var(--tx-2)]" },
        { label: "Profit days",  value: String(profitDays),  color: "text-[var(--win)] opacity-70" },
        { label: "Loss days",    value: String(lossDays),    color: "text-[var(--loss)] opacity-70" },
      ].map(({ label, value, color }) => (
        <div key={label} className="flex items-baseline gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--tx-4)]">{label}</span>
          <span className={cx("font-mono text-[13px] font-medium", color)}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function YearStrip({
  year,
  dayStats,
  onMonthClick,
}: {
  year: number;
  dayStats: Map<string, DayStat>;
  onMonthClick: (month: number) => void;
}) {
  return (
    <div className="mb-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--tx-4)] mb-3">{year}</p>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
        {Array.from({ length: 12 }, (_, m) => {
          const key   = `${year}-${String(m + 1).padStart(2, "0")}`;
          const daysInMonth = new Date(year, m + 1, 0).getDate();
          let monthR = 0, hasTrades = false;
          for (let d = 1; d <= daysInMonth; d++) {
            const dk = `${key}-${String(d).padStart(2, "0")}`;
            const s  = dayStats.get(dk);
            if (s) { monthR += s.totalR; hasTrades = true; }
          }
          monthR = Math.round(monthR * 100) / 100;
          const isPos = hasTrades && monthR > 0;
          const isNeg = hasTrades && monthR < 0;

          return (
            <button
              key={m}
              onClick={() => onMonthClick(m)}
              className={cx(
                "px-2 py-2.5 rounded-[4px] border font-mono text-[10px] text-center cursor-pointer transition-all duration-150",
                isPos ? "bg-emerald-400/[0.08] border-emerald-400/20 text-emerald-400/80 hover:bg-emerald-400/[0.14]" :
                isNeg ? "bg-red-400/[0.08] border-red-400/20 text-red-400/80 hover:bg-red-400/[0.14]" :
                        "bg-[var(--bg-overlay)] border-[var(--bd)] text-[var(--tx-4)] hover:border-[var(--bd-hi)]",
              )}
            >
              <span className="block text-[8px] uppercase tracking-[0.1em] opacity-60 mb-0.5">
                {MONTHS[m].slice(0, 3)}
              </span>
              {hasTrades ? (
                <span className="block text-[10px] font-medium">
                  {monthR >= 0 ? "+" : ""}{monthR}R
                </span>
              ) : (
                <span className="block text-[10px] opacity-30">—</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarClient({ trades }: { trades: Trade[] }) {
  const dayStats = useMemo(() => buildDayStats(trades), [trades]);
  const availableMonths = useMemo(() => getAvailableMonths(trades), [trades]);

  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const grid      = useMemo(() => buildMonthGrid(year, month, dayStats),   [year, month, dayStats]);
  const monthStat = useMemo(() => buildMonthStat(year, month, dayStats),   [year, month, dayStats]);

  // All years that have trades
  const years = useMemo(() => {
    const ys = new Set(availableMonths.map((m: { year: number }) => m.year));
    return [...ys].sort((a: number, b: number) => b - a);
  }, [availableMonths]);

  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);
  const goTo = (y: number, m: number) => { setYear(y); setMonth(m); };
  const prev = () => { if (month === 0) goTo(year - 1, 11); else goTo(year, month - 1); };
  const next = () => {
    const n = new Date(); 
    if (year === n.getFullYear() && month === n.getMonth()) return;
    if (month === 11) goTo(year + 1, 0); else goTo(year, month + 1);
  };
  const isAtCurrent = year === now.getFullYear() && month === now.getMonth();

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-10 h-10 rounded-full bg-[var(--bg-overlay)] border border-[var(--bd)] flex items-center justify-center text-[var(--tx-4)] text-lg mb-4">
          ◻
        </div>
        <p className="font-mono text-[13px] text-[var(--tx-3)] mb-1">No trades yet.</p>
        <p className="font-mono text-[11px] text-[var(--tx-4)] mb-5">Log trades to see your calendar.</p>
        <Link href="/trades/new" className="font-mono text-[11px] text-[var(--ac-2)] opacity-70 hover:opacity-100 no-underline transition-opacity">
          Log your first trade →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {years.map(y => (
        <YearStrip
          key={y}
          year={y}
          dayStats={dayStats}
          onMonthClick={m => goTo(y, m)}
        />
      ))}

      <div className="border-t border-[var(--bd)] mb-7" />

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[var(--bd)] bg-[var(--bg-overlay)] font-mono text-[14px] text-[var(--tx-3)] hover:text-[var(--tx-2)] hover:border-[var(--bd-hi)] transition-all duration-150 cursor-pointer"
          >
            ‹
          </button>

          {/* Clickable header → opens picker */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setPickerOpen(v => !v)}
              className="flex items-center gap-2 font-mono text-[16px] sm:text-[18px] font-medium tracking-[-0.02em] text-[var(--tx-1)] hover:text-[var(--tx-2)] transition-colors duration-150 cursor-pointer min-w-[180px] justify-center"
            >
              {MONTHS[month]} {year}
              <span className={cx(
                "text-[10px] text-[var(--tx-3)] transition-transform duration-200",
                pickerOpen ? "rotate-180" : "",
              )}>▾</span>
            </button>

            {/* Picker dropdown */}
            {pickerOpen && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 w-[280px] bg-[var(--bg-elevated)] border border-[var(--bd-hi)] rounded-[10px] shadow-[0_24px_64px_rgba(0,0,0,0.5)] p-4">

                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--tx-3)] mb-2">Year</p>
                <div className="grid grid-cols-4 gap-1.5 mb-4">
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => { setYear(y); }}
                      className={cx(
                        "px-2 py-1.5 rounded-[6px] font-mono text-[11px] border transition-all duration-150 cursor-pointer",
                        y === year
                          ? "bg-[var(--ac-2-dim)] border-[var(--ac-2-ring)] text-[var(--ac-2)]"
                          : "bg-[var(--bg-overlay)] border-[var(--bd)] text-[var(--tx-3)] hover:text-[var(--tx-2)] hover:border-[var(--bd-hi)]",
                      )}
                    >
                      {y}
                    </button>
                  ))}
                </div>

                {/* Month selector */}
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--tx-3)] mb-2">Month</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {MONTHS.map((m, i) => {
                    const isFutureMonth = year === now.getFullYear() && i > now.getMonth();
                    return (
                      <button
                        key={m}
                        disabled={isFutureMonth}
                        onClick={() => { setMonth(i); setPickerOpen(false); }}
                        className={cx(
                          "px-2 py-1.5 rounded-[6px] font-mono text-[11px] border transition-all duration-150",
                          isFutureMonth
                            ? "border-transparent text-[var(--tx-4)] cursor-not-allowed"
                            : i === month
                            ? "bg-[var(--ac-2-dim)] border-[var(--ac-2-ring)] text-[var(--ac-2)] cursor-pointer"
                            : "bg-[var(--bg-overlay)] border-[var(--bd)] text-[var(--tx-3)] hover:text-[var(--tx-2)] hover:border-[var(--bd-hi)] cursor-pointer",
                        )}
                      >
                        {m.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={next}
            disabled={isAtCurrent}
            className={cx(
              "w-8 h-8 flex items-center justify-center rounded-[6px] border font-mono text-[14px] transition-all duration-150",
              isAtCurrent
                ? "border-[var(--bd)] text-[var(--tx-4)] cursor-not-allowed"
                : "border-[var(--bd)] bg-[var(--bg-overlay)] text-[var(--tx-3)] hover:text-[var(--tx-2)] hover:border-[var(--bd-hi)] cursor-pointer",
            )}
          >
            ›
          </button>
        </div>

        {/* Today button */}
        <button
          onClick={() => { goTo(now.getFullYear(), now.getMonth()); setPickerOpen(false); }}
          className={cx(
            "font-mono text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-[6px] border transition-all duration-150",
            isAtCurrent
              ? "text-[var(--tx-4)] border-[var(--bd)] cursor-default"
              : "text-[var(--tx-3)] border-[var(--bd)] hover:text-[var(--tx-2)] hover:border-[var(--bd-hi)] cursor-pointer",
          )}
        >
          Today
        </button>
      </div>

      {/* Month summary */}
      <MonthSummary
        totalR={monthStat.totalR}
        trades={monthStat.trades}
        winRate={monthStat.winRate}
        tradingDays={monthStat.tradingDays}
        profitDays={monthStat.profitDays}
        lossDays={monthStat.lossDays}
      />

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          {[
            { cls: "bg-emerald-400/[0.08] border-emerald-400/20", label: "Profit" },
            { cls: "bg-red-400/[0.08] border-red-400/20",         label: "Loss"   },
            { cls: "bg-[var(--bg-overlay)] border-[var(--bd)]", label: "Breakeven" },
          ].map(({ cls, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={cx("w-3 h-3 rounded-[2px] border", cls)} />
              <span className="font-mono text-[9px] text-[var(--tx-3)] tracking-[0.06em]">{label}</span>
            </div>
          ))}
        </div>
        <span className="font-mono text-[9px] text-[var(--tx-4)] ml-auto">Darker = larger R</span>
      </div>

      {/* Calendar grid */}
      <div className="rounded-xl border border-[var(--bd)] bg-[var(--bg-surface)] overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[var(--bd)]">
          {DAYS.map(d => (
            <div key={d} className="px-2 py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--tx-4)] bg-[var(--bg-elevated)]">
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d[0]}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
          {grid.map((row: CalendarCell[], ri: number) => (
            <div key={ri} className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {row.map((cell: CalendarCell, ci: number) => (
                <DayCell key={ci} cell={cell} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: trade links for the month */}
      {monthStat.trades > 0 && (
        <div className="mt-4 flex justify-end">
          <Link
            href="/trades"
            className="font-mono text-[11px] text-[var(--ac-2)] opacity-50 hover:opacity-100 no-underline transition-opacity duration-150 tracking-[0.04em]"
          >
            View all trades →
          </Link>
        </div>
      )}
    </div>
  );
}