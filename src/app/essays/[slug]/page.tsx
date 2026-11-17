import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicShell } from "@/components/PublicShell";
import { EssayReader } from "@/components/EssayReader";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface EssayPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = db.getContentBySlug(slug);
  if (!item || !["essay", "article", "reflection"].includes(item.content_type)) {
    return { title: "Essay Not Found" };
  }
  return {
    title: `${item.title} — ${item.author_credit}`,
    description: item.seo_description || item.excerpt,
    alternates: {
      canonical: `/essays/${slug}`,
    },
  };
}

export default async function EssayDetailPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const item = db.getContentBySlug(slug);

  if (
    !item ||
    !["essay", "article", "reflection"].includes(item.content_type) ||
    item.status !== "published"
  ) {
    notFound();
  }

  return (
    <PublicShell>
      <EssayReader item={item} />
    </PublicShell>
  );
}
