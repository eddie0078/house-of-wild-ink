import React from "react";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { StoryReader } from "@/components/StoryReader";
import { db } from "@/lib/db";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = db.getContentBySlug(slug);
  if (!story) return { title: "Story Not Found" };

  return {
    title: story.seo_title || `${story.title} — ${story.content_type === "short_drama" ? "Short Drama" : "Story"}`,
    description: story.seo_description || story.excerpt,
    openGraph: {
      title: story.seo_title || `${story.title} by ${story.author_credit}`,
      description: story.seo_description || story.excerpt,
      type: "article",
      images: ["/api/og/site"],
    },
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = db.getContentBySlug(slug);

  if (!story || story.content_type === "poem" || story.status !== "published") {
    notFound();
  }

  const allStories = db.getContentItems({ status: "published" }).filter((i) => i.content_type !== "poem");
  const currentIndex = allStories.findIndex((s) => s.id === story.id);
  const prevStory = currentIndex > 0 ? allStories[currentIndex - 1] : undefined;
  const nextStory = currentIndex < allStories.length - 1 ? allStories[currentIndex + 1] : undefined;

  const collection = story.collection_id ? db.getCollections().find((c) => c.id === story.collection_id) : undefined;

  return (
    <PublicShell>
      <StoryReader
        story={story}
        collectionTitle={collection?.title}
        prevStory={prevStory}
        nextStory={nextStory}
      />
    </PublicShell>
  );
}
