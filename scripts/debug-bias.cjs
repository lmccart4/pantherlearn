const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const names = ["nashla", "evangelina", "hailey"];
  const enrollSnap = await db.collection("enrollments").where("courseId", "==", "ai-literacy").get();
  const students = [];
  enrollSnap.docs.forEach((d) => {
    const data = d.data();
    const name = (data.name || data.displayName || "").toLowerCase();
    if (names.some((n) => name.includes(n))) {
      students.push({ uid: data.uid || data.studentUid, name: data.name || data.displayName });
    }
  });
  console.log("Found students:", students.map((s) => s.name));

  for (const s of students) {
    console.log("\n=== " + s.name + " (uid: " + s.uid + ") ===");

    // Check progress/activities path
    const actSnap = await db.collection("progress").doc(s.uid).collection("courses").doc("ai-literacy").collection("activities").get();
    console.log("Activities in progress:", actSnap.docs.map((d) => d.id));

    // Check biasInvestigations collection
    const biasSnap = await db.collection("courses").doc("ai-literacy").collection("biasInvestigations").where("uid", "==", s.uid).get();
    if (biasSnap.empty) {
      // Try studentId
      const biasSnap2 = await db.collection("courses").doc("ai-literacy").collection("biasInvestigations").where("studentId", "==", s.uid).get();
      if (biasSnap2.empty) {
        console.log("No biasInvestigations docs (checked uid and studentId)");
      } else {
        biasSnap2.docs.forEach((d) => {
          const data = d.data();
          console.log("biasInvestigations (studentId):", JSON.stringify({ id: d.id, verdict: data.verdict, score: data.score, completedAt: data.completedAt }));
        });
      }
    } else {
      biasSnap.docs.forEach((d) => {
        const data = d.data();
        console.log("biasInvestigations (uid):", JSON.stringify({ id: d.id, verdict: data.verdict, score: data.score, completedAt: data.completedAt }));
      });
    }

    // Also check top-level biasInvestigations collection
    const topSnap = await db.collection("biasInvestigations").where("uid", "==", s.uid).get();
    if (topSnap.empty) {
      const topSnap2 = await db.collection("biasInvestigations").where("studentId", "==", s.uid).get();
      if (!topSnap2.empty) {
        topSnap2.docs.forEach((d) => {
          console.log("TOP-LEVEL biasInvestigations:", JSON.stringify({ id: d.id, ...d.data() }).slice(0, 200));
        });
      }
    } else {
      topSnap.docs.forEach((d) => {
        console.log("TOP-LEVEL biasInvestigations:", JSON.stringify({ id: d.id, ...d.data() }).slice(0, 200));
      });
    }
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
