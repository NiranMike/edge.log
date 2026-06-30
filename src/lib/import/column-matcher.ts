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
      "position type", "trade direction", "b/s",
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

// Best score across *all* patterns (don't return on the first partial match).
function scoreHeader(header: string, patterns: string[]): number {
  const h = normalise(header);
  if (!h) return 0;
  let best = 0;
  for (const p of patterns) {
    const n = normalise(p);
    let score = 0;
    if (h === n)            score = 1.0;
    else if (h.includes(n)) score = 0.85;
    else if (n.includes(h)) score = 0.75;
    if (score > best) best = score;
    if (best === 1.0) break;
  }
  return best;
}

export function autoMatchColumns(headers: string[]): Record<string, AppField> {
  const mapping: Record<string, AppField> = {};
  const usedFields = new Set<AppField>();

  // Score every (header, field) pair first, then assign greedily by best
  // score so the strongest match wins each exclusive field — regardless of
  // column order in the file.
  const candidates: Array<{ header: string; field: AppField; score: number }> = [];
  for (const header of headers) {
    for (const { field, patterns } of SYNONYMS) {
      const score = scoreHeader(header, patterns);
      if (score >= 0.75) candidates.push({ header, field, score });
    }
  }
  candidates.sort((a, b) => b.score - a.score);

  const assignedHeaders = new Set<string>();
  for (const { header, field, score } of candidates) {
    if (assignedHeaders.has(header)) continue;
    const isExclusive = field !== "notes"; // notes may map from several columns
    if (isExclusive && usedFields.has(field)) continue;
    if (score < 0.75) continue;
    mapping[header] = field;
    assignedHeaders.add(header);
    if (isExclusive) usedFields.add(field);
  }

  for (const header of headers) {
    if (!mapping[header]) mapping[header] = "skip";
  }

  return mapping;
}

export function normaliseDirection(raw: string): "LONG" | "SHORT" | null {
  const v = (raw ?? "").toLowerCase().trim();
  if (!v) return null;

  // Exact encodings first (so "-1" isn't stripped to "1", etc.)
  if (["buy", "long", "b", "l", "1", "true", "bull", "buyer"].includes(v))     return "LONG";
  if (["sell", "short", "s", "sh", "-1", "false", "bear", "seller"].includes(v)) return "SHORT";

  // Phrases like "Buy Limit", "Market Sell", "Long position", "sell_stop"
  const words = v.replace(/[^a-z]+/g, " ").trim();
  if (/\b(buy|long|bull)\b/.test(words))  return "LONG";
  if (/\b(sell|short|bear)\b/.test(words)) return "SHORT";

  return null;
}

// ── Number parser ──────────────────────────────────────────────────────────────
//
// Handles thousands/decimal separators across locales, plus currency symbols:
//   1234.56        →  1234.56
//   1,234.56       →  1234.56   (US thousands)
//   1.234,56       →  1234.56   (EU)
//   1234,56        →  1234.56   (EU, no thousands)
//   1 234,56       →  1234.56   (space thousands)
//   $1,250.00      →  1250
//   1.2345         →  1.2345    (forex)
// Returns null when no finite number can be read.

