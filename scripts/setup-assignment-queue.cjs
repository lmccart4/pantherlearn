/**
 * Set up the assignmentQueue Firestore collection
 *
 * Creates the collection with an example doc showing the schema.
 * Run once to initialize. Safe to re-run (won't overwrite existing docs).
 *
 * Usage: node scripts/setup-assignment-queue.cjs
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const SCHEMA_DOC = {
  // Lesson metadata
  title: "Example Lesson Title",
  course: "ai-literacy",           // physics | digital-literacy | ai-literacy
  unit: "unit-2-creativity",       // unit slug
  lessonId: "example-lesson-id",   // Firestore lesson doc ID (set after seeding)

  // Lifecycle status
  status: "drafted",               // drafted | approved | seeded | posted | synced
  statusHistory: [
    { status: "drafted", at: new Date().toISOString(), by: "parker" },
  ],

  // Content references
  seedScript: "scripts/seed-example.js",       // path to seed script (relative to pantherlearn/)
  lessonPlan: null,                             // path to lesson plan markdown (relative to Lachlan/)
  activityUrl: null,                            // URL of interactive activity (if any)

  // Scheduling
  dueDate: null,                   // ISO date string, e.g. "2026-04-15"
  classroomAssignmentId: null,     // Google Classroom courseWork ID (set after posting)

  // Multi-section tracking (for ai-literacy)
  sections: {
    "Y9Gdhw5MTY8wMFt6Tlvj": { seeded: false, lessonDocId: null },  // P4
    "DacjJ93vUDcwqc260OP3": { seeded: false, lessonDocId: null },  // P5
    "M2MVSXrKuVCD9JQfZZyp": { seeded: false, lessonDocId: null },  // P7
    "fUw67wFhAtobWFhjwvZ5": { seeded: false, lessonDocId: null },  // P9
  },

  // Metadata
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  createdBy: "parker",
  notes: "Example doc — delete this after verifying the schema",
};

async function main() {
  const docRef = db.collection("assignmentQueue").doc("_schema_example");
  const existing = await docRef.get();

  if (existing.exists) {
    console.log("Schema example doc already exists. Skipping.");
    console.log("Delete it manually if you want to recreate: _schema_example");
  } else {
    await docRef.set(SCHEMA_DOC);
    console.log("✅ Created assignmentQueue/_schema_example");
    console.log("\nSchema fields:");
    Object.keys(SCHEMA_DOC).forEach((k) => {
      console.log(`  ${k}: ${typeof SCHEMA_DOC[k] === "object" ? JSON.stringify(SCHEMA_DOC[k]) : SCHEMA_DOC[k]}`);
    });
  }

  console.log("\n📋 Assignment Queue Lifecycle:");
  console.log("  drafted   → Parker creates lesson plan + seed script");
  console.log("  approved  → Luke signs off (manual)");
  console.log("  seeded    → Mack runs seed script → all sections");
  console.log("  posted    → Mack creates Classroom assignment via gws");
  console.log("  synced    → Grade sync has run, grades flowing");
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
