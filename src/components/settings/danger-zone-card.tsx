"use client";

import { useState, useTransition } from "react";
import { createPortal }            from "react-dom";
import { deleteAccountAction }     from "@/lib/actions/settings.action";

export function DangerZoneCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="rounded-xl bg-red-500/[0.03] border border-red-500/20 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-red-400/50 mb-3">
          Danger zone
        </p>
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[13px] text-white/60 mb-1">Delete account</p>
            <p className="font-mono text-[11px] text-white/25 leading-relaxed">
              Permanently deletes your account and all trade data. This cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400/70 bg-red-500/[0.05] hover:bg-red-500/[0.1] hover:border-red-500/45 hover:text-red-400 transition-all duration-150"
          >
            Delete
          </button>
        </div>
      </div>

      {showModal && (
        <DeleteConfirmModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function DeleteConfirmModal({ onClose }: { onClose: () => void }) {
  const [typed, setTyped]              = useState("");
  const [isPending, startTransition]   = useTransition();
  const confirmed                      = typed === "DELETE";

  function handleDelete() {
    if (!confirmed) return;
    startTransition(async () => {
      await deleteAccountAction();
    });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className="relative w-full max-w-[380px] rounded-xl border border-red-500/25 overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.85)]"
        style={{ backgroundColor: "#0d1117" }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/[0.05]">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </div>
          <p className="font-mono text-[15px] text-white/80 leading-snug mb-1">
            Delete your account?
          </p>
          <p className="font-mono text-[11px] text-white/30 leading-relaxed">
            This will permanently delete your account, all trades, analytics, and billing data. There is no way to recover this.
          </p>
        </div>

        {/* Confirm input */}
        <div className="px-5 py-4 border-b border-white/[0.05]">
          <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25 block mb-2">
            Type <span className="text-red-400/70">DELETE</span> to confirm
          </label>
          <input
            value={typed}
            onChange={e => setTyped(e.target.value)}
            autoFocus
            placeholder="DELETE"
            className="w-full bg-red-500/[0.04] border border-red-500/20 rounded-lg px-3 py-2.5 font-mono text-[12px] text-white/70 placeholder-white/15 outline-none focus:border-red-400/40 transition-colors tracking-widest"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg font-mono text-[11px] text-white/40 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white/60 transition-all duration-150 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!confirmed || isPending}
            className="flex-1 py-2.5 rounded-lg font-mono text-[11px] text-red-400 bg-red-400/[0.07] border border-red-400/20 hover:bg-red-400/[0.12] hover:border-red-400/30 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isPending ? "Deleting…" : "Delete account"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
