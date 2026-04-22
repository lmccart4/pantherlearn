const admin = require("firebase-admin");
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
  for (const s of slugs) {
    const d = (await db.doc(`courses/digital-literacy/lessons/${s}`).get()).data();
    console.log(`\n${s} (order ${d.order}, vis=${d.visible})`);
    console.log(`  QOD: ${d.questionOfTheDay || "MISSING"}`);
    console.log(`  gradesReleased: ${d.gradesReleased ?? "unset"}`);
    const mcs = d.blocks.filter(b => b.type==="question" && b.questionType==="multiple_choice");
    mcs.forEach((b,i) => {
      const ans = b.correctIndex ?? b.correctAnswer ?? b.correctAnswerIndex;
      console.log(`  MC[${i}] correctIndex=${b.correctIndex} → ${typeof ans==="number" ? `✓ "${b.options[ans]}"` : "❌ MISSING"}`);
    });
    const activities = d.blocks.filter(b => b.type==="activity");
    console.log(`  activity blocks: ${activities.length}`);
    activities.forEach(a => console.log(`    · ${a.title}`));
  }
})().then(()=>process.exit(0));
