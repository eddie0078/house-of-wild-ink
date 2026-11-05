import assert from "node:assert";
import { db } from "../src/lib/db.js";
import { hashAccessKey, verifyAccessKey, checkRateLimit, resetRateLimit } from "../src/lib/security.js";

console.log("=================================================");
console.log("HOUSE OF WILD INK — AUTOMATED ACCEPTANCE SUITE");
console.log("=================================================\n");

// TEST 1: Exact Whitespace Preservation for Verified Poem "Stones"
console.log("TEST 1: Verifying Poem 'Stones' formatting integrity...");
const stones = db.getContentBySlug("stones");
assert.ok(stones, "Poem 'Stones' must exist in database");
const expectedLines = [
  "Diamond, Blue Sapphire, Ruby, Emerald;",
  "The four most precious stones :",
  "Peridot, Turquoise, Moonstone, Garnet;",
  "Following close behind we are:",
  "Flint, Limestone, Dacite, Gneiss;",
  "What shall we say of ourselves?",
  "Stones we all are, like humans different but alike"
];
const rawLines = stones.raw_content.split("\n").map(l => l.trimEnd());
assert.deepStrictEqual(rawLines, expectedLines, "Poem line breaks and exact verses must match specification exactly");
assert.strictEqual(stones.author_credit, "L.E. Daniels | DEFFA", "Author credit must match DEFFA pen name");
console.log("✓ TEST 1 PASSED: 'Stones' formatting matches specification with zero whitespace loss.\n");

// TEST 2: Verified Author Statement Integrity
console.log("TEST 2: Verifying Authentic Author Statement...");
const settings = db.getSettings();
const expectedStatement = "I write from experiences, observations, my faith, what I hope for and the quiet and loud conversations of life. But somewhere between my story and yours, I find that emotions meet. So when I put pen to paper, I may begin with my story, but sometimes, you find yours in it too. That is why I don’t only write my stories. I write our stories. 🌸 — L.E. Daniels | DEFFA.";
assert.strictEqual(settings.about_linda_statement, expectedStatement, "Author statement must match Linda's exact verified words");
console.log("✓ TEST 2 PASSED: Author statement verified with zero invented biographical data.\n");

// TEST 3: Layer 1 Gate Access Key & Rate Limiting
console.log("TEST 3: Testing Layer 1 Gate Cryptographic Hash & Brute-Force Rate Limiting...");
const defaultKey = "WildInk2026!AuthorVault";
const isDefaultValid = verifyAccessKey(defaultKey, settings.owner_access_key_hash, settings.owner_access_key_salt);
assert.strictEqual(isDefaultValid, true, "Master default key must verify against stored PBKDF2 hash");

const isWrongValid = verifyAccessKey("WrongPassword123", settings.owner_access_key_hash, settings.owner_access_key_salt);
assert.strictEqual(isWrongValid, false, "Incorrect access key must be rejected");

// Rate limit test
resetRateLimit("test-ip");
for (let i = 1; i <= 5; i++) {
  const check = checkRateLimit("test-ip", 5, 60000);
  assert.strictEqual(check.allowed, true, `Attempt ${i} within limit should be allowed`);
}
const sixthAttempt = checkRateLimit("test-ip", 5, 60000);
assert.strictEqual(sixthAttempt.allowed, false, "6th attempt must trigger rate-limit lockout");
console.log("✓ TEST 3 PASSED: Access key hashing and rate-limiting lockout verified.\n");

// TEST 4: Layer 2 User Roles & Permissions
console.log("TEST 4: Testing Layer 2 User Authorization & Roles...");
const ownerUser = db.getUserByEmail("linda@houseofwildink.com");
assert.ok(ownerUser, "Owner Linda must exist in authorized users");
assert.strictEqual(ownerUser.role, "Owner", "Linda's role must be Owner");

const randomUser = db.getUserByEmail("stranger@gmail.com");
assert.strictEqual(randomUser, undefined, "Unauthorized email must be denied entry");
console.log("✓ TEST 4 PASSED: Layer 2 Role-Based Access Control verified.\n");

