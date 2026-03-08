// seed-hallucination-lab.js
// Run from your pantherlearn directory: node seed-hallucination-lab.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const lesson = {
  title: "The Hallucination Lab: When AI Lies Confidently",
  course: "Foundations of Generative AI",
  unit: "Lesson 12",
  order: 11,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "b1",
      type: "text",
      content: "Read this paragraph:\n\n*\"The Great Wall of China, completed in 214 BC by Emperor Qin Shi Huang, is the only man-made structure visible from space. Stretching over 13,000 miles, it was built primarily to keep out the Mongol Empire and took over 2 million workers to construct, with an estimated 400,000 dying during the process.\"*\n\nThis paragraph sounds confident, specific, and authoritative. But **at least 3 claims in it are wrong or misleading.** Can you spot them?"
    },
    {
      id: "b2",
      type: "question",
      questionType: "short_answer",
      prompt: "Which claims in the paragraph above do you think are wrong or misleading? List as many as you can find and explain why you're suspicious.",
      placeholder: "I think the claim about ___ is wrong because..."
    },
    {
      id: "b3",
      type: "callout",
      icon: "🤯",
      style: "insight",
      content: "**Here's the truth:**\n\n1. The Great Wall is NOT visible from space with the naked eye — this is a common myth.\n2. It wasn't \"completed\" in 214 BC — construction spanned many dynasties over ~2,000 years.\n3. It wasn't built to keep out the Mongols specifically — the earliest walls predate the Mongol Empire by over 1,000 years.\n\nThis paragraph sounds like something an AI might write: **confident, detailed, and partially wrong.** When AI generates text like this, we call the false parts **hallucinations**."
    },
    {
      id: "b4",
      type: "definition",
      term: "Hallucination (AI)",
      definition: "When an AI model generates information that sounds confident and plausible but is actually false, fabricated, or inaccurate. This happens because the model predicts probable-sounding words rather than checking facts."
    },
    {
      id: "section-main",
      type: "section_header",
      title: "Main Activity: The Hallucination Lab",
      subtitle: "~25 minutes",
      icon: "📚"
    },
    {
      id: "b5",
      type: "text",
      content: "Now you're going to experience hallucinations firsthand. You'll ask an AI chatbot real questions about real topics — but the AI has been set up to **subtly mix false information into its responses.**\n\nYour job:\n1. **Chat** — Ask the AI about a topic\n2. **Investigate** — Read the response carefully and highlight sentences you think are hallucinations\n3. **Classify** — Label each flagged claim by what type of hallucination it is (wrong date, fake study, invented detail, etc.)\n\nThe hallucinations get harder to spot as you progress. Can you catch them all?"
    },
    {
      id: "b6",
      type: "embed",
      url: "https://hallucination-lab.web.app/?studentId={{studentId}}&courseId={{courseId}}&blockId=b6&lessonId=lesson-12-hallucination-lab",
      caption: "Hallucination Lab — 5 investigations across 3 difficulty levels",
      height: 750
    },
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Socratic Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "b7",
      type: "question",
      questionType: "short_answer",
      prompt: "Think back to the Token Prediction Lab. A language model picks the 'most likely next word' based on patterns. How does this explain WHY hallucinations happen? Connect what you learned about token prediction to what you experienced today.",
      placeholder: "Hallucinations happen because..."
    },
    {
      id: "b8",
      type: "question",
      questionType: "short_answer",
      prompt: "A student uses ChatGPT to research a topic for a school paper. The AI gives them 5 sources, including author names and publication dates. Based on what you learned today, what should the student do before citing those sources? Why?",
      placeholder: "The student should..."
    },
    {
      id: "b9",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why are AI hallucinations particularly dangerous compared to other types of misinformation?",
      options: [
        "Because AI always lies",
        "Because they're mixed with accurate information and stated with high confidence, making them hard to distinguish from truth",
        "Because AI is programmed to deceive people",
        "Because hallucinations only happen on controversial topics"
      ],
      correctIndex: 1,
      explanation: "AI hallucinations are dangerous precisely because they're embedded in mostly-accurate responses and delivered with complete confidence. The model doesn't signal uncertainty — it states false claims the same way it states true ones. This makes critical thinking and fact-checking essential."
    },
    {
      id: "b10",
      type: "vocab_list",
      title: "Key Vocabulary",
      terms: [
        { term: "Hallucination", definition: "When an AI generates false or fabricated information that sounds confident and plausible." },
        { term: "Confabulation", definition: "A related term from psychology — when someone fills memory gaps with fabricated information without intending to deceive. AI does something similar." },
        { term: "Grounding", definition: "A technique for reducing hallucinations by connecting AI responses to verified source documents or databases." },
        { term: "Fact-checking", definition: "The process of verifying claims against reliable sources — the primary defense against hallucinations." }
      ]
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "PERIOD_4_COURSE_ID", lessonId: "lesson-12-hallucination-lab" },
    { courseId: "PERIOD_5_COURSE_ID", lessonId: "lesson-12-hallucination-lab" },
    { courseId: "PERIOD_7_COURSE_ID", lessonId: "lesson-12-hallucination-lab" },
  ];

  for (const { courseId, lessonId } of courses) {
    await setDoc(doc(db, "courses", courseId, "lessons", lessonId), lesson);
    console.log(`✅ Seeded Hallucination Lab for course ${courseId}`);
  }

  console.log('\n📊 Activity Registry Entry:');
  console.log(JSON.stringify({
    id: "hallucination-lab",
    title: "Hallucination Lab",
    icon: "🔍",
    collection: "hallucination_lab",
    url: "https://hallucination-lab.web.app",
    course: "ai-literacy",
    maxScore: 100,
  }, null, 2));

  process.exit(0);
}

seed().catch(err => { console.error('❌ Error:', err); process.exit(1); });
