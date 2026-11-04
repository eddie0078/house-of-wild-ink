import React from "react";
import Image from "next/image";

interface BotanicalFrameProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function BotanicalFrame({
  src,
  alt,
  width = 460,
  height = 580,
  className = "",
  priority = false,
}: BotanicalFrameProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Decorative Botanical Flourish Elements */}
      <div className="absolute -top-4 -left-4 w-12 h-12 pointer-events-none z-10 text-[#C5A059] opacity-80" aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
          <path d="M 20 80 C 20 40 40 20 80 20" strokeLinecap="round" />
          <path d="M 30 50 C 35 45 45 45 45 55 C 35 55 30 50 30 50" fill="#DFC182" fillOpacity="0.4" />
          <path d="M 50 30 C 45 35 45 45 55 45 C 55 35 50 30 50 30" fill="#DFC182" fillOpacity="0.4" />
          <circle cx="80" cy="20" r="4" fill="#C85A46" />
        </svg>
      </div>

      <div className="absolute -bottom-4 -right-4 w-12 h-12 pointer-events-none z-10 text-[#C5A059] opacity-80 rotate-180" aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
          <path d="M 20 80 C 20 40 40 20 80 20" strokeLinecap="round" />
          <path d="M 30 50 C 35 45 45 45 45 55 C 35 55 30 50 30 50" fill="#DFC182" fillOpacity="0.4" />
          <path d="M 50 30 C 45 35 45 45 55 45 C 55 35 50 30 50 30" fill="#DFC182" fillOpacity="0.4" />
          <circle cx="80" cy="20" r="4" fill="#C85A46" />
        </svg>
      </div>

      {/* Outer arched border with antique gold border */}
      <div className="relative p-2.5 rounded-t-[140px] rounded-b-2xl border-2 border-[rgba(197,160,89,0.4)] bg-[#FAF8F5] shadow-xl">
        {/* Inner thin frame */}
        <div className="relative overflow-hidden rounded-t-[130px] rounded-b-xl border border-[rgba(197,160,89,0.25)]">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            className="w-full h-auto object-cover object-top transition duration-700 hover:scale-105"
          />
        </div>
      </div>

      {/* Floating flower badge */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#FAF8F5] border border-[rgba(197,160,89,0.5)] px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 text-xs text-[#182C25] font-serif">
        <span className="text-[#C85A46]">🌸</span>
        <span className="tracking-wider uppercase text-[10px] font-semibold text-[#64746E]">L.E. Daniels</span>
        <span className="text-[#C5A059]">✿</span>
      </div>
    </div>
  );
}
