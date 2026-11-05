import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const type = searchParams.get("type");

  const items = db.getContentItems({ status: "published" });
  const collections = db.getCollections(true);

  let results = items.map((item) => {
    let url = `/stories/${item.slug}`;
    if (item.content_type === "poem") url = `/poems/${item.slug}`;
    if (item.content_type === "audio_story") url = `/audio-stories/${item.slug}`;
    if (["essay", "article", "reflection"].includes(item.content_type)) url = `/essays/${item.slug}`;

    return {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      content_type: item.content_type,
      excerpt: item.excerpt || item.raw_content.slice(0, 140),
      author_credit: item.author_credit,
      reading_time: item.reading_time_minutes,
      audio_duration: item.audio_duration,
      tags: item.tags || [],
      url,
    };
  });

  const collectionResults = collections.map((coll) => ({
    id: coll.id,
    title: coll.title,
    subtitle: coll.subtitle,
    content_type: "collection",
    excerpt: coll.description,
    author_credit: "Linda Emefa Daniels",
    reading_time: undefined,
    audio_duration: undefined,
    tags: ["Collection", "Volume"],
    url: `/collections/${coll.slug}`,
  }));

  const all = [...results, ...collectionResults];

  let filtered = all;
  if (type && type !== "all") {
    filtered = filtered.filter((item) => {
      if (type === "essay") return ["essay", "article", "reflection"].includes(item.content_type);
      return item.content_type === type;
    });
  }

  if (q) {
    filtered = filtered.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = item.subtitle?.toLowerCase().includes(q);
      const matchExcerpt = item.excerpt.toLowerCase().includes(q);
      const matchAuthor = item.author_credit.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchSub || matchExcerpt || matchAuthor || matchTags;
    });
  }

  return NextResponse.json({
    results: filtered.slice(0, 15),
    total: filtered.length,
  });
}
