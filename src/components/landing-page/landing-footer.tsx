import { cx, ds } from "@/style";

const LINKS  = ["Privacy", "Terms", "Twitter", "Discord"] as const;

export function LandingFooter() {
  return (
    <footer
      className={cx(
        "relative bg-black z-10",
        "border-t border-white/[0.05]"
      )}
    >
      <div
        className={cx(
          ds.container,
          ds.pageX,
          "py-8 sm:py-10",
          "flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6 shrink-0">
            <div className="absolute inset-0 border border-emerald-400/30 rotate-45" />
            <div className="absolute inset-[4px] bg-emerald-400/15 rotate-45" />
          </div>
          <span className="font-display font-black text-[15px] tracking-[-0.04em] text-white/60">
            EDGE<span className="text-emerald-400/60">.</span>LOG
          </span>
          <span className="font-mono text-[9px] text-white/15 ml-1 uppercase tracking-widest">
            © {new Date().getFullYear()}
          </span>
        </div>

        <ul className="flex flex-wrap justify-center gap-5 sm:gap-8 list-none">
          {LINKS.map(item => (
            <li key={item}>
              <a
                href="#"
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/20 hover:text-white/55 transition-colors duration-150"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <p className="font-mono text-[9px] text-white/10 uppercase tracking-widest text-center sm:text-right">
          Trade Smarter. Journal Faster.
        </p>
      </div>
    </footer>
  );
}