const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const courses = await db.collection("courses").get();

  for (const course of courses.docs) {
    const name = course.data().title || course.data().name || course.id;
    const enrollSnap = await db.collection("courses").doc(course.id).collection("enrollments").get();
    if (enrollSnap.empty) continue;

    console.log(`\n${name} (${course.id}) — ${enrollSnap.size} enrollments`);

    let withEmail = 0, withoutEmail = 0;
    enrollSnap.docs.slice(0, 5).forEach(d => {
      const data = d.data();
      const email = data.email || "NO EMAIL";
      const uid = data.uid || d.id;
      const displayName = data.displayName || data.name || "unnamed";
      console.log(`  ${displayName} | uid: ${uid.slice(0,12)}... | email: ${email}`);
      if (data.email) withEmail++; else withoutEmail++;
    });

    // Count totals
    const totalWith = enrollSnap.docs.filter(d => d.data().email).length;
    const totalWithout = enrollSnap.size - totalWith;
    console.log(`  Summary: ${totalWith} with email, ${totalWithout} without email`);
  }
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
