"use client";

import React, { useState } from "react";
import { PublicShell } from "@/components/PublicShell";
import { Mail, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { BougainvilleaBractCluster, BougainvilleaDivider, BougainvilleaCascadingVine } from "@/components/Bougainvillea";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General Note");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("error");
      setFeedback("Please fill out all required fields.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFeedback(data.message || "Your message has been safely delivered to Linda’s desk.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setFeedback(err.message || "An error occurred while sending your message. Please try again.");
    }
  };

  return (
    <PublicShell>
      <div className="relative max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {/* Decorative Bougainvillea sprig */}
        <BougainvilleaCascadingVine primaryColor="crimson" className="hidden lg:block -top-4 -right-8" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold mb-3">
            <BougainvilleaBractCluster color="crimson" size={16} />
            <span>The Writing Desk</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-brand-forest font-bold tracking-tight mb-4">
            Contact Linda
          </h1>
          <p className="font-reading text-lg sm:text-xl text-brand-forest/80 leading-relaxed italic max-w-xl mx-auto">
            Direct communication for editorial inquiries, speaking invitations, collaborative proposals, or readers sharing what a story awakened.
          </p>
        </div>

        <BougainvilleaDivider className="my-8" />

        {/* Contact Form Card */}
        <div className="bg-brand-cream rounded-2xl p-8 sm:p-12 border border-brand-gold/30 shadow-xs">
          {status === "success" ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-brand-coral mx-auto" />
              <h3 className="font-display text-2xl text-brand-forest font-bold">Message Delivered</h3>
              <p className="font-reading text-lg text-brand-forest/90 max-w-md mx-auto leading-relaxed">
                {feedback}
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 px-6 py-2.5 rounded-full border border-brand-forest text-brand-forest text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-forest hover:text-brand-cream transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="p-4 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-brand-coral text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Margaret Daniels"
                    className="w-full px-4 py-3 rounded-xl bg-brand-parchment text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2">
                    Your Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-brand-parchment text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-category" className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2">
                  Nature of Inquiry
                </label>
                <select
                  id="contact-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-brand-parchment text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
                >
                  <option value="General Note">General Note / Reader Reflection</option>
                  <option value="Literary Representation">Literary Representation / Publishing Rights</option>
                  <option value="Speaking Engagement">Speaking / Reading / Appearance</option>
                  <option value="Editorial Collaboration">Editorial or Artistic Collaboration</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2">
                  Your Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your note here..."
                  className="w-full px-4 py-3 rounded-xl bg-brand-parchment text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral leading-relaxed"
                />
              </div>

              <div className="text-xs text-brand-forest/70 font-sans">
                Privacy note: Your email is transmitted securely and stored only in Linda’s private desk. It will never be shared with advertisers or third parties.
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-coral text-brand-cream font-sans font-semibold text-xs tracking-wider uppercase hover:bg-brand-coral/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Delivering...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send to the House</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
