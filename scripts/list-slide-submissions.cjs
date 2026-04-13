/**
 * List every student's slide_submit submission for a lesson.
 *
 * Usage:
 *   node scripts/list-slide-submissions.cjs <lessonId>
 *   node scripts/list-slide-submissions.cjs <lessonId> --course=<courseId>
 *
 * Default: scans all 4 AI Lit sections + physics + digital-literacy.
 * Shows student name, email, section, URL, submitted timestamp, and tier if graded.
 */
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const args = process.argv.slice(2);
const lessonId = args.find(a => !a.startsWith("--"));
if (!lessonId) {
  console.error("Usage: node scripts/list-slide-submissions.cjs <lessonId> [--course=<id>]");
  process.exit(1);
}
const courseFilter = args.find(a => a.startsWith("--course="))?.split("=")[1];

const COURSES = [
  { id: "physics", label: "Physics" },
  { id: "digital-literacy", label: "Digital Literacy" },
  { id: "Y9Gdhw5MTY8wMFt6Tlvj", label: "AI Lit P4" },
  { id: "DacjJ93vUDcwqc260OP3", label: "AI Lit P5" },
  { id: "M2MVSXrKuVCD9JQfZZyp", label: "AI Lit P7" },
  { id: "fUw67wFhAtobWFhjwvZ5", label: "AI Lit P9" },
];

async function main() {
  const courses = courseFilter ? COURSES.filter(c => c.id === courseFilter) : COURSES;
  let totalSubmissions = 0;

  // Build a uid → {name, email} map up front for pretty output
  const usersSnap = await db.collection("users").get();
  const users = {};
  usersSnap.forEach(d => {
    const data = d.data();
    users[d.id] = { name: data.displayName || "(unknown)", email: data.email || "" };
  });

  for (const course of courses) {
    // Load the lesson doc and find all slide_submit block IDs
    const lessonRef = db.collection("courses").doc(course.id).collection("lessons").doc(lessonId);
    const lessonSnap = await lessonRef.get();
    if (!lessonSnap.exists) continue;

    const blocks = lessonSnap.data().blocks || [];
    const slideBlocks = blocks.filter(b => b.type === "slide_submit");
    if (slideBlocks.length === 0) continue;

    console.log(`\n═════════════════════════════════════════════════════════════`);
    console.log(`${course.label} — ${lessonSnap.data().title || lessonId}`);
    console.log(`  Lesson: ${lessonId}`);
    console.log(`  Slide blocks: ${slideBlocks.map(b => b.id).join(", ")}`);
    console.log(`═════════════════════════════════════════════════════════════`);

    // Pull the enrollment roster for this section
    const enrollSnap = await db.collection("enrollments").where("courseId", "==", course.id).get();
    const roster = [];
    enrollSnap.forEach(d => {
      const data = d.data();
      if (data.isTestStudent) return;
      const uid = data.uid || data.studentUid;
      if (uid) roster.push(uid);
    });

    const submissions = [];
    for (const uid of roster) {
      const progRef = db.doc(`progress/${uid}/courses/${course.id}/lessons/${lessonId}`);
      const progSnap = await progRef.get();
      if (!progSnap.exists) continue;
      const answers = progSnap.data().answers || {};
      for (const block of slideBlocks) {
        const a = answers[block.id];
        if (!a?.submitted || !a?.response) continue;
        submissions.push({
          uid,
          name: users[uid]?.name || uid,
          email: users[uid]?.email || "",
          blockId: block.id,
          url: a.response,
          writtenScore: a.writtenScore,
          writtenLabel: a.writtenLabel,
          submittedAt: a.submittedAt || a.savedAt || null,
        });
      }
    }

    // Sort by last name
    submissions.sort((a, b) => {
      const la = (a.name.split(" ").pop() || "").toLowerCase();
      const lb = (b.name.split(" ").pop() || "").toLowerCase();
      return la.localeCompare(lb);
    });

    console.log(`\nRoster: ${roster.length} enrolled · Submitted: ${submissions.length}\n`);
    if (submissions.length === 0) {
      console.log("  (no submissions yet)");
    } else {
      submissions.forEach(s => {
        const tier = s.writtenLabel ? ` [${s.writtenLabel}]` : (s.writtenScore != null ? ` [${s.writtenScore}]` : "");
        console.log(`  • ${s.name}${tier}`);
        console.log(`    ${s.url}`);
        if (s.email) console.log(`    ${s.email}`);
      });
    }
    totalSubmissions += submissions.length;

    // Missing-list (enrolled but didn't submit)
    const submittedUids = new Set(submissions.map(s => s.uid));
    const missing = roster.filter(uid => !submittedUids.has(uid));
    if (missing.length > 0) {
      console.log(`\n  ⚠️  Missing (${missing.length}):`);
      const missingNames = missing.map(uid => users[uid]?.name || uid).sort((a, b) => {
        const la = (a.split(" ").pop() || "").toLowerCase();
        const lb = (b.split(" ").pop() || "").toLowerCase();
        return la.localeCompare(lb);
      });
      missingNames.forEach(n => console.log(`    ○ ${n}`));
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Total submissions found across all sections: ${totalSubmissions}`);
  process.exit(0);
}

main().catch(err => { console.error("❌", err); process.exit(1); });
