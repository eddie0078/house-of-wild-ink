import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Feather, Plus, CheckCircle, Clock, Sparkles, Trash2, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function InkRoomPoemsPage() {
  const poems = db.getContentItems({ type: "poem" });
  const collections = db.getCollections();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/30">
        <div>
          <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
            Registry
          </span>
          <h1 className="font-display text-3xl font-bold text-brand-forest">
            Poetry Collection & Drafts
          </h1>
          <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
            Manage all verses, stanza layouts, and publication status.
          </p>
        </div>

        <Link
          href="/ink-room/poems/editor"
          className="px-4 py-2.5 rounded-xl bg-brand-coral text-brand-cream text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-coral/90 transition-all inline-flex items-center gap-2 shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Poem</span>
        </Link>
      </div>

      {/* Table / Cards */}
      <div className="bg-brand-parchment rounded-2xl border border-brand-gold/30 overflow-hidden shadow-xs">
        <div className="divide-y divide-brand-gold/20">
          {poems.map((poem) => {
            const collection = collections.find((c) => c.id === poem.collection_id);

            return (
              <div
                key={poem.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-cream/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-brand-ink">
                      {poem.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-sans uppercase font-bold ${
                        poem.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : poem.status === "scheduled"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {poem.status}
                    </span>
                    {poem.is_homepage_featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-sans uppercase font-bold bg-brand-gold/20 text-brand-forest inline-flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-brand-coral" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <p className="font-reading text-sm text-brand-forest/75 line-clamp-1 italic">
                    {poem.excerpt || poem.raw_content}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-sans text-brand-forest/60">
                    <span>Credit: {poem.author_credit}</span>
                    <span>·</span>
                    <span>Volume: {collection ? collection.title : "Uncollected"}</span>
                    <span>·</span>
                    <span>v{poem.version}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/ink-room/poems/editor?id=${poem.id}`}
                    className="px-3.5 py-1.5 rounded-lg border border-brand-forest/30 text-brand-forest hover:bg-brand-forest hover:text-brand-cream text-xs font-sans font-semibold transition-all"
                  >
                    Edit
                  </Link>
                  {poem.status === "published" && (
                    <Link
                      href={`/poems/${poem.slug}`}
                      target="_blank"
                      className="px-3.5 py-1.5 rounded-lg bg-brand-cream border border-brand-gold/40 text-brand-forest hover:text-brand-coral text-xs font-sans font-semibold transition-all"
                    >
                      View Live
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
