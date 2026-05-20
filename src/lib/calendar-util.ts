// lib/calendar-utils.ts
import type { Trade } from "@/types";

export interface DayStat {
  date:       string;   // "YYYY-MM-DD"
  totalR:     number;
  trades:     number;
  wins:       number;
  losses:     number;
  winRate:    number;
  isProfit:   boolean;
  isLoss:     boolean;
  isBreakeven: boolean;
  intensity:  0 | 1 | 2 | 3;  // 0=none, 1=weak, 2=normal, 3=strong
}

export interface MonthStat {
  year:     number;
  month:    number;   // 0-based
  totalR:   number;
  trades:   number;
  wins:     number;
  winRate:  number;
  tradingDays: number;
  profitDays:  number;
  lossDays:    number;
}

export interface WeekStat {
  weekLabel: string;
  totalR:    number;
  trades:    number;
}

// Group trades by day → DayStat map
export function buildDayStats(trades: Trade[]): Map<string, DayStat> {
  const map = new Map<string, DayStat>();

  for (const t of trades) {
    const date = t.tradedAt.slice(0, 10); // "YYYY-MM-DD"
    const existing = map.get(date);

    if (existing) {
      existing.totalR  = Math.round((existing.totalR + t.rMultiple) * 10000) / 10000;
      existing.trades += 1;
      if (t.won) existing.wins += 1;
      else       existing.losses += 1;
    } else {
      map.set(date, {
        date,
        totalR:  t.rMultiple,
        trades:  1,
        wins:    t.won ? 1 : 0,
        losses:  t.won ? 0 : 1,
        winRate: 0,
        isProfit:    false,
        isLoss:      false,
        isBreakeven: false,
        intensity:   0,
      });
    }
  }

  // Compute derived fields
  const allR = [...map.values()].map(d => Math.abs(d.totalR)).filter(r => r > 0);
  const maxAbsR = allR.length ? Math.max(...allR) : 1;

  for (const stat of map.values()) {
    stat.winRate    = stat.trades > 0 ? Math.round((stat.wins / stat.trades) * 100) : 0;
    stat.totalR     = Math.round(stat.totalR * 100) / 100;
    stat.isProfit   = stat.totalR > 0;
    stat.isLoss     = stat.totalR < 0;
    stat.isBreakeven = stat.totalR === 0 && stat.trades > 0;

    // Intensity: how big was the day relative to the biggest day
    const ratio = Math.abs(stat.totalR) / maxAbsR;
    stat.intensity = ratio === 0 ? 0 : ratio < 0.33 ? 1 : ratio < 0.66 ? 2 : 3;
  }

  return map;
}

// Build month-level summary
export function buildMonthStat(
  year: number,
  month: number,  // 0-based
  dayStats: Map<string, DayStat>,
): MonthStat {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let totalR = 0, trades = 0, wins = 0, tradingDays = 0, profitDays = 0, lossDays = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const stat = dayStats.get(key);
    if (!stat) continue;
    totalR     += stat.totalR;
    trades     += stat.trades;
    wins       += stat.wins;
    tradingDays += 1;
    if (stat.isProfit) profitDays += 1;
    if (stat.isLoss)   lossDays   += 1;
  }

  return {
    year, month,
    totalR:      Math.round(totalR * 100) / 100,
    trades,
    wins,
    winRate:     trades > 0 ? Math.round((wins / trades) * 100) : 0,
    tradingDays,
    profitDays,
    lossDays,
  };
}

// Get all unique year-month combos from trades, plus surrounding months
export function getAvailableMonths(trades: Trade[]): Array<{ year: number; month: number }> {
  if (!trades.length) {
    const now = new Date();
    return [{ year: now.getFullYear(), month: now.getMonth() }];
  }

  const set = new Set<string>();
  for (const t of trades) {
    const d = new Date(t.tradedAt);
    set.add(`${d.getFullYear()}-${d.getMonth()}`);
  }

  // Also include current month
  const now = new Date();
  set.add(`${now.getFullYear()}-${now.getMonth()}`);

  return [...set]
    .map(s => {
      const [y, m] = s.split("-").map(Number);
      return { year: y, month: m };
    })
    .sort((a, b) => a.year !== b.year ? b.year - a.year : b.month - a.month);
}

// Build the 6-row × 7-col grid for a month
export interface CalendarCell {
  date:    string | null;   // null = padding cell
  dayNum:  number | null;
  stat:    DayStat | null;
  isToday: boolean;
  isFuture: boolean;
}

export function buildMonthGrid(
  year: number,
  month: number,
  dayStats: Map<string, DayStat>,
): CalendarCell[][] {
  const today     = new Date().toISOString().slice(0, 10);
  const firstDay  = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = [];

  // Leading padding
  for (let i = 0; i < firstDay; i++) {
    cells.push({ date: null, dayNum: null, stat: null, isToday: false, isFuture: false });
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      date,
      dayNum:   d,
      stat:     dayStats.get(date) ?? null,
      isToday:  date === today,
      isFuture: date > today,
    });
  }

  // Trailing padding to complete the last row
  while (cells.length % 7 !== 0) {
    cells.push({ date: null, dayNum: null, stat: null, isToday: false, isFuture: false });
  }

  // Split into rows
  const rows: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return rows;
}