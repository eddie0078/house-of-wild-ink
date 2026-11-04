import React from "react";

interface SoundwaveIconProps {
  isPlaying?: boolean;
  className?: string;
}

export function SoundwaveIcon({ isPlaying = true, className = "" }: SoundwaveIconProps) {
  return (
    <div className={`flex items-end gap-1 h-6 px-1 ${className}`} aria-hidden="true">
      <span
        className={`w-1 bg-[#C85A46] rounded-full transition-all ${
          isPlaying ? "animate-soundwave-1" : "h-2"
        }`}
        style={{ minHeight: "4px" }}
      />
      <span
        className={`w-1 bg-[#C5A059] rounded-full transition-all ${
          isPlaying ? "animate-soundwave-2" : "h-4"
        }`}
        style={{ minHeight: "6px" }}
      />
      <span
        className={`w-1 bg-[#182C25] rounded-full transition-all ${
          isPlaying ? "animate-soundwave-3" : "h-3"
        }`}
        style={{ minHeight: "8px" }}
      />
      <span
        className={`w-1 bg-[#C85A46] rounded-full transition-all ${
          isPlaying ? "animate-soundwave-4" : "h-5"
        }`}
        style={{ minHeight: "5px" }}
      />
    </div>
  );
}
