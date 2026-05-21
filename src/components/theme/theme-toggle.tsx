"use client";

import { useEffect, useState } from "react";
import { cx } from "@/style";

type Theme = "dark" | "light";

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7 1v1.2M7 11.8V13M13 7h-1.2M2.2 7H1M11.2 2.8l-.85.85M3.65 10.35l-.85.85M11.2 11.2l-.85-.85M3.65 3.65l-.85-.85"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M11.5 8.5A5 5 0 015.5 2.5a5 5 0 000 9 5 5 0 006-3z"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

interface Props {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: Props) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("edgelog-theme") as Theme | null;
    const current = document.documentElement.getAttribute("data-theme") as Theme | null;
    setTheme(stored ?? current ?? "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("edgelog-theme", next); } catch {}
  }

  if (!mounted) {
    /* Render a placeholder during SSR to avoid layout shift */
    return (
      <div className={cx(
        compact
          ? "w-8 h-8 rounded-lg"
          : "w-full flex items-center gap-[9px] px-3 py-[9px] rounded-lg",
        "bg-[var(--bg-overlay)]",
      )} />
    );
  }

  const isDark = theme === "dark";

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={cx(
          "w-8 h-8 flex items-center justify-center rounded-lg",
          "text-[var(--tx-3)] hover:text-[var(--tx-2)]",
          "border border-[var(--bd)] hover:border-[var(--bd-hi)]",
          "bg-[var(--bg-overlay)] hover:bg-[var(--bd)]",
          "transition-all duration-150",
        )}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cx(
        "w-full flex items-center gap-[9px] px-3 py-[9px] rounded-lg",
        "border border-[var(--bd)] hover:border-[var(--bd-hi)]",
        "bg-[var(--bg-overlay)] hover:bg-[var(--bd)]",
        "transition-all duration-150 group",
      )}
    >
      <span className="shrink-0 text-[var(--tx-3)] group-hover:text-[var(--tx-2)] transition-colors">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
      <span className="font-mono text-[11px] tracking-[0.04em] text-[var(--tx-3)] group-hover:text-[var(--tx-2)] transition-colors">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
