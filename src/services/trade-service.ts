// lib/services/trade-service.ts
// ─── Trade Service ────────────────────────────────────────────────────────────

import { tradeRepository } from "@/repositories/trade.repository";
import type { Trade, TradeFormValues, TradeMetrics, Result } from "@/types";

function calcRMultiple(
  direction: "LONG" | "SHORT",
  entry: number, stop: number, exit: number
): number {
  const risk = Math.abs(entry - stop);
  if (risk === 0) return 0;
  const pnlPips = direction === "LONG" ? exit - entry : entry - exit;
  return Math.round((pnlPips / risk) * 10000) / 10000;
}

interface ValidationErrors {
  pair?: string; entryPrice?: string;
  stopLoss?: string; takeProfit?: string; exitPrice?: string;
}

function validate(v: TradeFormValues): ValidationErrors | null {
  const errors: ValidationErrors = {};
  if (!v.pair.trim()) errors.pair = "Pair is required";

  const entry = Number(v.entryPrice), stop = Number(v.stopLoss);
  const tp = Number(v.takeProfit), exit = Number(v.exitPrice);

  if (!v.entryPrice || isNaN(entry) || entry <= 0) errors.entryPrice = "Valid entry price required";
  if (!v.stopLoss   || isNaN(stop)  || stop  <= 0) errors.stopLoss   = "Valid stop loss required";
  if (!v.takeProfit || isNaN(tp)    || tp    <= 0) errors.takeProfit = "Valid take profit required";
  if (!v.exitPrice  || isNaN(exit)  || exit  <= 0) errors.exitPrice  = "Valid exit price required";

  if (!errors.entryPrice && !errors.stopLoss) {
    if (v.direction === "LONG"  && stop >= entry) errors.stopLoss = "Stop loss must be below entry for LONG";
    if (v.direction === "SHORT" && stop <= entry) errors.stopLoss = "Stop loss must be above entry for SHORT";
  }
  if (!errors.entryPrice && !errors.takeProfit) {
    if (v.direction === "LONG"  && tp <= entry) errors.takeProfit = "Take profit must be above entry for LONG";
    if (v.direction === "SHORT" && tp >= entry) errors.takeProfit = "Take profit must be below entry for SHORT";
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

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
        notes: values.notes.trim() || null,
        tradedAt: values.tradedAt ? new Date(values.tradedAt) : new Date(),
      });
      return { ok: true, data: trade };
    } catch {
      return { ok: false, error: "Failed to save trade. Please try again." };
    }
  },

  async update(userId: string, id: number, values: TradeFormValues): Promise<Result<Trade>> {
    const existing = await tradeRepository.findById(id, userId);
    if (!existing) return { ok: false, error: "Trade not found." };
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
        notes: values.notes.trim() || null,
        tradedAt: values.tradedAt ? new Date(values.tradedAt) : new Date(existing.tradedAt),
      });
      return { ok: true, data: trade };
    } catch {
      return { ok: false, error: "Failed to update trade." };
    }
  },

  async delete(userId: string, id: number): Promise<Result<void>> {
    const existing = await tradeRepository.findById(id, userId);
    if (!existing) return { ok: false, error: "Trade not found." };
    try {
      await tradeRepository.delete(id, userId);
      return { ok: true, data: undefined };
    } catch {
      return { ok: false, error: "Failed to delete trade." };
    }
  },

  async getAll(userId: string): Promise<Trade[]> {
    return tradeRepository.findAllByUser(userId);
  },

  async getPage(userId: string, page: number): Promise<{ trades: Trade[]; total: number }> {
    return tradeRepository.findPage(userId, page, 25);
  },

  computeMetrics(trades: Trade[]): TradeMetrics {
    if (trades.length === 0)
      return { totalTrades: 0, winRate: 0, avgR: 0, totalR: 0, expectancy: 0 };

    const wins   = trades.filter(t => t.won);
    const losses = trades.filter(t => !t.won);
    const totalR = trades.reduce((s, t) => s + t.rMultiple, 0);
    const winRate = (wins.length / trades.length) * 100;
    const avgWinR  = wins.length   ? wins.reduce((s,t)   => s + t.rMultiple, 0) / wins.length   : 0;
    const avgLossR = losses.length ? losses.reduce((s,t) => s + Math.abs(t.rMultiple), 0) / losses.length : 0;
    const expectancy = (winRate / 100) * avgWinR - (1 - winRate / 100) * avgLossR;

    return {
      totalTrades: trades.length,
      winRate:    Math.round(winRate * 10) / 10,
      avgR:       Math.round((totalR / trades.length) * 100) / 100,
      totalR:     Math.round(totalR * 100) / 100,
      expectancy: Math.round(expectancy * 100) / 100,
    };
  },
};