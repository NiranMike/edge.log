import type { AnalyticsFilters as Filters, MarketSession } from "@/types";

export const DATE_RANGES: { value: Filters["dateRange"]; label: string }[] = [
  { value: "30d",  label: "30d"    },
  { value: "90d",  label: "90d"    },
  { value: "6mo",  label: "6mo"    },
  { value: "1yr",  label: "1yr"    },
  { value: "all",  label: "All"    },
];

export const DIRECTIONS: { value: Filters["direction"]; label: string }[] = [
  { value: "ALL",   label: "All"   },
  { value: "LONG",  label: "▲ Long"  },
  { value: "SHORT", label: "▼ Short" },
];

export const SESSION_META: Record<MarketSession, { color: string; dot: string; hours: string }> = {
  "Asia":     { color: "text-violet-400", dot: "bg-violet-400", hours: "23:00–08:00 UTC" },
  "London":   { color: "text-teal-400",   dot: "bg-teal-400",   hours: "07:00–16:00 UTC" },
  "Overlap":  { color: "text-emerald-400",dot: "bg-emerald-400",hours: "13:00–16:00 UTC" },
  "New York": { color: "text-sky-400",    dot: "bg-sky-400",    hours: "13:00–21:00 UTC" },
  "Closed":   { color: "text-white/20",   dot: "bg-white/20",   hours: "Off-hours"       },
};