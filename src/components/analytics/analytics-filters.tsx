"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cx } from "@/style";
import type { AnalyticsFilters as Filters } from "@/types";

interface Props {
  filters:  Filters;
  allPairs: string[];
}

const DATE_RANGES: { value: Filters["dateRange"]; label: string }[] = [
  { value: "30d",  label: "30d"    },
  { value: "90d",  label: "90d"    },
  { value: "6mo",  label: "6mo"    },
  { value: "1yr",  label: "1yr"    },
  { value: "all",  label: "All"    },
];

const DIRECTIONS: { value: Filters["direction"]; label: string }[] = [
  { value: "ALL",   label: "All"   },
  { value: "LONG",  label: "▲ Long"  },
  { value: "SHORT", label: "▼ Short" },
];


export function toQueryString(filters: Filters): string {
  const params = new URLSearchParams();
  params.set("dateRange", filters.dateRange);
  params.set("direction", filters.direction);
  if (filters.pairs.length > 0) params.set("pairs", filters.pairs.join(","));
  return params.toString();
}


export function activeFilterCount(filters: Filters): number {
  let n = 0;
  if (filters.dateRange !== "90d") n++;
  if (filters.direction  !== "ALL") n++;
  if (filters.pairs.length > 0)    n++;
  return n;
}


interface PairSelectProps {
  selected:  string[];
  allPairs:  string[];
  onChange:  (pairs: string[]) => void;
}

