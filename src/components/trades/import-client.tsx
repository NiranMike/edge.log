"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { autoMatchColumns, mapRow, FIELD_META } from "@/lib/import/column-matcher";
import { importTradesAction } from "@/lib/actions/import-action";
import type { AppField, MappedRow } from "@/lib/import/column-matcher";
import { cx } from "@/style";
import { TableShell, TH_CLASS } from "@/components/ui/app-table";

const MAX_FILE_MB    = 5;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
const MAX_ROWS       = 1000;

// Extensions PapaParse can read (it auto-detects comma/tab/semicolon delimiters).
const PARSEABLE_EXT = ["csv", "txt", "tsv", "tab", "dat", "prn", ""];
// Common mistakes worth a tailored message.
const BINARY_EXT: Record<string, string> = {
  xls:     "Excel",
  xlsx:    "Excel",
  numbers: "Numbers",
  ods:     "OpenDocument",
  pdf:     "PDF",
  json:    "JSON",
  zip:     "archive",
};

const SAMPLE_CSV = [
  "Pair,Direction,Entry Price,Stop Loss,Take Profit,Exit Price,Date,Notes",
  "EURUSD,Buy,1.08500,1.08200,1.09200,1.09100,2024-01-08 09:15,Breakout long",
  "GBPUSD,Sell,1.27400,1.27750,1.26500,1.26800,2024-01-09 14:30,",
  "US30,Buy,38250,38100,38600,38540,2024-01-10,Index swing",
].join("\n");