export function parseNumber(raw: string | number | null | undefined): number | null {
  if (raw == null) return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;

  // Strip everything except digits, separators and a leading sign.
  let s = raw.trim().replace(/[^\d.,-]/g, "");
  if (!s || /^[.,-]+$/.test(s)) return null;

  const hasComma = s.includes(",");
  const hasDot   = s.includes(".");

  if (hasComma && hasDot) {
    // The right-most separator is the decimal point.
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      s = s.replace(/\./g, "").replace(/,/g, ".");   // EU: 1.234,56 → 1234.56
    } else {
      s = s.replace(/,/g, "");                        // US: 1,234.56 → 1234.56
    }
  } else if (hasComma) {
    const parts = s.split(",");
    if (parts.length > 2) {
      s = s.replace(/,/g, "");                        // 1,234,567 → thousands
    } else {
      const intLen = parts[0].replace("-", "").length;
      const decimals = parts[1] ?? "";
      // "1,234" with exactly 3 trailing digits behind a 1–3 digit head is a
      // thousands group (e.g. an index like 38,250). Otherwise it's a decimal.
      if (decimals.length === 3 && intLen >= 1 && intLen <= 3) {
        s = s.replace(/,/g, "");
      } else {
        s = s.replace(/,/g, ".");                     // decimal comma: 1234,56 → 1234.56
      }
    }
  } else if (hasDot) {
    // Multiple dots → European thousands grouping (1.234.567).
    if (s.split(".").length > 2) s = s.replace(/\./g, "");
    // A single dot is a standard decimal point — leave it.
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

// ── Robust date parser ─────────────────────────────────────────────────────────
//
// Handles every common broker/spreadsheet date format and is deterministic
// across browsers (no bare `new Date(string)` for numeric inputs — that varies
// by engine). Naive datetimes (no timezone) are interpreted in local time so a
// trade always lands on the calendar day the user expects.
//
//  ISO 8601          2024-01-08T09:15:00        2024-01-08T09:15:00.000Z
//  ISO date only     2024-01-08
//  MT4/MT5           2024.01.08 09:15:00        2024.01.08
//  Dot-separated     08.01.2024 09:15           08.01.2024
//  Slash             08/01/2024 · 01/08/2024 · 08/01/24
//  Dash              08-01-2024 · 08-Jan-2024
//  Long form         January 8, 2024            8 Jan 2024
//  Excel serial      45299                      (days since 1899-12-30)
//  Unix timestamp    1704704100 (s) · 1704704100000 (ms)

interface ParsedDate {
  date:       Date;
  format:     string;
  ambiguous?: boolean;   // day/month order had to be guessed
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

// Excel serial (days since 1899-12-30) → local-midnight Date for that day.
function fromExcelSerial(n: number): Date {
  const MS_PER_DAY = 86_400_000;
  // Excel's 1900-leap-year bug: subtract a day for serials past 1900-02-28.
  const adjusted = n > 59 ? n - 1 : n;
  const utc = new Date(Date.UTC(1899, 11, 30) + Math.round(adjusted * MS_PER_DAY));
  return new Date(
    utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate(),
    utc.getUTCHours(), utc.getUTCMinutes(), utc.getUTCSeconds(),
  );
}

// Validates ranges; returns {h,m,s} or null. Undefined input → midnight.
function parseTime(t: string | undefined): { h: number; m: number; s: number } | null {
  if (!t) return { h: 0, m: 0, s: 0 };
  const parts = t.split(":").map(p => parseInt(p, 10));
  if (parts.length < 2 || parts.some(Number.isNaN)) return null;
  const [h, m, s = 0] = parts;
  if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return null;
  return { h, m, s };
}

// Builds a local Date and rejects impossible dates that JS would silently roll
// over (e.g. 31 Feb → 2/3 Mar).
function makeLocalDate(y: number, month1: number, d: number, h = 0, mi = 0, s = 0): Date | null {
  if (month1 < 1 || month1 > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, month1 - 1, d, h, mi, s);
  if (dt.getFullYear() !== y || dt.getMonth() !== month1 - 1 || dt.getDate() !== d) return null;
  return dt;
}

function expandYear(y: number): number {
  if (y >= 100) return y;
  return y >= 70 ? 1900 + y : 2000 + y;
}

// Given two parts in source order, decide which is the day and which the month.
function resolveDayMonth(
  first: number, second: number, dayFirstPreferred: boolean,
): { day: number; month: number; ambiguous: boolean } | null {
  if (first < 1 || second < 1 || first > 31 || second > 31) return null;
  if (first > 12 && second > 12) return null;                 // can't both be months
  if (first > 12)  return { day: first,  month: second, ambiguous: false };
  if (second > 12) return { day: second, month: first,  ambiguous: false };
  // Both ≤ 12 — genuinely ambiguous, fall back to the preferred convention.
  return dayFirstPreferred
    ? { day: first,  month: second, ambiguous: true }
    : { day: second, month: first,  ambiguous: true };
}

export function parseDate(raw: string): ParsedDate | null {
  const s = (raw ?? "").trim();
  if (!s) return null;

  // 1. Unix timestamps (13-digit ms, 10-digit s).
  if (/^\d{13}$/.test(s)) {
    const d = new Date(parseInt(s, 10));
    if (!Number.isNaN(d.getTime())) return { date: d, format: "Unix timestamp (ms)" };
  }
  if (/^\d{10}$/.test(s)) {
    const d = new Date(parseInt(s, 10) * 1000);
    if (!Number.isNaN(d.getTime())) return { date: d, format: "Unix timestamp (s)" };
  }

  // 2. Excel serial number (date-only integer in a plausible range).
  if (/^\d{4,6}$/.test(s)) {
    const n = parseInt(s, 10);
    if (n >= 35000 && n <= 60000) {
      return { date: fromExcelSerial(n), format: "Excel serial number" };
    }
  }

  // 3. ISO 8601 — naive (no TZ) values parsed as local; TZ-qualified honoured.
  const iso = s.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/,
  );
  if (iso) {
    const [, y, mo, d, hh, mi, se, tz] = iso;
    if (tz) {
      const dt = new Date(s.replace(" ", "T"));
      if (!Number.isNaN(dt.getTime())) return { date: dt, format: "ISO 8601" };
    } else {
      const t = parseTime(hh ? `${hh}:${mi}${se ? `:${se}` : ""}` : undefined);
      const dt = t && makeLocalDate(+y, +mo, +d, t.h, t.m, t.s);
      if (dt) return { date: dt, format: "ISO 8601" };
    }
  }

  // 4. Numeric date separated by '.', '/' or '-' with optional time.
  const sep = s.match(
    /^(\d{1,4})([./-])(\d{1,2})\2(\d{1,4})(?:[ T,]+(\d{1,2}:\d{2}(?::\d{2})?))?$/,
  );
  if (sep) {
    const [, p1, , p2, p3, timeStr] = sep;
    const t = parseTime(timeStr);
    if (t) {
      if (p1.length === 4) {
        // Year-first (e.g. 2024.01.08, 2024/01/08) — unambiguous.
        const dt = makeLocalDate(parseInt(p1, 10), parseInt(p2, 10), parseInt(p3, 10), t.h, t.m, t.s);
        if (dt) return { date: dt, format: "YYYY-MM-DD" };
      } else {
        // Year-last; day-first preferred (international norm, matches MT/EU exports).
        const year = expandYear(parseInt(p3, 10));
        const dm = resolveDayMonth(parseInt(p1, 10), parseInt(p2, 10), true);
        if (dm) {
          const dt = makeLocalDate(year, dm.month, dm.day, t.h, t.m, t.s);
          if (dt) {
            return {
              date: dt,
              format: dm.ambiguous ? "D/M/Y (assumed day-first)" : "D/M/Y",
              ambiguous: dm.ambiguous,
            };
          }
        }
      }
    }
  }

  // 5. Formats with a month name (e.g. "8 Jan 2024", "January 8, 2024").
  if (/[a-z]/i.test(s)) {
    const monToken = s.match(/[A-Za-z]{3,}/);
    const month = monToken ? MONTHS[monToken[0].slice(0, 3).toLowerCase()] : undefined;
    if (month !== undefined) {
      const timeStr = s.match(/\d{1,2}:\d{2}(?::\d{2})?/)?.[0];
      const t = parseTime(timeStr) ?? { h: 0, m: 0, s: 0 };
      const withoutTime = timeStr ? s.replace(timeStr, " ") : s;
      const nums = (withoutTime.match(/\d{1,4}/g) ?? []).map(n => parseInt(n, 10));

      let year: number | undefined;
      let day:  number | undefined;
      for (const n of nums) {
        if ((String(n).length === 4 || n > 31) && year === undefined) year = expandYear(n);
        else if (n >= 1 && n <= 31 && day === undefined) day = n;
      }
      // "8 Jan 24" → infer the remaining number as a (2-digit) year.
      if (year === undefined) {
        const remaining = nums.find(n => n !== day);
        if (remaining !== undefined) year = expandYear(remaining);
      }
      if (year !== undefined && day !== undefined) {
        const dt = makeLocalDate(year, month + 1, day, t.h, t.m, t.s);
        if (dt) return { date: dt, format: "Month name" };
      }
    }
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
  _rowNumber:  number;   // spreadsheet-style row number for error reporting
  _raw:        Record<string, string>;
}

export function mapRow(
  raw: Record<string, string>,
  mapping: Record<string, AppField>,
  rowNumber = 0,
): MappedRow {
  const byField: Partial<Record<AppField, string>> = {};
  for (const [col, field] of Object.entries(mapping)) {
    if (field !== "skip" && raw[col] !== undefined) byField[field] = raw[col];
  }

  const errors:   string[] = [];
  const warnings: string[] = [];

  const pair = (byField.pair ?? "").trim().toUpperCase();
  if (!pair) errors.push("Missing pair");
  else if (pair.length > 32) errors.push("Pair name is too long");

  const rawDir    = (byField.direction ?? "").trim();
  const direction = normaliseDirection(rawDir);
  if (!direction) errors.push(rawDir ? `Unrecognised direction: "${rawDir}"` : "Missing direction");

  const entryPrice = parseNumber(byField.entryPrice);
  if (entryPrice === null || entryPrice <= 0) errors.push("Invalid entry price");

  const exitPrice = parseNumber(byField.exitPrice);
  if (exitPrice === null || exitPrice <= 0) errors.push("Invalid exit price");

  // Optional levels: a present-but-unreadable value is a warning, not a hard error.
  const stopLoss = parseNumber(byField.stopLoss);
  if ((byField.stopLoss ?? "").trim() && stopLoss === null) {
    warnings.push("Stop loss couldn't be read, importing without it");
  }
  const takeProfit = parseNumber(byField.takeProfit);
  if ((byField.takeProfit ?? "").trim() && takeProfit === null) {
    warnings.push("Take profit couldn't be read, importing without it");
  }

  let tradedAt = "";
  const rawDate = (byField.tradedAt ?? "").trim();
  if (!rawDate) {
    errors.push("Missing date");
  } else {
    const parsed = parseDate(rawDate);
    if (!parsed) {
      errors.push(`Unrecognised date format: "${rawDate}"`);
    } else if (parsed.date.getTime() > Date.now() + 86_400_000) {
      errors.push(`Trade date is in the future: "${rawDate}"`);
    } else {
      tradedAt = parsed.date.toISOString();
      if (parsed.ambiguous) {
        warnings.push(`Date "${rawDate}" is ambiguous, read as ${parsed.date.toLocaleDateString()}. Verify it's correct.`);
      }
      if (parsed.format === "Excel serial number") {
        warnings.push(`Date "${rawDate}" read as an Excel serial → ${parsed.date.toLocaleDateString()}. Verify it's correct.`);
      }
    }
  }

  // Stop loss must sit on the correct side of entry.
  if (direction && stopLoss !== null && entryPrice !== null && entryPrice > 0) {
    if (direction === "LONG"  && stopLoss >= entryPrice) errors.push("Stop loss must be below entry for LONG");
    if (direction === "SHORT" && stopLoss <= entryPrice) errors.push("Stop loss must be above entry for SHORT");
  }

  return {
    pair,
    direction:  direction ?? "LONG",
    entryPrice: entryPrice ?? 0,
    stopLoss,
    takeProfit,
    exitPrice:  exitPrice ?? 0,
    tradedAt,
    notes:      (byField.notes ?? "").trim().slice(0, 2000),
    _errors:    errors,
    _warnings:  warnings,
    _rowNumber: rowNumber,
    _raw:       raw,
  };
}
