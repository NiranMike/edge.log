"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function toDateAndTime(iso: string): { date: Date | undefined; time: string } {
  if (!iso) return { date: undefined, time: "00:00" };
  const [datePart, timePart] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  return {
    date: new Date(y, m - 1, d),
    time: timePart?.slice(0, 5) ?? "00:00",
  };
}

function toISO(date: Date, time: string): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T${time}`;
}

function formatDisplay(date: Date | undefined, time: string): string {
  if (!date) return "Pick a date";
  return (
    date.toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    }) + "  ·  " + time
  );
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface DropdownProps {
  anchorRect: DOMRect;
  selected: Date | undefined;
  time: string;
  month: Date;
  onDaySelect: (d: Date | undefined) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMonthChange: (d: Date) => void;
  onNow: () => void;
  onClose: () => void;
  onQuickTime: (t: string) => void;
}

function Dropdown({
  anchorRect, selected, time, month,
  onDaySelect, onTimeChange, onMonthChange,
  onNow, onClose, onQuickTime,
}: DropdownProps) {
  const top  = anchorRect.bottom + window.scrollY + 6;
  const left = anchorRect.left   + window.scrollX;

  return createPortal(
    <div
      style={{ position: "absolute", top, left, width: 300, zIndex: 9999 }}
      // Stop clicks inside from bubbling to the document close listener
      onMouseDown={e => e.stopPropagation()}
    >
      <div
        style={{ backgroundColor: "var(--bg-elevated)" }}
        className="rounded-[10px] border border-[var(--bd-hi)] shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--bd)]">
          <button
            type="button"
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--tx-3)] hover:text-[var(--tx-1)] hover:bg-[var(--bg-overlay)] transition-all duration-150"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M6.5 2L3.5 5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="font-mono text-[12px] text-[var(--tx-2)] tracking-[0.06em]">
            {MONTHS[month.getMonth()]} {month.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1))}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--tx-3)] hover:text-[var(--tx-1)] hover:bg-[var(--bg-overlay)] transition-all duration-150"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3.5 2L6.5 5l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="px-3 pt-3 pb-2">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={onDaySelect}
            month={month}
            onMonthChange={onMonthChange}
            hideNavigation
            classNames={{
              month:      "w-full",
              month_grid: "w-full border-collapse",
              weekdays:   "flex mb-1",
              weekday:    "flex-1 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--tx-4)] py-1",
              week:       "flex",
              day:        "flex-1 aspect-square p-[1px]",
              day_button: [
                "w-full h-full flex items-center justify-center rounded-[5px]",
                "font-mono text-[12px] text-[var(--tx-3)] transition-all duration-100",
                "hover:bg-[var(--bg-overlay)] hover:text-[var(--tx-1)] cursor-pointer",
              ].join(" "),
              selected: "[&>button]:!bg-[var(--ac-1)] [&>button]:!text-[var(--bg-base)] [&>button]:!font-semibold [&>button]:shadow-[0_0_12px_var(--ac-1-glow)]",
              today:    "[&>button]:text-[var(--ac-1)] [&>button]:font-medium",
              outside:  "opacity-0 pointer-events-none",
              disabled: "[&>button]:!text-[var(--tx-4)] [&>button]:!cursor-not-allowed",
            }}
          />
        </div>

        <div className="px-4 pb-3 pt-1 border-t border-[var(--bd)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--tx-4)]">Time</span>
            <span className="font-mono text-[10px] text-[var(--tx-3)]">{time}</span>
          </div>
          <input
            type="time"
            value={time}
            onChange={onTimeChange}
            style={{ backgroundColor: "var(--bg-input)" }}
            className="w-full px-3 py-[8px] rounded-[6px] font-mono text-[12px] text-[var(--tx-2)] outline-none border border-[var(--bd)] focus:border-[var(--ac-1-ring)] transition-all duration-150"
          />
          {/* Quick shortcuts */}
          <div className="flex gap-[5px] mt-2">
            {["09:00","12:00","15:00","18:00","21:00"].map(t => (
              <button
                key={t} type="button"
                onClick={() => onQuickTime(t)}
                style={time === t ? { backgroundColor: "var(--ac-1-dim)" } : { backgroundColor: "var(--bg-overlay)" }}
                className={[
                  "flex-1 py-[5px] rounded-[4px] font-mono text-[9px] tracking-[0.02em] transition-all duration-150 border",
                  time === t
                    ? "text-[var(--ac-1)] border-[var(--ac-1-ring)]"
                    : "text-[var(--tx-4)] border-[var(--bd)] hover:text-[var(--tx-3)]",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--bd)]">
          <button
            type="button" onClick={onNow}
            className="font-mono text-[10px] text-[var(--ac-1)] opacity-50 hover:opacity-80 transition-opacity duration-150 tracking-[0.06em]"
          >
            Now
          </button>
          <button
            type="button" onClick={onClose}
            className="font-mono text-[10px] text-[var(--tx-4)] hover:text-[var(--tx-2)] transition-colors duration-150 tracking-[0.06em] px-3 py-[5px] rounded-md hover:bg-[var(--bg-overlay)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function DateTimePicker({ value, onChange }: Props) {
  const { date: initDate, time: initTime } = toDateAndTime(value);

  const [open,     setOpen]     = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(initDate);
  const [time,     setTime]     = useState(initTime);
  const [month,    setMonth]    = useState<Date>(initDate ?? new Date());
  const [rect,     setRect]     = useState<DOMRect | null>(null);
  const [mounted,  setMounted]  = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);

  // Only portal after mount (SSR safety)
  useEffect(() => { setMounted(true); }, []);

  // Recompute anchor position on open
  const openPicker = useCallback(() => {
    if (triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
    setOpen(true);
  }, []);

  // Close on outside mousedown
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (triggerRef.current && triggerRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Sync when value changes externally
  useEffect(() => {
    const { date, time: t } = toDateAndTime(value);
    setSelected(date);
    setTime(t);
    if (date) setMonth(date);
  }, [value]);

  function handleDaySelect(day: Date | undefined) {
    setSelected(day);
    if (day) onChange(toISO(day, time));
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTime(e.target.value);
    if (selected) onChange(toISO(selected, e.target.value));
  }

  function handleQuickTime(t: string) {
    setTime(t);
    if (selected) onChange(toISO(selected, t));
  }

  function handleNow() {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setSelected(now);
    setTime(t);
    setMonth(now);
    onChange(toISO(now, t));
  }

  return (
    <div className="relative">
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => open ? setOpen(false) : openPicker()}
        className={[
          "w-full px-[14px] py-[11px] rounded-[6px] font-mono text-[13px] text-left outline-none",
          "transition-all duration-200 flex items-center justify-between gap-2",
          open
            ? "bg-[var(--bg-input-focus)] border border-[var(--ac-1-ring)] shadow-[0_0_0_3px_var(--ac-1-dim)] text-[var(--tx-1)]"
            : "bg-[var(--bg-input)] border border-[var(--bd)] text-[var(--tx-2)] hover:border-[var(--bd-hi)] hover:text-[var(--tx-1)]",
        ].join(" ")}
      >
        <span className="truncate">{formatDisplay(selected, time)}</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={["transition-transform duration-200 shrink-0 opacity-40", open ? "rotate-180" : ""].join(" ")}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Portaled dropdown ── */}
      {mounted && open && rect && (
        <Dropdown
          anchorRect={rect}
          selected={selected}
          time={time}
          month={month}
          onDaySelect={handleDaySelect}
          onTimeChange={handleTimeChange}
          onMonthChange={setMonth}
          onNow={handleNow}
          onClose={() => setOpen(false)}
          onQuickTime={handleQuickTime}
        />
      )}
    </div>
  );
}