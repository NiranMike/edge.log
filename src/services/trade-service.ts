
import { Prisma } from "@prisma/client";
import { tradeRepository } from "@/repositories/trade.repository";
import type {
  Trade, TradeFormValues, TradeMetrics, Result,
  MarketSession, AnalyticsFilters, TradeAnalytics, AnalyticsOverview,
  PairStat, DirectionStat, RBucket, SessionStat, EquityPoint, WeekdayStat,
} from "@/types";
import { getWeekday } from "@/util";
import { TRADES_PAGE_SIZE } from "@/const/trades-const";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface ImportTradeRow {
  pair:         string;
  direction:    "LONG" | "SHORT";
  entryPrice:   number;
  stopLoss:     number | null;
  takeProfit:   number | null;
  exitPrice:    number;
  tradedAt:     string;
  notes:        string;
}

// ─── Pure helpers ────────────────────────────────────────────────────────────

function calcRMultiple(
  direction: "LONG" | "SHORT",
  entry: number,
  stop: number | null,
  exit: number,
): number {
  if (stop === null) return 0;
  const risk = Math.abs(entry - stop);
  if (risk === 0) return 0;
  const pnlPips = direction === "LONG" ? exit - entry : entry - exit;
  return Math.round((pnlPips / risk) * 10000) / 10000;
}

interface ValidationErrors {
  pair?: string; entryPrice?: string;
  stopLoss?: string; takeProfit?: string; exitPrice?: string;
}

