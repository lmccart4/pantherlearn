const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function update() {
  const ref = db.doc("courses/digital-literacy/lessons/data-literacy-4-cleaning-crime-scene");
  const doc = await ref.get();
  const data = doc.data();
  
  const blocks = data.blocks.map(b => {
    if (b.id === "b4" && b.type === "activity") {
      return {
        ...b,
        instructions: b.instructions.replace(
          "https://docs.google.com/spreadsheets/d/1GMmHOyGGrO2tgB_9TPgRIe2Eozjqw1is/edit?usp=sharing",
          "[**Crime Scene Dataset → Open in Google Sheets**](https://docs.google.com/spreadsheets/d/1GMmHOyGGrO2tgB_9TPgRIe2Eozjqw1is/copy)"
        )
      };
    }
    return b;
  });
  
  await ref.update({ blocks });
  console.log("Updated. New instructions for b4:");
  console.log(blocks.find(b => b.id === "b4").instructions);
}

update().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
