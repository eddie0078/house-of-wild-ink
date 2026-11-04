import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInkRoomSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await getInkRoomSession();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, excerpt, tags, contentType } = await req.json();
    const collections = db.getCollections();

    if (collections.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    // Algorithmic thematic matching
    const searchCorpus = `${title || ""} ${excerpt || ""} ${(tags || []).join(" ")} ${contentType || ""}`.toLowerCase();

    const ranked = collections.map((coll) => {
      const collCorpus = `${coll.title} ${coll.subtitle || ""} ${coll.description} ${coll.curator_note || ""}`.toLowerCase();
      let score = 0;
      const reasons: string[] = [];

      // Check keyword overlap
      const words = searchCorpus.split(/\W+/).filter((w: string) => w.length > 3);
      for (const w of words) {
        if (collCorpus.includes(w)) {
          score += 2;
          reasons.push(`Matched motif: "${w}"`);
        }
      }

      if (coll.title.toLowerCase().includes("earth") && searchCorpus.includes("stone")) {
        score += 5;
        reasons.push("Strong geological & organic resonance");
      }

      return {
        collectionId: coll.id,
        collectionTitle: coll.title,
        score,
        reason: reasons.slice(0, 2).join(", ") || "General thematic affinity",
      };
    });

    ranked.sort((a, b) => b.score - a.score);
    const topSuggestion = ranked[0];

    return NextResponse.json({
      suggestedCollection: topSuggestion.score > 0 ? topSuggestion : null,
      allRanked: ranked,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to suggest collection" }, { status: 500 });
  }
}
