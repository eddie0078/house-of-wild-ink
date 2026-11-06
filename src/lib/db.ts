import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  ContentItem,
  Collection,
  PersonProfile,
  MediaAsset,
  Revision,
  DailyAnalytics,
  NewsletterSubscriber,
  ContactMessage,
  SiteSettings,
  UserAccount,
} from "./types";
import { hashAccessKey } from "./security";

interface DatabaseSchema {
  content: ContentItem[];
  collections: Collection[];
  people: PersonProfile[];
  media: MediaAsset[];
  revisions: Revision[];
  analytics: DailyAnalytics[];
  subscribers: NewsletterSubscriber[];
  messages: ContactMessage[];
  users: UserAccount[];
  settings: SiteSettings;
  activeSessions: { token: string; email: string; role: string; expiresAt: number }[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "house_of_wild.json");

// Initial Linda Emefa Daniels verified data
function getInitialSeed(): DatabaseSchema {
  const { hash, salt } = hashAccessKey("WildInk2026!AuthorVault");

  const stonesPoemId = "poem-stones-verified";
  const stonesPoem: ContentItem = {
    id: stonesPoemId,
    slug: "stones",
    title: "Stones",
    content_type: "poem",
    raw_content: `Diamond, Blue Sapphire, Ruby, Emerald;
The four most precious stones :
Peridot, Turquoise, Moonstone, Garnet;
Following close behind we are:
Flint, Limestone, Dacite, Gneiss;
What shall we say of ourselves?
Stones we all are, like humans different but alike`,
    excerpt: "Diamond, Blue Sapphire, Ruby, Emerald; The four most precious stones : Peridot, Turquoise, Moonstone, Garnet...",
    author_credit: "L.E. Daniels | DEFFA",
    alignment: "left",
    reading_time_minutes: 1,
    tags: ["Reflection", "Humanity", "Identity", "Precious"],
    status: "published",
    published_at: new Date().toISOString(),
    is_homepage_featured: true,
    seo_title: "Stones — Poem by L.E. Daniels | DEFFA",
    seo_description: "Stones we all are, like humans different but alike. A poem by L.E. Daniels | DEFFA from House of Wild Ink.",
    version: 1,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const sampleDrama: ContentItem = {
    id: "drama-threshold-draft",
    slug: "at-the-threshold",
    title: "At the Threshold",
    subtitle: "A short drama in one room",
    content_type: "short_drama",
    raw_content: `SCENE I: THE WRITING ROOM — DUSK

(A tall arched window reveals rain falling softly against old brick. A desk of dark cedar holds an inkwell and loose parchment.)

MARA
(Standing by the window, without turning)
You always leave the door ajar. As if a sentence might escape.

KAI
(Seated at the desk, dipping a nib into dark ink)
Sentences do escape, Mara. Especially the ones we never meant to say aloud.

MARA
(Turning slowly)
And what will you do when this one finds its reader?

KAI
Listen for the echo.`,
    structured_body: [
      { type: "scene_heading", text: "SCENE I: THE WRITING ROOM — DUSK" },
      { type: "stage_direction", text: "A tall arched window reveals rain falling softly against old brick. A desk of dark cedar holds an inkwell and loose parchment." },
      { type: "character", text: "MARA" },
      { type: "stage_direction", text: "Standing by the window, without turning" },
      { type: "dialogue", text: "You always leave the door ajar. As if a sentence might escape." },
      { type: "character", text: "KAI" },
      { type: "stage_direction", text: "Seated at the desk, dipping a nib into dark ink" },
      { type: "dialogue", text: "Sentences do escape, Mara. Especially the ones we never meant to say aloud." },
      { type: "character", text: "MARA" },
      { type: "stage_direction", text: "Turning slowly" },
      { type: "dialogue", text: "And what will you do when this one finds its reader?" },
      { type: "character", text: "KAI" },
      { type: "dialogue", text: "Listen for the echo." },
    ],
    excerpt: "You always leave the door ajar. As if a sentence might escape. Sentences do escape, Mara...",
    author_credit: "Linda Emefa Daniels",
    alignment: "left",
    reading_time_minutes: 2,
    tags: ["Drama", "Dialogue", "The Threshold"],
    status: "published",
    published_at: new Date().toISOString(),
    is_homepage_featured: true,
    seo_title: "At the Threshold — Short Drama by Linda Emefa Daniels",
    seo_description: "A short drama in one room exploring the unspoken words that shape our lives.",
    version: 1,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const lindaProfile: PersonProfile = {
    id: "profile-linda-daniels",
    slug: "linda-emefa-daniels",
    display_name: "Linda Emefa Daniels",
    short_bio: "Writer and creator of House of Wild Ink. L.E. Daniels | DEFFA.",
    full_bio: `I write from experiences, observations, my faith, what I hope for and the quiet and loud conversations of life. But somewhere between my story and yours, I find that emotions meet. So when I put pen to paper, I may begin with my story, but sometimes, you find yours in it too. That is why I don’t only write my stories. I write our stories. 🌸 — L.E. Daniels | DEFFA.`,
    roles: ["Author", "Founder"],
    links: {},
    selected_work_ids: [stonesPoemId, "drama-threshold-draft"],
    is_public: true,
    sort_order: 1,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const initialCollection: Collection = {
    id: "coll-earth-and-ink",
    slug: "earth-and-ink",
    title: "Earth and Ink",
    subtitle: "Reflections on humanity and quiet endurance",
    description: "A selection of poems and dramatic reflections examining the stones we gather and the thresholds we cross.",
    curator_note: "Curated for the inaugural opening of House of Wild Ink.",
    is_featured: true,
    is_public: true,
    status: "published",
    published_at: new Date().toISOString(),
    sort_order: 1,
    item_ids: [stonesPoemId, "drama-threshold-draft"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const initialSettings: SiteSettings = {
    featured_poem_id: stonesPoemId,
    featured_story_id: "drama-threshold-draft",
    featured_audio_id: "audio-first-garden",
    featured_essay_id: "essay-stories-refuse-to-stay-quiet",
    about_linda_portrait_id: "media-linda-portrait",
    press_photo_url: "/images/linda-emefa-daniels.jpg",
    notebook_quotes: [
      {
        id: "quote-1",
        quote: "Somewhere between my story and yours, I find that emotions meet. That is why I don’t only write my stories. I write our stories.",
        source: "L.E. Daniels | DEFFA",
        note: "From the Author’s Notebook",
      },
      {
        id: "quote-2",
        quote: "Stones we all are, like humans different but alike.",
        source: "Stones",
        note: "Poetic reflection",
      },
      {
        id: "quote-3",
        quote: "A home for stories that refuse to stay quiet.",
        source: "House of Wild Ink",
        note: "Foundational Brand Thesis",
      },
    ],
    about_linda_statement: `I write from experiences, observations, my faith, what I hope for and the quiet and loud conversations of life. But somewhere between my story and yours, I find that emotions meet. So when I put pen to paper, I may begin with my story, but sometimes, you find yours in it too. That is why I don’t only write my stories. I write our stories. 🌸 — L.E. Daniels | DEFFA.`,
    about_linda_short_bio: `Writer and creator of House of Wild Ink. Author under Linda Emefa Daniels and L.E. Daniels | DEFFA.`,
    owner_access_key_hash: hash,
    owner_access_key_salt: salt,
    last_key_rotation: new Date().toISOString(),
  };

  const initialUsers: UserAccount[] = [
    {
      id: "user-owner-linda",
      email: "lindaemefadaniels@gmail.com",
      name: "Linda Emefa Daniels",
      role: "Owner",
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];

  return {
    content: [stonesPoem, sampleDrama],
    collections: [initialCollection],
    people: [lindaProfile],
    media: [],
    revisions: [],
    analytics: [
      {
        id: "stat-init-1",
        metric_date: new Date().toISOString().split("T")[0],
        path: "/poems/stones",
        content_type: "poem",
        page_views: 42,
        engaged_reads: 36,
        share_events: 8,
      },
    ],
    subscribers: [],
    messages: [],
    users: initialUsers,
    settings: initialSettings,
    activeSessions: [],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return this.ensureDefaults(parsed);
      }
    } catch (e) {
      console.error("Failed to load db, seeding defaults:", e);
    }
    const initial = getInitialSeed();
    this.saveDirect(initial);
    return initial;
  }

  private ensureDefaults(data: DatabaseSchema): DatabaseSchema {
    let changed = false;
    if (!data.media) data.media = [];
    if (!data.media.some((m) => m.id === "media-linda-portrait")) {
      data.media.push({
        id: "media-linda-portrait",
        filename: "linda-emefa-daniels.jpg",
        storage_url: "/images/linda-emefa-daniels.jpg",
        mime_type: "image/jpeg",
        file_size_bytes: 842100,
        alt_text: "Linda Emefa Daniels, author and creator of House of Wild Ink",
        caption: "Author Linda Emefa Daniels (L.E. Daniels | DEFFA)",
        credit: "House of Wild Ink",
        source: "Author Upload",
        focal_point: { x: 0.5, y: 0.35 },
        layout_suitability: ["portrait", "cover", "inline"],
        created_at: new Date().toISOString(),
      });
      changed = true;
    }
    if (!data.content.some((c) => c.id === "audio-first-garden")) {
      data.content.push({
        id: "audio-first-garden",
        slug: "the-first-garden",
        title: "The First Garden",
        subtitle: "An audio story on remembrance and quiet faith",
        content_type: "audio_story",
        raw_content: `In the first garden, nothing asked to be explained. Every green shoot, every damp petal in the morning sun, simply existed under the light.\n\nWe forget that waiting is also an act of faith. When the seasons turn sharp, we look for words that can steady us. This reading was recorded in the quiet hours of dusk, reflecting on where roots take hold when the ground feels unfamiliar.`,
        excerpt: "An audio reflection on remembrance, faith, and quiet roots. Recorded in the quiet hours of dusk.",
        author_credit: "Linda Emefa Daniels",
        narrator_credit: "Linda Emefa Daniels",
        audio_duration: "8:45 min",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        cover_image_url: "/images/linda-emefa-daniels.jpg",
        alignment: "left",
        reading_time_minutes: 4,
        tags: ["Audio Story", "Faith", "Remembrance", "Spoken Word"],
        status: "published",
        published_at: new Date().toISOString(),
        is_homepage_featured: true,
        seo_title: "The First Garden — Audio Story by Linda Emefa Daniels",
        seo_description: "An audio story on remembrance and quiet faith narrated by Linda Emefa Daniels.",
        version: 1,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
      changed = true;
    }
    if (!data.content.some((c) => c.id === "essay-stories-refuse-to-stay-quiet")) {
      data.content.push({
        id: "essay-stories-refuse-to-stay-quiet",
        slug: "on-stories-that-refuse-to-stay-quiet",
        title: "On Stories That Refuse to Stay Quiet",
        subtitle: "An introductory essay on voice, faith, and shared humanity",
        content_type: "essay",
        raw_content: `There is a particular kind of silence that precedes an honest sentence. It is not the silence of having nothing to say, but rather the quiet courage of deciding to say what has waited in the dark for too long.\n\nI have learned that when we write from our deepest observations—from our faith, our quiet ache, our sudden joys—we rarely write alone. Between my private memory and your living heart, emotions meet. The circumstance of the story belongs to one person, but the feeling belongs to everyone who has ever walked through the door of another morning.\n\nThat is why this house exists. House of Wild Ink is built for the sentences that refuse to stay quiet in drawers, for the poems that demand to be recited against the noise of the day, and for the reflections that remind us that though we are all different stones, we are shaped by the same quiet earth.`,
        excerpt: "There is a particular kind of silence that precedes an honest sentence. It is not the silence of having nothing to say, but rather the quiet courage...",
        author_credit: "L.E. Daniels | DEFFA",
        alignment: "left",
        reading_time_minutes: 3,
        tags: ["Essay", "Writing", "Faith", "Voice"],
        status: "published",
        published_at: new Date().toISOString(),
        is_homepage_featured: true,
        seo_title: "On Stories That Refuse to Stay Quiet — Essay by L.E. Daniels | DEFFA",
        seo_description: "An essay on voice, faith, and shared humanity by L.E. Daniels | DEFFA.",
        version: 1,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
      changed = true;
    }
    const linda = data.people.find((p) => p.id === "profile-linda-daniels");
    if (linda && !linda.portrait_media_id) {
      linda.portrait_media_id = "media-linda-portrait";
      changed = true;
    }
    if (data.settings) {
      if (!data.settings.featured_audio_id) {
        data.settings.featured_audio_id = "audio-first-garden";
        changed = true;
      }
      if (!data.settings.featured_essay_id) {
        data.settings.featured_essay_id = "essay-stories-refuse-to-stay-quiet";
        changed = true;
      }
      if (!data.settings.about_linda_portrait_id) {
        data.settings.about_linda_portrait_id = "media-linda-portrait";
        changed = true;
      }
      if (!data.settings.press_photo_url) {
        data.settings.press_photo_url = "/images/linda-emefa-daniels.jpg";
        changed = true;
      }
    }
    if (changed) {
      this.saveDirect(data);
    }
    return data;
  }

  private saveDirect(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmp = `${DB_FILE}.${crypto.randomBytes(4).toString("hex")}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
      try {
        fs.renameSync(tmp, DB_FILE);
      } catch (renameErr) {
        // Fallback for Windows file locks / OneDrive sync
        try {
          fs.copyFileSync(tmp, DB_FILE);
          if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        } catch {
          fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
          if (fs.existsSync(tmp)) {
            try { fs.unlinkSync(tmp); } catch {}
          }
        }
      }
    } catch (err) {
      console.error("Failed to save DB:", err);
    }
  }

  private persist() {
    this.saveDirect(this.data);
  }

  // --- Content Items ---
  getContentItems(filter?: { type?: string; status?: string; collectionId?: string }): ContentItem[] {
    this.data = this.load();
    let items = [...this.data.content];
    if (filter?.type) {
      items = items.filter((i) => i.content_type === filter.type);
    }
    if (filter?.status) {
      items = items.filter((i) => i.status === filter.status);
    }
    if (filter?.collectionId) {
      items = items.filter((i) => i.collection_id === filter.collectionId);
    }
    return items.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  getContentBySlug(slug: string): ContentItem | undefined {
    return this.data.content.find((i) => i.slug === slug);
  }

  getContentById(id: string): ContentItem | undefined {
    return this.data.content.find((i) => i.id === id);
  }

  saveContentItem(item: Partial<ContentItem> & { title: string; content_type: any }, editorName = "Linda"): ContentItem {
    const existingIndex = this.data.content.findIndex((i) => i.id === item.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = this.data.content[existingIndex];
      const newVersion = (existing.version || 1) + 1;

      // Save revision snapshot
      this.data.revisions.unshift({
        id: crypto.randomUUID(),
        item_id: existing.id,
        item_type: (["poem", "story", "essay", "audio_story"].includes(existing.content_type) ? existing.content_type : "story") as any,
        version: existing.version,
        change_summary: `Updated: ${item.title || existing.title}`,
        snapshot: existing,
        editor_name: editorName,
        created_at: now,
      });

      const updated: ContentItem = {
        ...existing,
        ...item,
        version: newVersion,
        updated_at: now,
      };
      this.data.content[existingIndex] = updated;
      this.persist();
      return updated;
    } else {
      const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const newItem: ContentItem = {
        id: item.id || crypto.randomUUID(),
        slug,
        title: item.title,
        subtitle: item.subtitle || "",
        content_type: item.content_type,
        raw_content: item.raw_content || "",
        structured_body: item.structured_body || [],
        excerpt: item.excerpt || (item.raw_content ? item.raw_content.slice(0, 160) : ""),
        author_credit: item.author_credit || "L.E. Daniels | DEFFA",
        alignment: item.alignment || "left",
        reading_time_minutes: item.reading_time_minutes || 1,
        tags: item.tags || [],
        collection_id: item.collection_id,
        status: item.status || "draft",
        is_homepage_featured: !!item.is_homepage_featured,
        seo_title: item.seo_title,
        seo_description: item.seo_description,
        cover_media_id: item.cover_media_id,
        cover_image_url: item.cover_image_url,
        youtube_url: item.youtube_url,
        audio_duration: item.audio_duration,
        narrator_credit: item.narrator_credit,
        author_note: item.author_note,
        version: 1,
        updated_at: now,
        created_at: now,
      };
      this.data.content.unshift(newItem);
      this.persist();
      return newItem;
    }
  }

  deleteContentItem(id: string): boolean {
    const item = this.data.content.find((i) => i.id === id);
    if (!item) return false;

    // Remove from content list
    this.data.content = this.data.content.filter((i) => i.id !== id);

    // Scrub from collections item_ids
    for (const c of this.data.collections) {
      if (c.item_ids && c.item_ids.includes(id)) {
        c.item_ids = c.item_ids.filter((itemId) => itemId !== id);
      }
    }

    // Scrub from author profiles selected_work_ids
    for (const p of this.data.people) {
      if (p.selected_work_ids && p.selected_work_ids.includes(id)) {
        p.selected_work_ids = p.selected_work_ids.filter((workId) => workId !== id);
      }
    }

    this.persist();
    return true;
  }

  // --- Collections ---
  getCollections(publicOnly = false): Collection[] {
    this.data = this.load();
    let colls = [...this.data.collections];
    if (publicOnly) {
      colls = colls.filter((c) => c.is_public && c.status === "published");
    }
    return colls.sort((a, b) => a.sort_order - b.sort_order);
  }

  getCollectionBySlug(slug: string): Collection | undefined {
    return this.data.collections.find((c) => c.slug === slug);
  }

  getCollectionById(id: string): Collection | undefined {
    return this.data.collections.find((c) => c.id === id);
  }

  deleteCollection(id: string): boolean {
    const prevLen = this.data.collections.length;
    this.data.collections = this.data.collections.filter((c) => c.id !== id);
    if (this.data.collections.length !== prevLen) {
      // Unlink collection_id from any content item that was categorized under it
      for (const item of this.data.content) {
        if (item.collection_id === id) {
          delete item.collection_id;
        }
      }
      this.persist();
      return true;
    }
    return false;
  }

  saveCollection(coll: Partial<Collection> & { title: string }): Collection {
    const existingIndex = this.data.collections.findIndex((c) => c.id === coll.id);
    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      const updated = {
        ...this.data.collections[existingIndex],
        ...coll,
        updated_at: now,
      };
      this.data.collections[existingIndex] = updated;
      this.persist();
      return updated;
    } else {
      const slug = coll.slug || coll.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const newColl: Collection = {
        id: coll.id || crypto.randomUUID(),
        slug,
        title: coll.title,
        subtitle: coll.subtitle,
        description: coll.description || "",
        curator_note: coll.curator_note,
        cover_media_id: coll.cover_media_id,
        is_featured: !!coll.is_featured,
        is_public: coll.is_public !== undefined ? coll.is_public : true,
        status: coll.status || "published",
        sort_order: coll.sort_order || this.data.collections.length + 1,
        item_ids: coll.item_ids || [],
        created_at: now,
        updated_at: now,
      };
      this.data.collections.push(newColl);
      this.persist();
      return newColl;
    }
  }

  // --- People & Profiles ---
  getPeople(publicOnly = false): PersonProfile[] {
    this.data = this.load();
    let p = [...this.data.people];
    if (publicOnly) {
      p = p.filter((x) => x.is_public && x.status === "published");
    }
    return p.sort((a, b) => a.sort_order - b.sort_order);
  }

  getPersonBySlug(slug: string): PersonProfile | undefined {
    return this.data.people.find((x) => x.slug === slug);
  }

  savePerson(person: Partial<PersonProfile> & { display_name: string }): PersonProfile {
    const existingIndex = this.data.people.findIndex((p) => p.id === person.id);
    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      const updated = {
        ...this.data.people[existingIndex],
        ...person,
        updated_at: now,
      };
      this.data.people[existingIndex] = updated;
      this.persist();
      return updated;
    } else {
      const slug = person.slug || person.display_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const newP: PersonProfile = {
        id: person.id || crypto.randomUUID(),
        slug,
        display_name: person.display_name,
        short_bio: person.short_bio || "",
        full_bio: person.full_bio || "",
        portrait_media_id: person.portrait_media_id,
        roles: person.roles || ["Contributor"],
        links: person.links || {},
        selected_work_ids: person.selected_work_ids || [],
        is_public: person.is_public !== undefined ? person.is_public : true,
        sort_order: person.sort_order || this.data.people.length + 1,
        status: person.status || "published",
        created_at: now,
        updated_at: now,
      };
      this.data.people.push(newP);
      this.persist();
      return newP;
    }
  }

  // --- Media Assets ---
  getMedia(): MediaAsset[] {
    this.data = this.load();
    return [...this.data.media];
  }

  getMediaById(id?: string): MediaAsset | undefined {
    this.data = this.load();
    if (!id) return undefined;
    return this.data.media.find((m) => m.id === id);
  }

  saveMedia(asset: Omit<MediaAsset, "id" | "created_at">): MediaAsset {
    const newAsset: MediaAsset = {
      ...asset,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    this.data.media.unshift(newAsset);
    this.persist();
    return newAsset;
  }

  deleteMedia(id: string): boolean {
    // Check if media is currently used in any content or collection
    const inContent = this.data.content.some((c) => c.cover_media_id === id);
    const inCollection = this.data.collections.some((c) => c.cover_media_id === id);
    if (inContent || inCollection) {
      return false; // Prevent orphaned deletion
    }
    this.data.media = this.data.media.filter((m) => m.id !== id);
    this.persist();
    return true;
  }

  // --- Revisions ---
  saveRevision(
    itemId: string,
    contentType: string,
    snapshot: any,
    changeSummary: string,
    editorName = "Linda"
  ): Revision {
    const revision: Revision = {
      id: crypto.randomUUID(),
      item_id: itemId,
      item_type: (["poem", "story", "collection", "profile", "settings", "essay", "audio_story"].includes(contentType)
        ? contentType
        : "story") as any,
      version: snapshot?.version || 1,
      change_summary: changeSummary,
      snapshot,
      editor_name: editorName,
      created_at: new Date().toISOString(),
    };
    this.data.revisions.unshift(revision);
    this.persist();
    return revision;
  }

  getRevisions(itemId: string): Revision[] {
    return this.data.revisions.filter((r) => r.item_id === itemId);
  }

  restoreRevision(revisionId: string, editorName = "Linda"): ContentItem | undefined {
    const rev = this.data.revisions.find((r) => r.id === revisionId);
    if (!rev) return undefined;

    const itemIndex = this.data.content.findIndex((c) => c.id === rev.item_id);
    if (itemIndex === -1) return undefined;

    const currentItem = this.data.content[itemIndex];
    const now = new Date().toISOString();

    // Create a new revision representing current state before restoring
    this.data.revisions.unshift({
      id: crypto.randomUUID(),
      item_id: currentItem.id,
      item_type: (["poem", "story", "essay", "audio_story"].includes(currentItem.content_type) ? currentItem.content_type : "story") as any,
      version: currentItem.version,
      change_summary: `Pre-restore snapshot before restoring v${rev.version}`,
      snapshot: currentItem,
      editor_name: editorName,
      created_at: now,
    });

    const restored: ContentItem = {
      ...rev.snapshot,
      version: (currentItem.version || 1) + 1,
      updated_at: now,
    };
    this.data.content[itemIndex] = restored;
    this.persist();
    return restored;
  }

  // --- Site Settings & Security ---
  getSettings(): SiteSettings {
    this.data = this.load();
    return { ...this.data.settings };
  }

  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...settings,
    };
    this.persist();
    return this.data.settings;
  }

  rotateAccessKey(newHash: string, newSalt: string): void {
    this.data.settings.owner_access_key_hash = newHash;
    this.data.settings.owner_access_key_salt = newSalt;
    this.data.settings.last_key_rotation = new Date().toISOString();
    // Invalidate all other sessions
    this.data.activeSessions = [];
    this.persist();
  }

  // --- Users & Roles ---
  getUsers(): UserAccount[] {
    return [...this.data.users];
  }

  getUserByEmail(email: string): UserAccount | undefined {
    this.data = this.load();
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.is_active);
  }

  addUser(email: string, name: string, role: any): UserAccount {
    const existing = this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.role = role;
      existing.is_active = true;
      this.persist();
      return existing;
    }
    const newUser: UserAccount = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      role,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  // --- Sessions (Stateless HMAC & Serverless Compatible) ---
  createSession(email: string, role: string): string {
    const sessionSecret = process.env.OWNER_ACCESS_KEY || "WildInk2026!AuthorVault_SecretSessionSigner";
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const payload = JSON.stringify({ email, role, expiresAt });
    const b64Payload = Buffer.from(payload).toString("base64url");
    const signature = crypto.createHmac("sha256", sessionSecret).update(b64Payload).digest("base64url");
    const token = `${b64Payload}.${signature}`;

    try {
      this.data.activeSessions.push({ token, email, role, expiresAt });
      this.persist();
    } catch {}

    return token;
  }

  validateSession(token: string): { email: string; role: string } | null {
    if (!token || typeof token !== "string") return null;

    // 1. Verify stateless HMAC signed token (works reliably across all Vercel serverless lambda instances)
    if (token.includes(".")) {
      const parts = token.split(".");
      if (parts.length === 2) {
        const [b64Payload, signature] = parts;
        const sessionSecret = process.env.OWNER_ACCESS_KEY || "WildInk2026!AuthorVault_SecretSessionSigner";
        const expectedSignature = crypto.createHmac("sha256", sessionSecret).update(b64Payload).digest("base64url");
        if (
          signature.length === expectedSignature.length &&
          crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
        ) {
          try {
            const payload = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf8"));
            if (payload && payload.expiresAt > Date.now()) {
              return { email: payload.email, role: payload.role };
            }
          } catch {}
        }
      }
    }

    // 2. Legacy activeSessions in-memory/file fallback
    try {
      this.data = this.load();
      const now = Date.now();
      const session = this.data.activeSessions?.find((s) => s.token === token && s.expiresAt > now);
      if (session) return { email: session.email, role: session.role };
    } catch {}

    return null;
  }

  destroySession(token: string) {
    try {
      this.data.activeSessions = this.data.activeSessions.filter((s) => s.token !== token);
      this.persist();
    } catch {}
  }

  // --- Newsletter Subscribers ---
  getSubscribers(): NewsletterSubscriber[] {
    return [...this.data.subscribers];
  }

  addSubscriber(email: string, sourcePage = "/"): { success: boolean; message: string } {
    const normalized = email.trim().toLowerCase();
    const exists = this.data.subscribers.find((s) => s.email === normalized);
    if (exists) {
      return { success: true, message: "You are already subscribed to the House of Wild Ink newsletter." };
    }
    this.data.subscribers.push({
      id: crypto.randomUUID(),
      email: normalized,
      consent_given: true,
      source_page: sourcePage,
      is_active: true,
      subscribed_at: new Date().toISOString(),
    });
    this.persist();
    return { success: true, message: "Welcome to House of Wild Ink. Your subscription has been confirmed." };
  }

  // --- Contact Messages ---
  getMessages(): ContactMessage[] {
    return [...this.data.messages].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  saveMessage(senderName: string, senderEmail: string, category: string, message: string): ContactMessage {
    const msg: ContactMessage = {
      id: crypto.randomUUID(),
      sender_name: senderName,
      sender_email: senderEmail,
      inquiry_category: category,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.data.messages.unshift(msg);
    this.persist();
    return msg;
  }

  markMessageRead(id: string): void {
    const m = this.data.messages.find((x) => x.id === id);
    if (m) {
      m.is_read = true;
      this.persist();
    }
  }

  // --- First-Party Privacy-Conscious Analytics ---
  logPageView(path: string, contentType: string, engaged = false, shared = false): void {
    if (path.startsWith("/ink-room") || path.startsWith("/api")) return; // Strictly exclude private routes
    const today = new Date().toISOString().split("T")[0];
    let entry = this.data.analytics.find((a) => a.metric_date === today && a.path === path);

    if (!entry) {
      entry = {
        id: crypto.randomUUID(),
        metric_date: today,
        path,
        content_type: contentType,
        page_views: 0,
        engaged_reads: 0,
        share_events: 0,
      };
      this.data.analytics.push(entry);
    }

    entry.page_views += 1;
    if (engaged) entry.engaged_reads += 1;
    if (shared) entry.share_events += 1;
    this.persist();
  }

  getAnalyticsSummary() {
    const totalViews = this.data.analytics.reduce((acc, curr) => acc + curr.page_views, 0);
    const totalEngaged = this.data.analytics.reduce((acc, curr) => acc + curr.engaged_reads, 0);
    const totalShares = this.data.analytics.reduce((acc, curr) => acc + curr.share_events, 0);

    // Group by path
    const pageMap = new Map<string, { views: number; engaged: number; shares: number; type: string }>();
    for (const a of this.data.analytics) {
      const prev = pageMap.get(a.path) || { views: 0, engaged: 0, shares: 0, type: a.content_type };
      prev.views += a.page_views;
      prev.engaged += a.engaged_reads;
      prev.shares += a.share_events;
      pageMap.set(a.path, prev);
    }

    const topPages = Array.from(pageMap.entries())
      .map(([path, stats]) => ({ path, ...stats }))
      .sort((a, b) => b.views - a.views);

    return {
      totalViews,
      totalEngaged,
      totalShares,
      engagementRate: totalViews > 0 ? Math.round((totalEngaged / totalViews) * 100) : 0,
      topPages,
      dailyBreakdown: [...this.data.analytics],
    };
  }
}

export const db = new Database();
