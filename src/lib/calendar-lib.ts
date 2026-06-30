import type { Trade } from "@/types";

export interface DayStat {
  date:       string;   // "YYYY-MM-DD"
  totalR:     number;
  trades:     number;
  wins:       number;
  losses:     number;
  winRate:    number;
  tradeList:  { pair: string; direction: string; rMultiple: number }[];
}

export interface MonthStat {
  year:    number;
  month:   number;   // 0-based
  totalR:  number;
  trades:  number;
  winDays: number;
  lossDays: number;
}

export interface CalendarData {
  dayMap:   Record<string, DayStat>;
  months:   MonthStat[];               
}

export function buildCalendarData(trades: Trade[]): CalendarData {
  const dayMap: Record<string, DayStat> = {};

  for (const t of trades) {
    const date = t.tradedAt.slice(0, 10);
    if (!dayMap[date]) {
      dayMap[date] = {
        date,
        totalR:    0,
        trades:    0,
        wins:      0,
        losses:    0,
        winRate:   0,
        tradeList: [],
      };
    }
    const d = dayMap[date];
    d.totalR   = Math.round((d.totalR + t.rMultiple) * 10000) / 10000;
    d.trades  += 1;
    if (t.won) d.wins += 1; else d.losses += 1;
    d.winRate  = Math.round((d.wins / d.trades) * 1000) / 10;
    d.tradeList.push({ pair: t.pair, direction: t.direction, rMultiple: t.rMultiple });
  }

  // Build month summaries
  const monthMap: Record<string, MonthStat> = {};
  for (const day of Object.values(dayMap)) {
    const [yr, mo] = day.date.split("-").map(Number);
    const key = `${yr}-${mo}`;
    if (!monthMap[key]) {
      monthMap[key] = { year: yr, month: mo - 1, totalR: 0, trades: 0, winDays: 0, lossDays: 0 };
    }
    const m = monthMap[key];
    m.totalR   = Math.round((m.totalR + day.totalR) * 10000) / 10000;
    m.trades  += day.trades;
    if (day.totalR > 0) m.winDays++;
    if (day.totalR < 0) m.lossDays++;
  }

  return {
    dayMap,
    months: Object.values(monthMap).sort((a, b) =>
      a.year !== b.year ? b.year - a.year : b.month - a.month
    ),
  };
}

// Get color class based on R value
export function getDayColor(totalR: number, trades: number): {
  bg: string; border: string; text: string;
} {
  if (trades === 0) return { bg: "bg-white/[0.02]",           border: "border-white/[0.05]",      text: "text-white/15"  };
  if (totalR === 0) return { bg: "bg-white/[0.04]",           border: "border-white/[0.08]",      text: "text-white/30"  };

  if (totalR >= 5)  return { bg: "bg-emerald-400/[0.20]",     border: "border-emerald-400/40",    text: "text-emerald-300" };
  if (totalR >= 3)  return { bg: "bg-emerald-400/[0.14]",     border: "border-emerald-400/30",    text: "text-emerald-400" };
  if (totalR >= 1)  return { bg: "bg-emerald-400/[0.08]",     border: "border-emerald-400/20",    text: "text-emerald-400" };
  if (totalR > 0)   return { bg: "bg-emerald-400/[0.05]",     border: "border-emerald-400/15",    text: "text-emerald-400/70" };

  if (totalR <= -5) return { bg: "bg-red-400/[0.20]",         border: "border-red-400/40",        text: "text-red-300"   };
  if (totalR <= -3) return { bg: "bg-red-400/[0.14]",         border: "border-red-400/30",        text: "text-red-400"   };
  if (totalR <= -1) return { bg: "bg-red-400/[0.08]",         border: "border-red-400/20",        text: "text-red-400"   };
  return              { bg: "bg-red-400/[0.05]",              border: "border-red-400/15",        text: "text-red-400/70" };
}

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];