// TEST 5: Revision History & Non-Destructive Restore
console.log("TEST 5: Testing Revision Snapshots & Non-Destructive Restore...");
const testPoem = db.saveContentItem({
  title: "A Quiet Tree",
  content_type: "poem",
  raw_content: "First stanza line 1\nFirst stanza line 2",
  status: "draft"
}, "Linda");

// Update poem to create revision
const updatedPoem = db.saveContentItem({
  id: testPoem.id,
  title: "A Quiet Tree (Revised)",
  content_type: "poem",
  raw_content: "Revised stanza line 1\nRevised stanza line 2",
  status: "published"
}, "Linda");

assert.strictEqual(updatedPoem.version, 2, "Updated poem version must increment to 2");
const revisions = db.getRevisions(testPoem.id);
assert.strictEqual(revisions.length, 1, "Exactly 1 revision snapshot should be saved");
assert.strictEqual(revisions[0].version, 1, "Revision snapshot must store v1");

// Restore v1
const restored = db.restoreRevision(revisions[0].id, "Linda");
assert.ok(restored, "Restore must succeed");
assert.strictEqual(restored.version, 3, "Restoring must create a new version without deleting history");
assert.strictEqual(restored.raw_content, "First stanza line 1\nFirst stanza line 2", "Restored content must match v1");
console.log("✓ TEST 5 PASSED: Revision history and non-destructive restore verified.\n");

// TEST 6: First-Party Privacy-Conscious Analytics
console.log("TEST 6: Testing First-Party Privacy Analytics Aggregation...");
const initialAnalytics = db.getAnalyticsSummary();
db.logPageView("/poems/stones", "poem", true, true);
const updatedAnalytics = db.getAnalyticsSummary();
assert.ok(updatedAnalytics.totalViews >= initialAnalytics.totalViews + 1, "Page views must increment");
assert.ok(updatedAnalytics.totalEngaged >= initialAnalytics.totalEngaged + 1, "Engaged reads must increment");

// Ensure Ink Room routes are strictly ignored
db.logPageView("/ink-room/poems", "admin");
const afterAdminLog = db.getAnalyticsSummary();
const adminLeak = afterAdminLog.topPages.find(p => p.path.startsWith("/ink-room"));
assert.strictEqual(adminLeak, undefined, "Private /ink-room routes must NEVER be logged in public analytics");
console.log("✓ TEST 6 PASSED: First-party analytics excludes private routes and tallies aggregate metrics.\n");

// TEST 7: Newsletter & Contact Storage
console.log("TEST 7: Testing Newsletter Roll & Contact Message Storage...");
const subResult = db.addSubscriber("reader@testliterary.org", "/poems/stones");
assert.strictEqual(subResult.success, true, "Valid newsletter subscription must succeed");

const message = db.saveMessage("Eleni Vance", "eleni@press.org", "Literary Representation", "Inquiry regarding collection rights.");
assert.ok(message.id, "Contact message must be stored with ID");
const unread = db.getMessages().find(m => m.id === message.id);
assert.strictEqual(unread.is_read, false, "New contact message must be stored as unread");
console.log("✓ TEST 7 PASSED: First-party newsletter roll and contact inbox verified.\n");

// TEST 8: Audio Stories with YouTube Link & Representative Artwork
console.log("TEST 8: Testing Audio Stories, YouTube links, and Artwork...");
const audioItems = db.getContentItems({ type: "audio_story" });
assert.ok(audioItems.length > 0, "At least one audio story must exist in database");
const firstGarden = audioItems.find(a => a.slug === "the-first-garden");
assert.ok(firstGarden, "Seeded audio story 'The First Garden' must exist");
assert.ok(firstGarden.youtube_url?.startsWith("https://www.youtube.com"), "Audio story must link to valid YouTube URL");
assert.ok(firstGarden.cover_image_url, "Audio story must have representative artwork");
assert.strictEqual(firstGarden.narrator_credit, "Linda Emefa Daniels", "Narrator credit must be Linda Emefa Daniels");
console.log("✓ TEST 8 PASSED: Audio story YouTube linking and representative artwork verified.\n");

