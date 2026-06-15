export function DangerZoneCard() {
  return (
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
        {/* TODO: re-enable once account deletion flow is finalised */}
        {/* <button
          onClick={() => setShowModal(true)}
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400/70 bg-red-500/[0.05] hover:bg-red-500/[0.1] hover:border-red-500/45 hover:text-red-400 transition-all duration-150"
        >
          Delete
        </button> */}
      </div>
    </div>
  );
}

// TODO: re-enable once account deletion flow is finalised
// import { useState, useTransition } from "react";
// import { createPortal }            from "react-dom";
// import { deleteAccountAction }     from "@/lib/actions/settings.action";
// import { Trash2 }                  from "lucide-react";
//
// function DeleteConfirmModal({ onClose }: { onClose: () => void }) { ... }
