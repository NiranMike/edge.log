"use client";

import { cx } from "@/style";
import { Tooltip } from "@/components/ui/tooltip";

interface Props {
  value:       number;
  showRatio?:  boolean;
  size?:       "sm" | "md" | "lg";
  className?:  string;
  muted?:      boolean; 
}

const R_TOOLTIP =
  "R-multiple = your result in units of risk.\n" +
  "+1R → made exactly what you risked.\n" +
  "+2.5R → made 2.5× your risk (1:2.5 RR).\n" +
  "−1R → lost your full risk amount.\n" +
  "Lets you compare trades regardless of size.";

function toRatio(r: number): string {
  const abs = Math.abs(r);
  if (abs === 0) return "1:0";
  if (r > 0) return `1:${abs.toFixed(2)}`;
  return `${abs.toFixed(2)}:1`;
}

const sizes = {
  sm: { value: "text-[13px]", ratio: "text-[9px]"  },
  md: { value: "text-[20px]", ratio: "text-[10px]" },
  lg: { value: "text-[28px]", ratio: "text-[11px]" },
};

export function RLabel({
  value,
  showRatio = true,
  size      = "md",
  className,
  muted     = false,
}: Props) {
  const positive = value >= 0;
  const prefix   = positive ? "+" : "";
  const sz       = sizes[size];

  const colorClass = muted
    ? "text-current"
    : positive
    ? "text-emerald-400"
    : "text-red-400";

  return (
    <span className={cx("inline-flex flex-col gap-0.5", className)}>
      <span className="inline-flex items-center gap-1">
        <span
          className={cx(
            "font-mono font-medium tracking-[-0.03em] leading-none",
            sz.value,
            colorClass,
          )}
        >
          {prefix}{value}R
        </span>
        <Tooltip content={R_TOOLTIP} />
      </span>

      {showRatio && value > 0 && (
        <span className={cx("font-mono text-white/30 tracking-[0.04em]", sz.ratio)}>
          1:{value.toFixed(2)} RR
        </span>
      )}
    </span>
  );
}