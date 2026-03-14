// types/index.ts

// ─── Domain types ─────────────────────────────────────────────────────────────

export type Direction = "LONG" | "SHORT";

export interface Trade {
  id:          number;
  userId:      string;
  pair:        string;
  direction:   Direction;
  entryPrice:  number;
  stopLoss:    number;
  takeProfit:  number;
  exitPrice:   number;
  rMultiple:   number;   // +2.35 = won 2.35R, -1.00 = lost 1R
  won:         boolean;
  notes:       string | null;
  tradedAt:    string;   // ISO string
  createdAt:   string;   // ISO string
}

// ─── Performance metrics (V1 — the 5 that matter) ───────────────────────────

export interface TradeMetrics {
  totalTrades: number;
  winRate:     number;   // 0–100
  avgR:        number;   // average R per trade
  totalR:      number;   // sum of all R multiples
  expectancy:  number;   // (winRate/100 * avgWinR) - ((1-winRate/100) * avgLossR)
}

// ─── Form ────────────────────────────────────────────────────────────────────

export interface TradeFormValues {
  pair:        string;
  direction:   Direction;
  entryPrice:  string;
  stopLoss:    string;
  takeProfit:  string;
  exitPrice:   string;
  notes:       string;
  tradedAt:    string;
}

export interface TradeFormErrors {
  pair?:       string;
  direction?:  string;
  entryPrice?: string;
  stopLoss?:   string;
  takeProfit?: string;
  exitPrice?:  string;
}

// ─── API response wrapper ────────────────────────────────────────────────────

export type Result<T = void> =
  | { ok: true;  data: T }
  | { ok: false; error: string };


  // ─── Filters (URL params → server) ───────────────────────────────────────────

export interface AnalyticsFilters {
  dateRange: "30d" | "90d" | "6mo" | "1yr" | "all";
  pairs:     string[];           // empty = all pairs
  direction: "ALL" | "LONG" | "SHORT";
}

// ─── Per-pair breakdown ───────────────────────────────────────────────────────

export interface PairStat {
  pair:      string;
  trades:    number;
  wins:      number;
  losses:    number;
  winRate:   number;             // 0–100
  avgR:      number;
  totalR:    number;
  bestR:     number;
  worstR:    number;
}

// ─── Direction bias ───────────────────────────────────────────────────────────

export interface DirectionStat {
  direction: "LONG" | "SHORT";
  trades:    number;
  wins:      number;
  winRate:   number;
  avgR:      number;
  totalR:    number;
}

// ─── R distribution bucket ────────────────────────────────────────────────────

export interface RBucket {
  label:  string;                // e.g. "1R → 2R"
  min:    number;
  max:    number;
  count:  number;
  pct:    number;                // % of total trades
}

// ─── Session breakdown ────────────────────────────────────────────────────────

export type MarketSession = "Asia" | "London" | "New York" | "Overlap" | "Closed";

export interface SessionStat {
  session:  MarketSession;
  trades:   number;
  wins:     number;
  winRate:  number;
  avgR:     number;
  totalR:   number;
}

// ─── Equity curve point ───────────────────────────────────────────────────────

export interface EquityPoint {
  date:        string;           // ISO date string for the x-axis
  cumulativeR: number;           // running total R at this point
  tradeR:      number;           // the individual trade's R (for tooltip)
  pair:        string;           // for tooltip
  drawdown:    number;           // drawdown from peak at this point (always <= 0)
}

// ─── Day of week ─────────────────────────────────────────────────────────────

export interface WeekdayStat {
  day:     "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  trades:  number;
  winRate: number;
  avgR:    number;
}

// ─── Overview stats ───────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  profitFactor:    number;       // gross wins / gross losses (0 if no losses)
  bestTrade:       number;       // highest single R
  worstTrade:      number;       // lowest single R
  largestWinStreak:  number;
  largestLossStreak: number;
  avgWinR:         number;
  avgLossR:        number;       // expressed as positive number
  mostActivePair:  string;
  mostActiveSession: MarketSession;
}

// ─── Root analytics object ────────────────────────────────────────────────────

export interface TradeAnalytics {
  overview:    AnalyticsOverview;
  byPair:      PairStat[];
  byDirection: DirectionStat[];  // always 2 items max — LONG and SHORT
  rBuckets:    RBucket[];        // always 7 buckets
  bySessions:  SessionStat[];
  equityCurve: EquityPoint[];    // sorted by date ascending
  byWeekday:   WeekdayStat[];    // sorted Mon → Sun
  totalTrades: number;
  filteredBy:  AnalyticsFilters; // echo back what filters produced this data
}