"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
  Volume2,
} from "lucide-react";

export function FloatingAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    playbackSpeed,
    togglePlay,
    closePlayer,
    setSpeed,
  } = useAudio();

  const [isMinimized, setIsMinimized] = useState(false);
  const [progress, setProgress] = useState(15); // simulated progress %

  // Advance progress gently while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5 * playbackSpeed));
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  if (!currentTrack) return null;

  const coverSrc = currentTrack.coverUrl || "/images/linda-emefa-daniels.jpg";

  return (
    <aside
      aria-label="Floating Audio Player"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-2 border-[rgba(197,160,89,0.45)] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-6"
    >
      {/* Top Thin Progress Bar */}
      <div className="w-full bg-[rgba(197,160,89,0.2)] h-1 relative">
        <div
          className="bg-gradient-to-r from-[#D81E28] to-[#C5A059] h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isMinimized ? (
        // Minimized bar
        <div className="p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-[#D81E28] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
            </button>
            <div className="truncate">
              <p className="font-display font-bold text-xs text-[#182C25] truncate">{currentTrack.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <SoundwaveIcon isPlaying={isPlaying} />
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
              {currentTrack.duration && (
                <p className="text-[10px] font-mono text-[#64746E]">{currentTrack.duration}</p>
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

          {/* Center Playback Controls */}
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

            {/* Speed & YouTube link */}
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

              {currentTrack.youtubeUrl && (
                <a
                  href={currentTrack.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#D81E28]/10 text-[#D81E28] text-[10px] font-semibold hover:bg-[#D81E28]/20 transition"
                  title="Open full video on YouTube"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
