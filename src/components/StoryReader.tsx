"use client";

import React, { useState } from "react";
import { ContentItem } from "@/lib/types";
import { ShareControls } from "./ShareControls";
import { BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export function StoryReader({
  story,
  collectionTitle,
  prevStory,
  nextStory,
}: {
  story: ContentItem;
  collectionTitle?: string;
  prevStory?: ContentItem;
  nextStory?: ContentItem;
}) {
  const isShortDrama = story.content_type === "short_drama";

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      {/* Header */}
      <header className="mb-14 text-center pb-8 border-b border-brand-gold/20">
        <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isShortDrama ? "Short Drama" : story.content_type}</span>
          {collectionTitle && (
            <>
              <span className="text-brand-forest/40">·</span>
              <span className="text-brand-forest/70">{collectionTitle}</span>
            </>
          )}
        </div>

        <h1 className="font-display text-4xl sm:text-6xl text-brand-ink font-bold tracking-tight mb-3 leading-tight">
          {story.title}
        </h1>

        {story.subtitle && (
          <p className="font-sans text-base sm:text-lg text-brand-coral font-medium mb-6">
            {story.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-sans text-brand-forest/70 uppercase tracking-wider mb-6">
          <span className="font-semibold text-brand-forest">{story.author_credit}</span>
          <span>·</span>
          <span>{story.reading_time_minutes} min read</span>
          {story.published_at && (
            <>
              <span>·</span>
              <time dateTime={story.published_at}>
                {new Date(story.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <ShareControls title={`${story.title} — by ${story.author_credit}`} />
        </div>
      </header>

      {/* Main Prose / Drama Body */}
      {isShortDrama && story.structured_body && story.structured_body.length > 0 ? (
        /* SHORT DRAMA FORMATTING ENGINE */
        <div className="space-y-6 font-reading text-lg text-brand-ink leading-relaxed">
          {story.structured_body.map((block, idx) => {
            switch (block.type) {
              case "scene_heading":
                return (
                  <h3
                    key={idx}
                    className="drama-scene-heading text-xl sm:text-2xl text-brand-forest border-b border-brand-gold/20 pb-2"
                  >
                    {block.text}
                  </h3>
                );
              case "character":
                return (
                  <div key={idx} className="drama-character text-brand-coral font-bold tracking-wider pt-2">
                    {block.text}
                  </div>
                );
              case "stage_direction":
                return (
                  <p key={idx} className="drama-direction text-brand-forest/80 italic text-base">
                    ({block.text})
                  </p>
                );
              case "dialogue":
                return (
                  <p key={idx} className="drama-dialogue text-brand-ink pl-4 border-l-2 border-brand-gold/30">
                    {block.text}
                  </p>
                );
              default:
                return (
                  <p key={idx} className="leading-relaxed">
                    {block.text}
                  </p>
                );
            }
          })}
        </div>
      ) : (
        /* LONG-FORM PROSE WITH DROP CAP AND EDITORIAL RHYTHM */
        <div className="prose prose-lg prose-stone max-w-none font-reading text-xl text-brand-ink leading-relaxed whitespace-pre-line selection:bg-brand-gold/30">
          {story.raw_content}
        </div>
      )}

      {/* Tags */}
      {story.tags && story.tags.length > 0 && (
        <div className="mt-14 pt-6 border-t border-brand-gold/20 flex flex-wrap items-center gap-2">
          <span className="text-xs font-sans uppercase tracking-wider text-brand-forest/60 mr-1">
            Motifs:
          </span>
          {story.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full bg-brand-cream text-brand-forest text-xs font-sans border border-brand-gold/25"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Previous & Next Navigation */}
      <nav className="mt-12 pt-8 border-t border-brand-gold/30 grid grid-cols-2 gap-4" aria-label="Story Navigation">
        {prevStory ? (
          <Link
            href={`/stories/${prevStory.slug}`}
            className="group p-4 rounded-xl border border-brand-gold/25 hover:border-brand-gold bg-brand-cream/50 transition-all text-left"
          >
            <span className="block text-xs font-sans tracking-wider uppercase text-brand-coral font-medium mb-1">
              ← Previous Work
            </span>
            <span className="font-display text-lg text-brand-forest group-hover:text-brand-coral transition-colors line-clamp-1 font-semibold">
              {prevStory.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextStory ? (
          <Link
            href={`/stories/${nextStory.slug}`}
            className="group p-4 rounded-xl border border-brand-gold/25 hover:border-brand-gold bg-brand-cream/50 transition-all text-right"
          >
            <span className="block text-xs font-sans tracking-wider uppercase text-brand-coral font-medium mb-1">
              Next Work →
            </span>
            <span className="font-display text-lg text-brand-forest group-hover:text-brand-coral transition-colors line-clamp-1 font-semibold">
              {nextStory.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
