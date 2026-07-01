"use client";

import { DEFAULT_PAIRS, GROUP_ORDER } from "@/const/trades-const";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface Props {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}
interface DropdownProps {
  anchorRect: DOMRect;
  query: string;
  onQueryChange: (q: string) => void;
  activeIndex: number;
  onActiveChange: (i: number) => void;
  filteredPairs: { group: string; value: string }[];
  onSelect: (v: string) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

function Dropdown({
  anchorRect, query, onQueryChange, activeIndex, onActiveChange,
  filteredPairs, onSelect, onClose, inputRef, dropdownRef,
}: DropdownProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector("[data-active='true']") as HTMLElement;
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const top  = anchorRect.bottom + window.scrollY + 6;
  const left = anchorRect.left   + window.scrollX;

  // Group filtered pairs
  const grouped = GROUP_ORDER.reduce<{ group: string; items: string[] }[]>((acc, g) => {
    const items = filteredPairs.filter(p => p.group === g).map(p => p.value);
    if (items.length) acc.push({ group: g, items });
    return acc;
  }, []);

  // Also include any custom typed value not in list
  const hasCustom = query.length >= 2 && !DEFAULT_PAIRS.some(p => p.value === query.toUpperCase());

  return createPortal(
    <div
      ref={dropdownRef}
      style={{ position: "absolute", top, left, width: anchorRect.width, zIndex: 9999, minWidth: 220 }}
    >
      <div
        style={{ backgroundColor: "#0d1117" }}
        className="rounded-[10px] border border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden"
      >
        <div className="px-3 pt-3 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 px-3 py-[9px] rounded-[6px] bg-white/[0.04] border border-white/[0.07] focus-within:border-white/20 transition-colors duration-150">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="shrink-0 opacity-30">
              <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7.5 7.5L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => onQueryChange(e.target.value.toUpperCase())}
              placeholder="Search pairs…"
              className="flex-1 bg-transparent font-mono text-[12px] text-white/80 outline-none focus:outline-none focus-visible:outline-none placeholder:text-white/20 tracking-[0.04em]"
              onKeyDown={e => {
                if (e.key === "ArrowDown") { e.preventDefault(); onActiveChange(Math.min(activeIndex + 1, filteredPairs.length - 1 + (hasCustom ? 1 : 0))); }
                if (e.key === "ArrowUp")   { e.preventDefault(); onActiveChange(Math.max(activeIndex - 1, 0)); }
                if (e.key === "Enter")     { e.preventDefault();
                  if (hasCustom && activeIndex === filteredPairs.length) { onSelect(query); }
                  else if (filteredPairs[activeIndex]) { onSelect(filteredPairs[activeIndex].value); }
                }
                if (e.key === "Escape")   { onClose(); }
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                onMouseDown={e => e.preventDefault()}
                className="text-white/20 hover:text-white/50 transition-colors text-[14px] leading-none"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div ref={listRef} className="max-h-[240px] overflow-y-auto py-2">
          {grouped.length === 0 && !hasCustom ? (
            <div className="px-4 py-6 text-center font-mono text-[11px] text-white/20">
              No pairs found
            </div>
          ) : (
            <>
              {grouped.map(({ group, items }) => {
                return (
                  <div key={group}>
                    <div className="px-3 pt-2 pb-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
                        {group}
                      </span>
                    </div>
                    {items.map(item => {
                      const flatIdx = filteredPairs.findIndex(p => p.value === item);
                      const isActive = flatIdx === activeIndex;
                      return (
                        <button
                          key={item}
                          type="button"
                          data-active={isActive}
                          onMouseEnter={() => onActiveChange(flatIdx)}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => onSelect(item)}
                          style={isActive ? { backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                          className="w-full flex items-center justify-between px-3 py-[8px] transition-colors duration-75 cursor-pointer"
                        >
                          <span className="font-mono text-[12px] text-white/70 tracking-[0.06em]">
                            {item}
                          </span>
                          {isActive && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-emerald-400/60">
                              <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {hasCustom && (
                <div>
                  <div className="px-3 pt-2 pb-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
                      Custom
                    </span>
                  </div>
                  <button
                    type="button"
                    data-active={activeIndex === filteredPairs.length}
                    onMouseEnter={() => onActiveChange(filteredPairs.length)}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => onSelect(query)}
                    style={activeIndex === filteredPairs.length ? { backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                    className="w-full flex items-center justify-between px-3 py-[8px] transition-colors duration-75 cursor-pointer"
                  >
                    <span className="font-mono text-[12px] text-white/70 tracking-[0.06em]">
                      {query}
                    </span>
                    <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.1em]">
                      use this
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function PairSelect({ value, onChange, hasError }: Props) {
  const [open,        setOpen]        = useState(false);
  const [query,       setQuery]       = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted,     setMounted]     = useState(false);
  const [rect,        setRect]        = useState<DOMRect | null>(null);

  const triggerRef  = useRef<HTMLButtonElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const filteredPairs = query.length === 0
    ? DEFAULT_PAIRS
    : DEFAULT_PAIRS.filter(p => p.value.includes(query.toUpperCase()));

  const openDropdown = useCallback(() => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
    // Focus search on next tick
    setTimeout(() => searchRef.current?.focus(), 50);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  function handleSelect(v: string) {
    onChange(v.toUpperCase());
    setOpen(false);
  }

  function handleQueryChange(q: string) {
    setQuery(q);
    setActiveIndex(0);
  }

  const displayValue = value || "Select pair";
  const hasValue     = !!value;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => open ? setOpen(false) : openDropdown()}
        className={[
          "w-full px-[14px] py-[11px] rounded-[6px] font-mono text-[13px] text-left outline-none",
          "transition-all duration-200 flex items-center justify-between gap-2",
          open
            ? "bg-white/[0.04] border border-emerald-400/40 shadow-[0_0_0_3px_rgba(74,222,128,0.06)]"
            : hasError
            ? "bg-white/[0.025] border border-red-400/60"
            : "bg-white/[0.025] border border-white/[0.08] hover:border-white/15",
        ].join(" ")}
      >
        <span className={hasValue ? "text-white/88" : "text-white/25"}>
          {displayValue}
        </span>
        <svg
          width="11" height="11" viewBox="0 0 11 11" fill="none"
          className={["transition-transform duration-200 shrink-0", open ? "rotate-180 opacity-50" : "opacity-25"].join(" ")}
        >
          <path d="M2 4l3.5 3.5L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {mounted && open && rect && (
        <Dropdown
          anchorRect={rect}
          query={query}
          onQueryChange={handleQueryChange}
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          filteredPairs={filteredPairs}
          onSelect={handleSelect}
          onClose={() => setOpen(false)}
          inputRef={searchRef}
          dropdownRef={dropdownRef}
        />
      )}
    </div>
  );
}