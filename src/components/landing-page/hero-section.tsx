"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function useCountUp(target: number, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let rafId: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start]);
  return val;
}

function Sparkline({ points, up }: { points: number[]; up: boolean }) {
  const w = 72, h = 26;
  const min = Math.min(...points), max = Math.max(...points);
  const norm = points.map(p => h - 2 - ((p - min) / (max - min + 1)) * (h - 4));
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const d = norm.map((y, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  const color = up ? "#10b981" : "#ef4444";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`sg${up ? "u" : "d"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg${up ? "u" : "d"})`} />
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MiniBarChart() {
  const data = [
    { h: 40, up: true  }, { h: 65, up: true  }, { h: 45, up: false },
    { h: 80, up: true  }, { h: 55, up: false }, { h: 90, up: true  },
    { h: 70, up: true  }, { h: 85, up: true  }, { h: 60, up: false },
    { h: 95, up: true  }, { h: 75, up: true  }, { h: 88, up: true  },
  ];
  return (
    <div className="flex items-end gap-0.75" style={{ height: 36 }}>
      {data.map(({ h, up }, i) => (
        <div
          key={i}
          className="flex-1 rounded-xs"
          style={{
            height: `${h}%`,
            background: up
              ? "linear-gradient(to top,#059669,#34d399)"
              : "linear-gradient(to top,#dc2626,#f87171)",
            opacity: 0.8,
            animation: `barGrow 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.035}s both`,
          }}
        />
      ))}
    </div>
  );
}

const TRADES = [
  { sym: "NQ",   side: "LONG",  entry: "18,420", exit: "18,611", pnl: "+$1,910", pct: "+1.04%", up: true,  spark: [20,35,28,45,38,52,61,55,70,75] },
  { sym: "TSLA", side: "SHORT", entry: "248.40", exit: "241.20", pnl: "+$720",   pct: "+2.90%", up: true,  spark: [80,70,75,60,55,48,42,38,32,28] },
  { sym: "SPY",  side: "LONG",  entry: "512.10", exit: "510.80", pnl: "−$130",   pct: "−0.25%", up: false, spark: [30,35,33,40,38,35,30,28,25,22] },
];

export function HeroSection() {
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const pnl    = useCountUp(284720, 2000, started);
  const trades = useCountUp(1247,   1800, started);
  const wr     = useCountUp(68,     1600, started);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setStarted(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTab(p => (p + 1) % TRADES.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden pt-20"
      style={{ background: "#07090d", fontFamily: "'DM Mono', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@600;700;800&display=swap');

        :root {
          --g: #10b981;
          --gd: rgba(16,185,129,0.1);
          --r: #ef4444;
          --b: #3b82f6;
          --s: rgba(255,255,255,0.03);
          --br: rgba(255,255,255,0.065);
          --muted: rgba(255,255,255,0.28);
        }

        @keyframes barGrow {
          from { transform: scaleY(0); transform-origin: bottom; }
          to   { transform: scaleY(1); transform-origin: bottom; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float   {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-7px) rotate(0.25deg); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes scan {
          0%,100% { opacity: 0; transform: translateX(-100%); }
          50%      { opacity: 1; transform: translateX(100vw); }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .syne { font-family: 'Syne', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }

        .a1 { animation: slideRight 0.65s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .a2 { animation: slideUp   0.65s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .a3 { animation: slideUp   0.65s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
        .a4 { animation: slideUp   0.65s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
        .a5 { animation: slideUp   0.65s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
        .a6 { animation: slideUp   0.75s cubic-bezier(0.16,1,0.3,1) 0.44s both; }

        .card-float { animation: float 6s ease-in-out infinite; }
        .card-shadow { box-shadow: 0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.65), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08); }
        .glow-btn    { box-shadow: 0 0 0 1px rgba(16,185,129,0.35), 0 4px 24px rgba(16,185,129,0.22); }

        .tab-row { transition: background 0.2s, border-color 0.2s; }
        .tab-row:hover { background: rgba(255,255,255,0.02) !important; }
        .tab-active { background: rgba(16,185,129,0.07) !important; border-color: rgba(16,185,129,0.22) !important; }
      `}</style>

      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base */}
        <div className="absolute inset-0" style={{ background: "#07090d" }} />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #10b981 0%, transparent 65%)", transform: "translate(30%,-20%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 65%)", transform: "translate(-30%,30%)" }} />
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(7,9,13,0.8) 100%)" }} />
        {/* Noise */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* Hero body */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-10 lg:gap-12 items-center px-5 sm:px-8 lg:px-14 pt-8 pb-20 lg:pt-4 max-w-[1300px] w-full mx-auto">

        {/* LEFT */}
        <div className="flex flex-col items-start">

          <div className="a2 inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full mono text-[10px] tracking-[0.18em] uppercase text-emerald-400/80" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)" }}>
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-400" />
            </span>
            Live Beta · 1,247 active traders
          </div>

          <h1 className="a3 syne font-extrabold text-white leading-[1.06] tracking-tight mb-5" style={{ fontSize: "clamp(30px,4vw,50px)" }}>
            Stop losing trades<br />
            <span style={{ color: "var(--g)", filter: "drop-shadow(0 0 20px rgba(16,185,129,0.4))" }}>to your emotions.</span>
          </h1>

          <p className="a3 mono text-[13px] leading-relaxed mb-7 max-w-md" style={{ color: "var(--muted)" }}>
            EdgeLog is a 30-second trade journal that surfaces your hidden patterns — so you play your{" "}
            <span style={{ color: "rgba(255,255,255,0.55)" }}>A-game every session.</span>
          </p>

          <div className="a4 flex flex-wrap gap-2 mb-7">
            {["30-sec entry","AI pattern detection","Emotion tagging","Risk analytics"].map(f => (
              <span key={f} className="mono text-[10px] tracking-wide px-3 py-1.5 rounded-full text-white/35" style={{ background: "var(--s)", border: "1px solid var(--br)" }}>
                {f}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="a5 flex items-stretch gap-3 mb-8 w-full max-w-xs">
            {[
              { label: "P&L Tracked", val: `$${pnl.toLocaleString()}`, color: "#10b981" },
              { label: "Trades",      val: trades.toLocaleString(),    color: "#38bdf8" },
              { label: "Win Rate ↑",  val: `+${wr}%`,                  color: "#f59e0b" },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex-1 rounded-xl p-3 flex flex-col gap-1.5" style={{ background: "var(--s)", border: "1px solid var(--br)" }}>
                <span className="syne font-bold tabular-nums leading-none" style={{ color, fontSize: "clamp(16px,2.5vw,24px)", filter: `drop-shadow(0 0 8px ${color}60)` }}>{val}</span>
                <span className="mono text-[9px] tracking-wider uppercase" style={{ color: "var(--muted)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="a5 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="group relative overflow-hidden rounded-xl mono font-medium text-[12px] tracking-wide text-black text-center px-8 py-3.5 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 0 0 1px rgba(16,185,129,0.35), 0 6px 28px rgba(16,185,129,0.28)" }}
            >
              <span className="relative z-10">→ Start Free</span>
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
            </Link>
            <a href="#features" className="mono text-[12px] tracking-wide text-white/35 text-center px-8 py-3.5 rounded-xl hover:text-white/60 hover:bg-white/[0.04] transition-all duration-150" style={{ border: "1px solid var(--br)" }}>
              Watch demo ↓
            </a>
          </div>

          {/* Social proof */}
          <div className="a6 flex items-center gap-3 mt-6">
            <div className="flex -space-x-2">
              {["#10b981","#38bdf8","#f59e0b","#e879f9","#fb923c"].map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-[2px] flex items-center justify-center text-[7px] font-black" style={{ background: `${c}18`, borderColor: "#07090d", color: c }}>
                  {String.fromCharCode(65+i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-teal-400 text-[9px]">★★★★★</span>
              <span className="mono text-[10px]" style={{ color: "var(--muted)" }}>4.9 · 1,247 traders</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Dashboard card */}
        <div className="a6 card-float flex justify-center lg:justify-end">
          <div
            className="relative w-full max-w-[460px] rounded-2xl overflow-hidden card-shadow"
            style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Animated scan line */}
            <div
              className="absolute top-[38%] h-px pointer-events-none z-10"
              style={{ background: "linear-gradient(90deg,transparent,rgba(16,185,129,0.5),transparent)", width: "40%", animation: "scan 5s ease-in-out infinite" }}
            />

            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--br)" }}>
              <div className="flex items-center gap-2.5">
                <div className="relative w-2 h-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="absolute inset-0 rounded-full bg-emerald-400" style={{ animation: "pulseRing 2.5s ease-out infinite" }} />
                </div>
                <span className="mono text-[10px] tracking-wider text-white/40">Today's Session · Feb 28</span>
              </div>
              <div className="flex items-center gap-1.5">
                {["#ef4444","#f59e0b","#10b981"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.5 }} />)}
              </div>
            </div>

            {/* PnL section */}
            <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid var(--br)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="mono text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--muted)" }}>Net P&L</p>
                  <p className="syne font-bold text-emerald-400 leading-none tabular-nums" style={{ fontSize: 42, filter: "drop-shadow(0 0 20px rgba(16,185,129,0.45))" }}>
                    +$2,840
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="mono text-[10px] text-emerald-400/70">▲ +4.2% today</span>
                    <span className="mono text-[10px]" style={{ color: "var(--muted)" }}>· 3 trades · 6h</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 pt-1">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="#10b981" strokeWidth="1.2"/><path d="M5 3v2.5L6.5 7" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    <span className="mono text-[10px] text-emerald-400 font-medium">FOCUS 9.1</span>
                  </div>
                  <span className="mono text-[9px]" style={{ color: "var(--muted)" }}>Emotion score</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="mono text-[9px] tracking-[0.18em] uppercase mb-2" style={{ color: "var(--muted)" }}>Win/Loss by Hour</p>
                <MiniBarChart />
              </div>
            </div>

            {/* Trades */}
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center justify-between mb-3">
                <p className="mono text-[9px] tracking-[0.18em] uppercase" style={{ color: "var(--muted)" }}>Recent Trades</p>
                <span className="mono text-[9px] text-emerald-400/50 hover:text-emerald-400 transition-colors cursor-pointer">View all →</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {TRADES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`w-full text-left rounded-xl px-3 py-2.5 border tab-row ${activeTab === i ? "tab-active" : ""}`}
                    style={{ background: "var(--s)", borderColor: "var(--br)" }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="mono font-medium text-[11px] text-white/80 w-9 shrink-0">{t.sym}</span>
                        <span className={`mono text-[8px] px-1.5 py-0.5 rounded font-medium tracking-wider shrink-0 ${t.side === "LONG" ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
                          {t.side}
                        </span>
                        <span className="mono text-[9px] hidden sm:block truncate" style={{ color: "var(--muted)" }}>{t.entry} → {t.exit}</span>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <Sparkline points={t.spark} up={t.up} />
                        <div className="text-right w-14">
                          <p className={`mono font-medium text-[11px] ${t.up ? "text-emerald-400" : "text-red-400"}`}>{t.pnl}</p>
                          <p className="mono text-[9px]" style={{ color: "var(--muted)" }}>{t.pct}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI insight strip */}
            <div className="mx-5 mb-5 mt-3 rounded-xl p-3.5 flex items-center gap-3" style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.14)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.12)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="2" width="10" height="10" rx="2" stroke="#3b82f6" strokeWidth="1.2"/>
                  <path d="M4.5 7l2 2L9.5 5" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="mono text-[10px] text-blue-400 mb-0.5 font-medium">AI Pattern Detected</p>
                <p className="mono text-[10px] truncate" style={{ color: "var(--muted)" }}>You trade 40% better in AM sessions →</p>
              </div>
              <span className="mono text-[9px] text-blue-400/50 shrink-0">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="relative z-10 overflow-hidden py-2" style={{ borderTop: "1px solid var(--br)", background: "rgba(0,0,0,0.3)" }}>
        <div className="flex whitespace-nowrap" style={{ animation: "ticker 22s linear infinite" }}>
          {[...Array(2)].fill(["NQ +1.04%","ES +0.72%","BTC +2.1%","TSLA −0.9%","SPY +0.3%","NVDA +1.8%","AAPL +0.5%","QQQ +0.6%","GC +0.2%","CL −1.1%"]).flat().map((t, i) => {
            const up = t.includes("+");
            return (
              <span key={i} className="inline-flex items-center gap-1.5 px-6 mono text-[10px] tracking-widest shrink-0" style={{ color: up ? "rgba(16,185,129,0.55)" : "rgba(239,68,68,0.55)" }}>
                <span className="w-1 h-1 rounded-full" style={{ background: up ? "#10b981" : "#ef4444", opacity: 0.5 }} />
                {t}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}