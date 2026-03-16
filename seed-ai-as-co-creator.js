// seed-ai-as-co-creator.js
// Run from your pantherlearn directory: node seed-ai-as-co-creator.js
// Lesson 14 in AI & Creativity unit — explores how AI augments human creativity
// rather than replacing it. Links to Code.org Mix & Move with AI.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "AI as a Co-Creator",
  course: "AI Literacy",
  unit: "AI and Creativity",
  order: 16,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "hero-img",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/lesson14-ai-co-creator-hero.png",
      caption: "",
      alt: "A student collaborating with an AI assistant on creative work"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify how AI is currently used as a creative tool across music, visual art, writing, and design",
        "Distinguish between AI as a replacement for human creativity and AI as a collaborator that amplifies it",
        "Evaluate the strengths and limitations of AI-generated creative work",
        "Reflect on what makes human creativity different from AI pattern generation"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "In the last unit, you learned how generative AI works under the hood — tokens, embeddings, attention, hallucinations, and all the ways AI can go wrong.\n\nNow the question shifts: **What can we actually build with it?**\n\nToday we're exploring AI as a creative partner. Not a replacement for your ideas — a tool that can help you get them out faster, push them further, or take them in directions you didn't expect."
    },
    {
      id: "wu-scenario",
      type: "callout",
      icon: "🎨",
      style: "scenario",
      content: "**Imagine this:** You're working on a school project — a poster, a presentation, a short story, a song. You have the idea in your head, but turning it into something real is taking forever.\n\nNow imagine you had an assistant who could:\n- Generate 10 different versions of your background image in 30 seconds\n- Suggest 5 different ways to phrase your opening line\n- Create a beat that matches the mood you described\n- Mock up a layout based on a rough sketch you described in words\n\nThat assistant isn't replacing your creativity. It's amplifying it."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Have you ever used AI to help with something creative — even informally? What did you use it for, and how did it go?",
      placeholder: "I used AI to help me..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 1 — AI IN THE CREATIVE WORLD
    // ═══════════════════════════════════════════════════════
    {
      id: "section-creative-world",
      type: "section_header",
      title: "Part 1: AI in the Creative World",
      subtitle: "~15 minutes",
      icon: "🌍"
    },
    {
      id: "creative-intro",
      type: "text",
      content: "AI is already being used in creative fields — and not just by tech companies. Musicians, designers, filmmakers, writers, and game developers are all experimenting with AI as part of their creative process.\n\nLet's look at some real examples across four domains."
    },
    {
      id: "domain-music",
      type: "callout",
      icon: "🎵",
      style: "insight",
      content: "**Music**\n\nAI tools can generate beats, melodies, and full instrumentals from text descriptions. Artists use AI to:\n- Prototype song ideas quickly before committing to studio time\n- Generate background music for videos, games, and podcasts\n- Remix and reimagine existing tracks in new styles\n- Create practice tracks in specific keys or tempos\n\n**The human role:** AI generates *sound*, but the artist decides what sounds *right*. Choosing, arranging, and performing still require human taste, emotion, and intent."
    },
    {
      id: "domain-visual",
      type: "callout",
      icon: "🖼️",
      style: "insight",
      content: "**Visual Art & Design**\n\nImage generation tools (DALL-E, Midjourney, Stable Diffusion) can create images from text prompts. Designers use AI to:\n- Rapidly explore visual concepts and mood boards\n- Generate placeholder images during early design phases\n- Create variations on a theme (10 logo concepts in 2 minutes)\n- Produce custom illustrations when stock images don't fit\n\n**The human role:** AI can generate images — but it can't understand your brand, your audience, or why a particular composition *feels* right. Curation, refinement, and creative direction remain human."
    },
    {
      id: "domain-writing",
      type: "callout",
      icon: "✍️",
      style: "insight",
      content: "**Writing**\n\nLLMs can draft, brainstorm, restructure, and edit text. Writers use AI to:\n- Break through writer's block by generating starting points\n- Explore different tones or perspectives on the same content\n- Get feedback on clarity, structure, or pacing\n- Generate first drafts that they then heavily revise\n\n**The human role:** AI produces text that sounds reasonable. But voice, authenticity, lived experience, and meaningful storytelling come from the writer. The best AI-assisted writing is human-directed and human-revised."
    },
    {
      id: "domain-games",
      type: "callout",
      icon: "🎮",
      style: "insight",
      content: "**Games & Interactive Media**\n\nGame developers use AI to:\n- Generate background environments and textures\n- Create NPC dialogue that adapts to player choices\n- Design procedural levels and challenges\n- Prototype game mechanics quickly before building them out\n\n**The human role:** AI can generate content, but game designers decide what makes a game *fun*, *fair*, and *meaningful*. The creative vision — what the player should feel — is irreducibly human."
    },
    {
      id: "pattern-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What pattern do you notice across all four domains?",
      options: [
        "AI is replacing human creators entirely in every field",
        "AI generates raw material, but humans provide direction, taste, and meaning",
        "AI only works for music and visual art, not writing or games",
        "Human creativity is no longer necessary when AI tools are available"
      ],
      correctIndex: 1,
      explanation: "Across every domain, the pattern is the same: AI generates options quickly, but humans decide what's good, what fits, and what matters. The creative judgment — taste, intent, audience awareness — stays human."
    },

    // ═══════════════════════════════════════════════════════
    // PART 2 — TRY IT: MIX & MOVE WITH AI
    // ═══════════════════════════════════════════════════════
    {
      id: "section-mix-move",
      type: "section_header",
      title: "Part 2: Mix & Move with AI",
      subtitle: "~20 minutes",
      icon: "💃"
    },
    {
      id: "mix-move-intro",
      type: "text",
      content: "Time to experience AI as a creative tool firsthand.\n\nCode.org's **Mix & Move with AI** lets you design a dancer using AI-generated images, remix music from real artists, and code a choreographed performance — all using AI as your creative partner."
    },
    {
      id: "mix-move-activity",
      type: "activity",
      title: "Mix & Move with AI (Code.org)",
      icon: "🕺",
      instructions: "1. Open the activity: **code.org/mix-move-ai**\n2. Design your dancer — explore how AI generates different character designs from your prompt choices\n3. Choose and remix music from the available tracks\n4. Code your dance sequence using the block-based editor\n5. Watch your creation perform!\n\n**As you work, pay attention to:**\n- Where did YOU make the creative decisions?\n- Where did the AI generate the raw material?\n- Did the AI ever produce something you didn't expect — good or bad?"
    },
    {
      id: "mix-move-link",
      type: "callout",
      icon: "🔗",
      style: "tip",
      content: "**Activity Link:** Go to **code.org/mix-move-ai** to start the activity.\n\nThis activity takes about 15-20 minutes. Work through all the stages — designing, remixing, and coding your performance."
    },
    {
      id: "mix-move-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your experience with Mix & Move. What creative decisions did YOU make vs. what did the AI generate for you?",
      placeholder: "I decided to... but the AI generated..."
    },
    {
      id: "mix-move-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "Did the AI ever produce something unexpected? Was it a happy accident or did you need to adjust?",
      placeholder: "The AI surprised me when..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 3 — TOOL vs. REPLACEMENT
    // ═══════════════════════════════════════════════════════
    {
      id: "section-tool-replacement",
      type: "section_header",
      title: "Part 3: Tool vs. Replacement",
      subtitle: "~10 minutes",
      icon: "⚖️"
    },
    {
      id: "tool-replacement-img",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/lesson14-tool-vs-replacement.png",
      caption: "Left: AI creating alone. Right: Human guiding AI to create something personal.",
      alt: "Split-screen showing a robot hand painting generically versus a human hand guiding the robot to paint expressively"
    },
    {
      id: "spectrum-intro",
      type: "text",
      content: "There's a big difference between these two statements:\n\n- **\"AI can create music.\"** ← Technically true\n- **\"AI is a musician.\"** ← Not true at all\n\nA paintbrush can create art. That doesn't make the paintbrush an artist.\n\nThe debate around AI and creativity often gets stuck because people conflate the *tool* with the *creator*. Let's sort out where AI actually sits on the spectrum."
    },
    {
      id: "spectrum-sort",
      type: "sorting",
      title: "Tool or Replacement?",
      icon: "🔍",
      instructions: "For each scenario, decide: is AI being used as a **creative tool** (human-directed), or is someone treating it as a **replacement** for human creativity?",
      leftLabel: "Tool 🔧",
      rightLabel: "Replacement 🤖",
      items: [
        {
          text: "A designer generates 20 logo concepts with AI, picks 3, then refines them by hand",
          correct: "left"
        },
        {
          text: "A student submits an AI-generated essay without reading or editing it",
          correct: "right"
        },
        {
          text: "A musician uses AI to create a drum beat, then records live guitar and vocals over it",
          correct: "left"
        },
        {
          text: "A company fires its entire illustration team and replaces them with an image generator",
          correct: "right"
        },
        {
          text: "A filmmaker uses AI to generate concept art for scenes before hiring artists to create the final versions",
          correct: "left"
        },
        {
          text: "A news site publishes AI-written articles with no human review or editing",
          correct: "right"
        },
        {
          text: "A writer uses AI to brainstorm 10 different story openings, then writes the actual story themselves",
          correct: "left"
        },
        {
          text: "A game studio uses AI to generate all dialogue, environments, and music with no human creative direction",
          correct: "right"
        }
      ]
    },
    {
      id: "spectrum-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What's the key difference between using AI as a tool and using it as a replacement? Where's the line?",
      placeholder: "The difference is..."
    },

    // ═══════════════════════════════════════════════════════
    // CHECK FOR UNDERSTANDING
    // ═══════════════════════════════════════════════════════
    {
      id: "section-check",
      type: "section_header",
      title: "Check for Understanding",
      subtitle: "~5 minutes",
      icon: "✅"
    },
    {
      id: "check-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A photographer uses AI to remove the background from a portrait, then composites it onto a hand-painted scene they created. This is best described as:",
      options: [
        "AI replacing the photographer's creativity",
        "AI and the photographer collaborating — AI handles a technical task, human provides creative vision",
        "The photographer cheating by using AI",
        "AI doing all the creative work while the photographer takes credit"
      ],
      correctIndex: 1,
      explanation: "The photographer made the creative decisions (composition, subject, painted scene). AI handled a mechanical task (background removal). This is collaboration — AI as a tool serving human creative intent."
    },
    {
      id: "check-q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why can't AI truly 'be creative' the way humans are?",
      options: [
        "AI doesn't have fast enough processors to be creative",
        "AI generates outputs based on statistical patterns — it has no intent, taste, or lived experience to draw from",
        "AI hasn't been trained on enough creative works yet",
        "AI is creative, but it's a different kind of creativity that's actually better than human creativity"
      ],
      correctIndex: 1,
      explanation: "Creativity involves intent, emotion, lived experience, and making choices that mean something. AI generates statistically likely outputs — it can produce novel combinations, but it doesn't have the inner life that drives genuine creative expression."
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
      content: "The best way to think about AI in creative work isn't \"AI vs. humans\" — it's **\"AI + humans.\"**\n\nThe strongest creative work using AI happens when a human brings the vision, taste, and intent — and uses AI to execute faster, explore more options, or handle the technical grunt work.\n\nThe weakest outcomes happen when someone treats AI as the creator and themselves as the button-pusher."
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about a creative project you're working on (for any class, or outside of school). How could you use AI as a co-creator — not a replacement — to make it better?",
      placeholder: "I could use AI to help me..."
    },
    {
      id: "takeaways",
      type: "callout",
      icon: "✅",
      style: "success",
      content: "**Key Takeaways:**\n\n- AI is already being used as a creative tool across music, art, writing, games, and design\n- The pattern is consistent: AI generates raw material, humans provide direction, taste, and meaning\n- There's a critical difference between AI as a tool (human-directed) and AI as a replacement (no human involvement)\n- AI can produce novel combinations but lacks intent, emotion, and lived experience\n- The strongest creative outcomes combine human vision with AI capabilities"
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
          term: "AI Co-Creation",
          definition: "A workflow where a human provides creative direction and an AI tool generates, suggests, or refines material based on that direction. The human retains decision-making authority over the final output."
        },
        {
          term: "Generative AI",
          definition: "AI systems that produce new content — text, images, music, code — based on patterns learned from training data. The output is novel but statistically derived, not intentionally created."
        },
        {
          term: "Creative Direction",
          definition: "The human decisions that shape a creative project: what to make, who it's for, what it should feel like, and what makes it good. AI can assist with execution, but creative direction comes from human intent."
        },
        {
          term: "Curation",
          definition: "The process of selecting, organizing, and refining from a larger set of options. In AI-assisted work, curation is the human skill of choosing which AI-generated outputs are worth keeping, combining, or building on."
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

  const lessonId = "ai-as-co-creator";

  for (const course of courses) {
    await db.collection("courses").doc(course.courseId)
      .collection("lessons").doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label} (${course.courseId})`);
  }

  console.log(`\n   Lesson ID: ${lessonId}`);
  console.log(`   Order: ${lesson.order} (Lesson 14 — AI and Creativity)`);
  console.log(`   Blocks: ${lesson.blocks.length}`);
  console.log(`   Visible: false (publish via Lesson Editor when ready)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error seeding lesson:", err);
  process.exit(1);
});
