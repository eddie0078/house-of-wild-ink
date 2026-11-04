"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ContentItem, Collection } from "@/lib/types";
import { ImageUploadField } from "@/components/ImageUploadField";
import { SoundwaveIcon } from "@/components/SoundwaveIcon";
import {
  Headphones,
  Save,
  Play,
  Clock,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";

function AudioStoryEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  // State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [briefSynopsis, setBriefSynopsis] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [audioDuration, setAudioDuration] = useState("8:45 min");
  const [narratorCredit, setNarratorCredit] = useState("Linda Emefa Daniels");
  const [authorCredit, setAuthorCredit] = useState("Linda Emefa Daniels");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState("Audio Story, Spoken Word");
  const [authorNote, setAuthorNote] = useState("");

  const [saveState, setSaveState] = useState<"Saved" | "Saving..." | "Unsaved changes" | "Save failed">("Saved");
  const [collections, setCollections] = useState<Collection[]>([]);

  // Load existing audio piece
  useEffect(() => {
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => setCollections(data.collections || []))
      .catch(() => {});

    if (editId) {
      fetch(`/api/content/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.item) {
            const a: ContentItem = data.item;
            setTitle(a.title);
            setSubtitle(a.subtitle || "");
            setBriefSynopsis(a.excerpt || "");
            setRawContent(a.raw_content || "");
            setYoutubeUrl(a.youtube_url || "");
            setAudioDuration(a.audio_duration || "8:45 min");
            setNarratorCredit(a.narrator_credit || "Linda Emefa Daniels");
            setAuthorCredit(a.author_credit || "Linda Emefa Daniels");
            setCoverImageUrl(a.cover_image_url || "");
            setCollectionId(a.collection_id || "");
            setStatus(a.status === "archived" ? "draft" : a.status);
            setIsFeatured(a.is_homepage_featured);
            setTagsInput((a.tags || []).join(", "));
            setAuthorNote(a.author_note || "");
            setSaveState("Saved");
          }
        });
    }
  }, [editId]);

  const handleSave = async (publishStatus: "draft" | "published" | "scheduled") => {
    if (!title) return;
    setSaveState("Saving...");

    try {
      const payload: Partial<ContentItem> = {
        id: editId || undefined,
        title,
        subtitle,
        content_type: "audio_story",
        raw_content: rawContent || briefSynopsis,
        excerpt: briefSynopsis || rawContent.slice(0, 160),
        youtube_url: youtubeUrl,
        audio_duration: audioDuration,
        narrator_credit: narratorCredit,
        author_credit: authorCredit,
        cover_image_url: coverImageUrl,
        collection_id: collectionId || undefined,
        alignment: "left",
        reading_time_minutes: 3,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        author_note: authorNote || undefined,
        status: publishStatus,
        is_homepage_featured: isFeatured,
        seo_description: briefSynopsis || `An audio story by ${authorCredit}`,
        published_at: publishStatus === "published" ? new Date().toISOString() : undefined,
      };

      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setSaveState("Saved");

      if (!editId && data.item?.id) {
        router.replace(`/ink-room/audio/editor?id=${data.item.id}`);
      }
    } catch {
      setSaveState("Save failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/30">
        <div className="flex items-center gap-3">
          <Link
            href="/ink-room/audio"
            className="p-2 rounded-xl bg-brand-cream hover:bg-brand-parchment text-brand-forest border border-brand-gold/30 transition-colors"
            title="Back to Audio Stories"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-brand-coral" />
              <h1 className="font-display font-bold text-xl text-brand-forest">
                {editId ? "Edit Audio Story" : "New Audio Story"}
              </h1>
            </div>
            <span className="text-[11px] font-sans text-brand-forest/60">
              {saveState === "Saved" && (
                <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Saved to archive
                </span>
              )}
              {saveState === "Saving..." && (
                <span className="text-brand-coral flex items-center gap-1 font-semibold">
                  <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                </span>
              )}
              {saveState === "Unsaved changes" && (
                <span className="text-amber-700 font-semibold">• Unsaved changes</span>
              )}
              {saveState === "Save failed" && (
                <span className="text-red-700 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3 h-3" /> Save failed
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave("draft")}
            className="px-4 py-2 rounded-full border border-brand-forest/30 text-brand-forest hover:bg-brand-parchment text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            className="px-5 py-2 rounded-full bg-brand-coral hover:bg-brand-coral/90 text-brand-cream text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Audio Story</span>
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Subtitle */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Audio Story Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The First Garden"
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream text-brand-ink font-display text-2xl font-bold border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Subtitle / Poetic Catchline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. An audio reflection on remembrance and quiet faith"
                className="w-full px-4 py-2 rounded-xl bg-brand-cream text-brand-ink font-reading italic text-base border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
              />
            </div>
          </div>

          {/* YouTube Link Integration */}
          <div className="bg-brand-parchment p-6 rounded-2xl border-2 border-brand-gold/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-sans font-bold uppercase tracking-wider text-brand-forest flex items-center gap-1.5">
                <Play className="w-4 h-4 fill-brand-coral text-brand-coral" />
                <span>YouTube Audio Link</span>
              </label>
              <span className="text-[11px] text-brand-coral font-serif">Direct listener trigger</span>
            </div>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              className="w-full px-4 py-2.5 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none font-mono"
            />
            <p className="text-xs text-brand-forest/70">
              When readers click "Listen on YouTube", this exact link opens in a secure new tab.
            </p>
          </div>

          {/* Brief Description & Synopsis */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-2">
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
              Brief Description & Synopsis
            </label>
            <textarea
              rows={3}
              value={briefSynopsis}
              onChange={(e) => setBriefSynopsis(e.target.value)}
              placeholder="A brief editorial teaser explaining what this audio reading covers..."
              className="w-full p-4 rounded-xl bg-brand-cream text-brand-ink font-reading text-base border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
            />
          </div>

          {/* Companion Text & Transcript */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-2">
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
              Companion Written Notes / Transcript
            </label>
            <textarea
              rows={8}
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              placeholder="Companion writing, poetic transcript, or author's reflection accompanying the audio piece..."
              className="w-full p-4 rounded-xl bg-brand-cream text-brand-ink font-reading text-lg border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: Metadata & Artwork */}
        <div className="space-y-6">
          {/* Representative Artwork In-Editor Upload */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30">
            <ImageUploadField
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              label="Representative Artwork"
              helperText="Upload or choose a picture that represents this audio story"
            />
          </div>

          {/* Audio Duration & Narrator */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Audio Duration
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-brand-coral absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={audioDuration}
                  onChange={(e) => setAudioDuration(e.target.value)}
                  placeholder="e.g. 8:45 min or 12:30 min"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Narrator Credit
              </label>
              <input
                type="text"
                value={narratorCredit}
                onChange={(e) => setNarratorCredit(e.target.value)}
                placeholder="Linda Emefa Daniels"
                className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Author Attribution
              </label>
              <input
                type="text"
                value={authorCredit}
                onChange={(e) => setAuthorCredit(e.target.value)}
                placeholder="Linda Emefa Daniels"
                className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
              />
            </div>
          </div>

          {/* Collection & Homepage Feature */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Collection
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40"
              >
                <option value="">(Uncollected)</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-brand-gold/20">
              <div>
                <span className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                  Feature on Homepage
                </span>
                <span className="text-[10px] text-brand-forest/60">
                  Highlight in the homepage Audio Stories grid
                </span>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 accent-brand-coral rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AudioStoryEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-brand-forest/60">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-coral" />
          <p className="font-sans text-xs">Opening Audio Studio...</p>
        </div>
      }
    >
      <AudioStoryEditorContent />
    </Suspense>
  );
}
