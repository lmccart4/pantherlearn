// Backfill bias detective data from section courseIds into progress/{uid}/courses/ai-literacy/activities/bias-detective
// Run: node scripts/backfill-bias-progress.cjs

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

// Bias cases data for score calculation (simplified — just need clue points and biasesToFind count)
// We'll read the score directly from the investigation if available, otherwise estimate

async function backfill() {
  // Section courseIds that have bias data
  const sectionIds = ["DacjJ93vUDcwqc260OP3", "M2MVSXrKuVCD9JQfZZyp", "Y9Gdhw5MTY8wMFt6Tlvj", "fUw67wFhAtobWFhjwvZ5"];
  const parentCourseId = "ai-literacy";

  let total = 0, written = 0, skipped = 0;

  for (const sectionId of sectionIds) {
    const snap = await db.collection("courses").doc(sectionId).collection("biasInvestigations").get();
    console.log(`\nSection ${sectionId}: ${snap.size} investigations`);

    for (const d of snap.docs) {
      const inv = d.data();
      const uid = inv.studentId;
      if (!uid) { console.log(`  Skipping ${d.id} — no studentId`); skipped++; continue; }

      total++;

      // Check if progress doc already exists
      const progressRef = db.doc(`progress/${uid}/courses/${parentCourseId}/activities/bias-detective`);
      const existing = await progressRef.get();
      if (existing.exists && existing.data().activityScore != null) {
        skipped++;
        continue;
      }

      // Calculate score — use the score field if available, otherwise estimate from status
      let score = inv.score?.total;
      if (score == null) {
        // If investigation was submitted, give partial credit based on what we can see
        if (inv.status === "submitted" || inv.status === "completed") {
          const clues = (inv.discoveredClues || []).length;
          const biases = (inv.biasReport?.identifiedBiases || []).length;
          const mits = (inv.biasReport?.mitigations || []).filter((m) => m && m.length > 30).length;
          score = Math.min(100, clues * 5 + biases * 10 + mits * 10);
        } else {
          // Still active/incomplete — skip
          console.log(`  Skipping ${inv.studentName} — status: ${inv.status}`);
          skipped++;
          continue;
        }
      }

      const activityScore = Math.min(1, score / 100);

      await progressRef.set({
        activityScore,
        activityLabel: `${Math.round(activityScore * 100)}%`,
        activityType: "bias-detective",
        activityTitle: "AI Bias Detective",
        gradedAt: inv.submittedAt?.toDate?.() || inv.updatedAt?.toDate?.() || new Date(),
        backfilled: true,
      }, { merge: true });

      written++;
      console.log(`  ${inv.studentName}: score=${Math.round(activityScore * 100)}%`);
    }
  }

  console.log(`\nDone. Total: ${total}, Written: ${written}, Skipped: ${skipped}`);
}

backfill().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
