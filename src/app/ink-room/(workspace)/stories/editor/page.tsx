"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ContentItem, Collection, ContentType, DramaBlock } from "@/lib/types";
import {
  BookOpen,
  Save,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  Smartphone,
  Monitor,
  CheckCircle2,
  Loader2,
  Theater,
} from "lucide-react";
import { ImageUploadField } from "@/components/ImageUploadField";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import Link from "next/link";

function StoryEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [contentType, setContentType] = useState<ContentType>("short_drama");
  const [authorCredit, setAuthorCredit] = useState("Linda Emefa Daniels");
  const [rawContent, setRawContent] = useState("");
  const [structuredBlocks, setStructuredBlocks] = useState<DramaBlock[]>([
    { type: "scene_heading", text: "SCENE I: THE WRITING ROOM — DUSK" },
    { type: "stage_direction", text: "Rain beats against the tall window." },
    { type: "character", text: "MARA" },
    { type: "dialogue", text: "You always leave the door ajar." },
  ]);
  const [readingTime, setReadingTime] = useState(3);
  const [tagsInput, setTagsInput] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoDescription, setSeoDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const [saveState, setSaveState] = useState<"Saved" | "Saving..." | "Unsaved changes" | "Save failed">("Saved");
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [collections, setCollections] = useState<Collection[]>([]);

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
            const s: ContentItem = data.item;
            setTitle(s.title);
            setSubtitle(s.subtitle || "");
            setContentType(s.content_type);
            setAuthorCredit(s.author_credit);
            setRawContent(s.raw_content || "");
            if (s.structured_body && s.structured_body.length > 0) {
              setStructuredBlocks(s.structured_body);
            }
            setReadingTime(s.reading_time_minutes || 3);
            setTagsInput((s.tags || []).join(", "));
            setCollectionId(s.collection_id || "");
            setStatus(s.status === "archived" ? "draft" : s.status);
            setIsFeatured(s.is_homepage_featured);
            setSeoDescription(s.seo_description || "");
            setCoverImageUrl(s.cover_image_url || "");
            setSaveState("Saved");
          }
        });
    }
  }, [editId]);

  // Add drama block
  const addBlock = (type: DramaBlock["type"]) => {
    setStructuredBlocks([
      ...structuredBlocks,
      {
        type,
        text: type === "character" ? "CHARACTER NAME" : type === "stage_direction" ? "Action / emotion" : "",
      },
    ]);
  };

  const updateBlock = (index: number, text: string) => {
    const copy = [...structuredBlocks];
    copy[index].text = text;
    setStructuredBlocks(copy);
  };

  const removeBlock = (index: number) => {
    setStructuredBlocks(structuredBlocks.filter((_, i) => i !== index));
  };

  const handleSave = async (publishStatus: "draft" | "published" | "scheduled") => {
    if (!title) return;
    setSaveState("Saving...");

    try {
      const excerpt =
        contentType === "short_drama"
          ? structuredBlocks
              .filter((b) => b.type === "dialogue" || b.type === "paragraph")
              .map((b) => b.text)
              .join(" ")
              .slice(0, 160)
          : rawContent.slice(0, 160);

      const payload: Partial<ContentItem> = {
        id: editId || undefined,
        title,
        subtitle,
        content_type: contentType,
        raw_content: rawContent,
        structured_body: contentType === "short_drama" ? structuredBlocks : undefined,
        excerpt,
        author_credit: authorCredit,
        alignment: "left",
        reading_time_minutes: readingTime,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        collection_id: collectionId || undefined,
        cover_image_url: coverImageUrl || undefined,
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
        router.replace(`/ink-room/stories/editor?id=${data.item.id}`);
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
            href="/ink-room/stories"
            className="p-2 rounded-lg border border-brand-gold/40 text-brand-forest hover:bg-brand-parchment transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-forest">
              {contentType === "short_drama" ? "Short Drama Studio" : "Story & Prose Editor"}
            </h1>
            <div className="flex items-center gap-2 text-xs font-sans">
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  saveState === "Saved" ? "text-emerald-700" : "text-brand-gold"
                }`}
              >
                {saveState === "Saving..." && <Loader2 className="w-3 h-3 animate-spin" />}
                {saveState === "Saved" && <CheckCircle2 className="w-3 h-3" />}
                <span>{saveState}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-2 rounded-xl text-xs font-sans font-semibold tracking-wider uppercase border border-brand-gold/40 bg-brand-parchment text-brand-forest hover:bg-brand-cream transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreview ? "Hide Preview" : "Preview"}</span>
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
            <span>Publish Work</span>
          </button>

          {editId && (
            <DeleteActionButton
              id={editId}
              title={title || "Untitled Piece"}
              itemType={contentType === "short_drama" ? "drama" : "story"}
              variant="button"
              label="Delete"
              redirectAfterDelete="/ink-room/stories"
            />
          )}
        </div>
      </div>

      {/* Editor Grid */}
      <div className={`grid grid-cols-1 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-8`}>
        <div className={`${showPreview ? "lg:col-span-1" : "lg:col-span-2"} space-y-6`}>
          {/* Format selector */}
          <div className="bg-brand-parchment p-4 rounded-xl border border-brand-gold/30 flex items-center gap-4">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
              Work Form:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setContentType("short_drama")}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all ${
                  contentType === "short_drama"
                    ? "bg-brand-forest text-brand-cream"
                    : "bg-brand-cream text-brand-forest hover:bg-brand-parchment"
                }`}
              >
                <Theater className="w-3.5 h-3.5 text-brand-coral" />
                <span>Short Drama</span>
              </button>
              <button
                type="button"
                onClick={() => setContentType("story")}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all ${
                  contentType === "story"
                    ? "bg-brand-forest text-brand-cream"
                    : "bg-brand-cream text-brand-forest hover:bg-brand-parchment"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-coral" />
                <span>Narrative Prose / Essay</span>
              </button>
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of story or drama..."
                className="w-full px-4 py-3 rounded-xl bg-brand-parchment text-brand-ink font-display text-2xl font-bold border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Subtitle / Setting
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="E.g., A chamber piece in one act · Dusk"
                className="w-full px-4 py-2.5 rounded-xl bg-brand-parchment text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
              />
            </div>
          </div>

          {/* DEDICATED SHORT DRAMA BUILDER */}
          {contentType === "short_drama" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-brand-gold/20">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                  Drama Flow & Dialogue Blocks
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => addBlock("scene_heading")}
                    className="px-2.5 py-1 rounded bg-brand-forest text-brand-cream text-[10px] uppercase font-bold"
                  >
                    + Scene
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("character")}
                    className="px-2.5 py-1 rounded bg-brand-coral text-brand-cream text-[10px] uppercase font-bold"
                  >
                    + Character
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("stage_direction")}
                    className="px-2.5 py-1 rounded bg-brand-gold text-brand-forest text-[10px] uppercase font-bold"
                  >
                    + Direction
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("dialogue")}
                    className="px-2.5 py-1 rounded border border-brand-forest/30 text-brand-forest text-[10px] uppercase font-bold"
                  >
                    + Dialogue
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {structuredBlocks.map((block, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-brand-parchment border border-brand-gold/30 flex items-start gap-3"
                  >
                    <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-brand-coral w-24 shrink-0 pt-2">
                      {block.type.replace("_", " ")}:
                    </span>
                    <input
                      type="text"
                      value={block.text || ""}
                      onChange={(e) => updateBlock(idx, e.target.value)}
                      placeholder={`Enter ${block.type}...`}
                      className={`flex-1 px-3 py-1.5 rounded-lg bg-brand-cream text-brand-ink text-sm border border-brand-gold/30 focus:outline-none focus:ring-1 focus:ring-brand-coral ${
                        block.type === "character"
                          ? "font-bold text-brand-forest uppercase tracking-wider"
                          : block.type === "stage_direction"
                          ? "italic text-brand-forest/80"
                          : "font-reading"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeBlock(idx)}
                      className="p-1.5 text-brand-forest/40 hover:text-brand-coral transition-colors"
                      title="Remove block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-2">
                Narrative Prose Text
              </label>
              <textarea
                rows={16}
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="Write your long-form story or essay here..."
                className="w-full p-6 rounded-2xl bg-brand-parchment text-brand-ink font-reading text-lg border-2 border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Right Settings Drawer */}
        <div className="space-y-6">
          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30">
            <ImageUploadField
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              label="Representative Artwork"
              helperText="Upload or select artwork for this story or drama"
            />
          </div>

          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-4">
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
              Collection Assignment
            </label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
            >
              <option value="">(Uncollected)</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 space-y-3">
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
              Author Credit
            </label>
            <input
              type="text"
              value={authorCredit}
              onChange={(e) => setAuthorCredit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/40"
            />
          </div>

          <div className="bg-brand-parchment p-6 rounded-2xl border border-brand-gold/30 flex items-center justify-between">
            <div>
              <span className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                Homepage Feature
              </span>
              <span className="text-[11px] font-sans text-brand-forest/60">
                Lead story highlight
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
  );
}

export default function StoryEditorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-sans text-sm">Loading Story Studio...</div>}>
      <StoryEditorContent />
    </Suspense>
  );
}
