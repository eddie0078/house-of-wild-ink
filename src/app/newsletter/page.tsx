import React from "react";
import { PublicShell } from "@/components/PublicShell";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Mail, ShieldCheck, HeartHandshake } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Letters from House of Wild Ink by Linda Emefa Daniels. Quiet, first-party literary mailings.",
};

export default function NewsletterPage() {
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-6 py-20 sm:py-32 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-forest text-brand-gold-light mx-auto flex items-center justify-center mb-6 shadow-xs">
          <Mail className="w-8 h-8 text-brand-coral" />
        </div>

        <span className="font-sans text-xs tracking-widest uppercase text-brand-coral font-semibold">
          Quiet Dispatches
        </span>
        <h1 className="font-display text-4xl sm:text-6xl text-brand-forest font-bold tracking-tight mt-1 mb-6">
          The House Newsletter
        </h1>

        <p className="font-reading text-xl text-brand-forest/90 leading-relaxed max-w-xl mx-auto mb-10 italic">
          “Words sent only when there is something true to say.”
        </p>

        <p className="font-sans text-base text-brand-forest/80 leading-relaxed max-w-lg mx-auto mb-12">
          Subscribe to receive Linda Emefa Daniels’ latest poems, short drama premieres, and reflective essays.
          We never share your email address, run third-party advertising, or send promotional noise.
        </p>

        {/* Newsletter Form */}
        <div className="bg-brand-cream p-8 sm:p-12 rounded-2xl border border-brand-gold/30 shadow-xs mb-12">
          <NewsletterForm sourcePage="/newsletter" />
        </div>

        {/* Privacy Reassurance Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-lg mx-auto">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-coral shrink-0 mt-0.5" />
            <p className="text-xs font-sans text-brand-forest/75 leading-relaxed">
              <strong>First-Party Protection:</strong> Your subscription is stored on our secure server, completely insulated from cross-site ad networks.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-brand-coral shrink-0 mt-0.5" />
            <p className="text-xs font-sans text-brand-forest/75 leading-relaxed">
              <strong>Complete Control:</strong> You can unsubscribe with a single click at any time without questions.
            </p>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
