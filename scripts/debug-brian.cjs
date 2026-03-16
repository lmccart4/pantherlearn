const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  // Find Brian's UID
  const enrollSnap = await db.collection("enrollments").where("courseId", "==", "ai-literacy").get();
  let brianUid = null;
  enrollSnap.docs.forEach((d) => {
    const data = d.data();
    const name = (data.name || data.displayName || "").toLowerCase();
    if (name.includes("brian") && name.includes("diaz")) {
      brianUid = data.uid || data.studentUid;
      console.log("Found Brian:", { uid: brianUid, name: data.name || data.displayName, email: data.email });
    }
  });
  if (!brianUid) { console.log("Brian not found"); return; }

  // Find intro lesson
  const lessonsSnap = await db.collection("courses").doc("ai-literacy").collection("lessons").get();
  let introLesson = null;
  lessonsSnap.docs.forEach((d) => {
    if (d.data().title && d.data().title.toLowerCase().includes("introduction to generative")) {
      introLesson = { id: d.id, ...d.data() };
    }
  });
  if (!introLesson) { console.log("Intro lesson not found"); return; }
  console.log("\nLesson:", introLesson.id, introLesson.title);

  const mc = (introLesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "multiple_choice");
  const sa = (introLesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "short_answer");
  console.log("MC questions:", mc.length, "SA questions:", sa.length);

  // Get progress
  const progSnap = await db.doc("progress/" + brianUid + "/courses/ai-literacy/lessons/" + introLesson.id).get();
  if (!progSnap.exists) { console.log("No progress doc"); return; }
  const prog = progSnap.data();
  console.log("Completed:", prog.completed);

  const answers = prog.answers || {};
  let earned = 0, possible = 0;

  mc.forEach((q) => {
    const a = answers[q.id];
    console.log("MC", q.id, ":", a ? JSON.stringify({ submitted: a.submitted, correct: a.correct }) : "NO ANSWER");
    if (a && a.submitted) { possible++; if (a.correct) earned++; }
  });

  sa.forEach((q) => {
    const a = answers[q.id];
    console.log("SA", q.id, ":", a ? JSON.stringify({ submitted: a.submitted, writtenScore: a.writtenScore, needsGrading: a.needsGrading }) : "NO ANSWER");
    if (a && a.submitted && a.writtenScore != null) { possible++; earned += a.writtenScore; }
  });

  // Reflection
  const refSnap = await db.doc("progress/" + brianUid + "/courses/ai-literacy/reflections/" + introLesson.id).get();
  if (refSnap.exists) {
    const ref = refSnap.data();
    console.log("Reflection:", JSON.stringify(ref));
    if (prog.completed && ref) { possible++; if (ref.valid) earned++; }
  } else {
    console.log("No reflection");
  }

  console.log("\nGrade calc:", earned, "/", possible, "=", possible > 0 ? Math.round((earned / possible) * 100) : "N/A", "%");
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
