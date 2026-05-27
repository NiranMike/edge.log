import { accentMap, cx, ds } from "@/style";
import { RevealOnScroll } from "./reveal-on-scroll";
import { FEATURES } from "@/const/landing-page-const";



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
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">{f.icon}</span>
                    <span className={cx("font-mono text-[11px] font-bold", "text-white/15")}>{f.num}</span>
                  </div>

                  <h3
                    className="font-display font-black text-[19px] sm:text-[22px] leading-tight tracking-[-0.03em] text-white mb-3 transition-colors duration-300"
                    style={{ textShadow: "none" }}
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
