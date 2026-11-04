"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Representative Cover Artwork",
  helperText = "Upload a picture to visually represent this post, story, or audio reading (JPEG, PNG, WebP).",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt_text", file.name.replace(/\.[^/.]+$/, ""));

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      if (data.asset?.storage_url) {
        onChange(data.asset.storage_url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#182C25]">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-[#C85A46] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" /> Remove Artwork
          </button>
        )}
      </div>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-[rgba(197,160,89,0.3)] bg-[#FAF8F5] p-2">
          <div className="relative aspect-video sm:aspect-[21/9] max-h-56 rounded-lg overflow-hidden bg-black/5">
            <Image
              src={value}
              alt="Representative Cover Artwork"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#64746E]">
            <span className="truncate max-w-[280px] font-mono">{value}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 rounded bg-white border border-[rgba(197,160,89,0.4)] text-[#182C25] hover:bg-[#F7F4EE] cursor-pointer"
            >
              Replace Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            dragOver
              ? "border-[#C85A46] bg-[#C85A46]/5"
              : "border-[rgba(197,160,89,0.35)] hover:border-[#C5A059] bg-[#FAF8F5]"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4 text-[#182C25]">
              <Loader2 className="w-8 h-8 animate-spin text-[#C85A46] mb-2" />
              <p className="text-sm font-medium">Uploading representative artwork...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#182C25]/5 flex items-center justify-center text-[#C5A059] mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[#182C25]">
                Click or drag & drop representative image
              </p>
              <p className="text-xs text-[#64746E] mt-1">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-[#C85A46] mt-1">{error}</p>}

      {/* Manual URL Input Option */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] uppercase tracking-wider text-[#64746E]">Or paste image URL:</span>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/example.jpg or https://..."
          className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-[rgba(197,160,89,0.3)] bg-white text-[#182C25] focus:border-[#C85A46] focus:outline-none"
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />
    </div>
  );
}
