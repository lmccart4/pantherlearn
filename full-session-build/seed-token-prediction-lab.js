// seed-token-prediction-lab.js
// Seeds the Token Prediction Lab lesson into PantherLearn
// Run from your pantherlearn directory: node seed-token-prediction-lab.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ⬇️ PASTE YOUR FIREBASE CONFIG HERE ⬇️
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
  title: "How Language Models Predict: The Token Prediction Lab",
  course: "Foundations of Generative AI",
  unit: "Lesson 10",
  order: 9,
  blocks: [
    // ═══════════════════════════════════════
    // WARM UP (~10 minutes)
    // ═══════════════════════════════════════
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
      content: "Let's play a quick game. I'm going to show you the beginning of some sentences, and you try to guess what word comes next.\n\n- \"Twinkle, twinkle, little ___\"\n- \"The early bird catches the ___\"\n- \"To be or not to ___\"\n\nYou probably got all three right without even thinking. But HOW did you know?"
    },
    {
      id: "b2",
      type: "question",
      questionType: "short_answer",
      prompt: "How did you know what word came next in those sentences? What was your brain doing?",
      placeholder: "I knew because..."
    },
    {
      id: "b3",
      type: "callout",
      icon: "💡",
      style: "insight",
      content: "**Here's the key insight:** You predicted those words because you've seen those patterns before — in books, songs, movies, and conversations. A language model does the same thing, but with MATH. It assigns a **probability** (a number from 0 to 1) to every possible next word based on patterns it learned from training data."
    },

    // ═══════════════════════════════════════
    // MAIN INSTRUCTION (~25 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main Activity: Token Prediction Lab",
      subtitle: "~25 minutes",
      icon: "📚"
    },
    {
      id: "b4",
      type: "definition",
      term: "Token",
      definition: "A unit of text that a language model processes. For most purposes, you can think of a token as roughly equal to one word (though some words get split into multiple tokens)."
    },
    {
      id: "b5",
      type: "definition",
      term: "Next-Token Prediction",
      definition: "The core task of a language model: given all the words so far, predict what word (token) is most likely to come next. The model assigns a probability to EVERY possible word and picks from the top ones."
    },
    {
      id: "b6",
      type: "text",
      content: "In this activity, you'll step into the role of a language model. You'll see partial sentences and try to predict the next word — then you'll see the actual probabilities a model would assign.\n\nAs you go, you'll discover:\n- Why some words are much more likely than others\n- How **context** (the attention mechanism) changes which words are probable\n- What happens when the model is **uncertain**\n- How **temperature** controls creativity vs. predictability"
    },
    {
      id: "b7",
      type: "embed",
      url: "https://token-prediction-lab.web.app/?studentId={{studentId}}&courseId={{courseId}}&blockId=b7&lessonId=lesson-10-token-prediction",
      caption: "Token Prediction Lab — 14 rounds across 4 stages",
      height: 700
    },

    // ═══════════════════════════════════════
    // WRAP UP (~5 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Socratic Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "b8",
      type: "question",
      questionType: "short_answer",
      prompt: "In Round 5, the sentence was 'The baseball player picked up the ___' and 'bat' was the top prediction. In Round 6, 'The biologist carefully studied the ___' also had 'bat' as an option but with much lower probability. What changed between these two sentences, and why did it matter?",
      placeholder: "The context changed because..."
    },
    {
      id: "b9",
      type: "question",
      questionType: "short_answer",
      prompt: "If you set the temperature very low (0.1), the model always picks the most likely word. If you set it high (2.5), it picks surprising words. When would you WANT a model to be creative vs. predictable? Give an example of each.",
      placeholder: "I would want creativity when... and predictability when..."
    },
    {
      id: "b10",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A language model sees the sentence: 'The doctor told the patient to take the ___.' Which concept from today's lesson BEST explains why 'medicine' would have a higher probability than 'elevator'?",
      options: [
        "Temperature — the model is set to be predictable",
        "Attention — the words 'doctor,' 'patient,' and 'take' shift probability toward medical words",
        "Random chance — the model just guesses",
        "Training data — the model has never seen the word 'elevator'"
      ],
      correctIndex: 1,
      explanation: "The attention mechanism looks at context words like 'doctor,' 'patient,' and 'take' and shifts the probability distribution toward medical/health-related words. The model HAS seen 'elevator' before — it just assigns it low probability in this medical context."
    },
    {
      id: "b11",
      type: "vocab_list",
      title: "Key Vocabulary",
      terms: [
        { term: "Token", definition: "A unit of text that a language model processes — roughly equal to one word." },
        { term: "Next-Token Prediction", definition: "The core task of a language model: given all previous words, assign a probability to every possible next word and pick from the top ones." },
        { term: "Probability Distribution", definition: "The set of probabilities assigned to all possible next tokens. They always add up to 100%." },
        { term: "Temperature", definition: "A setting that controls how 'creative' vs. 'predictable' a model's outputs are. Low temperature = safe choices. High temperature = surprising choices." },
        { term: "Entropy", definition: "A measure of how uncertain the model is. High entropy = many words are equally likely. Low entropy = one word dominates." }
      ]
    }
  ]
};

async function seed() {
  // ⬇️ UPDATE THESE COURSE IDs for your periods ⬇️
  const courses = [
    { courseId: "PERIOD_4_COURSE_ID", lessonId: "lesson-10-token-prediction" },
    { courseId: "PERIOD_5_COURSE_ID", lessonId: "lesson-10-token-prediction" },
    { courseId: "PERIOD_7_COURSE_ID", lessonId: "lesson-10-token-prediction" },
  ];

  for (const { courseId, lessonId } of courses) {
    await setDoc(doc(db, "courses", courseId, "lessons", lessonId), lesson);
    console.log(`✅ Seeded Token Prediction Lab for course ${courseId}`);
  }

  console.log('\n📊 Activity Registry Entry:');
  console.log(JSON.stringify({
    id: "token-prediction-lab",
    title: "Token Prediction Lab",
    icon: "🔮",
    collection: "token_prediction_lab",
    url: "https://token-prediction-lab.web.app",
    course: "ai-literacy",
    maxScore: 100,
  }, null, 2));

  process.exit(0);
}

seed().catch(err => { console.error('❌ Error:', err); process.exit(1); });
