import Link from "next/link";
 
const INSIGHT_ITEMS = [
  { icon: "◈", text: "Win rate by session (Asia, London, NY)" },
  { icon: "⌬", text: "Your actual R expectancy vs assumptions" },
  { icon: "≡", text: "Which pairs you actually perform on" },
  { icon: "○", text: "Patterns you follow vs patterns you break" },
];
 
export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px] text-center px-4 sm:px-8 py-10 sm:py-14 animate-fade-up">
 
      {/* Chart illustration */}
      <div className="mb-6 sm:mb-8">
        <svg width="72" height="52" viewBox="0 0 72 52" fill="none" className="opacity-30">
        <path d="M4 46 L16 30 L28 36 L42 16 L56 24 L68 8" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="68" cy="8" r="3" fill="#4ade80" />
        <line x1="4" y1="50" x2="68" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      </svg>
      </div>
 
      <h2 className="font-mono font-normal text-[18px] sm:text-[20px] tracking-[-0.025em] text-white mb-3 leading-snug">
        Your edge is waiting<br/>
        <span className="text-white/35">to be found.</span>
      </h2>
 
      <p className="font-mono text-[11px] sm:text-[12px] leading-[1.75] text-white/35 max-w-[320px] sm:max-w-[360px] mb-7 sm:mb-8">
        Most traders don't know their actual win rate, average R, or which
        conditions they perform best in. The data is in your trades.
      </p>
 
      {/* Insight list — full width on mobile, constrained on sm+ */}
      <div className="w-full max-w-[380px] sm:max-w-[320px] mb-7 sm:mb-8 text-left">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 mb-3">
          Once you log trades, you'll see →
        </p>
        <div className="flex flex-col gap-[6px]">
          {INSIGHT_ITEMS.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 px-3 py-[10px] sm:py-[9px] bg-white/[0.02] border border-white/[0.04]">
              <span className="text-teal-400/40 text-sm leading-none shrink-0">{icon}</span>
              <span className="font-mono text-[11px] text-white/30 tracking-[0.02em]">{text}</span>
            </div>
          ))}
        </div>
      </div>
 
      <Link
        href="/trades/new"
        className="inline-flex items-center gap-2 px-5 sm:px-6 py-[13px] sm:py-[12px] bg-emerald-400 text-[#07090d] rounde font-mono text-[12px] font-semibold tracking-[0.06em] uppercase no-underline hover:bg-emerald-300 transition-colors duration-150"
      >
        Log your first trade →
      </Link>
 
      <p className="font-mono text-[10px] text-white/15 mt-4 tracking-[0.04em]">
        Takes 60 seconds.
      </p>
    </div>
  );
}