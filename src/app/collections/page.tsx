import React from "react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { db } from "@/lib/db";
import { Layers, ArrowRight, BookOpen, Feather } from "lucide-react";
import { BougainvilleaBractCluster, BougainvilleaDivider, BougainvilleaCascadingVine } from "@/components/Bougainvillea";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Curated literary collections grouping poems, stories, and short dramas by theme, season, and project.",
};

export const dynamic = "force-dynamic";

export default function CollectionsIndexPage() {
  const collections = db.getCollections(true);

  return (
    <PublicShell>
      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
        {/* Decorative corner Bougainvillea vine */}
        <BougainvilleaCascadingVine primaryColor="purple" className="hidden lg:block -top-4 -right-4" />

        {/* Editorial Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold mb-3">
            <BougainvilleaBractCluster color="purple" size={16} />
            <span>Curated Volumes</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-brand-forest font-bold tracking-tight mb-4">
            Collections
          </h1>
          <p className="font-reading text-lg sm:text-xl text-brand-forest/80 leading-relaxed italic">
            Gathered works organized by shared motifs, reflective arcs, and collaborative chapters.
          </p>
        </div>

        <BougainvilleaDivider className="my-8" />

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {collections.map((coll) => (
              <article
                key={coll.id}
                className="bg-brand-cream rounded-2xl p-8 sm:p-10 border border-brand-gold/25 shadow-xs hover:border-brand-gold hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-sans tracking-wider uppercase text-brand-coral font-semibold">
                    Volume
                  </span>
                  <h2 className="font-display text-3xl text-brand-ink font-bold mt-2 mb-2 hover:text-brand-coral transition-colors">
                    <Link href={`/collections/${coll.slug}`}>{coll.title}</Link>
                  </h2>

                  {coll.subtitle && (
                    <p className="font-sans text-sm text-brand-forest/70 italic mb-4 font-medium">
                      {coll.subtitle}
                    </p>
                  )}

                  <p className="font-reading text-brand-forest/85 text-base sm:text-lg leading-relaxed mb-6">
                    {coll.description}
                  </p>

                  {coll.curator_note && (
                    <blockquote className="p-4 rounded-xl bg-brand-parchment/60 border-l-2 border-brand-gold text-xs font-reading italic text-brand-forest/80 mb-6">
                      “{coll.curator_note}”
                    </blockquote>
                  )}
                </div>

                <div className="pt-6 border-t border-brand-gold/20 flex items-center justify-between text-xs font-sans text-brand-forest/70">
                  <span className="font-medium">{coll.item_ids.length} literary works included</span>
                  <Link
                    href={`/collections/${coll.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-brand-coral hover:text-brand-forest transition-colors"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-16 rounded-2xl bg-brand-cream/60 border border-dashed border-brand-gold/40 text-center">
            <Layers className="w-8 h-8 text-brand-gold mx-auto mb-3" />
            <h3 className="font-display text-xl text-brand-forest mb-2">No published collections</h3>
            <p className="font-reading italic text-brand-forest/70">
              Collections are curated and ordered in The Ink Room.
            </p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
