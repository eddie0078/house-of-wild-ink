import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { PublicShell } from "@/components/PublicShell";
import { SoundwaveIcon } from "@/components/SoundwaveIcon";
import { BougainvilleaBractCluster, BougainvilleaDivider } from "@/components/Bougainvillea";
import { AudioPlayButton } from "@/components/AudioPlayButton";
import { Headphones, ExternalLink, Play, Clock, FileText } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Audio Stories & Spoken Word",
  description: "Spoken narratives, audio stories, and reflections by Linda Emefa Daniels. Stream on our official YouTube channel or read the companion scripts.",
  alternates: {
    canonical: "/audio-stories",
  },
};

export default function AudioStoriesPage() {
  const audioStories = db.getContentItems({ type: "audio_story", status: "published" });

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 floral-watermark">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] text-xs font-serif text-[#D91E75]">
            <BougainvilleaBractCluster color="magenta" size={20} />
            <span className="tracking-widest uppercase text-[11px] font-semibold text-[#182C25]">
              Spoken Word & Narratives
            </span>
            <BougainvilleaBractCluster color="coral" size={18} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#182C25]">
            Audio Stories
          </h1>
          <p className="font-reading italic text-lg sm:text-xl text-[#64746E]">
            “Some stories demand an inflection, a pause, a breath in the room.”
          </p>
          <p className="text-sm text-[#182C25]/80 max-w-2xl mx-auto leading-relaxed">
            Listen to Linda Emefa Daniels share spoken narratives and reflections. Stream official releases on YouTube or explore the dramatic scripts and author companion notes.
          </p>
        </div>

        <BougainvilleaDivider className="my-10" />

        {/* Audio Stories Grid */}
        {audioStories.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF8F5] rounded-2xl border border-[rgba(197,160,89,0.3)] max-w-xl mx-auto p-8">
            <Headphones className="w-12 h-12 text-[#C5A059] mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-[#182C25]">New Audio Recordings Coming Soon</h3>
            <p className="text-xs text-[#64746E] mt-1">Linda is currently preparing spoken readings in The Ink Room.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {audioStories.map((story) => {
              const coverUrl = story.cover_image_url || "/images/linda-emefa-daniels.jpg";
              const isChannel = Boolean(story.youtube_url?.includes("@") || story.youtube_url?.includes("channel"));
              const hasVideo = Boolean(story.youtube_url && !isChannel);
              const hasDirectAudio = Boolean(story.audio_url);
              const hasRecordedSource = hasVideo || hasDirectAudio;

              return (
                <article
                  key={story.id}
                  className="floral-card bg-[#FAF8F5] rounded-2xl overflow-hidden flex flex-col group border border-[rgba(197,160,89,0.3)] shadow-xs"
                >
                  {/* Representative Artwork Header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <Image
                      src={coverUrl}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-[#182C25]/85 backdrop-blur-sm text-white text-[11px] font-sans font-medium flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#C5A059]" />
                        {story.audio_duration ? story.audio_duration : "Script in archive"}
                      </span>
                      <SoundwaveIcon isPlaying={hasRecordedSource} className="bg-white/70 backdrop-blur-sm rounded-md py-0.5" />
                    </div>

                    {/* Overlay Action */}
                    {isChannel ? (
                      <a
                        href={story.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs cursor-pointer"
                        aria-label={`Visit our YouTube channel for ${story.title}`}
                      >
                        <div className="px-4 py-2 rounded-full bg-[#D81E28] text-white text-xs font-semibold flex items-center gap-2 shadow-lg transform group-hover:scale-105 transition-transform">
                          <span>Visit our YouTube channel</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </a>
                    ) : hasVideo ? (
                      <a
                        href={story.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs cursor-pointer"
                        aria-label={`Listen to ${story.title} on YouTube`}
                      >
                        <div className="w-14 h-14 rounded-full bg-[#D81E28] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-1" />
                        </div>
                      </a>
                    ) : (
                      <Link
                        href={`/stories/${story.slug}`}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs cursor-pointer"
                      >
                        <div className="px-4 py-2 rounded-full bg-[#182C25] text-white text-xs font-semibold flex items-center gap-2 shadow-lg transform group-hover:scale-105 transition-transform">
                          <FileText className="w-3.5 h-3.5 text-[#DFC182]" />
                          <span>Read Complete Script</span>
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#D81E28] font-serif">
                        <span>🌸</span>
                        <span className="tracking-wide uppercase text-[10px] font-semibold text-[#64746E]">
                          {story.narrator_credit ? `Narrated by ${story.narrator_credit}` : "Linda Emefa Daniels"}
                        </span>
                      </div>

                      <h2 className="font-display text-xl font-bold text-[#182C25] group-hover:text-[#D81E28] transition-colors leading-snug">
                        <Link href={`/audio-stories/${story.slug}`}>
                          {story.title}
                        </Link>
                      </h2>

                      {story.subtitle && (
                        <p className="font-reading italic text-sm text-[#64746E]">
                          {story.subtitle}
                        </p>
                      )}

                      <p className="text-sm text-[#182C25]/85 leading-relaxed line-clamp-3">
                        {story.excerpt || story.raw_content.slice(0, 160)}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-5 mt-5 border-t border-[rgba(197,160,89,0.25)] flex flex-wrap items-center justify-between gap-2.5">
                      {hasDirectAudio ? (
                        <AudioPlayButton
                          track={{
                            id: story.id,
                            title: story.title,
                            slug: story.slug,
                            subtitle: story.subtitle,
                            narrator: story.narrator_credit,
                            coverUrl,
                            audioUrl: story.audio_url,
                            youtubeUrl: story.youtube_url,
                            duration: story.audio_duration,
                          }}
                        />
                      ) : isChannel ? (
                        <a
                          href={story.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D81E28] text-white text-xs font-semibold hover:bg-[#b51720] transition-all shadow-xs cursor-pointer"
                        >
                          <span>Visit our YouTube channel</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : hasVideo ? (
                        <a
                          href={story.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D81E28] text-white text-xs font-semibold hover:bg-[#b51720] transition-all shadow-xs cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Listen on YouTube</span>
                        </a>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs text-[#64746E] italic">
                            Recording in production
                          </span>
                          <Link
                            href={`/stories/${story.slug}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#182C25] text-white text-xs font-semibold hover:bg-[#2D5A46] transition-all shadow-xs"
                          >
                            <FileText className="w-3 h-3 text-[#DFC182]" />
                            <span>Read Script</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
