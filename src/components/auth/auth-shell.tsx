import Link       from "next/link";
import { cx, ds } from "@/style";

interface AuthShellProps {
  children:    React.ReactNode;
  badge?:      string;
  title:       string;
  description: string;
}

const STATS = [
  { value: "30s",   label: "to log a trade"    },
  { value: "Free",  label: "to start, always"  },
  { value: "$19",   label: "per month for Pro"  },
];

const QUOTES = [
  { text: "Cutting my Asia session alone turned me profitable overnight.", author: "Alex K. · Forex"       },
  { text: "I had no idea my reversal WR was 22%. I only trade breakouts now.", author: "Marcus R. · Futures" },
];

export function AuthShell({ children, badge, title, description }: AuthShellProps) {
  return (
    <div className={cx("min-h-screen flex flex-col lg:flex-row", ds.bgBase)}>

      <aside className="hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col justify-between relative overflow-hidden p-12 xl:p-16 border-r border-[var(--bd)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.18]" style={ds.dotGrid} />
          <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 65%)" }} />
          <div className="absolute top-0 left-0 w-28 h-28 border-l border-t border-emerald-400/10" />
          <div className="absolute bottom-0 right-0 w-28 h-28 border-r border-b border-[var(--bd)]" />
        </div>

        <Link href="/" className="relative flex items-center gap-3 w-fit group">
          <div className="relative w-7 h-7 shrink-0">
            <div className="absolute inset-0 border border-emerald-400/40 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
            <div className="absolute inset-[5px] bg-emerald-400/20 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500 delay-75" />
          </div>
          <span className="font-display font-black text-[18px] tracking-[-0.04em] text-[var(--tx-1)]">
            EDGE<span className="text-[var(--ac-1)]">.</span>LOG
          </span>
        </Link>

        <div className="relative space-y-10">
          <div>
            <p className={cx(ds.label, "mb-3")}>Trusted by traders</p>
            <h2 className="font-display font-extrabold text-[var(--tx-1)] leading-[1.08] tracking-tight"
              style={{ fontSize: "clamp(26px,2.8vw,38px)" }}>
              Stop trading on gut.<br />
              <span className="text-[var(--tx-3)]">Start trading on data.</span>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {STATS.map(({ value, label }) => (
              <div key={label} className="p-4 border border-[var(--bd)] bg-[var(--bg-overlay)]">
                <p className="font-display font-black text-[var(--ac-1)] leading-none mb-1.5"
                  style={{ fontSize: "clamp(22px,2.2vw,30px)", textShadow: "0 0 20px var(--ac-1-glow)" }}>
                  {value}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--tx-3)]">{label}</p>
              </div>
            ))}
          </div>

          <div className="border-l-2 border-emerald-400/25 pl-4 space-y-5">
            {QUOTES.map(({ text, author }) => (
              <div key={author}>
                <p className="font-mono text-[12px] text-[var(--tx-3)] leading-relaxed italic">&ldquo;{text}&rdquo;</p>
                <p className="font-mono text-[10px] text-[var(--ac-1)] opacity-50 mt-1.5">{author}</p>
              </div>
            ))}
          </div>
        </div>

        <p className={ds.micro}>Trade Smarter. Journal Faster.</p>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center relative px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16 xl:px-16">

        <div className="hidden lg:block absolute top-0 right-0 w-20 h-20 border-r border-t border-[var(--bd)]" />
        <div className="hidden lg:block absolute bottom-0 left-0 w-20 h-20 border-l border-b border-[var(--bd)]" />

        <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8 group">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 border border-emerald-400/40 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
            <div className="absolute inset-[4px] bg-emerald-400/20 rotate-45" />
          </div>
          <span className="font-display font-black text-[16px] tracking-[-0.04em] text-[var(--tx-1)]">
            EDGE<span className="text-[var(--ac-1)]">.</span>LOG
          </span>
        </Link>

        <div className="lg:hidden w-full max-w-[440px] mb-8">
          <div className="grid grid-cols-3 gap-2">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-3 px-2 border border-[var(--bd)] bg-[var(--bg-overlay)] rounded-lg">
                <p className="font-display font-black text-[var(--ac-1)] text-[18px] leading-none mb-1"
                  style={{ textShadow: "0 0 16px var(--ac-1-glow)" }}>
                  {value}
                </p>
                <p className="font-mono text-[8px] uppercase tracking-widest text-[var(--tx-3)] text-center">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[440px]">
          {badge && (
            <div className="inline-flex items-center gap-2 mb-5 sm:mb-6 px-3 py-1.5 border border-emerald-400/18 bg-emerald-400/[0.06]">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400/70">{badge}</span>
            </div>
          )}

          <h1 className="font-display font-extrabold text-[var(--tx-1)] tracking-tight leading-tight mb-2"
            style={{ fontSize: "clamp(20px,3vw,30px)" }}>
            {title}
          </h1>
          <p className={cx(ds.body, "mb-6 sm:mb-8 text-[13px]")}>{description}</p>

          {children}
        </div>
      </main>
    </div>
  );
}