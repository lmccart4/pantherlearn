// seed-ai-remix-challenge.js
// Run from your pantherlearn directory: node seed-ai-remix-challenge.js
// Lesson 15 in AI & Creativity unit — hands-on creative project using AI tools.
// Links to Code.org Music Lab and explores AI as creative collaborator.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "The AI Remix Challenge",
  course: "AI Literacy",
  unit: "AI and Creativity",
  order: 18,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~5 minutes",
      icon: "🔥"
    },
    {
      id: "hero-img",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/lesson15-remix-challenge-hero.png",
      caption: "",
      alt: "A teenager creating music in a studio with AI-generated waveforms"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Use AI tools as part of a creative workflow to produce an original remix",
        "Practice iterating on AI-generated output — selecting, refining, and combining results",
        "Reflect on the balance between human creative input and AI-generated material in your final product",
        "Evaluate what makes an AI-assisted creative work feel authentic vs. generic"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "In the last two lessons you explored how AI is used as a creative tool — and you experienced it firsthand making music in Code.org's Music Lab. You saw the pattern: **AI generates, humans curate.**\n\nToday you push that further. You're going to create something original using AI as your co-creator across any creative medium — and then reflect on what you actually contributed vs. what the AI did."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What's something creative you wish you could make but don't have the technical skills for? (A song, a piece of art, a video, a game, an app?)",
      placeholder: "I've always wanted to make..."
    },

    // ═══════════════════════════════════════════════════════
    // THE CHALLENGE
    // ═══════════════════════════════════════════════════════
    {
      id: "section-challenge",
      type: "section_header",
      title: "The AI Remix Challenge",
      subtitle: "~30 minutes",
      icon: "🎤"
    },
    {
      id: "challenge-intro",
      type: "text",
      content: "Your challenge: **Create an original remix using AI as your creative partner.**\n\nYou'll pick one of three tracks below. Each one uses a different AI creative tool. The goal isn't to let AI do all the work — it's to direct the AI, iterate on what it gives you, and make something that feels like *yours*."
    },
    {
      id: "tracks-img",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/lesson15-three-tracks.png",
      caption: "Pick your track: Music, Visual Art, or Writing",
      alt: "Three creative track icons: music, visual art, and writing"
    },
    {
      id: "challenge-rules",
      type: "callout",
      icon: "📋",
      style: "objective",
      content: "**Challenge Rules:**\n\n1. You must make **at least 3 creative decisions** that shape the final product (not just clicking \"generate\")\n2. You must **iterate** — try something, evaluate it, and adjust at least once\n3. You must be able to explain **what you contributed** vs. what AI generated\n4. Your final product should feel intentional, not random"
    },
    {
      id: "track-a",
      type: "callout",
      icon: "🎵",
      style: "scenario",
      content: "**Track A: Music Remix**\n\nUse Code.org's **Music Lab** to create an original music remix.\n\n**Go to: code.org/music**\n\n1. Pick an artist track to start with (Sabrina Carpenter, Shakira, Lady Gaga, etc.)\n2. Use the block-based editor to remix and rearrange the song\n3. Use the AI beat generator to create custom beats\n4. Layer your own sequences over the AI-generated elements\n5. Export or screenshot your final composition\n\n**Your creative decisions:** Song selection, arrangement, which AI beats to keep vs. discard, layering, structure."
    },
    {
      id: "track-b",
      type: "callout",
      icon: "🖼️",
      style: "scenario",
      content: "**Track B: Visual Remix**\n\nUse an AI image tool to create a visual piece — a poster, album cover, or concept art.\n\n1. Start with a clear creative vision: What do you want to make? What's the mood, subject, style?\n2. Write your first prompt. Generate an image.\n3. Evaluate: What's working? What's off?\n4. Iterate: Refine your prompt at least 3 times based on what you see\n5. Pick your best result and explain your creative choices\n\n**Your creative decisions:** Concept, mood, style direction, prompt refinement, which output to select.\n\n*Your teacher will direct you to the tool for this track.*"
    },
    {
      id: "track-c",
      type: "callout",
      icon: "✍️",
      style: "scenario",
      content: "**Track C: Writing Remix**\n\nUse the AI chatbot below to co-write a short creative piece (micro-story, poem, or song lyrics).\n\n1. Start with YOUR idea — a theme, a mood, a first line, a character\n2. Ask the AI to help you develop it — but don't just accept its first draft\n3. Push back, redirect, ask for alternatives, rewrite sections yourself\n4. Your final piece should be a blend of your voice and AI suggestions\n\n**Your creative decisions:** Theme, tone, structure, what to keep/change/rewrite, the final version."
    },
    {
      id: "writing-chatbot",
      type: "chatbot",
      title: "Creative Writing Partner",
      icon: "✍️",
      instructions: "Use this chatbot for Track C. Share your creative idea and work with the AI to develop it. Push back on suggestions that don't fit your vision.",
      systemPrompt: "You are a creative writing partner for a high school student. Help them develop their creative piece (micro-story, poem, or song lyrics). Follow their creative direction — don't take over. When they share an idea, offer suggestions but always ask what they think. If they want alternatives, give 2-3 options and let them choose. Keep your contributions short (2-4 lines at a time). Never write a complete piece for them — always leave room for them to add, change, or redirect. Match their tone and style. If they seem stuck, ask a question to unlock their thinking rather than just generating content for them.",
      starterMessage: "Hey! I'm here to help you write something creative. What are you thinking — a micro-story, a poem, song lyrics, or something else? Give me your idea, a mood, a first line — whatever you've got — and we'll build from there.",
      minMessages: 8
    },
    {
      id: "progress-check",
      type: "callout",
      icon: "⏱️",
      style: "tip",
      content: "**Halfway check:** Have you made at least 3 intentional creative decisions so far? If you've just been clicking \"generate\" and accepting the first result, go back and iterate. The challenge is about directing AI, not just watching it work."
    },

    // ═══════════════════════════════════════════════════════
    // REFLECTION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-reflection",
      type: "section_header",
      title: "Reflection: What Did You Actually Create?",
      subtitle: "~10 minutes",
      icon: "🪞"
    },
    {
      id: "reflect-intro",
      type: "text",
      content: "Now the important part. Anyone can press a button and get AI to generate something. The question is: **how much of the final product is yours?**"
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Which track did you choose (A, B, or C)? Describe what you created in 2-3 sentences.",
      placeholder: "I chose Track _ and created..."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "List the specific creative decisions YOU made during the process. What did you choose, change, reject, or redirect?",
      placeholder: "1. I decided to...\n2. I changed...\n3. I rejected the AI's suggestion to..."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "What did the AI contribute? What would have been missing without it?",
      placeholder: "The AI provided..."
    },
    {
      id: "reflect-q4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "If you showed your remix to someone without context, would they think it was made entirely by a human, entirely by AI, or a collaboration?",
      options: [
        "It would look/sound entirely human-made",
        "It would look/sound like a human-AI collaboration",
        "It would look/sound entirely AI-generated",
        "It's hard to tell — that's kind of the point"
      ],
      correctIndex: 1,
      explanation: "Most AI-assisted creative work falls in the collaboration zone. The interesting question isn't whether AI was involved — it's whether the human brought real creative direction to the process."
    },
    {
      id: "generic-callout",
      type: "callout",
      icon: "🤔",
      style: "insight",
      content: "**The \"generic\" problem:**\n\nOne of the biggest criticisms of AI-generated creative work is that it often feels *generic* — technically competent but lacking personality, surprise, or a point of view.\n\nThat's because AI generates the statistically *average* response. It produces what's most likely, not what's most interesting.\n\nThe human contribution is what pushes creative work from **generic** to **specific** — from \"a song\" to \"*my* song.\""
    },
    {
      id: "reflect-q5",
      type: "question",
      questionType: "short_answer",
      prompt: "Does your remix feel generic or does it feel like yours? What would you do differently to make it more personal?",
      placeholder: "My remix feels... because..."
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "wrapup-text",
      type: "text",
      content: "Today you experienced what AI co-creation actually feels like — not in theory, but in practice.\n\nThe takeaway isn't that AI is good or bad at creativity. It's that **the quality of AI-assisted creative work depends almost entirely on the quality of the human directing it.**\n\nSomeone who knows what they want, iterates thoughtfully, and makes intentional choices will get something meaningful. Someone who just clicks \"generate\" will get something forgettable."
    },
    {
      id: "final-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Complete this sentence: \"AI is most useful as a creative tool when the human...\"",
      placeholder: "AI is most useful as a creative tool when the human..."
    },
    {
      id: "takeaways",
      type: "callout",
      icon: "✅",
      style: "success",
      content: "**Key Takeaways:**\n\n- AI co-creation requires active human direction — not just pressing generate\n- Iteration is key: the first AI output is rarely the best; refining, selecting, and redirecting improve results\n- AI tends toward generic output; human specificity is what makes creative work feel authentic\n- The quality of AI-assisted work reflects the quality of the human's creative vision and choices\n- Being able to explain what you contributed vs. what AI generated is a skill in itself"
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

  const lessonId = "ai-remix-challenge";

  for (const course of courses) {
    await db.collection("courses").doc(course.courseId)
      .collection("lessons").doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label} (${course.courseId})`);
  }

  console.log(`\n   Lesson ID: ${lessonId}`);
  console.log(`   Order: ${lesson.order} (Lesson 16 — AI and Creativity)`);
  console.log(`   Blocks: ${lesson.blocks.length}`);
  console.log(`   Visible: false (publish via Lesson Editor when ready)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error seeding lesson:", err);
  process.exit(1);
});
