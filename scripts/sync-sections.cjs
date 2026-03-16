/**
 * Sync AI Literacy lessons across all 4 sections
 *
 * Uses P4 as the source of truth. For each lesson in P4:
 * - Finds matching lesson in other sections by TITLE
 * - If blocks differ, overwrites with P4's blocks
 * - If lesson is missing entirely, copies from P4 with a new doc ID
 *
 * Skips stubs (lessons with <= 1 block) unless --include-stubs is passed.
 *
 * Usage:
 *   node scripts/sync-sections.cjs --dry-run         # Preview only
 *   node scripts/sync-sections.cjs                    # Apply changes
 *   node scripts/sync-sections.cjs --include-stubs    # Include 1-block lessons
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const SOURCE = { id: "Y9Gdhw5MTY8wMFt6Tlvj", label: "P4" };
const TARGETS = [
  { id: "DacjJ93vUDcwqc260OP3", label: "P5" },
  { id: "M2MVSXrKuVCD9JQfZZyp", label: "P7" },
  { id: "fUw67wFhAtobWFhjwvZ5", label: "P9" },
];

const dryRun = !process.argv.includes("--live");
const includeStubs = process.argv.includes("--include-stubs");

async function main() {
  if (dryRun) {
    console.log("🔍 DRY RUN — pass --live to apply changes\n");
  } else {
    console.log("🔧 LIVE RUN — syncing to Firestore\n");
  }

  // Load source lessons
  const sourceSnap = await db.collection(`courses/${SOURCE.id}/lessons`).get();
  const sourceLessons = {};
  sourceSnap.docs.forEach((doc) => {
    sourceLessons[doc.id] = doc.data();
  });
  console.log(`📚 Source (${SOURCE.label}): ${sourceSnap.size} lessons\n`);

  // Load target lessons indexed by title
  const targetsByTitle = {};
  for (const target of TARGETS) {
    const snap = await db.collection(`courses/${target.id}/lessons`).get();
    targetsByTitle[target.id] = {};
    snap.docs.forEach((doc) => {
      const data = doc.data();
      if (data.title) {
        targetsByTitle[target.id][data.title] = { id: doc.id, data };
      }
    });
    console.log(`  ${target.label}: ${snap.size} lessons loaded`);
  }
  console.log("");

  let synced = 0;
  let created = 0;
  let skipped = 0;

  for (const [srcId, srcData] of Object.entries(sourceLessons)) {
    const title = srcData.title;
    if (!title) continue;

    const blockCount = (srcData.blocks || []).length;
    if (blockCount <= 1 && !includeStubs) {
      console.log(`⏭️  Skipping stub: "${title}" (${blockCount} block)`);
      skipped++;
      continue;
    }

    for (const target of TARGETS) {
      const match = targetsByTitle[target.id][title];

      if (!match) {
        // Lesson doesn't exist in this section — create it
        console.log(`➕ ${target.label}: Creating "${title}" (${blockCount} blocks)`);
        created++;
        if (!dryRun) {
          // Use same doc ID as source when possible for consistency
          await db.doc(`courses/${target.id}/lessons/${srcId}`).set(srcData);
        }
      } else {
        // Lesson exists — check if blocks match
        const srcBlocks = JSON.stringify(srcData.blocks || []);
        const tgtBlocks = JSON.stringify(match.data.blocks || []);

        if (srcBlocks !== tgtBlocks) {
          const tgtBlockCount = (match.data.blocks || []).length;
          console.log(`🔄 ${target.label}: Updating "${title}" (${tgtBlockCount} → ${blockCount} blocks) [doc: ${match.id}]`);
          synced++;
          if (!dryRun) {
            await db.doc(`courses/${target.id}/lessons/${match.id}`).update({ blocks: srcData.blocks });
          }
        }
      }
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 Summary:`);
  console.log(`  ${synced} lessons updated (blocks synced from P4)`);
  console.log(`  ${created} lessons created in target sections`);
  console.log(`  ${skipped} stubs skipped`);
  if (dryRun) console.log(`\n⚠️  This was a dry run. Pass --live to apply.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
