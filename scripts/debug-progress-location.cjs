const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  // Pick a known student — Emily Vazquez from Period 5
  const uid = ""; // need to find it
  const enrollSnap = await db.collection("enrollments").where("courseId", "==", "ai-literacy").get();
  let emilyUid = null;
  enrollSnap.docs.forEach((d) => {
    if ((d.data().name || "").includes("Emily")) emilyUid = d.data().uid || d.data().studentUid;
  });

  if (!emilyUid) {
    // Try section enrollments
    const secSnap = await db.collection("enrollments").where("courseId", "==", "DacjJ93vUDcwqc260OP3").get();
    secSnap.docs.forEach((d) => {
      if ((d.data().name || "").includes("Emily")) emilyUid = d.data().uid || d.data().studentUid;
    });
  }

  console.log("Emily UID:", emilyUid);
  if (!emilyUid) return;

  // Check progress under ai-literacy
  const progAI = await db.collection("progress").doc(emilyUid).collection("courses").doc("ai-literacy").collection("lessons").get();
  console.log("Lessons under ai-literacy:", progAI.size);

  // Check progress under section courseId
  const progSec = await db.collection("progress").doc(emilyUid).collection("courses").doc("DacjJ93vUDcwqc260OP3").collection("lessons").get();
  console.log("Lessons under DacjJ93vUDcwqc260OP3:", progSec.size);

  // Activities
  const actAI = await db.collection("progress").doc(emilyUid).collection("courses").doc("ai-literacy").collection("activities").get();
  console.log("Activities under ai-literacy:", actAI.docs.map((d) => d.id));

  const actSec = await db.collection("progress").doc(emilyUid).collection("courses").doc("DacjJ93vUDcwqc260OP3").collection("activities").get();
  console.log("Activities under DacjJ93vUDcwqc260OP3:", actSec.docs.map((d) => d.id));
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
