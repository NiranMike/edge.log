"use client";

import { useState, useTransition } from "react";
import { useSession }              from "next-auth/react";
import { updateNameAction }        from "@/lib/actions/settings.action";
import { cx, ds }                  from "@/style";
import { CalendarDays, Mail, Pencil } from "lucide-react";

interface Props {
  name:      string | null;
  email:     string;
  image:     string | null;
  joinedAt:  string; // ISO string
}

export function ProfileCard({ name, email, image, joinedAt }: Props) {
  const { update } = useSession();
  const [editing, setEditing]   = useState(false);
  const [value,   setValue]     = useState(name ?? "");
  const [saved,   setSaved]     = useState(false);
  const [error,   setError]     = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initial   = (name || email || "?")[0].toUpperCase();
  const joinedFmt = new Date(joinedAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  function startEdit() { setEditing(true); setSaved(false); setError(null); }
  function cancelEdit() { setEditing(false); setValue(name ?? ""); setError(null); }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateNameAction(value);
      if (result.ok) {
        setSaved(true);
        setEditing(false);
        await update(); // refresh session so navbar name updates
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="rounded-xl bg-[#0d1117] border border-white/[0.065] p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {image ? (
            <img src={image} alt="" className="w-14 h-14 rounded-full object-cover border border-white/[0.08]" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center font-mono text-[20px] font-bold text-teal-400">
              {initial}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-2 mb-1">
            {editing ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") cancelEdit(); }}
                  autoFocus
                  maxLength={60}
                  className={cx(ds.input, "flex-1 px-3 py-1.5 rounded-lg text-[13px]")}
                  placeholder="Your name"
                />
                <button
                  onClick={save}
                  disabled={isPending || !value.trim()}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/25 text-emerald-400 hover:bg-emerald-400/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPending ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-lg border border-white/[0.07] text-white/30 hover:text-white/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="font-mono text-[15px] text-white/80 truncate">
                  {name || <span className="text-white/25 italic">No name set</span>}
                </span>
                <button
                  onClick={startEdit}
                  className="shrink-0 text-white/20 hover:text-white/50 transition-colors"
                  title="Edit name"
                >
                  <Pencil size={13} />
                </button>
              </>
            )}
          </div>

          {error && (
            <p className="font-mono text-[10px] text-red-400 mb-1">{error}</p>
          )}
          {saved && !editing && (
            <p className="font-mono text-[10px] text-emerald-400 mb-1">Name updated.</p>
          )}

          {/* Email */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <Mail size={11} className="text-white/20 shrink-0" />
            <span className="font-mono text-[11px] text-white/35">{email}</span>
          </div>

          {/* Joined */}
          <div className="flex items-center gap-1.5">
            <CalendarDays size={11} className="text-white/20 shrink-0" />
            <span className="font-mono text-[10px] text-white/25">Member since {joinedFmt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
