"use client";

import { cx, ds } from "@/style";
import { forwardRef, useState } from "react";


interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label:  string;
  error?: string;
  hint?:  string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, hint, type, className, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            type={isPassword && show ? "text" : type}
            className={cx(
              ds.input,
              "w-full px-4 py-3.5",
              error
                ? "border-red-500/45 focus:border-red-400/60"
                : "focus:border-emerald-400/50",
              isPassword && "pr-11",
              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              tabIndex={-1}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/22 hover:text-white/55 transition-colors"
            >
              {show ? <EyeOff /> : <EyeOn />}
            </button>
          )}
        </div>

        {error && (
          <p className="font-mono text-[10px] text-red-400/80 flex items-center gap-1.5">
            <span className="text-[8px]">✕</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="font-mono text-[10px] text-white/20">{hint}</p>
        )}
      </div>
    );
  },
);
AuthInput.displayName = "AuthInput";


export function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;

  const checks = [
    { label: "8+ chars",  ok: value.length >= 8},
    { label: "Uppercase", ok: /[A-Z]/.test(value)},
    { label: "Number",    ok: /[0-9]/.test(value)},
    { label: "Special",   ok: /[^A-Za-z0-9]/.test(value)},
  ];
  const score = checks.filter((c) => c.ok).length;
  const barColor = (["bg-red-500", "bg-teal-500", "bg-yellow-400", "bg-emerald-400"] as const)[
    Math.min(score - 1, 3)
  ] ?? "bg-white/10";

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cx("h-0.5 flex-1 rounded-full transition-all duration-300", i < score ? barColor : "bg-white/[0.07]")}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {checks.map(({ label, ok }) => (
          <span
            key={label}
            className={cx(
              "font-mono text-[9px] px-1.5 py-0.5 border transition-colors duration-200",
              ok
                ? "border-emerald-400/25 text-emerald-400/70 bg-emerald-400/6"
                : "border-white/6 text-white/20",
            )}
          >
            {ok && "✓ "}{label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── AuthButton ───────────────────────────────────────────────────────────────

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export function AuthButton({
  children, loading, variant = "primary", disabled, className, ...props
}: AuthButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <button
      disabled={disabled || loading}
      className={cx(
        "group relative overflow-hidden w-full font-mono font-bold text-[11px] uppercase tracking-[0.16em]",
        "px-6 py-4 transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090d]",
        isPrimary
          ? "bg-emerald-400 text-black hover:bg-emerald-300 disabled:bg-emerald-400/35 disabled:text-black/40"
          : "border border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/60 disabled:opacity-40",
        loading && "cursor-wait",
        className,
      )}
      style={ds.clip12}
      {...props}
    >
      {isPrimary && !loading && <span className={ds.btnShimmer} />}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? <><Spinner /><span className="opacity-55">Please wait…</span></> : children}
      </span>
    </button>
  );
}


export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/6" />
      <span className="font-mono text-[9px] uppercase tracking-widest text-white/18">{label}</span>
      <div className="flex-1 h-px bg-white/6" />
    </div>
  );
}


export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 border border-red-500/22 bg-red-500/[0.07]">
      <span className="text-red-400 mt-px text-[11px] shrink-0">⚠</span>
      <p className="font-mono text-[11px] text-red-400/85 leading-relaxed">{message}</p>
    </div>
  );
}

export function FormSuccess({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 border border-emerald-400/22 bg-emerald-400/[0.07]">
      <span className="text-emerald-400 mt-px text-[11px] shrink-0">✓</span>
      <p className="font-mono text-[11px] text-emerald-400/85 leading-relaxed">{message}</p>
    </div>
  );
}


function EyeOn() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOff() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
    </svg>
  );
}