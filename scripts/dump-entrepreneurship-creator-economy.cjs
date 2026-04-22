const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
(async () => {
  const d = await db.doc("courses/digital-literacy/lessons/entrepreneurship-creator-economy").get();
  const data = d.data();
  console.log("title:", data.title);
  console.log("QOD:", data.questionOfTheDay);
  console.log("gradesReleased:", data.gradesReleased);
  data.blocks.forEach((b,i) => {
    if (b.type === "question" && b.questionType === "multiple_choice") {
      console.log(`\n--- MC Block ${i} ---`);
      console.log("prompt:", b.prompt);
      console.log("all keys:", Object.keys(b));
      console.log("correctIndex:", b.correctIndex);
      console.log("correctAnswer:", b.correctAnswer);
      console.log("correctAnswerIndex:", b.correctAnswerIndex);
      console.log("options:", b.options);
    }
  });
})().then(()=>process.exit(0));
