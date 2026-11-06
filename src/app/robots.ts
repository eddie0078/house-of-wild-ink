import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://houseofwildink.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ink-room", "/api/ink-room"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
