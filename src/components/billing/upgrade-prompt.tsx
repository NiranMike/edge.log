import { UpgradeButton } from "@/components/billing/upgrade-button";
import { cx }            from "@/style";

interface Props {
  feature:     string;
  description: string;
  className?:  string;
  bullets?:    string[];
}

const DEFAULT_BULLETS = [
  "Equity curve & drawdown tracking",
  "Session & weekday performance breakdown",
  "Pair-by-pair profitability analysis",
  "R distribution & direction bias",
];

export function UpgradePrompt({ feature, description, className, bullets = DEFAULT_BULLETS }: Props) {
  return (
    <div className={cx(
      "w-full max-w-[520px] mx-auto flex flex-col items-center text-center",
      className,
    )}>

      <div className="w-11 h-11 rounded-xl bg-[var(--bg-overlay)] border border-[var(--bd)] flex items-center justify-center mb-6">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="3" y="8" width="12" height="9" rx="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4"/>
          <path d="M6 8V6a3 3 0 1 1 6 0v2" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--ac-2-dim)] border border-[var(--ac-2-ring)] mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ac-2)]">Pro</span>
      </div>

      <h2 className="font-display font-black text-[22px] tracking-[-0.04em] text-[var(--tx-1)] mb-3">
        {feature}
      </h2>
      <p className="font-mono text-[12px] text-[var(--tx-3)] leading-relaxed mb-8 max-w-[380px]">
        {description}
      </p>

      {/* Feature list */}
      <ul className="w-full max-w-[300px] text-left space-y-3 mb-4">
        {bullets.map(b => (
          <li key={b} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[var(--ac-2-dim)] border border-[var(--ac-2-ring)] flex items-center justify-center shrink-0">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4l2 2 3-3.5" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-mono text-[12px] text-[var(--tx-2)]">{b}</span>
          </li>
        ))}
      </ul>

      <UpgradeButton label="Upgrade to Pro — $19/mo" />

      <p className="font-mono text-[10px] text-[var(--tx-4)] mt-3">
        Cancel anytime · Instant access
      </p>
    </div>
  );
}