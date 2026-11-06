import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { BookOpen, Plus, Sparkles, Theater } from "lucide-react";
import { DeleteActionButton } from "@/components/DeleteActionButton";

export const dynamic = "force-dynamic";

export default function InkRoomStoriesPage() {
  const stories = db.getContentItems().filter((i) => i.content_type !== "poem");
  const collections = db.getCollections();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/30">
        <div>
          <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
            Registry
          </span>
          <h1 className="font-display text-3xl font-bold text-brand-forest">
            Stories, Short Dramas & Prose
          </h1>
          <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
            Manage dramatic works, narrative fiction, and personal essays.
          </p>
        </div>

        <Link
          href="/ink-room/stories/editor"
          className="px-4 py-2.5 rounded-xl bg-brand-coral text-brand-cream text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-coral/90 transition-all inline-flex items-center gap-2 shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Story / Drama</span>
        </Link>
      </div>

      <div className="bg-brand-parchment rounded-2xl border border-brand-gold/30 overflow-hidden shadow-xs">
        <div className="divide-y divide-brand-gold/20">
          {stories.map((story) => {
            const collection = collections.find((c) => c.id === story.collection_id);
            const isDrama = story.content_type === "short_drama";

            return (
              <div
                key={story.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-cream/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-brand-ink">
                      {story.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-sans uppercase font-bold bg-brand-cream border border-brand-gold/40 text-brand-coral inline-flex items-center gap-1">
                      {isDrama ? <Theater className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                      <span>{isDrama ? "Short Drama" : story.content_type}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-sans uppercase font-bold ${
                        story.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {story.status}
                    </span>
                    {story.is_homepage_featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-sans uppercase font-bold bg-brand-gold/20 text-brand-forest inline-flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-brand-coral" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <p className="font-reading text-sm text-brand-forest/75 line-clamp-1 italic">
                    {story.excerpt}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-sans text-brand-forest/60">
                    <span>Credit: {story.author_credit}</span>
                    <span>·</span>
                    <span>Collection: {collection ? collection.title : "Uncollected"}</span>
                    <span>·</span>
                    <span>v{story.version}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/ink-room/stories/editor?id=${story.id}`}
                    className="px-3.5 py-1.5 rounded-lg border border-brand-forest/30 text-brand-forest hover:bg-brand-forest hover:text-brand-cream text-xs font-sans font-semibold transition-all"
                  >
                    Edit
                  </Link>
                  {story.status === "published" && (
                    <Link
                      href={`/stories/${story.slug}`}
                      target="_blank"
                      className="px-3.5 py-1.5 rounded-lg bg-brand-cream border border-brand-gold/40 text-brand-forest hover:text-brand-coral text-xs font-sans font-semibold transition-all"
                    >
                      View Live
                    </Link>
                  )}
                  <DeleteActionButton
                    id={story.id}
                    title={story.title}
                    itemType={isDrama ? "drama" : "story"}
                    variant="button"
                    label="Delete"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
