"use client";

import React, { useState } from "react";
import { ContentItem } from "@/lib/types";
import { LetterpressReaderToolbar } from "./LetterpressReaderToolbar";
import { BougainvilleaBractCluster, BougainvilleaDivider } from "./Bougainvillea";
import { Feather } from "lucide-react";
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
  const [tone, setTone] = useState<"parchment" | "sepia" | "night">("parchment");

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
    <article className={`tone-${tone} transition-colors duration-300 min-h-screen`}>
      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-20">
        {/* Archival Print Broadside Header (Visible ONLY on print) */}
        <div className="print-broadside-header">
          <div className="text-[10pt] uppercase tracking-widest text-[#C5A059] font-sans font-semibold">
            House of Wild Ink · Archival Broadside Edition
          </div>
          <h1 className="font-display text-3xl font-bold mt-2 text-[#111111]">
            {poem.title}
          </h1>
          <p className="font-sans text-xs tracking-wider uppercase text-[#444444] mt-1">
            By {poem.author_credit} · Published {poem.published_at ? new Date(poem.published_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "House of Wild Ink"}
          </p>
        </div>

        {/* Floating Letterpress Reader Controls */}
        <div className="mb-8 flex justify-center">
          <LetterpressReaderToolbar
            title={poem.title}
            authorCredit={poem.author_credit}
            urlPath={`/poems/${poem.slug}`}
            rawContent={poem.raw_content}
            onFontSizeChange={(size) => setFontSize(size)}
            onToneChange={(newTone) => setTone(newTone)}
            className="w-full max-w-xl"
          />
        </div>

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

          <div className="flex items-center justify-center gap-3 mb-4">
            <BougainvilleaBractCluster color="crimson" size={20} className="hidden sm:inline-block" />
            <h1 className="font-display text-4xl sm:text-6xl text-brand-ink font-bold tracking-tight leading-tight">
              {poem.title}
            </h1>
            <BougainvilleaBractCluster color="magenta" size={20} className="hidden sm:inline-block" />
          </div>

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
        </header>

        {/* STRICT ZERO-LOSS POETRY WHITESPACE CANVAS */}
        <div className="poetry-canvas bg-brand-cream/60 rounded-2xl p-6 sm:p-12 border border-brand-gold/25 shadow-xs overflow-x-auto transition-colors">
          <div
            className={`poetry-content font-reading ${fontSizes[fontSize]} ${
              alignments[poem.alignment || "left"]
            } text-brand-ink selection:bg-brand-gold/30 min-w-max sm:min-w-0`}
            data-testid="poem-exact-text"
          >
            {poem.raw_content}
          </div>
        </div>

        <BougainvilleaDivider className="my-10 no-print" />

        {/* Author's Note */}
        {poem.author_note && (
          <aside className="no-print mt-8 p-6 rounded-xl bg-brand-cream border-l-4 border-brand-gold text-brand-forest/90 transition-colors">
            <h4 className="font-sans font-semibold text-xs tracking-wider uppercase text-brand-coral mb-2">
              Author’s Note
            </h4>
            <p className="font-reading italic text-base leading-relaxed">{poem.author_note}</p>
          </aside>
        )}

        {/* Tags / Themes */}
        {poem.tags && poem.tags.length > 0 && (
          <div className="no-print mt-8 flex flex-wrap items-center gap-2">
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
        <nav className="no-print mt-16 pt-8 border-t border-brand-gold/30 grid grid-cols-2 gap-4" aria-label="Poem Navigation">
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
      </div>
    </article>
  );
}
