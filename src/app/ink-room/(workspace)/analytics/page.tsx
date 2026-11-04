import React from "react";
import { db } from "@/lib/db";
import { BarChart3, Eye, BookOpen, Share2, Shield, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default function InkRoomAnalyticsPage() {
  const summary = db.getAnalyticsSummary();

  const poemPages = summary.topPages.filter((p) => p.type === "poem" || p.path.startsWith("/poems"));
  const storyPages = summary.topPages.filter((p) => p.type === "story" || p.path.startsWith("/stories"));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-gold/30">
        <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
          Audience Telemetry
        </span>
        <h1 className="font-display text-3xl font-bold text-brand-forest">
          First-Party Privacy-Conscious Analytics
        </h1>
        <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
          Pure aggregate metrics without cookies, advertising trackers, or reader fingerprinting.
        </p>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest mb-2">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
              Total Page Views
            </span>
            <Eye className="w-4 h-4 text-brand-forest" />
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-forest">
            {summary.totalViews}
          </span>
        </div>

        <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest mb-2">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
              Engaged Reads (&gt;30s)
            </span>
            <BookOpen className="w-4 h-4 text-brand-coral" />
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-forest">
            {summary.totalEngaged}
          </span>
        </div>

        <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest mb-2">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
              Engagement Rate
            </span>
            <Heart className="w-4 h-4 text-brand-coral" />
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-forest">
            {summary.engagementRate}%
          </span>
        </div>

        <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest mb-2">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
              Share Actions
            </span>
            <Share2 className="w-4 h-4 text-brand-gold" />
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-forest">
            {summary.totalShares}
          </span>
        </div>
      </div>

      {/* Top Read Poems & Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Poems Breakdown */}
        <div className="bg-brand-parchment rounded-2xl p-6 border border-brand-gold/30">
          <h2 className="font-display text-lg font-bold text-brand-forest mb-4">
            Most-Read Poems
          </h2>
          {poemPages.length > 0 ? (
            <div className="divide-y divide-brand-gold/20">
              {poemPages.map((page, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-sans">
                  <span className="truncate max-w-[200px] text-brand-forest font-medium">
                    {page.path}
                  </span>
                  <div className="flex items-center gap-3 text-brand-forest/75 shrink-0">
                    <span>{page.views} views</span>
                    <span>·</span>
                    <span className="text-brand-coral font-semibold">{page.engaged} engaged</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-reading italic text-brand-forest/60 py-4">
              Poem readership data aggregates here as readers explore the collection.
            </p>
          )}
        </div>

        {/* Stories Breakdown */}
        <div className="bg-brand-parchment rounded-2xl p-6 border border-brand-gold/30">
          <h2 className="font-display text-lg font-bold text-brand-forest mb-4">
            Most-Read Stories & Dramas
          </h2>
          {storyPages.length > 0 ? (
            <div className="divide-y divide-brand-gold/20">
              {storyPages.map((page, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-sans">
                  <span className="truncate max-w-[200px] text-brand-forest font-medium">
                    {page.path}
                  </span>
                  <div className="flex items-center gap-3 text-brand-forest/75 shrink-0">
                    <span>{page.views} views</span>
                    <span>·</span>
                    <span className="text-brand-coral font-semibold">{page.engaged} engaged</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-reading italic text-brand-forest/60 py-4">
              Story and drama readership data aggregates here.
            </p>
          )}
        </div>
      </div>

      {/* Privacy Guarantee Explanation (Section 22 requirement) */}
      <div className="bg-brand-cream rounded-2xl p-6 sm:p-8 border border-brand-gold/40 space-y-4">
        <div className="flex items-center gap-2.5 text-brand-forest font-display text-lg font-bold">
          <Shield className="w-5 h-5 text-brand-coral" />
          <span>The First-Party Privacy Standard</span>
        </div>
        <p className="font-reading text-sm text-brand-forest/85 leading-relaxed">
          Unlike standard tracking platforms, House of Wild Ink collects <strong>zero individual reader identifiers</strong>.
          We do not record IP addresses, browser canvas fingerprints, or cross-site browsing history.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-brand-forest/80 pt-2 border-t border-brand-gold/20">
          <div>
            <h4 className="font-bold text-brand-forest mb-1">What Is Collected:</h4>
            <ul className="list-disc list-inside space-y-1 text-brand-forest/70">
              <li>Aggregate page view counters by route</li>
              <li>Engaged reads (sessions exceeding 30 seconds)</li>
              <li>Native share and link copy events</li>
              <li>Daily date stamps (YYYY-MM-DD)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-brand-forest mb-1">What Is Strictly Excluded:</h4>
            <ul className="list-disc list-inside space-y-1 text-brand-forest/70">
              <li>IP addresses and device fingerprints</li>
              <li>Cross-site third-party tracking cookies</li>
              <li>All `/ink-room/*` private workspace visits</li>
              <li>Unpublished draft and preview inspection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
