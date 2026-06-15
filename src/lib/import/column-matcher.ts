export type AppField =
  | "pair" | "direction" | "entryPrice" | "stopLoss"
  | "takeProfit" | "exitPrice" | "tradedAt" | "notes" | "skip";

export interface FieldMeta {
  label:       string;
  description: string;
  required:    boolean;
}

export const FIELD_META: Record<AppField, FieldMeta> = {
  pair:        { label: "Pair",         description: "Trading instrument (e.g. EURUSD)",  required: true  },
  direction:   { label: "Direction",    description: "LONG or SHORT / BUY or SELL",       required: true  },
  entryPrice:  { label: "Entry Price",  description: "Price where trade was opened",      required: true  },
  stopLoss:    { label: "Stop Loss",    description: "Stop loss price level",             required: false },
  takeProfit:  { label: "Take Profit",  description: "Take profit price level",           required: false },
  exitPrice:   { label: "Exit Price",   description: "Price where trade was closed",      required: true  },
  tradedAt:    { label: "Date / Time",  description: "When the trade was opened",         required: true  },
  notes:       { label: "Notes",        description: "Comments or trade notes",           required: false },
  skip:        { label: "Skip",         description: "Ignore this column",                required: false },
};

const SYNONYMS: Array<{ patterns: string[]; field: AppField }> = [
  {
    field: "pair",
    patterns: [
      "symbol", "pair", "instrument", "ticker", "market", "currency pair",
      "asset", "product", "contract", "security", "forex pair", "ccy pair",
    ],
  },
  {
    field: "direction",
    patterns: [
      "type", "direction", "side", "action", "trade type", "order type",
      "buy/sell", "buysell", "long/short", "longshort", "position",
      "position type", "trade direction",
    ],
  },
  {
    field: "entryPrice",
    patterns: [
      "open price", "entry price", "entry", "open", "open rate",
      "entry rate", "opening price", "price open", "fill price",
      "executed price", "avg price", "average price", "buy price", "price",
    ],
  },
  {
    field: "stopLoss",
    patterns: [
      "s/l", "sl", "stop loss", "stop", "stoploss", "stop price",
      "stop level", "stop loss price", "sl price",
    ],
  },
  {
    field: "takeProfit",
    patterns: [
      "t/p", "tp", "take profit", "takeprofit", "target", "target price",
      "tp price", "profit target", "take profit price",
    ],
  },
  {
    field: "exitPrice",
    patterns: [
      "close price", "exit price", "exit", "close", "close rate",
      "closing price", "price close", "exit rate", "sell price", "exit value",
    ],
  },
  {
    field: "tradedAt",
    patterns: [
      "open time", "date", "time", "date/time", "datetime", "timestamp",
      "trade date", "open date", "entry date", "entry time",
      "opened at", "trade time", "close time", "closed at",
    ],
  },
  {
    field: "notes",
    patterns: [
      "comment", "comments", "note", "notes", "description", "memo",
      "remarks", "annotation", "label", "tag", "tags",
    ],
  },
];

function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function scoreHeader(header: string, patterns: string[]): number {
  const h = normalise(header);
  for (const p of patterns) {
    const n = normalise(p);
    if (h === n)       return 1.0;
    if (h.includes(n)) return 0.85;
    if (n.includes(h)) return 0.75;
  }
  return 0;
}

export function autoMatchColumns(headers: string[]): Record<string, AppField> {
  const mapping: Record<string, AppField> = {};
  const usedFields = new Set<AppField>();

  for (const header of headers) {
    let bestField: AppField = "skip";
    let bestScore = 0;

    for (const { field, patterns } of SYNONYMS) {
      const isExclusive = field !== "skip" && field !== "notes";
      if (isExclusive && usedFields.has(field)) continue;
      const score = scoreHeader(header, patterns);
      if (score > bestScore) { bestScore = score; bestField = field; }
    }

    if (bestScore >= 0.75) {
      mapping[header] = bestField;
      if (bestField !== "skip") usedFields.add(bestField);
    } else {
      mapping[header] = "skip";
    }
  }

  return mapping;
}

