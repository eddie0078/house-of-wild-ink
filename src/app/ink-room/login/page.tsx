"use client";

import React, { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { UserCheck, AlertCircle, Loader2, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function InkRoomLoginPage() {
  const [email, setEmail] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !accessKey) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/ink-room/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), key: accessKey.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Access denied. Invalid credentials.");
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
          href="/"
          className="text-xs font-sans text-brand-gold-light hover:text-brand-cream transition-colors uppercase tracking-wider"
        >
          ← Return to Public House
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-brand-parchment text-brand-ink rounded-3xl p-8 sm:p-12 border-2 border-brand-gold/60 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-forest via-brand-gold to-brand-coral" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-forest text-brand-gold-light mx-auto flex items-center justify-center mb-4 shadow-md">
              <UserCheck className="w-8 h-8 text-brand-coral" />
            </div>
            <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-coral">
              Private Author Vault
            </span>
            <h1 className="font-display text-3xl font-bold text-brand-forest mt-1 mb-2">
              The Ink Room Sign In
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

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="author-email"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1.5"
              >
                Author Email
              </label>
              <input
                id="author-email"
                type="email"
                required
                autoFocus
                disabled={status === "submitting"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-author-email@domain.com"
                className="w-full px-4 py-3 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/50 focus:outline-none focus:ring-2 focus:ring-brand-coral font-sans"
              />
            </div>

            <div>
              <label
                htmlFor="author-key"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1.5"
              >
                Vault Access Key
              </label>
              <div className="relative">
                <input
                  id="author-key"
                  type={showKey ? "text" : "password"}
                  required
                  disabled={status === "submitting"}
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/50 focus:outline-none focus:ring-2 focus:ring-brand-coral font-mono pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-3.5 text-brand-forest/50 hover:text-brand-forest transition-colors cursor-pointer"
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] font-sans text-brand-forest/60 mt-2">
                Protected by rate-limiting (max 5 attempts) and cryptographic PBKDF2 derivation.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || !email || !accessKey}
              className="w-full py-3.5 mt-2 rounded-xl bg-brand-forest text-brand-cream font-sans font-semibold text-xs tracking-wider uppercase hover:bg-brand-forest/90 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-gold-light" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter The Ink Room</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold-light" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-gold/20 text-center text-[11px] font-sans text-brand-forest/60">
            For Linda Emefa Daniels and authorized literary contributors only.
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-brand-parchment/60 py-4 font-sans">
        The Ink Room · Protected Author Publishing System
      </footer>
    </div>
  );
}
