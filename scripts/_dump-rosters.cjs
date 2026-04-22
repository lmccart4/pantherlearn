const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const saPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (fs.existsSync(saPath)) {
  admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
} else {
  admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
}
const db = admin.firestore();

const TARGETS = [
  { label: "P3 Digital Literacy", courseId: "digital-literacy",       section: "Period 3" },
  { label: "P4 AI Literacy",      courseId: "Y9Gdhw5MTY8wMFt6Tlvj",   section: null },
  { label: "P5 AI Literacy",      courseId: "DacjJ93vUDcwqc260OP3",   section: null },
  { label: "P7 AI Literacy",      courseId: "M2MVSXrKuVCD9JQfZZyp",   section: null },
];

async function main() {
  const out = {};
  for (const t of TARGETS) {
    let q = db.collection("enrollments").where("courseId", "==", t.courseId);
    if (t.section) q = q.where("section", "==", t.section);
    const snap = await q.get();
    const rows = snap.docs.map(d => {
      const x = d.data();
      return {
        firstName: x.firstName || (x.name || "").split(" ")[0] || "",
        lastName:  x.lastName  || (x.name || "").split(" ").slice(1).join(" ") || "",
        name:      x.name || x.displayName || "",
        email:     x.email || "",
        uid:       x.uid || x.studentUid || d.id,
        section:   x.section || "",
      };
    }).sort((a,b) => (a.lastName||a.name).localeCompare(b.lastName||b.name));
    out[t.label] = rows;
    console.log(`\n=== ${t.label} — ${rows.length} students ===`);
    rows.forEach((r, i) => console.log(`${String(i+1).padStart(2)}. ${r.name}  <${r.email}>`));
  }
  fs.writeFileSync("/tmp/rosters-2026-04-20.json", JSON.stringify(out, null, 2));
  console.log("\nWrote /tmp/rosters-2026-04-20.json");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