function downloadSampleCsv() {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = "edge-log-sample.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Upload" },
    { n: 2, label: "Map columns" },
    { n: 3, label: "Preview & import" },
  ] as const;
  return (
    <div className="flex items-center gap-0 mb-8 sm:mb-10" aria-hidden="true">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={cx(
              "w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-medium transition-all duration-200",
              current === s.n
                ? "bg-emerald-400 text-[var(--bg-base)]"
                : current > s.n
                ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                : "bg-[var(--bg-elevated)] text-[var(--tx-4)] border border-[var(--bd)]",
            )}>
              {current > s.n ? "✓" : s.n}
            </div>
            <span className={cx(
              "font-mono text-[11px] tracking-[0.04em] hidden sm:inline",
              current === s.n ? "text-[var(--tx-2)]" : current > s.n ? "text-emerald-400/60" : "text-[var(--tx-4)]",
            )}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cx(
              "w-8 sm:w-12 h-px mx-2 sm:mx-3 transition-colors duration-200",
              current > s.n ? "bg-emerald-400/30" : "bg-[var(--bd)]",
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

function UploadStep({ onParsed }: {
  onParsed: (headers: string[], rows: Record<string, string>[]) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const parse = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (BINARY_EXT[ext]) {
      setError(`That's a ${BINARY_EXT[ext]} file. Open it and export / save as CSV, then upload the .csv.`);
      return;
    }
    if (!PARSEABLE_EXT.includes(ext)) {
      setError("Unsupported file type. Please upload a .csv (or .txt / .tsv) file.");
      return;
    }
    if (file.size === 0) {
      setError("That file is empty.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_FILE_MB} MB.`);
      return;
    }

    setLoading(true);
    setError(null);

    Papa.parse<Record<string, string>>(file, {
      header:          true,
      skipEmptyLines:  "greedy",
      transformHeader: h => h.trim(),
      complete: (result) => {
        setLoading(false);
        const headers = (result.meta.fields ?? []).filter(h => h.length > 0);
        if (!result.data.length || !headers.length) {
          setError("The file appears to be empty or has no header row.");
          return;
        }
        if (result.data.length > MAX_ROWS) {
          setError(`File contains ${result.data.length.toLocaleString()} rows. Maximum is ${MAX_ROWS.toLocaleString()} per import. Split the file and import in batches.`);
          return;
        }
        onParsed(headers, result.data as Record<string, string>[]);
      },
      error: (err) => { setLoading(false); setError(`Could not read the file: ${err.message}`); },
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parse(file);
    else setError("No file detected. Try selecting the file instead.");
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {["MT4 / MT5", "cTrader", "Tradovate", "IBKR", "Edgewonk", "Excel / Google Sheets"].map(s => (
          <span key={s} className="px-2.5 py-1 rounded font-mono text-[10px] text-[var(--tx-3)] bg-gradient-to-b from-[#10141a] to-[#0d1117] border border-[var(--bd)] tracking-[0.04em]">
            {s}
          </span>
        ))}
      </div>

      <label
        aria-busy={loading}
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={cx(
          "relative flex flex-col items-center justify-center gap-3 w-full py-14 sm:py-20 rounded-[8px] border border-dashed transition-all duration-200 focus-within:border-emerald-400/50 focus-within:bg-emerald-400/[0.04]",
          loading ? "cursor-default" : "cursor-pointer",
          dragging
            ? "border-emerald-400/40 bg-emerald-400/[0.04]"
            : "border-[var(--bd-hi)] bg-gradient-to-b from-[#10141a] to-[#0d1117] hover:border-emerald-400/30 hover:bg-[var(--bg-elevated)]",
        )}
      >
        {loading ? (
          <>
            <span className="w-6 h-6 rounded-full border-2 border-[var(--bd-hi)] border-t-emerald-400 animate-spin" />
            <span className="font-mono text-[12px] text-[var(--tx-3)]">Reading file…</span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--bd)] flex items-center justify-center text-[var(--tx-3)] text-[18px]">
              ↑
            </div>
            <div className="text-center">
              <p className="font-mono text-[13px] text-[var(--tx-2)]">
                Drop your CSV here or <span className="text-emerald-400">browse</span>
              </p>
              <p className="font-mono text-[11px] text-[var(--tx-4)] mt-1">
                .csv, .txt or .tsv · max {MAX_FILE_MB} MB · up to {MAX_ROWS.toLocaleString()} rows
              </p>
            </div>
          </>
        )}
        <input
          type="file"
          accept=".csv,.txt,.tsv,text/csv,text/plain,text/tab-separated-values"
          aria-label="Upload a CSV file"
          disabled={loading}
          className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) parse(f); e.target.value = ""; }}
        />
      </label>

      {error && (
        <div role="alert" className="mt-3 px-3.5 py-3 rounded-[6px] bg-red-400/[0.06] border border-red-400/20 font-mono text-[12px] text-red-400">
          ↳ {error}
        </div>
      )}

      <div className="mt-6 p-4 rounded-md bg-gradient-to-b from-[#10141a] to-[#0d1117] border border-[var(--bd)]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--tx-4)]">How to export</p>
          <button
            type="button"
            onClick={downloadSampleCsv}
            className="shrink-0 font-mono text-[10px] text-emerald-400/70 hover:text-emerald-400 transition-colors duration-150 tracking-[0.04em] underline decoration-dotted underline-offset-2"
          >
            ↓ Download sample CSV
          </button>
        </div>
        <ul className="space-y-2">
          {[
            { broker: "MT4/MT5",        how: "Reports → Account History → right-click → Save as Report (CSV)" },
            { broker: "cTrader",        how: "History → Export → CSV" },
            { broker: "Excel / Sheets", how: "File → Download / Save As → CSV (.csv)" },
          ].map(({ broker, how }) => (
            <li key={broker} className="flex gap-3">
              <span className="font-mono text-[10px] text-emerald-400/50 shrink-0 w-[80px]">{broker}</span>
              <span className="font-mono text-[10px] text-[var(--tx-3)] leading-relaxed">{how}</span>
            </li>
          ))}
        </ul>
        <p className="font-mono text-[10px] text-[var(--tx-4)] leading-relaxed mt-3 pt-3 border-t border-[var(--bd)]">
          Columns can be in any order. You'll map them in the next step. Dates, number formats (1,234.56 or 1.234,56) and BUY/SELL or LONG/SHORT are all detected automatically.
        </p>
      </div>
    </div>
  );
}

const ALL_FIELDS: AppField[] = [
  "pair", "direction", "entryPrice", "stopLoss",
  "takeProfit", "exitPrice", "tradedAt", "notes", "skip",
];

const REQUIRED: AppField[] = ["pair", "direction", "entryPrice", "exitPrice", "tradedAt"];

