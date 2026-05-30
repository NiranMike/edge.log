"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import type { Trade } from "@/types";
import {
  buildDayStats,
  buildMonthStat,
  getAvailableMonths,
} from "@/lib/calendar-util";
import type { DayStat } from "@/lib/calendar-util";
import { cx } from "@/style";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDayColors(stat: DayStat | null, isFuture: boolean) {
  if (!stat || isFuture) return { bg: "", border: "", text: "", rText: "" };

  if (stat.isBreakeven) return {
    bg:     "bg-white/[0.03]",
    border: "border-white/[0.08]",
    text:   "text-white/40",
    rText:  "text-white/30",
  };

  if (stat.isProfit) {
    const shades = [
      { bg: "bg-emerald-400/[0.06]", border: "border-emerald-400/15", rText: "text-emerald-400/60" },
      { bg: "bg-emerald-400/[0.10]", border: "border-emerald-400/25", rText: "text-emerald-400/75" },
      { bg: "bg-emerald-400/[0.16]", border: "border-emerald-400/35", rText: "text-emerald-400/90" },
      { bg: "bg-emerald-400/[0.22]", border: "border-emerald-400/50", rText: "text-emerald-400"    },
    ];
    const s = shades[stat.intensity] ?? shades[3];
    return { ...s, text: "text-white/70" };
  }

  const shades = [
    { bg: "bg-red-400/[0.06]", border: "border-red-400/15", rText: "text-red-400/60" },
    { bg: "bg-red-400/[0.10]", border: "border-red-400/25", rText: "text-red-400/75" },
    { bg: "bg-red-400/[0.16]", border: "border-red-400/35", rText: "text-red-400/90" },
    { bg: "bg-red-400/[0.22]", border: "border-red-400/50", rText: "text-red-400"    },
  ];
  const s = shades[stat.intensity] ?? shades[3];
  return { ...s, text: "text-white/70" };
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Day Tooltip ─────────────────────────────────────────────────────────────

function DayTooltip({ stat, date }: { stat: DayStat; date: Date }) {
  return (
    <div className="absolute z-50 bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-40 pointer-events-none">
      <div className="bg-[#0d1117] border border-white/12 rounded-md shadow-[0_16px_48px_rgba(0,0,0,0.8)] px-3 py-2.5">
        <p className="font-mono text-[10px] text-white/40 mb-1.5">
          {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </p>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="font-mono text-[10px] text-white/30">Total R</span>
            <span className={cx(
              "font-mono text-[11px] font-medium",
              stat.isProfit ? "text-emerald-400" : stat.isLoss ? "text-red-400" : "text-white/40",
            )}>
              {stat.totalR >= 0 ? "+" : ""}{stat.totalR}R
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-[10px] text-white/30">Trades</span>
            <span className="font-mono text-[10px] text-white/60">{stat.trades}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-[10px] text-white/30">Win rate</span>
            <span className="font-mono text-[10px] text-white/60">{stat.winRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-[10px] text-white/30">W / L</span>
            <span className="font-mono text-[10px] text-white/60">{stat.wins} / {stat.losses}</span>
          </div>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-white/[0.12]" />
      </div>
    </div>
  );
}

// ─── Month Summary ───────────────────────────────────────────────────────────

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
                   "bg-white/[0.02] border-white/[0.06]",
    )}>
      {[
        {
          label: "Month R",
          value: `${totalR >= 0 ? "+" : ""}${totalR}R`,
          color: isPositive ? "text-emerald-400" : isNegative ? "text-red-400" : "text-white/40",
        },
        { label: "Trades",       value: String(trades),      color: "text-white/60" },
        { label: "Win rate",     value: `${winRate}%`,       color: "text-white/60" },
        { label: "Trading days", value: String(tradingDays), color: "text-white/60" },
        { label: "Profit days",  value: String(profitDays),  color: "text-emerald-400/70" },
        { label: "Loss days",    value: String(lossDays),    color: "text-red-400/70" },
      ].map(({ label, value, color }) => (
        <div key={label} className="flex items-baseline gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/22">{label}</span>
          <span className={cx("font-mono text-[13px] font-medium", color)}>{value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Year Strip ──────────────────────────────────────────────────────────────

function YearStrip({
  year, dayStats, onMonthClick,
}: {
  year: number;
  dayStats: Map<string, DayStat>;
  onMonthClick: (month: number) => void;
}) {
  return (
    <div className="mb-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/20 mb-3">{year}</p>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
        {Array.from({ length: 12 }, (_, m) => {
          const key = `${year}-${String(m + 1).padStart(2, "0")}`;
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
                        "bg-white/[0.02] border-white/[0.05] text-white/20 hover:border-white/[0.10]",
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

// ─── Main Calendar ───────────────────────────────────────────────────────────

export function CalendarClient({ trades }: { trades: Trade[] }) {
  const dayStats = useMemo(() => buildDayStats(trades), [trades]);
  const availableMonths = useMemo(() => getAvailableMonths(trades), [trades]);

  const now = new Date();
  const todayStr = formatDateKey(now);
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const currentYear  = month.getFullYear();
  const currentMonth = month.getMonth();

  const monthStat = useMemo(
    () => buildMonthStat(currentYear, currentMonth, dayStats),
    [currentYear, currentMonth, dayStats],
  );

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

  const goTo = useCallback((y: number, m: number) => setMonth(new Date(y, m, 1)), []);

  const prev = useCallback(() => {
    setMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const next = useCallback(() => {
    setMonth(d => {
      const n = new Date();
      if (d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth()) return d;
      return new Date(d.getFullYear(), d.getMonth() + 1, 1);
    });
  }, []);

  const isAtCurrent = currentYear === now.getFullYear() && currentMonth === now.getMonth();

  // Custom day rendering for DayPicker
  const renderDay = useCallback((dayProps: { day: { date: Date }; children?: React.ReactNode }) => {
    const date = dayProps.day.date;
    const dateKey = formatDateKey(date);
    const isCurrentMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;

    if (!isCurrentMonth) {
      return <td className="p-0.5 sm:p-1"><div className="aspect-square sm:aspect-auto sm:h-[88px]" /></td>;
    }

    const stat = dayStats.get(dateKey) ?? null;
    const isToday = dateKey === todayStr;
    const isFuture = dateKey > todayStr;
    const hasStat = !!stat;
    const colors = getDayColors(stat, isFuture);

    return (
      <td className="p-0.5 sm:p-1">
        <div
          className="relative"
          onMouseEnter={() => hasStat && setHoveredDay(dateKey)}
          onMouseLeave={() => setHoveredDay(null)}
        >
          <div className={cx(
            "relative flex flex-col justify-between aspect-square sm:aspect-auto sm:h-[88px] p-1.5 sm:p-2 rounded-[6px] border transition-all duration-150",
            isToday
              ? "border-teal-400/40 bg-teal-400/[0.04]"
              : hasStat && !isFuture
              ? cx(colors.bg, colors.border, "hover:brightness-110 cursor-default")
              : "border-white/[0.04] bg-white/[0.01]",
            isFuture && "opacity-30",
          )}>
            <div className="flex items-center justify-between">
              <span className={cx(
                "font-mono text-[11px] sm:text-[12px] leading-none",
                isToday
                  ? "text-teal-400 font-medium"
                  : hasStat && !isFuture
                  ? colors.text
                  : "text-white/18",
              )}>
                {date.getDate()}
              </span>
              {hasStat && !isFuture && (
                <span className="font-mono text-[9px] text-white/25 leading-none hidden sm:block">
                  {stat!.trades}t
                </span>
              )}
            </div>

            {hasStat && !isFuture && (
              <div className="mt-auto">
                <span className={cx(
                  "font-mono text-[10px] sm:text-[11px] font-medium leading-none block",
                  colors.rText,
                )}>
                  {stat!.totalR >= 0 ? "+" : ""}{stat!.totalR}R
                </span>
                <span className="font-mono text-[8px] text-white/20 mt-0.5 block sm:hidden">
                  {stat!.trades} trade{stat!.trades > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {hoveredDay === dateKey && hasStat && stat && (
            <DayTooltip stat={stat} date={date} />
          )}
        </div>
      </td>
    );
  }, [dayStats, todayStr, currentMonth, currentYear, hoveredDay]);

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/15 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <p className="font-mono text-[13px] text-white/35 mb-1">No trades yet.</p>
        <p className="font-mono text-[11px] text-white/20 mb-5">Log trades to see your calendar.</p>
        <Link href="/trades/new" className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-[10px] bg-emerald-400 rounded-lg text-[#07090d] font-mono text-[11px] font-medium no-underline hover:brightness-110 active:scale-[0.97] transition-all duration-150 tracking-[0.06em] uppercase">
          Log your first trade
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <div className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12 pointer-events-none" />
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

      <div className="border-t border-white/[0.05] mb-7" />

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-white/[0.08] bg-white/[0.02] text-white/35 hover:text-white/60 hover:border-white/[0.14] transition-all duration-150 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          {/* Clickable header → picker */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setPickerOpen(v => !v)}
              className="flex items-center gap-2 font-mono text-[16px] sm:text-[18px] font-medium tracking-[-0.02em] text-white hover:text-white/70 transition-colors duration-150 cursor-pointer min-w-[180px] justify-center"
            >
              {MONTHS[currentMonth]} {currentYear}
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={cx("text-white/30 transition-transform duration-200", pickerOpen ? "rotate-180" : "")}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Picker dropdown */}
            {pickerOpen && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 w-[280px] bg-[#0d1117] border border-white/[0.12] rounded-[10px] shadow-[0_24px_64px_rgba(0,0,0,0.8)] p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25 mb-2">Year</p>
                <div className="grid grid-cols-4 gap-1.5 mb-4">
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => goTo(y, currentMonth)}
                      className={cx(
                        "px-2 py-1.5 rounded-[6px] font-mono text-[11px] border transition-all duration-150 cursor-pointer",
                        y === currentYear
                          ? "bg-teal-400/[0.12] border-teal-400/30 text-teal-400"
                          : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/[0.12]",
                      )}
                    >
                      {y}
                    </button>
                  ))}
                </div>

                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25 mb-2">Month</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {MONTHS.map((m, i) => {
                    const isFutureMonth = currentYear === now.getFullYear() && i > now.getMonth();
                    return (
                      <button
                        key={m}
                        disabled={isFutureMonth}
                        onClick={() => { goTo(currentYear, i); setPickerOpen(false); }}
                        className={cx(
                          "px-2 py-1.5 rounded-[6px] font-mono text-[11px] border transition-all duration-150",
                          isFutureMonth
                            ? "border-transparent text-white/12 cursor-not-allowed"
                            : i === currentMonth
                            ? "bg-teal-400/[0.12] border-teal-400/30 text-teal-400 cursor-pointer"
                            : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/[0.12] cursor-pointer",
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
              "w-8 h-8 flex items-center justify-center rounded-[6px] border transition-all duration-150",
              isAtCurrent
                ? "border-white/[0.04] text-white/12 cursor-not-allowed"
                : "border-white/[0.08] bg-white/[0.02] text-white/35 hover:text-white/60 hover:border-white/[0.14] cursor-pointer",
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <button
          onClick={() => { goTo(now.getFullYear(), now.getMonth()); setPickerOpen(false); }}
          className={cx(
            "font-mono text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-[6px] border transition-all duration-150",
            isAtCurrent
              ? "text-white/15 border-white/[0.04] cursor-default"
              : "text-white/35 border-white/[0.08] hover:text-white/55 hover:border-white/[0.14] cursor-pointer",
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
            { cls: "bg-white/[0.03] border-white/[0.08]",         label: "BE" },
          ].map(({ cls, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={cx("w-3 h-3 rounded-[2px] border", cls)} />
              <span className="font-mono text-[9px] text-white/25 tracking-[0.06em]">{label}</span>
            </div>
          ))}
        </div>
        <span className="font-mono text-[9px] text-white/18 ml-auto">Darker = larger R</span>
      </div>

      {/* Calendar — react-day-picker */}
      <div className="rounded-xl border border-white/[0.065] bg-[#0d1117] overflow-hidden">
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          hideNavigation
          showOutsideDays={false}
          fixedWeeks={false}
          classNames={{
            months:        "w-full",
            month:         "w-full",
            month_caption: "hidden",
            nav:           "hidden",
            month_grid:    "w-full",
            weekdays:      "flex border-b border-white/[0.05]",
            weekday:       "flex-1 px-2 py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-white/20 bg-[#0a0e14]",
            week:          "flex",
            day:           "flex-1",
            outside:       "opacity-0 pointer-events-none",
            hidden:        "invisible",
          }}
          components={{
            Day: renderDay,
          }}
        />
      </div>

      {/* Bottom link */}
      {monthStat.trades > 0 && (
        <div className="mt-4 flex justify-end">
          <Link
            href="/trades"
            className="font-mono text-[11px] text-teal-400/50 hover:text-teal-400 no-underline transition-colors duration-150 tracking-[0.04em]"
          >
            View all trades
          </Link>
        </div>
      )}
    </div>
  );
}
