"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  AreaSeries,
  type IChartApi,
  type ISeriesApi,
  type AreaSeriesOptions,
  ColorType,
  CrosshairMode,
} from "lightweight-charts";
import { cx } from "@/style";
import type { EquityPoint } from "@/types";

interface Props {
  curve: EquityPoint[];
}

interface TooltipData {
  date:        string;
  pair:        string;
  tradeR:      number;
  cumulativeR: number;
  drawdown:    number;
  x:           number;
  y:           number;
}

export function EquityCurve({ curve }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const seriesRef    = useRef<ISeriesApi<"Area"> | null>(null);
  const [tooltip,    setTooltip] = useState<TooltipData | null>(null);
  const [mounted,    setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const finalR    = curve[curve.length - 1]?.cumulativeR ?? 0;
  const maxDD     = curve.length ? Math.min(...curve.map(p => p.drawdown)) : 0;
  const lineColor = finalR >= 0 ? "#4ade80" : "#f87171";
  const areaTop   = finalR >= 0 ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)";

  useEffect(() => {
    if (!mounted || !containerRef.current || curve.length === 0) return;

    const chart = createChart(containerRef.current, {
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor:  "rgba(255,255,255,0.25)",
        fontFamily: "var(--font-mono)",
        fontSize:   10,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.03)" },
        horzLines: { color: "rgba(255,255,255,0.03)" },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          color:        "rgba(255,255,255,0.12)",
          width:        1,
          style:        1,
          labelVisible: false,
        },
        horzLine: {
          color:                "rgba(255,255,255,0.12)",
          width:                1,
          style:                1,
          labelVisible:         true,
          labelBackgroundColor: "#0d1117",
        },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins:  { top: 0.15, bottom: 0.15 },
        ticksVisible:  false,
      },
      timeScale: {
        borderVisible: false,
      },
      handleScroll: { mouseWheel: false, pressedMouseMove: true },
      handleScale:  { mouseWheel: false, pinch: true },
    });

    chartRef.current = chart;

    const series = chart.addSeries(AreaSeries, {
      lineColor,
      topColor:                       areaTop,
      bottomColor:                    "transparent",
      lineWidth:                      2,
      crosshairMarkerVisible:         true,
      crosshairMarkerRadius:          4,
      crosshairMarkerBorderColor:     "#0d1117",
      crosshairMarkerBackgroundColor: lineColor,
      priceLineVisible:               false,
      lastValueVisible:               false,
    } satisfies Partial<AreaSeriesOptions>);

    seriesRef.current = series;

    // ── Build chart data ──────────────────────────────────────────────────────
    // Problem 1: Multiple trades on the same date produce duplicate timestamps.
    // Lightweight Charts requires strictly unique ascending timestamps.
    // Fix: deduplicate by date, keeping the final cumulative R for each day.

    const dedupedByDate = new Map<string, number>();
    for (const p of curve) {
      dedupedByDate.set(p.date, p.cumulativeR);
    }

    const entries = Array.from(dedupedByDate.entries());

    // Problem 2: Without a zero origin, the curve starts floating mid-chart
    // at whatever the first trade's cumulative R is (e.g. +6R).
    // Fix: prepend a zero point on the day before the first trade.
    const firstDate = entries[0]?.[0];
    const zeroPoint = firstDate
      ? (() => {
          const d = new Date(firstDate);
          d.setDate(d.getDate() - 1);
          const y   = d.getFullYear();
          const mon = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return { time: `${y}-${mon}-${day}` as any, value: 0 };
        })()
      : null;

    const lineData = [
      ...(zeroPoint ? [zeroPoint] : []),
      ...entries.map(([date, value]) => ({ time: date as any, value })),
    ];

    series.setData(lineData);
    chart.timeScale().fitContent();

    series.createPriceLine({
      price:            0,
      color:            "rgba(255,255,255,0.08)",
      lineWidth:        1,
      lineStyle:        2,
      axisLabelVisible: false,
    });

    chart.subscribeCrosshairMove(param => {
      if (!param.point || !param.time || param.point.x < 0 || param.point.y < 0) {
        setTooltip(null);
        return;
      }
      const dateStr = param.time as string;
      const point   = curve.find(p => p.date === dateStr);
      if (!point) { setTooltip(null); return; }

      setTooltip({
        date:        point.date,
        pair:        point.pair,
        tradeR:      point.tradeR,
        cumulativeR: point.cumulativeR,
        drawdown:    point.drawdown,
        x:           param.point.x,
        y:           param.point.y,
      });
    });

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
      chart.timeScale().fitContent();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current  = null;
      seriesRef.current = null;
    };
  }, [mounted, curve, lineColor, areaTop]);

  if (curve.length === 0) {
    return (
      <div className="rounded-xl bg-[#0d1117] border border-white/[0.065] px-5 py-10 text-center">
        <p className="font-mono text-[12px] text-white/20">No equity data</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#0d1117] border border-white/[0.065] overflow-hidden">

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-px bg-teal-400/50" />
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            Equity Curve
          </h2>
        </div>
        <div className="flex items-center gap-5">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/20 mr-2">Total</span>
            <span className={cx("font-mono text-[13px]", finalR >= 0 ? "text-emerald-400" : "text-red-400")}>
              {finalR >= 0 ? "+" : ""}{finalR}R
            </span>
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/20 mr-2">Max DD</span>
            <span className="font-mono text-[13px] text-red-400/60">{maxDD}R</span>
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/20 mr-2">Trades</span>
            <span className="font-mono text-[13px] text-white/40">{curve.length}</span>
          </div>
        </div>
      </div>

      <div className="relative h-[200px] sm:h-[260px] lg:h-[300px]">
        <div ref={containerRef} className="absolute inset-0" />

        {tooltip && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: Math.min(tooltip.x + 12, (containerRef.current?.clientWidth ?? 400) - 190),
              top:  Math.max(tooltip.y - 60, 8),
            }}
          >
            <div
              className="rounded-[8px] border border-white/[0.1] px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
              style={{ backgroundColor: "#0d1117" }}
            >
              <p className="font-mono text-[10px] text-white/30 mb-1">{tooltip.date}</p>
              <p className="font-mono text-[11px] text-white/50 mb-2 tracking-[0.04em]">{tooltip.pair}</p>
              <div className="flex items-start gap-4">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/20 mb-0.5">Trade</p>
                  <p className={cx("font-mono text-[13px]", tooltip.tradeR >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {tooltip.tradeR >= 0 ? "+" : ""}{tooltip.tradeR}R
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/20 mb-0.5">Cumul.</p>
                  <p className={cx("font-mono text-[13px]", tooltip.cumulativeR >= 0 ? "text-white/80" : "text-red-400/70")}>
                    {tooltip.cumulativeR >= 0 ? "+" : ""}{tooltip.cumulativeR}R
                  </p>
                </div>
                {tooltip.drawdown < 0 && (
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/20 mb-0.5">DD</p>
                    <p className="font-mono text-[13px] text-red-400/60">{tooltip.drawdown}R</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}