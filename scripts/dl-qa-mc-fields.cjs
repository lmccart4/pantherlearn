const admin = require("firebase-admin");
const KEY_PATH = `${process.env.HOME}/.config/firebase/pantherlearn-admin.json`;
admin.initializeApp({ credential: admin.credential.cert(require(KEY_PATH)), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

(async () => {
  const snap = await db.doc("courses/digital-literacy/lessons/brand-kit-day1-vibe-check").get();
  const blocks = snap.data().blocks || [];
  for (const b of blocks) {
    if (b.questionType === "multiple_choice") {
      console.log(JSON.stringify(b, null, 2));
      console.log("---");
    }
  }
})().then(()=>process.exit(0));
