"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { Lock, KeyRound, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InkRoomGatePage() {
  const [accessKey, setAccessKey] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "locked" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [retrySec, setRetrySec] = useState<number | null>(null);
  const router = useRouter();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/ink-room/auth/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: accessKey }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setStatus("locked");
          setRetrySec(data.retryAfterSec || 900);
          setErrorMessage(data.error);
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Incorrect access key.");
        }
        return;
      }

      // Success: proceed to Layer 2 Identity Check
      window.location.href = "/ink-room/login";
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("Network or connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-forest text-brand-cream flex flex-col justify-between p-6">
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full pt-4">
        <Link href="/" className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity">
          <BrandMark size={32} variant="light" />
          <span className="font-display font-bold text-lg text-brand-cream tracking-tight">
            House of Wild Ink
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-sans text-brand-gold-light hover:text-brand-cream transition-colors uppercase tracking-wider"
        >
          ← Return to Public House
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-brand-parchment text-brand-ink rounded-3xl p-8 sm:p-12 border-2 border-brand-gold/60 shadow-2xl relative overflow-hidden">
          {/* Top gold threshold bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-forest via-brand-gold to-brand-coral" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-forest text-brand-gold-light mx-auto flex items-center justify-center mb-4 shadow-md">
              <KeyRound className="w-8 h-8 text-brand-coral" />
            </div>
            <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-coral">
              Private Author Entrance · Layer 1
            </span>
            <h1 className="font-display text-3xl font-bold text-brand-forest mt-1 mb-2">
              The Ink Room
            </h1>
            <p className="font-reading text-sm text-brand-forest/80 italic leading-relaxed">
              “A protected workspace for stories in the quiet before publication.”
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-brand-coral/15 border border-brand-coral/40 text-brand-forest text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-brand-coral shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-5">
            <div>
              <label
                htmlFor="gate-key"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2"
              >
                Enter Access Key
              </label>
              <div className="relative">
                <input
                  id="gate-key"
                  type="password"
                  required
                  autoFocus
                  disabled={status === "locked" || status === "submitting"}
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Master authorization key..."
                  className="w-full px-4 py-3.5 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/50 focus:outline-none focus:ring-2 focus:ring-brand-coral pr-10 font-mono tracking-wider"
                />
                <Lock className="w-4 h-4 text-brand-forest/40 absolute right-3.5 top-4" />
              </div>
              <p className="text-[11px] font-sans text-brand-forest/60 mt-2">
                Protected by rate-limiting (max 5 attempts) and slow cryptographic derivation.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "locked" || status === "submitting" || !accessKey}
              className="w-full py-3.5 rounded-xl bg-brand-forest text-brand-cream font-sans font-semibold text-xs tracking-wider uppercase hover:bg-brand-forest/90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-gold-light" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <>
                  <span>Unlock Doorway</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold-light" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-gold/20 text-center text-[11px] font-sans text-brand-forest/60">
            For Linda Emefa Daniels and authorized contributors only.
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-brand-parchment/60 py-4 font-sans">
        House of Wild Ink Secure Vault · Server-Validated Session Architecture
      </footer>
    </div>
  );
}
