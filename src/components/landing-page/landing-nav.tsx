"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cx, ds } from "@/style";
import { NAV_LINKS } from "@/const/landing-page-const";




function useLiveClock(ref: React.RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    function tick() {
      if (!ref.current) return;
      ref.current.textContent = new Date().toLocaleTimeString("en-US", {
        hour:   "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ref]);
}

export function LandingNav() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const clockRef = useRef<HTMLSpanElement>(null);
  useLiveClock(clockRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [mobileOpen]);

  return (
    <>
      <div className="hidden lg:flex items-center justify-between px-5 sm:px-8 lg:px-14 py-1.5 border-b border-white/[0.04] bg-[#07090d]">
        <div className="flex items-center gap-5">
          {[
            { sym: "ES1!", val: "+0.42%"  },
            { sym: "NQ1!", val: "+0.61%"  },
            { sym: "EURUSD", val: "-0.12%" },
          ].map(({ sym, val }) => (
            <span key={sym} className="font-mono text-[9px] text-white/20 tracking-widest">
              {sym}{" "}
              <span className={val.startsWith("+") ? "text-emerald-400/60" : "text-red-400/60"}>
                {val}
              </span>
            </span>
          ))}
        </div>
        <span className="font-mono text-[9px] text-white/18 tracking-widest">
          UTC <span ref={clockRef} />
        </span>
      </div>

      <header
        className={cx(
          "sticky top-0 z-50 flex items-center justify-between",
          "px-5 sm:px-8 lg:px-14 h-14",
          "transition-all duration-300",
          scrolled
            ? "bg-[#07090d]/90 backdrop-blur-md border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 border border-emerald-400/40 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
            <div className="absolute inset-[4px] bg-emerald-400/20 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500 delay-75" />
          </div>
          <span className="font-display font-black text-[15px] tracking-[-0.04em] text-white">
            EDGE<span className="text-emerald-400">.</span>LOG
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => {
            const cls = "font-mono text-[10px] uppercase tracking-[0.16em] text-white/30 hover:text-white/70 transition-colors duration-150 relative group";
            const underline = <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-emerald-400/50 group-hover:w-full transition-all duration-300" />;
            return href.startsWith("/") ? (
              <Link key={href} href={href} className={cls}>
                {label}{underline}
              </Link>
            ) : (
              <a key={href} href={href} className={cls}>
                {label}{underline}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={cx(
              ds.btnSecondary,
              "px-4 py-2 text-[10px] tracking-[0.14em]",
            )}
            style={ds.clip12}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className={cx(
              "group relative overflow-hidden",
              ds.btnPrimary,
              "px-5 py-2 text-[10px] tracking-[0.14em]",
            )}
            style={ds.clip12}
          >
            <span className={ds.btnShimmer} />
            <span className="relative z-10">Get Started →</span>
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={cx(
              "block w-5 h-px bg-white/50 transition-all duration-300 origin-center",
              mobileOpen && "rotate-45 translate-y-[6px]",
            )}
          />
          <span
            className={cx(
              "block w-5 h-px bg-white/50 transition-all duration-300",
              mobileOpen && "opacity-0 scale-x-0",
            )}
          />
          <span
            className={cx(
              "block w-5 h-px bg-white/50 transition-all duration-300 origin-center",
              mobileOpen && "-rotate-45 -translate-y-[6px]",
            )}
          />
        </button>
      </header>

      <div
        className={cx(
          "md:hidden fixed inset-x-0 top-[calc(2.5rem+3.5rem)] z-40",  // below status bar + nav
          "border-b border-white/[0.06] bg-[#07090d]/95 backdrop-blur-md",
          "transition-all duration-300 overflow-hidden",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="flex flex-col px-5 py-6 gap-1">
          {NAV_LINKS.map(({ label, href }, i) => {
            const cls = "font-mono text-[11px] uppercase tracking-[0.18em] text-white/35 hover:text-white/70 py-3 border-b border-white/[0.04] transition-colors duration-150";
            return href.startsWith("/") ? (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cls} style={{ transitionDelay: `${i * 30}ms` }}>
                {label}
              </Link>
            ) : (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className={cls} style={{ transitionDelay: `${i * 30}ms` }}>
                {label}
              </a>
            );
          })}

          <div className="flex flex-col gap-2.5 mt-5">
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className={cx(
                "group relative overflow-hidden text-center",
                ds.btnPrimary,
                "px-5 py-3.5 text-[11px] tracking-[0.14em]",
              )}
              style={ds.clip12}
            >
              <span className={ds.btnShimmer} />
              <span className="relative z-10">Get Started Free →</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={cx(
                "text-center",
                ds.btnSecondary,
                "px-5 py-3.5 text-[11px] tracking-[0.14em]",
              )}
              style={ds.clip12}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}