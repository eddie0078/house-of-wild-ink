"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ContentItem, Collection, ContentType } from "@/lib/types";
import { ImageUploadField } from "@/components/ImageUploadField";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import {
  FileText,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
  Eye,
  Monitor,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

function EssayEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  // State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [contentType, setContentType] = useState<"essay" | "article" | "reflection">("essay");
  const [rawContent, setRawContent] = useState("");
  const [authorCredit, setAuthorCredit] = useState("L.E. Daniels | DEFFA");
  const [readingTime, setReadingTime] = useState(3);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [tagsInput, setTagsInput] = useState("Essay, Reflection, Voice");
  const [authorNote, setAuthorNote] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoDescription, setSeoDescription] = useState("");

  const [saveState, setSaveState] = useState<"Saved" | "Saving..." | "Unsaved changes" | "Save failed">("Saved");
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [collections, setCollections] = useState<Collection[]>([]);

  // Load existing essay or reflection
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
            const e: ContentItem = data.item;
            setTitle(e.title);
            setSubtitle(e.subtitle || "");
            setContentType(
              ["essay", "article", "reflection"].includes(e.content_type)
                ? (e.content_type as any)
                : "essay"
            );
            setRawContent(e.raw_content || "");
            setAuthorCredit(e.author_credit || "L.E. Daniels | DEFFA");
            setReadingTime(e.reading_time_minutes || 3);
            setCoverImageUrl(e.cover_image_url || "");
            setCollectionId(e.collection_id || "");
            setTagsInput((e.tags || []).join(", "));
            setAuthorNote(e.author_note || "");
            setStatus(e.status === "archived" ? "draft" : e.status);
            setIsFeatured(e.is_homepage_featured);
            setSeoDescription(e.seo_description || "");
            setSaveState("Saved");
          }
        });
    }
  }, [editId]);

  // Auto-calculate reading time based on word count
  useEffect(() => {
    const words = rawContent.trim().split(/\s+/).filter(Boolean).length;
    const calc = Math.max(1, Math.ceil(words / 200));
    setReadingTime(calc);
  }, [rawContent]);

  const handleSave = async (publishStatus: "draft" | "published" | "scheduled") => {
    if (!title) return;
    setSaveState("Saving...");

    try {
      const excerpt = rawContent.slice(0, 180);
      const payload: Partial<ContentItem> = {
        id: editId || undefined,
        title,
        subtitle,
        content_type: contentType,
        raw_content: rawContent,
        excerpt,
        author_credit: authorCredit,
        cover_image_url: coverImageUrl || undefined,
        collection_id: collectionId || undefined,
        alignment: "left",
        reading_time_minutes: readingTime,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        author_note: authorNote || undefined,
        status: publishStatus,
        is_homepage_featured: isFeatured,
        seo_description: seoDescription || excerpt,
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
        router.replace(`/ink-room/essays/editor?id=${data.item.id}`);
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
            href="/ink-room/essays"
            className="p-2 rounded-xl bg-brand-cream hover:bg-brand-parchment text-brand-forest border border-brand-gold/30 transition-colors"
            title="Back to Essays"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-coral" />
              <h1 className="font-display font-bold text-xl text-brand-forest">
                {editId ? "Edit Essay / Article" : "Write New Essay / Article"}
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-2 rounded-xl text-xs font-sans font-semibold tracking-wider uppercase border transition-all flex items-center gap-1.5 cursor-pointer ${
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
            className="px-3.5 py-2 rounded-xl border border-brand-forest/30 text-brand-forest hover:bg-brand-parchment text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            className="px-4 py-2 rounded-xl bg-brand-coral hover:bg-brand-coral/90 text-brand-cream text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Essay</span>
          </button>

          {editId && (
            <DeleteActionButton
              id={editId}
              title={title || "Untitled Essay"}
              itemType="essay"
              variant="button"
              label="Delete"
              redirectAfterDelete="/ink-room/essays"
            />
          )}
        </div>
      </div>

      {/* Editor Grid */}
      <div className={`grid grid-cols-1 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-8`}>
        {/* Left Column: Form Fields & Writing Canvas */}
        <div className={`${showPreview ? "lg:col-span-1" : "lg:col-span-2"} space-y-6`}>
          {/* Format Selector */}
          <div className="flex items-center gap-3 bg-brand-parchment p-2 rounded-xl border border-brand-gold/30">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest px-3">
              Format:
            </span>
            {(["essay", "article", "reflection"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setContentType(fmt)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  contentType === fmt
                    ? "bg-brand-forest text-brand-cream shadow-xs"
                    : "text-brand-forest/80 hover:bg-brand-cream"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Title & Subtitle */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. On Stories That Refuse to Stay Quiet"
                className="w-full px-4 py-2.5 rounded-xl bg-brand-cream text-brand-ink font-display text-2xl font-bold border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. An introductory essay on voice, faith, and shared humanity"
                className="w-full px-4 py-2 rounded-xl bg-brand-cream text-brand-ink font-reading italic text-base border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
              />
            </div>
          </div>

          {/* Long-form Writing Canvas */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                Long-form Essay Canvas (Separate paragraphs with double enter)
              </label>
              <span className="text-[11px] text-brand-coral font-serif">
                Automatic classical drop cap on first letter
              </span>
            </div>
            <textarea
              rows={18}
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              placeholder="Write your essay, critical reflection, or article here..."
              className="w-full p-6 rounded-xl bg-brand-cream text-brand-ink font-reading text-lg border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none leading-relaxed"
            />
          </div>

          {/* Author's Note */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-2">
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
              Author’s Note / Addendum
            </label>
            <input
              type="text"
              value={authorNote}
              onChange={(e) => setAuthorNote(e.target.value)}
              placeholder="e.g. Originally presented as a keynote reflection in November 2026."
              className="w-full px-4 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column: Metadata, Cover Artwork & Settings */}
        <div className="space-y-6">
          {/* Representative Artwork In-Editor Upload */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30">
            <ImageUploadField
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              label="Representative Artwork"
              helperText="Upload or choose artwork to accompany this essay"
            />
          </div>

          {/* Reading Time & Author Attribution */}
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Reading Time
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-coral" />
                <span className="text-sm font-semibold text-brand-forest">{readingTime} min read</span>
                <span className="text-xs text-brand-forest/60">(calculated automatically)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Author Attribution
              </label>
              <select
                value={authorCredit}
                onChange={(e) => setAuthorCredit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40 focus:ring-2 focus:ring-brand-coral focus:outline-none"
              >
                <option value="L.E. Daniels | DEFFA">L.E. Daniels | DEFFA</option>
                <option value="Linda Emefa Daniels">Linda Emefa Daniels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Tags / Themes
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Faith, Voice, Society, Humanity"
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
                  Highlight as a featured essay
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

        {/* Live Device Preview Pane */}
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
                  className={`p-1.5 rounded cursor-pointer ${
                    previewDevice === "desktop" ? "bg-brand-forest text-brand-cream" : "text-brand-forest/60"
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded cursor-pointer ${
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
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-brand-coral">
                  {contentType} · {readingTime} min read
                </span>
                <h3 className="font-display text-2xl font-bold text-brand-ink mt-1">
                  {title || "Untitled Essay"}
                </h3>
                {subtitle && (
                  <p className="font-reading italic text-xs text-brand-forest/70 mt-1">
                    {subtitle}
                  </p>
                )}
                <p className="font-sans text-[10px] text-brand-forest/60 uppercase tracking-widest mt-2">
                  By {authorCredit}
                </p>
              </div>

              {coverImageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden border border-brand-gold/30">
                  <img
                    src={coverImageUrl}
                    alt={title}
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}

              <div className="font-reading text-sm text-[#182C25] leading-relaxed space-y-3">
                {rawContent
                  ? rawContent
                      .split("\n\n")
                      .filter(Boolean)
                      .map((p, idx) => (
                        <p
                          key={idx}
                          className={idx === 0 ? "drop-cap leading-relaxed" : "leading-relaxed"}
                        >
                          {p}
                        </p>
                      ))
                  : "Your essay or article prose will render here with elegant drop-caps and reading typography..."}
              </div>

              {authorNote && (
                <div className="mt-6 pt-4 border-t border-brand-gold/20 font-reading italic text-xs text-brand-forest/80">
                  Author’s Note: {authorNote}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EssayEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-brand-forest/60">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-coral" />
          <p className="font-sans text-xs">Opening Essay Studio...</p>
        </div>
      }
    >
      <EssayEditorContent />
    </Suspense>
  );
}
