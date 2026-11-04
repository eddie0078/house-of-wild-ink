import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicShell } from "@/components/PublicShell";
import { FloralDivider } from "@/components/FloralDivider";
import { ShareControls } from "@/components/ShareControls";
import { ArrowLeft, Clock, Calendar, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface EssayPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = db.getContentBySlug(slug);
  if (!item || !["essay", "article", "reflection"].includes(item.content_type)) {
    return { title: "Essay Not Found — House of Wild Ink" };
  }
  return {
    title: `${item.title} — Essay by ${item.author_credit}`,
    description: item.seo_description || item.excerpt,
  };
}

export default async function EssayDetailPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const item = db.getContentBySlug(slug);

  if (
    !item ||
    !["essay", "article", "reflection"].includes(item.content_type) ||
    item.status !== "published"
  ) {
    notFound();
  }

  const coverUrl = item.cover_image_url;
  const paragraphs = item.raw_content.split("\n\n").filter(Boolean);

  return (
    <PublicShell>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 floral-watermark">
        {/* Navigation Breadcrumb */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/essays"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#182C25] hover:text-[#C85A46] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Essays & Articles</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#C85A46]">
            <span>🌸</span>
            <span className="font-serif italic">Wild Ink Essays</span>
          </div>
        </div>

        {/* Essay Header */}
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] text-xs font-sans text-[#182C25]">
            <Clock className="w-3.5 h-3.5 text-[#C85A46]" />
            <span>{item.reading_time_minutes} min read</span>
            <span className="text-[#C5A059]">•</span>
            <span>By {item.author_credit}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#182C25] leading-tight">
            {item.title}
          </h1>

          {item.subtitle && (
            <p className="font-reading italic text-lg sm:text-xl text-[#64746E] max-w-2xl mx-auto">
              {item.subtitle}
            </p>
          )}
        </header>

        <FloralDivider variant="flower" className="my-10" />

        {/* Optional Cover Artwork */}
        {coverUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden border-2 border-[rgba(197,160,89,0.3)] shadow-md">
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
        <div className="font-reading text-xl text-[#182C25] leading-relaxed space-y-6">
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
          <div className="mt-12 p-6 rounded-xl bg-[#FAF8F5] border border-[rgba(197,160,89,0.3)] font-reading italic text-base text-[#64746E]">
            <span className="font-bold text-[#182C25] not-italic">Author’s Note: </span>
            {item.author_note}
          </div>
        )}

        <FloralDivider variant="rose" className="my-12" />

        {/* Share & Attribution Footer */}
        <div className="pt-6 border-t border-[rgba(197,160,89,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64746E]">
            <p>Published under <span className="font-semibold text-[#182C25]">{item.author_credit}</span></p>
            <p className="text-[11px] text-[#C5A059] mt-0.5">House of Wild Ink • Editorial Essay</p>
          </div>
          <ShareControls title={item.title} text={item.excerpt} />
        </div>
      </article>
    </PublicShell>
  );
}
