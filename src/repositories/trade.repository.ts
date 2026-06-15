
import { Prisma } from "@prisma/client";
import type { AnalyticsFilters, Trade, TradeMetrics } from "@/types";
import { db } from "@/lib/db";


export interface CreateTradeRow {
  userId:     string;
  pair:       string;
  direction:  "LONG" | "SHORT";
  entryPrice: number;
  stopLoss: number;
  screenshotUrl: string | null;
  takeProfit: number;
  exitPrice:  number;
  rMultiple:  number;
  won:        boolean;
  notes:      string | null;
  tradedAt:   Date;
}

export interface UpdateTradeRow {
  pair?:       string;
  direction?:  "LONG" | "SHORT";
  entryPrice?: number;
  stopLoss?:   number;
  takeProfit?: number;
  screenshotUrl: string | null;
  exitPrice?:  number;
  rMultiple?:  number;
  won?:        boolean;
  notes?:      string | null;
  tradedAt?:   Date;
}

interface ImportCheckRow {
  pair:       string;
  direction:  string;
  entryPrice: number;
  exitPrice:  number;
  tradedAt:   string; // ISO string
}


function toTrade(row: Prisma.TradeGetPayload<object>): Trade {
  return {
    id:         row.id,
    userId:     row.userId,
    pair:       row.pair,
    direction: row.direction as Trade["direction"],
    screenshotUrl: row.screenshotUrl,
    entryPrice: Number(row.entryPrice),
    stopLoss:   Number(row.stopLoss),
    takeProfit: Number(row.takeProfit),
    exitPrice:  Number(row.exitPrice),
    rMultiple:  Number(row.rMultiple),
    won:        row.won,
    notes:      row.notes,
    tradedAt:   row.tradedAt.toISOString(),
    createdAt:  row.createdAt.toISOString(),
  };
}


