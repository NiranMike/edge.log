// prisma/seed.ts
// Run with: npx prisma db seed
//
// Creates a demo user + 3 months of realistic trade history.
// Designed to show meaningful patterns in analytics:
//   - XAUUSD and EURUSD perform well, GBPUSD is a weak spot
//   - London session outperforms New York
//   - Fridays are the worst day
//   - Positive equity curve with one notable drawdown period

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcR(direction: "LONG" | "SHORT", entry: number, stop: number, exit: number) {
  const risk = Math.abs(entry - stop);
  if (risk === 0) return 0;
  const pnl = direction === "LONG" ? exit - entry : entry - exit;
  return Math.round((pnl / risk) * 10000) / 10000;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function setHour(date: Date, hour: number): Date {
  const d = new Date(date);
  d.setUTCHours(hour, 30, 0, 0);
  return d;
}

// ─── Raw trade definitions ────────────────────────────────────────────────────
// daysAgo: days before today
// hour: UTC hour (determines session)
// exitMultiple: how many risk units the exit is from entry (positive = profit)

interface TradeDef {
  daysAgo:      number;
  pair:         string;
  direction:    "LONG" | "SHORT";
  entry:        number;
  stopPips:     number;   // distance from entry to stop in price units
  tpMultiple:   number;   // TP = entry ± (stopPips * tpMultiple)
  exitMultiple: number;   // exit = entry ± (stopPips * exitMultiple)
  hour:         number;   // UTC hour for session classification
  notes?:       string;
}

const TRADES: TradeDef[] = [
  // ── Week 1 — solid start ──────────────────────────────────────────────────
  { daysAgo: 90, pair: "EURUSD",  direction: "LONG",  entry: 1.08450, stopPips: 0.0020, tpMultiple: 2.0, exitMultiple:  2.1,  hour: 9,  notes: "Clean break above morning consolidation. Held through pullback — stayed in." },
  { daysAgo: 89, pair: "XAUUSD",  direction: "LONG",  entry: 2015.00, stopPips: 8.00,   tpMultiple: 2.5, exitMultiple:  2.5,  hour: 8,  notes: "DXY weakness, gold momentum strong. Full TP." },
  { daysAgo: 88, pair: "GBPUSD",  direction: "SHORT", entry: 1.26800, stopPips: 0.0025, tpMultiple: 1.5, exitMultiple: -0.5,  hour: 10, notes: "Stopped out. Structure held and I was wrong about the direction." },
  { daysAgo: 87, pair: "USDJPY",  direction: "LONG",  entry: 149.200, stopPips: 0.250,  tpMultiple: 2.0, exitMultiple:  1.0,  hour: 14, notes: "Partial close at 1R. Moved stop to BE. Got stopped at breakeven." },
  { daysAgo: 85, pair: "EURUSD",  direction: "SHORT", entry: 1.08900, stopPips: 0.0018, tpMultiple: 2.0, exitMultiple:  2.0,  hour: 8,  notes: "London open short. Textbook setup." },

  // ── Week 2 — drawdown period ──────────────────────────────────────────────
  { daysAgo: 83, pair: "GBPUSD",  direction: "LONG",  entry: 1.26500, stopPips: 0.0030, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 9,  notes: "Revenge traded after yesterday. Should not have taken this." },
  { daysAgo: 82, pair: "NAS100",  direction: "LONG",  entry: 17500.0, stopPips: 50.00,  tpMultiple: 2.0, exitMultiple: -1.0,  hour: 14, notes: "News event stopped me out. Knew there was CPI today — why did I enter?" },
  { daysAgo: 81, pair: "GBPUSD",  direction: "SHORT", entry: 1.27200, stopPips: 0.0022, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 15, notes: "Third loss in a row. Taking tomorrow off." },
  { daysAgo: 79, pair: "XAUUSD",  direction: "SHORT", entry: 2028.00, stopPips: 10.00,  tpMultiple: 2.0, exitMultiple: -0.8,  hour: 8,  notes: "Back after a day off. Got the direction wrong — gold still in uptrend." },

  // ── Week 3 — recovery ─────────────────────────────────────────────────────
  { daysAgo: 77, pair: "EURUSD",  direction: "LONG",  entry: 1.08200, stopPips: 0.0020, tpMultiple: 2.5, exitMultiple:  2.5,  hour: 8,  notes: "Patient. Waited for the London pullback entry. Clean." },
  { daysAgo: 76, pair: "XAUUSD",  direction: "LONG",  entry: 2022.00, stopPips: 7.00,   tpMultiple: 3.0, exitMultiple:  3.1,  hour: 9,  notes: "Held overnight against my rules but the setup was genuinely strong." },
  { daysAgo: 75, pair: "USDJPY",  direction: "SHORT", entry: 149.800, stopPips: 0.200,  tpMultiple: 2.0, exitMultiple:  0.0,  hour: 13, notes: "Breakeven. NY session chop — should have stayed out." },
  { daysAgo: 74, pair: "AUDUSD",  direction: "LONG",  entry: 0.65800, stopPips: 0.0015, tpMultiple: 2.0, exitMultiple:  1.8,  hour: 8,  notes: "Took partial at 1.5R and rest hit TP. Happy with the management." },
  { daysAgo: 72, pair: "EURUSD",  direction: "SHORT", entry: 1.09100, stopPips: 0.0022, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 15, notes: "Friday trade. Always worse on Fridays. Stop taking trades on Friday afternoons." },

  // ── Week 4 ────────────────────────────────────────────────────────────────
  { daysAgo: 70, pair: "XAUUSD",  direction: "LONG",  entry: 2035.00, stopPips: 9.00,   tpMultiple: 2.0, exitMultiple:  2.0,  hour: 8,  notes: "Monday London open. Gold still trending." },
  { daysAgo: 69, pair: "NAS100",  direction: "SHORT", entry: 17800.0, stopPips: 60.00,  tpMultiple: 2.0, exitMultiple:  1.5,  hour: 14, notes: "Partial close. Decent trade." },
  { daysAgo: 68, pair: "GBPUSD",  direction: "LONG",  entry: 1.27500, stopPips: 0.0025, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 9,  notes: "GBP keeps stopping me out. Reducing size on cable until I figure it out." },
  { daysAgo: 67, pair: "EURUSD",  direction: "LONG",  entry: 1.08600, stopPips: 0.0018, tpMultiple: 2.0, exitMultiple:  2.2,  hour: 8,  notes: "Euro gaining strength vs DXY." },
  { daysAgo: 65, pair: "XAUUSD",  direction: "SHORT", entry: 2041.00, stopPips: 8.00,   tpMultiple: 2.5, exitMultiple: -1.0,  hour: 10, notes: "Counter-trend trade. Paid the price." },

  // ── Week 5–6 — consistent ─────────────────────────────────────────────────
  { daysAgo: 63, pair: "EURUSD",  direction: "SHORT", entry: 1.09400, stopPips: 0.0020, tpMultiple: 2.0, exitMultiple:  2.0,  hour: 8 },
  { daysAgo: 62, pair: "XAUUSD",  direction: "LONG",  entry: 2038.00, stopPips: 10.00,  tpMultiple: 3.0, exitMultiple:  3.0,  hour: 7,  notes: "Pre-London breakout. Size was right. Held the full trade." },
  { daysAgo: 61, pair: "USDJPY",  direction: "LONG",  entry: 150.100, stopPips: 0.300,  tpMultiple: 1.5, exitMultiple:  0.0,  hour: 2,  notes: "Asia session. Breakeven — expected more from this setup." },
  { daysAgo: 60, pair: "AUDUSD",  direction: "SHORT", entry: 0.65500, stopPips: 0.0018, tpMultiple: 2.0, exitMultiple: -0.5,  hour: 3 },
  { daysAgo: 58, pair: "EURUSD",  direction: "LONG",  entry: 1.08300, stopPips: 0.0022, tpMultiple: 2.0, exitMultiple:  1.9,  hour: 9 },
  { daysAgo: 57, pair: "XAUUSD",  direction: "LONG",  entry: 2045.00, stopPips: 8.00,   tpMultiple: 2.5, exitMultiple:  2.5,  hour: 8,  notes: "Another clean London setup on gold. This is my best pair." },
  { daysAgo: 56, pair: "NAS100",  direction: "LONG",  entry: 18100.0, stopPips: 55.00,  tpMultiple: 2.0, exitMultiple: -1.0,  hour: 14, notes: "Tech selloff came out of nowhere." },
  { daysAgo: 54, pair: "GBPUSD",  direction: "SHORT", entry: 1.27800, stopPips: 0.0028, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 15, notes: "Friday again. Why." },

  // ── Week 7–8 ──────────────────────────────────────────────────────────────
  { daysAgo: 52, pair: "EURUSD",  direction: "SHORT", entry: 1.09200, stopPips: 0.0019, tpMultiple: 2.0, exitMultiple:  2.1,  hour: 8 },
  { daysAgo: 51, pair: "XAUUSD",  direction: "LONG",  entry: 2052.00, stopPips: 9.00,   tpMultiple: 2.0, exitMultiple:  2.0,  hour: 9,  notes: "Consistent gold setup. Process is working." },
  { daysAgo: 50, pair: "USDJPY",  direction: "SHORT", entry: 150.500, stopPips: 0.250,  tpMultiple: 2.0, exitMultiple:  0.5,  hour: 8 },
  { daysAgo: 49, pair: "AUDUSD",  direction: "LONG",  entry: 0.66100, stopPips: 0.0016, tpMultiple: 2.5, exitMultiple:  2.5,  hour: 8,  notes: "RBA minutes dovish — AUD caught a bid." },
  { daysAgo: 47, pair: "EURUSD",  direction: "LONG",  entry: 1.08700, stopPips: 0.0021, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 14, notes: "NY reversal. Took the loss clean." },
  { daysAgo: 46, pair: "XAUUSD",  direction: "SHORT", entry: 2060.00, stopPips: 10.00,  tpMultiple: 2.0, exitMultiple: -1.0,  hour: 9,  notes: "Tried to short the trend again. Lesson not yet learned." },
  { daysAgo: 45, pair: "NAS100",  direction: "LONG",  entry: 18300.0, stopPips: 60.00,  tpMultiple: 2.5, exitMultiple:  2.5,  hour: 14 },
  { daysAgo: 43, pair: "GBPUSD",  direction: "LONG",  entry: 1.27200, stopPips: 0.0024, tpMultiple: 2.0, exitMultiple:  0.0,  hour: 8,  notes: "Breakeven. At least I didn't lose on cable for once." },

  // ── Week 9–10 — strong finish ─────────────────────────────────────────────
  { daysAgo: 41, pair: "EURUSD",  direction: "SHORT", entry: 1.09500, stopPips: 0.0020, tpMultiple: 2.0, exitMultiple:  2.0,  hour: 8 },
  { daysAgo: 40, pair: "XAUUSD",  direction: "LONG",  entry: 2068.00, stopPips: 8.00,   tpMultiple: 3.0, exitMultiple:  3.2,  hour: 7,  notes: "Best trade of the month. Held for full 3R+" },
  { daysAgo: 39, pair: "USDJPY",  direction: "LONG",  entry: 151.200, stopPips: 0.300,  tpMultiple: 2.0, exitMultiple:  1.8,  hour: 9 },
  { daysAgo: 38, pair: "EURUSD",  direction: "LONG",  entry: 1.08900, stopPips: 0.0019, tpMultiple: 2.0, exitMultiple:  2.1,  hour: 8,  notes: "Second entry on Euro this week. Both worked." },
  { daysAgo: 36, pair: "XAUUSD",  direction: "LONG",  entry: 2075.00, stopPips: 9.00,   tpMultiple: 2.5, exitMultiple:  2.4,  hour: 9 },
  { daysAgo: 35, pair: "GBPUSD",  direction: "SHORT", entry: 1.28100, stopPips: 0.0026, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 10, notes: "Cable still my nemesis." },
  { daysAgo: 34, pair: "AUDUSD",  direction: "SHORT", entry: 0.65800, stopPips: 0.0017, tpMultiple: 2.0, exitMultiple:  1.5,  hour: 8 },
  { daysAgo: 32, pair: "NAS100",  direction: "SHORT", entry: 18500.0, stopPips: 65.00,  tpMultiple: 2.0, exitMultiple:  2.0,  hour: 14, notes: "Distribution pattern. Called it right." },

  // ── Last 4 weeks ──────────────────────────────────────────────────────────
  { daysAgo: 30, pair: "EURUSD",  direction: "SHORT", entry: 1.09800, stopPips: 0.0021, tpMultiple: 2.0, exitMultiple:  2.0,  hour: 8 },
  { daysAgo: 28, pair: "XAUUSD",  direction: "LONG",  entry: 2082.00, stopPips: 10.00,  tpMultiple: 2.5, exitMultiple:  2.5,  hour: 8,  notes: "Gold breaking all-time highs. Momentum trades work." },
  { daysAgo: 27, pair: "USDJPY",  direction: "SHORT", entry: 151.800, stopPips: 0.280,  tpMultiple: 2.0, exitMultiple: -1.0,  hour: 2,  notes: "BOJ intervention risk — should have skipped this." },
  { daysAgo: 26, pair: "EURUSD",  direction: "LONG",  entry: 1.08500, stopPips: 0.0020, tpMultiple: 2.0, exitMultiple:  0.0,  hour: 9 },
  { daysAgo: 25, pair: "GBPUSD",  direction: "LONG",  entry: 1.27900, stopPips: 0.0025, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 10, notes: "Still losing on GBP. Need to just stop trading cable." },
  { daysAgo: 23, pair: "XAUUSD",  direction: "LONG",  entry: 2090.00, stopPips: 8.00,   tpMultiple: 3.0, exitMultiple:  3.0,  hour: 8 },
  { daysAgo: 22, pair: "NAS100",  direction: "LONG",  entry: 18700.0, stopPips: 55.00,  tpMultiple: 2.0, exitMultiple:  1.7,  hour: 13 },
  { daysAgo: 21, pair: "AUDUSD",  direction: "LONG",  entry: 0.66500, stopPips: 0.0016, tpMultiple: 2.5, exitMultiple:  2.5,  hour: 8,  notes: "AUD strength continuing." },
  { daysAgo: 19, pair: "EURUSD",  direction: "SHORT", entry: 1.10100, stopPips: 0.0022, tpMultiple: 2.0, exitMultiple:  2.0,  hour: 8,  notes: "Clean rejection from key level." },
  { daysAgo: 18, pair: "XAUUSD",  direction: "LONG",  entry: 2098.00, stopPips: 9.00,   tpMultiple: 2.0, exitMultiple:  1.9,  hour: 9 },
  { daysAgo: 17, pair: "GBPUSD",  direction: "SHORT", entry: 1.28500, stopPips: 0.0027, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 9,  notes: "I keep taking GBP trades. I need to stop." },
  { daysAgo: 15, pair: "USDJPY",  direction: "LONG",  entry: 152.100, stopPips: 0.300,  tpMultiple: 2.0, exitMultiple:  2.0,  hour: 14 },
  { daysAgo: 14, pair: "EURUSD",  direction: "LONG",  entry: 1.08800, stopPips: 0.0019, tpMultiple: 2.5, exitMultiple:  2.5,  hour: 8,  notes: "Patience paid off. Waited 2 days for this entry." },
  { daysAgo: 12, pair: "XAUUSD",  direction: "SHORT", entry: 2110.00, stopPips: 10.00,  tpMultiple: 2.0, exitMultiple: -0.5,  hour: 10 },
  { daysAgo: 11, pair: "NAS100",  direction: "LONG",  entry: 19000.0, stopPips: 60.00,  tpMultiple: 2.0, exitMultiple:  2.0,  hour: 14 },
  { daysAgo: 10, pair: "AUDUSD",  direction: "SHORT", entry: 0.66200, stopPips: 0.0018, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 3 },
  { daysAgo:  8, pair: "EURUSD",  direction: "SHORT", entry: 1.09900, stopPips: 0.0021, tpMultiple: 2.0, exitMultiple:  2.1,  hour: 8,  notes: "Good week. Staying disciplined." },
  { daysAgo:  7, pair: "XAUUSD",  direction: "LONG",  entry: 2105.00, stopPips: 9.00,   tpMultiple: 2.5, exitMultiple:  2.5,  hour: 8 },
  { daysAgo:  5, pair: "USDJPY",  direction: "SHORT", entry: 152.500, stopPips: 0.280,  tpMultiple: 2.0, exitMultiple:  1.5,  hour: 9 },
  { daysAgo:  4, pair: "EURUSD",  direction: "LONG",  entry: 1.08600, stopPips: 0.0020, tpMultiple: 2.0, exitMultiple: -1.0,  hour: 15, notes: "Friday afternoon trade. Haven't learned yet." },
  { daysAgo:  3, pair: "XAUUSD",  direction: "LONG",  entry: 2112.00, stopPips: 8.00,   tpMultiple: 3.0, exitMultiple:  3.1,  hour: 8,  notes: "Strong close to the week." },
  { daysAgo:  2, pair: "EURUSD",  direction: "SHORT", entry: 1.10200, stopPips: 0.0022, tpMultiple: 2.0, exitMultiple:  2.0,  hour: 9 },
  { daysAgo:  1, pair: "XAUUSD",  direction: "LONG",  entry: 2118.00, stopPips: 9.00,   tpMultiple: 2.0, exitMultiple:  1.8,  hour: 8 },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding demo data...");

  // Clean existing demo data
  const existing = await db.user.findUnique({ where: { email: "demo@edgelog.app" } });
  if (existing) {
    await db.trade.deleteMany({ where: { userId: existing.id } });
    await db.user.delete({ where: { id: existing.id } });
    console.log("   Cleared existing demo user.");
  }

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 10);
  const user = await db.user.create({
    data: {
      email: "demo@edgelog.app",
      name:  "Alex Demo",
      passwordHash: hashedPassword,
    },
  });

  console.log(`   Created demo user: ${user.email}`);

  // Create trades
  const now = new Date();
  let created = 0;

  for (const t of TRADES) {
    const tradedAt  = setHour(addDays(now, -t.daysAgo), t.hour);
    const stopDist  = t.stopPips;
    const stopLoss  = t.direction === "LONG"
      ? t.entry - stopDist
      : t.entry + stopDist;
    const takeProfit = t.direction === "LONG"
      ? t.entry + stopDist * t.tpMultiple
      : t.entry - stopDist * t.tpMultiple;
    const exitPrice  = t.direction === "LONG"
      ? t.entry + stopDist * t.exitMultiple
      : t.entry - stopDist * t.exitMultiple;

    const rMultiple = calcR(t.direction, t.entry, stopLoss, exitPrice);

    await db.trade.create({
      data: {
        userId:     user.id,
        pair:       t.pair,
        direction:  t.direction,
        entryPrice: t.entry,
        stopLoss,
        takeProfit,
        exitPrice,
        rMultiple,
        won:        rMultiple > 0,
        notes:      t.notes ?? null,
        tradedAt,
      },
    });

    created++;
  }

  console.log(`   Created ${created} trades.`);
  console.log("");
  console.log("✅ Demo seed complete.");
  console.log("");
  console.log("   Email:    demo@edgelog.app");
  console.log("   Password: demo1234");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());