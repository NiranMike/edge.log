import { cx } from "@/style";
import Link from "next/link";

export function NavLink({
  href, icon, label, sub, active, compact = false, onClick,
}: {
  href: string; icon: string; label: string; sub: string | null;
  active: boolean; compact?: boolean; onClick?: () => void;
}) {
  const isNew = href === "/trades/new";

  if (isNew) {
    return (
      <Link href={href} className="no-underline block mt-2" onClick={onClick}>
        <div className={cx(
          "flex items-center gap-[9px] rounded-lg font-mono text-[12px] tracking-[0.04em] border border-teal-400/25 bg-teal-400/[0.06] text-teal-400 hover:bg-teal-400/[0.12] hover:border-teal-400/40 transition-all duration-150 cursor-pointer",
          compact ? "px-0 py-[10px] justify-center" : "px-3 py-[10px]",
        )}>
          <span className="text-[14px] leading-none">{icon}</span>
          {!compact && <span>{label}</span>}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="no-underline block" onClick={onClick}>
      <div className={cx(
        "flex items-center rounded-lg transition-all duration-150 cursor-pointer group",
        compact ? "gap-0 px-0 py-[9px] justify-center" : "gap-[9px] px-3 py-[9px]",
        active
          ? "bg-white/[0.06] border border-white/[0.08]"
          : "border border-transparent hover:bg-white/[0.03] hover:border-white/[0.04]",
      )}>
        <span className={cx(
          "text-sm leading-none shrink-0 transition-colors duration-150",
          active ? "text-white" : "text-white/30 group-hover:text-white/50",
        )}>
          {icon}
        </span>
        {!compact && (
          <div className="flex flex-col min-w-0 flex-1">
            <span className={cx(
              "font-mono text-[12px] tracking-[0.04em] transition-colors duration-150",
              active ? "text-white" : "text-white/45 group-hover:text-white/65",
            )}>
              {label}
            </span>
            {sub && (
              <span className={cx(
                "font-mono text-[9px] tracking-[0.12em] uppercase transition-colors duration-150",
                active ? "text-white/30" : "text-white/18 group-hover:text-white/28",
              )}>
                {sub}
              </span>
            )}
          </div>
        )}
        {active && !compact && (
          <div className="ml-auto w-[2px] h-4 rounded-full bg-teal-400/60 shrink-0" />
        )}
        {active && compact && (
          <div className="absolute left-0 w-[2px] h-4 rounded-full bg-teal-400/60" />
        )}
      </div>
    </Link>
  );
}