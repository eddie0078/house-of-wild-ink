"use client";

import React from "react";
import { useAudio, AudioTrack } from "@/lib/AudioContext";
import { Play, Pause } from "lucide-react";

interface AudioPlayButtonProps {
  track: AudioTrack;
  variant?: "primary" | "pill" | "icon";
  className?: string;
}

export function AudioPlayButton({ track, variant = "pill", className = "" }: AudioPlayButtonProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-12 h-12 rounded-full bg-[#D81E28] hover:bg-[#b51720] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer ${className}`}
        aria-label={isCurrentPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      >
        {isCurrentPlaying ? (
          <Pause className="w-5 h-5 fill-white" />
        ) : (
          <Play className="w-5 h-5 fill-white ml-0.5" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shadow-xs ${
        isCurrentPlaying
          ? "bg-[#D81E28] text-white animate-pulse"
          : "bg-white border border-[rgba(197,160,89,0.4)] text-[#182C25] hover:bg-[#F7F4EE] hover:border-[#C5A059]"
      } ${className}`}
    >
      {isCurrentPlaying ? (
        <>
          <Pause className="w-3 h-3 fill-white" />
          <span>Pause Audio</span>
        </>
      ) : (
        <>
          <Play className="w-3 h-3 fill-[#D81E28] text-[#D81E28]" />
          <span>Play Here</span>
        </>
      )}
    </button>
  );
}
