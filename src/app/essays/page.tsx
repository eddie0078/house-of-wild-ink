import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { PublicShell } from "@/components/PublicShell";
import { FloralDivider } from "@/components/FloralDivider";
import { BookOpen, Clock, ArrowRight, Feather } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Essays & Articles — House of Wild Ink",
  description: "Critical commentary, long-form reflections, and essays by Linda Emefa Daniels.",
};

export default function EssaysIndexPage() {
  const allItems = db.getContentItems({ status: "published" });
  const essays = allItems.filter(
    (item) => item.content_type === "essay" || item.content_type === "article" || item.content_type === "reflection"
  );

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 floral-watermark">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] text-xs font-serif text-[#C85A46]">
            <span>🌸</span>
            <span className="tracking-widest uppercase text-[11px] font-semibold text-[#182C25]">
              Essays, Reflections & Articles
            </span>
            <span>✿</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#182C25]">
            The Ink Archive
          </h1>
          <p className="font-reading italic text-lg sm:text-xl text-[#64746E]">
            “Where lived faith, quiet observations, and honest sentences meet.”
          </p>
          <p className="text-sm text-[#182C25]/80 max-w-2xl mx-auto leading-relaxed">
            Explorations outside the bounds of verse and script. Long-form commentary, essays, and meditations on art, life, and the conversations we hold together.
          </p>
        </div>

        <FloralDivider variant="rose" className="my-10" />

        {/* Essays List / Grid */}
        {essays.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF8F5] rounded-2xl border border-[rgba(197,160,89,0.3)] max-w-xl mx-auto p-8">
            <Feather className="w-12 h-12 text-[#C5A059] mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-[#182C25]">New Essays Being Penned</h3>
            <p className="text-xs text-[#64746E] mt-1">Linda is currently writing upcoming reflections in The Ink Room.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {essays.map((essay) => {
              const coverUrl = essay.cover_image_url;

              return (
                <article
                  key={essay.id}
                  className="floral-card bg-[#FAF8F5] rounded-2xl overflow-hidden flex flex-col group border border-[rgba(197,160,89,0.3)] shadow-xs"
                >
                  {/* Optional Representative Artwork */}
                  {coverUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
                      <Image
                        src={coverUrl}
                        alt={essay.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#64746E]">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-[#C85A46] bg-[#C85A46]/10 px-2 py-0.5 rounded-full">
                          {essay.content_type.replace("_", " ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C5A059]" />
                          {essay.reading_time_minutes} min read
                        </span>
                      </div>

                      <h2 className="font-display text-2xl font-bold text-[#182C25] group-hover:text-[#C85A46] transition-colors leading-snug">
                        <Link href={`/essays/${essay.slug}`}>
                          {essay.title}
                        </Link>
                      </h2>

                      {essay.subtitle && (
                        <p className="font-reading italic text-sm text-[#64746E]">
                          {essay.subtitle}
                        </p>
                      )}

                      <p className="font-reading text-base text-[#182C25]/85 leading-relaxed line-clamp-4">
                        {essay.excerpt || essay.raw_content.slice(0, 180)}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[rgba(197,160,89,0.2)] flex items-center justify-between">
                      <span className="text-xs font-serif text-[#64746E]">
                        By <span className="font-semibold text-[#182C25]">{essay.author_credit}</span>
                      </span>
                      <Link
                        href={`/essays/${essay.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C85A46] group-hover:translate-x-1 transition-transform"
                      >
                        <span>Read Essay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <FloralDivider variant="leaf" className="mt-16" />
      </div>
    </PublicShell>
  );
}
