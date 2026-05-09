
import type { Prisma } from "@prisma/client";
import type { AnalyticsFilters, Trade } from "@/types";
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
  async findById(id: number, userId: string): Promise<Trade | null> {
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

  /** Paginated list — page is 1-based */
  async findPage(userId: string, page: number, perPage = 25): Promise<{
    trades: Trade[];
    total:  number;
  }> {
    const [rows, total] = await db.$transaction([
      db.trade.findMany({
        where:   { userId },
        orderBy: { tradedAt: "desc" },
        skip:    (page - 1) * perPage,
        take:    perPage,
      }),
      db.trade.count({ where: { userId } }),
    ]);
    return { trades: rows.map(toTrade), total };
  },

  async create(input: CreateTradeRow): Promise<Trade> {
    const row = await db.trade.create({ data: input });
    return toTrade(row);
  },

  async update(id: number, userId: string, input: UpdateTradeRow): Promise<Trade> {
    const row = await db.trade.update({
      where: { id, userId },
      data:  input,
    });
    return toTrade(row);
  },

  async delete(id: number, userId: string): Promise<void> {
    await db.trade.deleteMany({ where: { id, userId } });
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