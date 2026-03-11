const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const snap = await db.collection("courses").get();

  // Find all courses with "digital" or "literacy" in title
  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.title && (data.title.toLowerCase().includes("digital") || data.title.toLowerCase().includes("literacy"))) {
      console.log(d.id + ": " + data.title + " | migratedFrom: " + (data.migratedFrom || "none"));
    }
  });

  // Check digital literacy lesson count
  const dlCourses = snap.docs.filter((d) => d.data().title?.toLowerCase().includes("digital"));
  for (const c of dlCourses) {
    const lessons = await db.collection("courses/" + c.id + "/lessons").get();
    console.log("\n" + c.id + " has " + lessons.size + " lessons:");
    lessons.docs.forEach((l) => {
      const data = l.data();
      console.log("  " + l.id + ": " + (data.title || "(no title)") + " | visible: " + (data.visible !== false) + " | due: " + (data.dueDate || "none"));
    });
  }

  // Check which courses migratedFrom digital literacy
  const dlIds = dlCourses.map((c) => c.id);
  snap.docs.forEach((d) => {
    if (dlIds.includes(d.data().migratedFrom)) {
      console.log("\nSection " + d.id + " (" + d.data().title + ") migratedFrom " + d.data().migratedFrom);
    }
  });
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