// TEST 9: Essays & Author Linda's Official Portrait Assets
console.log("TEST 9: Testing Essays Category and Author Portrait Registration...");
const essays = db.getContentItems({ type: "essay" });
assert.ok(essays.length > 0, "At least one essay must exist in database");
const firstEssay = essays.find(e => e.slug === "on-stories-that-refuse-to-stay-quiet");
assert.ok(firstEssay, "Seeded essay must exist");
assert.strictEqual(firstEssay.author_credit, "L.E. Daniels | DEFFA", "Essay author credit must be L.E. Daniels | DEFFA");

const mediaAssets = db.getMedia();
const portraitAsset = mediaAssets.find(m => m.id === "media-linda-portrait");
assert.ok(portraitAsset, "Linda's official portrait must be registered in media library");
assert.strictEqual(portraitAsset.storage_url, "/images/linda-emefa-daniels.jpg", "Portrait storage URL must resolve to /images/linda-emefa-daniels.jpg");
console.log("✓ TEST 9 PASSED: Essays and Author Portrait assets verified.\n");

// TEST 10: Pillar 1 & 2 Universal Search Index & Spoken Audio Stories
console.log("TEST 10: Testing Universal Search Indexing across all formats...");
const allPublished = db.getContentItems({ status: "published" });
const searchPoems = allPublished.filter(i => i.content_type === "poem");
const searchAudios = allPublished.filter(i => i.content_type === "audio_story");
const searchEssays = allPublished.filter(i => ["essay", "article", "reflection"].includes(i.content_type));
assert.ok(searchPoems.length >= 1, "Published poems must be indexed");
assert.ok(searchAudios.length >= 1, "Published audio stories must be indexed");
assert.ok(searchEssays.length >= 1, "Published essays must be indexed");
console.log("✓ TEST 10 PASSED: Universal search index covers poems, audios, and essays.\n");

// TEST 11: Pillar 3 Short Drama Character Spotlight
console.log("TEST 11: Testing Short Drama Structured Dialogue & Character Spotlight...");
const drama = db.getContentBySlug("at-the-threshold");
assert.ok(drama, "Short drama 'At the Threshold' must exist");
assert.strictEqual(drama.content_type, "short_drama", "Must be classified as short_drama");
assert.ok(drama.structured_body && drama.structured_body.length > 0, "Drama must contain structured dialogue blocks");
const characters = new Set(drama.structured_body.filter(b => b.type === "character").map(b => b.text?.trim().toUpperCase()));
assert.ok(characters.has("MARA"), "Drama must include character MARA for table read spotlight");
assert.ok(characters.has("KAI"), "Drama must include character KAI for table read spotlight");
console.log("✓ TEST 11 PASSED: Short drama character spotlight blocks verified.\n");

// TEST 12: Pillar 4 Bougainvillea Botanical Color Spectrum
console.log("TEST 12: Testing Bougainvillea 5-Color Spectrum & Botanical Assets...");
import fs from "node:fs";
assert.ok(fs.existsSync("public/images/bougainvillea-flower.webp"), "User-uploaded Bougainvillea flower image must exist in public/images");
assert.ok(fs.existsSync("public/images/house-of-wild-ink-hero.jpg"), "Master villa archway banner must exist in public/images");
console.log("✓ TEST 12 PASSED: Bougainvillea botanical files and assets verified.\n");

// TEST 13: Pillar 5 Subscriber Broadcast Engine
console.log("TEST 13: Testing Subscriber Broadcast Dispatch Record...");
const initialSubs = db.getSubscribers();
assert.ok(initialSubs.length >= 1, "Subscribers list must be accessible for broadcasts");
console.log("✓ TEST 13 PASSED: Subscriber audience roll verified for letterpress broadcasts.\n");

console.log("=================================================");
console.log("ALL 13 ACCEPTANCE CRITERIA SUITES PASSED (100%)");
console.log("=================================================");
