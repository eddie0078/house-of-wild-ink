"use client";

import React, { useState } from "react";
import {
  Type,
  Sun,
  Moon,
  Copy,
  Check,
  Printer,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { BougainvilleaBractCluster } from "./Bougainvillea";

interface LetterpressProps {
  title: string;
  authorCredit: string;
  urlPath: string;
  rawContent: string;
  onFontSizeChange?: (size: "sm" | "base" | "lg" | "xl") => void;
  onToneChange?: (tone: "parchment" | "sepia" | "night") => void;
  className?: string;
}

export function LetterpressReaderToolbar({
  title,
  authorCredit,
  urlPath,
  rawContent,
  onFontSizeChange,
  onToneChange,
  className = "",
}: LetterpressProps) {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [tone, setTone] = useState<"parchment" | "sepia" | "night">("parchment");
  const [copied, setCopied] = useState(false);

  const handleSizeCycle = () => {
    const next = fontSize === "sm" ? "base" : fontSize === "base" ? "lg" : fontSize === "lg" ? "xl" : "sm";
    setFontSize(next);
    onFontSizeChange?.(next);
  };

  const handleToneCycle = () => {
    const next = tone === "parchment" ? "sepia" : tone === "sepia" ? "night" : "parchment";
    setTone(next);
    onToneChange?.(next);
  };

  const handleCopy = async () => {
    const textToCopy = `"${title}"\nBy ${authorCredit}\n\n${rawContent}\n\n— House of Wild Ink (https://houseofwildink.com${urlPath})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      className={`no-print flex items-center justify-between gap-3 p-2 sm:px-4 sm:py-2.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[rgba(197,160,89,0.35)] shadow-xs ${className}`}
      aria-label="Reader Controls"
    >
      <div className="flex items-center gap-1.5 text-xs text-[#182C25]">
        <BougainvilleaBractCluster color="coral" size={16} />
        <span className="font-serif italic hidden sm:inline text-[#64746E]">Reader Controls</span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Font Size Button */}
        <button
          type="button"
          onClick={handleSizeCycle}
          className="px-2.5 py-1 rounded-full bg-white border border-[rgba(197,160,89,0.25)] text-xs font-mono font-semibold text-[#182C25] hover:bg-[#F7F4EE] transition flex items-center gap-1 cursor-pointer"
          title={`Font size: ${fontSize.toUpperCase()} (Click to cycle)`}
        >
          <Type className="w-3 h-3 text-[#C5A059]" />
          <span className="uppercase text-[11px]">{fontSize}</span>
        </button>

        {/* Paper Tone Button */}
        <button
          type="button"
          onClick={handleToneCycle}
          className="px-2.5 py-1 rounded-full bg-white border border-[rgba(197,160,89,0.25)] text-xs font-sans font-medium text-[#182C25] hover:bg-[#F7F4EE] transition flex items-center gap-1 cursor-pointer"
          title={`Reading Tone: ${tone} (Click to switch)`}
        >
          {tone === "night" ? (
            <Moon className="w-3 h-3 text-[#8338EC]" />
          ) : (
            <Sun className="w-3 h-3 text-[#C5A059]" />
          )}
          <span className="capitalize text-[11px] hidden sm:inline">{tone}</span>
        </button>

        {/* Copy with Verified Attribution */}
        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 rounded-full bg-white border border-[rgba(197,160,89,0.25)] text-xs font-sans font-medium text-[#182C25] hover:bg-[#F7F4EE] transition flex items-center gap-1 cursor-pointer"
          title="Copy with verified author credit"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-[11px] text-emerald-700 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-[#C5A059]" />
              <span className="text-[11px] hidden sm:inline">Copy Verse</span>
            </>
          )}
        </button>

        {/* Archival Print Sheet */}
        <button
          type="button"
          onClick={handlePrint}
          className="px-2.5 py-1 rounded-full bg-white border border-[rgba(197,160,89,0.25)] text-xs font-sans font-medium text-[#182C25] hover:bg-[#F7F4EE] transition flex items-center gap-1 cursor-pointer"
          title="Print Archival Broadside Sheet"
        >
          <Printer className="w-3 h-3 text-[#C5A059]" />
          <span className="text-[11px] hidden sm:inline">Print Broadside</span>
        </button>
      </div>
    </div>
  );
}
