"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Respect Do Not Track / Global Privacy Control
    if (typeof window !== "undefined") {
      const dnt = navigator.doNotTrack === "1" || (window as any).doNotTrack === "1";
      const gpc = (navigator as any).globalPrivacyControl === true;
      if (dnt || gpc) return;

      // Log privacy-conscious aggregate page view
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          contentType: pathname.startsWith("/poems")
            ? "poem"
            : pathname.startsWith("/stories")
            ? "story"
            : "page",
          engaged: false,
        }),
      }).catch(() => {});

      // Engaged read tracker: triggers after 30 seconds of active reading
      const timer = setTimeout(() => {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            contentType: "engaged_read",
            engaged: true,
          }),
        }).catch(() => {});
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-parchment">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