export const tradeRepository = {
  async findById(id: string, userId: string): Promise<Trade | null> {
    const row = await db.trade.findFirst({ where: { id, userId } });
    return row ? toTrade(row) : null;
  },

  async findAllByUser(userId: string): Promise<Trade[]> {
    const rows = await db.trade.findMany({
      where:   { userId },
      orderBy: { tradedAt: "desc" },
    });
    return rows.map(toTrade);
  },

  /** Paginated list — page is 1-based, optional column filters */
  async findPage(
    userId:  string,
    page:    number,
    perPage: number = 25,
    filters?: {
      pair?:      string;
      direction?: "LONG" | "SHORT";
      won?:       boolean;
    },
  ): Promise<{ trades: Trade[]; total: number }> {
    const where = {
      userId,
      ...(filters?.pair      && { pair:      { contains: filters.pair.toUpperCase() } }),
      ...(filters?.direction && { direction: filters.direction }),
      ...(filters?.won !== undefined && { won: filters.won }),
    };
    const [rows, total] = await db.$transaction([
      db.trade.findMany({
        where,
        orderBy: { tradedAt: "desc" },
        skip:    (page - 1) * perPage,
        take:    perPage,
      }),
      db.trade.count({ where }),
    ]);
    return { trades: rows.map(toTrade), total };
  },

  /** Recent N trades, ordered newest-first */
  async findRecent(userId: string, limit: number): Promise<Trade[]> {
    const rows = await db.trade.findMany({
      where:   { userId },
      orderBy: { tradedAt: "desc" },
      take:    limit,
    });
    return rows.map(toTrade);
  },

  /** All rMultiple values only, newest-first — for sparkline charts */
  async findAllRMultiples(userId: string): Promise<number[]> {
    const rows = await db.trade.findMany({
      where:   { userId },
      select:  { rMultiple: true },
      orderBy: { tradedAt: "desc" },
    });
    return rows.map(r => Number(r.rMultiple));
  },

  /** Distinct pairs traded by user, sorted alphabetically */
  async findDistinctPairs(userId: string): Promise<string[]> {
    const rows = await db.trade.findMany({
      where:   { userId },
      select:  { pair: true },
      distinct: ["pair"],
      orderBy: { pair: "asc" },
    });
    return rows.map(r => r.pair);
  },

  /** Aggregate metrics from the DB — avoids full in-memory table scan */
  async computeMetrics(userId: string): Promise<TradeMetrics> {
    const [total, wins, losses] = await db.$transaction([
      db.trade.aggregate({
        where: { userId },
        _count: { _all: true },
        _sum:   { rMultiple: true },
        _avg:   { rMultiple: true },
      }),
      db.trade.aggregate({
        where: { userId, won: true },
        _count: { _all: true },
        _avg:   { rMultiple: true },
      }),
      db.trade.aggregate({
        where: { userId, won: false },
        _count: { _all: true },
        _avg:   { rMultiple: true },
      }),
    ]);

    const totalTrades = total._count._all;
    if (totalTrades === 0) {
      return { totalTrades: 0, winRate: 0, avgR: 0, totalR: 0, expectancy: 0 };
    }

    const winRate  = (wins._count._all / totalTrades) * 100;
    const avgWinR  = Number(wins._avg.rMultiple  ?? 0);
    const avgLossR = Math.abs(Number(losses._avg.rMultiple ?? 0));
    const expectancy = (winRate / 100) * avgWinR - (1 - winRate / 100) * avgLossR;

    return {
      totalTrades,
      winRate:    Math.round(winRate * 10) / 10,
      avgR:       Math.round(Number(total._avg.rMultiple ?? 0) * 100) / 100,
      totalR:     Math.round(Number(total._sum.rMultiple ?? 0) * 100) / 100,
      expectancy: Math.round(expectancy * 100) / 100,
    };
  },

  /** Lightweight fetch for import deduplication — selected fields only */
  async findInDateRange(
    userId:  string,
    minDate: Date,
    maxDate: Date,
  ): Promise<ImportCheckRow[]> {
    const rows = await db.trade.findMany({
      where:  { userId, tradedAt: { gte: minDate, lte: maxDate } },
      select: { pair: true, direction: true, entryPrice: true, exitPrice: true, tradedAt: true },
    });
    return rows.map(r => ({
      pair:       r.pair,
      direction:  r.direction,
      entryPrice: Number(r.entryPrice),
      exitPrice:  Number(r.exitPrice),
      tradedAt:   r.tradedAt.toISOString(),
    }));
  },

  async count(userId: string): Promise<number> {
    return db.trade.count({ where: { userId } });
  },

  async create(input: CreateTradeRow): Promise<Trade> {
    const row = await db.trade.create({ data: input });
    return toTrade(row);
  },

  async bulkCreate(rows: CreateTradeRow[]): Promise<void> {
    await db.trade.createMany({ data: rows, skipDuplicates: false });
  },

  async update(id: string, userId: string, input: UpdateTradeRow): Promise<Trade> {
    const row = await db.trade.update({
      where: { id, userId },
      data:  input,
    });
    return toTrade(row);
  },

  /** Returns true if a record was deleted, false if it didn't exist */
  async delete(id: string, userId: string): Promise<boolean> {
    const { count } = await db.trade.deleteMany({ where: { id, userId } });
    return count > 0;
  },

  async findFiltered(userId: string, filters: AnalyticsFilters): Promise<Trade[]> {
    const now   = new Date();
    const since: Date | undefined = filters.dateRange === "all" ? undefined : {
      "30d":  new Date(now.getTime() - 30  * 24 * 60 * 60 * 1000),
      "90d":  new Date(now.getTime() - 90  * 24 * 60 * 60 * 1000),
      "6mo":  new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      "1yr":  new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
    }[filters.dateRange];

    const rows = await db.trade.findMany({
      where: {
        userId,
        // Date filter — only added when not "all"
        ...(since && {
          tradedAt: { gte: since },
        }),
        // Pair filter — only added when specific pairs are selected
        ...(filters.pairs.length > 0 && {
          pair: { in: filters.pairs },
        }),
        // Direction filter — only added when not "ALL"
        ...(filters.direction !== "ALL" && {
          direction: filters.direction,
        }),
      },
      orderBy: { tradedAt: "asc" }, // asc for equity curve — chronological order matters
    });

    return rows.map(toTrade);
  },
};
