"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnalyticsSummary } from "@/lib/types";
import {
  BarChart3,
  Eye,
  BookOpen,
  Share2,
  Shield,
  Heart,
  Clock,
  CheckCircle2,
  Headphones,
  Search,
  Smartphone,
  Monitor,
  Tablet,
  Compass,
  ArrowRight,
  ExternalLink,
  Edit,
  Sparkles,
  Layers,
  Filter,
  RefreshCw,
  Copy,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

function formatSeconds(sec: number): string {
  if (!sec || sec <= 0) return "0s";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export default function InkRoomAnalyticsPage() {
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("all");
  const [selectedFormat, setSelectedFormat] = useState<"all" | "poem" | "story" | "audio_story" | "essay">("all");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const fetchAnalytics = (activeRange: "today" | "7d" | "30d" | "all") => {
    setIsLoading(true);
    fetch(`/api/analytics?range=${activeRange}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load analytics");
        return res.json();
      })
      .then((data: AnalyticsSummary) => {
        setSummary(data);
        setIsLoading(false);
        setLastRefreshed(new Date().toLocaleTimeString());
      })
      .catch((err) => {
        console.error("Analytics fetch error:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  const filteredPages = (summary?.topPages || []).filter((page) => {
    if (selectedFormat === "all") return true;
    if (selectedFormat === "poem") return page.type === "poem" || page.path.startsWith("/poems/");
    if (selectedFormat === "story") return page.type === "story" || page.type === "short_drama" || page.path.startsWith("/stories/");
    if (selectedFormat === "audio_story") return page.type === "audio_story" || page.path.startsWith("/audio-stories/");
    if (selectedFormat === "essay") return page.type === "essay" || page.type === "article" || page.type === "reflection" || page.path.startsWith("/essays/");
    return true;
  });

  // Calculate percentages for device and referrer cards safely
  const totalDeviceVisits = summary
    ? (summary.readerPreferences?.devices.mobile || 0) +
      (summary.readerPreferences?.devices.desktop || 0) +
      (summary.readerPreferences?.devices.tablet || 0)
    : 0;

  const totalReferrals = summary
    ? (summary.readerPreferences?.referrers.direct || 0) +
      (summary.readerPreferences?.referrers.search || 0) +
      (summary.readerPreferences?.referrers.social || 0) +
      (summary.readerPreferences?.referrers.internal || 0)
    : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Range Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-brand-gold/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-brand-coral font-semibold">
            <span>🌸</span>
            <span>Audience Telemetry & Literary Resonance</span>
            <span>✿</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-forest mt-1">
            Reader Telemetry & Analytics Center
          </h1>
          <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
            Authentic first-party telemetry tracking reading dwell times, scroll-depth completions, quote copies, and audience discovery.
          </p>
        </div>

        {/* Time Window Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="bg-brand-cream/80 p-1 rounded-xl border border-brand-gold/30 flex items-center gap-1 shadow-2xs">
            {(
              [
                { id: "today", label: "Today" },
                { id: "7d", label: "Last 7 Days" },
                { id: "30d", label: "Last 30 Days" },
                { id: "all", label: "All Time" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setRange(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold tracking-wide transition-all cursor-pointer ${
                  range === t.id
                    ? "bg-brand-forest text-brand-cream shadow-xs"
                    : "text-brand-forest/70 hover:text-brand-forest hover:bg-brand-parchment"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchAnalytics(range)}
            title="Refresh live telemetry"
            disabled={isLoading}
            className="p-2 rounded-xl bg-brand-parchment border border-brand-gold/40 text-brand-forest hover:bg-brand-cream transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 6 Executive KPI Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Page Views */}
        <div className="bg-brand-parchment p-5 rounded-2xl border border-brand-gold/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-brand-forest mb-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
                Total Views
              </span>
              <Eye className="w-4 h-4 text-brand-forest/70" />
            </div>
            <span className="font-display text-3xl font-bold text-brand-forest">
              {summary ? summary.totalViews.toLocaleString() : "—"}
            </span>
          </div>
          <p className="text-[10px] font-sans text-brand-forest/60 mt-3 pt-2 border-t border-brand-gold/15">
            Archival site impressions
          </p>
        </div>

        {/* Engaged Reads (>30s) */}
        <div className="bg-brand-parchment p-5 rounded-2xl border border-brand-gold/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-brand-forest mb-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
                Engaged Reads
              </span>
              <BookOpen className="w-4 h-4 text-brand-coral" />
            </div>
            <span className="font-display text-3xl font-bold text-brand-forest">
              {summary ? summary.totalEngaged.toLocaleString() : "—"}
            </span>
          </div>
          <p className="text-[10px] font-sans text-brand-coral font-medium mt-3 pt-2 border-t border-brand-gold/15">
            {summary?.engagementRate || 0}% active immersion
          </p>
        </div>

        {/* Read Completion Rate */}
        <div className="bg-brand-parchment p-5 rounded-2xl border border-brand-gold/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-brand-forest mb-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
                Completion Rate
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="font-display text-3xl font-bold text-brand-forest">
              {summary ? `${summary.completionRate}%` : "—"}
            </span>
          </div>
          <p className="text-[10px] font-sans text-emerald-800 font-medium mt-3 pt-2 border-t border-brand-gold/15">
            {summary?.totalCompletions || 0} finished 75%+ of piece
          </p>
        </div>

        {/* Average Dwell Time */}
        <div className="bg-brand-parchment p-5 rounded-2xl border border-brand-gold/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-brand-forest mb-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
                Avg. Read Time
              </span>
              <Clock className="w-4 h-4 text-brand-gold" />
            </div>
            <span className="font-display text-3xl font-bold text-brand-forest">
              {summary ? formatSeconds(summary.averageDwellSeconds) : "—"}
            </span>
          </div>
          <p className="text-[10px] font-sans text-brand-forest/60 mt-3 pt-2 border-t border-brand-gold/15">
            Total {summary ? Math.round(summary.totalDwellSeconds / 60) : 0} min spent reading
          </p>
        </div>

        {/* Shares & Quote Copies */}
        <div className="bg-brand-parchment p-5 rounded-2xl border border-brand-gold/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-brand-forest mb-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
                Shares & Quotes
              </span>
              <Share2 className="w-4 h-4 text-brand-coral" />
            </div>
            <span className="font-display text-3xl font-bold text-brand-forest">
              {summary ? (summary.totalShares + (summary.totalQuoteCopies || 0)).toLocaleString() : "—"}
            </span>
          </div>
          <p className="text-[10px] font-sans text-brand-forest/60 mt-3 pt-2 border-t border-brand-gold/15">
            {summary?.totalShares || 0} shared · {summary?.totalQuoteCopies || 0} copied
          </p>
        </div>

        {/* Spoken Word Listens */}
        <div className="bg-brand-parchment p-5 rounded-2xl border border-brand-gold/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-brand-forest mb-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
                Audio Plays
              </span>
              <Headphones className="w-4 h-4 text-brand-forest/70" />
            </div>
            <span className="font-display text-3xl font-bold text-brand-forest">
              {summary ? (summary.totalAudioPlays || 0).toLocaleString() : "—"}
            </span>
          </div>
          <p className="text-[10px] font-sans text-brand-forest/60 mt-3 pt-2 border-t border-brand-gold/15">
            {summary?.audioMetrics?.totalCompletions || 0} completed listens
          </p>
        </div>
      </div>

      {/* The Literary Reading Engagement Funnel */}
      <div className="bg-brand-parchment rounded-2xl p-6 sm:p-8 border border-brand-gold/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-brand-coral">
              Audience Journey
            </span>
            <h2 className="font-display text-xl font-bold text-brand-forest mt-0.5">
              The Literary Engagement Funnel
            </h2>
          </div>
          <span className="text-xs font-reading italic text-brand-forest/60">
            From initial visit to stanza immersion and advocacy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          {/* Step 1: Impressions */}
          <div className="p-4 rounded-xl bg-brand-cream/70 border border-brand-gold/20 space-y-2">
            <span className="text-[10px] font-sans font-bold uppercase text-brand-forest/60 block">
              Step 1 · Discovery
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-brand-forest">
                {summary?.totalViews || 0}
              </span>
              <span className="text-xs font-sans text-brand-forest/70">100%</span>
            </div>
            <div className="w-full bg-brand-gold/20 rounded-full h-2">
              <div className="bg-brand-forest h-2 rounded-full w-full" />
            </div>
            <p className="text-[11px] font-reading italic text-brand-forest/70">
              Readers landed on archival pages
            </p>
          </div>

          {/* Step 2: Engaged Read */}
          <div className="p-4 rounded-xl bg-brand-cream/70 border border-brand-gold/20 space-y-2">
            <span className="text-[10px] font-sans font-bold uppercase text-brand-forest/60 block">
              Step 2 · Attention (&gt;30s)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-brand-forest">
                {summary?.totalEngaged || 0}
              </span>
              <span className="text-xs font-sans text-brand-coral font-bold">
                {summary?.engagementRate || 0}%
              </span>
            </div>
            <div className="w-full bg-brand-gold/20 rounded-full h-2">
              <div
                className="bg-brand-coral h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, summary?.engagementRate || 0)}%` }}
              />
            </div>
            <p className="text-[11px] font-reading italic text-brand-forest/70">
              Absorbed in active verse reading
            </p>
          </div>

          {/* Step 3: Full Completion */}
          <div className="p-4 rounded-xl bg-brand-cream/70 border border-brand-gold/20 space-y-2">
            <span className="text-[10px] font-sans font-bold uppercase text-brand-forest/60 block">
              Step 3 · Read Completion
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-brand-forest">
                {summary?.totalCompletions || 0}
              </span>
              <span className="text-xs font-sans text-emerald-800 font-bold">
                {summary?.completionRate || 0}%
              </span>
            </div>
            <div className="w-full bg-brand-gold/20 rounded-full h-2">
              <div
                className="bg-emerald-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, summary?.completionRate || 0)}%` }}
              />
            </div>
            <p className="text-[11px] font-reading italic text-brand-forest/70">
              Reached final stanza or scene beat
            </p>
          </div>

          {/* Step 4: Literary Advocacy */}
          <div className="p-4 rounded-xl bg-brand-cream/70 border border-brand-gold/20 space-y-2">
            <span className="text-[10px] font-sans font-bold uppercase text-brand-forest/60 block">
              Step 4 · Shared & Copied
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-brand-forest">
                {(summary?.totalShares || 0) + (summary?.totalQuoteCopies || 0)}
              </span>
              <span className="text-xs font-sans text-brand-gold font-bold">
                {summary && summary.totalViews > 0
                  ? Math.round((((summary.totalShares || 0) + (summary.totalQuoteCopies || 0)) / summary.totalViews) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-brand-gold/20 rounded-full h-2">
              <div
                className="bg-brand-gold h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    summary && summary.totalViews > 0
                      ? (((summary.totalShares || 0) + (summary.totalQuoteCopies || 0)) / summary.totalViews) * 100
                      : 0
                  )}%`,
                }}
              />
            </div>
            <p className="text-[11px] font-reading italic text-brand-forest/70">
              Verses copied or shared with friends
            </p>
          </div>
        </div>
      </div>

      {/* Top Literary Works Leaderboard */}
      <div className="bg-brand-parchment rounded-2xl border border-brand-gold/30 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-brand-coral">
              Readership Rankings
            </span>
            <h2 className="font-display text-xl font-bold text-brand-forest">
              Literary Works Performance
            </h2>
            <p className="font-reading text-xs text-brand-forest/70 italic mt-0.5">
              Breakdown of views, sustained dwell times, and verse quotes per literary piece.
            </p>
          </div>

          {/* Format Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-sans">
            {[
              { id: "all", label: "All Works" },
              { id: "poem", label: "Poems" },
              { id: "story", label: "Stories & Drama" },
              { id: "audio_story", label: "Audio Stories" },
              { id: "essay", label: "Essays" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFormat(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedFormat === tab.id
                    ? "bg-brand-forest text-brand-cream"
                    : "bg-brand-cream border border-brand-gold/30 text-brand-forest/80 hover:bg-brand-parchment"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        {filteredPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-brand-cream/80 border-b border-brand-gold/20 text-brand-forest/70 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6 font-bold">Literary Piece & Path</th>
                  <th className="py-3 px-4 font-bold">Format</th>
                  <th className="py-3 px-4 font-bold text-right">Views</th>
                  <th className="py-3 px-4 font-bold text-right">Engaged Reads</th>
                  <th className="py-3 px-4 font-bold text-right">Completions</th>
                  <th className="py-3 px-4 font-bold text-right">Shares & Copies</th>
                  <th className="py-3 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/15">
                {filteredPages.map((page, idx) => {
                  const formatPill =
                    page.type === "poem"
                      ? { label: "Poem", color: "bg-red-50 text-red-800 border-red-200" }
                      : page.type === "short_drama" || page.type === "story"
                      ? { label: "Story/Drama", color: "bg-amber-50 text-amber-800 border-amber-200" }
                      : page.type === "audio_story"
                      ? { label: "Audio Story", color: "bg-purple-50 text-purple-800 border-purple-200" }
                      : page.type === "essay" || page.type === "reflection"
                      ? { label: "Essay", color: "bg-emerald-50 text-emerald-800 border-emerald-200" }
                      : { label: page.type || "Page", color: "bg-stone-100 text-stone-700 border-stone-200" };

                  return (
                    <tr key={idx} className="hover:bg-brand-cream/50 transition">
                      <td className="py-3.5 px-6">
                        <div className="font-display font-bold text-sm text-brand-forest">
                          {page.title || page.path}
                        </div>
                        <div className="font-mono text-[11px] text-brand-forest/50 truncate max-w-xs">
                          {page.path}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-sans uppercase font-bold border ${formatPill.color}`}
                        >
                          {formatPill.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-display font-bold text-sm text-brand-forest">
                        {page.views.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-display font-bold text-sm text-brand-coral">
                          {page.engaged.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-brand-forest/50 block">
                          {page.views > 0 ? Math.round((page.engaged / page.views) * 100) : 0}% rate
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-display font-bold text-sm text-emerald-800">
                          {page.completions.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-brand-forest/50 block">
                          {page.engaged > 0 ? Math.round((page.completions / page.engaged) * 100) : 0}% of readers
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-display font-bold text-sm text-brand-gold">
                          {(page.shares + (page.quoteCopies || 0)).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-brand-forest/50 block">
                          {page.shares} shares · {page.quoteCopies || 0} quotes
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={page.path}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-brand-gold/30 hover:bg-brand-cream text-brand-forest transition"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-brand-gold mx-auto opacity-60" />
            <p className="font-display font-semibold text-brand-forest text-base">
              No telemetry captured for {selectedFormat === "all" ? "this period" : `${selectedFormat} works`}
            </p>
            <p className="text-xs font-reading italic text-brand-forest/60 max-w-md mx-auto">
              Real telemetry will populate here as readers explore Linda's verses, dramas, and audio stories.
            </p>
          </div>
        )}
      </div>

      {/* Two-Column Deep Dive: Search Intent & Reader Aesthetic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Search Intent & Reader Query Intelligence */}
        <div className="bg-brand-parchment rounded-2xl p-6 border border-brand-gold/30 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-coral" />
                <h3 className="font-display text-lg font-bold text-brand-forest">
                  Search & Audience Intent Intelligence
                </h3>
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-brand-forest/60">
                {summary?.searchMetrics?.totalSearches || 0} searches logged
              </span>
            </div>

            {/* Top Keywords */}
            <div className="mt-4 space-y-3">
              <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/80">
                Top Keywords Searched in Villa Search
              </h4>
              {summary && summary.searchMetrics?.topQueries?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {summary.searchMetrics.topQueries.map((q, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-brand-cream border border-brand-gold/30 text-xs font-reading italic text-brand-forest inline-flex items-center gap-1.5"
                    >
                      <span>"{q.query}"</span>
                      <span className="text-[10px] font-sans font-bold not-italic px-1.5 py-0.2 rounded-full bg-brand-forest text-brand-cream">
                        {q.count}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-reading italic text-brand-forest/60 py-2">
                  No search queries logged in this window yet. Queries entered into the Universal Search Modal will be cataloged here.
                </p>
              )}
            </div>

            {/* Zero-Result Search Queries (Content Opportunities) */}
            <div className="mt-6 space-y-2 p-4 bg-amber-50/70 rounded-xl border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-sans font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Editorial Opportunity: Queries with 0 Results</span>
              </div>
              <p className="font-reading text-xs text-amber-900/80">
                These are concepts readers searched for that are not yet in the archives — ideas for Linda's upcoming pieces:
              </p>
              {summary && summary.searchMetrics?.zeroResultQueries?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {summary.searchMetrics.zeroResultQueries.map((q, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-white border border-amber-300 text-xs text-amber-950 font-reading italic"
                    >
                      "{q.query}" ({q.count})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] font-reading italic text-amber-800/80">
                  Every recent search query successfully matched authentic published pieces.
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-brand-gold/15 text-[11px] font-reading italic text-brand-forest/60">
            Search queries are collected without storing reader IP addresses or session profiles.
          </div>
        </div>

        {/* Reader Aesthetic & Hardware Landscape */}
        <div className="bg-brand-parchment rounded-2xl p-6 border border-brand-gold/30 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-gold" />
                <h3 className="font-display text-lg font-bold text-brand-forest">
                  Reader Aesthetic & Hardware Landscape
                </h3>
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-brand-forest/60">
                First-Party Environment
              </span>
            </div>

            {/* Bougainvillea Mood Choices */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/80">
                Bougainvillea Color Palette Popularity
              </h4>
              {summary && Object.keys(summary.readerPreferences?.themes || {}).length > 0 ? (
                <div className="space-y-1.5">
                  {Object.entries(summary.readerPreferences.themes).map(([theme, count], idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-sans">
                      <span className="text-brand-forest font-medium">{theme}</span>
                      <span className="text-brand-coral font-bold">{count} selections</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-reading italic text-brand-forest/60 py-1">
                  Default: Scarlet Crimson and Fuchsia Magenta palette.
                </p>
              )}
            </div>

            {/* Device Distribution */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/80">
                Reader Device Breakdown
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-brand-cream/80 rounded-xl border border-brand-gold/20 text-center">
                  <Smartphone className="w-4 h-4 text-brand-forest mx-auto mb-1" />
                  <span className="text-[10px] font-sans font-bold uppercase text-brand-forest/60 block">
                    Mobile
                  </span>
                  <span className="font-display text-lg font-bold text-brand-forest">
                    {totalDeviceVisits > 0
                      ? Math.round(((summary?.readerPreferences?.devices.mobile || 0) / totalDeviceVisits) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <div className="p-3 bg-brand-cream/80 rounded-xl border border-brand-gold/20 text-center">
                  <Monitor className="w-4 h-4 text-brand-forest mx-auto mb-1" />
                  <span className="text-[10px] font-sans font-bold uppercase text-brand-forest/60 block">
                    Desktop
                  </span>
                  <span className="font-display text-lg font-bold text-brand-forest">
                    {totalDeviceVisits > 0
                      ? Math.round(((summary?.readerPreferences?.devices.desktop || 0) / totalDeviceVisits) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <div className="p-3 bg-brand-cream/80 rounded-xl border border-brand-gold/20 text-center">
                  <Tablet className="w-4 h-4 text-brand-forest mx-auto mb-1" />
                  <span className="text-[10px] font-sans font-bold uppercase text-brand-forest/60 block">
                    Tablet
                  </span>
                  <span className="font-display text-lg font-bold text-brand-forest">
                    {totalDeviceVisits > 0
                      ? Math.round(((summary?.readerPreferences?.devices.tablet || 0) / totalDeviceVisits) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Referral Channels */}
            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/80">
                Referral Inbound Channels
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-brand-cream/60 border border-brand-gold/20">
                  <span className="text-[10px] text-brand-forest/60 block uppercase font-bold">Direct</span>
                  <span className="font-bold text-brand-forest">
                    {summary?.readerPreferences?.referrers.direct || 0}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-brand-cream/60 border border-brand-gold/20">
                  <span className="text-[10px] text-brand-forest/60 block uppercase font-bold">Search</span>
                  <span className="font-bold text-brand-forest">
                    {summary?.readerPreferences?.referrers.search || 0}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-brand-cream/60 border border-brand-gold/20">
                  <span className="text-[10px] text-brand-forest/60 block uppercase font-bold">Social</span>
                  <span className="font-bold text-brand-forest">
                    {summary?.readerPreferences?.referrers.social || 0}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-brand-cream/60 border border-brand-gold/20">
                  <span className="text-[10px] text-brand-forest/60 block uppercase font-bold">Internal</span>
                  <span className="font-bold text-brand-forest">
                    {summary?.readerPreferences?.referrers.internal || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-gold/15 text-[11px] font-reading italic text-brand-forest/60">
            Detected via HTTP User-Agent and Referer headers without saving individual identifier strings.
          </div>
        </div>
      </div>

      {/* Spoken Word Audio Listening Studio */}
      <div className="bg-brand-parchment rounded-2xl p-6 sm:p-8 border border-brand-gold/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-brand-coral" />
            <h3 className="font-display text-xl font-bold text-brand-forest">
              Spoken Word & Audio Listening Studio
            </h3>
          </div>
          <span className="text-xs font-sans text-brand-forest/70">
            {summary?.audioMetrics?.totalPlays || 0} total plays across spoken pieces
          </span>
        </div>

        {summary && summary.audioMetrics?.pieces?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.audioMetrics.pieces.map((piece, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-brand-cream/70 border border-brand-gold/20 flex flex-col justify-between space-y-3"
              >
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-forest truncate">
                    {piece.path}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-brand-forest/70 mt-1">
                    <span>{piece.plays} plays</span>
                    <span>·</span>
                    <span className="text-emerald-800 font-semibold">{piece.completions} completions</span>
                  </div>
                </div>
                <Link
                  href={piece.path}
                  target="_blank"
                  className="text-[11px] font-sans font-semibold text-brand-coral hover:underline inline-flex items-center gap-1"
                >
                  <span>Listen on Public Villa ↗</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-brand-cream/40 rounded-xl border border-dashed border-brand-gold/30">
            <Headphones className="w-8 h-8 text-brand-gold mx-auto mb-2 opacity-60" />
            <p className="font-display font-semibold text-sm text-brand-forest">
              No audio plays logged in this time range
            </p>
            <p className="text-xs font-reading italic text-brand-forest/60 mt-1">
              Spoken word listening sessions and completions will appear here as visitors listen to Linda's narrations.
            </p>
          </div>
        )}
      </div>

      {/* The First-Party Privacy & Zero-Dummy Standard Guarantee */}
      <div className="bg-brand-cream rounded-2xl p-6 sm:p-8 border border-brand-gold/40 space-y-4">
        <div className="flex items-center gap-2.5 text-brand-forest font-display text-lg font-bold">
          <Shield className="w-5 h-5 text-emerald-700" />
          <span>The First-Party Privacy Standard & Zero Dummy Data Guarantee</span>
        </div>
        <p className="font-reading text-sm text-brand-forest/85 leading-relaxed">
          House of Wild Ink maintains a strict <strong>zero dummy data standard</strong>: every single number, percentage, dwell time, and rank in this workspace is computed in real time from authentic event telemetry. When a literary piece is new or unread, it displays an honest zero rather than misleading mock data.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-brand-forest/80 pt-2 border-t border-brand-gold/20">
          <div>
            <h4 className="font-bold text-brand-forest mb-1">What Is Measured Authentically:</h4>
            <ul className="list-disc list-inside space-y-1 text-brand-forest/70">
              <li>Active dwell time using page visibility states</li>
              <li>Stanza & act scroll depth completion (75%+ thresholds)</li>
              <li>Text selection and quote clipboard copies</li>
              <li>Spoken word audio playback starts and completions</li>
              <li>Universal villa search terms and zero-result queries</li>
              <li>Bougainvillea mood color switcher preferences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-brand-forest mb-1">What Is Strictly Protected & Excluded:</h4>
            <ul className="list-disc list-inside space-y-1 text-brand-forest/70">
              <li>Zero IP addresses stored or processed</li>
              <li>Zero cross-site advertising cookies or tracking pixels</li>
              <li>All private <code className="text-[11px] bg-black/5 px-1 py-0.5 rounded">/ink-room/*</code> visits dropped automatically</li>
              <li>Author drafts and preview edits are never tallied</li>
              <li>Honors browser Do Not Track (DNT) and Global Privacy Control (GPC)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
