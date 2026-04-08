// seed-lesson5.js
// Run this from your pantherlearn directory: node seed-lesson5.js
// Make sure you have your Firebase config set up

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = getFirestore();

const lesson = {
  title: "Is It Biased?",
  course: "Exploring Generative AI",
  unit: "Lesson 5",
  order: 4,
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
      content: "Imagine you're helping a community organization build an AI-powered recommendation tool. It suggests things like movies, books, music, and activities to people in the community."
    },
    {
      id: "b2",
      type: "activity",
      title: "Two Perspectives",
      icon: "💬",
      instructions: "Read these two reactions to the AI recommendation tool:\n\n**AI Hype Person:** \"This tool helps people discover new things faster. It keeps the recommendations clear, consistent, and easy to scan.\"\n\n**AI Skeptic:** \"I've noticed the tool repeats certain types of suggestions. I wonder if it's capturing the full range of voices we want to represent.\"\n\nDiscuss with your group:\n• What is the **AI Hype Person** trying to improve?\n• What is the **AI Skeptic** trying to protect?"
    },
    {
      id: "b3",
      type: "question",
      questionType: "short_answer",
      prompt: "What is the AI Skeptic trying to protect? Why might their concern matter for a community tool?"
    },
    // --- OBJECTIVES ---
    {
      id: "b4",
      type: "objectives",
      title: "Lesson Objectives",
      items: [
        "Analyze AI-generated responses for signs of bias, stereotypes, or assumptions",
        "Reflect on the potential impact of biased AI outputs in the real world"
      ]
    },
    {
      id: "b5",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** How can we tell if a chatbot response is biased?"
    },

    // ═══════════════════════════════════════
    // ACTIVITY (~25 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "Activity: Bias in AI Outputs",
      subtitle: "~25 minutes",
      icon: "🔍"
    },
    {
      id: "b6",
      type: "definition",
      term: "Bias",
      definition: "When a system favors certain information over others. This can mean treating some people, groups, or ideas differently based on patterns in its training data."
    },
    {
      id: "b7",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Key things to know about AI bias:**\n\n• It's not always obvious — bias can be subtle\n• It can show up in what the AI **includes** or **leaves out**\n• The AI isn't *trying* to be unfair, but it's working with what it's seen in its training data"
    },
    {
      id: "b8",
      type: "text",
      content: "Let's explore how bias can show up in AI recommendations. Use the chatbot below to try some recommendation prompts. Pay attention to what the AI suggests — and what it might be leaving out.\n\nTry 2–3 prompts from the list, then save one response that felt **balanced or helpful** and one that felt **limited, repetitive, or biased**."
    },

    // ═══════════════════════════════════════
    // CHATBOT 1: Exploring AI Recommendations (Level 1)
    // ═══════════════════════════════════════
    {
      id: "chat1",
      type: "chatbot",
      title: "AI Recommendations Explorer",
      icon: "🎯",
      instructions: "Try 2–3 of these prompts (or make up your own!):\n\n• \"Recommend a movie for a teenager\"\n• \"What's a good book for someone who likes adventure?\"\n• \"Suggest some music for studying\"\n• \"What are fun weekend activities for a high school student?\"\n• \"Recommend a role model for young people\"\n• \"What's a good career for someone who likes helping others?\"\n\nPay attention: What types of suggestions come up? What's missing?",
      systemPrompt: "You are an AI recommendation tool being used in a classroom lesson about AI bias. Students will ask you for recommendations (movies, books, music, activities, careers, role models, etc.). Your job is to respond naturally — but you should subtly demonstrate common AI biases so students can detect them. Specifically: (1) Lean toward mainstream, Western, English-language suggestions unless asked otherwise. (2) If asked about careers or role models, subtly default to traditionally gendered suggestions. (3) If asked about activities, lean toward suggestions that assume a certain income level or access. (4) Keep recommendations somewhat repetitive and 'safe' — popular choices rather than diverse or niche ones. Do NOT be obviously offensive — the bias should be subtle enough that students have to think critically to notice it. Keep responses concise (3-5 items with brief descriptions). Be friendly and helpful on the surface. If a student directly asks about bias, acknowledge that AI can have biases and encourage them to think about what might be missing.",
      starterMessage: "Hi! I'm your AI recommendation assistant. Ask me to suggest movies, books, music, activities, careers, or anything else — and I'll give you my best picks! Try a few different prompts and see what patterns you notice.",
      placeholder: "Ask for a recommendation..."
    },
    {
      id: "b9",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick one response that felt BALANCED or HELPFUL. What prompt did you use, and what made the response feel fair?"
    },
    {
      id: "b10",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick one response that felt LIMITED, REPETITIVE, or BIASED. What prompt did you use? What's showing up in the response, and what seems to be missing or assumed?"
    },

    // --- BIAS TYPES TABLE ---
    {
      id: "b11",
      type: "text",
      content: "Now that you've seen some AI recommendations, let's name the specific types of bias you might have noticed:"
    },
    {
      id: "b12",
      type: "callout",
      style: "insight",
      icon: "🔎",
      content: "**Types of Bias to Look For:**\n\n**Relied on a stereotype** — Used a common but oversimplified idea\n\n**Assumed one identity** — Acted like there's only one \"normal\" version of a person\n\n**Left out other perspectives** — Ignored important or diverse voices\n\n**Language didn't feel inclusive** — Used language that didn't represent everyone"
    },

    // ═══════════════════════════════════════
    // PART 2: Refining Prompts to Mitigate Bias (Level 2)
    // ═══════════════════════════════════════
    {
      id: "section-refine",
      type: "section_header",
      title: "Refining Prompts to Mitigate Bias",
      subtitle: "~10 minutes",
      icon: "✏️"
    },
    {
      id: "b13",
      type: "text",
      content: "One way to reduce bias in AI responses is to **rewrite your prompt** to include a specific context, identity, or perspective. For example:\n\n**Original:** \"Recommend a movie for a teenager\"\n**Revised:** \"Recommend a movie for a teenager who loves Korean culture and sci-fi, directed by someone outside of Hollywood\"\n\nThe more specific your prompt, the harder it is for the AI to fall back on generic, biased defaults. Let's try it!"
    },

    // ═══════════════════════════════════════
    // CHATBOT 2: Refined Prompts (Level 2)
    // ═══════════════════════════════════════
    {
      id: "chat2",
      type: "chatbot",
      title: "Bias Reduction Lab",
      icon: "🧪",
      instructions: "Take one of the prompts you tried earlier and **rewrite it** to include:\n\n• A specific cultural context or identity\n• A particular perspective or background\n• Constraints that push beyond the \"default\"\n\nCompare the new response to the original. How did it change? Is there still bias?",
      systemPrompt: "You are an AI recommendation tool being used in a classroom lesson about reducing AI bias through better prompting. Students will give you more specific, detailed prompts that include cultural contexts, identities, or perspectives. When students provide specific details, give genuinely diverse and thoughtful recommendations that reflect those details. Show that specific prompts lead to more inclusive results. However, you may still have some subtle remaining biases — for example, you might still lean toward well-known examples within a given culture rather than truly niche ones. Keep responses concise (3-5 items with brief descriptions). Be friendly and encouraging about their prompt improvements. If they compare to earlier generic prompts, acknowledge the difference. Stay age-appropriate for high school students.",
      starterMessage: "Welcome to the Bias Reduction Lab! Take a prompt you used before and rewrite it with more specific details — a cultural context, a perspective, a constraint. Let's see how the recommendations change!",
      placeholder: "Try a more specific, inclusive prompt..."
    },
    {
      id: "b14",
      type: "question",
      questionType: "short_answer",
      prompt: "What was your revised prompt? How did the response change compared to the original?"
    },
    {
      id: "b15",
      type: "question",
      questionType: "short_answer",
      prompt: "Even with a more specific prompt, what might STILL be missing or assumed in the AI's response?"
    },
    {
      id: "b16",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which type of bias did you observe MOST in the AI's original (generic) recommendations?",
      options: [
        "Relied on a stereotype — used oversimplified ideas",
        "Assumed one identity — acted like there's only one \"normal\"",
        "Left out other perspectives — ignored diverse voices",
        "Language didn't feel inclusive — didn't represent everyone"
      ],
      correctIndex: -1,
      explanation: "There's no single right answer here — this depends on what you observed! The important thing is that you noticed the pattern."
    },

    // --- VIDEO ---
    {
      id: "section-video",
      type: "section_header",
      title: "Video: Ethics and AI",
      subtitle: "~5 minutes",
      icon: "🎬"
    },
    {
      id: "b17",
      type: "video",
      url: "https://www.youtube.com/embed/tJQSyzBUAew",
      caption: "Watch: Ethics and AI — Equal Access & Algorithmic Bias (Code.org)"
    },
    {
      id: "b18",
      type: "question",
      questionType: "short_answer",
      prompt: "How does bias in real-world data influence the decisions made by AI systems? Give an example from the video or your own experience."
    },
    {
      id: "b19",
      type: "question",
      questionType: "short_answer",
      prompt: "Why is the inclusion of diverse data critical in creating fairer AI systems?"
    },

    // ═══════════════════════════════════════
    // WRAP UP (~10 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-wrap",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~10 minutes",
      icon: "🎬"
    },
    {
      id: "b20",
      type: "text",
      content: "Today you learned about **bias in AI outputs** — how AI systems can favor certain information, perspectives, or groups based on patterns in their training data. You explored how bias shows up in AI recommendations and practiced **refining prompts** to push AI toward more inclusive responses."
    },
    {
      id: "b21",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** How can we tell if a chatbot response is biased?\n\nThink about your answer — then complete the Ethical Checkpoint below."
    },

    // ═══════════════════════════════════════
    // CHATBOT 3: Ethical Checkpoint (Level 3)
    // ═══════════════════════════════════════
    {
      id: "section-checkpoint",
      type: "section_header",
      title: "Ethical Checkpoint",
      subtitle: "",
      icon: "⚖️"
    },
    {
      id: "b22",
      type: "text",
      content: "Let's put your bias detection skills to the test. The AI below has been asked about **Thanksgiving recipes**. Review its response and use the bias checklist to analyze what you see."
    },
    {
      id: "chat3",
      type: "chatbot",
      title: "Ethical Checkpoint",
      icon: "⚖️",
      instructions: "The AI has already been given this prompt: **\"What are some traditional Thanksgiving recipes?\"**\n\nRead the response carefully, then answer these questions:\n\n• Which bias checklist items apply? (Stereotype? Assumed identity? Left out perspectives? Non-inclusive language?)\n• How could the AI's response be improved?\n\nYou can also ask follow-up questions to test the AI further!",
      systemPrompt: "You are an AI assistant being used in a classroom lesson about AI bias. You have just been asked about traditional Thanksgiving recipes. In your FIRST response (the starter message), you gave a response that subtly demonstrates bias by focusing primarily on a narrow, mainstream American Thanksgiving tradition (turkey, stuffing, cranberry sauce, pumpkin pie, mashed potatoes, green bean casserole) without acknowledging that Thanksgiving traditions vary widely across cultures, regions, and families. You did not mention Indigenous perspectives on the holiday, vegan/vegetarian options, non-American thanksgiving traditions, or dishes from diverse cultural backgrounds that families bring to the table. If students ask follow-up questions that are more specific or push for diversity, respond with genuinely diverse and inclusive recommendations. If students ask you to analyze the bias in your own first response, be honest and thoughtful about what was missing. Keep responses concise and age-appropriate for high school students.",
      starterMessage: "Great question! Here are some classic Thanksgiving recipes:\n\n🦃 **Roasted Turkey** — The centerpiece of any Thanksgiving table. Brine it overnight for the juiciest results!\n\n🍞 **Classic Stuffing** — Made with bread cubes, celery, onion, and sage. Some families cook it inside the turkey.\n\n🫐 **Cranberry Sauce** — Homemade is easy! Just simmer cranberries with sugar and orange zest.\n\n🥧 **Pumpkin Pie** — A must-have dessert. Use canned pumpkin for convenience or roast your own.\n\n🥔 **Mashed Potatoes & Gravy** — Creamy, buttery, and perfect for soaking up gravy.\n\n🥗 **Green Bean Casserole** — Topped with crispy fried onions, this is a crowd favorite!\n\nWant me to share any of these recipes in detail?",
      placeholder: "Ask a follow-up or analyze the response for bias..."
    },
    {
      id: "b23",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which types of bias are present in the AI's Thanksgiving recipe response? (Choose the BEST answer)",
      options: [
        "Only 'relied on a stereotype' — it used oversimplified ideas about Thanksgiving",
        "Only 'assumed one identity' — it assumed everyone celebrates the same way",
        "Both 'assumed one identity' AND 'left out other perspectives' — it assumed one tradition and ignored diverse voices",
        "No bias — the response was balanced and inclusive"
      ],
      correctIndex: 2,
      explanation: "The AI assumed a single, mainstream American Thanksgiving tradition and left out Indigenous perspectives, diverse cultural dishes, dietary variations, and non-American thanksgiving traditions. Both biases are present."
    },
    {
      id: "b24",
      type: "question",
      questionType: "short_answer",
      prompt: "How could the AI's Thanksgiving recipe response be improved to be more inclusive? What perspectives or traditions were left out?"
    },

    // --- FINAL REFLECTION ---
    {
      id: "b25",
      type: "question",
      questionType: "short_answer",
      prompt: "In one sentence, answer the Question of the Day: How can we tell if a chatbot response is biased?"
    },

    // --- VOCABULARY ---
    {
      id: "section-vocab",
      type: "section_header",
      title: "Key Vocabulary",
      subtitle: "",
      icon: "📖"
    },
    {
      id: "b26",
      type: "vocab_list",
      terms: [
        {
          term: "Bias",
          definition: "When a system favors certain information over others, treating some people, groups, or ideas differently based on patterns in its training data."
        },
        {
          term: "Stereotype",
          definition: "A widely held but oversimplified idea about a particular type of person or thing."
        },
        {
          term: "Training Data",
          definition: "The large collection of text, images, or other information that an AI model learns patterns from during its development."
        },
        {
          term: "Inclusive Language",
          definition: "Language that avoids assumptions and represents the full diversity of people, cultures, and experiences."
        }
      ]
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, 'ai-literacy', 'is-it-biased', lesson);
    console.log('✅ Lesson "Is It Biased?" seeded successfully!');
    console.log('   Path: courses/ai-literacy/lessons/is-it-biased');
    console.log('   Blocks:', lesson.blocks.length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