export function PairSelect({ selected, allPairs, onChange }: PairSelectProps) {
  const [open,    setOpen]    = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rect,    setRect]    = useState<DOMRect | null>(null);
  const triggerRef  = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (triggerRef.current?.contains(e.target as Node))  return;
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  function toggle(pair: string) {
    onChange(
      selected.includes(pair)
        ? selected.filter(p => p !== pair)
        : [...selected, pair],
    );
  }

  const label = selected.length === 0
    ? "All pairs"
    : selected.length === 1
    ? selected[0]
    : `${selected.length} pairs`;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
          setOpen(v => !v);
        }}
        className={cx(
          "flex items-center gap-2 px-3 py-[7px] rounded-[6px] font-mono text-[11px] border transition-all duration-150",
          open || selected.length > 0
            ? "bg-teal-400/[0.08] border-teal-400/25 text-teal-400"
            : "bg-white/[0.025] border-white/[0.08] text-white/40 hover:border-white/15 hover:text-white/60",
        )}
      >
        {label}
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none"
          className={cx("transition-transform duration-150 opacity-50", open ? "rotate-180" : "")}>
          <path d="M1.5 3l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {mounted && open && rect && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position:        "absolute",
            top:             rect.bottom + window.scrollY + 6,
            left:            rect.left   + window.scrollX,
            minWidth:        180,
            zIndex:          9999,
            backgroundColor: "#0d1117",
          }}
          className="rounded-[8px] border border-white/[0.1] shadow-[0_16px_48px_rgba(0,0,0,0.8)] py-1.5 overflow-hidden"
        >
          {/* Clear all */}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => { onChange([]); setOpen(false); }}
              className="w-full text-left px-3 py-[7px] font-mono text-[10px] text-white/30 hover:text-white/55 hover:bg-white/[0.04] transition-colors tracking-[0.06em] uppercase border-b border-white/[0.05] mb-1"
            >
              Clear all
            </button>
          )}
          {allPairs.map(pair => {
            const active = selected.includes(pair);
            return (
              <button
                key={pair}
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => toggle(pair)}
                className="w-full flex items-center justify-between px-3 py-[8px] font-mono text-[12px] text-white/60 hover:bg-white/[0.04] hover:text-white/80 transition-colors cursor-pointer"
              >
                <span className="tracking-[0.04em]">{pair}</span>
                {active && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-teal-400 shrink-0">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}


interface FilterContentProps {
  filters:     Filters;
  allPairs:    string[];
  onUpdate:    (next: Partial<Filters>) => void;
  isPending:   boolean;
}

export function FilterContent({ filters, allPairs, onUpdate, isPending }: FilterContentProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">

      <div className="flex items-center gap-1 p-1 rounded-[7px] bg-white/[0.03] border border-white/[0.06]">
        {DATE_RANGES.map(({ value, label }) => {
          const active = filters.dateRange === value;
          return (
            <button
              key={value}
              type="button"
              disabled={isPending}
              onClick={() => onUpdate({ dateRange: value })}
              className={cx(
                "px-3 py-[5px] rounded-[5px] font-mono text-[11px] tracking-[0.06em] transition-all duration-150 cursor-pointer disabled:cursor-not-allowed",
                active
                  ? "bg-white/[0.08] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "text-white/30 hover:text-white/55",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 p-1 rounded-[7px] bg-white/[0.03] border border-white/[0.06]">
        {DIRECTIONS.map(({ value, label }) => {
          const active = filters.direction === value;
          return (
            <button
              key={value}
              type="button"
              disabled={isPending}
              onClick={() => onUpdate({ direction: value })}
              className={cx(
                "px-3 py-[5px] rounded-[5px] font-mono text-[11px] tracking-[0.04em] transition-all duration-150 cursor-pointer disabled:cursor-not-allowed",
                active
                  ? value === "LONG"
                    ? "bg-emerald-400/[0.12] text-emerald-400"
                    : value === "SHORT"
                    ? "bg-red-400/[0.10] text-red-400"
                    : "bg-white/[0.08] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "text-white/30 hover:text-white/55",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <PairSelect
        selected={filters.pairs}
        allPairs={allPairs}
        onChange={pairs => onUpdate({ pairs })}
      />

      {isPending && (
        <span className="w-[8px] h-[8px] rounded-full border border-teal-400/40 border-t-teal-400 animate-[spin_0.7s_linear_infinite] ml-1" />
      )}
    </div>
  );
}


interface BottomSheetProps {
  open:      boolean;
  onClose:   () => void;
  children:  React.ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <>
      <div
        onClick={onClose}
        className={cx(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />
      <div
        className={cx(
          "fixed bottom-0 left-0 right-0 z-50 rounded-t-[16px] border-t border-white/[0.08] p-5 transition-transform duration-300 ease-out",
        )}
        style={{
          backgroundColor: "#0d1117",
          transform: open ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div className="w-8 h-[3px] rounded-full bg-white/15 mx-auto mb-5" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25 mb-4">
          Filters
        </p>
        {children}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-[11px] rounded-[8px] bg-white/[0.04] border border-white/[0.08] font-mono text-[12px] text-white/40 hover:text-white/60 transition-colors"
        >
          Done
        </button>
      </div>
    </>,
    document.body,
  );
}


export function AnalyticsFilters({ filters, allPairs }: Props) {
  const router             = useRouter();
  const pathname           = usePathname();
  const [isPending, start] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const badgeCount         = activeFilterCount(filters);

  function handleUpdate(next: Partial<Filters>) {
    const merged = { ...filters, ...next };
    start(() => {
      router.push(`${pathname}?${toQueryString(merged)}`);
    });
  }

  return (
    <>
      <div className="hidden sm:block">
        <FilterContent
          filters={filters}
          allPairs={allPairs}
          onUpdate={handleUpdate}
          isPending={isPending}
        />
      </div>

      <div className="flex items-center justify-between sm:hidden">
        <span className="font-mono text-[11px] text-white/30 tracking-[0.06em]">
          {filters.dateRange !== "all" ? `Last ${filters.dateRange}` : "All time"}
          {filters.direction !== "ALL" && ` · ${filters.direction}`}
          {filters.pairs.length > 0 && ` · ${filters.pairs.length} pair${filters.pairs.length > 1 ? "s" : ""}`}
        </span>

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={cx(
            "flex items-center gap-2 px-3 py-[7px] rounded-[6px] font-mono text-[11px] border transition-all duration-150",
            badgeCount > 0
              ? "bg-teal-400/[0.08] border-teal-400/25 text-teal-400"
              : "bg-white/[0.025] border-white/[0.08] text-white/40",
          )}
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <rect x="0" y="0"   width="12" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="4"   width="8"  height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="4" y="8"   width="4"  height="1.5" rx="0.75" fill="currentColor"/>
          </svg>
          Filters
          {badgeCount > 0 && (
            <span className="w-[16px] h-[16px] rounded-full bg-teal-400 text-[#07090d] font-mono text-[9px] font-bold flex items-center justify-center">
              {badgeCount}
            </span>
          )}
        </button>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <FilterContent
          filters={filters}
          allPairs={allPairs}
          onUpdate={(next) => { handleUpdate(next); }}
          isPending={isPending}
        />
      </BottomSheet>
    </>
  );
}