"use client";

import React, { useState, useEffect } from "react";
import { UserAccount } from "@/lib/types";
import { ShieldCheck, KeyRound, Lock, AlertCircle, CheckCircle2, Loader2, Users } from "lucide-react";

export default function InkRoomSecurityPage() {
  const [currentKey, setCurrentKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [confirmKey, setConfirmKey] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Contributor");

  useEffect(() => {
    // Load authorized writers
    fetch("/api/ink-room/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {
        // Fallback demo users if endpoint not yet loaded
        setUsers([
          {
            id: "user-1",
            email: "linda@houseofwildink.com",
            name: "Linda Emefa Daniels",
            role: "Owner",
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ]);
      });
  }, []);

  const handleKeyRotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKey || !newKey || !confirmKey) {
      setStatus("error");
      setMessage("Please fill in all key fields.");
      return;
    }

    if (newKey !== confirmKey) {
      setStatus("error");
      setMessage("The new access keys do not match.");
      return;
    }

    if (newKey.length < 12) {
      setStatus("error");
      setMessage("New access key must be at least 12 characters long.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/ink-room/auth/rotate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentKey, newKey, confirmKey }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update access key");
      }

      setStatus("success");
      setMessage("The master access key has been securely updated. Other active sessions have been invalidated.");
      setCurrentKey("");
      setNewKey("");
      setConfirmKey("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Key update failed. Verify your current key.");
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-4 border-b border-brand-gold/30">
        <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
          Access Control
        </span>
        <h1 className="font-display text-3xl font-bold text-brand-forest">
          Security & Access Key Management
        </h1>
        <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
          Owner-exclusive controls: Rotate master gate access keys and manage authorized writer permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Access Key Rotation Form (Section 12) */}
        <div className="bg-brand-parchment p-6 sm:p-8 rounded-2xl border border-brand-gold/40 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-brand-gold/20">
            <div className="p-2 rounded-xl bg-brand-forest text-brand-gold-light">
              <KeyRound className="w-5 h-5 text-brand-coral" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-brand-forest">
                Rotate Master Access Key
              </h2>
              <span className="text-xs font-sans text-brand-forest/60">
                PBKDF2 SHA-512 derivation with unique salt
              </span>
            </div>
          </div>

          {status === "error" && (
            <div className="p-3 rounded-xl bg-brand-coral/15 border border-brand-coral/30 text-brand-forest text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-coral shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {status === "success" && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleKeyRotation} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Current Access Key
              </label>
              <input
                type="password"
                required
                value={currentKey}
                onChange={(e) => setCurrentKey(e.target.value)}
                placeholder="Enter current key..."
                className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                New Access Key (Min 12 Characters)
              </label>
              <input
                type="password"
                required
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="At least 12 characters..."
                className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Confirm New Access Key
              </label>
              <input
                type="password"
                required
                value={confirmKey}
                onChange={(e) => setConfirmKey(e.target.value)}
                placeholder="Repeat new key..."
                className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral font-mono"
              />
            </div>

            <div className="text-[11px] font-sans text-brand-forest/65 leading-relaxed">
              * Note: Changing the key will immediately invalidate all other active gate sessions. Your current Owner session will remain active.
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-3 rounded-xl bg-brand-coral text-brand-cream font-sans font-semibold text-xs tracking-wider uppercase hover:bg-brand-coral/90 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rotating Key...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Master Access Key</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Roles & Permissions Reference (Section 23) */}
        <div className="bg-brand-parchment p-6 sm:p-8 rounded-2xl border border-brand-gold/40 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-brand-gold/20">
            <div className="p-2 rounded-xl bg-brand-forest text-brand-gold-light">
              <Users className="w-5 h-5 text-brand-coral" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-brand-forest">
                Authorized Writer Roster
              </h2>
              <span className="text-xs font-sans text-brand-forest/60">
                Server-enforced role permissions
              </span>
            </div>
          </div>

          <div className="divide-y divide-brand-gold/20">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs font-sans">
                <div>
                  <span className="font-bold text-brand-forest block text-sm">{u.name}</span>
                  <span className="text-brand-forest/60">{u.email}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-brand-forest text-brand-cream font-bold uppercase tracking-wider text-[10px]">
                  {u.role}
                </span>
              </div>
            ))}
          </div>

          {/* Role Matrix Reference */}
          <div className="p-4 rounded-xl bg-brand-cream border border-brand-gold/30 text-xs font-sans space-y-2">
            <span className="font-bold text-brand-forest uppercase tracking-wider block">
              Role Matrix (Section 23):
            </span>
            <ul className="space-y-1 text-brand-forest/80 text-[11px]">
              <li><strong>Owner (Linda):</strong> Full authority, rotate access key, manage users, publish, restore.</li>
              <li><strong>Publisher:</strong> Create, edit, schedule, publish, manage collections.</li>
              <li><strong>Editor:</strong> Create, edit permitted content, review contributors.</li>
              <li><strong>Contributor:</strong> Create and edit own drafts only, submit for review.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
