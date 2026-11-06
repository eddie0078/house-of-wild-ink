import fs from 'fs';
import path from 'path';

// Load scraped element caches
const poetryEls = JSON.parse(fs.readFileSync('scripts/poetry_elements.json', 'utf8'));
const dramaEls = JSON.parse(fs.readFileSync('scripts/drama_elements.json', 'utf8'));
const proseEls = JSON.parse(fs.readFileSync('scripts/prose_elements.json', 'utf8'));

// Helper to generate a clean URL-friendly slug
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Estimate reading time in minutes
function calcReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 180));
}

// -------------------------------------------------------------
// 1. EXTRACT POEMS & REFLECTIONS
// -------------------------------------------------------------
const poems = [];
let currentPoem = null;
const seenPoemTitles = new Set();

for (let i = 0; i < poetryEls.length; i++) {
  const el = poetryEls[i];

  if (el.tag === 'h2') {
    const title = el.text.trim();
    if (title.toLowerCase() === 'collection of poems' || title.includes('(c)')) continue;

    // Check if duplicate title already extracted
    const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenPoemTitles.has(normTitle)) {
      currentPoem = null; // skip duplicate block
      continue;
    }
    seenPoemTitles.add(normTitle);

    currentPoem = {
      title,
      align: el.align || 'left',
      lines: []
    };
    poems.push(currentPoem);
  } else if (currentPoem && el.tag === 'p') {
    const line = el.text.trim();
    if (!line) continue;

    // Detect the transition inside "I Know the Difference" to "The Day After Forever"
    if (line === 'The Day After Forever') {
      currentPoem = null; // stop adding to "I Know the Difference"
      continue;
    }

    currentPoem.lines.push(line);
  }
}

// Extract "The Day After Forever" reflection separately
const dayAfterIdx = poetryEls.findIndex(e => e.text === 'The Day After Forever');
let dayAfterReflection = null;
if (dayAfterIdx !== -1) {
  const subtitle = poetryEls[dayAfterIdx + 1]?.text || 'He Showed Me the Moon, Then Left Me in Ruins';
  const paragraphs = [];
  for (let i = dayAfterIdx + 2; i < poetryEls.length; i++) {
    const el = poetryEls[i];
    if (el.tag === 'h3' || el.text.includes('(c)')) break;
    if (el.text.trim()) paragraphs.push(el.text.trim());
  }

  dayAfterReflection = {
    title: 'The Day After Forever',
    subtitle,
    paragraphs,
    align: 'left'
  };
}

console.log(`Parsed ${poems.length} unique poems and 1 reflection.`);

// -------------------------------------------------------------
// 2. EXTRACT DRAMA & PLAYS
// -------------------------------------------------------------
const dramaWorks = [];

// Helper to parse blocks into structured DramaBlock[]
function parseDramaBlocks(lines) {
  const blocks = [];
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (
      line.startsWith('SCENE') ||
      line.startsWith('ACT ') ||
      line.startsWith('PHASE ') ||
      line.startsWith('CAST OF CHARACTERS') ||
      line.startsWith('SETTING')
    ) {
      blocks.push({ type: 'scene_heading', text: line });
    } else if (
      (line.startsWith('(') && line.endsWith(')')) ||
      line.startsWith('AT RISE:') ||
      line.startsWith('[AT RISE:') ||
      line.startsWith('SUGGESTION:') ||
      line.startsWith('Trouble brewing')
    ) {
      blocks.push({ type: 'stage_direction', text: line });
    } else if (
      /^[A-Z0-9\s—–'-]{2,35}$/.test(line) &&
      !line.includes('...') &&
      !line.includes('?') &&
      !line.includes('!') &&
      !line.includes(',')
    ) {
      blocks.push({ type: 'character', text: line });
    } else {
      // Check if line starts with SPEAKER: DIALOGUE inline e.g. "REVEREND: Hello..."
      const inlineMatch = line.match(/^([A-Z\s]{2,25}):\s*(.*)$/);
      if (inlineMatch) {
        blocks.push({ type: 'character', text: inlineMatch[1].trim() });
        if (inlineMatch[2].trim()) {
          blocks.push({ type: 'dialogue', text: inlineMatch[2].trim() });
        }
      } else {
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock && lastBlock.type === 'character') {
          blocks.push({ type: 'dialogue', text: line });
        } else {
          blocks.push({ type: 'paragraph', text: line });
        }
      }
    }
  }
  return blocks;
}

