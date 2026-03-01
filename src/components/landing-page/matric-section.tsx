"use client";

import { cx, ds, palette } from "@/style";
import { useEffect, useRef, useState } from "react";

// ─── Intersection-triggered count-up ────────────────────────────────────────
function Counter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [val, setVal] = useState(0);
  const ref    = useRef<HTMLDivElement>(null);
  const fired  = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || fired.current) return;
        fired.current = true;
        obs.disconnect();
        let s: number | null = null;
        let raf: number;
        const step = (ts: number) => {
          if (!s) s = ts;
          const p = Math.min((ts - s) / 1600, 1);
          setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const METRICS = [
  { prefix: "+", val: 68,   suffix: "%",   label: "Win Rate Increase",     textClass: ds.textAccent,  glowHex: palette.primaryGlow  },
  { prefix: "",  val: 30,   suffix: "s",   label: "To Log a Trade",        textClass: ds.textAccent2, glowHex: palette.secondaryGlow },
  { prefix: "",  val: 2,    suffix: ".4R", label: "R-Multiple Improvement",textClass: ds.textAccent3, glowHex: palette.tertiaryGlow  },
  { prefix: "",  val: 1247, suffix: "+",   label: "Traders Journaling",    textClass: ds.textPrimary, glowHex: "rgba(255,255,255,0.15)" },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────
export function MetricsSection() {
  return (
    <section className={cx("relative bg-[#060606] border-y border-white/[0.04]")}>
      {/* Subtle vertical divider lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[25, 50, 75].map(pct => (
          <div
            key={pct}
            className="absolute inset-y-0 w-px"
            style={{
              left: `${pct}%`,
              background: `linear-gradient(to bottom, transparent, ${pct === 25 ? palette.primaryGlow : "rgba(255,255,255,0.025)"}, transparent)`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* 2-col on mobile → 4-col on md */}
      <div className={cx(ds.container, "relative grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.04]")}>
        {METRICS.map(({ prefix, val, suffix, label, textClass, glowHex }) => (
          <div
            key={label}
            className="group relative py-12 sm:py-16 md:py-20 px-6 sm:px-8 md:px-10 text-center hover:bg-white/[0.015] transition-colors duration-200 overflow-hidden"
          >
            {/* Number */}
            <div
              className={cx("font-display font-black tabular-nums leading-none tracking-[-0.05em] mb-2.5", textClass)}
              style={{ fontSize: "clamp(36px,5vw,56px)", textShadow: `0 0 50px ${glowHex}` }}
            >
              <Counter target={val} prefix={prefix} suffix={suffix} />
            </div>

            {/* Label */}
            <p className={cx(ds.micro)}>{label}</p>

            {/* Hover glow underline */}
            <div
              className="absolute bottom-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(to right, transparent, ${glowHex}, transparent)` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}