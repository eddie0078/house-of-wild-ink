"use client";

import React, { useState, useEffect } from "react";
import { BougainvilleaBractCluster, BougainvilleaColor, BOUGAINVILLEA_PALETTE } from "./Bougainvillea";
import { Sparkles, Palette } from "lucide-react";

const MOODS: { id: BougainvilleaColor; name: string; hex: string; symbol: string }[] = [
  { id: "crimson", name: "Scarlet Crimson", hex: "#D81E28", symbol: "🌸" },
  { id: "magenta", name: "Fuchsia Magenta", hex: "#D91E75", symbol: "🌺" },
  { id: "coral", name: "Sunset Coral", hex: "#FF6F59", symbol: "🪸" },
  { id: "purple", name: "Royal Violet", hex: "#8338EC", symbol: "💜" },
  { id: "gold", name: "Golden Apricot", hex: "#E09F3E", symbol: "🍯" },
];

export function BougainvilleaMoodSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const [activeMood, setActiveMood] = useState<BougainvilleaColor>("crimson");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    try {
      const saved = localStorage.getItem("house_of_wild_ink_floral_mood") as BougainvilleaColor | null;
      if (saved && BOUGAINVILLEA_PALETTE[saved]) {
        setActiveMood(saved);
        applyMoodColor(saved);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const applyMoodColor = (mood: BougainvilleaColor) => {
    if (typeof document !== "undefined") {
      const hex = BOUGAINVILLEA_PALETTE[mood].hex;
      document.documentElement.style.setProperty("--bougainvillea-accent", hex);
    }
  };

  const handleSelectMood = (mood: BougainvilleaColor) => {
    setActiveMood(mood);
    applyMoodColor(mood);
    setIsOpen(false);
    try {
      localStorage.setItem("house_of_wild_ink_floral_mood", mood);
    } catch {
      // Ignore
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[rgba(197,160,89,0.35)] bg-white/80 hover:bg-white text-xs font-sans text-brand-forest shadow-2xs transition-all cursor-pointer"
        title="Change Floral Mood Spectrum"
        aria-label="Bougainvillea Floral Mood"
      >
        <span
          className="w-3.5 h-3.5 rounded-full transition-colors shadow-2xs"
          style={{ backgroundColor: BOUGAINVILLEA_PALETTE[activeMood].hex }}
        />
        <span className="hidden md:inline text-[11px] font-medium text-brand-forest/90">
          {BOUGAINVILLEA_PALETTE[activeMood].name.split(" ")[1] || BOUGAINVILLEA_PALETTE[activeMood].name}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 z-50 w-52 p-3 rounded-2xl bg-[#FAF8F5] border border-[rgba(197,160,89,0.4)] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-brand-gold/20">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-forest">
                Bougainvillea Mood
              </span>
              <BougainvilleaBractCluster color={activeMood} size={14} />
            </div>

            <div className="space-y-1">
              {MOODS.map((m) => {
                const isSelected = activeMood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMood(m.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white font-semibold shadow-xs border border-brand-gold/30"
                        : "hover:bg-brand-parchment text-brand-forest"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: m.hex }}
                      />
                      <span className="text-[12px]">{m.name}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] text-brand-coral font-bold">Active</span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-2.5 pt-2 border-t border-brand-gold/15 text-[10px] font-reading italic text-brand-forest/60 text-center">
              Inspired by Linda’s Tuscan & Mediterranean garden blooms
            </p>
          </div>
        </>
      )}
    </div>
  );
}
