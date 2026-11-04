import React from "react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { BotanicalFrame } from "@/components/BotanicalFrame";
import { FloralDivider } from "@/components/FloralDivider";
import { db } from "@/lib/db";
import { Feather, Download, ArrowRight, Sparkles, BookOpen, Headphones } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Linda Emefa Daniels — House of Wild Ink",
  description: "Linda Emefa Daniels (L.E. Daniels | DEFFA) — Author and creator of House of Wild Ink. “A home for stories that refuse to stay quiet.”",
};

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const settings = db.getSettings();
  const lindaProfile = db.getPersonBySlug("linda-emefa-daniels") || db.getPeople()[0];
  const works = lindaProfile?.selected_work_ids
    .map((id) => db.getContentById(id))
    .filter((w): w is NonNullable<typeof w> => w !== undefined && w.status === "published") || [];

  const portraitSrc = settings.press_photo_url || "/images/linda-emefa-daniels.jpg";

  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 floral-watermark">
        {/* Editorial Two-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
          {/* Left Column: Arched Botanical Portrait */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <BotanicalFrame
              src={portraitSrc}
              alt="Linda Emefa Daniels, author and creator of House of Wild Ink"
              width={420}
              height={530}
              priority
              className="max-w-sm sm:max-w-md w-full"
            />

            {/* Press Photo Download Button */}
            <div className="mt-8">
              <a
                href={portraitSrc}
                download="Linda-Emefa-Daniels-Author-Portrait.jpg"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(197,160,89,0.5)] bg-[#FAF8F5] text-[#182C25] text-xs font-serif font-semibold tracking-wide hover:bg-[#182C25] hover:text-[#FAF8F5] transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#C85A46]" />
                <span>Download Official Press Photograph</span>
              </a>
            </div>
          </div>

          {/* Right Column: Title, Credentials & Verified Statement */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] text-xs font-serif text-[#C85A46]">
              <span>🌸</span>
              <span className="tracking-widest uppercase text-[11px] font-semibold text-[#182C25]">
                Author & Creator
              </span>
              <span>✿</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl text-[#182C25] font-bold tracking-tight leading-tight">
              Linda Emefa Daniels
            </h1>

            <p className="font-serif text-sm tracking-widest uppercase text-[#C85A46] font-semibold flex items-center gap-2">
              <span>L.E. Daniels | DEFFA</span>
              <span className="text-[#C5A059]">•</span>
              <span className="text-[#64746E]">Writer • Storyteller • Founder</span>
            </p>

            {/* Verified Author Statement (Supplied Content) */}
            <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[rgba(197,160,89,0.35)] shadow-xs relative">
              <span className="text-2xl text-[#C85A46] absolute top-4 right-6 opacity-30 font-serif">🌸</span>
              <blockquote className="font-reading italic text-lg sm:text-xl text-[#182C25] leading-relaxed mb-4">
                “{settings.about_linda_statement}”
              </blockquote>
              <p className="font-sans text-xs text-[#64746E] uppercase tracking-widest text-right font-medium">
                — L.E. Daniels | DEFFA
              </p>
            </div>

            {/* Biography & Mission */}
            <div className="prose prose-lg max-w-none text-[#182C25]/90 space-y-4 font-reading text-lg leading-relaxed">
              <p>
                {lindaProfile?.short_bio || settings.about_linda_short_bio}
              </p>
              <p>
                House of Wild Ink was conceived as an intimate, enduring home for writing that resists neat categorization—spanning poetry, narrative fiction, spoken audio stories, character-focused short dramas, and personal essays.
              </p>
            </div>
          </div>
        </div>

        <FloralDivider variant="rose" className="my-12" />

        {/* Selected Works Connected Dynamically */}
        {works.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-[#182C25] font-bold">
                  Inaugural Works & Catalog
                </h2>
                <p className="text-xs font-serif text-[#64746E] mt-1">
                  Pieces selected and curated from the private desk
                </p>
              </div>
              <span className="text-sm text-[#C85A46]">🌸</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((w) => {
                const getHref = () => {
                  if (w.content_type === "poem") return `/poems/${w.slug}`;
                  if (w.content_type === "audio_story") return `/audio-stories/${w.slug}`;
                  if (w.content_type === "essay") return `/essays/${w.slug}`;
                  return `/stories/${w.slug}`;
                };

                return (
                  <div
                    key={w.id}
                    className="floral-card bg-[#FAF8F5] p-6 rounded-2xl border border-[rgba(197,160,89,0.3)] hover:border-[#C5A059] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-wider text-[#C85A46] font-semibold bg-[#C85A46]/10 px-2 py-0.5 rounded-full">
                        {w.content_type.replace("_", " ")}
                      </span>
                      <h3 className="font-display text-xl text-[#182C25] font-bold mt-2 mb-2 hover:text-[#C85A46] transition-colors">
                        <Link href={getHref()}>{w.title}</Link>
                      </h3>
                      <p className="font-reading text-sm text-[#182C25]/80 line-clamp-3">
                        {w.excerpt}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[rgba(197,160,89,0.2)] flex justify-end">
                      <Link
                        href={getHref()}
                        className="text-xs font-serif font-semibold text-[#C85A46] hover:text-[#182C25] transition-colors inline-flex items-center gap-1"
                      >
                        <span>Experience Piece</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Press Assets & Direct Inquiry */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#182C25] text-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs text-[#DFC182] font-serif uppercase tracking-wider mb-1">
              <span>🌸</span>
              <span>Direct Representation</span>
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Press & Literary Inquiries</h3>
            <p className="font-sans text-xs text-[#FAF8F5]/80 max-w-md leading-relaxed">
              For speaking engagements, interviews, readings, and publication permissions, reach out directly through the author's contact desk.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-[#C85A46] text-white font-sans font-semibold text-xs tracking-wider uppercase hover:bg-[#b04a38] transition-all shadow-md"
            >
              Contact Desk
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
