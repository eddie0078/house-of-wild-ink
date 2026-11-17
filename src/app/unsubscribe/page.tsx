"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { BougainvilleaBractCluster } from "@/components/Bougainvillea";
import { FloralDivider } from "@/components/FloralDivider";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, HeartHandshake } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const initialStatus = searchParams.get("status");

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(initialStatus === "unsubscribed");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Unable to unsubscribe at this time.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again or email lindaemefadaniels@gmail.com directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] text-xs font-serif text-[#D81E28]">
          <BougainvilleaBractCluster color="coral" size={18} />
          <span className="tracking-widest uppercase text-[11px] font-semibold text-[#182C25]">
            Reader Dispatch Preferences
          </span>
          <BougainvilleaBractCluster color="magenta" size={18} />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-[#182C25] font-bold">
          Peaceful Unsubscribe
        </h1>
        <p className="font-reading italic text-base sm:text-lg text-[#64746E]">
          “We believe in voluntary reading and quiet inboxes.”
        </p>
      </div>

      <div className="floral-card bg-[#FAF8F5] rounded-2xl p-8 sm:p-10 border border-[rgba(197,160,89,0.3)] shadow-xs">
        {success ? (
          <div className="text-center space-y-4 py-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-[#182C25]/10 text-[#182C25] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-[#2D5A46]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#182C25]">
              You have been unsubscribed
            </h2>
            <p className="font-reading text-base text-[#182C25]/85 leading-relaxed">
              Your email has been removed from our dispatch list. You will receive no further scheduled letters or notifications from House of Wild Ink.
            </p>
            <p className="text-xs text-[#64746E] pt-2">
              If this was a mistake or you ever wish to return, our garden doors are always open.
            </p>
            <div className="pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#182C25] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2D5A46] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to House of Wild Ink</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-[#182C25]/85 leading-relaxed font-reading">
              Enter your email address below to immediately opt out of literary dispatches, new publication alerts, and letters from Linda Emefa Daniels’ desk.
            </p>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="unsub-email" className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#64746E] mb-2">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="unsub-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[rgba(197,160,89,0.4)] text-sm text-[#182C25] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#D81E28] hover:bg-[#b51720] text-white text-xs font-sans font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? "Processing Unsubscribe..." : "Unsubscribe From Dispatches"}
            </button>

            <div className="pt-4 border-t border-[rgba(197,160,89,0.2)] text-center">
              <p className="text-xs text-[#64746E]">
                Need complete record erasure or have questions? Email Linda directly at{" "}
                <a href="mailto:lindaemefadaniels@gmail.com" className="text-[#D81E28] underline underline-offset-2">
                  lindaemefadaniels@gmail.com
                </a>.
              </p>
            </div>
          </form>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#64746E] hover:text-[#182C25] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="max-w-xl mx-auto py-24 text-center text-sm font-reading text-[#64746E]">Loading preferences...</div>}>
        <UnsubscribeContent />
      </Suspense>
    </PublicShell>
  );
}
