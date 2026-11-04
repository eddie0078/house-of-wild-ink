import React from "react";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { PoemViewer } from "@/components/PoemViewer";
import { db } from "@/lib/db";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PoemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PoemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const poem = db.getContentBySlug(slug);
  if (!poem) return { title: "Poem Not Found" };

  return {
    title: poem.seo_title || `${poem.title} — Poem`,
    description: poem.seo_description || poem.excerpt,
    openGraph: {
      title: poem.seo_title || `${poem.title} by ${poem.author_credit}`,
      description: poem.seo_description || poem.excerpt,
      type: "article",
      images: ["/api/og/site"],
    },
  };
}

export default async function PoemDetailPage({ params }: PoemPageProps) {
  const { slug } = await params;
  const poem = db.getContentBySlug(slug);

  if (!poem || poem.content_type !== "poem" || poem.status !== "published") {
    notFound();
  }

  const allPoems = db.getContentItems({ type: "poem", status: "published" });
  const currentIndex = allPoems.findIndex((p) => p.id === poem.id);
  const prevPoem = currentIndex > 0 ? allPoems[currentIndex - 1] : undefined;
  const nextPoem = currentIndex < allPoems.length - 1 ? allPoems[currentIndex + 1] : undefined;

  const collection = poem.collection_id ? db.getCollections().find((c) => c.id === poem.collection_id) : undefined;

  return (
    <PublicShell>
      <PoemViewer
        poem={poem}
        collectionTitle={collection?.title}
        prevPoem={prevPoem}
        nextPoem={nextPoem}
      />
    </PublicShell>
  );
}
