const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const DIRECT_URL = "https://studio.code.org/courses/mix-move-ai-2025/units/1/lessons/1/levels/1?login_required=true";
const courseIds = [
  "DacjJ93vUDcwqc260OP3", // P4
  "M2MVSXrKuVCD9JQfZZyp", // P5
  "Y9Gdhw5MTY8wMFt6Tlvj", // P7
  "fUw67wFhAtobWFhjwvZ5"  // P9
];

async function update() {
  for (const courseId of courseIds) {
    const ref = db.doc(`courses/${courseId}/lessons/ai-as-co-creator`);
    const doc = await ref.get();
    const data = doc.data();

    const blocks = data.blocks.map(b => {
      if (b.id === "mix-move-activity" && b.type === "activity") {
        return {
          ...b,
          instructions: b.instructions.replace(
            "**code.org/mix-move-ai**",
            `[**Mix & Move with AI → Open Activity**](${DIRECT_URL})`
          )
        };
      }
      if (b.id === "mix-move-link" && b.type === "callout") {
        return {
          ...b,
          content: b.content.replace(
            "**code.org/mix-move-ai**",
            `[**Mix & Move with AI → Open Activity**](${DIRECT_URL})`
          )
        };
      }
      return b;
    });

    await ref.update({ blocks });
    console.log(`Updated ${courseId}`);
  }
  console.log("Done.");
}

update().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
