"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ContentItem, Collection } from "@/lib/types";
import {
  Feather,
  Save,
  Clock,
  Eye,
  History,
  Sparkles,
  ArrowLeft,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { ImageUploadField } from "@/components/ImageUploadField";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import Link from "next/link";

function PoemEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  // State
  const [title, setTitle] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [authorCredit, setAuthorCredit] = useState("L.E. Daniels | DEFFA");
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  const [readingTime, setReadingTime] = useState(1);
  const [tagsInput, setTagsInput] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [authorNote, setAuthorNote] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoDescription, setSeoDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // Autosave and Preview states
  const [saveState, setSaveState] = useState<"Saved" | "Saving..." | "Unsaved changes" | "Save failed">("Saved");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [showPreview, setShowPreview] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [suggestedCollection, setSuggestedCollection] = useState<{ id: string; title: string; reason: string } | null>(null);

  // Load existing item or initial state
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
            const p: ContentItem = data.item;
            setTitle(p.title);
            setRawContent(p.raw_content);
            setAuthorCredit(p.author_credit);
            setAlignment(p.alignment || "left");
            setReadingTime(p.reading_time_minutes || 1);
            setTagsInput((p.tags || []).join(", "));
            setCollectionId(p.collection_id || "");
            setAuthorNote(p.author_note || "");
            setStatus(p.status === "archived" ? "draft" : p.status);
            setIsFeatured(p.is_homepage_featured);
            setSeoDescription(p.seo_description || "");
            setCoverImageUrl(p.cover_image_url || "");
            setSaveState("Saved");
          }
        });
    }
  }, [editId]);

  // Debounced Autosave
  useEffect(() => {
    if (!title && !rawContent) return;
    setSaveState("Unsaved changes");

    const timer = setTimeout(() => {
      handleSave(status);
    }, 3500);

    return () => clearTimeout(timer);
  }, [title, rawContent, alignment, authorCredit, collectionId, authorNote, tagsInput]);

  // AI Collection Suggestion trigger
  const handleAskSuggestion = async () => {
    try {
      const res = await fetch("/api/ai/suggest-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt: rawContent.slice(0, 160),
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
          contentType: "poem",
        }),
      });
      const data = await res.json();
      if (data.suggestedCollection) {
        setSuggestedCollection({
          id: data.suggestedCollection.collectionId,
          title: data.suggestedCollection.collectionTitle,
          reason: data.suggestedCollection.reason,
        });
      }
    } catch {}
  };

  const handleSave = async (publishStatus: "draft" | "published" | "scheduled") => {
    if (!title) return;
    setSaveState("Saving...");

    try {
      const payload: Partial<ContentItem> = {
        id: editId || undefined,
        title,
        content_type: "poem",
        raw_content: rawContent,
        excerpt: rawContent.slice(0, 160),
        author_credit: authorCredit,
        alignment,
        reading_time_minutes: readingTime,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        collection_id: collectionId || undefined,
        author_note: authorNote || undefined,
        cover_image_url: coverImageUrl || undefined,
        status: publishStatus,
        is_homepage_featured: isFeatured,
        seo_description: seoDescription || rawContent.slice(0, 150),
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
        router.replace(`/ink-room/poems/editor?id=${data.item.id}`);
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
            href="/ink-room/poems"
            className="p-2 rounded-lg border border-brand-gold/40 text-brand-forest hover:bg-brand-parchment transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-forest">
              {editId ? "Poem Editor" : "New Poem Creation"}
            </h1>
            <div className="flex items-center gap-2 text-xs font-sans">
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  saveState === "Saved"
                    ? "text-emerald-700"
                    : saveState === "Saving..."
                    ? "text-brand-gold"
                    : "text-brand-coral"
                }`}
              >
                {saveState === "Saving..." && <Loader2 className="w-3 h-3 animate-spin" />}
                {saveState === "Saved" && <CheckCircle2 className="w-3 h-3" />}
                <span>{saveState}</span>
              </span>
              <span className="text-brand-forest/40">·</span>
              <span className="text-brand-forest/60">Strict Whitespace Preservation Mode</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-2 rounded-xl text-xs font-sans font-semibold tracking-wider uppercase border transition-all flex items-center gap-1.5 ${
              showPreview
                ? "bg-brand-forest text-brand-cream border-brand-forest"
                : "bg-brand-parchment text-brand-forest border-brand-gold/40 hover:bg-brand-cream"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreview ? "Hide Preview" : "Live Preview"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave("draft")}
            className="px-3.5 py-2 rounded-xl border border-brand-forest/40 text-brand-forest hover:bg-brand-parchment text-xs font-sans font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-brand-coral" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave("published")}
            className="px-4 py-2 rounded-xl bg-brand-coral hover:bg-brand-coral/90 text-brand-cream text-xs font-sans font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>Publish Now</span>
          </button>

          {editId && (
            <DeleteActionButton
              id={editId}
              title={title || "Untitled Poem"}
              itemType="poem"
              variant="button"
              label="Delete"
              redirectAfterDelete="/ink-room/poems"
            />
          )}
        </div>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className={`grid grid-cols-1 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-8`}>
        {/* Main Form Fields */}
        <div className={`${showPreview ? "lg:col-span-1" : "lg:col-span-2"} space-y-6`}>
          {/* Poem Title */}
          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2">
              Poem Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Stones, Wild Branches, The Threshold..."
              className="w-full px-4 py-3 rounded-xl bg-brand-parchment text-brand-ink font-display text-2xl font-bold border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
            />
          </div>

          {/* Alignment Selector */}
          <div className="flex items-center gap-3 bg-brand-parchment p-3 rounded-xl border border-brand-gold/30">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70">
              Alignment:
            </span>
            <div className="flex gap-1.5">
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAlignment(a)}
                  className={`px-3 py-1 rounded text-xs font-sans uppercase tracking-wider transition-all ${
                    alignment === a
                      ? "bg-brand-forest text-brand-cream font-bold"
                      : "bg-brand-cream text-brand-forest hover:bg-brand-parchment"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-sans text-brand-forest/60 ml-auto hidden sm:inline">
              Tabs & Indents are strictly retained
            </span>
          </div>

          {/* DEDICATED POETRY TEXT CANVAS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                Poem Verses & Stanzas (Exact Whitespace) *
              </label>
              <span className="text-[11px] font-sans text-brand-forest/60">
                Line breaks, stanza spaces & indentation guaranteed
              </span>
            </div>
            <textarea
              rows={14}
              required
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              placeholder={`Enter verses here...\n\nEvery blank line is preserved.\n    Leading spaces and indentations remain exactly as typed.`}
              className={`w-full p-6 rounded-2xl bg-brand-parchment text-brand-ink font-reading text-lg border-2 border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral poetry-content ${
                alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"
              }`}
            />
          </div>

          {/* Author's Note */}
          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2">
              Author’s Note (Optional reflection displayed beneath the poem)
            </label>
            <textarea
              rows={3}
              value={authorNote}
              onChange={(e) => setAuthorNote(e.target.value)}
              placeholder="Context or dedication..."
              className="w-full px-4 py-3 rounded-xl bg-brand-parchment text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral font-reading italic"
            />
          </div>
        </div>

        {/* Right Sidebar: Collection, Metadata & AI Suggester */}
        <div className="space-y-6">
          {/* Collection Assignment & AI Suggestion */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                Assign to Collection
              </label>
              <button
                type="button"
                onClick={handleAskSuggestion}
                className="text-[11px] font-sans font-semibold text-brand-coral hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Suggest</span>
              </button>
            </div>

            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
            >
              <option value="">(Uncollected / Standalone Poem)</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            {/* AI Suggestion Card requiring Linda's confirmation (Section 7) */}
            {suggestedCollection && (
              <div className="p-3 rounded-xl bg-brand-cream border border-brand-gold text-xs space-y-2">
                <div className="flex items-center justify-between text-brand-coral font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Suggested: {suggestedCollection.title}</span>
                  </span>
                </div>
                <p className="text-brand-forest/75 text-[11px]">{suggestedCollection.reason}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCollectionId(suggestedCollection.id);
                      setSuggestedCollection(null);
                    }}
                    className="px-2.5 py-1 rounded bg-brand-forest text-brand-cream text-[10px] uppercase font-bold"
                  >
                    Accept Suggestion
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuggestedCollection(null)}
                    className="px-2.5 py-1 rounded border border-brand-forest/20 text-brand-forest text-[10px]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Representative Cover Artwork */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30">
            <ImageUploadField
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              label="Representative Artwork"
              helperText="Upload or choose artwork to accompany this poem"
            />
          </div>

          {/* Author Attribution Credit */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-3">
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
              Author Credit
            </label>
            <select
              value={authorCredit}
              onChange={(e) => setAuthorCredit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
            >
              <option value="L.E. Daniels | DEFFA">L.E. Daniels | DEFFA</option>
              <option value="Linda Emefa Daniels">Linda Emefa Daniels</option>
            </select>
          </div>

          {/* Themes & Tags */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-3">
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
              Themes / Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Faith, Stones, Threshold, Dawn"
              className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
            />
          </div>

          {/* Homepage Feature Toggle */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 flex items-center justify-between">
            <div>
              <span className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                Feature on Homepage
              </span>
              <span className="text-[11px] font-sans text-brand-forest/60">
                Display as the lead featured poem
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

        {/* Live Device Preview Pane (Section 18) */}
        {showPreview && (
          <div className="lg:col-span-1 bg-brand-parchment p-6 rounded-2xl border-2 border-brand-gold/50 shadow-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-gold/20">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand-forest flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-coral" />
                <span>Live Reader Preview</span>
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded ${
                    previewDevice === "desktop" ? "bg-brand-forest text-brand-cream" : "text-brand-forest/60"
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded ${
                    previewDevice === "mobile" ? "bg-brand-forest text-brand-cream" : "text-brand-forest/60"
                  }`}
                  title="Mobile Viewport Preview"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className={`mx-auto bg-brand-cream rounded-xl p-6 border border-brand-gold/30 shadow-inner overflow-x-auto ${
                previewDevice === "mobile" ? "max-w-[340px]" : "w-full"
              }`}
            >
              <div className="text-center mb-6">
                <h3 className="font-display text-2xl font-bold text-brand-ink">{title || "Untitled Poem"}</h3>
                <p className="font-sans text-[10px] text-brand-forest/70 uppercase tracking-widest mt-1">
                  {authorCredit}
                </p>
              </div>

              <div
                className={`poetry-content font-reading text-base leading-relaxed text-brand-ink ${
                  alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"
                }`}
              >
                {rawContent || "Verses will render here with exact line breaks and indentation..."}
              </div>

              {authorNote && (
                <div className="mt-6 pt-4 border-t border-brand-gold/20 font-reading italic text-xs text-brand-forest/80">
                  Note: {authorNote}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PoemEditorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-sans text-sm">Loading Poem Studio...</div>}>
      <PoemEditorContent />
    </Suspense>
  );
}
