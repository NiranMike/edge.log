"use client";
import { DateTimePicker } from "../ui/date-time-picker";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { TradeFormValues, TradeFormErrors, Direction, Trade } from "@/types";
import { PairSelect } from "../ui/pair-select";

interface Props {
  initialValues?: Partial<TradeFormValues>;
  onSubmit: (values: TradeFormValues) => Promise<{ ok: boolean; error?: string; data?: Trade }>;
  submitLabel?: string;
  title?: string;
}

function calcLiveR(dir: Direction, entry: string, stop: string, exit: string): number | null {
  const e = Number(entry), s = Number(stop), x = Number(exit);
  if (!e || !s || !x || e <= 0 || s <= 0 || x <= 0) return null;
  const risk = Math.abs(e - s);
  if (risk === 0) return null;
  const pnl = dir === "LONG" ? x - e : e - x;
  return Math.round((pnl / risk) * 100) / 100;
}

function getRComment(r: number): { text: string; sub: string } {
  if (r >= 5)    return { text: "Exceptional",     sub: "That's a unicorn trade. Log it carefully." };
  if (r >= 3)    return { text: "Strong",           sub: "Solid execution. The plan worked." };
  if (r >= 2)    return { text: "Good",             sub: "Above expectancy. Take the win." };
  if (r >= 1)    return { text: "Positive",         sub: "Risk was respected. That's all you can ask." };
  if (r > 0)     return { text: "Breakeven-ish",    sub: "Survived. That's sometimes enough." };
  if (r === 0)   return { text: "Scratch",          sub: "You protected capital. Not glamorous, but smart." };
  if (r >= -0.5) return { text: "Small loss",       sub: "Managed well. Losses are part of the game." };
  if (r >= -1)   return { text: "Full stop",        sub: "Plan didn't work. Did you follow the plan?" };
  if (r >= -2)   return { text: "Painful",          sub: "Moved your stop? Be honest with yourself." };
  return          { text: "Review this trade",      sub: "Something broke down. Take your time with notes." };
}

function getPairMood(pair: string): string {
  const p = pair.toUpperCase();
  if (p.includes("XAU") || p.includes("GOLD")) return "Gold — the market's oldest emotion.";
  if (p.includes("BTC"))  return "Bitcoin — conviction required.";
  if (p.includes("ETH"))  return "Ethereum — more volatile than it looks.";
  if (p.includes("JPY"))  return "Yen — watch the BOJ carefully.";
  if (p.includes("NAS") || p.includes("NDX")) return "Nasdaq — tech sentiment rules here.";
  if (p.includes("SPX") || p.includes("SP5")) return "S&P — the benchmark. Respect it.";
  if (p.includes("GBP"))  return "Cable — news-sensitive. Keep size reasonable.";
  if (p.includes("EUR"))  return "Euro — liquid, but ECB surprises happen.";
  return "";
}

// ── AnimatedR ─────────────────────────────────────────────────────────────────
function AnimatedR({ value }: { value: number }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 350);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className={[
        "font-mono text-[22px] sm:text-[28px] font-medium tracking-[-0.04em] inline-block transition-all duration-200",
        value >= 0 ? "text-emerald-400" : "text-red-400",
        flash ? "scale-110 opacity-85" : "scale-100 opacity-100",
      ].join(" ")}
      style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      {value >= 0 ? "+" : ""}{value}R
    </span>
  );
}

// ── StepDot ───────────────────────────────────────────────────────────────────
function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <div className={[
      "w-[6px] h-[6px] rounded-full transition-all duration-300",
      done    ? "bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"
      : active ? "bg-emerald-400/50"
               : "bg-white/10",
    ].join(" ")} />
  );
}

function SectionLabel({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-[10px] mb-[14px]">
      <div className="w-5 h-px bg-emerald-400/40 shrink-0" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/60">
        {label}
        {optional && <span className="ml-[6px] text-white/20 normal-case tracking-normal"> — optional</span>}
      </span>
      <div className="flex-1 h-px bg-white/[0.04]" />
    </div>
  );
}

