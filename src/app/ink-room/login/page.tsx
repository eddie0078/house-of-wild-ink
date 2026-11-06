"use client";

import React, { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { ShieldCheck, UserCheck, AlertCircle, Loader2, KeyRound, ArrowRight, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function InkRoomLoginPage() {
  const [email, setEmail] = useState("lindaemefadaniels@gmail.com");
  const [accessKey, setAccessKey] = useState("WildInk2026!AuthorVault");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSignIn = async (userEmail: string, keyVal: string) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/ink-room/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, key: keyVal }),
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

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText("WildInk2026!AuthorVault");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
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

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-forest text-brand-gold-light mx-auto flex items-center justify-center mb-4 shadow-md">
              <UserCheck className="w-8 h-8 text-brand-coral" />
            </div>
            <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-coral">
              Author Publishing Vault
            </span>
            <h1 className="font-display text-3xl font-bold text-brand-forest mt-1 mb-2">
              The Ink Room Sign In
            </h1>
            <p className="font-reading text-sm text-brand-forest/80 italic leading-relaxed">
              “Verifying approved writer credentials against the author registry.”
            </p>
          </div>

          {/* Quick Credential Box */}
          <div className="mb-6 p-4 rounded-2xl bg-brand-cream border border-brand-gold/40 text-xs font-sans">
            <div className="flex items-center justify-between font-bold text-brand-forest uppercase tracking-wider text-[11px] mb-1.5">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-brand-coral" />
                Master Vault Key:
              </span>
              <button
                type="button"
                onClick={copyKeyToClipboard}
                className="text-[10px] text-brand-coral hover:text-brand-forest transition-colors flex items-center gap-1 font-mono font-normal"
              >
                {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedKey ? "Copied" : "Copy Key"}
              </button>
            </div>
            <code className="block bg-brand-parchment px-2.5 py-1.5 rounded-lg border border-brand-gold/30 font-mono text-[11px] text-brand-forest font-semibold mb-2 select-all">
              WildInk2026!AuthorVault
            </code>
            <div className="text-[11px] text-brand-forest/70">
              <strong className="text-brand-forest">Owner Email:</strong> lindaemefadaniels@gmail.com
            </div>
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
              handleSignIn(email, accessKey);
            }}
            className="space-y-4"
          >
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lindaemefadaniels@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/50 focus:outline-none focus:ring-2 focus:ring-brand-coral font-sans"
              />
            </div>

            <div>
              <label
                htmlFor="author-key"
                className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1.5"
              >
                Access Key
              </label>
              <input
                id="author-key"
                type="text"
                required
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="WildInk2026!AuthorVault"
                className="w-full px-4 py-3 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/50 focus:outline-none focus:ring-2 focus:ring-brand-coral font-mono"
              />
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
                  <span>Sign In as Author</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold-light" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Access 1-Click Fast Lane for Linda */}
          <div className="mt-6 pt-5 border-t border-brand-gold/25">
            <span className="block text-[11px] font-sans font-semibold text-brand-forest/70 uppercase tracking-wider mb-2 text-center">
              1-Click Owner Fast Sign-In
            </span>
            <button
              type="button"
              disabled={status === "submitting"}
              onClick={() => handleSignIn("lindaemefadaniels@gmail.com", "WildInk2026!AuthorVault")}
              className="w-full py-2.5 rounded-xl border border-brand-gold/60 bg-brand-cream hover:bg-brand-forest hover:text-brand-cream text-brand-forest text-xs font-sans font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
