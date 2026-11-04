"use client";

import React, { useState, useEffect, useRef } from "react";
import { MediaAsset } from "@/lib/types";
import {
  Image as ImageIcon,
  UploadCloud,
  Crosshair,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Loader2,
  Check,
} from "lucide-react";

export default function InkRoomMediaPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const [altText, setAltText] = useState("");
  const [credit, setCredit] = useState("");
  const [caption, setCaption] = useState("");
  const [focalPoint, setFocalPoint] = useState({ x: 0.5, y: 0.5 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewRef = useRef<HTMLDivElement>(null);

  const loadMedia = () => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => setMediaList(data.media || []));
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File exceeds 10 MB limit.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt_text", altText || file.name);
    formData.append("credit", credit || "Linda Emefa Daniels");
    formData.append("caption", caption);
    formData.append("focal_x", focalPoint.x.toString());
    formData.append("focal_y", focalPoint.y.toString());

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploading(false);
      setUploadSuccess("Image uploaded and registered in visual media catalog.");
      setAltText("");
      setCredit("");
      setCaption("");
      loadMedia();
    } catch (err: any) {
      setUploading(false);
      setUploadError(err.message || "Failed to upload image.");
    }
  };

  // Interactive focal point click on image
  const handleFocalPointClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imagePreviewRef.current) return;
    const rect = imagePreviewRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setFocalPoint({ x, y });
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Are you sure you want to remove this image from the library?")) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }
      setSelectedAsset(null);
      loadMedia();
    } catch {
      alert("Failed to delete media.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-brand-gold/30">
        <span className="text-xs font-sans tracking-widest uppercase text-brand-coral font-semibold">
          Visual Assets
        </span>
        <h1 className="font-display text-3xl font-bold text-brand-forest">
          Visual Media Library
        </h1>
        <p className="font-reading text-sm text-brand-forest/80 italic mt-0.5">
          Curate cover art, editorial portraits, and drama background plates with focal point controls.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-brand-parchment p-6 sm:p-8 rounded-2xl border-2 border-dashed border-brand-gold/50 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="sr-only"
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-forest text-brand-gold-light mx-auto flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 text-brand-coral" />
            )}
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-brand-forest">
              {uploading ? "Uploading Media..." : "Upload New Visual Artwork"}
            </h3>
            <p className="font-sans text-xs text-brand-forest/70 mt-1">
              Supports WebP, PNG, JPEG, GIF up to 10 MB. Server-side type and dimensions validated.
            </p>
          </div>

          {uploadError && (
            <p className="text-xs font-sans text-brand-coral font-semibold">{uploadError}</p>
          )}

          {uploadSuccess && (
            <p className="text-xs font-sans text-emerald-700 font-semibold">{uploadSuccess}</p>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 rounded-xl bg-brand-coral text-brand-cream text-xs font-sans font-semibold tracking-wider uppercase hover:bg-brand-coral/90 transition-all cursor-pointer shadow-xs"
            >
              Select Image File
            </button>
          </div>
        </div>
      </div>

      {/* Library Grid & Inspector */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-brand-forest">
            Registered Media ({mediaList.length})
          </h2>
          <span className="text-xs font-sans text-brand-forest/60">Click an asset to inspect metadata</span>
        </div>

        {mediaList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              const hasMissingMeta = !asset.alt_text || !asset.credit;

              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-square bg-brand-parchment ${
                    isSelected
                      ? "ring-2 ring-brand-coral border-brand-coral"
                      : "border-brand-gold/30 hover:border-brand-gold"
                  }`}
                >
                  <img
                    src={asset.storage_url}
                    alt={asset.alt_text || asset.filename}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: `${(asset.focal_point?.x ?? 0.5) * 100}% ${(asset.focal_point?.y ?? 0.5) * 100}%`,
                    }}
                  />
                  {hasMissingMeta && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-brand-coral text-brand-cream shadow-xs" title="Missing alt text or credit">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-[10px] text-brand-cream font-sans">
                    <p className="truncate font-semibold">{asset.filename}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-brand-parchment border border-dashed border-brand-gold/40">
            <ImageIcon className="w-8 h-8 text-brand-gold mx-auto mb-2" />
            <p className="font-reading italic text-brand-forest/70">
              No images uploaded yet. Upload cover artwork, press portraits, or drama backgrounds above.
            </p>
          </div>
        )}
      </div>

      {/* Selected Asset Focal Point Inspector Modal / Card */}
      {selectedAsset && (
        <div className="bg-brand-parchment p-6 sm:p-8 rounded-2xl border border-brand-gold/40 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
            <div>
              <h3 className="font-display text-lg font-bold text-brand-forest">
                Asset Inspector: {selectedAsset.filename}
              </h3>
              <p className="text-xs font-sans text-brand-forest/60">
                {(selectedAsset.file_size_bytes / (1024 * 1024)).toFixed(2)} MB · {selectedAsset.mime_type}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteMedia(selectedAsset.id)}
              className="text-xs font-sans text-brand-coral hover:underline inline-flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Asset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Interactive Focal Point Picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest">
                  Focal Point (Click image to anchor focus)
                </span>
                <span className="text-[11px] font-sans text-brand-coral font-mono">
                  X: {Math.round(selectedAsset.focal_point?.x * 100)}% | Y:{" "}
                  {Math.round(selectedAsset.focal_point?.y * 100)}%
                </span>
              </div>
              <div
                ref={imagePreviewRef}
                onClick={handleFocalPointClick}
                className="relative rounded-xl overflow-hidden border border-brand-gold/40 cursor-crosshair bg-stone-900"
              >
                <img
                  src={selectedAsset.storage_url}
                  alt={selectedAsset.alt_text}
                  className="w-full max-h-72 object-contain mx-auto"
                />
                {/* Target Pin */}
                <div
                  className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-brand-coral bg-brand-gold/50 pointer-events-none flex items-center justify-center shadow-md animate-pulse"
                  style={{
                    left: `${selectedAsset.focal_point.x * 100}%`,
                    top: `${selectedAsset.focal_point.y * 100}%`,
                  }}
                >
                  <Crosshair className="w-3 h-3 text-brand-ink" />
                </div>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                  Descriptive Alt Text (Accessibility Requirement)
                </label>
                <input
                  type="text"
                  value={selectedAsset.alt_text}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/30"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                  Photographer / Creator Credit
                </label>
                <input
                  type="text"
                  value={selectedAsset.credit}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/30"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={selectedAsset.caption || "None"}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl bg-brand-cream text-brand-ink text-xs border border-brand-gold/30"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-brand-forest mb-1">
                  Layout Suitability
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAsset.layout_suitability.map((suit) => (
                    <span
                      key={suit}
                      className="px-2 py-0.5 rounded bg-brand-forest text-brand-cream text-[10px] uppercase font-bold"
                    >
                      {suit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