function validate(value: TradeFormValues): ValidationErrors | null {
  const errors: ValidationErrors = {};
  if (!value.pair.trim()) errors.pair = "Pair is required";

  const entry = Number(value.entryPrice), stop = Number(value.stopLoss);
  const tp = Number(value.takeProfit), exit = Number(value.exitPrice);

  if (!value.entryPrice || isNaN(entry) || entry <= 0) errors.entryPrice = "Valid entry price required";
  if (!value.stopLoss   || isNaN(stop)  || stop  <= 0) errors.stopLoss   = "Valid stop loss required";
  if (!value.takeProfit || isNaN(tp)    || tp    <= 0) errors.takeProfit = "Valid take profit required";
  if (!value.exitPrice  || isNaN(exit)  || exit  <= 0) errors.exitPrice  = "Valid exit price required";

  if (!errors.entryPrice && !errors.stopLoss) {
    if (value.direction === "LONG"  && stop >= entry) errors.stopLoss = "Stop loss must be below entry for LONG";
    if (value.direction === "SHORT" && stop <= entry) errors.stopLoss = "Stop loss must be above entry for SHORT";
  }
  if (!errors.entryPrice && !errors.takeProfit) {
    if (value.direction === "LONG"  && tp <= entry) errors.takeProfit = "Take profit must be above entry for LONG";
    if (value.direction === "SHORT" && tp >= entry) errors.takeProfit = "Take profit must be below entry for SHORT";
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

function getSession(isoDate: string): MarketSession {
  const hour = new Date(isoDate).getUTCHours();
  const inAsia    = hour >= 23 || hour < 8;
  const inLondon  = hour >= 7  && hour < 16;
  const inNY      = hour >= 13 && hour < 21;

  if (inLondon && inNY) return "Overlap";
  if (inNY)             return "New York";
  if (inLondon)         return "London";
  if (inAsia)           return "Asia";
  return "Closed";
}

// Import fingerprint: userId|pair|direction|entry|exit|minute
function fingerprint(userId: string, row: ImportTradeRow): string {
  const minute = new Date(row.tradedAt).toISOString().slice(0, 16);
  return `${userId}|${row.pair}|${row.direction}|${row.entryPrice}|${row.exitPrice}|${minute}`;
}

function isPrismaNotFound(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const tradeService = {
  async create(userId: string, values: TradeFormValues): Promise<Result<Trade>> {
    const errors = validate(values);
    if (errors) return { ok: false, error: Object.values(errors)[0]! };

    const entry = Number(values.entryPrice), stop = Number(values.stopLoss);
    const tp = Number(values.takeProfit), exit = Number(values.exitPrice);
    const r = calcRMultiple(values.direction, entry, stop, exit);

    try {
      const trade = await tradeRepository.create({
        userId, pair: values.pair.trim().toUpperCase(), direction: values.direction,
        entryPrice: entry, stopLoss: stop, takeProfit: tp, exitPrice: exit,
        rMultiple: r, won: r > 0,
        screenshotUrl: values.screenshotUrl ?? null,
        notes: values.notes.trim() || null,
        tradedAt: values.tradedAt ? new Date(values.tradedAt) : new Date(),
      });
      return { ok: true, data: trade };
    } catch {
      return { ok: false, error: "Failed to save trade. Please try again." };
    }
  },

  async update(userId: string, id: number, values: TradeFormValues): Promise<Result<Trade>> {
    const errors = validate(values);
    if (errors) return { ok: false, error: Object.values(errors)[0]! };

    const entry = Number(values.entryPrice), stop = Number(values.stopLoss);
    const tp = Number(values.takeProfit), exit = Number(values.exitPrice);
    const r = calcRMultiple(values.direction, entry, stop, exit);

    try {
      const trade = await tradeRepository.update(id, userId, {
        pair: values.pair.trim().toUpperCase(), direction: values.direction,
        entryPrice: entry, stopLoss: stop, takeProfit: tp, exitPrice: exit,
        rMultiple: r, won: r > 0,
        screenshotUrl: values.screenshotUrl ?? null,
        notes: values.notes.trim() || null,
        // undefined → Prisma keeps the existing value; no pre-fetch needed
        tradedAt: values.tradedAt ? new Date(values.tradedAt) : undefined,
      });
      return { ok: true, data: trade };
    } catch (err) {
      if (isPrismaNotFound(err)) return { ok: false, error: "Trade not found." };
      console.error("[tradeService.update]", err);
      return { ok: false, error: "Failed to update trade." };
    }
  },

  async delete(userId: string, id: number): Promise<Result<void>> {
    try {
      const deleted = await tradeRepository.delete(id, userId);
      if (!deleted) return { ok: false, error: "Trade not found." };
      return { ok: true, data: undefined };
    } catch {
      return { ok: false, error: "Failed to delete trade." };
    }
  },

  async getAll(userId: string): Promise<Trade[]> {
    return tradeRepository.findAllByUser(userId);
  },

  async getById(userId: string, id: number): Promise<Trade | null> {
    return tradeRepository.findById(id, userId);
  },

  async getPage(userId: string, page: number): Promise<{ trades: Trade[]; total: number }> {
    return tradeRepository.findPage(userId, page, TRADES_PAGE_SIZE);
  },

  /** Dashboard data via DB aggregates — no full table scan */
  async getDashboardData(userId: string): Promise<{
    metrics:  TradeMetrics;
    recent:   Trade[];
    rHistory: number[];
  }> {
    const [metrics, recent, rHistory] = await Promise.all([
      tradeRepository.computeMetrics(userId),
      tradeRepository.findRecent(userId, 8),
      tradeRepository.findAllRMultiples(userId),
    ]);
    return { metrics, recent, rHistory };
  },

  /** Bulk import with in-file and DB deduplication */
  async importTrades(
    userId: string,
    rows: ImportTradeRow[],
  ): Promise<Result<{ imported: number; duplicates: number }>> {
    if (rows.length === 0)   return { ok: false, error: "No valid rows to import." };
    if (rows.length > 1000)  return { ok: false, error: "Maximum 1,000 trades per import." };

    // ── 1. Deduplicate within the file itself ────────────────────────────────
    const seenInFile = new Set<string>();
    const uniqueRows: ImportTradeRow[] = [];
    for (const row of rows) {
      const fp = fingerprint(userId, row);
      if (!seenInFile.has(fp)) { seenInFile.add(fp); uniqueRows.push(row); }
    }
    const inFileDuplicates = rows.length - uniqueRows.length;

    // ── 2. Check against existing DB trades in the same date range ───────────
    const dates   = uniqueRows.map(r => new Date(r.tradedAt));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    const existing    = await tradeRepository.findInDateRange(userId, minDate, maxDate);
    const existingFps = new Set(
      existing.map(t => {
        const minute = t.tradedAt.slice(0, 16);
        return `${userId}|${t.pair}|${t.direction}|${t.entryPrice}|${t.exitPrice}|${minute}`;
      })
    );

    const newRows      = uniqueRows.filter(r => !existingFps.has(fingerprint(userId, r)));
    const dbDuplicates = uniqueRows.length - newRows.length;
    const totalDups    = inFileDuplicates + dbDuplicates;

    if (newRows.length === 0) {
      return {
        ok:    false,
        error: `All ${rows.length} trade${rows.length === 1 ? "" : "s"} already exist in your journal. Nothing imported.`,
      };
    }

    const data = newRows.map(row => {
      const r = calcRMultiple(row.direction, row.entryPrice, row.stopLoss, row.exitPrice);
      return {
        userId,
        pair:          row.pair,
        direction:     row.direction,
        entryPrice:    row.entryPrice,
        stopLoss:      row.stopLoss   ?? row.entryPrice,
        takeProfit:    row.takeProfit ?? row.exitPrice,
        exitPrice:     row.exitPrice,
        rMultiple:     r,
        won:           row.stopLoss !== null
                         ? r > 0
                         : (row.direction === "LONG"
                             ? row.exitPrice > row.entryPrice
                             : row.exitPrice < row.entryPrice),
        notes:         row.notes || null,
        screenshotUrl: null,
        tradedAt:      new Date(row.tradedAt),
      };
    });

    await tradeRepository.bulkCreate(data);
    return { ok: true, data: { imported: newRows.length, duplicates: totalDups } };
  },

  computeAnalytics(trades: Trade[], filters: AnalyticsFilters): TradeAnalytics {

  const wins   = trades.filter(t => t.won);
  const losses = trades.filter(t => !t.won);

  const grossWins   = wins.reduce((s, t)   => s + t.rMultiple, 0);
  const grossLosses = losses.reduce((s, t) => s + Math.abs(t.rMultiple), 0);

  // Profit factor: how much you make for every 1R you lose
  // e.g. 2.0 means for every $1 risked and lost, you make $2 back
  const profitFactor = grossLosses === 0 ? grossWins : Math.round((grossWins / grossLosses) * 100) / 100;

  const sortedR    = [...trades].sort((a, b) => b.rMultiple - a.rMultiple);
  const bestTrade  = sortedR[0]?.rMultiple  ?? 0;
  const worstTrade = sortedR[sortedR.length - 1]?.rMultiple ?? 0;

  const avgWinR  = wins.length   ? Math.round((grossWins   / wins.length)   * 100) / 100 : 0;
  const avgLossR = losses.length ? Math.round((grossLosses / losses.length) * 100) / 100 : 0;

  let currentStreak = 0;
  let largestWinStreak  = 0;
  let largestLossStreak = 0;
  let lastWon: boolean | null = null;

  for (const t of trades) {
    if (lastWon === null || t.won === lastWon) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    if (t.won)  largestWinStreak  = Math.max(largestWinStreak,  currentStreak);
    if (!t.won) largestLossStreak = Math.max(largestLossStreak, currentStreak);
    lastWon = t.won;
  }

  const pairCounts = trades.reduce<Record<string, number>>((acc, t) => {
    acc[t.pair] = (acc[t.pair] ?? 0) + 1;
    return acc;
  }, {});
  const mostActivePair = Object.entries(pairCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";

  const sessionCounts = trades.reduce<Record<string, number>>((acc, t) => {
    const s = getSession(t.tradedAt);
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  const mostActiveSession = (Object.entries(sessionCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Closed") as MarketSession;

  const overview: AnalyticsOverview = {
    profitFactor,
    bestTrade,
    worstTrade,
    largestWinStreak,
    largestLossStreak,
    avgWinR,
    avgLossR,
    mostActivePair,
    mostActiveSession,
  };

  const pairMap = trades.reduce<Record<string, Trade[]>>((acc, t) => {
    (acc[t.pair] ??= []).push(t);
    return acc;
  }, {});

  const byPair: PairStat[] = Object.entries(pairMap).map(([pair, ts]) => {
    const w = ts.filter(t => t.won);
    const total = ts.reduce((s, t) => s + t.rMultiple, 0);
    const sorted = [...ts].sort((a, b) => b.rMultiple - a.rMultiple);
    return {
      pair,
      trades:   ts.length,
      wins:     w.length,
      losses:   ts.length - w.length,
      winRate:  Math.round((w.length / ts.length) * 1000) / 10,
      avgR:     Math.round((total / ts.length) * 100) / 100,
      totalR:   Math.round(total * 100) / 100,
      bestR:    sorted[0]?.rMultiple ?? 0,
      worstR:   sorted[sorted.length - 1]?.rMultiple ?? 0,
    };
  }).sort((a, b) => b.totalR - a.totalR);

  const byDirection: DirectionStat[] = (["LONG", "SHORT"] as const).map(dir => {
    const ts = trades.filter(t => t.direction === dir);
    const w  = ts.filter(t => t.won);
    const total = ts.reduce((s, t) => s + t.rMultiple, 0);
    return {
      direction: dir,
      trades:    ts.length,
      wins:      w.length,
      winRate:   ts.length ? Math.round((w.length / ts.length) * 1000) / 10 : 0,
      avgR:      ts.length ? Math.round((total / ts.length) * 100) / 100 : 0,
      totalR:    Math.round(total * 100) / 100,
    };
  });

  const bucketDefs = [
    { label: "< -2R",    min: -Infinity, max: -2     },
    { label: "-2R → -1R", min: -2,       max: -1     },
    { label: "-1R → 0R",  min: -1,       max: 0      },
    { label: "0R → 1R",   min: 0,        max: 1      },
    { label: "1R → 2R",   min: 1,        max: 2      },
    { label: "2R → 3R",   min: 2,        max: 3      },
    { label: "> 3R",      min: 3,        max: Infinity},
  ];

  const rBuckets: RBucket[] = bucketDefs.map(({ label, min, max }) => {
    const count = trades.filter(t => t.rMultiple > min && t.rMultiple <= max).length;
    return {
      label,
      min,
      max,
      count,
      pct: trades.length ? Math.round((count / trades.length) * 1000) / 10 : 0,
    };
  });

  const sessionMap = trades.reduce<Record<string, Trade[]>>((acc, t) => {
    const s = getSession(t.tradedAt);
    (acc[s] ??= []).push(t);
    return acc;
  }, {});

  const bySessions: SessionStat[] = (
    ["Asia", "London", "Overlap", "New York", "Closed"] as MarketSession[]
  ).map(session => {
    const ts = sessionMap[session] ?? [];
    const w  = ts.filter(t => t.won);
    const total = ts.reduce((s, t) => s + t.rMultiple, 0);
    return {
      session,
      trades:  ts.length,
      wins:    w.length,
      winRate: ts.length ? Math.round((w.length / ts.length) * 1000) / 10 : 0,
      avgR:    ts.length ? Math.round((total / ts.length) * 100) / 100 : 0,
      totalR:  Math.round(total * 100) / 100,
    };
  });

  let cumulative  = 0;
  let peak        = 0;

  const equityCurve: EquityPoint[] = trades.map(t => {
    cumulative += t.rMultiple;
    peak        = Math.max(peak, cumulative);
    return {
      date:        t.tradedAt.slice(0, 10),
      cumulativeR: Math.round(cumulative * 100) / 100,
      tradeR:      t.rMultiple,
      pair:        t.pair,
      drawdown:    Math.round((cumulative - peak) * 100) / 100,
    };
  });

  const weekdayMap = trades.reduce<Record<string, Trade[]>>((acc, t) => {
    const d = getWeekday(t.tradedAt);
    (acc[d] ??= []).push(t);
    return acc;
  }, {});

  const byWeekday: WeekdayStat[] = (
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const
  ).map(day => {
    const ts = weekdayMap[day] ?? [];
    const w  = ts.filter(t => t.won);
    const total = ts.reduce((s, t) => s + t.rMultiple, 0);
    return {
      day,
      trades:  ts.length,
      winRate: ts.length ? Math.round((w.length / ts.length) * 1000) / 10 : 0,
      avgR:    ts.length ? Math.round((total / ts.length) * 100) / 100 : 0,
    };
  });

  return {
    overview,
    byPair,
    byDirection,
    rBuckets,
    bySessions,
    equityCurve,
    byWeekday,
    totalTrades: trades.length,
    filteredBy:  filters,
  };
},
};
