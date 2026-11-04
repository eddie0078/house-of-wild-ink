"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function NewsletterForm({ sourcePage = "/" }: { sourcePage?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sourcePage }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
      setMessage(data.message || "Thank you. Your email is recorded in the subscriber roll.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Unable to complete subscription. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {status === "success" ? (
        <div className="p-4 rounded-xl bg-brand-parchment/15 border border-brand-gold/40 text-brand-parchment flex items-start gap-3 text-left">
          <CheckCircle2 className="w-5 h-5 text-brand-gold-light shrink-0 mt-0.5" />
          <p className="text-sm font-sans">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address..."
              required
              className="flex-1 px-4 py-3 rounded-full bg-brand-parchment text-brand-ink placeholder:text-brand-forest/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-coral border border-brand-gold/40"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 rounded-full bg-brand-coral text-brand-cream font-sans font-semibold text-xs tracking-wider uppercase hover:bg-brand-coral/90 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </div>

          {status === "error" && (
            <div className="flex items-center gap-1.5 text-xs text-brand-coral justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{message}</span>
            </div>
          )}

          <p className="text-[11px] font-sans text-brand-parchment/60 text-center">
            Zero advertising or spam. Saved to our first-party subscriber list. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  );
}
