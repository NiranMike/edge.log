"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
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

function MarketStatus({ compact = false }: { compact?: boolean }) {
  const h = new Date().getUTCHours();
  const isNYOpen     = h >= 13 && h < 21;
  const isLondonOpen = h >= 7  && h < 16;
  const isAsiaOpen   = h >= 23 || h < 8;

  const session = isNYOpen
    ? { label: "New York", color: "text-emerald-400", dot: "bg-emerald-400" }
    : isLondonOpen
    ? { label: "London",   color: "text-teal-400",    dot: "bg-teal-400"    }
    : isAsiaOpen
    ? { label: "Asia",     color: "text-violet-400",  dot: "bg-violet-400"  }
    : { label: "Closed",   color: "text-white/20",    dot: "bg-white/20"    };

  if (compact) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.04]">
        <span className={cx("w-[5px] h-[5px] rounded-full shrink-0 animate-pulse", session.dot)} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
      <span className={cx("w-[5px] h-[5px] rounded-full shrink-0 animate-pulse", session.dot)} />
      <span className={cx("font-mono text-[9px] uppercase tracking-[0.18em]", session.color)}>
        {session.label}
      </span>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-5 flex flex-col justify-center gap-[5px] shrink-0">
      <span className={cx(
        "block h-px bg-white/60 rounded-full transition-all duration-200 origin-center",
        open ? "rotate-45 translate-y-[6px]" : ""
      )} />
      <span className={cx(
        "block h-px bg-white/60 rounded-full transition-all duration-200",
        open ? "opacity-0 scale-x-0" : ""
      )} />
      <span className={cx(
        "block h-px bg-white/60 rounded-full transition-all duration-200 origin-center",
        open ? "-rotate-45 -translate-y-[6px]" : ""
      )} />
    </div>
  );
}

function NavLink({
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

function SidebarContent({
  pathname, session: userSession, compact = false, onNavClick,
}: {
  pathname: string;
  session: ReturnType<typeof useSession>["data"];
  compact?: boolean;
  onNavClick?: () => void;
}) {
  return (
    <>
      <div className={cx(
        "border-b border-white/[0.06]",
        compact ? "px-3 pt-5 pb-4 flex flex-col items-center gap-3" : "px-5 pt-6 pb-5",
      )}>
        <Link href="/dashboard" className="no-underline block mb-3" onClick={onNavClick}>
          {compact ? (
            <div className="flex items-baseline gap-[2px]">
              <span className="font-mono text-[13px] font-medium tracking-[0.12em] text-white uppercase">E</span>
              <span className="font-mono text-[13px] text-teal-400 tracking-[0.12em]">.</span>
              <span className="font-mono text-[13px] font-medium tracking-[0.12em] text-white uppercase">L</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-[3px]">
              <span className="font-mono text-[15px] font-medium tracking-[0.12em] text-white uppercase">Edge</span>
              <span className="font-mono text-[15px] text-teal-400 tracking-[0.12em]">.</span>
              <span className="font-mono text-[15px] font-medium tracking-[0.12em] text-white uppercase">Log</span>
            </div>
          )}
        </Link>
        <MarketStatus compact={compact} />
      </div>

      <nav className={cx(
        "py-4 flex-1 flex flex-col gap-[2px]",
        compact ? "px-2 relative" : "px-3",
      )}>
        {NAV.map(({ href, icon, label, sub }) => {
          const isNew = href === "/trades/new";
          const active = !isNew && (
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href))
          );
          return (
            <NavLink
              key={href}
              href={href}
              icon={icon}
              label={label}
              sub={sub}
              active={active}
              compact={compact}
              onClick={onNavClick}
            />
          );
        })}
      </nav>

      {!compact && (
        <div className="px-5 py-3 border-t border-white/[0.04]">
          <p className="font-mono text-[10px] text-white/18 tracking-[0.06em]">
            {getGreeting()}
          </p>
        </div>
      )}

      {userSession?.user && (
        <div className={cx("border-t border-white/[0.06]", compact ? "p-2" : "p-3")}>
          <div className={cx(
            "flex items-center rounded-lg bg-white/[0.02] border border-white/[0.04] group",
            compact ? "justify-center px-0 py-[9px]" : "gap-[10px] px-3 py-[9px]",
          )}>
            {userSession.user.image ? (
              <img
                src={userSession.user.image}
                alt=""
                className="w-6 h-6 rounded-full shrink-0 opacity-80"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center font-mono text-[11px] text-teal-400 shrink-0">
                {(userSession.user.name || userSession.user.email || "?")[0].toUpperCase()}
              </div>
            )}
            {!compact && (
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[11px] text-white/55 truncate">
                  {userSession.user.name?.split(" ")[0] || "Trader"}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-transparent border-none cursor-pointer font-mono text-[9px] text-white/20 p-0 text-left hover:text-white/40 transition-colors duration-150 tracking-[0.06em] uppercase"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const sidebarBg = "linear-gradient(180deg, #0c1018 0%, #090d12 100%)";

  return (
    <div className="flex min-h-screen bg-[#07090d]">

      <aside
        className="hidden md:flex lg:hidden w-[64px] shrink-0 flex-col sticky top-0 h-screen border-r border-white/[0.06]"
        style={{ background: sidebarBg }}
      >
        <SidebarContent pathname={pathname} session={session} compact={true} />
      </aside>

      <aside
        className="hidden lg:flex w-[216px] shrink-0 flex-col sticky top-0 h-screen border-r border-white/[0.06]"
        style={{ background: sidebarBg }}
      >
        <SidebarContent pathname={pathname} session={session} compact={false} />
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 border-b border-white/[0.06] flex items-center px-4 gap-3"
        style={{ background: sidebarBg }}
      >
        <button
          onClick={() => setDrawerOpen(v => !v)}
          className="bg-transparent border-none cursor-pointer p-1 -ml-1 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <MenuIcon open={drawerOpen} />
        </button>

        <Link href="/dashboard" className="no-underline flex-1">
          <div className="flex items-baseline gap-[3px]">
            <span className="font-mono text-[14px] font-medium tracking-[0.12em] text-white uppercase">Edge</span>
            <span className="font-mono text-[14px] text-teal-400 tracking-[0.12em]">.</span>
            <span className="font-mono text-[14px] font-medium tracking-[0.12em] text-white uppercase">Log</span>
          </div>
        </Link>

        <MarketStatus compact={true} />
      </div>

      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={cx(
          "md:hidden fixed top-14 left-0 bottom-0 z-40 w-[240px] flex flex-col border-r border-white/[0.06] transition-transform duration-250 ease-in-out",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ background: sidebarBg }}
      >
        <SidebarContent
          pathname={pathname}
          session={session}
          compact={false}
          onNavClick={() => setDrawerOpen(false)}
        />
      </aside>

      <main className="flex-1 overflow-auto min-w-0 md:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}