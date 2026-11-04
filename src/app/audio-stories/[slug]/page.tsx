import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicShell } from "@/components/PublicShell";
import { FloralDivider } from "@/components/FloralDivider";
import { SoundwaveIcon } from "@/components/SoundwaveIcon";
import { ShareControls } from "@/components/ShareControls";
import { ArrowLeft, ExternalLink, Play, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface AudioStoryProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AudioStoryProps): Promise<Metadata> {
  const { slug } = await params;
  const item = db.getContentBySlug(slug);
  if (!item || item.content_type !== "audio_story") {
    return { title: "Audio Story Not Found — House of Wild Ink" };
  }
  return {
    title: `${item.title} — Audio Story by Linda Emefa Daniels`,
    description: item.seo_description || item.excerpt,
  };
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube-nocookie.com/embed/${match[2]}` : null;
}

export default async function AudioStoryDetailPage({ params }: AudioStoryProps) {
  const { slug } = await params;
  const item = db.getContentBySlug(slug);

  if (!item || item.content_type !== "audio_story" || item.status !== "published") {
    notFound();
  }

  const embedUrl = getYouTubeEmbedUrl(item.youtube_url);
  const coverUrl = item.cover_image_url || "/images/linda-emefa-daniels.jpg";
  const youtubeUrl = item.youtube_url || "https://www.youtube.com";

  return (
    <PublicShell>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 floral-watermark">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/audio-stories"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#182C25] hover:text-[#C85A46] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Audio Stories</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#C85A46]">
            <span>🌸</span>
            <span className="font-serif italic">House of Wild Ink Audio</span>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] text-xs font-sans text-[#182C25]">
            <Clock className="w-3.5 h-3.5 text-[#C85A46]" />
            <span>{item.audio_duration || "Audio Recording"}</span>
            <span className="text-[#C5A059]">•</span>
            <span>{item.narrator_credit ? `Narrated by ${item.narrator_credit}` : "Linda Emefa Daniels"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#182C25] leading-tight">
            {item.title}
          </h1>

          {item.subtitle && (
            <p className="font-reading italic text-lg sm:text-xl text-[#64746E]">
              {item.subtitle}
            </p>
          )}
        </div>

        <FloralDivider variant="flower" className="my-8" />

        {/* Visual Cover & Player Box */}
        <div className="my-8 rounded-2xl overflow-hidden border-2 border-[rgba(197,160,89,0.35)] bg-[#FAF8F5] shadow-lg">
          {embedUrl ? (
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={embedUrl}
                title={item.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={coverUrl}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#C85A46] text-white font-medium hover:bg-[#b04a38] transition shadow-lg hover:scale-105 transform"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Listen on YouTube Now</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              </div>
            </div>
          )}

          {/* Player Bar */}
          <div className="p-4 sm:p-6 bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[rgba(197,160,89,0.2)]">
            <div className="flex items-center gap-3">
              <SoundwaveIcon isPlaying={true} />
              <div>
                <p className="font-sans text-xs font-semibold text-[#182C25]">
                  Official YouTube Audio Stream
                </p>
                <p className="text-xs text-[#64746E]">
                  Click to open full audio on YouTube in high fidelity
                </p>
              </div>
            </div>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C85A46] text-white text-xs font-semibold hover:bg-[#b04a38] transition shadow-sm hover:shadow cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Open on YouTube ↗</span>
            </a>
          </div>
        </div>

        {/* Companion Reading Notes & Author's Reflection */}
        <div className="bg-[#FAF8F5] border border-[rgba(197,160,89,0.3)] rounded-2xl p-6 sm:p-10 my-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64746E] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Companion Notes & Reflections</span>
          </div>

          <div className="font-reading text-lg text-[#182C25] leading-relaxed space-y-4 whitespace-pre-line">
            {item.raw_content}
          </div>

          {item.author_note && (
            <div className="mt-8 pt-6 border-t border-[rgba(197,160,89,0.25)] text-sm font-reading italic text-[#64746E]">
              <span className="font-bold text-[#182C25] not-italic">Author’s Note: </span>
              {item.author_note}
            </div>
          )}
        </div>

        {/* Share & Attribution Footer */}
        <div className="pt-6 border-t border-[rgba(197,160,89,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64746E]">
            <p>Spoken word piece written and performed by <span className="font-semibold text-[#182C25]">Linda Emefa Daniels</span></p>
          </div>
          <ShareControls title={item.title} text={item.excerpt} />
        </div>
      </article>
    </PublicShell>
  );
}
