import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function SignOutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onCancel} />

      <div
        className="relative w-full max-w-[320px] rounded-xl border border-[var(--bd-hi)] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <div className="px-5 pt-5 pb-4 border-b border-[var(--bd)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--tx-3)] mb-2">
            Confirm
          </p>
          <p className="font-mono text-[15px] text-[var(--tx-2)] leading-snug">
            Sign out?
          </p>
        </div>

        <div className="px-5 py-4">
          <p className="font-mono text-[12px] text-[var(--tx-3)] leading-relaxed">
            You&apos;ll need to sign back in to access your journal.
          </p>
        </div>

        <div className="flex gap-2 px-5 pb-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg font-mono text-[12px] text-[var(--tx-3)] bg-[var(--bg-overlay)] border border-[var(--bd)] hover:bg-[var(--bg-input)] hover:text-[var(--tx-2)] transition-all duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg font-mono text-[12px] text-red-400 bg-red-400/[0.07] border border-red-400/20 hover:bg-red-400/[0.12] hover:border-red-400/30 transition-all duration-150 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}