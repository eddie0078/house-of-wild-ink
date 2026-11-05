export type ContentType = "poem" | "story" | "short_drama" | "essay" | "reflection" | "article" | "audio_story";

export type ContentStatus = "draft" | "scheduled" | "published" | "archived";

export type UserRole = "Owner" | "Publisher" | "Editor" | "Contributor";

export interface FocalPoint {
  x: number; // 0 to 1 (percentage from left)
  y: number; // 0 to 1 (percentage from top)
}

export interface MediaAsset {
  id: string;
  filename: string;
  storage_url: string;
  mime_type: string;
  file_size_bytes: number;
  alt_text: string;
  caption: string;
  credit: string;
  source: string;
  usage_note?: string;
  focal_point: FocalPoint;
  layout_suitability: ("inline" | "wide" | "full_bleed" | "portrait" | "cover")[];
  created_at: string;
}

export interface DramaBlock {
  type: "scene_heading" | "character" | "dialogue" | "stage_direction" | "paragraph" | "image";
  text?: string;
  character?: string;
  media_id?: string;
}

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content_type: ContentType;
  raw_content: string; // Preserves exact linebreaks, indentation, spacing for poems & raw text
  structured_body?: DramaBlock[]; // For stories, short dramas, and formatted prose
  excerpt: string;
  author_credit: string; // e.g. "L.E. Daniels | DEFFA" or "Linda Emefa Daniels"
  alignment: "left" | "center" | "right";
  reading_time_minutes: number;
  tags: string[];
  collection_id?: string;
  status: ContentStatus;
  scheduled_publish_at?: string;
  published_at?: string;
  is_homepage_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  cover_media_id?: string;
  cover_image_url?: string;
  youtube_url?: string;
  audio_duration?: string;
  narrator_credit?: string;
  social_media_id?: string;
  author_note?: string;
  version: number;
  updated_at: string;
  created_at: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  curator_note?: string;
  cover_media_id?: string;
  is_featured: boolean;
  is_public: boolean;
  status: "draft" | "published";
  published_at?: string;
  sort_order: number;
  item_ids: string[]; // Ordered list of content item IDs
  created_at: string;
  updated_at: string;
}

export interface PersonProfile {
  id: string;
  slug: string;
  display_name: string;
  short_bio: string;
  full_bio: string;
  portrait_media_id?: string;
  roles: string[]; // e.g. ["Author", "Editor", "Illustrator", "Photographer"]
  links: {
    website?: string;
    twitter?: string;
    instagram?: string;
  };
  selected_work_ids: string[];
  is_public: boolean;
  sort_order: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface Revision {
  id: string;
  item_id: string;
  item_type: "poem" | "story" | "collection" | "profile" | "settings" | "essay" | "audio_story";
  version: number;
  change_summary: string;
  snapshot: any;
  editor_name: string;
  created_at: string;
}

export interface DailyAnalytics {
  id: string;
  metric_date: string; // YYYY-MM-DD
  path: string;
  content_type: string;
  page_views: number;
  engaged_reads: number;
  share_events: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  consent_given: boolean;
  source_page: string;
  is_active: boolean;
  subscribed_at: string;
}

export type Subscriber = NewsletterSubscriber;

export interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  inquiry_category: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface NotebookQuote {
  id: string;
  quote: string;
  note?: string;
  source?: string;
}

export interface SiteSettings {
  featured_poem_id?: string;
  featured_story_id?: string;
  featured_audio_id?: string;
  featured_essay_id?: string;
  notebook_quotes: NotebookQuote[];
  about_linda_statement: string;
  about_linda_short_bio: string;
  about_linda_portrait_id?: string;
  press_photo_url?: string;
  owner_access_key_hash: string;
  owner_access_key_salt: string;
  last_key_rotation?: string;
}
