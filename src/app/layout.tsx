import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://houseofwildink.com"),
  title: {
    default: "House of Wild Ink by Linda Emefa Daniels",
    template: "%s | House of Wild Ink",
  },
  description: "A home for stories that refuse to stay quiet. Poems, stories, short dramas and reflections by Linda Emefa Daniels (L.E. Daniels | DEFFA).",
  keywords: ["Linda Emefa Daniels", "L.E. Daniels", "DEFFA", "Poetry", "Short Drama", "Essays", "House of Wild Ink", "Literary"],
  authors: [{ name: "Linda Emefa Daniels" }],
  creator: "Linda Emefa Daniels",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://houseofwildink.com",
    title: "House of Wild Ink by Linda Emefa Daniels",
    description: "“A home for stories that refuse to stay quiet.”",
    siteName: "House of Wild Ink",
    images: [
      {
        url: "/api/og/site",
        width: 1200,
        height: 630,
        alt: "House of Wild Ink by Linda Emefa Daniels — A home for stories that refuse to stay quiet.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Wild Ink by Linda Emefa Daniels",
    description: "“A home for stories that refuse to stay quiet.”",
    images: ["/api/og/site"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-parchment text-brand-ink selection:bg-brand-gold/30">
        {children}
      </body>
    </html>
  );
}
