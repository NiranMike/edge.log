import Link from "next/link";
import { cx, ds } from "@/style";

const PRODUCT = [
  { label: "Features",    href: "#features"   },
  { label: "How it works", href: "#howItWorks" },
  { label: "Pricing",     href: "/pricing"    },
];

const LEGAL = [
  { label: "Privacy",  href: "/privacy" },
  { label: "Terms",    href: "/terms"   },
];

const SOCIAL = [
  { label: "Twitter",  href: "#" },
  { label: "Discord",  href: "#" },
];

export function LandingFooter() {
  return (
    <footer className="relative bg-black z-10 border-t border-white/[0.05]">
      {/* Gradient accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      <div className={cx(ds.container, ds.pageX, "py-14 sm:py-16")}>
        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="relative w-6 h-6 shrink-0">
                <div className="absolute inset-0 border border-emerald-400/40 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
                <div className="absolute inset-[4px] bg-emerald-400/20 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500 delay-75" />
              </div>
              <span className="font-display font-black text-[15px] tracking-[-0.04em] text-white/70">
                EDGE<span className="text-emerald-400/70">.</span>LOG
              </span>
            </Link>
            <p className="font-mono text-[11px] text-white/20 leading-relaxed max-w-[200px]">
              Your trading journal that turns patterns into profits.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-4">Product</p>
            <ul className="space-y-2.5 list-none">
              {PRODUCT.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith("/") ? (
                    <Link href={href} className="font-mono text-[11px] text-white/20 hover:text-white/55 transition-colors duration-150">
                      {label}
                    </Link>
                  ) : (
                    <a href={href} className="font-mono text-[11px] text-white/20 hover:text-white/55 transition-colors duration-150">
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-4">Legal</p>
            <ul className="space-y-2.5 list-none">
              {LEGAL.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="font-mono text-[11px] text-white/20 hover:text-white/55 transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-4">Connect</p>
            <ul className="space-y-2.5 list-none">
              {SOCIAL.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="font-mono text-[11px] text-white/20 hover:text-white/55 transition-colors duration-150">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-[9px] text-white/12 uppercase tracking-widest">
            © {new Date().getFullYear()} Edge.Log · All rights reserved
          </span>
          <span className="font-mono text-[9px] text-white/8 uppercase tracking-widest">
            Trade Smarter. Journal Faster.
          </span>
        </div>
      </div>
    </footer>
  );
}
