// seed-music-lab-ai.js
// Run from your pantherlearn directory: node seed-music-lab-ai.js
// Lesson 15 in AI & Creativity unit — hands-on Music Lab session exploring
// AI beat generation, sequencing, and creative coding. Walk-Up Songs project.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Making Music with AI",
  course: "AI Literacy",
  unit: "AI and Creativity",
  order: 17,
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
      url: "https://pantherlearn.web.app/images/ai-literacy/lesson15-music-lab-hero.png",
      caption: "",
      alt: "Students in a classroom working on music with laptops and headphones"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Experience AI as a creative tool by using AI-generated beats in a music composition",
        "Understand how sequencing — putting instructions in a specific order — is the foundation of both coding and music",
        "Create an original Walk-Up Song that reflects your personality using code blocks, artist samples, and AI beats",
        "Identify where AI contributed vs. where you made the creative decisions"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "Last lesson you explored how AI is used as a creative tool across music, art, writing, and games. Today you're going to experience it firsthand.\n\nYou'll use Code.org's **Music Lab** to compose music using code — dragging and connecting blocks that control what sounds play, when they play, and how they layer together. And you'll use **AI beat generation** to create custom beats based on your creative input."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "If you could pick any song to walk out to — at a game, a graduation, or just entering a room — what would it be and why?",
      placeholder: "I'd walk out to... because..."
    },
    {
      id: "wu-connect",
      type: "callout",
      icon: "🔗",
      style: "insight",
      content: "**The connection to AI:** Music production has always involved technology — from synthesizers to drum machines to auto-tune. AI is the latest tool in that chain. Today you'll see how AI fits into the creative process: it generates raw material (beats), but YOU decide what sounds right, what order things go in, and what the final product feels like."
    },

    // ═══════════════════════════════════════════════════════
    // PART 1 — MUSIC LAB: JAM SESSION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-jam",
      type: "section_header",
      title: "Part 1: Jam Session",
      subtitle: "~15 minutes",
      icon: "🎵"
    },
    {
      id: "jam-intro",
      type: "text",
      content: "First, let's learn how Music Lab works. You'll remix a track from a real artist while learning the basics of music coding: **sequencing** (putting sounds in order) and **layering** (playing multiple sounds at the same time)."
    },
    {
      id: "jam-activity",
      type: "activity",
      title: "Music Lab: Jam Session (Code.org)",
      icon: "🎧",
      instructions: "1. Go to **code.org/music** and click **\"Music Lab: Jam Session\"**\n2. Pick an artist track (Sabrina Carpenter, Shakira, Lady Gaga, Coldplay, etc.)\n3. Follow the guided tutorial — it'll teach you how to:\n   - **Sequence** sounds (play this, then that)\n   - **Layer** tracks (play these at the same time)\n   - **Use functions** (reusable chunks of music)\n4. When you reach the **AI beat generator**, try creating at least 2 different beats\n5. Listen to how AI beats sound vs. the hand-placed samples\n\n**Headphones on. Work through the full tutorial (~15 min).**"
    },
    {
      id: "jam-link",
      type: "callout",
      icon: "🔗",
      style: "tip",
      content: "**Go to: code.org/music**\n\nClick \"Music Lab: Jam Session\" to start. No login required."
    },
    {
      id: "jam-vocab",
      type: "callout",
      icon: "📝",
      style: "definition",
      content: "**Key concepts you'll encounter:**\n\n- **Sequencing** — Putting instructions in a specific order. In music: play the drums first, then the bass, then the melody. In code: line 1 runs before line 2.\n- **Functions** — A reusable block of code. In music: a chorus you can drop in anywhere without rewriting it.\n- **Layering** — Running multiple sequences at the same time. In music: drums + bass + vocals playing together."
    },
    {
      id: "jam-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Which artist did you pick? What did the AI beat generator create for you — and did you keep it, modify it, or throw it out?",
      placeholder: "I picked... The AI generated... I decided to..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 2 — WALK-UP SONGS
    // ═══════════════════════════════════════════════════════
    {
      id: "section-walkup",
      type: "section_header",
      title: "Part 2: Your Walk-Up Song",
      subtitle: "~20 minutes",
      icon: "🏟️"
    },
    {
      id: "walkup-intro",
      type: "text",
      content: "In baseball, every batter has a **walk-up song** — a short clip that plays as they step up to the plate. It sets the tone, hypes the crowd, and says something about who they are.\n\nNow it's your turn. You're going to create a **15-30 second walk-up song** that represents YOU — using everything you just learned in Music Lab."
    },
    {
      id: "walkup-rules",
      type: "callout",
      icon: "📋",
      style: "objective",
      content: "**Walk-Up Song Requirements:**\n\n1. **15-30 seconds long** — short, punchy, memorable\n2. Must include **at least 3 layers** (e.g., beat + melody + effect)\n3. Must use **at least 1 AI-generated beat** — you can modify it, layer over it, or use it as a foundation\n4. Must use **sequencing** — sounds should play in an intentional order, not all at once\n5. Should **feel like you** — what mood, energy, or vibe represents your personality?\n\n**Think about:** Are you hype? Chill? Mysterious? Funny? Your song should match."
    },
    {
      id: "walkup-activity",
      type: "activity",
      title: "Build Your Walk-Up Song",
      icon: "🎤",
      instructions: "1. Open a **new project** in Music Lab (code.org/music → \"Create\")\n2. Start with your foundation — pick or generate a beat\n3. Layer in samples, melodies, or effects\n4. Arrange them into a sequence that builds and hits\n5. Use the AI beat generator to experiment — try different descriptions\n6. Preview, iterate, refine\n7. When you're happy with it, save your project"
    },
    {
      id: "walkup-tips",
      type: "callout",
      icon: "💡",
      style: "tip",
      content: "**Pro tips:**\n\n- **Start with energy level** — decide if your song is high energy, mid, or low key before picking sounds\n- **Use the AI beat generator multiple times** — try different descriptions and compare results\n- **Layer deliberately** — don't just stack everything. Add sounds one at a time and listen to how each one changes the feel\n- **Silence is powerful** — a brief pause before the drop makes it hit harder\n- **Iterate** — your first version probably isn't your best. Try at least 2 arrangements."
    },
    {
      id: "walkup-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your walk-up song in 2-3 sentences. What vibe were you going for? What does it say about you?",
      placeholder: "My walk-up song is... I was going for a... vibe because..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 3 — LISTEN & REFLECT
    // ═══════════════════════════════════════════════════════
    {
      id: "section-reflect",
      type: "section_header",
      title: "Part 3: Listen & Reflect",
      subtitle: "~10 minutes",
      icon: "🪞"
    },
    {
      id: "reflect-intro",
      type: "text",
      content: "If time allows, your teacher may have a few volunteers share their walk-up songs. As you listen, think about:\n\n- Can you hear the person's personality in their song?\n- Can you tell which parts were AI-generated vs. hand-placed?\n- What makes one walk-up song feel more \"personal\" than another?"
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When you used the AI beat generator, the output was:",
      options: [
        "Exactly what I wanted — no changes needed",
        "A good starting point that I modified or built on",
        "Not great — I had to regenerate multiple times to get something usable",
        "I didn't use AI beats at all — I preferred the hand-placed samples"
      ],
      correctIndex: 1,
      explanation: "Most people find that AI generates a reasonable starting point but not a finished product. This is the pattern we keep seeing: AI handles the raw material, humans provide the direction and refinement."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "What percentage of your walk-up song would you say was YOUR creative decisions vs. AI-generated material? (e.g., 70% me / 30% AI). Explain how you came up with that split.",
      placeholder: "I'd say it was about __% me / __% AI because..."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "How is arranging code blocks to make music similar to how a DJ or music producer works? What's the connection between coding and music production?",
      placeholder: "The connection is..."
    },
    {
      id: "coding-connection",
      type: "callout",
      icon: "💻",
      style: "insight",
      content: "**The coding connection:**\n\nWhat you just did IS coding. You wrote a sequence of instructions that a computer executed in order. You used functions (reusable blocks), loops (repeated patterns), and layering (parallel execution).\n\nThese are the same fundamental concepts behind every app, game, and AI system you've used. The only difference is that today your code made sound instead of pixels or text."
    },
    {
      id: "reflect-q4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A music producer uses AI to generate a drum pattern, then records live guitar over it, rearranges the structure, and adds their own vocal effects. Who created the song?",
      options: [
        "The AI created the song",
        "The producer created the song — AI was one tool among many",
        "It's 50/50 — equal credit to both",
        "Nobody can claim credit when AI is involved"
      ],
      correctIndex: 1,
      explanation: "The producer made the creative decisions: what to keep, what to add, how to arrange, what feeling to create. AI generated one element (the drum pattern). This is the co-creation model — AI as a tool in a human-directed process."
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
      content: "Today you experienced AI co-creation through music — the same dynamic that's playing out across every creative field right now.\n\nThe AI generated beats. You decided which ones fit, how to layer them, what order to put things in, and what feeling you wanted the final product to have. **That's the creative direction that makes AI output into something personal.**\n\nNext lesson, you'll push this further with the AI Remix Challenge — taking the co-creation skills you built today and applying them across music, visual art, or writing."
    },
    {
      id: "final-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What's one thing you learned about AI as a creative tool today that surprised you?",
      placeholder: "I was surprised that..."
    },
    {
      id: "takeaways",
      type: "callout",
      icon: "✅",
      style: "success",
      content: "**Key Takeaways:**\n\n- Music production uses the same coding fundamentals as software: sequencing, functions, loops, and layering\n- AI beat generation produces raw material — the creative decisions (what to keep, arrange, layer) are yours\n- A walk-up song feels personal because of human choices, not because of which tool generated the sounds\n- The co-creation pattern holds: AI generates, humans curate and direct\n- Coding is creative expression — today your code made music"
    },

    // ═══════════════════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════════════════
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
          term: "Sequencing",
          definition: "Putting instructions in a specific order so they execute step by step. In music: play the intro, then the verse, then the chorus. In code: line 1 runs before line 2."
        },
        {
          term: "Function",
          definition: "A reusable block of code that performs a specific task. In music: a chorus you can call anywhere without rewriting it. Reduces repetition and keeps code organized."
        },
        {
          term: "Loop",
          definition: "A set of instructions that repeats a specified number of times. In music: a 4-bar drum pattern that repeats throughout the song."
        },
        {
          term: "Layering (Parallel Execution)",
          definition: "Running multiple sequences of instructions at the same time. In music: drums, bass, and melody all playing simultaneously. In computing: multiple processes running in parallel."
        },
        {
          term: "AI Beat Generation",
          definition: "Using artificial intelligence to create musical patterns (beats, rhythms, melodies) based on a text description or style input. The AI generates options; the human selects and arranges them."
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

  const lessonId = "music-lab-ai";

  for (const course of courses) {
    await db.collection("courses").doc(course.courseId)
      .collection("lessons").doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label} (${course.courseId})`);
  }

  console.log(`\n   Lesson ID: ${lessonId}`);
  console.log(`   Order: ${lesson.order} (Lesson 15 — AI and Creativity)`);
  console.log(`   Blocks: ${lesson.blocks.length}`);
  console.log(`   Visible: false (publish via Lesson Editor when ready)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error seeding lesson:", err);
  process.exit(1);
});