// Defined play boundaries in dramaEls
const playSpecs = [
  {
    title: 'My Sister, My Bed Sharer',
    subtitle: 'A stage play on family, identity, and the courage of acceptance',
    type: 'short_drama',
    startText: 'MY SISTER, MY BED SHARER',
    endText: 'THE WILL'
  },
  {
    title: 'The Will',
    subtitle: 'An audio drama in three scenes',
    type: 'audio_story',
    startText: 'THE WILL (AUDIO DRAMA)',
    endText: 'THE FOLLY OF MAN'
  },
  {
    title: 'The Folly of Man',
    subtitle: 'A stage play in four acts',
    type: 'short_drama',
    startText: 'THE FOLLY OF MAN',
    endText: 'THE TIME OF LIFE'
  },
  {
    title: 'The Time of Life',
    subtitle: 'A stage play in seven phases',
    type: 'short_drama',
    startText: 'THE TIME OF LIFE',
    endText: 'THE TALE OF THE TWO FAMILIES'
  },
  {
    title: 'The Tale of the Two Families',
    subtitle: 'A stage play in three scenes',
    type: 'short_drama',
    startText: 'THE TALE OF THE TWO FAMILIES',
    endText: 'REWRITE THE STARS'
  },
  {
    title: 'Rewrite the Stars (Tonight)',
    subtitle: 'A stage play in nine scenes',
    type: 'short_drama',
    startText: 'REWRITE THE STARS',
    endText: '(c) 2024'
  }
];

for (const spec of playSpecs) {
  const startIdx = dramaEls.findIndex(e => e.text.includes(spec.startText));
  if (startIdx === -1) {
    console.warn(`Could not find start for ${spec.title}`);
    continue;
  }
  const endIdx = dramaEls.findIndex((e, idx) => idx > startIdx && e.text.includes(spec.endText));
  const sliceEnd = endIdx !== -1 ? endIdx : dramaEls.length;

  const rawLines = dramaEls.slice(startIdx + 1, sliceEnd).map(e => e.text.trim()).filter(Boolean);
  const structuredBody = parseDramaBlocks(rawLines);
  const rawContent = rawLines.join('\n\n');

  dramaWorks.push({
    title: spec.title,
    subtitle: spec.subtitle,
    contentType: spec.type,
    rawContent,
    structuredBody
  });
}

console.log(`Parsed ${dramaWorks.length} dramatic works.`);

// -------------------------------------------------------------
// 3. EXTRACT PROSE NOVELLA (Taraji Says No to Plastic!)
// -------------------------------------------------------------
const proseWorks = [];

const tarajiIdx = proseEls.findIndex(e => e.text.includes('TARAJI SAYS NO TO PLASTIC!'));
if (tarajiIdx !== -1) {
  const endIdx = proseEls.findIndex((e, idx) => idx > tarajiIdx && (e.tag === 'h3' || e.text.includes('(c)')));
  const sliceEnd = endIdx !== -1 ? endIdx : proseEls.length;

  const tarajiElements = proseEls.slice(tarajiIdx + 1, sliceEnd);
  const structuredBody = [];
  const rawParagraphs = [];

  for (const el of tarajiElements) {
    const text = el.text.trim();
    if (!text || text === 'TARAJI SAYS NO TO PLASTIC!') continue;

    if (el.tag === 'h2' || text.startsWith('PROLOGUE') || text.startsWith('CHAPTER') || text.startsWith('The ')) {
      structuredBody.push({ type: 'scene_heading', text });
      rawParagraphs.push(`\n### ${text}\n`);
    } else {
      structuredBody.push({ type: 'paragraph', text });
      rawParagraphs.push(text);
    }
  }

  proseWorks.push({
    title: 'Taraji Says No to Plastic!',
    subtitle: 'An environmental novella for brave young minds across Ghana and beyond',
    contentType: 'story',
    rawContent: rawParagraphs.join('\n\n').trim(),
    structuredBody,
    tags: ['Young Adult', 'Environment', 'Ghana', 'Conservation', 'Cape Coast', 'Hope']
  });
}