export function normaliseDirection(raw: string): "LONG" | "SHORT" | null {
  const v = raw.toLowerCase().trim();
  if (["buy", "long", "b", "l", "1", "true"].includes(v))      return "LONG";
  if (["sell", "short", "s", "sh", "-1", "false"].includes(v)) return "SHORT";
  return null;
}

// ── Robust date parser ─────────────────────────────────────────────────────────
//
// Handles every common broker/spreadsheet date format:
//
//  ISO 8601          2024-01-08T09:15:00        2024-01-08T09:15:00.000Z
//  ISO date only     2024-01-08
//  MT4/MT5           2024.01.08 09:15:00        2024.01.08
//  Dot-separated     08.01.2024 09:15           08.01.2024
//  EU slash          08/01/2024 09:15:00        08/01/2024
//  US slash          01/08/2024 09:15:00        01/08/2024
//  Long form         January 8, 2024            Jan 8 2024
//  Excel serial      45299                      (days since 1899-12-30)
//  Unix timestamp    1704704100                 (10-digit seconds)
//  Unix ms           1704704100000              (13-digit milliseconds)
//
// Returns null if the string cannot be parsed.

interface ParsedDate {
  date:   Date;
  format: string;  // human-readable description of what was detected
}

// Excel serial date → JS Date (Excel epoch is Dec 30, 1899)
function fromExcelSerial(n: number): Date {
  const MS_PER_DAY = 86400000;
  const EXCEL_EPOCH = new Date(1899, 11, 30).getTime();
  // Excel incorrectly treats 1900 as a leap year, so we subtract 1 for dates after Feb 28, 1900
  const adjusted = n > 59 ? n - 1 : n;
  return new Date(EXCEL_EPOCH + adjusted * MS_PER_DAY);
}

// Parse a time string "HH:MM" or "HH:MM:SS" → { h, m, s }
function parseTime(t: string): { h: number; m: number; s: number } | null {
  const parts = t.split(":").map(Number);
  if (parts.length < 2 || parts.some(isNaN)) return null;
  return { h: parts[0], m: parts[1], s: parts[2] ?? 0 };
}

