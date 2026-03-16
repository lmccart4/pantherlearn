// seed-ai-training-sim-lesson.js
// Lesson 23 — AI Ethics & Society unit
// Wraps the existing AI Training Simulator activity.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Training AI: Who Decides What It Learns?",
  course: "AI Literacy",
  unit: "AI Ethics and Society",
  order: 25,
  visible: false,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Experience the process of training an AI model — selecting data, labeling examples, and evaluating results",
        "Identify how training choices directly affect what an AI can and can't do",
        "Recognize that bias in training leads to bias in output — not because AI is biased, but because the data is",
        "Connect the training process to real-world consequences (hiring, healthcare, criminal justice)"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "You've been using AI all semester. You've built chatbots, engineered prompts, remixed art. You understand how AI generates output.\n\nBut there's a deeper question we haven't fully explored: **Who decides what AI learns in the first place?**\n\nEvery AI system starts with training data — and the people who choose, label, and curate that data shape everything the AI will ever do. Today you step into their shoes."
    },
    {
      id: "wu-scenario",
      type: "callout",
      icon: "🏥",
      style: "scenario",
      content: "**Scenario:** A hospital wants to build an AI that predicts which patients are at high risk for heart disease.\n\nThey train it on 10 years of patient records. But 80% of those records are from male patients — because historically, more men were tested for heart disease.\n\n**Result:** The AI works great for men. It misses warning signs in women. Not because it's sexist — because its training data was skewed.\n\nThis is the training data problem in action."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Whose fault is the biased AI in the hospital scenario — the AI, the developers, the hospital, or society? Explain.",
      placeholder: "I think the responsibility falls on... because..."
    },

    // ═══════════════════════════════════════════════════════
    // ACTIVITY
    // ═══════════════════════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "AI Training Simulator",
      subtitle: "~25 minutes",
      icon: "🧪"
    },
    {
      id: "activity-intro",
      type: "text",
      content: "In this simulation, you'll train an AI model step by step. You'll select training data, label examples, and see how your choices affect what the model learns — and what it gets wrong."
    },
    {
      id: "activity-block",
      type: "activity",
      title: "Launch AI Training Simulator",
      icon: "🤖",
      instructions: "1. Open the AI Training Simulator (your teacher will share the link)\n2. Follow the guided steps to train your model\n3. Pay close attention to:\n   - What data you're selecting and what you're leaving out\n   - How you're labeling examples — and whether those labels are clear\n   - How the model performs after training — where it succeeds and fails\n4. Complete all stages of the simulation"
    },
    {
      id: "activity-watch",
      type: "callout",
      icon: "👀",
      style: "tip",
      content: "**Watch for these moments:**\n\n- When the model confidently gets something wrong — that's the training data's fault, not the model's\n- When you're asked to make a labeling decision that could go either way — real data labelers face this constantly\n- When you realize the model can't learn something because it wasn't in the training data at all"
    },

    // ═══════════════════════════════════════════════════════
    // REFLECTION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-reflect",
      type: "section_header",
      title: "Reflection",
      subtitle: "~10 minutes",
      icon: "🪞"
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An AI trained mostly on English-language text struggles with other languages. This is an example of:",
      options: [
        "A bug in the AI's code",
        "The AI being lazy",
        "Bias in training data — the data didn't represent all languages equally",
        "AI not being advanced enough yet"
      ],
      correctIndex: 2,
      explanation: "This is a classic training data bias. The AI isn't broken — it learned exactly what it was trained on. The problem is that the training data overrepresented English. The bias was baked in before the AI ever generated a single response."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "During the simulation, what was the hardest decision you had to make about training data? Why was it hard?",
      placeholder: "The hardest decision was... because..."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "If you were in charge of training an AI for your school (grading, attendance, recommendations), what would you do to make sure the training data was fair?",
      placeholder: "I would..."
    },
    {
      id: "real-world",
      type: "callout",
      icon: "🌍",
      style: "warning",
      content: "**Real-world training data failures:**\n\n- **Amazon's hiring AI (2018):** Trained on 10 years of resumes from a male-dominated company. Learned to downrank resumes with the word \"women's\" (e.g., \"women's chess club\"). Amazon scrapped it.\n- **Healthcare AI (2019):** Used healthcare spending as a proxy for health needs. Black patients spent less (due to systemic inequality), so the AI rated them as healthier. 50% of the most at-risk patients were missed.\n- **Facial recognition:** Multiple studies showed higher error rates for darker-skinned faces — because training datasets were disproportionately light-skinned."
    },

    {
      id: "section-vocab",
      type: "section_header",
      title: "Vocabulary",
      subtitle: "",
      icon: "📖"
    },
    {
      id: "vocab1",
      type: "vocab_list",
      terms: [
        {
          term: "Training Data",
          definition: "The dataset used to teach an AI model. The model can only learn patterns that exist in this data — and will reproduce any biases it contains."
        },
        {
          term: "Data Labeling",
          definition: "The process of tagging training examples with categories or descriptions so an AI can learn from them. Labeling decisions directly shape model behavior."
        },
        {
          term: "Representation Bias",
          definition: "When some groups, perspectives, or types of data are overrepresented or underrepresented in training data, causing the model to perform unevenly."
        },
        {
          term: "Proxy Variable",
          definition: "A data point used as a stand-in for something else. Can introduce hidden bias — e.g., using zip code as a proxy for race, or spending as a proxy for health."
        }
      ]
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "Period 4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "Period 5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "Period 7" },
    { courseId: "fUw67wFhAtobWFhjwvZ5", label: "Period 9" },
  ];
  const lessonId = "ai-training-sim";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
