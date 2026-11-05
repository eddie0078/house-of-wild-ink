"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContentItem } from "@/lib/types";
import { LetterpressReaderToolbar } from "./LetterpressReaderToolbar";
import { BougainvilleaBractCluster, BougainvilleaDivider } from "./Bougainvillea";
import { ArrowLeft, Clock } from "lucide-react";

interface EssayReaderProps {
  item: ContentItem;
}

export function EssayReader({ item }: EssayReaderProps) {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [tone, setTone] = useState<"parchment" | "sepia" | "night">("parchment");

  const fontSizes = {
    sm: "text-base sm:text-lg leading-relaxed",
    base: "text-lg sm:text-xl leading-relaxed",
    lg: "text-xl sm:text-2xl leading-loose",
    xl: "text-2xl sm:text-3xl leading-loose",
  };

  const paragraphs = item.raw_content.split("\n\n").filter(Boolean);
  const coverUrl = item.cover_image_url;

  return (
    <article className={`tone-${tone} transition-colors duration-300 min-h-screen`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Archival Print Broadside Header (Visible ONLY on print) */}
        <div className="print-broadside-header">
          <div className="text-[10pt] uppercase tracking-widest text-[#C5A059] font-sans font-semibold">
            House of Wild Ink · Archival Essay Edition
          </div>
          <h1 className="font-display text-3xl font-bold mt-2 text-[#111111]">
            {item.title}
          </h1>
          {item.subtitle && (
            <p className="font-reading italic text-sm text-[#444444] mt-1">{item.subtitle}</p>
          )}
          <p className="font-sans text-xs tracking-wider uppercase text-[#555555] mt-1">
            By {item.author_credit} · Published {item.published_at ? new Date(item.published_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "House of Wild Ink"}
          </p>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="no-print mb-8 flex items-center justify-between">
          <Link
            href="/essays"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#182C25] hover:text-[#C85A46] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Essays & Articles</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#C85A46]">
            <BougainvilleaBractCluster color="coral" size={14} />
            <span className="font-serif italic text-brand-forest">Wild Ink Essays</span>
          </div>
        </div>

        {/* Letterpress Reader Toolbar */}
        <div className="mb-8 flex justify-center">
          <LetterpressReaderToolbar
            title={item.title}
            authorCredit={item.author_credit}
            urlPath={`/essays/${item.slug}`}
            rawContent={item.raw_content}
            onFontSizeChange={(size) => setFontSize(size)}
            onToneChange={(newTone) => setTone(newTone)}
            className="w-full max-w-xl"
          />
        </div>

        {/* Essay Header */}
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] text-xs font-sans text-[#182C25] transition-colors">
            <Clock className="w-3.5 h-3.5 text-[#C85A46]" />
            <span>{item.reading_time_minutes} min read</span>
            <span className="text-[#C5A059]">•</span>
            <span>By {item.author_credit}</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <BougainvilleaBractCluster color="magenta" size={20} className="hidden sm:inline-block" />
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#182C25] leading-tight">
              {item.title}
            </h1>
            <BougainvilleaBractCluster color="crimson" size={20} className="hidden sm:inline-block" />
          </div>

          {item.subtitle && (
            <p className="font-reading italic text-lg sm:text-xl text-[#64746E] max-w-2xl mx-auto">
              {item.subtitle}
            </p>
          )}
        </header>

        <BougainvilleaDivider className="my-10 no-print" />

        {/* Optional Cover Artwork */}
        {coverUrl && (
          <div className="no-print mb-12 rounded-2xl overflow-hidden border-2 border-[rgba(197,160,89,0.3)] shadow-md">
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={coverUrl}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Long-form Editorial Body with Drop Cap on First Paragraph */}
        <div className={`prose-canvas font-reading ${fontSizes[fontSize]} text-[#182C25] leading-relaxed space-y-6 transition-colors`}>
          {paragraphs.map((p, idx) => (
            <p
              key={idx}
              className={idx === 0 ? "drop-cap leading-relaxed" : "leading-relaxed"}
            >
              {p}
            </p>
          ))}
        </div>

        {item.author_note && (
          <div className="no-print mt-12 p-6 rounded-xl bg-[#FAF8F5] border border-[rgba(197,160,89,0.3)] font-reading italic text-base text-[#64746E] transition-colors">
            <span className="font-bold text-[#182C25] not-italic">Author’s Note: </span>
            {item.author_note}
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

        <BougainvilleaDivider className="my-10 no-print" />

        {/* Attribution Footer */}
        <div className="no-print pt-6 border-t border-[rgba(197,160,89,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64746E]">
            <p>Published under <span className="font-semibold text-[#182C25]">{item.author_credit}</span></p>
            <p className="text-[11px] text-[#C5A059] mt-0.5">House of Wild Ink • Editorial Essay</p>
          </div>
          <Link
            href="/essays"
            className="text-xs font-sans font-semibold text-brand-coral hover:text-brand-forest transition-colors uppercase tracking-wider"
          >
            ← Explore More Essays
          </Link>
        </div>
      </div>
    </article>
  );
}