console.log(`Parsed ${proseWorks.length} prose novella.`);

// -------------------------------------------------------------
// 4. MAP TO CONTENT ITEMS
// -------------------------------------------------------------
const timestamp = '2026-11-06T10:00:00.000Z';
const newContentItems = [];

// Existing published items in the database that must be preserved
const dbPath = path.resolve('data/house_of_wild.json');
const currentDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Retain Stones if already verified, or update it
const existingIds = new Set(currentDb.content.map(c => c.id));
const existingSlugs = new Set(currentDb.content.map(c => c.slug));

// Ingest poems
for (const p of poems) {
  const slug = slugify(p.title);
  // If Stones already exists, preserve its ID
  if (slug === 'stones' && existingSlugs.has('stones')) continue;

  const rawContent = p.lines.join('\n');
  const excerpt = p.lines.slice(0, 3).join(' ') + (p.lines.length > 3 ? '...' : '');

  newContentItems.push({
    id: `poem-${slug}`,
    slug,
    title: p.title,
    content_type: 'poem',
    raw_content: rawContent,
    excerpt,
    author_credit: 'L.E. Daniels | DEFFA',
    alignment: p.align || 'left',
    reading_time_minutes: calcReadingTime(rawContent),
    tags: ['Poetry', 'Reflection', 'L.E. Daniels'],
    status: 'published',
    published_at: timestamp,
    is_homepage_featured: ['stones', 'my-heart', 'still-here', 'i-know-the-difference'].includes(slug),
    seo_title: `${p.title} — Poem by Linda Emefa Daniels`,
    seo_description: `${excerpt.slice(0, 150)} A poem by L.E. Daniels | DEFFA on House of Wild Ink.`,
    version: 1,
    updated_at: timestamp,
    created_at: timestamp
  });
}

// Ingest Day After Forever reflection
if (dayAfterReflection) {
  const rawContent = dayAfterReflection.paragraphs.join('\n\n');
  const excerpt = dayAfterReflection.paragraphs[0]?.slice(0, 160) + '...';
  newContentItems.push({
    id: 'reflection-the-day-after-forever',
    slug: 'the-day-after-forever',
    title: dayAfterReflection.title,
    subtitle: dayAfterReflection.subtitle,
    content_type: 'reflection',
    raw_content: rawContent,
    excerpt,
    author_credit: 'L.E. Daniels | DEFFA',
    alignment: 'left',
    reading_time_minutes: calcReadingTime(rawContent),
    tags: ['Reflection', 'Love', 'Vulnerability', 'Heartbreak', 'Truth'],
    status: 'published',
    published_at: timestamp,
    is_homepage_featured: true,
    seo_title: 'The Day After Forever — Reflection by Linda Emefa Daniels',
    seo_description: 'He Showed Me the Moon, Then Left Me in Ruins. An intimate personal reflection by L.E. Daniels | DEFFA.',
    version: 1,
    updated_at: timestamp,
    created_at: timestamp
  });
}

