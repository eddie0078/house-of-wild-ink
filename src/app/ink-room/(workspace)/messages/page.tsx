import React from "react";
import { db } from "@/lib/db";
import { Mail, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function InkRoomMessagesPage() {
  const messages = db.getMessages();

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-brand-gold/30">
        <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
          Inquiries
        </span>
        <h1 className="font-display text-3xl font-bold text-brand-forest">
          The Messages Desk
        </h1>
        <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
          Review reader responses, editorial inquiries, and speaking proposals sent from the Contact page.
        </p>
      </div>

      <div className="bg-brand-parchment rounded-2xl border border-brand-gold/30 overflow-hidden shadow-xs">
        {messages.length > 0 ? (
          <div className="divide-y divide-brand-gold/20">
            {messages.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-brand-cream/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-base text-brand-forest">
                      {msg.sender_name}
                    </span>
                    <span className="text-xs font-sans text-brand-forest/60">
                      &lt;{msg.sender_email}&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase font-bold bg-brand-coral/15 text-brand-coral">
                      {msg.inquiry_category}
                    </span>
                    <span className="text-xs font-sans text-brand-forest/50">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="font-reading text-sm text-brand-forest/90 leading-relaxed bg-brand-cream p-4 rounded-xl border border-brand-gold/20">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <Mail className="w-8 h-8 text-brand-gold mx-auto mb-3" />
            <h3 className="font-display text-xl text-brand-forest mb-1">Desk is clear</h3>
            <p className="font-reading italic text-brand-forest/70">
              No messages have been submitted yet. Inquiries from the Contact page appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
