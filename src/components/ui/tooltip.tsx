"use client";

import { useState, useRef, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { cx } from "@/style";

interface Props {
  content:    string;
  className?: string;
}

interface Pos { top: number; left: number; }

const OFFSET    = 8;
const MAX_WIDTH = 220;

function computePos(anchor: DOMRect): Pos {
  const raw = anchor.left + anchor.width / 2 + window.scrollX;
  return {
    top:  anchor.bottom + window.scrollY + OFFSET,
    left: Math.min(Math.max(raw, 12), window.innerWidth - MAX_WIDTH - 12),
  };
}

export function Tooltip({ content, className }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos,     setPos]     = useState<Pos | null>(null);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const id  = useId();

  useEffect(() => { setMounted(true); }, []);

  function show() {
    if (ref.current) { setPos(computePos(ref.current.getBoundingClientRect())); setVisible(true); }
  }
  function hide() { setVisible(false); }

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") hide(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-describedby={visible ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={cx(
          "inline-flex items-center justify-center w-3.5 h-3.5 rounded-full shrink-0",
          "border border-[var(--bd)] text-[var(--tx-3)] font-mono text-[8px] leading-none",
          "hover:border-[var(--ac-2-ring)] hover:text-[var(--ac-2)]",
          "focus-visible:outline-none focus-visible:border-[var(--ac-2-ring)] focus-visible:text-[var(--ac-2)]",
          "transition-colors duration-150 cursor-default",
          className,
        )}
      >
        ?
      </button>

      {mounted && visible && pos && createPortal(
        <div
          id={id}
          role="tooltip"
          className="absolute pointer-events-none rounded-[8px] border border-[var(--bd-hi)] px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
          style={{ top: pos.top, left: pos.left, zIndex: 9999, maxWidth: MAX_WIDTH, backgroundColor: "var(--bg-elevated)" }}
        >
          <p className="font-mono text-[11px] text-[var(--tx-2)] leading-relaxed">{content}</p>
        </div>,
        document.body,
      )}
    </>
  );
}