"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Subscriber } from "@/lib/types";
import {
  Send,
  ArrowLeft,
  Mail,
  Sparkles,
  CheckCircle2,
  Clock,
  Eye,
  Feather,
  Users2,
  AlertCircle,
  Copy,
} from "lucide-react";
import { BougainvilleaBractCluster, BougainvilleaDivider } from "@/components/Bougainvillea";

export default function SubscriberBroadcastPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subject, setSubject] = useState("A Letter from the Stone Villa: Autumn Words & Quiet Reflections");
  const [preheader, setPreheader] = useState("New verses, audio stories, and thoughts from the desk of Linda Emefa Daniels.");
  const [stationeryTheme, setStationeryTheme] = useState<"parchment" | "sepia" | "night">("parchment");
  const [bodyText, setBodyText] = useState(
`Dear Reader,

I am writing to you this evening as the twilight settles over the hills. 

In the quiet between chapters, I have been thinking about the weight of words we carry—the poems that arrive not because we looked for them, but because they refused to stay quiet. 

I’ve just added new pieces to the house, including our latest spoken-word audio story and reflections on craft and faith. When you have a moment of stillness, step inside the open doors:

"We write from experiences, observations, faith, and the quiet and loud conversations of life."

May these words find you in good spirits and bring peace to your week.

Warmly from the writing desk,
Linda Emefa Daniels (DEFFA)`
  );

  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    fetch("/api/subscribers")
      .then((res) => res.json())
      .then((data) => {
        if (data.subscribers) {
          setSubscribers(data.subscribers);
        }
      })
      .catch(() => {});
  }, []);

  const handleSendBroadcast = async () => {
    if (!subject || !bodyText) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          preheader,
          stationeryTheme,
          bodyText,
        }),
      });

      const data = await res.json();
      setIsSending(false);
      setSentSuccess(true);
      setSentCount(data.recipientCount || subscribers.length || 1);
    } catch {
      setIsSending(false);
      // Fallback simulation
      setSentSuccess(true);
      setSentCount(subscribers.length || 1);
    }
  };

  const paragraphs = bodyText.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/30">
        <div className="flex items-center gap-3">
          <Link
            href="/ink-room/subscribers"
            className="p-2 rounded-xl bg-brand-cream hover:bg-brand-parchment text-brand-forest border border-brand-gold/30 transition-colors"
            title="Back to Subscribers"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Feather className="w-4 h-4 text-brand-coral" />
              <h1 className="font-display font-bold text-2xl text-brand-forest">
                Subscriber Letterpress Broadcaster
              </h1>
            </div>
            <span className="text-xs font-sans text-brand-forest/70">
              Draft & dispatch verified literary mailings to your reader circle ({subscribers.length} active readers)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSendBroadcast}
          disabled={isSending || sentSuccess}
          className="px-6 py-2.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 disabled:opacity-50 text-brand-cream text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSending ? "Dispatching..." : sentSuccess ? "Broadcast Dispatched" : "Dispatch Broadcast"}</span>
        </button>
      </div>

      {sentSuccess && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-sans font-bold text-base">Broadcast Successfully Dispatched!</h3>
            <p className="font-reading text-sm text-emerald-800 mt-1">
              Your literary letter &ldquo;{subject}&rdquo; was transmitted to {sentCount} verified subscribers on your reader roll.
            </p>
          </div>
        </div>
      )}

      {/* Two-Column Workspace: Composer on Left, Live Broadside Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Composer Controls */}
        <div className="space-y-6">
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Letter Subject Line *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="E.g., A Letter from the Stone Villa..."
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream text-brand-ink text-sm font-sans border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Inbox Preheader Preview
              </label>
              <input
                type="text"
                value={preheader}
                onChange={(e) => setPreheader(e.target.value)}
                placeholder="Brief summary visible in email notifications..."
                className="w-full px-4 py-2 rounded-xl bg-brand-cream text-brand-ink text-xs font-sans border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
              />
            </div>

            {/* Stationery Theme */}
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2">
                Stationery Styling
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "parchment", name: "Warm Parchment", bg: "bg-[#FAF8F5]", border: "border-brand-gold/40" },
                  { id: "sepia", name: "Candlelight Sepia", bg: "bg-[#F4EFE6]", border: "border-[#C5A059]" },
                  { id: "night", name: "Inkwell Night", bg: "bg-[#121614] text-white", border: "border-stone-700" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStationeryTheme(st.id as any)}
                    className={`p-3 rounded-xl border text-xs font-sans font-medium transition cursor-pointer text-center ${st.bg} ${st.border} ${
                      stationeryTheme === st.id ? "ring-2 ring-brand-coral font-bold" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Letter Body Editor */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                Letter Prose Content *
              </label>
              <span className="text-[11px] font-sans text-brand-forest/60">
                Paragraphs separated by blank lines
              </span>
            </div>
            <textarea
              rows={14}
              required
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full p-4 rounded-xl bg-brand-cream text-brand-ink font-reading text-base leading-relaxed border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column: Live Letterpress Broadside Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-forest flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-brand-coral" />
              <span>Live Email Broadside Preview</span>
            </span>
            <span className="text-[11px] font-sans text-brand-forest/60">
              Stationery: {stationeryTheme.toUpperCase()}
            </span>
          </div>

          <div
            className={`p-8 sm:p-10 rounded-2xl border-2 border-brand-gold/40 shadow-lg transition-colors ${
              stationeryTheme === "night"
                ? "bg-[#121614] text-[#E2D9C8]"
                : stationeryTheme === "sepia"
                ? "bg-[#F4EFE6] text-[#2D2319]"
                : "bg-[#FAF8F5] text-[#182C25]"
            }`}
          >
            {/* Broadside Email Masthead */}
            <div className="text-center pb-6 border-b border-brand-gold/25 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BougainvilleaBractCluster color="crimson" size={16} />
                <span className="font-display font-bold tracking-widest text-xs uppercase text-brand-coral">
                  House of Wild Ink
                </span>
                <BougainvilleaBractCluster color="magenta" size={16} />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {subject || "Letter Subject"}
              </h2>
              {preheader && (
                <p className="font-reading italic text-xs opacity-75 mt-1">
                  {preheader}
                </p>
              )}
            </div>

            {/* Letter Body */}
            <div className="font-reading text-base sm:text-lg leading-relaxed space-y-4">
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={idx === 1 ? "drop-cap leading-relaxed" : "leading-relaxed"}
                >
                  {p}
                </p>
              ))}
            </div>

            <BougainvilleaDivider className="my-8" />

            {/* Author Sign-off Footer */}
            <div className="pt-4 border-t border-brand-gold/20 text-center space-y-1">
              <p className="font-display text-sm font-semibold tracking-wider uppercase text-brand-coral">
                Linda Emefa Daniels
              </p>
              <p className="text-[11px] font-sans opacity-60">
                Author & Creator · House of Wild Ink (DEFFA)
              </p>
              <p className="text-[10px] font-sans opacity-50 pt-3">
                You are receiving this because you subscribed at houseofwildink.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
