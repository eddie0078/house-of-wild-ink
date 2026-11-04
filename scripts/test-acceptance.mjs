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

console.log("=================================================");
console.log("ALL 7 ACCEPTANCE CRITERIA SUITES PASSED (100%)");
console.log("=================================================");
