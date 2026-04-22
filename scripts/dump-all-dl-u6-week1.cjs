const admin = require("firebase-admin");
const fs = require("fs");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const slugs = [
  "entrepreneurship-creator-economy",
  "entrepreneurship-niche",
  "entrepreneurship-value-prop",
  "entrepreneurship-branding",
  "entrepreneurship-revenue",
];
(async () => {
  const out = {};
  for (const s of slugs) {
    const d = await db.doc(`courses/digital-literacy/lessons/${s}`).get();
    out[s] = d.data();
  }
  fs.writeFileSync("/tmp/dl-u6-week1-snapshot.json", JSON.stringify(out, null, 2));
  console.log("wrote /tmp/dl-u6-week1-snapshot.json");
})().then(()=>process.exit(0));
