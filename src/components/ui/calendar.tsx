"use client";

import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cx } from "@/style";

export type CalendarProps = DayPickerProps;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cx("w-full", className)}
      classNames={{
        months:        "flex flex-col",
        month:         "space-y-3",
        month_caption: "hidden",
        nav:           "hidden",
        month_grid:    "w-full border-collapse",
        weekdays:      "flex",
        weekday:       "font-mono text-[9px] uppercase tracking-[0.14em] text-white/20 w-full text-center py-2",
        week:          "flex w-full",
        day:           "relative w-full p-0",
        day_button:    cx(
          "w-full aspect-square sm:aspect-auto sm:h-[88px] p-1.5 sm:p-2 rounded-[6px] border",
          "font-mono text-[11px] sm:text-[12px]",
          "border-white/[0.04] bg-white/[0.01]",
          "transition-all duration-150",
          "flex flex-col justify-between text-left",
          "text-white/18",
        ),
        outside:       "opacity-0 pointer-events-none",
        hidden:        "invisible",
        today:         "",
        ...classNames,
      }}
      {...props}
    />
  );
}
