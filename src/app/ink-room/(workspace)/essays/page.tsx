import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { FileText, Plus, Clock, Edit, Sparkles } from "lucide-react";
import { DeleteActionButton } from "@/components/DeleteActionButton";

export const dynamic = "force-dynamic";

export default function InkRoomEssaysIndexPage() {
  const allItems = db.getContentItems();
  const essays = allItems.filter((i) =>
    ["essay", "article", "reflection"].includes(i.content_type)
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-brand-coral font-semibold">
            <span>🌸</span>
            <span>The Ink Archive Studio</span>
            <span>✿</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-brand-forest mt-1">
            Essays & Articles
          </h1>
          <p className="font-sans text-xs text-brand-forest/70 mt-1">
            Pen long-form critical essays, reflections, and commentaries outside verse and drama.
          </p>
        </div>

        <Link
          href="/ink-room/essays/editor"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-brand-cream text-xs font-sans font-semibold uppercase tracking-wider transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Essay / Article</span>
        </Link>
      </div>

      {/* Essays Grid / List */}
      {essays.length === 0 ? (
        <div className="p-12 text-center bg-brand-parchment rounded-2xl border-2 border-dashed border-brand-gold/40">
          <FileText className="w-12 h-12 text-brand-gold mx-auto mb-3" />
          <h3 className="font-display text-lg text-brand-forest font-bold">No Essays Penned Yet</h3>
          <p className="text-xs text-brand-forest/70 mt-1 max-w-sm mx-auto">
            Write your first long-form essay or reflection with classical drop caps and representative artwork.
          </p>
          <div className="mt-6">
            <Link
              href="/ink-room/essays/editor"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-coral text-brand-cream text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write First Essay</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {essays.map((essay) => {
            const cover = essay.cover_image_url;

            return (
              <div
                key={essay.id}
                className="bg-brand-parchment rounded-2xl overflow-hidden border border-brand-gold/30 flex flex-col justify-between hover:border-brand-gold hover:shadow-md transition-all"
              >
                {cover && (
                  <div className="relative aspect-[16/9] bg-black/5 overflow-hidden">
                    <Image
                      src={cover}
                      alt={essay.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-brand-forest/70">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-brand-coral bg-brand-coral/10 px-2 py-0.5 rounded-full">
                        {essay.content_type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider ${
                          essay.status === "published"
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {essay.status}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-brand-forest leading-snug">
                      {essay.title}
                    </h3>

                    {essay.subtitle && (
                      <p className="font-reading italic text-xs text-brand-forest/75">{essay.subtitle}</p>
                    )}

                    <p className="font-reading text-sm text-brand-forest/85 line-clamp-3 leading-relaxed">
                      {essay.excerpt || essay.raw_content.slice(0, 120)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-between">
                    <span className="text-[11px] font-serif text-brand-forest/70 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-gold" />
                      {essay.reading_time_minutes} min read
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/ink-room/essays/editor?id=${essay.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-forest text-brand-cream text-xs font-semibold hover:bg-brand-forest/90 transition"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>
                      <DeleteActionButton
                        id={essay.id}
                        title={essay.title}
                        itemType="essay"
                        variant="button"
                        label="Delete"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
