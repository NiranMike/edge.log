"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { cx } from "@/style";
import { CalendarDays, ChartCandlestick, ChartLine } from "lucide-react";
import { HomeIcon, SettingsIcon } from "@/components/icons";
import { SignOutModal } from "@/components/auth/sign-out-modal";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function ImportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

const NAV_ICONS: Record<string, () => React.ReactNode> = {
  "/dashboard":  () => <HomeIcon size={16} />,
  "/trades":     () => <ChartCandlestick size={16} strokeWidth={1.7} />,
  "/analytics":  () => <ChartLine size={16} strokeWidth={1.7} />,
  "/calendar":   () => <CalendarDays size={16} strokeWidth={1.7} />,
  "/settings":   () => <SettingsIcon size={16} />,
  "/trades/new": PlusIcon,
};

const NAV = [
  { href: "/dashboard",  label: "Dashboard",  sub: "overview"       },
  { href: "/trades",     label: "Trades",     sub: "journal"        },
  { href: "/analytics",  label: "Analytics",  sub: "patterns"       },
  { href: "/calendar",   label: "Calendar",   sub: "daily p&l"      },
  { href: "/settings",   label: "Settings",   sub: "plan & billing" },
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
      <span className={cx("block h-px bg-white/60 rounded-full transition-all duration-200 origin-center", open ? "rotate-45 translate-y-[6px]" : "")} />
      <span className={cx("block h-px bg-white/60 rounded-full transition-all duration-200", open ? "opacity-0 scale-x-0" : "")} />
      <span className={cx("block h-px bg-white/60 rounded-full transition-all duration-200 origin-center", open ? "-rotate-45 -translate-y-[6px]" : "")} />
    </div>
  );
}

function NavLink({
  href, icon, label, sub, active, compact = false, onClick,
}: {
  href: string; icon: React.ReactNode; label: string; sub: string | null;
  active: boolean; compact?: boolean; onClick?: () => void;
}) {
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
          "shrink-0 transition-colors duration-150",
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
  pathname, session: userSession, compact = false, onNavClick, onSignOutClick,
}: {
  pathname: string;
  session: ReturnType<typeof useSession>["data"];
  compact?: boolean;
  onNavClick?: () => void;
  onSignOutClick?: () => void;
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

      <nav className={cx("py-4 flex-1 flex flex-col gap-[2px]", compact ? "px-2 relative" : "px-3")}>
        {NAV.map(({ href, label, sub }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" &&
              pathname.startsWith(href) &&
              // /trades stays un-highlighted on its action sub-pages
              !(href === "/trades" && (pathname.startsWith("/trades/new") || pathname.startsWith("/trades/import"))));
          const IconComp = NAV_ICONS[href];
          return (
            <NavLink key={href} href={href} icon={IconComp ? <IconComp /> : null} label={label} sub={sub}
              active={active} compact={compact} onClick={onNavClick} />
          );
        })}

        {/* Bottom actions — always reachable from any page */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          {/* <Link
            href="/trades/import"
            onClick={onNavClick}
            title="Import trades from CSV"
            className={cx(
              "no-underline flex items-center gap-2 rounded-lg font-mono text-[11px] tracking-[0.06em] border transition-all duration-150",
              compact ? "px-0 py-[9px] justify-center" : "px-3.5 py-[9px]",
              pathname.startsWith("/trades/import")
                ? "bg-white/[0.06] border-white/[0.1] text-white/80"
                : "bg-white/[0.02] border-white/[0.07] text-white/45 hover:bg-white/[0.05] hover:border-white/[0.12] hover:text-white/65",
            )}
          >
            <span className="shrink-0"><ImportIcon /></span>
            {!compact && <span>Import CSV</span>}
          </Link> */}

          <Link href="/trades/new" onClick={onNavClick} className="no-underline block">
            <div className={cx(
              "group/new relative overflow-hidden flex items-center gap-2 rounded-lg font-mono text-[11px] font-medium tracking-[0.08em] uppercase",
              "bg-emerald-400 text-[#07090d] hover:brightness-110 active:scale-[0.97] transition-all duration-150 cursor-pointer",
              compact ? "px-0 py-[10px] justify-center" : "px-3.5 py-[9px]",
            )}>
              <span className="shrink-0"><PlusIcon /></span>
              {!compact && <span>New Trade</span>}
              {!compact && (
                <span className="ml-auto font-mono text-[8px] text-[#07090d]/40 border border-[#07090d]/15 rounded px-1 py-0.5 leading-none">
                  N
                </span>
              )}
              <div className="absolute inset-0 bg-white/15 -translate-x-full group-hover/new:translate-x-full transition-transform duration-500 skew-x-12 pointer-events-none" />
            </div>
          </Link>
        </div>
      </nav>

      {!compact && (
        <div className="px-5 py-3 border-t border-white/[0.04]">
          <p className="font-mono text-[10px] text-white/18 tracking-[0.06em]">{getGreeting()}</p>
        </div>
      )}

      {userSession?.user && (
        <div className={cx("border-t border-white/[0.06]", compact ? "p-2" : "p-3")}>
          <div className={cx(
            "flex items-center rounded-lg bg-white/[0.02] border border-white/[0.04] group",
            compact ? "justify-center px-0 py-[9px]" : "gap-[10px] px-3 py-[9px]",
          )}>
            {userSession.user.image ? (
              <img src={userSession.user.image} alt="" className="w-6 h-6 rounded-full shrink-0 opacity-80" />
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
                  onClick={onSignOutClick}
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
  const router   = useRouter();
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement).isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "n") {
        e.preventDefault();
        router.push("/trades/new");
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const sidebarBg = "linear-gradient(180deg, #0c1018 0%, #090d12 100%)";

  return (
    <div className="flex min-h-screen bg-[#07090d]">
      <aside className="hidden md:flex lg:hidden w-[64px] shrink-0 flex-col sticky top-0 h-screen overflow-y-auto border-r border-white/[0.06]" style={{ background: sidebarBg }}>
        <SidebarContent pathname={pathname} session={session} compact={true} onSignOutClick={() => setShowSignOutModal(true)} />
      </aside>

      <aside className="hidden lg:flex w-[216px] shrink-0 flex-col sticky top-0 h-screen overflow-y-auto border-r border-white/[0.06]" style={{ background: sidebarBg }}>
        <SidebarContent pathname={pathname} session={session} compact={false} onSignOutClick={() => setShowSignOutModal(true)} />
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 border-b border-white/[0.06] flex items-center px-4 gap-3" style={{ background: sidebarBg }}>
        <button onClick={() => setDrawerOpen(v => !v)} className="bg-transparent border-none cursor-pointer p-1 -ml-1 flex items-center justify-center" aria-label="Toggle menu">
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
        <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      )}

      <aside className={cx(
        "md:hidden fixed top-14 left-0 bottom-0 z-40 w-[240px] flex flex-col overflow-y-auto border-r border-white/[0.06] transition-transform duration-250 ease-in-out",
        drawerOpen ? "translate-x-0" : "-translate-x-full",
      )} style={{ background: sidebarBg }}>
        <SidebarContent pathname={pathname} session={session} compact={false} onNavClick={() => setDrawerOpen(false)} onSignOutClick={() => setShowSignOutModal(true)} />
      </aside>

      <main className="flex-1 overflow-auto min-w-0 md:pt-0 pt-14">
        {children}
      </main>

      {showSignOutModal && (
        <SignOutModal
          onConfirm={() => signOut({ callbackUrl: "/login" })}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}
    </div>
  );
}