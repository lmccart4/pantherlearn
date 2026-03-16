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

async function main() {
  const ref = db.doc("courses/digital-literacy/lessons/gaming-showcase-day");
  const doc = await ref.get();
  const blocks = doc.data().blocks;

  // Insert after the prep checklist (id: "checklist-prep"), before the showcase section
  const checklistIndex = blocks.findIndex(b => b.id === "checklist-prep");

  const videoLinkBlock = {
    id: "q-video-link",
    type: "question",
    questionType: "short_answer",
    prompt: "Paste your final video link here (WeVideo share link, Google Drive link, or YouTube link). This is your official submission.",
    difficulty: "remember"
  };

  blocks.splice(checklistIndex + 1, 0, videoLinkBlock);
  await ref.update({ blocks });
  console.log("Added video link submission block after prep checklist. Total blocks:", blocks.length);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
