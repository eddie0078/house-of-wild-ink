"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { AudioProvider } from "@/lib/AudioContext";
import { FloatingAudioPlayer } from "./FloatingAudioPlayer";

function resolveContentType(path: string): string {
  if (path.startsWith("/poems/")) return "poem";
  if (path.startsWith("/stories/")) return "story";
  if (path.startsWith("/essays/")) return "essay";
  if (path.startsWith("/audio-stories/")) return "audio_story";
  if (path.startsWith("/collections/")) return "collection";
  return "page";
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const activeSecondsRef = useRef<number>(0);
  const scrollReportedRef = useRef<boolean>(false);

  useEffect(() => {
    // Respect Do Not Track / Global Privacy Control
    if (typeof window === "undefined") return;
    const dnt = navigator.doNotTrack === "1" || (window as any).doNotTrack === "1";
    const gpc = (navigator as any).globalPrivacyControl === true;
    if (dnt || gpc) return;

    const contentType = resolveContentType(pathname);
    startTimeRef.current = Date.now();
    activeSecondsRef.current = 0;
    scrollReportedRef.current = false;

    // 1. Initial aggregate page view
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        contentType,
        eventType: "pageview",
      }),
    }).catch(() => {});

    // 2. Engaged read milestone (30 seconds of active dwell)
    const engagedTimer = setTimeout(() => {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          contentType,
          eventType: "engaged_read",
        }),
      }).catch(() => {});
    }, 30000);

    // 3. Scroll depth tracker: 75% read completion milestone
    const handleScroll = () => {
      if (scrollReportedRef.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0 && scrollTop / scrollHeight >= 0.75) {
        scrollReportedRef.current = true;
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            contentType,
            eventType: "scroll_complete",
          }),
        }).catch(() => {});
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 4. Quote / Verse Copy Listener
    const handleCopy = () => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.trim().length > 10) {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            contentType,
            eventType: "quote_copy",
          }),
        }).catch(() => {});
      }
    };

    document.addEventListener("copy", handleCopy);

    // 5. Active dwell timer accumulation (pauses when reader minimizes tab)
    let lastTick = Date.now();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        activeSecondsRef.current += Math.round((now - lastTick) / 1000);
        lastTick = now;
      } else {
        lastTick = Date.now();
      }
    }, 2000);

    // Cleanup and Dwell Beacon
    return () => {
      clearTimeout(engagedTimer);
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("copy", handleCopy);

      const totalDwell = activeSecondsRef.current;
      if (totalDwell >= 3) {
        const payload = JSON.stringify({
          path: pathname,
          contentType,
          eventType: "dwell_time",
          dwellSeconds: totalDwell,
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
        } else {
          fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      }
    };
  }, [pathname]);

  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col bg-brand-parchment">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-forest focus:text-brand-cream focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-coral font-sans text-xs font-semibold uppercase tracking-wider"
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <FloatingAudioPlayer />
      </div>
    </AudioProvider>
  );
}
