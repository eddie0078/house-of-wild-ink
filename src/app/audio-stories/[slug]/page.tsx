import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicShell } from "@/components/PublicShell";
import { FloralDivider } from "@/components/FloralDivider";
import { SoundwaveIcon } from "@/components/SoundwaveIcon";
import { ShareControls } from "@/components/ShareControls";
import { ArrowLeft, ExternalLink, Play, Clock, Sparkles, FileText, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface AudioStoryProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AudioStoryProps): Promise<Metadata> {
  const { slug } = await params;
  const item = db.getContentBySlug(slug);
  if (!item || item.content_type !== "audio_story") {
    return { title: "Audio Story Not Found" };
  }
  return {
    title: `${item.title} — Spoken Word by Linda Emefa Daniels`,
    description: item.seo_description || item.excerpt,
    alternates: {
      canonical: `/audio-stories/${slug}`,
    },
  };
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  // If it's a channel link like @houseofwildink, it cannot be embedded as a video
  if (url.includes("@") || url.includes("/channel/")) return null;
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
  const isChannel = Boolean(item.youtube_url?.includes("@") || item.youtube_url?.includes("channel"));
  const hasAudioSource = Boolean(item.audio_url || embedUrl);
  const isDramaScript = item.tags?.includes("Drama") || item.subtitle?.toLowerCase().includes("drama") || slug === "the-will";

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
            <span>{item.audio_duration ? item.audio_duration : "Script in archive"}</span>
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

        {/* Visual Cover / Player / Truthful Status Box */}
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
          ) : isChannel ? (
            <div className="p-8 sm:p-12 text-center space-y-4 bg-gradient-to-b from-[#FAF8F5] to-stone-100">
              <div className="w-14 h-14 rounded-full bg-[#D81E28]/10 text-[#D81E28] flex items-center justify-center mx-auto">
                <SoundwaveIcon isPlaying={true} />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#182C25]">
                Spoken Word on YouTube
              </h3>
              <p className="font-reading text-base text-[#182C25]/85 max-w-lg mx-auto leading-relaxed">
                Linda Emefa Daniels’ spoken reading for “{item.title}” is featured on our official YouTube channel. Stream audio performances and companion visual presentations directly.
              </p>
              <div className="pt-2">
                <a
                  href={item.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D81E28] hover:bg-[#b51720] text-white text-xs font-semibold uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                  <span>Visit our YouTube channel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center space-y-4 bg-gradient-to-b from-[#FAF8F5] to-stone-100">
              <div className="w-14 h-14 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7 text-[#C5A059]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#182C25]">
                Audio Recording in Production
              </h3>
              <p className="font-reading text-base text-[#182C25]/85 max-w-lg mx-auto leading-relaxed">
                The spoken audio performance for this piece is currently being produced. The complete three-scene dramatic script is available below for reading.
              </p>
              <div className="pt-2">
                <a
                  href="#literary-text"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#182C25] hover:bg-[#2D5A46] text-white text-xs font-semibold uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#DFC182]" />
                  <span>Read Complete Script Below</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Literary Text: Companion Notes vs Full Dramatic Script */}
        <div id="literary-text" className="bg-[#FAF8F5] border border-[rgba(197,160,89,0.3)] rounded-2xl p-6 sm:p-10 my-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64746E] mb-6 pb-3 border-b border-[rgba(197,160,89,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isDramaScript ? "Complete Dramatic Script" : "Companion Author Notes & Reflections"}</span>
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
          <ShareControls title={item.title} text={item.excerpt} url={`https://houseofwildink.com/audio-stories/${item.slug}`} />
        </div>
      </article>
    </PublicShell>
  );
}
