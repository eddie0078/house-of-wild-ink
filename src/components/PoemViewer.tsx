"use client";

import React, { useState } from "react";
import { ContentItem } from "@/lib/types";
import { ShareControls } from "./ShareControls";
import { ZoomIn, ZoomOut, Feather, BookOpen } from "lucide-react";
import Link from "next/link";

export function PoemViewer({
  poem,
  collectionTitle,
  prevPoem,
  nextPoem,
}: {
  poem: ContentItem;
  collectionTitle?: string;
  prevPoem?: ContentItem;
  nextPoem?: ContentItem;
}) {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");

  const fontSizes = {
    sm: "text-base sm:text-lg leading-relaxed",
    base: "text-lg sm:text-xl leading-relaxed",
    lg: "text-xl sm:text-2xl leading-loose",
    xl: "text-2xl sm:text-3xl leading-loose",
  };

  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      {/* Editorial Header */}
      <header className="mb-12 text-center pb-8 border-b border-brand-gold/20">
        <div className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold mb-3">
          <Feather className="w-3.5 h-3.5" />
          <span>Poem</span>
          {collectionTitle && (
            <>
              <span className="text-brand-forest/40">·</span>
              <span className="text-brand-forest/70">{collectionTitle}</span>
            </>
          )}
        </div>

        <h1 className="font-display text-4xl sm:text-6xl text-brand-ink font-bold tracking-tight mb-4 leading-tight">
          {poem.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-sans text-brand-forest/70 uppercase tracking-wider">
          <span className="font-semibold text-brand-forest">{poem.author_credit}</span>
          <span>·</span>
          <span>{poem.reading_time_minutes} min read</span>
          {poem.published_at && (
            <>
              <span>·</span>
              <time dateTime={poem.published_at}>
                {new Date(poem.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </>
          )}
        </div>

        {/* Reader controls bar: Font scaling & Share */}
        <div className="mt-6 pt-4 flex items-center justify-between border-t border-brand-gold/15 text-xs text-brand-forest/70">
          <div className="flex items-center gap-1.5" aria-label="Reading font size">
            <span className="mr-1 font-sans text-[11px] uppercase tracking-wider">Text Size:</span>
            <button
              type="button"
              onClick={() => setFontSize("sm")}
              className={`px-2 py-0.5 rounded text-xs font-serif ${
                fontSize === "sm" ? "bg-brand-forest text-brand-cream font-bold" : "hover:bg-brand-cream"
              }`}
              title="Small text"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize("lg")}
              className={`px-2 py-0.5 rounded text-xs font-serif ${
                fontSize === "lg" ? "bg-brand-forest text-brand-cream font-bold" : "hover:bg-brand-cream"
              }`}
              title="Comfortable text"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize("xl")}
              className={`px-2 py-0.5 rounded text-xs font-serif ${
                fontSize === "xl" ? "bg-brand-forest text-brand-cream font-bold" : "hover:bg-brand-cream"
              }`}
              title="Large text"
            >
              A+
            </button>
          </div>

          <ShareControls title={`${poem.title} — Poem by ${poem.author_credit}`} />
        </div>
      </header>

      {/* STRICT ZERO-LOSS POETRY WHITESPACE CANVAS */}
      {/* 
        This div preserves:
        - Every line break
        - Blank lines & multiple consecutive blank lines
        - Stanza spacing
        - Tabs & indentation
        - Deliberate leading spaces
        - The visual shape of the poem
      */}
      <div className="bg-brand-cream/60 rounded-2xl p-6 sm:p-12 border border-brand-gold/25 shadow-xs overflow-x-auto">
        <div
          className={`poetry-content font-reading ${fontSizes[fontSize]} ${
            alignments[poem.alignment || "left"]
          } text-brand-ink selection:bg-brand-gold/30 min-w-max sm:min-w-0`}
          data-testid="poem-exact-text"
        >
          {poem.raw_content}
        </div>
      </div>

      {/* Author's Note */}
      {poem.author_note && (
        <aside className="mt-12 p-6 rounded-xl bg-brand-cream border-l-4 border-brand-gold text-brand-forest/90">
          <h4 className="font-sans font-semibold text-xs tracking-wider uppercase text-brand-coral mb-2">
            Author’s Note
          </h4>
          <p className="font-reading italic text-base leading-relaxed">{poem.author_note}</p>
        </aside>
      )}

      {/* Tags / Themes */}
      {poem.tags && poem.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-sans uppercase tracking-wider text-brand-forest/60 mr-1">
            Themes:
          </span>
          {poem.tags.map((t) => (
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
      <nav className="mt-16 pt-8 border-t border-brand-gold/30 grid grid-cols-2 gap-4" aria-label="Poem Navigation">
        {prevPoem ? (
          <Link
            href={`/poems/${prevPoem.slug}`}
            className="group p-4 rounded-xl border border-brand-gold/25 hover:border-brand-gold bg-brand-cream/50 transition-all text-left"
          >
            <span className="block text-xs font-sans tracking-wider uppercase text-brand-coral font-medium mb-1">
              ← Previous Poem
            </span>
            <span className="font-display text-lg text-brand-forest group-hover:text-brand-coral transition-colors line-clamp-1 font-semibold">
              {prevPoem.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextPoem ? (
          <Link
            href={`/poems/${nextPoem.slug}`}
            className="group p-4 rounded-xl border border-brand-gold/25 hover:border-brand-gold bg-brand-cream/50 transition-all text-right"
          >
            <span className="block text-xs font-sans tracking-wider uppercase text-brand-coral font-medium mb-1">
              Next Poem →
            </span>
            <span className="font-display text-lg text-brand-forest group-hover:text-brand-coral transition-colors line-clamp-1 font-semibold">
              {nextPoem.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
