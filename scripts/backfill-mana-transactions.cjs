/**
 * Backfill mana transaction subcollection from the legacy history array.
 *
 * For every courses/{courseId}/studentMana/{uid} doc:
 *   - If the parent doc has a `_txBackfilled` flag, skip (idempotent)
 *   - Otherwise: for each entry in its `history` array, write a doc to
 *     the `transactions` subcollection tagged with `_backfilledFrom: "history-array"`
 *   - Then set `_txBackfilled: true` on the parent
 *
 * Run: node scripts/backfill-mana-transactions.cjs [--dry]
 */
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const DRY = process.argv.includes("--dry");

async function main() {
  const courses = await db.collection("courses").get();
  let totalStudents = 0;
  let totalSkipped = 0;
  let totalBackfilled = 0;
  let totalEntriesWritten = 0;

  for (const courseDoc of courses.docs) {
    const courseId = courseDoc.id;
    const smSnap = await courseDoc.ref.collection("studentMana").get();
    if (smSnap.empty) continue;

    console.log(`\n== ${courseId} (${smSnap.size} students) ==`);

    for (const studentDoc of smSnap.docs) {
      totalStudents++;
      const data = studentDoc.data();

      if (data._txBackfilled) {
        totalSkipped++;
        continue;
      }

      const history = Array.isArray(data.history) ? data.history : [];
      if (history.length === 0) {
        // Nothing to backfill, but still mark so we don't re-check next run
        if (!DRY) {
          await studentDoc.ref.update({ _txBackfilled: true });
        }
        continue;
      }

      const txCol = studentDoc.ref.collection("transactions");

      // history is newest-first in the array; write them in chronological order
      // so autoId ordering roughly tracks timestamp
      const chronological = [...history].reverse();
      for (const entry of chronological) {
        const txDoc = {
          type: entry.type || "earn",
          amount: entry.amount || 0,
          reason: entry.reason || "",
          powerId: entry.powerId || null,
          balanceAfter: null, // not known from legacy array
          timestamp: entry.timestamp || new Date(0).toISOString(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          _backfilledFrom: "history-array",
        };
        if (DRY) {
          totalEntriesWritten++;
        } else {
          await txCol.add(txDoc);
          totalEntriesWritten++;
        }
      }

      if (!DRY) {
        await studentDoc.ref.update({ _txBackfilled: true });
      }
      totalBackfilled++;
      console.log(`  ✅ ${studentDoc.id}: ${history.length} entries${DRY ? " (dry)" : ""}`);
    }
  }

  console.log(`\n${DRY ? "[DRY RUN] " : ""}Summary:`);
  console.log(`  Students scanned: ${totalStudents}`);
  console.log(`  Skipped (already backfilled): ${totalSkipped}`);
  console.log(`  Backfilled: ${totalBackfilled}`);
  console.log(`  Transaction entries written: ${totalEntriesWritten}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
