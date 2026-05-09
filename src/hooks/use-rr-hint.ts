import { useMemo } from "react";

interface Prices {
  entry:      string | number;
  stop:       string | number;
  takeProfit: string | number;
  direction:  "LONG" | "SHORT";
}

export interface RRHint {
  r:     number;   // e.g. 2.5
  ratio: string;   // e.g. "1:2.50"
  label: string;   // e.g. "+2.5R target · 1:2.50 RR"
}

export function useRRHint({ entry, stop, takeProfit, direction }: Prices): RRHint | null {
  return useMemo(() => {
    const e  = Number(entry);
    const sl = Number(stop);
    const tp = Number(takeProfit);

    if (!e || !sl || !tp || isNaN(e) || isNaN(sl) || isNaN(tp)) return null;

    const risk = Math.abs(e - sl);
    if (risk === 0) return null;

    const reward = direction === "LONG" ? tp - e : e - tp;
    if (reward <= 0) return null;

    const r     = Math.round((reward / risk) * 100) / 100;
    const ratio = `1:${r.toFixed(2)}`;

    return {
      r,
      ratio,
      label: `+${r}R target · ${ratio} RR`,
    };
  }, [entry, stop, takeProfit, direction]);
}