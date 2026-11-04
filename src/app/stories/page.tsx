import React from "react";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { db } from "@/lib/db";
import { BookOpen, Clock, ArrowRight, Theater } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories & Short Dramas",
  description: "Fiction, essays, short dramas, and prose by Linda Emefa Daniels from House of Wild Ink.",
};

export const dynamic = "force-dynamic";

export default function StoriesIndexPage() {
  const stories = db.getContentItems({ status: "published" }).filter((i) => i.content_type !== "poem");
  const collections = db.getCollections(true);

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Prose & Drama</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-brand-forest font-bold tracking-tight mb-4">
            Stories & Short Dramas
          </h1>
          <p className="font-reading text-lg sm:text-xl text-brand-forest/80 leading-relaxed italic">
            Long-form creative fiction, dialogue-driven chamber dramas, and quiet essays written for the open heart.
          </p>
        </div>

        {/* Stories Grid */}
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story) => {
              const collection = collections.find((c) => c.id === story.collection_id);
              const isDrama = story.content_type === "short_drama";

              return (
                <article
                  key={story.id}
                  className="bg-brand-cream rounded-2xl p-8 sm:p-10 border border-brand-gold/25 shadow-xs hover:border-brand-gold hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-sans text-brand-forest/70 uppercase tracking-wider mb-4">
                      <span className="text-brand-coral font-semibold inline-flex items-center gap-1.5">
                        {isDrama ? <Theater className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                        {isDrama ? "Short Drama" : story.content_type}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {story.reading_time_minutes} min read
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl text-brand-ink font-bold mb-2 hover:text-brand-coral transition-colors">
                      <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                    </h2>

                    {story.subtitle && (
                      <p className="font-sans text-sm text-brand-forest/70 italic mb-4 font-medium">
                        {story.subtitle}
                      </p>
                    )}

                    <p className="font-reading text-brand-forest/85 text-base sm:text-lg leading-relaxed mb-6 line-clamp-3">
                      {story.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-brand-gold/20 flex items-center justify-between text-xs font-sans text-brand-forest/70">
                    <span>{story.author_credit}</span>
                    <Link
                      href={`/stories/${story.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-brand-coral hover:text-brand-forest transition-colors"
                    >
                      <span>Read {isDrama ? "Drama" : "Story"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-16 rounded-2xl bg-brand-cream/60 border border-dashed border-brand-gold/40 text-center">
            <BookOpen className="w-8 h-8 text-brand-gold mx-auto mb-3" />
            <h3 className="font-display text-xl text-brand-forest mb-2">No published stories yet</h3>
            <p className="font-reading italic text-brand-forest/70">
              New prose and dramatic pieces are currently in development in The Ink Room.
            </p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
