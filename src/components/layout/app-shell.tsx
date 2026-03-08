"use client";
// components/layout/AppShell.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { cx } from "@/style";

const NAV = [
  { href: "/dashboard",  icon: "◈", label: "Dashboard",  sub: "overview"  },
  { href: "/trades",     icon: "≡", label: "Trades",     sub: "journal"   },
  { href: "/analytics",  icon: "⌬", label: "Analytics",  sub: "patterns"  },
  { href: "/trades/new", icon: "+", label: "New Trade",  sub: null        },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return "Still at it?";
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  if (h < 21) return "Good evening.";
  return "Late session.";
}

function MarketStatus() {
  const h = new Date().getUTCHours();
  // Rough market session indicators
  const isNYOpen     = h >= 13 && h < 21;
  const isLondonOpen = h >= 7  && h < 16;
  const isAsiaOpen   = h >= 23 || h < 8;

  const session = isNYOpen
    ? { label: "New York", color: "text-emerald-400", dot: "bg-emerald-400" }
    : isLondonOpen
    ? { label: "London",   color: "text-sky-400",     dot: "bg-sky-400"     }
    : isAsiaOpen
    ? { label: "Asia",     color: "text-amber-400",   dot: "bg-amber-400"   }
    : { label: "Closed",   color: "text-white/20",    dot: "bg-white/20"    };

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
      <span className={cx("w-[5px] h-[5px] rounded-full shrink-0 animate-pulse", session.dot)} />
      <span className={cx("font-mono text-[9px] uppercase tracking-[0.18em]", session.color)}>
        {session.label}
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-[#07090d]">

      {/* Sidebar */}
      <aside className="w-[216px] shrink-0 flex flex-col sticky top-0 h-screen border-r border-white/[0.06]"
        style={{ background: "linear-gradient(180deg, #0c1018 0%, #090d12 100%)" }}
      >

        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
          <Link href="/dashboard" className="no-underline block mb-3">
            <div className="flex items-baseline gap-[3px]">
              <span className="font-mono text-[15px] font-medium tracking-[0.12em] text-white uppercase">
                Edge
              </span>
              <span className="font-mono text-[15px] text-amber-400 tracking-[0.12em]">.</span>
              <span className="font-mono text-[15px] font-medium tracking-[0.12em] text-white uppercase">
                Log
              </span>
            </div>
          </Link>
          <MarketStatus />
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 flex-1 flex flex-col gap-[2px]">
          {NAV.map(({ href, icon, label, sub }) => {
            const isNew = href === "/trades/new";
            const active = !isNew && (
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href))
            );

            if (isNew) {
              return (
                <Link key={href} href={href} className="no-underline block mt-2">
                  <div className="flex items-center gap-[9px] px-3 py-[10px] rounded-lg font-mono text-[12px] tracking-[0.04em] border border-amber-400/25 bg-amber-400/[0.06] text-amber-400 hover:bg-amber-400/[0.12] hover:border-amber-400/40 transition-all duration-150 cursor-pointer">
                    <span className="text-[14px] leading-none">{icon}</span>
                    <span>{label}</span>
                  </div>
                </Link>
              );
            }

            return (
              <Link key={href} href={href} className="no-underline block">
                <div className={cx(
                  "flex items-center gap-[9px] px-3 py-[9px] rounded-lg transition-all duration-150 cursor-pointer group",
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
                  <div className="flex flex-col min-w-0">
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

                  {/* Active indicator bar */}
                  {active && (
                    <div className="ml-auto w-[2px] h-4 rounded-full bg-amber-400/60 shrink-0" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Greeting */}
        <div className="px-5 py-3 border-t border-white/[0.04]">
          <p className="font-mono text-[10px] text-white/18 tracking-[0.06em]">
            {getGreeting()}
          </p>
        </div>

        {/* User section */}
        {session?.user && (
          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-[10px] px-3 py-[9px] rounded-lg bg-white/[0.02] border border-white/[0.04] group">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-6 h-6 rounded-full shrink-0 opacity-80"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center font-mono text-[11px] text-amber-400 shrink-0">
                  {(session.user.name || session.user.email || "?")[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[11px] text-white/55 truncate">
                  {session.user.name?.split(" ")[0] || "Trader"}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-transparent border-none cursor-pointer font-mono text-[9px] text-white/20 p-0 text-left hover:text-white/40 transition-colors duration-150 tracking-[0.06em] uppercase"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}