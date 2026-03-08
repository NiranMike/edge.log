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