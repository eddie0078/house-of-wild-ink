import React from "react";

interface FloralGarlandProps {
  variant?: "garland" | "arch" | "header" | "corner-pair";
  className?: string;
}

export function FloralGarland({ variant = "garland", className = "" }: FloralGarlandProps) {
  if (variant === "header") {
    return (
      <div className={`relative flex items-center justify-center my-6 ${className}`} aria-hidden="true">
        <div className="flex-grow max-w-xs h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/60 to-[#C85A46]/70" />
        <div className="px-5 flex items-center gap-2.5 text-[#C5A059]">
          <span className="text-xs text-[#E57A82] opacity-80">✿</span>
          <span className="text-sm opacity-90">❧</span>
          <span className="text-xl text-[#C85A46] transform hover:scale-125 transition-transform inline-block">🌸</span>
          <span className="text-sm opacity-90 scale-x-[-1] inline-block">❧</span>
          <span className="text-xs text-[#E57A82] opacity-80">✿</span>
        </div>
        <div className="flex-grow max-w-xs h-[1px] bg-gradient-to-l from-transparent via-[#C5A059]/60 to-[#C85A46]/70" />
      </div>
    );
  }

  if (variant === "arch") {
    return (
      <div className={`relative flex justify-center w-full overflow-hidden py-3 ${className}`} aria-hidden="true">
        <svg viewBox="0 0 600 60" fill="none" className="w-full max-w-2xl h-12 text-[#C5A059]">
          {/* Main Arched Vine */}
          <path
            d="M 20 50 Q 150 10 300 12 Q 450 10 580 50"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Leaves on left side */}
          <path d="M 100 35 C 90 25 110 15 120 28 Z" fill="#4A5C54" fillOpacity="0.4" />
          <path d="M 180 20 C 170 10 195 5 200 18 Z" fill="#4A5C54" fillOpacity="0.5" />
          <path d="M 240 14 C 235 5 255 2 258 14 Z" fill="#4A5C54" fillOpacity="0.5" />

          {/* Leaves on right side */}
          <path d="M 360 14 C 365 2 345 5 342 14 Z" fill="#4A5C54" fillOpacity="0.5" />
          <path d="M 420 20 C 430 10 405 5 400 18 Z" fill="#4A5C54" fillOpacity="0.5" />
          <path d="M 500 35 C 510 25 490 15 480 28 Z" fill="#4A5C54" fillOpacity="0.4" />

          {/* Center Rose Blossom */}
          <g transform="translate(300, 12)">
            <circle cx="0" cy="0" r="10" fill="#FAF8F5" stroke="#C5A059" strokeWidth="1" />
            <circle cx="0" cy="0" r="7" fill="#C85A46" fillOpacity="0.9" />
            <circle cx="-2" cy="-2" r="3" fill="#E57A82" />
            <circle cx="2" cy="1" r="2" fill="#FAD4C0" />
          </g>

          {/* Flanking Rosebuds */}
          <circle cx="150" cy="24" r="5" fill="#E57A82" fillOpacity="0.8" />
          <circle cx="450" cy="24" r="5" fill="#E57A82" fillOpacity="0.8" />
        </svg>
      </div>
    );
  }

  // Default garland
  return (
    <div className={`relative flex items-center justify-center gap-3 py-4 text-[#C5A059] ${className}`} aria-hidden="true">
      <span className="text-sm text-[#4A5C54]">🌿</span>
      <span className="text-base text-[#C85A46]">🌸</span>
      <span className="text-sm font-serif italic text-[#182C25] tracking-widest px-2">
        ❦ House of Wild Ink ❦
      </span>
      <span className="text-base text-[#C85A46]">🌸</span>
      <span className="text-sm text-[#4A5C54] scale-x-[-1] inline-block">🌿</span>
    </div>
  );
}
