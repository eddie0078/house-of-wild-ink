import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://houseofwildink.com";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/poems`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/stories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/essays`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/audio-stories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/people`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/newsletter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];

  // Dynamic published works
  const publishedItems = db.getContentItems({ status: "published" });
  const contentRoutes: MetadataRoute.Sitemap = publishedItems.map((item) => {
    let folder = "stories";
    if (item.content_type === "poem") folder = "poems";
    else if (["essay", "article", "reflection"].includes(item.content_type)) folder = "essays";
    else if (item.content_type === "audio_story") folder = "audio-stories";

    return {
      url: `${baseUrl}/${folder}/${item.slug}`,
      lastModified: new Date(item.updated_at || item.created_at),
      changeFrequency: "weekly",
      priority: 0.85,
    };
  });

  // Dynamic public collections
  const publicCollections = db.getCollections(true);
  const collectionRoutes: MetadataRoute.Sitemap = publicCollections.map((col) => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: new Date(col.updated_at || col.created_at),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...contentRoutes, ...collectionRoutes];
}
