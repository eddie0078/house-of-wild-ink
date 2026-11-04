import React from "react";

interface FloralDividerProps {
  variant?: "flower" | "leaf" | "rose" | "simple";
  className?: string;
}

export function FloralDivider({ variant = "flower", className = "" }: FloralDividerProps) {
  return (
    <div className={`relative flex items-center justify-center my-8 ${className}`} aria-hidden="true">
      <div className="flex-grow border-t border-[rgba(197,160,89,0.3)] max-w-xs" />
      <div className="px-4 flex items-center gap-2 text-[#C5A059]">
        {variant === "flower" && (
          <>
            <span className="text-xs opacity-60">✿</span>
            <span className="text-base text-[#C85A46]">🌸</span>
            <span className="text-xs opacity-60">✿</span>
          </>
        )}
        {variant === "leaf" && (
          <>
            <span className="text-sm opacity-70">❧</span>
            <span className="text-xs text-[#182C25]">✦</span>
            <span className="text-sm opacity-70 scale-x-[-1] inline-block">❧</span>
          </>
        )}
        {variant === "rose" && (
          <>
            <span className="text-xs text-[#DFC182]">❀</span>
            <span className="text-sm font-serif italic text-[#C85A46]">wild ink</span>
            <span className="text-xs text-[#DFC182]">❀</span>
          </>
        )}
        {variant === "simple" && (
          <span className="text-sm text-[#C5A059]">✿</span>
        )}
      </div>
      <div className="flex-grow border-t border-[rgba(197,160,89,0.3)] max-w-xs" />
    </div>
  );
}
