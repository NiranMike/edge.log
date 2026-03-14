import { AccentKey, accentMap, cx, ds } from "@/style";
import { RevealOnScroll } from "./reveal-on-scroll";

// ─── Data ─────────────────────────────────────────────────────────────────────
const TESTIMONIALS: {
  quote:    string;
  name:     string;
  role:     string;
  initials: string;
  result:   string;
  accent:   AccentKey;
}[] = [
  {
    quote:    "I found out I was losing 80% of my Asia session trades. Cutting that one session alone turned me profitable overnight.",
    name:     "Alex K.",
    role:     "Forex Trader · 3 years",
    initials: "AK",
    result:   "+$3,200/mo",
    accent:   "emerald",
  },
  {
    quote:    "The revenge trading warning was a slap in the face — in a good way. Six revenge trades in a month I couldn't even see myself taking.",
    name:     "Sarah L.",
    role:     "Crypto Trader · 2 years",
    initials: "SL",
    result:   "58% → 71% WR",
    accent:   "violet",
  },
  {
    quote:    "Breakout: 71% win rate. Reversal: 22% win rate. I had no idea. I only trade breakouts now. It's that simple.",
    name:     "Marcus R.",
    role:     "Futures Trader · 5 years",
    initials: "MR",
    result:   "+$7,400/mo",
    accent:   "teal",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function TestimonialsSection() {
  return (
    <section id="traders" className={cx("relative bg-[#030303] overflow-hidden", ds.sectionY)}>
      {/* Fine-line grid */}
      <div className="pointer-events-none absolute inset-0 opacity-60" style={ds.lineGrid} />

      <div className={cx(ds.container, ds.pageX, "relative")}>
        {/* ── Header ── */}
        <RevealOnScroll>
          <div className={ds.sectionLabel}>
            <div className={ds.sectionLabelLine} />
            <span className={ds.label}>Proof</span>
          </div>
          <h2
            className={cx(ds.heading, "mb-16 sm:mb-20")}
            style={{ fontSize: "clamp(36px,6vw,80px)" }}
          >
            Traders who found<br />
            <span className="text-white/25">their edge.</span>
          </h2>
        </RevealOnScroll>

        {/* ── Grid — 1 col mobile → 3 col lg ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => {
            const a = accentMap[t.accent];
            return (
              <RevealOnScroll key={t.name} delay={i * 90}>
                <div
                  className={cx(
                    "relative border bg-[#060606] p-7 sm:p-8 overflow-hidden",
                    "hover:-translate-y-1 transition-transform duration-300",
                    a.border,
                    a.glow
                  )}
                  style={ds.clip16}
                >
                  {/* Decorative quote mark */}
                  <div className={cx("font-display font-black leading-none opacity-[0.08] absolute -top-2 -left-1 select-none pointer-events-none", a.text)}
                    style={{ fontSize: 90 }}>
                    &ldquo;
                  </div>

                  {/* Quote */}
                  <p className="relative font-mono text-[13px] sm:text-[14px] text-white/50 leading-relaxed mb-8">
                    {t.quote}
                  </p>

                  {/* Author row */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className={cx("w-10 h-10 flex items-center justify-center border font-display font-black text-[13px] shrink-0", a.border, a.bg, a.text)}
                      style={ds.clip12}
                    >
                      {t.initials}
                    </div>

                    {/* Name + role */}
                    <div className="min-w-0">
                      <p className="font-mono text-[12px] font-bold text-white/80 truncate">{t.name}</p>
                      <p className="font-mono text-[10px] text-white/25 truncate">{t.role}</p>
                    </div>

                    {/* Result */}
                    <p
                      className={cx("ml-auto font-mono text-[12px] sm:text-[13px] font-black shrink-0", a.text)}
                      style={{ textShadow: `0 0 18px ${a.glowHex}` }}
                    >
                      {t.result}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}