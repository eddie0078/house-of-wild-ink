"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export function ShareControls({ title, text, url }: { title: string; text?: string; url?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    // Native Web Share API if supported
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title,
          text: text || "Read this on House of Wild Ink by Linda Emefa Daniels",
          url: shareUrl,
        });

        // Log share event to first-party aggregate analytics
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: typeof window !== "undefined" ? window.location.pathname : "",
            contentType: "share_event",
            shared: true,
          }),
        }).catch(() => {});

        return;
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    // Fallback: Copy link to clipboard
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);

        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: typeof window !== "undefined" ? window.location.pathname : "",
            contentType: "share_copy_link",
            shared: true,
          }),
        }).catch(() => {});
      } catch (err) {
        console.error("Clipboard copy failed", err);
      }
    }
  };

  return (
    <div className="inline-flex items-center">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-gold/40 text-brand-forest hover:bg-brand-cream text-xs font-sans font-medium transition-all shadow-2xs"
        aria-label={copied ? "Link copied to clipboard" : "Share this work"}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-brand-coral" />
            <span className="text-brand-coral font-semibold">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-brand-coral" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  );
}
