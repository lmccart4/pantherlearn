/**
 * Audit AI Literacy multi-section drift
 *
 * Shows which lessons exist in which sections, and flags inconsistencies.
 * Helps determine which section is the "source of truth" for each lesson.
 *
 * Usage: node scripts/audit-sections.cjs
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const SECTIONS = [
  { id: "Y9Gdhw5MTY8wMFt6Tlvj", label: "P4" },
  { id: "DacjJ93vUDcwqc260OP3", label: "P5" },
  { id: "M2MVSXrKuVCD9JQfZZyp", label: "P7" },
  { id: "fUw67wFhAtobWFhjwvZ5", label: "P9" },
];

async function main() {
  // Load all lessons from all sections
  const sectionData = {};
  for (const sec of SECTIONS) {
    const snap = await db.collection(`courses/${sec.id}/lessons`).get();
    sectionData[sec.id] = {};
    snap.docs.forEach((doc) => {
      sectionData[sec.id][doc.id] = doc.data();
    });
    console.log(`${sec.label} (${sec.id}): ${snap.size} lessons`);
  }

  // Union of all lesson IDs
  const allIds = new Set();
  for (const sec of SECTIONS) {
    Object.keys(sectionData[sec.id]).forEach((id) => allIds.add(id));
  }

  console.log(`\nTotal unique lesson IDs: ${allIds.size}\n`);

  // Categorize each lesson
  const consistent = [];
  const blocksdiffer = [];
  const missing = [];

  for (const lessonId of [...allIds].sort()) {
    const present = SECTIONS.filter((s) => sectionData[s.id][lessonId]);
    const absent = SECTIONS.filter((s) => !sectionData[s.id][lessonId]);

    if (absent.length > 0) {
      // Get title from whichever section has it
      const srcSec = present[0];
      const title = sectionData[srcSec.id][lessonId].title || "(no title)";
      missing.push({
        lessonId,
        title,
        presentIn: present.map((s) => s.label),
        missingFrom: absent.map((s) => s.label),
      });
      continue;
    }

    // All sections have it — check if blocks match
    const refBlocks = JSON.stringify(sectionData[SECTIONS[0].id][lessonId].blocks || []);
    let allMatch = true;
    const diffs = [];
    for (let i = 1; i < SECTIONS.length; i++) {
      const secBlocks = JSON.stringify(sectionData[SECTIONS[i].id][lessonId].blocks || []);
      if (secBlocks !== refBlocks) {
        allMatch = false;
        const refCount = (sectionData[SECTIONS[0].id][lessonId].blocks || []).length;
        const secCount = (sectionData[SECTIONS[i].id][lessonId].blocks || []).length;
        diffs.push(`${SECTIONS[i].label}: ${secCount} blocks (P4 has ${refCount})`);
      }
    }

    if (allMatch) {
      consistent.push(lessonId);
    } else {
      const title = sectionData[SECTIONS[0].id][lessonId].title || "(no title)";
      blocksdiffer.push({ lessonId, title, diffs });
    }
  }

  // Report
  console.log("=".repeat(60));
  console.log(`✅ CONSISTENT (${consistent.length} lessons — identical across all 4 sections)`);
  consistent.forEach((id) => {
    const title = sectionData[SECTIONS[0].id][id].title || "(no title)";
    console.log(`  ${id}: ${title}`);
  });

  console.log(`\n⚠️  BLOCKS DIFFER (${blocksdiffer.length} lessons — present in all sections but content differs)`);
  blocksdiffer.forEach((item) => {
    console.log(`  ${item.lessonId}: ${item.title}`);
    item.diffs.forEach((d) => console.log(`    ${d}`));
  });

  console.log(`\n❌ MISSING FROM SECTIONS (${missing.length} lessons — not in all 4 sections)`);
  missing.forEach((item) => {
    console.log(`  ${item.lessonId}: ${item.title}`);
    console.log(`    Present: ${item.presentIn.join(", ")} | Missing: ${item.missingFrom.join(", ")}`);
  });

  // Source of truth analysis
  console.log("\n" + "=".repeat(60));
  console.log("📊 SECTION LESSON COUNTS");
  for (const sec of SECTIONS) {
    const count = Object.keys(sectionData[sec.id]).length;
    console.log(`  ${sec.label}: ${count} lessons`);
  }

  // Which section has the most lessons?
  const counts = SECTIONS.map((s) => ({ label: s.label, count: Object.keys(sectionData[s.id]).length }));
  counts.sort((a, b) => b.count - a.count);
  console.log(`\n💡 ${counts[0].label} has the most lessons (${counts[0].count}) — likely the most up-to-date section.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
