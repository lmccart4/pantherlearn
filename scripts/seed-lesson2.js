// seed-lesson2.js
// Run from your pantherlearn-app directory: node seed-lesson2.js
// Make sure you have firebase configured

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlxvGxLIBUrVO3WWmEcslFpSygeYVeHpY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "293205883325",
  appId: "1:293205883325:web:c0c21ece0b4fc26f673ad4",
  measurementId: "G-5Y6BKF09HF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const lesson = {
  title: "How Smart Is It, Really?",
  course: "Problem Solving with AI",
  unit: "Lesson 2",
  order: 1,
  blocks: [

    // =========================================================
    // WARM UP (~10 minutes)
    // =========================================================
    { id: "section-warmup", type: "section_header", title: "Warm Up", subtitle: "~10 minutes", icon: "🔥" },

    {
      id: "b1", type: "text",
      content: "Last lesson, you explored how AI generates text using **probability** and **pattern recognition**. You saw that AI is like a \"Yes, and…\" machine — building on your input by predicting the most likely next word.\n\nToday, we're going to put AI to the test. **How smart is it, really?**"
    },

    {
      id: "b2", type: "callout", style: "scenario", icon: "📰",
      content: "**Scenario:** You're part of the student newspaper team. You're on deadline, and you're debating whether to use AI to help you get the next issue out."
    },

    {
      id: "b3", type: "text",
      content: "Two of your teammates have strong opinions:\n\n🟢 **AI Hype Person:** \"AI could help generate headlines from the stories we write, or even full articles from just a headline. We don't have to write everything from scratch.\"\n\n🔴 **AI Skeptic:** \"We don't know where it's getting its information from, and sometimes the writing sounds off. It could get the facts wrong or mess up the flow.\""
    },

    {
      id: "b4", type: "question", questionType: "short_answer",
      prompt: "What does the AI Hype Person seem excited about? What does the AI Skeptic seem unsure about? Which side are you leaning toward right now, and why?"
    },

    {
      id: "b5", type: "callout", style: "objective", icon: "🎯",
      content: "**Lesson Objectives**\n\nBy the end of this lesson, you will be able to:\n\n• Identify **strengths and limitations** in how a chatbot generates responses.\n• Reflect on how AI can **impact a real-world industry**."
    },

    {
      id: "b6", type: "callout", style: "question", icon: "❓",
      content: "**Question of the Day:** What can an AI chatbot do well and what does it get wrong?\n\nKeep this question in mind as you work through today's activities."
    },

    // =========================================================
    // ACTIVITY: AI NEWSROOM PLAYGROUND (~25 minutes)
    // =========================================================
    { id: "section-activity", type: "section_header", title: "Activity: AI Newsroom Playground", subtitle: "~25 minutes", icon: "📰" },

    {
      id: "b7", type: "text",
      content: "It's time to put AI to the test! You're going to try out different **newsroom tasks** using an AI chatbot, then evaluate how well it did.\n\nThis is a **KWL activity** — before you test each task, you'll record:\n\n• **K** = What you already **know** (or think you know) about what AI can do for this task\n• **W** = What you **want** to find out or test by trying this task\n• **L** = What you **learned** — what worked, what felt off after using AI"
    },

    {
      id: "b8", type: "activity", title: "Choose Your Newsroom Tasks", icon: "✅",
      instructions: "Browse the task choices below and **pick 3 tasks** you want to test with AI. For each one, think about what you already know and what you want to find out.\n\n**Task Choices:**\n1. 📝 Write a School Event Ad\n2. 😂 Create a Comic or Joke\n3. 📋 Summarize a Current Event\n4. 🧩 Design a Word Puzzle\n5. ⭐ Write a Review (movie, game, restaurant, etc.)\n6. ❓ Make a Quiz\n7. 🗞️ Write a Satirical Article\n8. 🎵 Build a Playlist\n9. 🎨 Create Your Own Task"
    },

    // --- KWL: TASK 1 ---
    {
      id: "b9", type: "text",
      content: "### Task 1\n\nPick your first newsroom task from the list above."
    },

    {
      id: "b10", type: "question", questionType: "short_answer",
      prompt: "Task 1 — What task did you choose? What do you already KNOW (or think you know) about what AI can do for this task? (K)"
    },

    {
      id: "b11", type: "question", questionType: "short_answer",
      prompt: "Task 1 — What do you WANT to find out or test by trying this task with AI? (W)"
    },

    {
      id: "chat1", type: "chatbot",
      title: "AI Newsroom — Task 1",
      icon: "📰",
      instructions: "Ask the AI to help you complete your first newsroom task. Try to be specific in your prompt. Notice what the AI does well and where it falls short.",
      systemPrompt: "You are an AI writing assistant for a student newspaper called 'The Panther Press.' Students will ask you to help with various newsroom tasks like writing headlines, ads, jokes, reviews, quizzes, word puzzles, satirical articles, playlist descriptions, or summarizing events. Do your best on each task, but respond naturally — don't be perfect on purpose, and don't point out your own limitations unless asked. Keep responses concise (under 200 words) so students can evaluate them. If a student asks you to summarize a current event, do your best but note that your information may not be up to date. Be friendly and helpful, like a newsroom intern. For creative tasks like jokes or satire, try your best but don't worry about being hilarious — students are evaluating whether AI can handle creative work. Keep all responses age-appropriate for high school students.",
      starterMessage: "Hey! I'm the AI assistant for The Panther Press. What newsroom task can I help you with today? Just tell me what you need — a headline, an ad, a joke, a quiz, a review, or anything else!",
      placeholder: "Describe your newsroom task..."
    },

    {
      id: "b12", type: "question", questionType: "short_answer",
      prompt: "Task 1 — What did you LEARN? What worked well? What felt off or wasn't quite right? (L)"
    },

    // --- KWL: TASK 2 ---
    {
      id: "b13", type: "text",
      content: "### Task 2\n\nPick your second newsroom task. Try something different from Task 1!"
    },

    {
      id: "b14", type: "question", questionType: "short_answer",
      prompt: "Task 2 — What task did you choose? What do you already KNOW about what AI can do for this? (K)"
    },

    {
      id: "b15", type: "question", questionType: "short_answer",
      prompt: "Task 2 — What do you WANT to find out or test? (W)"
    },

    {
      id: "chat2", type: "chatbot",
      title: "AI Newsroom — Task 2",
      icon: "📰",
      instructions: "Try your second newsroom task. Compare how the AI handles this task versus your first one. Is it better at some things than others?",
      systemPrompt: "You are an AI writing assistant for a student newspaper called 'The Panther Press.' Students will ask you to help with various newsroom tasks like writing headlines, ads, jokes, reviews, quizzes, word puzzles, satirical articles, playlist descriptions, or summarizing events. Do your best on each task, but respond naturally — don't be perfect on purpose, and don't point out your own limitations unless asked. Keep responses concise (under 200 words) so students can evaluate them. If a student asks you to summarize a current event, do your best but note that your information may not be up to date. Be friendly and helpful, like a newsroom intern. For creative tasks like jokes or satire, try your best but don't worry about being hilarious — students are evaluating whether AI can handle creative work. Keep all responses age-appropriate for high school students.",
      starterMessage: "Ready for round 2! What's the next task you'd like me to tackle for The Panther Press?",
      placeholder: "Describe your next newsroom task..."
    },

    {
      id: "b16", type: "question", questionType: "short_answer",
      prompt: "Task 2 — What did you LEARN? What worked? What felt off? (L)"
    },

    // --- KWL: TASK 3 ---
    {
      id: "b17", type: "text",
      content: "### Task 3\n\nPick your third and final newsroom task. Try to pick something that will really challenge the AI!"
    },

    {
      id: "b18", type: "question", questionType: "short_answer",
      prompt: "Task 3 — What task did you choose? What do you already KNOW about what AI can do for this? (K)"
    },

    {
      id: "b19", type: "question", questionType: "short_answer",
      prompt: "Task 3 — What do you WANT to find out or test? (W)"
    },

    {
      id: "chat3", type: "chatbot",
      title: "AI Newsroom — Task 3",
      icon: "📰",
      instructions: "Try your third and final newsroom task. Really push the AI — try something creative, something that requires local knowledge, or something where accuracy really matters.",
      systemPrompt: "You are an AI writing assistant for a student newspaper called 'The Panther Press.' Students will ask you to help with various newsroom tasks like writing headlines, ads, jokes, reviews, quizzes, word puzzles, satirical articles, playlist descriptions, or summarizing events. Do your best on each task, but respond naturally — don't be perfect on purpose, and don't point out your own limitations unless asked. Keep responses concise (under 200 words) so students can evaluate them. If a student asks you to summarize a current event, do your best but note that your information may not be up to date. Be friendly and helpful, like a newsroom intern. For creative tasks like jokes or satire, try your best but don't worry about being hilarious — students are evaluating whether AI can handle creative work. Keep all responses age-appropriate for high school students.",
      starterMessage: "One more task! Let's see what you've got for me. What should I work on?",
      placeholder: "Describe your final newsroom task..."
    },

    {
      id: "b20", type: "question", questionType: "short_answer",
      prompt: "Task 3 — What did you LEARN? What worked? What felt off? (L)"
    },

    // =========================================================
    // ETHICAL CHECKPOINT
    // =========================================================
    { id: "section-ethics", type: "section_header", title: "Ethical Checkpoint", subtitle: "~10 minutes", icon: "⚖️" },

    {
      id: "b21", type: "text",
      content: "Now that you've tested AI on several newsroom tasks, it's time to step back and think critically about what you observed. Not everything AI produces is equally good — and recognizing the difference is an important skill."
    },

    {
      id: "b22", type: "question", questionType: "short_answer",
      prompt: "Name 2 tasks where AI Chat did well. What made those responses good?"
    },

    {
      id: "b23", type: "question", questionType: "short_answer",
      prompt: "Name 2 tasks where AI Chat got things wrong or felt off. What specifically was the problem?"
    },

    {
      id: "b24", type: "question", questionType: "multiple_choice",
      prompt: "Based on your testing, which type of task did AI handle BEST?",
      options: [
        "Tasks that required creativity and humor (jokes, satire)",
        "Tasks that required factual accuracy (current events, quizzes)",
        "Tasks that required structured writing (ads, reviews)",
        "Tasks that required personal knowledge or local context"
      ],
      correctIndex: 2,
      explanation: "AI tends to do well with structured, formulaic writing like ads and reviews because these follow predictable patterns. It struggles more with creativity (humor is subjective), factual accuracy (it can hallucinate details), and anything requiring personal or local knowledge it wasn't trained on."
    },

    {
      id: "b25", type: "definition",
      term: "Hallucination",
      definition: "When an AI generates information that sounds confident and plausible but is actually incorrect or made up. This happens because AI predicts likely-sounding words based on patterns — it doesn't actually verify facts."
    },

    {
      id: "b26", type: "question", questionType: "short_answer",
      prompt: "Fill in the blanks: \"Based on what I saw, AI chatbots are good at ___ but not so good at ___.\""
    },

    {
      id: "b27", type: "question", questionType: "multiple_choice",
      prompt: "A student uses AI to write a news article about a local school board meeting. Which of the following is the BIGGEST risk?",
      options: [
        "The article might be too long",
        "The AI might hallucinate facts, quotes, or details about the meeting",
        "The writing style might be too formal",
        "The article might not have a catchy headline"
      ],
      correctIndex: 1,
      explanation: "The biggest risk is hallucination — the AI might make up facts, invent quotes from people who never said them, or get details of the meeting wrong. Since AI generates text based on patterns rather than real-world knowledge, it can confidently produce incorrect information, which is especially dangerous in journalism where accuracy matters."
    },

    // =========================================================
    // WRAP UP (~5 minutes)
    // =========================================================
    { id: "section-wrap", type: "section_header", title: "Wrap Up", subtitle: "~5 minutes", icon: "🎬" },

    {
      id: "b28", type: "text",
      content: "Today you tested AI on real newsroom tasks and discovered that **AI chatbots have clear strengths and limitations**.\n\nYou learned that AI tends to do well with **structured, pattern-based tasks** like writing ads, generating headlines, or formatting reviews. But it struggles with **creativity, factual accuracy, and anything requiring local or personal knowledge**.\n\nYou also learned about **hallucination** — when AI confidently generates information that is incorrect or made up. This is one of the biggest risks of using AI, especially in fields like journalism where accuracy is essential."
    },

    {
      id: "b29", type: "callout", style: "question", icon: "❓",
      content: "**Return to the Question of the Day:** What can an AI chatbot do well and what does it get wrong?\n\nThink about how your answer has changed since the beginning of class."
    },

    {
      id: "b30", type: "question", questionType: "short_answer",
      prompt: "Answer the Question of the Day: What can an AI chatbot do well and what does it get wrong? Use specific examples from your newsroom testing today."
    },

    {
      id: "b31", type: "text",
      content: "### AI in Journalism: A Real-World Connection\n\nThe debate between the AI Hype Person and the AI Skeptic from our warm-up isn't just a classroom exercise — it's happening right now in real newsrooms around the world.\n\nWatch or discuss the video from NBCU Academy about how journalists are actually using AI in their work, and the ground rules they follow to use it responsibly."
    },

    {
      id: "b32", type: "callout", style: "discuss", icon: "🎥",
      content: "**Video Discussion: How AI Can Help Journalists (NBCU Academy)**\n\nAfter watching, discuss with your group:\n\n• What's one **benefit** and one **risk** of using AI in journalism?\n• Would you want to use AI in a student newspaper or journalism class? Why or why not?"
    },

    {
      id: "b33", type: "question", questionType: "short_answer",
      prompt: "After watching the video and reflecting on today's lesson: Would you want to use AI in a student newspaper? What ground rules would you set? Explain your reasoning."
    },

    // =========================================================
    // VOCABULARY
    // =========================================================
    { id: "section-vocab", type: "section_header", title: "Key Vocabulary", subtitle: "", icon: "📖" },

    {
      id: "b34", type: "vocab_list",
      terms: [
        { term: "Hallucination", definition: "When an AI generates information that sounds confident and plausible but is actually incorrect or made up." },
        { term: "Strengths (of AI)", definition: "Tasks where AI performs well, such as structured writing, summarizing, brainstorming, and following templates or patterns." },
        { term: "Limitations (of AI)", definition: "Tasks where AI struggles, such as verifying facts, being creative in subjective ways, understanding local context, and knowing current events." },
        { term: "KWL Chart", definition: "A learning tool: K = what you Know, W = what you Want to know, L = what you Learned." },
        { term: "Ethical Checkpoint", definition: "A pause to critically evaluate AI output — asking what went well, what went wrong, and what the implications are." }
      ]
    }
  ]
};

async function seed() {
  try {
    await setDoc(
      doc(db, 'courses', 'ai-literacy', 'lessons', 'how-smart-is-it-really'),
      lesson
    );
    console.log('✅ Lesson "How Smart Is It, Really?" seeded successfully!');
    console.log('   Path: courses/ai-literacy/lessons/how-smart-is-it-really');
    console.log('   Blocks:', lesson.blocks.length);
    console.log('   Chatbots: 3 (AI Newsroom Tasks 1-3)');
    console.log('   Questions:', lesson.blocks.filter(b => b.type === 'question').length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
