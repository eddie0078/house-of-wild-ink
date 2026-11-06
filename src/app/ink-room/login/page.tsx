"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { ShieldCheck, UserCheck, AlertCircle, Loader2, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InkRoomLoginPage() {
  const [email, setEmail] = useState("lindaemefadaniels@gmail.com");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignIn = async (userEmail: string) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/ink-room/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Access denied. Account not authorized.");
        return;
      }

      // Successful authorization: Enter Ink Room Dashboard
      window.location.href = "/ink-room";
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("Network error during identity verification.");
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
          href="/ink-room/gate"
          className="text-xs font-sans text-brand-gold-light hover:text-brand-cream transition-colors uppercase tracking-wider"
        >
          ← Lock to Key Gate
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-brand-parchment text-brand-ink rounded-3xl p-8 sm:p-12 border-2 border-brand-gold/60 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-brand-gold" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-forest text-brand-gold-light mx-auto flex items-center justify-center mb-4 shadow-md">
              <UserCheck className="w-8 h-8 text-brand-coral" />
            </div>
            <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-coral">
              Identity Verification · Layer 2
            </span>
            <h1 className="font-display text-3xl font-bold text-brand-forest mt-1 mb-2">
              Author Identity
            </h1>
            <p className="font-reading text-sm text-brand-forest/80 italic leading-relaxed">
              “Verifying approved writer credentials against the author registry.”
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-brand-coral/15 border border-brand-coral/40 text-brand-forest text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-brand-coral shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn(email);
            }}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="author-email"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2"
              >
                Authorized Author Email (Google Account)
              </label>
              <input
                id="author-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full px-4 py-3.5 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/50 focus:outline-none focus:ring-2 focus:ring-brand-coral"
              />
              <p className="text-[11px] font-sans text-brand-forest/60 mt-2">
                No public signups. Only accounts granted active roles in The Ink Room will be admitted.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || !email}
              className="w-full py-3.5 rounded-xl bg-brand-forest text-brand-cream font-sans font-semibold text-xs tracking-wider uppercase hover:bg-brand-forest/90 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-gold-light" />
                  <span>Verifying Author...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Author</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold-light" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Access Fast Lane for Linda */}
          <div className="mt-8 pt-6 border-t border-brand-gold/25">
            <span className="block text-[11px] font-sans font-semibold text-brand-forest/70 uppercase tracking-wider mb-2 text-center">
              Owner Fast Sign-In
            </span>
            <button
              type="button"
              onClick={() => handleSignIn("linda@houseofwildink.com")}
              className="w-full py-2.5 rounded-xl border border-brand-gold/60 bg-brand-cream hover:bg-brand-forest hover:text-brand-cream text-brand-forest text-xs font-sans font-semibold transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-brand-coral" />
              <span>Linda Emefa Daniels (Owner Role)</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-brand-parchment/60 py-4 font-sans">
        The Ink Room · Protected Author Publishing System
      </footer>
    </div>
  );
}
