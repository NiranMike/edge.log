"use client";

import { METRICS } from "@/const/landing-page-const";
import { cx, ds, palette } from "@/style";
import { useEffect, useRef, useState } from "react";

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



export function MetricsSection() {
  return (
    <section className={cx("relative bg-[#060606] border-y border-white/[0.04]")}>
      {/* Top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent z-10" />
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

      <div className={cx(ds.container, "relative grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.04]")}>
        {METRICS.map(({ prefix, val, suffix, label, textClass, glowHex }) => (
          <div
            key={label}
            className="group relative py-12 sm:py-16 md:py-20 px-6 sm:px-8 md:px-10 text-center hover:bg-white/[0.015] transition-colors duration-200 overflow-hidden"
          >
            <div
              className={cx("font-display font-black tabular-nums leading-none tracking-[-0.05em] mb-2.5", textClass)}
              style={{ fontSize: "clamp(36px,5vw,56px)", textShadow: `0 0 50px ${glowHex}` }}
            >
              <Counter target={val} prefix={prefix} suffix={suffix} />
            </div>

            <p className={cx(ds.micro)}>{label}</p>

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