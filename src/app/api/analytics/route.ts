import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession } from "@/lib/auth";

function getDeviceType(userAgent: string): "mobile" | "desktop" | "tablet" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

function getReferrerCategory(referer: string, host: string): "direct" | "search" | "social" | "internal" {
  if (!referer) return "direct";
  try {
    const url = new URL(referer);
    if (url.host === host || url.host.includes("localhost")) {
      return "internal";
    }
    if (/google\.|bing\.|duckduckgo\.|yahoo\.|ecosia\.|baidu\./i.test(url.hostname)) {
      return "search";
    }
    if (/whatsapp\.|twitter\.|t\.co|x\.com|facebook\.|fb\.com|instagram\.|linkedin\.|reddit\./i.test(url.hostname)) {
      return "social";
    }
  } catch {
    // Malformed referrer header
  }
  return "direct";
}

export async function GET(req: NextRequest) {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const rangeParam = searchParams.get("range");
  const validRanges = ["today", "7d", "30d", "all"] as const;
  const range = validRanges.includes(rangeParam as any) ? (rangeParam as "today" | "7d" | "30d" | "all") : "all";

  const summary = await db.getAnalyticsSummaryAsync(range);
  return NextResponse.json(summary);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, contentType, eventType, engaged, shared, dwellSeconds, query, resultCount, interaction, label } = body;

    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";
    const host = req.headers.get("host") || "";

    const device = getDeviceType(userAgent);
    const referrer = getReferrerCategory(referer, host);

    // 1. Search Query Logging
    if (query && typeof query === "string") {
      db.logSearchQuery(query, typeof resultCount === "number" ? resultCount : 0);
      return NextResponse.json({ logged: true, type: "search" });
    }

    // 2. Specific Interaction Event Logging (theme switch, audio play, etc.)
    if (interaction && typeof interaction === "string") {
      db.logInteraction(interaction as any, path || "/", label);
      // Also increment audio counters on the path if applicable
      if (interaction === "audio_play" && path) {
        db.logTelemetryEvent({ path, contentType: "audio_story", eventType: "audio_play", device, referrer });
      } else if (interaction === "audio_complete" && path) {
        db.logTelemetryEvent({ path, contentType: "audio_story", eventType: "audio_complete", device, referrer });
      }
      return NextResponse.json({ logged: true, type: "interaction" });
    }

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    // 3. Telemetry Event Logging
    let resolvedEventType: "pageview" | "engaged_read" | "scroll_complete" | "dwell_time" | "share" | "quote_copy" | "audio_play" | "audio_complete" = "pageview";

    if (eventType) {
      resolvedEventType = eventType;
    } else if (engaged) {
      resolvedEventType = "engaged_read";
    } else if (shared) {
      resolvedEventType = "share";
    }

    db.logTelemetryEvent({
      path,
      contentType: contentType || "page",
      eventType: resolvedEventType,
      dwellSeconds: typeof dwellSeconds === "number" ? dwellSeconds : 0,
      device,
      referrer,
    });

    return NextResponse.json({ logged: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to log event" }, { status: 500 });
  }
}
