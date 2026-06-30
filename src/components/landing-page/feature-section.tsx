import { accentMap, cx, ds } from "@/style";
import { RevealOnScroll } from "./reveal-on-scroll";
import { FEATURES } from "@/const/landing-page-const";

const ICONS: Record<string, (color: string) => React.ReactNode> = {
  bolt: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  "chart-bar": (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  ),
  trending: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  scale: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M16 7l-4-4-4 4" />
      <path d="M5 12a7 7 0 0 0 14 0" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  ),
  crosshair: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
    </svg>
  ),
  calendar: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  ),
  upload: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
};


export function FeaturesSection() {
  return (
    <section id="features" className={cx("relative bg-black overflow-hidden", ds.sectionY)}>
      <div className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-white/[0.015] whitespace-nowrap tracking-tighter"
        style={{ fontSize: "clamp(80px,18vw,220px)" }}>
        FEATURES
      </div>

      {/* Top gradient divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      <div className={cx(ds.container, ds.pageX, "relative")}>
        <RevealOnScroll>
          <div className={cx(ds.sectionLabel)}>
            <div className={ds.sectionLabelLine} />
            <span className={ds.label}>Core Features</span>
          </div>
          <h2
            className={cx(ds.heading, "mb-16 sm:mb-20")}
            style={{ fontSize: "clamp(36px,6vw,80px)" }}
          >
            Everything serious<br />
            <span className="text-white/25">traders need.</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
          {FEATURES.map((f, i) => {
            const a = accentMap[f.accent];
            const renderIcon = ICONS[f.iconId];
            return (
              <RevealOnScroll key={f.num} delay={i * 55}>
                <div
                  className={cx(
                    "group relative bg-black p-7 sm:p-9 lg:p-10 overflow-hidden cursor-default",
                    "hover:bg-white/[0.025] transition-all duration-300"
                  )}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: a.glowHex }}
                  />

                  {/* Corner accents */}
                  <div className={cx("absolute top-4 right-4 w-5 h-5 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300", a.border)} />
                  <div className={cx("absolute bottom-4 left-4 w-5 h-5 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300", a.border)} />

                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={cx(
                        "w-11 h-11 flex items-center justify-center rounded-lg border transition-all duration-300",
                        "group-hover:scale-110",
                        a.border, a.bg,
                      )}
                    >
                      {renderIcon?.(a.glowHex.replace(/[\d.]+\)$/, "0.8)")) }
                    </div>
                    <span className={cx("font-mono text-[11px] font-bold", "text-white/15")}>{f.num}</span>
                  </div>

                  <h3
                    className="font-display font-black text-[19px] sm:text-[22px] leading-tight tracking-[-0.03em] text-white mb-3 transition-colors duration-300"
                  >
                    {f.title}
                  </h3>

                  <p className={cx(ds.body, "mb-5 text-[12px] sm:text-[13px]")}>{f.desc}</p>

                  <div className={cx("inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] opacity-50 group-hover:opacity-100 transition-opacity duration-300", a.text)}>
                    <span className="w-3 h-px bg-current group-hover:w-6 transition-all duration-300" />
                    {f.tag}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>

      {/* Bottom gradient divider */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </section>
  );
}