function MappingStep({
  headers,
  rawRows,
  initialMapping,
  onConfirm,
  onBack,
}: {
  headers:        string[];
  rawRows:        Record<string, string>[];
  initialMapping: Record<string, AppField>;
  onConfirm:      (mapping: Record<string, AppField>) => void;
  onBack:         () => void;
}) {
  const [mapping, setMapping] = useState<Record<string, AppField>>(initialMapping);

  const setField = (header: string, field: AppField) =>
    setMapping(prev => ({ ...prev, [header]: field }));

  const fieldCounts = Object.values(mapping).reduce<Record<string, number>>((acc, f) => {
    if (f !== "skip") acc[f] = (acc[f] ?? 0) + 1;
    return acc;
  }, {});
  const duplicateFields = new Set(
    Object.entries(fieldCounts).filter(([f, c]) => c > 1 && f !== "notes").map(([f]) => f)
  );

  const mappedRequired = REQUIRED.filter(f => Object.values(mapping).includes(f));
  const allRequiredMapped = mappedRequired.length === REQUIRED.length && duplicateFields.size === 0;

  return (
    <div>
      <p className="font-mono text-[12px] text-[var(--tx-3)] mb-6 leading-relaxed">
        We've auto-matched your columns. Review and correct anything that looks wrong.
        Required fields are marked <span className="text-red-400/70">*</span>.
      </p>

      <div className="space-y-2 mb-5">
        {headers.map(header => {
          const field = mapping[header] ?? "skip";
          const autoMatched = initialMapping[header] !== "skip" && initialMapping[header] === field;
          const isDuplicate = field !== "skip" && duplicateFields.has(field);
          const sample = rawRows.find(r => (r[header] ?? "").trim())?.[header];

          return (
            <div
              key={header}
              className={cx(
                "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 rounded-[6px] border transition-colors duration-150",
                isDuplicate
                  ? "bg-gradient-to-b from-[#10141a] to-[#0d1117]"
                  : field === "skip"
                  ? "bg-gradient-to-b from-[#10141a] to-[#0d1117] border-[var(--bd)]"
                  : "bg-gradient-to-b from-[#10141a] to-[#0d1117] border-[var(--bd-hi)]",
              )}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-mono text-[12px] text-[var(--tx-2)] truncate">{header}</span>
                {autoMatched && !isDuplicate && (
                  <span className="shrink-0 px-1.5 py-[2px] rounded font-mono text-[9px] text-emerald-400/60 bg-emerald-400/[0.06] border border-emerald-400/15 uppercase tracking-[0.1em]">
                    auto
                  </span>
                )}
                {isDuplicate && (
                  <span className="shrink-0 px-1.5 py-[2px] rounded font-mono text-[9px] text-amber-400/70 bg-amber-400/[0.06] border border-amber-400/20 uppercase tracking-[0.1em]">
                    duplicate
                  </span>
                )}
                {sample && (
                  <span className="hidden sm:inline font-mono text-[10px] text-[var(--tx-4)] truncate max-w-[120px]">
                    e.g. {sample}
                  </span>
                )}
              </div>

              <span className="hidden sm:block font-mono text-[12px] text-[var(--tx-4)]">→</span>

              <label className="sr-only" htmlFor={`map-${header}`}>Map column {header} to a field</label>
              <select
                id={`map-${header}`}
                value={field}
                onChange={e => setField(header, e.target.value as AppField)}
                className="shrink-0 sm:w-[190px] px-3 py-[8px] rounded-[6px] font-mono text-[12px] text-[var(--tx-2)] bg-[var(--bg-input)] border border-[var(--bd-hi)] outline-none focus:border-emerald-400/40 transition-colors duration-150 [color-scheme:dark] cursor-pointer"
              >
                {ALL_FIELDS.map(f => (
                  <option key={f} value={f}>
                    {FIELD_META[f].label}{FIELD_META[f].required ? " *" : ""}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Required fields status */}
      <div className="flex flex-wrap gap-2 mb-6">
        {REQUIRED.map(f => {
          const mapped    = Object.values(mapping).includes(f);
          const duplicate = duplicateFields.has(f);
          return (
            <span key={f} className={cx(
              "px-2.5 py-1 rounded font-mono text-[10px] border tracking-[0.04em]",
              duplicate
                ? "text-amber-400/70 bg-amber-400/[0.06] border-amber-400/20"
                : mapped
                ? "text-emerald-400/70 bg-emerald-400/[0.06] border-emerald-400/15"
                : "text-red-400/60 bg-red-400/[0.05] border-red-400/15",
            )}>
              {duplicate ? "⚠" : mapped ? "✓" : "✗"} {FIELD_META[f].label}
            </span>
          );
        })}
      </div>

      {duplicateFields.size > 0 && (
        <div role="alert" className="mb-4 px-3.5 py-3 rounded-md bg-amber-400/[0.05] border border-amber-400/15 font-mono text-[12px] text-amber-400/70">
          ⚠ Some fields are mapped more than once. Each field must be assigned to exactly one column (Notes excepted).
        </div>
      )}

      <div className="flex flex-col-reverse sm:grid sm:grid-cols-[auto_1fr] gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-[13px] rounded-md bg-transparent border border-[var(--bd)] font-mono text-[12px] tracking-[0.06em] text-[var(--tx-3)] cursor-pointer transition-all duration-150 hover:border-[var(--bd-hi)] hover:text-[var(--tx-2)]"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => onConfirm(mapping)}
          disabled={!allRequiredMapped}
          className={cx(
            "py-[13px] rounded-[6px] font-mono text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-200 border border-transparent",
            allRequiredMapped
              ? "bg-emerald-400 text-[var(--bg-base)] hover:bg-emerald-300 cursor-pointer shadow-[0_0_24px_rgba(74,222,128,0.2)]"
              : "bg-[var(--bg-elevated)] text-[var(--tx-4)] cursor-not-allowed",
          )}
        >
          Preview {rawRows.length} {rawRows.length === 1 ? "trade" : "trades"}
        </button>
      </div>
    </div>
  );
}

function CollapsibleRows({
  label, tone, rows,
}: {
  label: string;
  tone:  "error" | "warn";
  rows:  { n: number; text: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cx(
          "font-mono text-[11px] transition-colors duration-150 tracking-[0.04em]",
          tone === "error" ? "text-red-400/60 hover:text-red-400" : "text-amber-400/60 hover:text-amber-400",
        )}
        aria-expanded={open}
      >
        {open ? "▼" : "▶"} {label} · {open ? "hide" : "show"} details
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
          {rows.map(r => (
            <div key={r.n} className={cx(
              "flex items-start gap-3 px-3 py-2 rounded border",
              tone === "error" ? "bg-red-400/[0.04] border-red-400/10" : "bg-amber-400/[0.04] border-amber-400/10",
            )}>
              <span className="font-mono text-[10px] text-[var(--tx-4)] shrink-0">Row {r.n}</span>
              <span className={cx("font-mono text-[10px]", tone === "error" ? "text-red-400/70" : "text-amber-400/70")}>
                {r.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewStep({
  rows,
  onImport,
  onBack,
}: {
  rows:     MappedRow[];
  onImport: (validRows: MappedRow[]) => Promise<void>;
  onBack:   () => void;
}) {
  const [importing, setImporting] = useState(false);

  const validRows   = rows.filter(r => r._errors.length === 0);
  const invalidRows = rows.filter(r => r._errors.length > 0);
  const noSLRows    = validRows.filter(r => r.stopLoss === null);
  const warnRows    = validRows.filter(r => r._warnings.length > 0);

  const errorItems = invalidRows.map(r => ({ n: r._rowNumber, text: r._errors.join(" · ") }));
  const warnItems  = warnRows.map(r => ({ n: r._rowNumber, text: r._warnings.join(" · ") }));

  const handleImport = async () => {
    setImporting(true);
    await onImport(validRows);
    setImporting(false);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total rows", value: rows.length,        color: "text-[var(--tx-1)]" },
          { label: "Ready",      value: validRows.length,   color: "text-emerald-400" },
          { label: "Skipped",    value: invalidRows.length, color: invalidRows.length > 0 ? "text-red-400" : "text-[var(--tx-4)]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-4 py-3 rounded-[6px] bg-gradient-to-b from-[#10141a] to-[#0d1117] border border-[var(--bd)] text-center">
            <p className={cx("font-mono text-[22px] font-medium tracking-[-0.04em] mb-1", color)}>{value}</p>
            <p className="font-mono text-[10px] text-[var(--tx-4)] uppercase tracking-[0.12em]">{label}</p>
          </div>
        ))}
      </div>

      {invalidRows.length > 0 && (
        <CollapsibleRows
          tone="error"
          label={`${invalidRows.length} row${invalidRows.length > 1 ? "s" : ""} will be skipped`}
          rows={errorItems}
        />
      )}

      {warnRows.length > 0 && (
        <CollapsibleRows
          tone="warn"
          label={`${warnRows.length} row${warnRows.length > 1 ? "s" : ""} need a quick check`}
          rows={warnItems}
        />
      )}

      <TableShell className="mb-5 rounded-[8px]">
        <table className="w-full border-collapse min-w-[540px]">
          <thead>
            <tr className="border-b border-[var(--bd)]">
              {["Pair", "Dir", "Entry", "Exit", "Stop", "Date", "Notes"].map(h => (
                <th key={h} className={cx(TH_CLASS, "py-2.5")}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {validRows.slice(0, 8).map((r, i) => (
              <tr key={r._rowNumber} className={cx(
                "transition-colors duration-150",
                i < Math.min(validRows.length, 8) - 1 ? "border-b border-[var(--bd)]" : "",
              )}>
                <td className="px-3 py-2.5 font-mono text-[12px] text-[var(--tx-1)] font-medium">{r.pair}</td>
                <td className="px-3 py-2.5 font-mono text-[11px]">
                  <span className={r.direction === "LONG" ? "text-emerald-400" : "text-red-400"}>
                    {r.direction === "LONG" ? "▲" : "▼"} {r.direction}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-[var(--tx-2)]">{r.entryPrice}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-[var(--tx-2)]">{r.exitPrice}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-[var(--tx-3)]">{r.stopLoss ?? <span className="text-[var(--tx-4)]">·</span>}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-[var(--tx-3)] whitespace-nowrap">
                  {new Date(r.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                </td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-[var(--tx-3)] max-w-[100px] truncate">
                  {r.notes || <span className="text-[var(--tx-4)]">·</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {validRows.length > 8 && (
          <div className="px-4 py-2.5 border-t border-[var(--bd)] bg-[var(--bg-base)]">
            <span className="font-mono text-[10px] text-[var(--tx-4)]">
              +{validRows.length - 8} more rows not shown
            </span>
          </div>
        )}
      </TableShell>

      {/* Informational: trades without a stop loss */}
      {noSLRows.length > 0 && (
        <div className="mb-5 px-4 py-3 rounded-[6px] bg-amber-400/[0.05] border border-amber-400/15">
          <p className="font-mono text-[11px] text-amber-400/70 leading-relaxed">
            ⚠ {noSLRows.length} trade{noSLRows.length > 1 ? "s have" : " has"} no stop loss, so R multiples won't be calculated for those rows.
            You can add stop loss values by editing each trade after import.
          </p>
        </div>
      )}

      {validRows.length === 0 && (
        <div role="alert" className="mb-5 px-4 py-3 rounded-[6px] bg-red-400/[0.05] border border-red-400/15">
          <p className="font-mono text-[11px] text-red-400/70 leading-relaxed">
            No valid trades to import. Go back and check your column mapping, or fix the errors in your file.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:grid sm:grid-cols-[auto_1fr] gap-2.5">
        <button
          type="button"
          onClick={onBack}
          disabled={importing}
          className="px-5 py-[13px] rounded-md bg-transparent border border-[var(--bd)] font-mono text-[12px] tracking-[0.06em] text-[var(--tx-3)] cursor-pointer transition-all duration-150 hover:border-[var(--bd-hi)] hover:text-[var(--tx-2)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={importing || validRows.length === 0}
          className={cx(
            "py-[13px] rounded-[6px] font-mono text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-200 border border-transparent",
            importing || validRows.length === 0
              ? "bg-[var(--bg-elevated)] text-[var(--tx-4)] cursor-not-allowed"
              : "bg-emerald-400 text-[var(--bg-base)] hover:bg-emerald-300 cursor-pointer shadow-[0_0_24px_rgba(74,222,128,0.2)]",
          )}
        >
          {importing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-[10px] h-[10px] rounded-full border-[1.5px] border-[var(--bd-hi)] border-t-[var(--tx-2)] inline-block animate-spin" />
              Importing…
            </span>
          ) : `Import ${validRows.length} ${validRows.length === 1 ? "trade" : "trades"}`}
        </button>
      </div>
    </div>
  );
}

export function ImportClient() {
  const router  = useRouter();
  const [step,    setStep]    = useState<1 | 2 | 3>(1);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, AppField>>({});
  const [mapped,  setMapped]  = useState<MappedRow[]>([]);
  const [success, setSuccess] = useState<{ imported: number; duplicates: number } | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  // Warn before leaving mid-flow (once columns are mapped, before success).
  useEffect(() => {
    if (step === 1 || success !== null) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [step, success]);

  const handleParsed = useCallback((h: string[], rows: Record<string, string>[]) => {
    setHeaders(h);
    setRawRows(rows);
    setMapping(autoMatchColumns(h));
    setError(null);
    setStep(2);
  }, []);

  const handleMappingConfirmed = useCallback((m: Record<string, AppField>) => {
    setMapping(m);
    // rowNumber = i + 2 → matches the spreadsheet row (header is row 1).
    setMapped(rawRows.map((r, i) => mapRow(r, m, i + 2)));
    setError(null);
    setStep(3);
  }, [rawRows]);

  const handleImport = useCallback(async (validRows: MappedRow[]) => {
    setError(null);
    const result = await importTradesAction(validRows.map(r => ({
      pair:       r.pair,
      direction:  r.direction,
      entryPrice: r.entryPrice,
      stopLoss:   r.stopLoss,
      takeProfit: r.takeProfit,
      exitPrice:  r.exitPrice,
      tradedAt:   r.tradedAt,
      notes:      r.notes,
    })));

    if (result.ok) {
      setSuccess(result.data);
      setTimeout(() => router.push("/trades"), 2500);
    } else {
      setError(result.error);
    }
  }, [router]);

  const handleReset = () => {
    setStep(1);
    setHeaders([]);
    setRawRows([]);
    setMapping({});
    setMapped([]);
    setSuccess(null);
    setError(null);
  };

  if (success !== null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-[52px] h-[52px] rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-[22px] text-emerald-400">
          ✓
        </div>
        <div className="text-center">
          <p className="font-mono text-[14px] text-[var(--tx-1)] mb-1">
            {success.imported} trade{success.imported === 1 ? "" : "s"} imported successfully.
          </p>
          {success.duplicates > 0 && (
            <p className="font-mono text-[11px] text-[var(--tx-3)]">
              {success.duplicates} duplicate{success.duplicates === 1 ? "" : "s"} skipped.
            </p>
          )}
          <p className="font-mono text-[11px] text-[var(--tx-4)] mt-2">Redirecting to your journal…</p>
          <button
            type="button"
            onClick={() => router.push("/trades")}
            className="mt-4 font-mono text-[11px] text-emerald-400/70 hover:text-emerald-400 transition-colors duration-150 underline decoration-dotted underline-offset-2"
          >
            Go to journal now →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Steps current={step} />
      <p className="sr-only" aria-live="polite">Step {step} of 3</p>

      {error && (
        <div role="alert" className="mb-5 px-4 py-3 rounded-[6px] bg-red-400/[0.06] border border-red-400/20 flex items-start justify-between gap-4">
          <p className="font-mono text-[12px] text-red-400">↳ {error}</p>
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 font-mono text-[11px] text-[var(--tx-3)] hover:text-[var(--tx-1)] transition-colors duration-150 whitespace-nowrap"
          >
            Start over
          </button>
        </div>
      )}

      {step === 1 && <UploadStep onParsed={handleParsed} />}

      {step === 2 && (
        <MappingStep
          headers={headers}
          rawRows={rawRows}
          initialMapping={mapping}
          onConfirm={handleMappingConfirmed}
          onBack={handleReset}
        />
      )}

      {step === 3 && (
        <PreviewStep
          rows={mapped}
          onImport={handleImport}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}
