import React from "react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { db } from "@/lib/db";
import { Feather, Clock, ArrowRight, Tag } from "lucide-react";
import { BougainvilleaBractCluster, BougainvilleaDivider, BougainvilleaCascadingVine } from "@/components/Bougainvillea";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poems",
  description: "Editorial poetry index by Linda Emefa Daniels (L.E. Daniels | DEFFA). Preserving exact poetic whitespace, meter, and stanza forms.",
};

export const dynamic = "force-dynamic";

export default function PoemsIndexPage() {
  const poems = db.getContentItems({ type: "poem", status: "published" });
  const collections = db.getCollections(true);

  return (
    <PublicShell>
      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
        {/* Decorative corner Bougainvillea vine */}
        <BougainvilleaCascadingVine primaryColor="magenta" className="hidden lg:block -top-4 -right-4" />

        {/* Editorial Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold mb-3">
            <BougainvilleaBractCluster color="crimson" size={16} />
            <span>The Poetry Registry</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-brand-forest font-bold tracking-tight mb-4">
            Poems
          </h1>
          <p className="font-reading text-lg sm:text-xl text-brand-forest/80 leading-relaxed italic">
            Verses that hold their shape. Each line break, stanza pause, and intentional whitespace preserved as written.
          </p>
        </div>

        <BougainvilleaDivider className="my-8" />

        {/* Poetry Grid */}
        {poems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {poems.map((poem) => {
              const collection = collections.find((c) => c.id === poem.collection_id);

              return (
                <article
                  key={poem.id}
                  className="bg-brand-cream rounded-2xl p-8 border border-brand-gold/25 shadow-xs hover:border-brand-gold hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Metadata Header */}
                    <div className="flex items-center justify-between text-xs font-sans text-brand-forest/70 uppercase tracking-wider mb-4">
                      <span className="text-brand-coral font-semibold">
                        {collection ? collection.title : "Single Poem"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {poem.reading_time_minutes} min
                      </span>
                    </div>

                    {/* Title with graceful wrapping */}
                    <h2 className="font-display text-2xl sm:text-3xl text-brand-ink font-bold mb-3 hover:text-brand-coral transition-colors break-words">
                      <Link href={`/poems/${poem.slug}`}>{poem.title}</Link>
                    </h2>

                    {/* Stanza Excerpt */}
                    <p className="font-reading italic text-brand-forest/85 text-base leading-relaxed mb-6 whitespace-pre-line line-clamp-4">
                      {poem.excerpt || poem.raw_content}
                    </p>

                    {/* Tags */}
                    {poem.tags && poem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {poem.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-parchment text-brand-forest text-[11px] font-sans border border-brand-gold/20"
                          >
                            <Tag className="w-2.5 h-2.5 text-brand-coral" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-6 border-t border-brand-gold/20 flex items-center justify-between text-xs font-sans text-brand-forest/70">
                    <span className="font-medium">{poem.author_credit}</span>
                    <Link
                      href={`/poems/${poem.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-brand-coral hover:text-brand-forest transition-colors"
                    >
                      <span>Read Poem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-16 rounded-2xl bg-brand-cream/60 border border-dashed border-brand-gold/40 text-center">
            <Feather className="w-8 h-8 text-brand-gold mx-auto mb-3" />
            <h3 className="font-display text-xl text-brand-forest mb-2">The desk is quiet</h3>
            <p className="font-reading italic text-brand-forest/70">No published poems yet.</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
