// sync-ai-literacy-sections.cjs
// Copies lessons from P4 (source of truth) to P5, P7, P9.
// Rules:
//   - Only copies lessons that don't already exist in the target section
//   - All newly copied lessons are set to visible: false, regardless of P4's visibility
//   - Never modifies any lesson that already exists in a target section
//   - Never changes visibility of existing lessons

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const P4 = "Y9Gdhw5MTY8wMFt6Tlvj";
const TARGETS = [
  { id: "DacjJ93vUDcwqc260OP3", label: "P5" },
  { id: "M2MVSXrKuVCD9JQfZZyp", label: "P7" },
  { id: "fUw67wFhAtobWFhjwvZ5", label: "P9" },
];

async function sync() {
  // Fetch all P4 lessons
  const p4Snap = await db.collection(`courses/${P4}/lessons`).get();
  const p4Lessons = [];
  p4Snap.forEach(doc => p4Lessons.push({ id: doc.id, data: doc.data() }));
  console.log(`P4 has ${p4Lessons.length} lessons`);

  for (const target of TARGETS) {
    console.log(`\n── ${target.label} (${target.id}) ──`);

    // Fetch existing lesson IDs in this section
    const targetSnap = await db.collection(`courses/${target.id}/lessons`).get();
    const existingIds = new Set();
    targetSnap.forEach(doc => existingIds.add(doc.id));
    console.log(`  Existing: ${existingIds.size} lessons`);

    // Find lessons in P4 that are missing from this section
    const missing = p4Lessons.filter(l => !existingIds.has(l.id));
    console.log(`  Missing:  ${missing.length} lessons`);

    if (missing.length === 0) {
      console.log(`  Nothing to copy.`);
      continue;
    }

    // Copy each missing lesson with visible: false
    let copied = 0;
    for (const lesson of missing) {
      const newDoc = {
        ...lesson.data,
        visible: false,  // NEVER make anything newly visible
      };
      await db.doc(`courses/${target.id}/lessons/${lesson.id}`).set(newDoc);
      console.log(`  + ${lesson.id} (${lesson.data.title || "untitled"})`);
      copied++;
    }

    console.log(`  Copied ${copied} lessons to ${target.label}`);
  }

  console.log("\n✓ Sync complete");
}

sync().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
