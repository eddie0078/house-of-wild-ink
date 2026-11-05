"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Feather,
  BookOpen,
  Headphones,
  FileText,
  Layers,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { BougainvilleaBractCluster } from "./Bougainvillea";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  content_type: string;
  excerpt: string;
  author_credit: string;
  reading_time?: number;
  audio_duration?: string;
  tags: string[];
  url: string;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: "crimson" | "magenta" | "coral" | "purple" | "gold" }
> = {
  poem: { label: "Poem", icon: Feather, color: "crimson" },
  story: { label: "Story", icon: BookOpen, color: "coral" },
  short_drama: { label: "Drama", icon: BookOpen, color: "coral" },
  essay: { label: "Essay", icon: FileText, color: "purple" },
  article: { label: "Article", icon: FileText, color: "purple" },
  reflection: { label: "Reflection", icon: FileText, color: "purple" },
  audio_story: { label: "Audio Story", icon: Headphones, color: "magenta" },
  collection: { label: "Collection", icon: Layers, color: "gold" },
};

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Global keydown listeners for Escape & Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].url);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  // Fetch search results
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}&type=${selectedType}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
          setSelectedIndex(0);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }, 150);

    return () => clearTimeout(timer);
  }, [query, selectedType, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl border-2 border-[rgba(197,160,89,0.45)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Universal Literary Search"
      >
        {/* Decorative corner Bougainvillea bracts */}
        <div className="absolute top-2 right-12 pointer-events-none opacity-80">
          <BougainvilleaBractCluster color="crimson" size={28} />
        </div>

        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[rgba(197,160,89,0.3)] bg-[#F7F4EE] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search poems, stories, essays, audio recordings, or tags (e.g. faith, stones)..."
            className="w-full bg-transparent font-sans text-sm sm:text-base text-[#182C25] placeholder:text-[#64746E]/70 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-[#64746E] hover:text-[#182C25] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[rgba(197,160,89,0.3)] bg-white text-xs font-mono text-[#64746E] hover:bg-[#FAF8F5] cursor-pointer"
            title="Close Search (Esc)"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-[#FAF8F5] border-b border-[rgba(197,160,89,0.2)] flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[10px] uppercase font-semibold text-[#64746E] tracking-wider shrink-0 mr-1">
            Filter:
          </span>
          {[
            { id: "all", label: "All Works" },
            { id: "poem", label: "Poems" },
            { id: "short_drama", label: "Stories & Drama" },
            { id: "audio_story", label: "Audio Stories" },
            { id: "essay", label: "Essays" },
            { id: "collection", label: "Collections" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer whitespace-nowrap ${
                selectedType === tab.id
                  ? "bg-[#182C25] text-white shadow-xs"
                  : "bg-white border border-[rgba(197,160,89,0.25)] text-[#182C25]/80 hover:bg-[#F7F4EE]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Scroll Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1 divide-y divide-[rgba(197,160,89,0.15)]">
          {isLoading && (
            <div className="py-12 text-center text-xs text-[#64746E]">
              Searching the House of Wild Ink archives...
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto opacity-70" />
              <p className="font-display font-semibold text-[#182C25] text-sm">
                No literary works matched "{query}"
              </p>
              <p className="text-xs text-[#64746E]">
                Try searching for words like "stones", "quiet", "garden", "faith", or "linda".
              </p>
            </div>
          )}

          {!isLoading &&
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              const typeCfg = TYPE_CONFIG[item.content_type] || TYPE_CONFIG.story;
              const Icon = typeCfg.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    router.push(item.url);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3.5 rounded-xl transition cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? "bg-white border border-[rgba(197,160,89,0.5)] shadow-xs translate-x-1"
                      : "hover:bg-white/60"
                  }`}
                >
                  {/* Type Icon Badge with Bougainvillea Bract */}
                  <div className="mt-0.5 p-2 rounded-lg bg-[#FAF8F5] border border-[rgba(197,160,89,0.3)] shrink-0 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#C5A059]" />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <BougainvilleaBractCluster color={typeCfg.color} size={14} />
                        <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#C85A46]">
                          {typeCfg.label}
                        </span>
                      </div>
                      {item.audio_duration ? (
                        <span className="text-[10px] font-mono text-[#64746E] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-[#C5A059]" />
                          {item.audio_duration}
                        </span>
                      ) : item.reading_time ? (
                        <span className="text-[10px] font-mono text-[#64746E] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-[#C5A059]" />
                          {item.reading_time} min
                        </span>
                      ) : null}
                    </div>

                    <h4 className="font-display font-bold text-base text-[#182C25] truncate">
                      {item.title}
                    </h4>

                    {item.subtitle && (
                      <p className="font-reading italic text-xs text-[#64746E] truncate">
                        {item.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-[#182C25]/75 line-clamp-2 mt-1 leading-relaxed">
                      {item.excerpt}
                    </p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 4).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[rgba(197,160,89,0.2)] text-[9px] font-sans text-[#64746E]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Arrow Indicator */}
                  <div className="self-center pl-2 shrink-0">
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-[#C85A46] translate-x-1" : "text-black/20"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-[#F7F4EE] border-t border-[rgba(197,160,89,0.2)] text-[11px] text-[#64746E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-300 text-[10px] font-mono">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-300 text-[10px] font-mono">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-300 text-[10px] font-mono">esc</kbd> Dismiss
            </span>
          </div>
          <span className="font-serif italic text-[#C5A059]">House of Wild Ink Index</span>
        </div>
      </div>
    </div>
  );
}
