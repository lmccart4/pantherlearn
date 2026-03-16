/**
 * Fix embed blocks missing `scored: true`
 *
 * Scans all courses for embed blocks without scored:true and patches them.
 * Run with --dry-run first to preview changes.
 *
 * Usage:
 *   node scripts/fix-scored-true.cjs --dry-run    # Preview only
 *   node scripts/fix-scored-true.cjs               # Apply fixes
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const ALL_COURSES = [
  "physics",
  "digital-literacy",
  "Y9Gdhw5MTY8wMFt6Tlvj",
  "DacjJ93vUDcwqc260OP3",
  "M2MVSXrKuVCD9JQfZZyp",
  "fUw67wFhAtobWFhjwvZ5",
];

const dryRun = process.argv.includes("--dry-run");

async function main() {
  console.log(dryRun ? "🔍 DRY RUN — no changes will be made\n" : "🔧 LIVE RUN — patching Firestore\n");

  let fixed = 0;

  for (const courseId of ALL_COURSES) {
    const lessonsSnap = await db.collection(`courses/${courseId}/lessons`).get();

    for (const doc of lessonsSnap.docs) {
      const data = doc.data();
      if (!data.blocks || !Array.isArray(data.blocks)) continue;

      let needsUpdate = false;
      const updatedBlocks = data.blocks.map((block) => {
        if (block.type === "embed" && block.scored !== true) {
          needsUpdate = true;
          console.log(`  ${dryRun ? "Would fix" : "Fixing"}: ${courseId}/${doc.id} → block "${block.id}"`);
          return { ...block, scored: true };
        }
        return block;
      });

      if (needsUpdate) {
        fixed++;
        if (!dryRun) {
          await db.doc(`courses/${courseId}/lessons/${doc.id}`).update({ blocks: updatedBlocks });
        }
      }
    }
  }

  console.log(`\n${dryRun ? "Would fix" : "Fixed"} ${fixed} lessons with missing scored:true`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