// Ingest Drama works
for (const d of dramaWorks) {
  const slug = slugify(d.title);
  if (existingSlugs.has(slug)) continue;

  const excerpt = (d.rawContent.slice(0, 180).replace(/\n+/g, ' ') + '...').trim();

  newContentItems.push({
    id: `drama-${slug}`,
    slug,
    title: d.title,
    subtitle: d.subtitle,
    content_type: d.contentType,
    raw_content: d.rawContent,
    structured_body: d.structuredBody,
    excerpt,
    author_credit: 'Linda Emefa Daniels',
    alignment: 'left',
    reading_time_minutes: calcReadingTime(d.rawContent),
    tags: ['Drama', 'Stage Play', 'Theatre', 'Linda Emefa Daniels'],
    status: 'published',
    published_at: timestamp,
    is_homepage_featured: ['my-sister-my-bed-sharer', 'the-will'].includes(slug),
    seo_title: `${d.title} — Play by Linda Emefa Daniels`,
    seo_description: `${excerpt.slice(0, 150)} A dramatic work by Linda Emefa Daniels on House of Wild Ink.`,
    version: 1,
    updated_at: timestamp,
    created_at: timestamp
  });
}

// Ingest Prose works (Taraji Says No to Plastic!)
for (const pr of proseWorks) {
  const slug = slugify(pr.title);
  if (existingSlugs.has(slug)) continue;

  const excerpt = (pr.rawContent.slice(0, 180).replace(/\n+/g, ' ') + '...').trim();

  newContentItems.push({
    id: `story-${slug}`,
    slug,
    title: pr.title,
    subtitle: pr.subtitle,
    content_type: pr.contentType,
    raw_content: pr.rawContent,
    structured_body: pr.structuredBody,
    excerpt,
    author_credit: 'Linda Emefa Daniels',
    alignment: 'left',
    reading_time_minutes: calcReadingTime(pr.rawContent),
    tags: pr.tags,
    status: 'published',
    published_at: timestamp,
    is_homepage_featured: true,
    seo_title: `${pr.title} — Novella by Linda Emefa Daniels`,
    seo_description: `${excerpt.slice(0, 150)} An environmental story by Linda Emefa Daniels on House of Wild Ink.`,
    version: 1,
    updated_at: timestamp,
    created_at: timestamp
  });
}

console.log(`Generated ${newContentItems.length} total new authentic content items.`);

// -------------------------------------------------------------
// 5. UPDATE COLLECTIONS
// -------------------------------------------------------------
const allContent = [...currentDb.content, ...newContentItems];

const poetryIds = allContent.filter(c => c.content_type === 'poem' || c.content_type === 'reflection').map(c => c.id);
const dramaIds = allContent.filter(c => c.content_type === 'short_drama' || c.content_type === 'audio_story').map(c => c.id);
const proseIds = allContent.filter(c => c.content_type === 'story' || c.content_type === 'essay').map(c => c.id);

