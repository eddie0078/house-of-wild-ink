import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  Feather,
  BookOpen,
  Layers,
  Users,
  Image as ImageIcon,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function InkRoomDashboardPage() {
  const content = db.getContentItems();
  const published = content.filter((i) => i.status === "published");
  const drafts = content.filter((i) => i.status === "draft");
  const scheduled = content.filter((i) => i.status === "scheduled");
  const collections = db.getCollections();
  const people = db.getPeople();
  const media = db.getMedia();
  const settings = db.getSettings();

  // Calculate "Content Requiring Attention" (Section 13 requirement)
  const itemsNeedingAttention: { id: string; title: string; issue: string; type: string; slug: string }[] = [];

  content.forEach((item) => {
    if (!item.seo_description) {
      itemsNeedingAttention.push({
        id: item.id,
        title: item.title,
        issue: "Missing SEO meta description",
        type: item.content_type,
        slug: item.slug,
      });
    }
    if (item.cover_media_id && !item.social_media_id) {
      itemsNeedingAttention.push({
        id: item.id,
        title: item.title,
        issue: "Cover image set without dedicated social card",
        type: item.content_type,
        slug: item.slug,
      });
    }
  });

  media.forEach((m) => {
    if (!m.alt_text) {
      itemsNeedingAttention.push({
        id: m.id,
        title: m.filename,
        issue: "Media asset missing descriptive alt text",
        type: "media",
        slug: m.id,
      });
    }
  });

  const featuredPoem = settings.featured_poem_id ? db.getContentById(settings.featured_poem_id) : undefined;
  const featuredStory = settings.featured_story_id ? db.getContentById(settings.featured_story_id) : undefined;

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/30">
        <div>
          <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
            Editorial Studio
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-forest font-bold tracking-tight">
            The Ink Room Dashboard
          </h1>
          <p className="font-reading text-base text-brand-forest/80 italic mt-1">
            Publishing command, creative drafts, and volume curation.
          </p>
        </div>

        {/* Quick Action Controls (Section 13) */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/ink-room/poems/editor"
            className="px-3.5 py-2 rounded-xl bg-brand-forest text-brand-cream text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-forest/90 transition-all inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-brand-coral" />
            <span>New Poem</span>
          </Link>
          <Link
            href="/ink-room/stories/editor"
            className="px-3.5 py-2 rounded-xl bg-brand-coral text-brand-cream text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-coral/90 transition-all inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Story / Drama</span>
          </Link>
          <Link
            href="/ink-room/collections"
            className="px-3.5 py-2 rounded-xl border border-brand-gold/50 bg-brand-cream hover:bg-brand-parchment text-brand-forest text-xs font-sans font-semibold tracking-wider uppercase transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-brand-gold" />
            <span>New Collection</span>
          </Link>
        </div>
      </div>

      {/* Live Data Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest mb-2">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
              Published Works
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-forest">
            {published.length}
          </span>
        </div>

        <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest mb-2">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
              Active Drafts
            </span>
            <Feather className="w-4 h-4 text-brand-coral" />
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-forest">
            {drafts.length}
          </span>
        </div>

        <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest mb-2">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
              Scheduled
            </span>
            <Clock className="w-4 h-4 text-brand-gold" />
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-forest">
            {scheduled.length}
          </span>
        </div>

        <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest mb-2">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
              Volumes & Themes
            </span>
            <Layers className="w-4 h-4 text-brand-forest" />
          </div>
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-forest">
            {collections.length}
          </span>
        </div>
      </div>

      {/* Homepage Feature Status */}
      <div className="bg-brand-parchment rounded-2xl p-6 sm:p-8 border border-brand-gold/30">
        <h2 className="font-display text-xl text-brand-forest font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-coral" />
          <span>Active Homepage Features</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-brand-cream border border-brand-gold/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-wider text-brand-coral font-semibold">
                Featured Poem
              </span>
              <p className="font-display text-lg text-brand-ink font-semibold">
                {featuredPoem ? featuredPoem.title : "None selected"}
              </p>
            </div>
            <Link
              href="/ink-room/poems"
              className="text-xs font-sans text-brand-coral font-semibold hover:underline"
            >
              Configure →
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-brand-cream border border-brand-gold/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-wider text-brand-coral font-semibold">
                Featured Story / Drama
              </span>
              <p className="font-display text-lg text-brand-ink font-semibold">
                {featuredStory ? featuredStory.title : "None selected"}
              </p>
            </div>
            <Link
              href="/ink-room/stories"
              className="text-xs font-sans text-brand-coral font-semibold hover:underline"
            >
              Configure →
            </Link>
          </div>
        </div>
      </div>

      {/* Content Requiring Attention (Section 13) */}
      <div className="bg-brand-parchment rounded-2xl p-6 sm:p-8 border border-brand-gold/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-brand-forest font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-coral" />
            <span>Content Requiring Attention ({itemsNeedingAttention.length})</span>
          </h2>
          <span className="text-xs font-sans text-brand-forest/60">Automated Editorial Health Check</span>
        </div>

        {itemsNeedingAttention.length > 0 ? (
          <div className="divide-y divide-brand-gold/20">
            {itemsNeedingAttention.slice(0, 5).map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="font-display font-semibold text-brand-forest mr-2">
                    {item.title}
                  </span>
                  <span className="text-xs text-brand-coral font-sans">({item.issue})</span>
                </div>
                <Link
                  href={
                    item.type === "poem"
                      ? `/ink-room/poems/editor?id=${item.id}`
                      : item.type === "media"
                      ? `/ink-room/media`
                      : `/ink-room/stories/editor?id=${item.id}`
                  }
                  className="text-xs font-sans font-semibold text-brand-coral hover:underline"
                >
                  Review →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-reading italic text-emerald-700">
            All published pieces, media alt texts, and metadata are complete and healthy.
          </p>
        )}
      </div>

      {/* Recently Edited Works */}
      <div className="bg-brand-parchment rounded-2xl p-6 sm:p-8 border border-brand-gold/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-brand-forest font-bold">Recently Edited Work</h2>
          <Link
            href="/ink-room/poems"
            className="text-xs font-sans font-semibold text-brand-coral hover:underline"
          >
            View all works →
          </Link>
        </div>

        <div className="divide-y divide-brand-gold/20">
          {content.slice(0, 6).map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base text-brand-ink">
                    {item.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider bg-brand-cream border border-brand-gold/30 text-brand-coral font-semibold">
                    {item.content_type}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider ${
                      item.status === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "scheduled"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <span className="text-xs font-sans text-brand-forest/60">
                  Version {item.version} · Updated {new Date(item.updated_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={
                    item.content_type === "poem"
                      ? `/ink-room/poems/editor?id=${item.id}`
                      : `/ink-room/stories/editor?id=${item.id}`
                  }
                  className="px-3 py-1 rounded-lg border border-brand-forest/30 text-brand-forest hover:bg-brand-forest hover:text-brand-cream text-xs font-sans font-semibold transition-all"
                >
                  Edit
                </Link>
                {item.status === "published" && (
                  <Link
                    href={item.content_type === "poem" ? `/poems/${item.slug}` : `/stories/${item.slug}`}
                    target="_blank"
                    className="p-1 text-brand-forest/50 hover:text-brand-coral transition-colors"
                    title="View Public"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
