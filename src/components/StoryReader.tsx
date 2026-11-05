"use client";

import React, { useState, useMemo } from "react";
import { ContentItem } from "@/lib/types";
import { LetterpressReaderToolbar } from "./LetterpressReaderToolbar";
import { BougainvilleaBractCluster, BougainvilleaDivider } from "./Bougainvillea";
import { BookOpen, Users, Eye, EyeOff } from "lucide-react";
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
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [tone, setTone] = useState<"parchment" | "sepia" | "night">("parchment");

  // Short drama character spotlight state
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState<boolean>(true);

  // Extract unique character names from drama blocks
  const characterNames = useMemo(() => {
    if (!isShortDrama || !story.structured_body) return [];
    const names = new Set<string>();
    story.structured_body.forEach((block) => {
      if (block.type === "character" && block.text) {
        names.add(block.text.trim().toUpperCase());
      }
    });
    return Array.from(names);
  }, [isShortDrama, story.structured_body]);

  const fontSizes = {
    sm: "text-base sm:text-lg leading-relaxed",
    base: "text-lg sm:text-xl leading-relaxed",
    lg: "text-xl sm:text-2xl leading-loose",
    xl: "text-2xl sm:text-3xl leading-loose",
  };

  return (
    <article className={`tone-${tone} transition-colors duration-300 min-h-screen`}>
      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-20">
        {/* Archival Print Broadside Header (Visible ONLY on print) */}
        <div className="print-broadside-header">
          <div className="text-[10pt] uppercase tracking-widest text-[#C5A059] font-sans font-semibold">
            House of Wild Ink · {isShortDrama ? "Dramatic Broadside Script" : "Archival Edition"}
          </div>
          <h1 className="font-display text-3xl font-bold mt-2 text-[#111111]">
            {story.title}
          </h1>
          {story.subtitle && (
            <p className="font-reading italic text-sm text-[#444444] mt-1">{story.subtitle}</p>
          )}
          <p className="font-sans text-xs tracking-wider uppercase text-[#555555] mt-1">
            By {story.author_credit} · Published {story.published_at ? new Date(story.published_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "House of Wild Ink"}
          </p>
        </div>

        {/* Floating Letterpress Reader Controls */}
        <div className="mb-8 flex justify-center">
          <LetterpressReaderToolbar
            title={story.title}
            authorCredit={story.author_credit}
            urlPath={`/stories/${story.slug}`}
            rawContent={story.raw_content}
            onFontSizeChange={(size) => setFontSize(size)}
            onToneChange={(newTone) => setTone(newTone)}
            className="w-full max-w-xl"
          />
        </div>

        {/* Header */}
        <header className="mb-12 text-center pb-8 border-b border-brand-gold/20">
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

          <div className="flex items-center justify-center gap-3 mb-3">
            <BougainvilleaBractCluster color="coral" size={20} className="hidden sm:inline-block" />
            <h1 className="font-display text-4xl sm:text-6xl text-brand-ink font-bold tracking-tight leading-tight">
              {story.title}
            </h1>
            <BougainvilleaBractCluster color="purple" size={20} className="hidden sm:inline-block" />
          </div>

          {story.subtitle && (
            <p className="font-reading italic text-lg sm:text-xl text-brand-coral font-medium mb-4">
              {story.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-sans text-brand-forest/70 uppercase tracking-wider">
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

          {/* SHORT DRAMA CHARACTER SPOTLIGHT BAR */}
          {isShortDrama && characterNames.length > 0 && (
            <div className="no-print mt-8 p-4 rounded-2xl bg-brand-cream/80 border border-brand-gold/30 text-left transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-gold/20">
                <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                  <Users className="w-4 h-4 text-brand-coral" />
                  <span>Character Spotlight & Table Read</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDirections(!showDirections)}
                  className="inline-flex items-center gap-1.5 text-xs font-sans text-brand-forest/80 hover:text-brand-coral transition-colors cursor-pointer"
                >
                  {showDirections ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showDirections ? "Stage Directions: Visible" : "Stage Directions: Muted"}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-3">
                <span className="text-xs font-sans text-brand-forest/60 mr-1">Highlight Role:</span>
                <button
                  type="button"
                  onClick={() => setSelectedCharacter(null)}
                  className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                    selectedCharacter === null
                      ? "bg-brand-forest text-brand-cream font-bold shadow-xs"
                      : "bg-white/80 text-brand-forest hover:bg-white border border-brand-gold/25"
                  }`}
                >
                  All Roles
                </button>
                {characterNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedCharacter(name)}
                    className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                      selectedCharacter === name
                        ? "bg-brand-coral text-white font-bold shadow-xs scale-105"
                        : "bg-white/80 text-brand-forest hover:bg-white border border-brand-gold/25"
                    }`}
                  >
                    🎭 {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Main Prose / Drama Body */}
        {isShortDrama && story.structured_body && story.structured_body.length > 0 ? (
          /* SHORT DRAMA FORMATTING ENGINE WITH CHARACTER SPOTLIGHT */
          <div className={`prose-canvas space-y-6 font-reading ${fontSizes[fontSize]} text-brand-ink leading-relaxed transition-colors`}>
            {(() => {
              let currentSpeaker: string | null = null;

              return story.structured_body.map((block, idx) => {
                if (block.type === "character") {
                  currentSpeaker = (block.text || "").trim().toUpperCase();
                }

                const isSpeakerSelected =
                  !selectedCharacter || currentSpeaker === selectedCharacter;
                const isBlockCharacter = block.type === "character";
                const isBlockDialogue = block.type === "dialogue";
                const isBlockDirection = block.type === "stage_direction";

                let spotlightClass = "";
                if (selectedCharacter) {
                  if (isBlockCharacter || isBlockDialogue) {
                    spotlightClass = isSpeakerSelected ? "drama-highlighted" : "drama-dimmed";
                  } else if (isBlockDirection) {
                    spotlightClass = "drama-dimmed";
                  }
                }

                if (isBlockDirection && !showDirections) {
                  spotlightClass += " drama-stage-directions-hidden";
                }

                switch (block.type) {
                  case "scene_heading":
                    return (
                      <h3
                        key={idx}
                        className="drama-scene-heading text-xl sm:text-2xl text-brand-forest border-b border-brand-gold/20 pb-2 transition-colors"
                      >
                        {block.text}
                      </h3>
                    );
                  case "character":
                    return (
                      <div
                        key={idx}
                        className={`drama-character text-brand-coral font-bold tracking-wider pt-2 ${spotlightClass}`}
                      >
                        {block.text}
                      </div>
                    );
                  case "stage_direction":
                    return (
                      <p
                        key={idx}
                        className={`drama-direction text-brand-forest/80 italic text-base ${spotlightClass}`}
                      >
                        ({block.text})
                      </p>
                    );
                  case "dialogue":
                    return (
                      <p
                        key={idx}
                        className={`drama-dialogue text-brand-ink pl-4 border-l-2 border-brand-gold/30 transition-all ${spotlightClass}`}
                      >
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
              });
            })()}
          </div>
        ) : (
          /* LONG-FORM PROSE WITH DROP CAP AND EDITORIAL RHYTHM */
          <div className={`prose-canvas font-reading ${fontSizes[fontSize]} text-brand-ink leading-relaxed whitespace-pre-line selection:bg-brand-gold/30 transition-colors`}>
            {story.raw_content}
          </div>
        )}

        <BougainvilleaDivider className="my-10 no-print" />

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="no-print mt-8 pt-6 border-t border-brand-gold/20 flex flex-wrap items-center gap-2">
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

        {/* Print Broadside Footer */}
        <div className="print-broadside-footer">
          <p className="font-serif italic text-xs mb-1">
            “A home for stories that refuse to stay quiet.”
          </p>
          <p className="text-[9pt] font-sans text-gray-500">
            House of Wild Ink · Words by Linda Emefa Daniels (DEFFA) · https://houseofwildink.com
          </p>
        </div>

        {/* Previous & Next Navigation */}
        <nav className="no-print mt-12 pt-8 border-t border-brand-gold/30 grid grid-cols-2 gap-4" aria-label="Story Navigation">
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
      </div>
    </article>
  );
}
