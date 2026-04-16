// Simulates Joe Student completing the algorithm-filter-bubbles lesson.
// Writes the same Firestore records the React app would write, then applies
// LessonCompleteButton's allComplete logic to confirm the lesson would be turn-in-ready.
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const JOE_UID = "aSSXjWvczvduimamZI8zznWQAAV2";
const COURSE_ID = "digital-literacy";
const LESSON_ID = "algorithm-filter-bubbles";

(async () => {
  // 1) Load lesson blocks
  const lessonSnap = await db.collection("courses").doc(COURSE_ID).collection("lessons").doc(LESSON_ID).get();
  const lesson = lessonSnap.data();
  const blocks = lesson.blocks || [];

  console.log(`\n=== Simulating Joe through "${lesson.title}" ===\n`);

  // 2) Build Joe's answers — one per gating block
  const answers = {};

  // Question blocks (5 total — 4 short_answer + 1 multiple_choice)
  const questionBlocks = blocks.filter((b) => b.type === "question");
  for (const q of questionBlocks) {
    if (q.questionType === "multiple_choice") {
      answers[q.id] = {
        submitted: true,
        selectedIndex: q.correctIndex, // pick the correct answer
        correct: true,
        score: 1,
        maxScore: 1,
        writtenScore: 1,
        completedAt: new Date().toISOString(),
      };
      console.log(`  Q (MC) ${q.id}: pick option ${q.correctIndex} → "${q.options[q.correctIndex]}"`);
    } else {
      answers[q.id] = {
        submitted: true,
        response: simulatedSAResponse(q.id),
        completedAt: new Date().toISOString(),
      };
      console.log(`  Q (SA) ${q.id}: simulated response logged`);
    }
  }

  // Embed block — write what EmbedBlock would write upon receiving the verified postMessage
  const embedBlock = blocks.find((b) => b.type === "embed");
  if (embedBlock) {
    const score = 3.8;
    const maxScore = 5;
    answers[embedBlock.id] = {
      score,
      maxScore,
      writtenScore: score / maxScore, // 0.76
      submitted: true,
      completedAt: new Date().toISOString(),
      breakdown: {
        bucketsEngaged: 19,
        totalBuckets: 25,
        topicCounts: { sports: 13, wellness: 3, tech: 6, climate: 3, school: 5 },
        liked: 30,
      },
    };
    console.log(`  EMBED ${embedBlock.id}: score ${score}/${maxScore} (writtenScore=${(score/maxScore).toFixed(3)}), submitted=true`);
  }

  // 3) Write Joe's progress doc
  const progressRef = db.doc(`progress/${JOE_UID}/courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  await progressRef.set({
    answers,
    lastUpdated: new Date(),
  }, { merge: true });
  console.log(`\n✅ Wrote ${Object.keys(answers).length} answer blocks to Joe's progress doc`);

  // 4) Read it back to verify
  const back = await progressRef.get();
  const backAnswers = back.data().answers || {};
  console.log(`✅ Read back: ${Object.keys(backAnswers).length} answer blocks present`);

  // 5) Apply LessonCompleteButton's allComplete logic
  console.log(`\n=== Applying allComplete gate logic ===\n`);
  const studentData = backAnswers;
  const chatLogs = {}; // none in this lesson

  const questionGate = questionBlocks;
  const chatbotGate = blocks.filter((b) => b.type === "chatbot");
  const checklistGate = blocks.filter((b) => b.type === "checklist");
  const scoredEmbedGate = blocks.filter((b) => (b.type === "embed" || b.type === "connect_four") && b.scored);
  const slideSubmitGate = blocks.filter((b) => b.type === "slide_submit");

  const allQuestionsAnswered = questionGate.every((b) => studentData[b.id]?.submitted);
  const allChatbotsUsed = chatbotGate.every((b) => chatLogs[b.id]?.length > 0);
  const allChecklistsDone = checklistGate.every((b) => {
    const items = b.items || [];
    if (items.length === 0) return true;
    const checked = studentData[b.id]?.checked || {};
    return items.every((_, i) => checked[i]);
  });
  const allEmbedsComplete = scoredEmbedGate.every((b) => studentData[b.id]?.submitted === true);
  const allSlidesSubmitted = slideSubmitGate.every((b) => studentData[b.id]?.submitted);

  const allComplete = allQuestionsAnswered && allChatbotsUsed && allChecklistsDone && allEmbedsComplete && allSlidesSubmitted;

  console.log(`  questionBlocks (${questionGate.length}):       all submitted? ${allQuestionsAnswered}`);
  console.log(`  chatbotBlocks (${chatbotGate.length}):         all used?      ${allChatbotsUsed}`);
  console.log(`  checklistBlocks (${checklistGate.length}):      all checked?   ${allChecklistsDone}`);
  console.log(`  scoredEmbedBlocks (${scoredEmbedGate.length}):    all submitted? ${allEmbedsComplete}`);
  console.log(`  slideSubmitBlocks (${slideSubmitGate.length}):   all submitted? ${allSlidesSubmitted}`);
  console.log(`\n  ▶▶▶ allComplete = ${allComplete}  (Complete Lesson button ${allComplete ? "UNLOCKED ✅" : "LOCKED 🔒"})`);

  // Per-block detail for the embed
  const embedState = backAnswers[embedBlock.id];
  const embedIsComplete = embedState?.submitted && embedState?.writtenScore != null;
  console.log(`\n  Embed isComplete check (EmbedBlock.jsx:112): ${embedIsComplete} (submitted=${embedState?.submitted}, writtenScore=${embedState?.writtenScore})`);

  process.exit(allComplete ? 0 : 1);
})();

function simulatedSAResponse(blockId) {
  const map = {
    "q-warmup": "On TikTok, my feed is almost all gym/workout content because I follow a lot of fitness creators. When I try to find food or recipe stuff it's hard to find unless I search for it.",
    "q-real-effects": "If everyone in a town only sees local news that agrees with their political views, they might not realize their neighbors actually disagree on a lot. That makes it harder to talk to each other and harder to vote based on the full picture.",
    "q-test-bubble": "I think my feed pushes a one-sided view on pro athletes — every video about LeBron is either super positive or super negative depending on who I watched last. There's no middle ground in what gets recommended.",
    "q-exit": "A filter bubble is when the algorithm picks what you see based on your past clicks, so you only see one kind of content. An echo chamber is when the people you follow all agree with each other. A rabbit hole is when one video leads to another and another that gets more extreme over time.",
  };
  return map[blockId] || "Simulated student response for QA testing.";
}