export function parseDate(raw: string): ParsedDate | null {
  const s = raw.trim();
  if (!s) return null;

  // ── 1. Unix timestamp (10-digit = seconds, 13-digit = milliseconds) ─────────
  if (/^\d{10}$/.test(s)) {
    return { date: new Date(parseInt(s) * 1000), format: "Unix timestamp (seconds)" };
  }
  if (/^\d{13}$/.test(s)) {
    return { date: new Date(parseInt(s)), format: "Unix timestamp (milliseconds)" };
  }

  // ── 2. Excel serial number (e.g. 45299) ─────────────────────────────────────
  if (/^\d{4,6}$/.test(s)) {
    const n = parseInt(s);
    // Excel serials plausibly range from ~35000 (1995) to ~55000 (2050)
    if (n >= 35000 && n <= 60000) {
      return { date: fromExcelSerial(n), format: "Excel serial number" };
    }
  }

  // ── 3. ISO 8601: 2024-01-08 or 2024-01-08T09:15:00 ─────────────────────────
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return { date: d, format: "ISO 8601" };
  }

  // ── 4. MT4/MT5 dot-separated: 2024.01.08 09:15:00 or 2024.01.08 ─────────────
  const mt4 = s.match(/^(\d{4})\.(\d{2})\.(\d{2})(?:\s+(\d{2}:\d{2}(?::\d{2})?))?$/);
  if (mt4) {
    const [, yr, mo, dy, time] = mt4;
    const t = time ? parseTime(time) : null;
    const d = new Date(
      parseInt(yr), parseInt(mo) - 1, parseInt(dy),
      t?.h ?? 0, t?.m ?? 0, t?.s ?? 0,
    );
    if (!isNaN(d.getTime())) return { date: d, format: "MT4/MT5 (YYYY.MM.DD)" };
  }

  // ── 5. EU dot-separated: 08.01.2024 09:15:00 or 08.01.2024 ──────────────────
  // Ambiguity: if first part > 12, it must be day. If ≤ 12, assume DD.MM.YYYY (EU).
  const euDot = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{2}:\d{2}(?::\d{2})?))?$/);
  if (euDot) {
    const [, a, b, yr, time] = euDot;
    const t = time ? parseTime(time) : null;
    const d = new Date(
      parseInt(yr), parseInt(b) - 1, parseInt(a),
      t?.h ?? 0, t?.m ?? 0, t?.s ?? 0,
    );
    if (!isNaN(d.getTime())) return { date: d, format: "EU (DD.MM.YYYY)" };
  }

  // ── 6. Slash-separated: detect DD/MM/YYYY vs MM/DD/YYYY ─────────────────────
  const slash = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[\s,T]+(\d{2}:\d{2}(?::\d{2})?))?$/);
  if (slash) {
    const [, a, b, yr, time] = slash;
    const aNum = parseInt(a), bNum = parseInt(b), yrNum = parseInt(yr);
    const t = time ? parseTime(time) : null;
    const hh = t?.h ?? 0, mm = t?.m ?? 0, ss = t?.s ?? 0;

    // If first part > 12 it must be the day → DD/MM/YYYY
    if (aNum > 12) {
      const d = new Date(yrNum, bNum - 1, aNum, hh, mm, ss);
      if (!isNaN(d.getTime())) return { date: d, format: "EU (DD/MM/YYYY)" };
    }
    // If second part > 12 it must be the day → MM/DD/YYYY
    if (bNum > 12) {
      const d = new Date(yrNum, aNum - 1, bNum, hh, mm, ss);
      if (!isNaN(d.getTime())) return { date: d, format: "US (MM/DD/YYYY)" };
    }
    // Ambiguous — try both, prefer DD/MM/YYYY (more common internationally)
    // We'll return a result but flag it as ambiguous in the format description
    const dEU = new Date(yrNum, bNum - 1, aNum, hh, mm, ss);
    if (!isNaN(dEU.getTime())) return { date: dEU, format: "DD/MM/YYYY (ambiguous — assumed EU)" };
  }

  // ── 7. Year-last slash: MM/DD/YY (2-digit year) ──────────────────────────────
  const shortYear = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})(?:\s+(\d{2}:\d{2}(?::\d{2})?))?$/);
  if (shortYear) {
    const [, mo, dy, yr2, time] = shortYear;
    const t = time ? parseTime(time) : null;
    const fullYear = parseInt(yr2) >= 50 ? 1900 + parseInt(yr2) : 2000 + parseInt(yr2);
    const d = new Date(fullYear, parseInt(mo) - 1, parseInt(dy), t?.h ?? 0, t?.m ?? 0, t?.s ?? 0);
    if (!isNaN(d.getTime())) return { date: d, format: "MM/DD/YY (2-digit year)" };
  }

  const dashDay = s.match(/^(\d{1,2})-([A-Za-z]{3}|\d{1,2})-(\d{4})(?:\s+(\d{2}:\d{2}(?::\d{2})?))?$/);
  if (dashDay) {
    const [, dy, mo, yr, time] = dashDay;
    const t = time ? parseTime(time) : null;
    const d = new Date(`${mo} ${dy} ${yr} ${time ?? "00:00:00"}`);
    if (!isNaN(d.getTime())) return { date: d, format: "DD-Mon-YYYY" };
    const d2 = new Date(parseInt(yr), parseInt(mo) - 1, parseInt(dy), t?.h ?? 0, t?.m ?? 0, t?.s ?? 0);
    if (!isNaN(d2.getTime())) return { date: d2, format: "DD-MM-YYYY" };
  }

  const natural = new Date(s);
  if (!isNaN(natural.getTime())) {
    return { date: natural, format: "Natural language" };
  }

  const spaceMon = s.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})(?:\s+(\d{2}:\d{2}(?::\d{2})?))?$/);
  if (spaceMon) {
    const [, dy, mo, yr, time] = spaceMon;
    const d = new Date(`${mo} ${dy} ${yr} ${time ?? "00:00:00"}`);
    if (!isNaN(d.getTime())) return { date: d, format: "DD Mon YYYY" };
  }

  return null;
}
export interface MappedRow {
  pair:        string;
  direction:   "LONG" | "SHORT";
  entryPrice:  number;
  stopLoss:    number | null;
  takeProfit:  number | null;
  exitPrice:   number;
  tradedAt:    string; 
  notes:       string;
  _errors:     string[];
  _warnings:   string[];
  _raw:        Record<string, string>;
}

