import { ContentItem } from "./types";

export function getPublicTypeLabel(contentType: string, item?: Partial<ContentItem>): string {
  switch (contentType) {
    case "poem":
      return "Poem";
    case "short_drama":
      return "Short Drama";
    case "audio_story":
      return item?.tags?.some((t) => t.toLowerCase().includes("drama")) ? "Audio Drama" : "Audio Story";
    case "story":
      return item?.reading_time_minutes && item.reading_time_minutes > 15 ? "Novella" : "Story";
    case "essay":
      return "Essay";
    case "article":
      return "Article";
    case "reflection":
      return "Reflection";
    case "collection":
      return "Curated Collection";
    default:
      return contentType ? contentType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Literary Work";
  }
}

export function getActionLabel(contentType: string, hasAudioSource = false): string {
  switch (contentType) {
    case "poem":
      return "Read Poem";
    case "short_drama":
      return "Read Script";
    case "story":
      return "Read Story";
    case "essay":
      return "Read Essay";
    case "article":
      return "Read Article";
    case "reflection":
      return "Read Reflection";
    case "audio_story":
      return hasAudioSource ? "Listen to Audio" : "Read Script & Notes";
    default:
      return "Read Piece";
  }
}

export function getAuthoritativeUrl(item: { content_type: string; slug: string }): string {
  if (item.content_type === "poem") return `/poems/${item.slug}`;
  if (item.content_type === "audio_story") return `/audio-stories/${item.slug}`;
  if (["essay", "article", "reflection"].includes(item.content_type)) return `/essays/${item.slug}`;
  return `/stories/${item.slug}`;
}
