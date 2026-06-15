import { accentMap, cx, ds } from "@/style";
import { RevealOnScroll } from "./reveal-on-scroll";
import { TESTIMONIALS } from "@/const/landing-page-const";



export function TestimonialsSection() {
  return (
    <section id="traders" className={cx("relative bg-[#030303] overflow-hidden", ds.sectionY)}>
      <div className="pointer-events-none absolute inset-0 opacity-60" style={ds.lineGrid} />

      {/* Top gradient divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-400/15 to-transparent" />

      <div className={cx(ds.container, ds.pageX, "relative")}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => {
            const a = accentMap[t.accent];
            return (
              <RevealOnScroll key={t.name} delay={i * 90}>
                <div
                  className={cx(
                    "group relative border bg-[#060606] p-7 sm:p-8 overflow-hidden",
                    "hover:-translate-y-1 transition-all duration-300",
                    a.border,
                    a.glow
                  )}
                  style={ds.clip16}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[50px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: a.glowHex }}
                  />

                  <div className={cx("font-display font-black leading-none opacity-[0.08] absolute -top-2 -left-1 select-none pointer-events-none", a.text)}
                    style={{ fontSize: 90 }}>
                    &ldquo;
                  </div>

                  <p className="relative font-mono text-[13px] sm:text-[14px] text-white/50 leading-relaxed mb-8 group-hover:text-white/60 transition-colors duration-300">
                    {t.quote}
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className={cx("w-10 h-10 flex items-center justify-center border font-display font-black text-[13px] shrink-0", a.border, a.bg, a.text)}
                      style={ds.clip12}
                    >
                      {t.initials}
                    </div>

                    <div className="min-w-0">
                      <p className="font-mono text-[12px] font-bold text-white/80 truncate">{t.name}</p>
                      <p className="font-mono text-[10px] text-white/25 truncate">{t.role}</p>
                    </div>

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

      {/* Bottom gradient divider */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent" />
    </section>
  );
}
