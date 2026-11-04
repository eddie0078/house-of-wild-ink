import React from "react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { BrandMark } from "@/components/BrandMark";
import { db } from "@/lib/db";
import { Feather, Download, ArrowRight, BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Linda Emefa Daniels",
  description: "Linda Emefa Daniels (L.E. Daniels | DEFFA) — Author and creator of House of Wild Ink. “A home for stories that refuse to stay quiet.”",
};

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const settings = db.getSettings();
  const lindaProfile = db.getPersonBySlug("linda-emefa-daniels") || db.getPeople()[0];
  const works = lindaProfile?.selected_work_ids
    .map((id) => db.getContentById(id))
    .filter((w): w is NonNullable<typeof w> => w !== undefined && w.status === "published") || [];

  return (
    <PublicShell>
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        {/* Header Eyebrow */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold mb-3">
            <Feather className="w-3.5 h-3.5" />
            <span>Author & Creator</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-brand-forest font-bold tracking-tight mb-2">
            Linda Emefa Daniels
          </h1>
          <p className="font-sans text-sm tracking-widest uppercase text-brand-coral font-semibold">
            L.E. Daniels | DEFFA
          </p>
        </div>

        {/* Verified Author Statement (Supplied Content) */}
        <div className="bg-brand-cream rounded-2xl p-8 sm:p-12 border border-brand-gold/30 shadow-xs mb-16">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-coral font-semibold block mb-4">
            The Author’s Note
          </span>
          <blockquote className="font-reading italic text-xl sm:text-2xl text-brand-ink leading-relaxed mb-6 selection:bg-brand-gold/30">
            “{settings.about_linda_statement}”
          </blockquote>
          <p className="font-sans text-xs text-brand-forest/70 uppercase tracking-widest text-right">
            — L.E. Daniels | DEFFA
          </p>
        </div>

        {/* Short Biography & Verified Profile */}
        <div className="prose prose-lg prose-stone max-w-none mb-16">
          <h2 className="font-display text-3xl text-brand-forest mb-4">The Writing Life</h2>
          <p className="font-reading text-xl text-brand-forest/90 leading-relaxed">
            {lindaProfile?.short_bio || settings.about_linda_short_bio}
          </p>
          <p className="font-reading text-xl text-brand-forest/90 leading-relaxed mt-4">
            House of Wild Ink was conceived as an intimate, enduring home for writing that resists neat categorization—spanning poetry, narrative fiction, character-focused short dramas, and personal essays.
          </p>
        </div>

        {/* Selected Works Connected Dynamically */}
        {works.length > 0 && (
          <div className="mb-16 pt-8 border-t border-brand-gold/20">
            <h3 className="font-display text-2xl text-brand-forest mb-6">Selected Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {works.map((w) => (
                <div
                  key={w.id}
                  className="bg-brand-cream p-6 rounded-xl border border-brand-gold/25 hover:border-brand-gold transition-colors flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-sans uppercase tracking-wider text-brand-coral font-semibold">
                      {w.content_type}
                    </span>
                    <h4 className="font-display text-xl text-brand-ink font-bold mt-1 mb-2">
                      <Link href={w.content_type === "poem" ? `/poems/${w.slug}` : `/stories/${w.slug}`}>
                        {w.title}
                      </Link>
                    </h4>
                    <p className="font-reading text-sm text-brand-forest/80 line-clamp-2">
                      {w.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-brand-gold/15 flex justify-end">
                    <Link
                      href={w.content_type === "poem" ? `/poems/${w.slug}` : `/stories/${w.slug}`}
                      className="text-xs font-sans font-semibold text-brand-coral hover:text-brand-forest transition-colors inline-flex items-center gap-1"
                    >
                      <span>Read Work</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Press Assets & Direct Inquiry */}
        <div className="p-8 rounded-2xl bg-brand-forest text-brand-cream flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold mb-1">Press & Literary Representation</h3>
            <p className="font-sans text-xs text-brand-parchment/70 max-w-md">
              For readings, speaking engagements, and official editorial inquiries, please send a message through the contact desk.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-brand-coral text-brand-cream font-sans font-semibold text-xs tracking-wider uppercase hover:bg-brand-coral/90 transition-all"
            >
              Contact Desk
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
