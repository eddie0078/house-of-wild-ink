"use client";

import React, { useState, useEffect } from "react";
import { NotebookQuote } from "@/lib/types";
import { Quote, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export function QuoteCarousel({ quotes }: { quotes: NotebookQuote[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || quotes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPlaying, quotes.length]);

  if (!quotes || quotes.length === 0) return null;

  const current = quotes[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <div
      className="relative text-center px-4 sm:px-12 py-6"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      aria-label="From the Notebook quotation carousel"
    >
      <Quote className="w-8 h-8 text-brand-gold/50 mx-auto mb-4" />

      <div className="min-h-[110px] flex flex-col justify-center transition-all duration-300">
        <blockquote className="font-reading italic text-xl sm:text-2xl text-brand-ink leading-relaxed max-w-2xl mx-auto">
          “{current.quote}”
        </blockquote>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-sans tracking-wider uppercase text-brand-forest/75 font-medium">
          {current.source && <span>— {current.source}</span>}
          {current.note && <span className="text-brand-coral">({current.note})</span>}
        </div>
      </div>

      {quotes.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-full text-brand-forest/60 hover:text-brand-forest hover:bg-brand-parchment transition-colors"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1.5">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? "w-6 bg-brand-coral" : "w-1.5 bg-brand-gold/40"
                }`}
                aria-label={`Go to quote ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-full text-brand-forest/60 hover:text-brand-forest hover:bg-brand-parchment transition-colors"
            aria-label="Next quote"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="ml-2 p-1 text-brand-forest/40 hover:text-brand-forest transition-colors"
            aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}
