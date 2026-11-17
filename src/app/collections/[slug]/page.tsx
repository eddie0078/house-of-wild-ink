import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { db } from "@/lib/db";
import { Layers, Feather, BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";
import { getPublicTypeLabel, getActionLabel, getAuthoritativeUrl } from "@/lib/taxonomy";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = db.getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };

  return {
    title: `${collection.title} — Curated Collection`,
    description: collection.description,
    alternates: {
      canonical: `/collections/${slug}`,
    },
    openGraph: {
      title: `${collection.title} by Linda Emefa Daniels`,
      description: collection.description,
      type: "article",
      images: ["/api/og/site"],
    },
  };
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = db.getCollectionBySlug(slug);

  if (!collection || !collection.is_public || collection.status !== "published") {
    notFound();
  }

  // Fetch the works in the EXACT ordered sequence specified in The Ink Room
  const orderedWorks = collection.item_ids
    .map((id) => db.getContentById(id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined && item.status === "published");

  const poemCount = orderedWorks.filter((w) => w.content_type === "poem").length;
  const reflectionCount = orderedWorks.filter((w) => w.content_type === "reflection").length;
  const dramaCount = orderedWorks.filter((w) => w.content_type === "short_drama").length;
  const storyCount = orderedWorks.filter((w) => w.content_type === "story").length;

  return (
    <PublicShell>
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        {/* Collection Header */}
        <header className="mb-14 pb-8 border-b border-brand-gold/20">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Collection</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl text-brand-forest font-bold tracking-tight mb-3">
            {collection.title}
          </h1>

          {collection.subtitle && (
            <p className="font-sans text-base sm:text-lg text-brand-coral font-medium mb-6">
              {collection.subtitle}
            </p>
          )}

          <p className="font-reading text-lg sm:text-xl text-brand-forest/90 leading-relaxed mb-6">
            {collection.description}
          </p>

          {/* Reconciled Count Strip */}
          <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-xl bg-brand-cream border border-brand-gold/30 text-xs font-sans text-brand-forest mb-6">
            <span className="font-semibold text-brand-coral uppercase tracking-wider">Catalogue Breakdown:</span>
            <span>{orderedWorks.length} Works Total</span>
            <span className="text-brand-gold">•</span>
            <span>{poemCount} Poems</span>
            {reflectionCount > 0 && (
              <>
                <span className="text-brand-gold">•</span>
                <span>{reflectionCount} Closing Personal Reflection</span>
              </>
            )}
            {dramaCount > 0 && (
              <>
                <span className="text-brand-gold">•</span>
                <span>{dramaCount} Drama</span>
              </>
            )}
            {storyCount > 0 && (
              <>
                <span className="text-brand-gold">•</span>
                <span>{storyCount} Prose</span>
              </>
            )}
          </div>

          {collection.curator_note && (
            <div className="p-6 rounded-xl bg-brand-cream border-l-4 border-brand-gold text-brand-forest/90 font-reading italic text-base leading-relaxed">
              <span className="block font-sans font-semibold text-xs tracking-wider uppercase text-brand-coral not-italic mb-1">
                Curator’s Note
              </span>
              “{collection.curator_note}”
            </div>
          )}
        </header>

        {/* Ordered Works List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl text-brand-forest font-bold">
              Included Works ({orderedWorks.length})
            </h2>
            <span className="text-xs font-serif italic text-brand-forest/70">
              Read sequentially in curate order
            </span>
          </div>

          <div className="space-y-6">
            {orderedWorks.map((work, idx) => {
              const isPoem = work.content_type === "poem";
              const isReflection = work.content_type === "reflection";
              const targetUrl = getAuthoritativeUrl(work);
              const typeLabel = isReflection ? "Closing Reflection" : getPublicTypeLabel(work.content_type, work);
              const actionLabel = getActionLabel(work.content_type);

              return (
                <div
                  key={work.id}
                  className={`rounded-xl p-6 sm:p-8 border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors ${
                    isReflection
                      ? "bg-stone-50 border-brand-coral/40 ring-1 ring-brand-coral/20"
                      : "bg-brand-cream border-brand-gold/25 hover:border-brand-gold"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="font-display font-bold text-2xl text-brand-gold/60 shrink-0 w-8">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-sans text-brand-forest/70 uppercase tracking-wider mb-1">
                        <span className={`inline-flex items-center gap-1 font-semibold ${isReflection ? "text-brand-coral" : "text-brand-coral"}`}>
                          {isPoem ? <Feather className="w-3 h-3" /> : isReflection ? <Sparkles className="w-3 h-3 text-brand-coral" /> : <BookOpen className="w-3 h-3" />}
                          {typeLabel}
                        </span>
                        <span>·</span>
                        <span>{work.reading_time_minutes} min read</span>
                        <span>·</span>
                        <span className="font-serif normal-case italic text-brand-forest/60">{work.author_credit}</span>
                      </div>
                      <h3 className="font-display text-2xl text-brand-ink font-bold hover:text-brand-coral transition-colors">
                        <Link href={targetUrl}>{work.title}</Link>
                      </h3>
                      {work.subtitle && (
                        <p className="text-xs font-serif italic text-brand-forest/70 mt-0.5">
                          {work.subtitle}
                        </p>
                      )}
                      <p className="font-reading text-sm text-brand-forest/80 line-clamp-2 mt-1.5 leading-relaxed">
                        {work.excerpt}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={targetUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-forest/30 text-brand-forest text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-forest hover:text-brand-cream transition-all shrink-0 self-start sm:self-center"
                  >
                    <span>{actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