export function mapRow(
  raw: Record<string, string>,
  mapping: Record<string, AppField>,
): MappedRow {
  const byField: Partial<Record<AppField, string>> = {};
  for (const [col, field] of Object.entries(mapping)) {
    if (field !== "skip" && raw[col] !== undefined) {
      byField[field] = raw[col];
    }
  }

  const errors:   string[] = [];
  const warnings: string[] = [];

  const pair = (byField.pair ?? "").trim().toUpperCase();
  if (!pair) errors.push("Missing pair");

  const rawDir   = byField.direction ?? "";
  const direction = normaliseDirection(rawDir);
  if (!direction) errors.push(`Unrecognised direction: "${rawDir}"`);

  const entryPrice = parseFloat((byField.entryPrice ?? "").replace(/,/g, ""));
  if (isNaN(entryPrice) || entryPrice <= 0) errors.push("Invalid entry price");

  const exitPrice = parseFloat((byField.exitPrice ?? "").replace(/,/g, ""));
  if (isNaN(exitPrice) || exitPrice <= 0) errors.push("Invalid exit price");

  const rawSL  = (byField.stopLoss   ?? "").replace(/,/g, "");
  const rawTP  = (byField.takeProfit ?? "").replace(/,/g, "");
  const stopLoss   = rawSL  ? parseFloat(rawSL)  : null;
  const takeProfit = rawTP  ? parseFloat(rawTP)  : null;

  let tradedAt = "";
  const rawDate = (byField.tradedAt ?? "").trim();
  if (!rawDate) {
    errors.push("Missing date");
  } else {
    const parsed = parseDate(rawDate);
    if (!parsed) {
      errors.push(`Unrecognised date format: "${rawDate}"`);
    } else {
      if (parsed.date > new Date()) {
        errors.push("Trade date is in the future");
      } else {
        tradedAt = parsed.date.toISOString();
        // Warn on ambiguous formats so user can verify
        if (parsed.format.includes("ambiguous")) {
          warnings.push(`Date "${rawDate}" is ambiguous — interpreted as ${parsed.format}. Check dates are correct.`);
        }
        if (parsed.format === "Excel serial number") {
          warnings.push(`Date "${rawDate}" was treated as an Excel serial number → ${parsed.date.toLocaleDateString()}. Verify this is correct.`);
        }
      }
    }
  }

  // Stop loss direction sanity check
  if (!errors.length && direction && stopLoss !== null && !isNaN(stopLoss)) {
    if (direction === "LONG"  && stopLoss >= entryPrice) errors.push("Stop loss must be below entry for LONG");
    if (direction === "SHORT" && stopLoss <= entryPrice) errors.push("Stop loss must be above entry for SHORT");
  }

  return {
    pair,
    direction:  direction ?? "LONG",
    entryPrice: isNaN(entryPrice) ? 0 : entryPrice,
    stopLoss:   stopLoss   !== null && !isNaN(stopLoss)   ? stopLoss   : null,
    takeProfit: takeProfit !== null && !isNaN(takeProfit) ? takeProfit : null,
    exitPrice:  isNaN(exitPrice) ? 0 : exitPrice,
    tradedAt,
    notes:      (byField.notes ?? "").trim(),
    _errors:    errors,
    _warnings:  warnings,
    _raw:       raw,
  };
}