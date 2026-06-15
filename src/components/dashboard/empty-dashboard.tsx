import Link from "next/link";
 
const INSIGHT_ITEMS = [
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    text: "Win rate by session (Asia, London, NY)",
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    text: "Your actual R expectancy vs assumptions",
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>,
    text: "Which pairs you actually perform on",
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    text: "Patterns you follow vs patterns you break",
  },
];
 
export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px] text-center px-4 sm:px-8 py-10 sm:py-14 animate-fade-up">
 
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
 
      <div className="w-full max-w-[380px] sm:max-w-[320px] mb-7 sm:mb-8 text-left">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 mb-3">
          Once you log trades, you'll see
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
        className="group relative overflow-hidden inline-flex items-center gap-2 px-5 sm:px-6 py-[12px] bg-emerald-400 rounded-lg text-[#07090d] font-mono text-[11px] font-medium tracking-[0.06em] uppercase no-underline hover:brightness-110 active:scale-[0.97] transition-all duration-150"
      >
        Log your first trade
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        <div className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12 pointer-events-none" />
      </Link>
 
      <p className="font-mono text-[10px] text-white/15 mt-4 tracking-[0.04em]">
        Takes 60 seconds.
      </p>
    </div>
  );
}