// patch-music-lab-link.cjs
// Updates the music-lab-ai lesson to use a real hyperlink for the Jam Session,
// matching the format used in ai-as-co-creator for Mix & Move.

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const JAM_URL = "https://studio.code.org/courses/music-jam-2024/units/1/lessons/1/levels/1?login_required=true";

const COURSES = [
  "DacjJ93vUDcwqc260OP3",
  "M2MVSXrKuVCD9JQfZZyp",
  "Y9Gdhw5MTY8wMFt6Tlvj",
  "fUw67wFhAtobWFhjwvZ5",
];

async function patchCourse(courseId) {
  const ref = db.collection("courses").doc(courseId).collection("lessons").doc("music-lab-ai");
  const doc = await ref.get();
  if (!doc.exists) {
    console.log(`  [${courseId}] lesson not found — skipping`);
    return;
  }

  const blocks = [...doc.data().blocks];

  let changed = false;

  blocks.forEach((b) => {
    if (b.id === "jam-activity") {
      b.instructions =
        `1. Open the activity: [**Music Lab: Jam Session → Open Activity**](${JAM_URL})\n` +
        `2. Pick an artist track (Sabrina Carpenter, Shakira, Lady Gaga, Coldplay, etc.)\n` +
        `3. Follow the guided tutorial — it'll teach you how to:\n` +
        `   - **Sequence** sounds (play this, then that)\n` +
        `   - **Layer** tracks (play these at the same time)\n` +
        `   - **Use functions** (reusable chunks of music)\n` +
        `4. When you reach the **AI beat generator**, try creating at least 2 different beats\n` +
        `5. Listen to how AI beats sound vs. the hand-placed samples\n\n` +
        `**Headphones on. Work through the full tutorial (~15 min).**`;
      changed = true;
    }

    if (b.id === "jam-link") {
      b.content =
        `**Activity Link:** Go to [**Music Lab: Jam Session → Open Activity**](${JAM_URL}) to start.\n\n` +
        `This activity takes about 15 minutes. Work through all the stages — sequencing, layering, and the AI beat generator.`;
      changed = true;
    }
  });

  if (!changed) {
    console.log(`  [${courseId}] no matching blocks found`);
    return;
  }

  await ref.update({ blocks });
  console.log(`  [${courseId}] ✓ patched`);
}

async function run() {
  for (const courseId of COURSES) {
    await patchCourse(courseId);
  }
  console.log("\nDone.");
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
