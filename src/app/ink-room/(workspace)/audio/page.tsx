import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { SoundwaveIcon } from "@/components/SoundwaveIcon";
import { Headphones, Plus, ExternalLink, Clock, Play, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default function InkRoomAudioIndexPage() {
  const audioStories = db.getContentItems({ type: "audio_story" });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-brand-coral font-semibold">
            <span>🌸</span>
            <span>Spoken Word Studio</span>
            <span>✿</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-brand-forest mt-1">
            Audio Stories
          </h1>
          <p className="font-sans text-xs text-brand-forest/70 mt-1">
            Manage your audio recordings, YouTube streams, narrator credits, and companion notes.
          </p>
        </div>

        <Link
          href="/ink-room/audio/editor"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-brand-cream text-xs font-sans font-semibold uppercase tracking-wider transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Audio Story</span>
        </Link>
      </div>

      {/* Audio Stories List */}
      {audioStories.length === 0 ? (
        <div className="p-12 text-center bg-brand-parchment rounded-2xl border-2 border-dashed border-brand-gold/40">
          <Headphones className="w-12 h-12 text-brand-gold mx-auto mb-3" />
          <h3 className="font-display text-lg text-brand-forest font-bold">No Audio Stories Penned Yet</h3>
          <p className="text-xs text-brand-forest/70 mt-1 max-w-sm mx-auto">
            Upload your first spoken word story, link your YouTube audio, and attach representative artwork.
          </p>
          <div className="mt-6">
            <Link
              href="/ink-room/audio/editor"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-coral text-brand-cream text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Audio Story</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audioStories.map((audio) => {
            const cover = audio.cover_image_url || "/images/linda-emefa-daniels.jpg";
            const yt = audio.youtube_url || "https://www.youtube.com";

            return (
              <div
                key={audio.id}
                className="bg-brand-parchment rounded-2xl overflow-hidden border border-brand-gold/30 flex flex-col justify-between hover:border-brand-gold hover:shadow-md transition-all"
              >
                <div className="relative aspect-video bg-black/5 overflow-hidden">
                  <Image
                    src={cover}
                    alt={audio.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute top-3 left-3 bg-brand-forest/80 backdrop-blur-xs text-brand-cream px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-brand-gold" />
                    <span>{audio.audio_duration || "Audio"}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider ${
                        audio.status === "published"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {audio.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-brand-forest/70">
                      <span>{audio.narrator_credit ? `Narrated by ${audio.narrator_credit}` : "Linda"}</span>
                      <SoundwaveIcon isPlaying={audio.status === "published"} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-brand-forest leading-snug">
                      {audio.title}
                    </h3>
                    {audio.subtitle && (
                      <p className="font-reading italic text-xs text-brand-forest/75">{audio.subtitle}</p>
                    )}
                    <p className="text-xs text-brand-forest/80 line-clamp-2 leading-relaxed">
                      {audio.excerpt || audio.raw_content.slice(0, 100)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-between gap-2">
                    <a
                      href={yt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-coral hover:underline"
                    >
                      <Play className="w-3 h-3 fill-brand-coral" />
                      <span>YouTube Link ↗</span>
                    </a>

                    <Link
                      href={`/ink-room/audio/editor?id=${audio.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-forest text-brand-cream text-xs font-semibold hover:bg-brand-forest/90 transition"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit Piece</span>
                    </Link>
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
