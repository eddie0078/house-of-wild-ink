"use client";

import React, { useState, useEffect } from "react";
import { Collection, ContentItem } from "@/lib/types";
import { Layers, Plus, ArrowUp, ArrowDown, Save, Eye, Sparkles, Check, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { DeleteActionButton } from "@/components/DeleteActionButton";

export default function InkRoomCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedColl, setSelectedColl] = useState<Collection | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [curatorNote, setCuratorNote] = useState("");
  const [orderedItemIds, setOrderedItemIds] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [status, setStatus] = useState<"draft" | "published">("published");

  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState("");

  const loadData = () => {
    fetch("/api/collections?all=true")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data.collections || []);
        if (data.collections?.length > 0 && !selectedColl) {
          selectCollection(data.collections[0]);
        }
      });

    fetch("/api/content?status=published")
      .then((res) => res.json())
      .then((data) => setContentItems(data.items || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectCollection = (c: Collection) => {
    setSelectedColl(c);
    setIsCreating(false);
    setTitle(c.title);
    setSubtitle(c.subtitle || "");
    setDescription(c.description);
    setCuratorNote(c.curator_note || "");
    setOrderedItemIds(c.item_ids || []);
    setIsFeatured(c.is_featured);
    setIsPublic(c.is_public);
    setStatus(c.status);
    setSuccessNotice("");
  };

  const handleCreateNew = () => {
    setSelectedColl(null);
    setIsCreating(true);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setCuratorNote("");
    setOrderedItemIds([]);
    setIsFeatured(false);
    setIsPublic(true);
    setStatus("published");
    setSuccessNotice("");
  };

  // Keyboard Accessible Move Up / Move Down Controls (Section 7)
  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedItemIds.length) return;

    const copy = [...orderedItemIds];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setOrderedItemIds(copy);
  };

  const toggleIncludeItem = (id: string) => {
    if (orderedItemIds.includes(id)) {
      setOrderedItemIds(orderedItemIds.filter((itemId) => itemId !== id));
    } else {
      setOrderedItemIds([...orderedItemIds, id]);
    }
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setSaving(true);
    setSuccessNotice("");

    try {
      const payload: Partial<Collection> = {
        id: selectedColl?.id,
        title,
        subtitle,
        description,
        curator_note: curatorNote,
        item_ids: orderedItemIds,
        is_featured: isFeatured,
        is_public: isPublic,
        status,
      };

      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setSaving(false);
      setSuccessNotice("Collection and item sequence saved successfully.");
      loadData();
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/30">
        <div>
          <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
            Curation
          </span>
          <h1 className="font-display text-3xl font-bold text-brand-forest">
            Collections & Volumes Curator
          </h1>
          <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
            Organize works into thematic volumes with custom reading sequences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-brand-coral text-brand-cream text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-coral/90 transition-all inline-flex items-center gap-2 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Collections List */}
        <div className="space-y-3">
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest/70 block">
            Existing Collections ({collections.length})
          </span>
          <div className="space-y-2">
            {collections.map((c) => (
              <div
                key={c.id}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  selectedColl?.id === c.id
                    ? "bg-brand-parchment border-brand-gold shadow-xs"
                    : "bg-brand-cream border-brand-gold/20 hover:border-brand-gold/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectCollection(c)}
                  className="flex-1 text-left min-w-0 mr-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-display text-base font-bold text-brand-forest truncate">{c.title}</h4>
                    <span className="text-[10px] font-sans uppercase font-bold text-brand-coral shrink-0 ml-2">
                      {c.item_ids.length} works
                    </span>
                  </div>
                  {c.subtitle && (
                    <p className="font-sans text-xs text-brand-forest/70 italic line-clamp-1">{c.subtitle}</p>
                  )}
                </button>

                <DeleteActionButton
                  id={c.id}
                  title={c.title}
                  itemType="collection"
                  endpoint="/api/collections"
                  variant="icon"
                  size="sm"
                  onDeleted={() => {
                    if (selectedColl?.id === c.id) {
                      setSelectedColl(null);
                      handleCreateNew();
                    }
                    loadData();
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Editor & Work Reordering Panel */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSaveCollection}
            className="bg-brand-parchment p-6 sm:p-8 rounded-2xl border border-brand-gold/30 space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
              <h3 className="font-display text-xl font-bold text-brand-forest">
                {isCreating ? "New Collection Details" : `Editing: ${title}`}
              </h3>
              {successNotice && (
                <span className="text-xs font-sans font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{successNotice}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                  Collection Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Earth and Ink"
                  className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
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
                  placeholder="E.g., Reflections on humanity and quiet endurance"
                  className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 focus:outline-none focus:ring-2 focus:ring-brand-coral"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of this collection..."
                className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 font-reading"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                Curator’s Note
              </label>
              <textarea
                rows={2}
                value={curatorNote}
                onChange={(e) => setCuratorNote(e.target.value)}
                placeholder="Linda’s note on this collection..."
                className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-sm border border-brand-gold/40 font-reading italic"
              />
            </div>

            {/* ORDERED WORKS WITH KEYBOARD MOVE UP / MOVE DOWN (Section 7) */}
            <div className="pt-4 border-t border-brand-gold/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                  Included Works & Sequence Order ({orderedItemIds.length})
                </span>
                <span className="text-[11px] font-sans text-brand-forest/60">
                  Use Up/Down controls to set reading order
                </span>
              </div>

              {orderedItemIds.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {orderedItemIds.map((itemId, idx) => {
                    const item = contentItems.find((i) => i.id === itemId);
                    if (!item) return null;

                    return (
                      <div
                        key={itemId}
                        className="p-3 rounded-xl bg-brand-cream border border-brand-gold/30 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-display font-bold text-sm text-brand-forest/50 w-5">
                            {idx + 1}.
                          </span>
                          <span className="font-display text-sm font-bold text-brand-forest">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-sans uppercase text-brand-coral">
                            ({item.content_type})
                          </span>
                        </div>

                        {/* Move Up / Move Down buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveItem(idx, "up")}
                            className="p-1 rounded hover:bg-brand-parchment text-brand-forest disabled:opacity-30"
                            title="Move Up in Sequence"
                            aria-label={`Move ${item.title} up`}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === orderedItemIds.length - 1}
                            onClick={() => moveItem(idx, "down")}
                            className="p-1 rounded hover:bg-brand-parchment text-brand-forest disabled:opacity-30"
                            title="Move Down in Sequence"
                            aria-label={`Move ${item.title} down`}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleIncludeItem(itemId)}
                            className="ml-2 text-xs font-sans text-brand-coral hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs font-reading italic text-brand-forest/60 mb-4">
                  No works assigned yet. Check items below to include them.
                </p>
              )}

              {/* Works Selector Drawer */}
              <div className="p-4 rounded-xl bg-brand-cream/60 border border-brand-gold/20">
                <span className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-brand-forest/70 mb-2">
                  Add Works to Collection
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {contentItems.map((item) => {
                    const isIncluded = orderedItemIds.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isIncluded
                            ? "bg-brand-forest text-brand-cream border-brand-forest font-semibold"
                            : "bg-brand-parchment text-brand-forest border-brand-gold/30 hover:bg-brand-cream"
                        }`}
                      >
                        <span className="truncate mr-2">
                          {item.title} ({item.content_type})
                        </span>
                        <input
                          type="checkbox"
                          checked={isIncluded}
                          onChange={() => toggleIncludeItem(item.id)}
                          className="sr-only"
                        />
                        <span>{isIncluded ? "✓" : "+"}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-xs font-sans text-brand-forest cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-brand-coral rounded"
                />
                <span>Feature on Homepage</span>
              </label>

              <div className="flex items-center gap-3">
                {selectedColl && !isCreating && (
                  <DeleteActionButton
                    id={selectedColl.id}
                    title={selectedColl.title}
                    itemType="collection"
                    endpoint="/api/collections"
                    variant="button"
                    label="Delete Collection"
                    onDeleted={() => {
                      setSelectedColl(null);
                      handleCreateNew();
                      loadData();
                    }}
                  />
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-forest text-brand-cream text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-forest/90 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-brand-gold-light" />
                      <span>Save Collection</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
