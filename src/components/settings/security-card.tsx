"use client";

import { useState, useTransition } from "react";
import { changePasswordAction }    from "@/lib/actions/settings.action";
import { PasswordStrength }        from "@/components/auth/auth-field";
import { cx, ds }                  from "@/style";

interface Props {
  hasPassword: boolean;
  providers:   string[];
}

export function SecurityCard({ hasPassword, providers }: Props) {
  const [open, setOpen]         = useState(false);
  const [current, setCurrent]   = useState("");
  const [newPw, setNewPw]       = useState("");
  const [confirm, setConfirm]   = useState("");
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasGoogle = providers.includes("google");

  function reset() {
    setCurrent(""); setNewPw(""); setConfirm("");
    setError(null); setSuccess(false); setOpen(false);
  }

  function submit() {
    if (newPw !== confirm) { setError("Passwords do not match."); return; }
    setError(null);
    startTransition(async () => {
      const result = await changePasswordAction(current, newPw);
      if (result.ok) { setSuccess(true); reset(); setOpen(false); }
      else            { setError(result.error); }
    });
  }

  return (
    <div className="rounded-xl bg-[#0d1117] border border-white/[0.065] overflow-hidden">
      {/* Connected accounts */}
      <div className="p-6 border-b border-white/[0.05]">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30 mb-3">
          Connected accounts
        </p>
        <div className="flex flex-wrap gap-2">
          <div className={cx(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[11px]",
            "bg-white/[0.02] border-white/[0.07] text-white/40",
          )}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" className="hidden"/>
            </svg>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <rect width="24" height="24" rx="3" fill="none"/>
              <path d="M12 13.5V12h5.5s.5 3-3.5 5.5c-2 1-4 1-5.5.5S5 15.5 5 12s1.5-5.5 4-6.5S14 5 15.5 6l-1.5 1.5S12.5 6 11 6.5 7.5 8.5 7.5 12s2 5 4.5 5 4-2 4-2H12v-1.5z" fill="currentColor"/>
            </svg>
            Email / Password
          </div>

          {hasGoogle && (
            <div className={cx(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[11px]",
              "bg-teal-400/[0.04] border-teal-400/15 text-teal-400/70",
            )}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </div>
          )}
        </div>
      </div>

      {/* Password section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
            Password
          </p>
          {hasPassword && !open && (
            <button
              onClick={() => { setOpen(true); setSuccess(false); }}
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-400/70 hover:text-emerald-400 transition-colors"
            >
              Change
            </button>
          )}
        </div>

        {!hasPassword ? (
          <p className="font-mono text-[11px] text-white/25 leading-relaxed">
            This account uses Google sign-in. No password is set.
          </p>
        ) : success ? (
          <p className="font-mono text-[11px] text-emerald-400">
            Password updated successfully.
          </p>
        ) : !open ? (
          <p className="font-mono text-[11px] text-white/25">••••••••••••</p>
        ) : (
          <div className="flex flex-col gap-3 mt-3">
            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/[0.07] border border-red-500/20">
                <span className="text-red-400 text-[11px] shrink-0 mt-px">⚠</span>
                <p className="font-mono text-[11px] text-red-400/85">{error}</p>
              </div>
            )}

            <PasswordInput
              label="Current password"
              value={current}
              onChange={setCurrent}
              placeholder="Current password"
              autoComplete="current-password"
            />

            <div>
              <PasswordInput
                label="New password"
                value={newPw}
                onChange={setNewPw}
                placeholder="New password"
                autoComplete="new-password"
              />
              <PasswordStrength value={newPw} />
            </div>

            <PasswordInput
              label="Confirm new password"
              value={confirm}
              onChange={setConfirm}
              placeholder="Confirm new password"
              autoComplete="new-password"
              onEnter={submit}
            />

            <div className="flex gap-2 pt-1">
              <button
                onClick={submit}
                disabled={isPending || !current || !newPw || !confirm}
                className="flex-1 py-2.5 rounded-lg font-mono text-[11px] uppercase tracking-[0.12em] bg-emerald-400/10 border border-emerald-400/25 text-emerald-400 hover:bg-emerald-400/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? "Updating…" : "Update password"}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2.5 rounded-lg font-mono text-[11px] border border-white/[0.07] text-white/30 hover:text-white/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordInput({
  label, value, onChange, placeholder, autoComplete, onEnter,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
  onEnter?: () => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && onEnter) onEnter(); }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cx(ds.input, "w-full px-3 py-2.5 pr-9 rounded-lg text-[12px]")}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(s => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
        >
          {show ? <EyeOff /> : <EyeOn />}
        </button>
      </div>
    </div>
  );
}

function EyeOn() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOff() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
