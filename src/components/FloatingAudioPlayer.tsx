"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAudio } from "@/lib/AudioContext";
import { SoundwaveIcon } from "./SoundwaveIcon";
import { BougainvilleaBractCluster } from "./Bougainvillea";
import {
  Play,
  Pause,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
} from "lucide-react";

export function FloatingAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    playbackSpeed,
    togglePlay,
    pauseTrack,
    closePlayer,
    setSpeed,
  } = useAudio();

  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackState, setPlaybackState] = useState<
    "idle" | "loading" | "playing" | "paused" | "ended" | "failed"
  >("idle");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasAudioSource = Boolean(currentTrack?.audioUrl);
  const isChannel = currentTrack?.youtubeUrl?.includes("@") || currentTrack?.youtubeUrl?.includes("channel");

  // Sync HTML5 audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;

    audio.playbackRate = playbackSpeed;
    if (isPlaying) {
      setPlaybackState("loading");
      audio
        .play()
        .then(() => setPlaybackState("playing"))
        .catch(() => {
          setPlaybackState("failed");
          pauseTrack();
        });
    } else {
      audio.pause();
      setPlaybackState("paused");
    }
  }, [isPlaying, currentTrack?.audioUrl, playbackSpeed, pauseTrack]);

  // Log audio play telemetry once per track play session
  useEffect(() => {
    if (isPlaying && currentTrack && hasAudioSource) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interaction: "audio_play",
          path: `/audio-stories/${currentTrack.slug || currentTrack.id}`,
          label: currentTrack.title,
        }),
      }).catch(() => {});
    }
  }, [isPlaying, currentTrack?.id, hasAudioSource]);

  if (!currentTrack) return null;

  const coverSrc = currentTrack.coverUrl || "/images/linda-emefa-daniels.jpg";
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside
      aria-label="Floating Audio Player"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-2 border-[rgba(197,160,89,0.45)] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-6"
    >
      {/* HTML5 audio element if source exists */}
      {currentTrack.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onWaiting={() => setPlaybackState("loading")}
          onPlaying={() => setPlaybackState("playing")}
          onPause={() => setPlaybackState("paused")}
          onEnded={() => {
            setPlaybackState("ended");
            pauseTrack();
          }}
          onError={() => {
            setPlaybackState("failed");
            pauseTrack();
          }}
        />
      )}

      {/* Top Thin Progress Bar */}
      <div className="w-full bg-[rgba(197,160,89,0.2)] h-1 relative">
        <div
          className="bg-gradient-to-r from-[#D81E28] to-[#C5A059] h-full transition-all duration-300"
          style={{ width: `${hasAudioSource ? progressPercent : 0}%` }}
        />
      </div>

      {isMinimized ? (
        // Minimized bar
        <div className="p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {hasAudioSource ? (
              <button
                type="button"
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-[#D81E28] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                aria-label={isPlaying ? "Pause audio story" : "Play audio story"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>
            ) : (
              <span className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </span>
            )}
            <div className="truncate">
              <p className="font-display font-bold text-xs text-[#182C25] truncate">{currentTrack.title}</p>
              {!hasAudioSource && (
                <p className="text-[10px] text-[#64746E]">Recording in production</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <SoundwaveIcon isPlaying={isPlaying && hasAudioSource} />
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="p-1 text-[#64746E] hover:text-[#182C25] cursor-pointer"
              title="Expand player"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closePlayer}
              className="p-1 text-[#64746E] hover:text-[#D81E28] cursor-pointer"
              title="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Full floating player card
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            {/* Thumbnail */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[rgba(197,160,89,0.3)] shadow-2xs">
              <Image src={coverSrc} alt={currentTrack.title} fill className="object-cover" sizes="48px" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[10px] text-[#D81E28] font-serif">
                <BougainvilleaBractCluster color="magenta" size={14} />
                <span className="uppercase tracking-wider font-semibold">
                  {currentTrack.narrator ? `Narrated by ${currentTrack.narrator}` : "Linda Emefa Daniels"}
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-[#182C25] truncate leading-snug">
                {currentTrack.title}
              </h4>
              {hasAudioSource && currentTrack.duration ? (
                <p className="text-[10px] font-mono text-[#64746E]">{currentTrack.duration}</p>
              ) : (
                <p className="text-[10px] font-sans text-[#E0533C] font-semibold">
                  {isChannel ? "Official YouTube Channel Stream" : "Audio Recording In Production"}
                </p>
              )}
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 text-[#64746E] hover:text-[#182C25] cursor-pointer"
                title="Minimize player"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closePlayer}
                className="p-1 text-[#64746E] hover:text-[#D81E28] cursor-pointer"
                title="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conditional Center Bar: Real Playback vs Truthful Fallback */}
          {hasAudioSource ? (
            <div className="flex items-center justify-between pt-1 border-t border-[rgba(197,160,89,0.2)]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-[#D81E28] hover:bg-[#b51720] text-white flex items-center justify-center cursor-pointer shadow-md transition transform hover:scale-105"
                  aria-label={isPlaying ? "Pause audio story" : "Play audio story"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
                <SoundwaveIcon isPlaying={isPlaying} />
              </div>

              {/* Speed & source */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
                    setSpeed(nextSpeed);
                  }}
                  className="px-2 py-1 rounded-md bg-white border border-[rgba(197,160,89,0.3)] text-[10px] font-mono font-semibold text-[#182C25] hover:bg-[#F7F4EE] cursor-pointer"
                  title="Toggle playback speed"
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-[rgba(197,160,89,0.2)] space-y-2">
              <div className="p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-xs text-[#64746E] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C5A059]" />
                <span>
                  {isChannel
                    ? "Spoken recordings stream on our YouTube channel."
                    : "Spoken recording is in production. You can read the script now."}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <Link
                  href={currentTrack.slug ? `/stories/${currentTrack.slug}` : "/stories"}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D81E28] hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Read Complete Script</span>
                </Link>

                {currentTrack.youtubeUrl && (
                  <a
                    href={currentTrack.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#D81E28] text-white text-[11px] font-semibold hover:bg-[#b51720] transition"
                  >
                    <span>{isChannel ? "Visit our YouTube channel" : "YouTube"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