function Field({
  label, hint, error, children, optional,
}: {
  label: string; hint?: string; error?: string; children: React.ReactNode; optional?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-[7px]">
        <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          {label}
          {optional && <span className="ml-[6px] text-white/18 normal-case tracking-normal">optional</span>}
        </label>
        {hint && <span className="font-mono text-[10px] text-white/22 hidden sm:inline">{hint}</span>}
      </div>
      {children}
      <div className={["overflow-hidden transition-all duration-200", error ? "max-h-[30px] mt-[5px]" : "max-h-0"].join(" ")}>
        {error && <p className="font-mono text-[11px] text-red-400">↳ {error}</p>}
      </div>
    </div>
  );
}

function Input({ hasError, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e  => { setFocused(false); props.onBlur?.(e); }}
      className={[
        "w-full px-[14px] py-[13px] sm:py-[11px] rounded-[6px] font-mono text-[14px] sm:text-[13px] text-white/88 outline-none",
        "transition-all duration-200 placeholder:text-white/18 [color-scheme:dark]",
        "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        focused
          ? hasError
            ? "bg-white/[0.04] border border-red-400/60 shadow-[0_0_0_3px_rgba(248,113,113,0.08)]"
            : "bg-white/[0.04] border border-emerald-400/40 shadow-[0_0_0_3px_rgba(74,222,128,0.06)]"
          : hasError
          ? "bg-white/[0.025] border border-red-400/60"
          : "bg-white/[0.025] border border-white/[0.08]",
      ].join(" ")}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState((props.value as string)?.length ?? 0);
  return (
    <div className="relative">
      <textarea
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e  => { setFocused(false); props.onBlur?.(e); }}
        onChange={e => { setCharCount(e.target.value.length); props.onChange?.(e); }}
        className={[
          "w-full px-[14px] py-[13px] sm:py-[12px] rounded-[6px] font-mono text-[14px] sm:text-[13px] text-white/88 outline-none",
          "resize-vertical leading-[1.65] transition-all duration-200 placeholder:text-white/18",
          focused
            ? "bg-white/[0.04] border border-emerald-400/40 shadow-[0_0_0_3px_rgba(74,222,128,0.06)]"
            : "bg-white/[0.025] border border-white/[0.08]",
        ].join(" ")}
      />
      <span className="absolute bottom-[10px] right-[12px] font-mono text-[10px] text-white/18 pointer-events-none">
        {charCount}
      </span>
    </div>
  );
}

