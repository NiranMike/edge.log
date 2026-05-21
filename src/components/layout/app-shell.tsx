"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { cx } from "@/style";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV = [
  { href: "/dashboard",  icon: "◈", label: "Dashboard",  sub: "overview"       },
  { href: "/trades",     icon: "≡", label: "Trades",     sub: "journal"        },
  { href: "/analytics",  icon: "⌬", label: "Analytics",  sub: "patterns"       },
  { href: "/calendar",   icon: "▦", label: "Calendar",   sub: "daily p&l"      },
  { href: "/settings",   icon: "⚙", label: "Settings",   sub: "plan & billing" },
  { href: "/trades/new", icon: "+", label: "New Trade",  sub: null             },
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
  const isNY     = h >= 13 && h < 21;
  const isLondon = h >= 7  && h < 16;
  const isAsia   = h >= 23 || h < 8;

  const s = isNY
    ? { label: "New York", color: "text-[var(--win)]",   dot: "bg-[var(--win)]"   }
    : isLondon
    ? { label: "London",   color: "text-[var(--ac-2)]",  dot: "bg-[var(--ac-2)]"  }
    : isAsia
    ? { label: "Asia",     color: "text-[var(--ac-3)]",  dot: "bg-[var(--ac-3)]"  }
    : { label: "Closed",   color: "text-[var(--tx-4)]",  dot: "bg-[var(--tx-4)]"  };

  if (compact) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-overlay)] border border-[var(--bd)]">
        <span className={cx("w-[5px] h-[5px] rounded-full shrink-0 animate-pulse", s.dot)} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-overlay)] border border-[var(--bd)]">
      <span className={cx("w-[5px] h-[5px] rounded-full shrink-0 animate-pulse", s.dot)} />
      <span className={cx("font-mono text-[9px] uppercase tracking-[0.18em]", s.color)}>
        {s.label}
      </span>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-5 flex flex-col justify-center gap-[5px] shrink-0">
      <span className={cx("block h-px bg-[var(--tx-2)] rounded-full transition-all duration-200 origin-center", open ? "rotate-45 translate-y-[6px]" : "")} />
      <span className={cx("block h-px bg-[var(--tx-2)] rounded-full transition-all duration-200", open ? "opacity-0 scale-x-0" : "")} />
      <span className={cx("block h-px bg-[var(--tx-2)] rounded-full transition-all duration-200 origin-center", open ? "-rotate-45 -translate-y-[6px]" : "")} />
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
          "flex items-center gap-[9px] rounded-lg font-mono text-[12px] tracking-[0.04em]",
          "border border-[var(--ac-2-ring)] bg-[var(--ac-2-dim)] text-[var(--ac-2)]",
          "hover:border-[var(--ac-2)] hover:bg-[var(--ac-2-dim)] transition-all duration-150 cursor-pointer",
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
        "flex items-center rounded-lg transition-all duration-150 cursor-pointer group relative",
        compact ? "gap-0 px-0 py-[9px] justify-center" : "gap-[9px] px-3 py-[9px]",
        active
          ? "bg-[var(--bg-overlay)] border border-[var(--bd-hi)]"
          : "border border-transparent hover:bg-[var(--bg-overlay)] hover:border-[var(--bd)]",
      )}>
        <span className={cx(
          "text-sm leading-none shrink-0 transition-colors duration-150",
          active ? "text-[var(--tx-1)]" : "text-[var(--tx-4)] group-hover:text-[var(--tx-3)]",
        )}>
          {icon}
        </span>
        {!compact && (
          <div className="flex flex-col min-w-0 flex-1">
            <span className={cx(
              "font-mono text-[12px] tracking-[0.04em] transition-colors duration-150",
              active ? "text-[var(--tx-1)]" : "text-[var(--tx-3)] group-hover:text-[var(--tx-2)]",
            )}>
              {label}
            </span>
            {sub && (
              <span className={cx(
                "font-mono text-[9px] tracking-[0.12em] uppercase transition-colors duration-150",
                active ? "text-[var(--tx-3)]" : "text-[var(--tx-4)] group-hover:text-[var(--tx-3)]",
              )}>
                {sub}
              </span>
            )}
          </div>
        )}
        {active && !compact && (
          <div className="ml-auto w-[2px] h-4 rounded-full bg-[var(--ac-2)] shrink-0" />
        )}
        {active && compact && (
          <div className="absolute left-0 w-[2px] h-4 rounded-full bg-[var(--ac-2)]" />
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
      {/* Logo + Market */}
      <div className={cx(
        "border-b border-[var(--bd)]",
        compact ? "px-3 pt-5 pb-4 flex flex-col items-center gap-3" : "px-5 pt-6 pb-5",
      )}>
        <Link href="/dashboard" className="no-underline block mb-3" onClick={onNavClick}>
          {compact ? (
            <div className="flex items-center gap-[2px]">
              <span className="font-display font-black text-[13px] tracking-[0.08em] text-[var(--tx-1)] uppercase">E</span>
              <span className="font-display font-black text-[13px] text-[var(--ac-2)] tracking-[0.08em]">.</span>
              <span className="font-display font-black text-[13px] tracking-[0.08em] text-[var(--tx-1)] uppercase">L</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-[3px]">
              <span className="font-display font-black text-[15px] tracking-[0.06em] text-[var(--tx-1)] uppercase">Edge</span>
              <span className="font-display font-black text-[15px] text-[var(--ac-2)] tracking-[0.06em]">.</span>
              <span className="font-display font-black text-[15px] tracking-[0.06em] text-[var(--tx-1)] uppercase">Log</span>
            </div>
          )}
        </Link>
        <MarketStatus compact={compact} />
      </div>

      {/* Navigation */}
      <nav className={cx("py-4 flex-1 flex flex-col gap-[2px]", compact ? "px-2 relative" : "px-3")}>
        {NAV.map(({ href, icon, label, sub }) => {
          const isNew = href === "/trades/new";
          const active = !isNew && (
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href))
          );
          return (
            <NavLink
              key={href} href={href} icon={icon} label={label} sub={sub}
              active={active} compact={compact} onClick={onNavClick}
            />
          );
        })}
      </nav>

      {/* Greeting + Theme toggle */}
      {!compact && (
        <div className="px-3 py-3 border-t border-[var(--bd)] space-y-2">
          <p className="font-mono text-[10px] text-[var(--tx-4)] tracking-[0.06em] px-1">{getGreeting()}</p>
          <ThemeToggle />
        </div>
      )}

      {compact && (
        <div className="px-2 pb-2 border-t border-[var(--bd)] pt-2">
          <ThemeToggle compact />
        </div>
      )}

      {/* User */}
      {userSession?.user && (
        <div className={cx("border-t border-[var(--bd)]", compact ? "p-2" : "p-3")}>
          <div className={cx(
            "flex items-center rounded-lg bg-[var(--bg-overlay)] border border-[var(--bd)] group",
            compact ? "justify-center px-0 py-[9px]" : "gap-[10px] px-3 py-[9px]",
          )}>
            {userSession.user.image ? (
              <img src={userSession.user.image} alt="" className="w-6 h-6 rounded-full shrink-0 opacity-80" />
            ) : (
              <div
                className="w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[11px] text-[var(--ac-2)] shrink-0"
                style={{ background: "var(--ac-2-dim)", borderColor: "var(--ac-2-ring)" }}
              >
                {(userSession.user.name || userSession.user.email || "?")[0].toUpperCase()}
              </div>
            )}
            {!compact && (
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[11px] text-[var(--tx-2)] truncate">
                  {userSession.user.name?.split(" ")[0] || "Trader"}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-transparent border-none cursor-pointer font-mono text-[9px] text-[var(--tx-4)] p-0 text-left hover:text-[var(--tx-3)] transition-colors duration-150 tracking-[0.06em] uppercase"
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

const SIDEBAR_STYLE = {
  background: "linear-gradient(180deg, var(--sidebar-from) 0%, var(--sidebar-to) 100%)",
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">

      {/* ── Compact sidebar (md) ────────────────────────────────────────── */}
      <aside
        className="hidden md:flex lg:hidden w-[64px] shrink-0 flex-col sticky top-0 h-screen border-r border-[var(--bd)]"
        style={SIDEBAR_STYLE}
      >
        <SidebarContent pathname={pathname} session={session} compact={true} />
      </aside>

      {/* ── Full sidebar (lg) ───────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-[216px] shrink-0 flex-col sticky top-0 h-screen border-r border-[var(--bd)]"
        style={SIDEBAR_STYLE}
      >
        <SidebarContent pathname={pathname} session={session} compact={false} />
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-40 h-14 border-b border-[var(--bd)] flex items-center px-4 gap-3"
        style={SIDEBAR_STYLE}
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
            <span className="font-display font-black text-[14px] tracking-[0.06em] text-[var(--tx-1)] uppercase">Edge</span>
            <span className="font-display font-black text-[14px] text-[var(--ac-2)] tracking-[0.06em]">.</span>
            <span className="font-display font-black text-[14px] tracking-[0.06em] text-[var(--tx-1)] uppercase">Log</span>
          </div>
        </Link>
        <MarketStatus compact={true} />
      </div>

      {/* ── Mobile drawer backdrop ──────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      <aside
        className={cx(
          "md:hidden fixed top-14 left-0 bottom-0 z-40 w-[240px] flex flex-col",
          "border-r border-[var(--bd)] transition-transform duration-250 ease-in-out",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={SIDEBAR_STYLE}
      >
        <SidebarContent
          pathname={pathname} session={session} compact={false}
          onNavClick={() => setDrawerOpen(false)}
        />
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto min-w-0 md:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}
