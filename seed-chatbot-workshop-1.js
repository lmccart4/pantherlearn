// seed-chatbot-workshop-1.js
// Lesson 21 — Build a Chatbot Phase 1-2: Rules-Based AI
// Uses the existing Build-a-Chatbot Workshop (decision tree + keyword matching).

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Build a Chatbot: Rules-Based AI",
  course: "AI Literacy",
  unit: "Prompt Engineering and Applied AI",
  order: 23,
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
        "Build a functional chatbot using decision trees (if/then logic)",
        "Extend your chatbot with keyword matching (pattern recognition)",
        "Understand why rules-based chatbots are limited — and what they can't do",
        "Recognize that early chatbots and many current customer service bots use these exact techniques"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "You've been using AI chatbots all semester — in lessons, in activities, even in your own life. You've seen what they can do and where they fail.\n\nBut have you ever built one?\n\nOver the next two lessons, you'll build a chatbot from scratch — starting with the simplest possible approach and working up to real AI. By the end, you'll understand exactly why modern chatbots work the way they do, because you'll have built every layer yourself."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about a customer service chatbot you've used (Amazon, a bank, a store website). What was frustrating about it? What did it get wrong?",
      placeholder: "I used a chatbot for... and it was frustrating because..."
    },
    {
      id: "wu-reveal",
      type: "callout",
      icon: "💡",
      style: "insight",
      content: "**Here's why those chatbots are frustrating:** Most customer service bots use the same techniques you're about to learn — decision trees and keyword matching. They follow rigid rules. They can't truly understand what you mean. They break the moment you say something unexpected.\n\nToday you'll see exactly why, by building one yourself."
    },

    // ═══════════════════════════════════════════════════════
    // PHASE 1 — DECISION TREE
    // ═══════════════════════════════════════════════════════
    {
      id: "section-phase1",
      type: "section_header",
      title: "Phase 1: Decision Tree",
      subtitle: "~15 minutes",
      icon: "🌳"
    },
    {
      id: "phase1-intro",
      type: "text",
      content: "A **decision tree** is the simplest kind of chatbot. It's like a choose-your-own-adventure book: the bot says something, the user picks from predefined options, and the conversation follows a fixed path.\n\nYou'll drag and drop nodes to build conversation flows — the bot's messages are nodes, and the user's choices are the connections between them."
    },
    {
      id: "phase1-activity",
      type: "activity",
      title: "Build Phase 1: Decision Tree Chatbot",
      icon: "🌳",
      instructions: "1. Open the **Chatbot Workshop** from the lesson block below (or your teacher will share the link)\n2. Start **Phase 1: Decision Tree**\n3. Create a chatbot with at least **3 conversation paths** that branch based on user choices\n4. Test your chatbot — talk to it and see if the paths work\n5. Try to break it — what happens when you say something it doesn't expect?\n\n**Ideas for your chatbot:** School guide, restaurant ordering, quiz game, advice bot, story narrator"
    },
    {
      id: "phase1-callout",
      type: "callout",
      icon: "🤔",
      style: "question",
      content: "**As you build, think about:**\n\n- How many paths would you need to cover every possible user response?\n- What happens when someone types something that isn't one of your predefined options?\n- Could a decision tree chatbot ever feel like a real conversation? Why or why not?"
    },
    {
      id: "phase1-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the biggest limitation of a decision tree chatbot?",
      placeholder: "The biggest limitation is..."
    },

    // ═══════════════════════════════════════════════════════
    // PHASE 2 — KEYWORD MATCHING
    // ═══════════════════════════════════════════════════════
    {
      id: "section-phase2",
      type: "section_header",
      title: "Phase 2: Keyword Matching",
      subtitle: "~15 minutes",
      icon: "🔑"
    },
    {
      id: "phase2-intro",
      type: "text",
      content: "Decision trees force users to pick from preset options. That's not how people actually talk.\n\n**Keyword matching** is the next step up. Instead of giving users buttons, you let them type freely — and your bot scans their message for keywords that match patterns you've defined.\n\nIf the user says \"I need help with my order,\" and you have a rule for the keyword \"order,\" the bot knows to respond with order-related help."
    },
    {
      id: "phase2-modes",
      type: "callout",
      icon: "📋",
      style: "objective",
      content: "**Three matching modes:**\n\n- **ANY** — Triggers if the user's message contains at least one keyword (e.g., \"help\" OR \"support\" OR \"problem\")\n- **ALL** — Triggers only if ALL keywords are present (e.g., \"return\" AND \"order\")\n- **EXACT** — Triggers only if the user types an exact phrase\n\nYou can also set **priority** — if multiple rules match, the highest priority wins."
    },
    {
      id: "phase2-activity",
      type: "activity",
      title: "Upgrade to Phase 2: Keyword Matching",
      icon: "🔑",
      instructions: "1. Switch to **Phase 2** in the Chatbot Workshop\n2. Define at least **5 keyword rules** with different match modes\n3. Set a **fallback response** for when nothing matches\n4. Set **priorities** so more specific rules fire first\n5. Test it — try typing messages that should and shouldn't trigger your rules\n6. Try to break it again — find messages that fool the keyword matcher"
    },
    {
      id: "phase2-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A user types \"I don't want to return my order.\" Your bot has a keyword rule that triggers on \"return\" AND \"order.\" What happens?",
      options: [
        "The bot correctly understands the user doesn't want a return",
        "The bot triggers the return/order response anyway — it matched the keywords regardless of meaning",
        "The bot asks for clarification",
        "The bot ignores the message because of the word 'don't'"
      ],
      correctIndex: 1,
      explanation: "Keyword matching can't understand meaning or context — it just checks if words are present. 'Don't want to return my order' contains both 'return' and 'order,' so the rule fires. This is a fundamental limitation of pattern matching without understanding."
    },

    // ═══════════════════════════════════════════════════════
    // REFLECTION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-reflect",
      type: "section_header",
      title: "Reflection",
      subtitle: "~5 minutes",
      icon: "🪞"
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "How is keyword matching better than a decision tree? How is it still limited?",
      placeholder: "It's better because... but still limited because..."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "What would a chatbot need to be able to do to actually UNDERSTAND what you mean — not just match keywords?",
      placeholder: "It would need to..."
    },
    {
      id: "bridge",
      type: "callout",
      icon: "➡️",
      style: "insight",
      content: "**Next lesson:** You'll upgrade your chatbot with **intent classification** (using the embeddings you learned about earlier!) and then with a **real language model**. You'll see the dramatic difference between pattern matching and actual AI — because you'll have built both."
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
          term: "Decision Tree",
          definition: "A branching structure where each node represents a choice point. In chatbots: the bot says something, the user picks an option, the conversation follows a fixed path."
        },
        {
          term: "Keyword Matching",
          definition: "Scanning user input for specific words or phrases and triggering pre-written responses. Better than decision trees but can't understand meaning or context."
        },
        {
          term: "Fallback Response",
          definition: "The default response a chatbot gives when no rules match the user's input. A safety net for unexpected messages."
        },
        {
          term: "Rules-Based AI",
          definition: "AI systems that follow explicitly programmed if/then rules rather than learning from data. Predictable and transparent, but brittle and unable to handle novel situations."
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
  const lessonId = "chatbot-workshop-rules";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