export function TradeForm({ initialValues, onSubmit, submitLabel = "Save Trade", title = "Log a trade" }: Props) {
  const router = useRouter();

  const [values, setValues] = useState<TradeFormValues>({
    pair:       initialValues?.pair       ?? "",
    direction:  initialValues?.direction  ?? "LONG",
    entryPrice: initialValues?.entryPrice ?? "",
    stopLoss:   initialValues?.stopLoss   ?? "",
    takeProfit: initialValues?.takeProfit ?? "",
    exitPrice:  initialValues?.exitPrice  ?? "",
    notes:      initialValues?.notes      ?? "",
    tradedAt:   initialValues?.tradedAt   ?? new Date().toISOString().slice(0, 16),
  });

  const [errors,    setErrors]    = useState<TradeFormErrors>({});
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof TradeFormValues>(k: K, v: TradeFormValues[K]) => {
    setValues(prev => ({ ...prev, [k]: v }));
    if (errors[k as keyof TradeFormErrors]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const liveR = useMemo(
    () => calcLiveR(values.direction, values.entryPrice, values.stopLoss, values.exitPrice),
    [values.direction, values.entryPrice, values.stopLoss, values.exitPrice],
  );
  const rComment = liveR !== null ? getRComment(liveR) : null;
  const pairMood = getPairMood(values.pair);

  const step1done = !!values.pair;
  const step2done = !!values.entryPrice && !!values.stopLoss;
  const step3done = !!values.exitPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerErr(null);
    setLoading(true);
    const result = await onSubmit(values);
    setLoading(false);
    if (result.ok) {
      setSubmitted(true);
      setTimeout(() => { router.push("/dashboard"); router.refresh(); }, 900);
    } else {
      setServerErr(result.error ?? "Something went wrong");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[560px] mx-auto flex flex-col items-center justify-center gap-4 py-16 animate-[fadeIn_0.4s_ease]">
        <div className="w-[52px] h-[52px] rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-[22px] text-emerald-400 animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
          ✓
        </div>
        <p className="font-mono text-[13px] text-white/50 text-center">Logged. Redirecting…</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn    { from { opacity:0; transform:translateY(6px)  } to { opacity:1; transform:translateY(0) } }
        @keyframes popIn     { from { opacity:0; transform:scale(0.7)       } to { opacity:1; transform:scale(1)     } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin      { to   { transform: rotate(360deg) } }
        .form-section { animation: fadeIn 0.35s ease both; }
      `}</style>


      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[560px] mx-auto px-4 sm:px-0 pb-8 sm:pb-0"
      >

        <div className="mb-7 sm:mb-9 animate-[fadeIn_0.4s_ease]">
          <div className="flex items-center gap-[6px] mb-4 sm:mb-5">
            <StepDot active={!step1done} done={step1done} />
            <StepDot active={step1done && !step2done} done={step2done} />
            <StepDot active={step2done && !step3done} done={step3done} />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/20">
              {!step1done ? "start here" : !step2done ? "add levels" : !step3done ? "add exit" : "ready to log"}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-[3px] h-10 sm:h-11 mt-1 rounded-full shrink-0 bg-gradient-to-b from-emerald-400 to-transparent" />
            <div>
              <h1 className="font-display font-normal text-[20px] sm:text-[24px] tracking-[-0.03em] text-white/95 mb-[5px] leading-[1.15]">
                {title}
              </h1>
              <p className="font-mono text-[11px] sm:text-[12px] text-white/30 leading-[1.6]">
                Accurate data builds accurate self-knowledge.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] mb-6 sm:mb-7" />

        <div className="form-section mb-6 sm:mb-7" style={{ animationDelay: "0.05s" }}>
          <SectionLabel label="Identity" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
            <Field label="Pair" error={errors.pair}>
              <PairSelect
                value={values.pair}
                onChange={val => set("pair", val)}
                hasError={!!errors.pair}
              />
              <div className={["overflow-hidden transition-all duration-300", pairMood ? "max-h-[22px] mt-[5px]" : "max-h-0"].join(" ")}>
                {pairMood && (
                  <p className="font-mono text-[10px] text-emerald-400/55 animate-[slideDown_0.25s_ease]">
                    {pairMood}
                  </p>
                )}
              </div>
            </Field>
            <Field label="Date & Time">
              <DateTimePicker
                value={values.tradedAt}
                onChange={val => set("tradedAt", val)}
              />
            </Field>
          </div>
        </div>

        <div className="form-section mb-6 sm:mb-7" style={{ animationDelay: "0.1s" }}>
          <SectionLabel label="Direction" />
          <div className="grid grid-cols-2 gap-[10px]">
            {(["LONG", "SHORT"] as Direction[]).map(d => {
              const active = values.direction === d;
              const isLong = d === "LONG";
              return (
                <button
                  key={d} type="button"
                  onClick={() => set("direction", d)}
                  className={[
                    "relative overflow-hidden flex items-center justify-center gap-2 px-4 py-[15px] sm:py-[13px]",
                    "rounded-[6px] font-mono text-[12px] tracking-[0.08em] uppercase cursor-pointer transition-all duration-200",
                    active
                      ? isLong
                        ? "bg-emerald-400/[0.08] border border-emerald-400/40 text-emerald-400 shadow-[0_0_20px_rgba(74,222,128,0.08)]"
                        : "bg-red-400/[0.08] border border-red-400/40 text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.08)]"
                      : "bg-white/[0.025] border border-white/[0.08] text-white/35 hover:text-white/55 hover:bg-white/[0.04]",
                  ].join(" ")}
                >
                  {active && (
                    <div className={["absolute top-0 left-0 right-0 h-[2px] opacity-70", isLong ? "bg-emerald-400" : "bg-red-400"].join(" ")} />
                  )}
                  <span className="text-[14px] leading-none">{isLong ? "▲" : "▼"}</span>
                  <span>{d}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-section mb-6 sm:mb-7" style={{ animationDelay: "0.15s" }}>
          <SectionLabel label="Price Levels" />
          <div className="grid grid-cols-2 gap-[12px] sm:gap-[14px]">
            {([
              { key: "entryPrice", label: "Entry",       placeholder: "1.08450", hint: "where you got in"  },
              { key: "stopLoss",   label: "Stop Loss",   placeholder: "1.08200", hint: "max risk"           },
              { key: "takeProfit", label: "Take Profit", placeholder: "1.09000", hint: "original target"    },
              { key: "exitPrice",  label: "Exit Price",  placeholder: "1.08950", hint: "actual close"       },
            ] as { key: keyof TradeFormValues; label: string; placeholder: string; hint: string }[]).map(({ key, label, placeholder, hint }) => (
              <Field key={key} label={label} hint={hint} error={(errors as Record<string, string | undefined>)[key]}>
                <Input
                  type="number" step="any"
                  inputMode="decimal"     
                  value={values[key] as string}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  hasError={!!(errors as Record<string, string | undefined>)[key]}
                />
              </Field>
            ))}
          </div>
        </div>

        <div
          className={["overflow-hidden transition-all", liveR !== null ? "max-h-[160px] mb-6 sm:mb-7" : "max-h-0 mb-0"].join(" ")}
          style={{ transitionDuration: "400ms", transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
        >
          {liveR !== null && rComment && (
            <div className={[
              "relative overflow-hidden flex items-center justify-between gap-3 px-4 sm:px-5 py-4 sm:py-[18px] rounded-[8px] border",
              liveR >= 0 ? "bg-emerald-400/[0.05] border-emerald-400/15" : "bg-red-400/[0.05] border-red-400/15",
            ].join(" ")}>
              <div className={[
                "absolute top-0 left-0 right-0 h-px",
                liveR >= 0
                  ? "bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
                  : "bg-gradient-to-r from-transparent via-red-400/40 to-transparent",
              ].join(" ")} />
              <div className="flex-1 min-w-0">
                <p className={["font-mono text-[12px] font-medium mb-1 truncate", liveR >= 0 ? "text-emerald-400/90" : "text-red-400/90"].join(" ")}>
                  {rComment.text}
                </p>
                <p className="font-mono text-[10px] sm:text-[11px] text-white/30 leading-[1.5]">{rComment.sub}</p>
              </div>
              <div className="text-right shrink-0">
                <AnimatedR value={liveR} />
                <p className="font-mono text-[10px] text-white/20 mt-[2px] tracking-[0.1em] uppercase">result</p>
              </div>
            </div>
          )}
        </div>

        <div className="form-section mb-6 sm:mb-7" style={{ animationDelay: "0.2s" }}>
          <SectionLabel label="Notes" optional />
          <Field label="What happened" optional>
            <Textarea
              value={values.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="What did you follow or break? Be honest — you're the only one reading this."
              rows={3}
            />
          </Field>
        </div>

        <div className={["overflow-hidden transition-all duration-200", serverErr ? "max-h-15 mb-4" : "max-h-0 mb-0"].join(" ")}>
          {serverErr && (
            <div className="px-3.5 py-3 rounded-md bg-red-400/6 border border-red-400/20 font-mono text-[12px] text-red-400">
              ↳ {serverErr}
            </div>
          )}
        </div>


        <div className="form-section flex flex-col-reverse sm:grid sm:gap-2.5 gap-2" style={{ gridTemplateColumns: "auto 1fr", animationDelay: "0.25s" }}>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-5 py-[14px] sm:py-[13px] rounded-md bg-transparent border border-white/8 font-mono text-[12px] tracking-[0.06em] text-white/35 cursor-pointer transition-all duration-150 hover:border-white/18 hover:text-white/55"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={[
              "w-full py-[15px] sm:py-[13px] rounded-[6px] font-mono text-[12px] font-semibold tracking-[0.1em] uppercase",
              "transition-all duration-200 border border-transparent",
              loading
                ? "bg-white/[0.04] text-white/30 cursor-not-allowed"
                : "bg-emerald-400 text-[#07090d] shadow-[0_0_24px_rgba(74,222,128,0.25)] hover:bg-emerald-300 cursor-pointer",
            ].join(" ")}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-[10px] h-[10px] rounded-full border-[1.5px] border-white/15 border-t-white/50 inline-block animate-[spin_0.7s_linear_infinite]" />
                Saving…
              </span>
            ) : submitLabel}
          </button>
        </div>

      </form>
    </>
  );
}