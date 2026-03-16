// seed-chatbot-workshop-2.js
// Lesson 22 — Build a Chatbot Phase 3-4: From Embeddings to LLM
// Uses the existing Build-a-Chatbot Workshop (intent classifier + LLM).

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Build a Chatbot: From Embeddings to AI",
  course: "AI Literacy",
  unit: "Prompt Engineering and Applied AI",
  order: 24,
  visible: false,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~5 minutes",
      icon: "🔥"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Train an intent classifier using embeddings to understand user meaning — not just keywords",
        "Experience the jump from rules-based to AI-powered chatbots firsthand",
        "Write a system prompt that controls an LLM-powered chatbot's personality and behavior",
        "Compare all 4 approaches (decision tree → keywords → intents → LLM) and evaluate their tradeoffs"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "Last lesson, you hit the wall with rules-based chatbots. They matched keywords but couldn't understand meaning. \"I don't want to return my order\" triggered the return flow because it contained the word \"return.\"\n\nToday you break through that wall — twice. First with **intent classification** (using the embeddings you learned about in Unit 2), then with a **real language model**. By the end, you'll have a chatbot that actually understands what users mean."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Remember embeddings? Words that mean similar things are close together in number space. How could that help a chatbot understand what a user means?",
      placeholder: "Embeddings could help because..."
    },

    // ═══════════════════════════════════════════════════════
    // PHASE 3 — INTENT CLASSIFIER
    // ═══════════════════════════════════════════════════════
    {
      id: "section-phase3",
      type: "section_header",
      title: "Phase 3: Intent Classifier",
      subtitle: "~15 minutes",
      icon: "🧠"
    },
    {
      id: "phase3-intro",
      type: "text",
      content: "An **intent classifier** doesn't look for exact keywords. Instead, it converts the user's message into an embedding (a list of numbers representing meaning) and compares it to examples you've provided.\n\nIf a user says \"I'd like to send this back,\" the intent classifier recognizes that's semantically similar to \"return my order\" — even though the words are completely different.\n\nThis is the bridge between rules-based systems and real AI."
    },
    {
      id: "phase3-activity",
      type: "activity",
      title: "Build Phase 3: Intent Classifier",
      icon: "🧠",
      instructions: "1. Switch to **Phase 3** in the Chatbot Workshop\n2. Define at least **4 intents** (e.g., greeting, farewell, help request, complaint)\n3. For each intent, add **3-5 training examples** — different ways someone might express that intent\n4. Set a **confidence threshold** (default 0.65 — how sure the bot needs to be before matching)\n5. Test it: try messages that are similar to but not exactly your training examples\n6. Compare: try the same messages that broke your keyword matcher. Does intent classification handle them better?"
    },
    {
      id: "phase3-callout",
      type: "callout",
      icon: "💡",
      style: "tip",
      content: "**Training tip:** The more diverse your training examples, the better the intent classifier works. If your \"greeting\" intent only has \"hello\" and \"hi,\" it won't recognize \"what's up\" or \"hey there.\" Add variety!\n\nAlso try the confidence threshold slider — too low and the bot guesses wrong; too high and it says \"I don't understand\" too often."
    },
    {
      id: "phase3-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why is intent classification better than keyword matching for chatbots?",
      options: [
        "It's faster to set up — fewer rules needed",
        "It understands MEANING through embeddings, not just the presence of specific words",
        "It never makes mistakes",
        "It doesn't need any training data"
      ],
      correctIndex: 1,
      explanation: "Intent classification converts messages to embeddings and measures semantic similarity. 'I'd like to send this back' and 'return my order' have different words but similar meanings — and similar embeddings. That's why it works where keyword matching fails."
    },

    // ═══════════════════════════════════════════════════════
    // PHASE 4 — LLM-POWERED
    // ═══════════════════════════════════════════════════════
    {
      id: "section-phase4",
      type: "section_header",
      title: "Phase 4: LLM-Powered Chatbot",
      subtitle: "~15 minutes",
      icon: "✨"
    },
    {
      id: "phase4-intro",
      type: "text",
      content: "Now for the big jump. In Phase 4, your chatbot is powered by a real **language model** — the same kind of technology behind ChatGPT, Gemini, and Claude.\n\nYour job is no longer to write rules or train intents. Instead, you write a **system prompt** — a set of instructions that tells the LLM how to behave, what persona to adopt, and what it should and shouldn't do.\n\nThis is where everything you learned in the prompt engineering unit comes together."
    },
    {
      id: "phase4-templates",
      type: "callout",
      icon: "📋",
      style: "objective",
      content: "**Starter templates to choose from:**\n\n🎓 **Friendly Tutor** — Guides learning with questions instead of answers\n🎯 **Quiz Master** — Interactive quizzes with scoring\n🎭 **Character Bot** — Roleplay a specific character, stay in persona\n📖 **Story Guide** — Choose-your-own-adventure narrator\n\nOr write your own system prompt from scratch!"
    },
    {
      id: "phase4-activity",
      type: "activity",
      title: "Build Phase 4: LLM-Powered Chatbot",
      icon: "✨",
      instructions: "1. Switch to **Phase 4** in the Chatbot Workshop\n2. Choose a template or write your own system prompt\n3. Adjust the **temperature slider** (remember token prediction? Low = predictable, high = creative)\n4. Test your chatbot extensively — try to break it\n5. Refine your system prompt based on what the chatbot does wrong\n6. When you're happy, **publish** your bot to the Bot Arcade for classmates to test"
    },
    {
      id: "phase4-tips",
      type: "callout",
      icon: "💡",
      style: "tip",
      content: "**System prompt tips:**\n\n- Be specific about personality, tone, and length (\"respond in 2-3 sentences, friendly but not overly enthusiastic\")\n- Include things the bot should NEVER do (\"never reveal the answer directly — always ask a guiding question first\")\n- Test edge cases — what happens if the user asks something off-topic?\n- Iterate! Your first system prompt probably won't be perfect."
    },

    // ═══════════════════════════════════════════════════════
    // REFLECTION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-reflect",
      type: "section_header",
      title: "Reflection: The Full Evolution",
      subtitle: "~10 minutes",
      icon: "🪞"
    },
    {
      id: "evolution-text",
      type: "text",
      content: "You just built the same chatbot four different ways. Let's compare:"
    },
    {
      id: "evolution-callout",
      type: "callout",
      icon: "📊",
      style: "insight",
      content: "**The Evolution:**\n\n🌳 **Decision Tree** → Fixed paths, user picks from options. Simple but rigid.\n🔑 **Keyword Matching** → Free text, but only checks for word presence. Can't understand meaning.\n🧠 **Intent Classifier** → Uses embeddings to understand meaning. Needs training examples.\n✨ **LLM** → Generates natural responses from a system prompt. Flexible but harder to control.\n\nThis is roughly the history of chatbot technology — from the 1960s (ELIZA) to today (ChatGPT)."
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Which phase felt like the biggest jump in capability? Why?",
      placeholder: "The biggest jump was from Phase _ to Phase _ because..."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A hospital wants a chatbot that helps patients book appointments. Which approach would you recommend?",
      options: [
        "Decision tree — patients pick from predefined options, reducing errors in a high-stakes context",
        "Keyword matching — it's the easiest to set up quickly",
        "Intent classifier — it understands patients even when they phrase things differently",
        "LLM — it gives the most natural conversation experience"
      ],
      correctIndex: 0,
      explanation: "For high-stakes applications like healthcare, a decision tree is often the safest choice — patients pick from clear options, nothing gets misinterpreted, and the system is fully predictable. More advanced approaches add flexibility but also add risk of misunderstanding."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "When would you choose a rules-based chatbot over an LLM-powered one? Give a specific scenario.",
      placeholder: "I'd choose rules-based when... because..."
    },
    {
      id: "arcade-callout",
      type: "callout",
      icon: "🎮",
      style: "tip",
      content: "**Bot Arcade:** If you published your bot, check the Bot Arcade to test your classmates' chatbots! Rate them on understanding and helpfulness. Can you stump anyone's bot?"
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
          term: "Intent Classification",
          definition: "Categorizing user messages by their purpose (intent) using embeddings and semantic similarity rather than keyword matching. Understands meaning, not just words."
        },
        {
          term: "System Prompt",
          definition: "Hidden instructions given to an LLM that define its persona, behavior rules, and constraints. The user never sees the system prompt, but it shapes every response."
        },
        {
          term: "Confidence Threshold",
          definition: "The minimum similarity score required for an intent classifier to match. Too low = false matches; too high = too many 'I don't understand' responses."
        },
        {
          term: "Bot Persona",
          definition: "The personality, tone, and behavior of a chatbot as defined by its system prompt. A tutor bot, a pirate bot, and a customer service bot all have different personas."
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
  const lessonId = "chatbot-workshop-ai";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
