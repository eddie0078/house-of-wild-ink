import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Users2, CheckCircle, Mail, Send, Feather } from "lucide-react";

export const dynamic = "force-dynamic";

export default function InkRoomSubscribersPage() {
  const subscribers = db.getSubscribers();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/30">
        <div>
          <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
            Audience
          </span>
          <h1 className="font-display text-3xl font-bold text-brand-forest">
            Subscriber Roll ({subscribers.length})
          </h1>
          <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
            First-party readers who have consented to receive literary letters directly from House of Wild Ink.
          </p>
        </div>

        <Link
          href="/ink-room/subscribers/broadcast"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-brand-cream text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Compose Literary Letter</span>
        </Link>
      </div>

      <div className="bg-brand-parchment rounded-2xl border border-brand-gold/30 overflow-hidden shadow-xs">
        {subscribers.length > 0 ? (
          <div className="divide-y divide-brand-gold/20">
            {subscribers.map((sub) => (
              <div key={sub.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-brand-cream/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-forest/10 text-brand-forest flex items-center justify-center">
                    <Mail className="w-4 h-4 text-brand-coral" />
                  </div>
                  <div>
                    <span className="font-sans font-semibold text-sm text-brand-forest block">
                      {sub.email}
                    </span>
                    <span className="text-[11px] font-sans text-brand-forest/60">
                      Subscribed from {sub.source_page} · {new Date(sub.subscribed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-sans uppercase font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <Users2 className="w-8 h-8 text-brand-gold mx-auto mb-3" />
            <h3 className="font-display text-xl text-brand-forest mb-1">No subscribers yet</h3>
            <p className="font-reading italic text-brand-forest/70">
              When readers subscribe on the homepage or newsletter page, their addresses are safely stored here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
