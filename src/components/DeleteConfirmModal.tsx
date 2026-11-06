"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, ShieldCheck, Loader2, X } from "lucide-react";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemType?: string;
  isDeleting?: boolean;
  error?: string | null;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  itemType = "work",
  isDeleting = false,
  error = null,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-2xl border border-[rgba(197,160,89,0.35)] shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-forest/60 hover:text-brand-forest hover:bg-black/5 transition disabled:opacity-40 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-full bg-red-100 border border-red-200 text-red-600 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-red-100 text-red-800">
              Confirm Removal
            </span>
            <span className="text-xs font-sans text-brand-forest/60 capitalize">
              {itemType}
            </span>
          </div>

          <h3
            id="delete-dialog-title"
            className="font-display text-2xl font-bold text-brand-ink leading-tight"
          >
            Delete this {itemType}?
          </h3>

          <div className="p-3 bg-white/80 rounded-xl border border-brand-gold/20 my-3">
            <p className="font-reading italic text-sm text-brand-forest font-semibold line-clamp-2">
              "{title}"
            </p>
          </div>

          <p className="font-sans text-xs text-brand-forest/75 leading-relaxed">
            This will immediately unpublish and remove this {itemType} from your public archives and editorial lists.
          </p>
        </div>

        {/* Vault Safety Snapshot Reassurance */}
        <div className="mb-6 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="font-sans text-[11px] text-emerald-900 leading-snug">
            <strong>Safety copy retained:</strong> A restore snapshot is automatically preserved in your vault revision history.
          </p>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200 flex items-start gap-2 text-red-800 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-gold/20">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-brand-forest/30 text-brand-forest hover:bg-brand-parchment text-xs font-sans font-semibold tracking-wide transition disabled:opacity-40 cursor-pointer"
          >
            Keep {itemType}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-sans font-semibold tracking-wide transition flex items-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