const updatedCollections = [
  {
    id: 'coll-stones-and-quiet-fires',
    slug: 'stones-and-quiet-fires',
    title: 'Stones & Quiet Fires',
    subtitle: 'Original poems of faith, selfhood, and human vulnerability',
    description: 'Thirty-four original poems penned by Linda Emefa Daniels, exploring the quiet courage of selfhood, unyielding faith, heartbreak, and the sacred difference between pretending and choosing.',
    curator_note: 'Curated by Linda Emefa Daniels (L.E. Daniels | DEFFA).',
    is_featured: true,
    is_public: true,
    status: 'published',
    published_at: timestamp,
    sort_order: 1,
    item_ids: poetryIds,
    created_at: timestamp,
    updated_at: timestamp
  },
  {
    id: 'coll-all-the-worlds-a-stage',
    slug: 'all-the-worlds-a-stage',
    title: "All the World's a Stage",
    subtitle: 'Dramatic stage plays and audio theater scripts',
    description: 'The complete theatrical repertoire of BFA dramatist Linda Emefa Daniels, recipient of the Sophia Lokko Memorial Prize. Ranging from provocative family conflicts to allegorical morality plays.',
    curator_note: 'Curated by Linda Emefa Daniels for House of Wild Ink.',
    is_featured: true,
    is_public: true,
    status: 'published',
    published_at: timestamp,
    sort_order: 2,
    item_ids: dramaIds,
    created_at: timestamp,
    updated_at: timestamp
  },
  {
    id: 'coll-tales-from-the-coast',
    slug: 'tales-from-the-coast',
    title: 'Tales from the Coast',
    subtitle: 'Environmental allegories and episodic prose',
    description: 'Prose narratives grounded in Ghanaian life and environmental stewardship, featuring the epic young adult novella Taraji Says No to Plastic! set across the golden Sahara and Cape Coast.',
    curator_note: 'Curated by Linda Emefa Daniels.',
    is_featured: true,
    is_public: true,
    status: 'published',
    published_at: timestamp,
    sort_order: 3,
    item_ids: proseIds,
    created_at: timestamp,
    updated_at: timestamp
  },
  // Preserve inaugural Earth and Ink collection
  currentDb.collections.find(c => c.id === 'coll-earth-and-ink') || {
    id: 'coll-earth-and-ink',
    slug: 'earth-and-ink',
    title: 'Earth and Ink',
    subtitle: 'Reflections on humanity and quiet endurance',
    description: 'Inaugural opening collection of House of Wild Ink.',
    is_featured: false,
    is_public: true,
    status: 'published',
    published_at: timestamp,
    sort_order: 4,
    item_ids: ['poem-stones-verified', 'drama-threshold-draft', 'audio-first-garden'],
    created_at: timestamp,
    updated_at: timestamp
  }
];

// -------------------------------------------------------------
// 6. UPDATE LINDA EMEFA DANIELS' AUTHOR PROFILE & AWARDS
// -------------------------------------------------------------
const updatedPeople = currentDb.people.map(p => {
  if (p.id === 'profile-linda-daniels' || p.slug === 'linda-emefa-daniels') {
    return {
      ...p,
      short_bio: 'Writer, dramatist, and creator of House of Wild Ink. BFA in Theatre Arts, Sophia Lokko Memorial Prize winner. L.E. Daniels | DEFFA.',
      full_bio: 'Born in Ghana with a Bachelor of Fine Art Degree in Theatre from the University of Ghana, Linda Emefa Daniels is a dramatist, poet, and storyteller awarded the prestigious 2021/2022 Sophia Lokko Memorial Prize for Best Graduating Student in Theatre Arts.\n\n"If a nation loses its storytellers, it loses its childhood." — Peter Handke\n\nLinda writes from lived experiences, keen observation, Christian faith, cultural heritage, and the quiet and loud conversations of life. Her prose and verse delve into the human condition with unapologetic vulnerability and hope.',
      roles: ['Author', 'Dramatist', 'Poet', 'Founder'],
      links: {
        linkedin: 'https://linkedin.com/in/linda-emefa-daniels'
      },
      selected_work_ids: [
        'poem-stones-verified',
        'drama-my-sister-my-bed-sharer',
        'story-taraji-says-no-to-plastic',
        'reflection-the-day-after-forever',
        'poem-i-know-the-difference',
        'poem-still-here'
      ],
      awards: [
        {
          year: '2021/2022',
          title: 'Sophia Lokko Memorial Prize for Best Graduating Student in Theatre Arts',
          institution: 'University of Ghana / School of Performing Arts'
        }
      ],
      updated_at: timestamp
    };
  }
  return p;
});

// Clean up scratch revisions
const sanitizedRevisions = [];

// Assemble updated DB
const updatedDb = {
  ...currentDb,
  content: allContent,
  collections: updatedCollections,
  people: updatedPeople,
  revisions: sanitizedRevisions
};

fs.writeFileSync(dbPath, JSON.stringify(updatedDb, null, 2));
console.log(`Successfully updated ${dbPath}:`);
console.log(`- Total Works: ${allContent.length}`);
console.log(`- Collections: ${updatedCollections.length}`);
console.log(`- Author Profile updated with Sophia Lokko Memorial Prize`);
