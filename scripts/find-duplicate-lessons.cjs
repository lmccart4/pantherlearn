/**
 * Find duplicate lessons (same or very similar titles) within each course.
 * For each duplicate pair, checks if student progress exists.
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

// All known courseIds — top-level course docs and section-specific docs
const COURSE_IDS = [
  // Top-level / canonical
  "ai-literacy",
  "physics",
  "digital-literacy",
  "sat-prep",
  "psat-prep",
  // AI Literacy sections
  "Y9Gdhw5MTY8wMFt6Tlvj",  // P4
  "DacjJ93vUDcwqc260OP3",  // P5
  "M2MVSXrKuVCD9JQfZZyp",  // P7
  "fUw67wFhAtobWFhjwvZ5",  // P9
];

const COURSE_LABELS = {
  "ai-literacy": "AI Literacy (canonical)",
  "physics": "Physics",
  "digital-literacy": "Digital Literacy",
  "sat-prep": "SAT Prep",
  "psat-prep": "PSAT Prep",
  "Y9Gdhw5MTY8wMFt6Tlvj": "AI Literacy P4",
  "DacjJ93vUDcwqc260OP3": "AI Literacy P5",
  "M2MVSXrKuVCD9JQfZZyp": "AI Literacy P7",
  "fUw67wFhAtobWFhjwvZ5": "AI Literacy P9",
};

function normalize(title) {
  return (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a, b) {
  // Exact normalized match
  if (normalize(a) === normalize(b)) return 1.0;
  // Check if one is a prefix of the other (catches trailing numbers, etc.)
  const na = normalize(a);
  const nb = normalize(b);
  if (na.startsWith(nb) || nb.startsWith(na)) {
    const longer = Math.max(na.length, nb.length);
    const shorter = Math.min(na.length, nb.length);
    if (shorter / longer > 0.8) return 0.9;
  }
  return 0;
}

async function checkProgress(courseId, lessonId) {
  const progressRef = db.collection(`courses/${courseId}/lessons/${lessonId}/progress`);
  const snap = await progressRef.get();
  const docs = snap.docs.filter(d => {
    const data = d.data();
    const name = (data.studentName || data.name || "").toLowerCase();
    return name !== "joe" && name !== "test";
  });
  return {
    total: snap.size,
    realStudents: docs.length,
    studentNames: docs.slice(0, 5).map(d => {
      const data = d.data();
      return data.studentName || data.name || d.id;
    }),
  };
}

async function main() {
  console.log("=== DUPLICATE LESSON FINDER ===\n");

  for (const courseId of COURSE_IDS) {
    const label = COURSE_LABELS[courseId] || courseId;
    const snap = await db.collection(`courses/${courseId}/lessons`).get();

    if (snap.empty) {
      continue;
    }

    const lessons = snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title || "(no title)",
        order: d.order !== undefined ? d.order : null,
        visible: d.visible !== undefined ? d.visible : null,
        blockCount: (d.blocks || []).length,
        unit: d.unit || null,
      };
    });

    // Find duplicates: group by normalized title
    const byNorm = {};
    for (const lesson of lessons) {
      const key = normalize(lesson.title);
      if (!key) continue;
      if (!byNorm[key]) byNorm[key] = [];
      byNorm[key].push(lesson);
    }

    // Also check for near-matches across different normalized keys
    const keys = Object.keys(byNorm);
    const mergedGroups = [];
    const visited = new Set();

    for (let i = 0; i < keys.length; i++) {
      if (visited.has(keys[i])) continue;
      const group = [...byNorm[keys[i]]];
      visited.add(keys[i]);

      for (let j = i + 1; j < keys.length; j++) {
        if (visited.has(keys[j])) continue;
        if (similarity(keys[i], keys[j]) >= 0.9) {
          group.push(...byNorm[keys[j]]);
          visited.add(keys[j]);
        }
      }

      if (group.length > 1) {
        mergedGroups.push(group);
      }
    }

    if (mergedGroups.length === 0) {
      console.log(`--- ${label} (${courseId}): ${lessons.length} lessons, NO duplicates ---\n`);
      continue;
    }

    console.log(`\n${"=".repeat(80)}`);
    console.log(`COURSE: ${label} (${courseId}) — ${lessons.length} total lessons`);
    console.log(`Found ${mergedGroups.length} duplicate group(s)`);
    console.log("=".repeat(80));

    for (const group of mergedGroups) {
      console.log(`\n  DUPLICATE GROUP: "${group[0].title}"`);
      if (group.some(g => g.title !== group[0].title)) {
        console.log(`  (Similar titles in group: ${[...new Set(group.map(g => g.title))].join(" | ")})`);
      }
      console.log("  " + "-".repeat(70));

      for (const lesson of group) {
        const progress = await checkProgress(courseId, lesson.id);
        const progressStr = progress.realStudents > 0
          ? `YES (${progress.realStudents} students: ${progress.studentNames.join(", ")}${progress.realStudents > 5 ? "..." : ""})`
          : progress.total > 0
            ? `Only test/Joe (${progress.total} docs, 0 real)`
            : "NONE";

        console.log(`  Lesson ID:   ${lesson.id}`);
        console.log(`  Title:       ${lesson.title}`);
        console.log(`  Order:       ${lesson.order}`);
        console.log(`  Visible:     ${lesson.visible}`);
        console.log(`  Blocks:      ${lesson.blockCount}`);
        console.log(`  Unit:        ${lesson.unit}`);
        console.log(`  Progress:    ${progressStr}`);
        console.log(`  Full path:   courses/${courseId}/lessons/${lesson.id}`);
        console.log();
      }
    }
  }

  console.log("\n=== SCAN COMPLETE ===");
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
