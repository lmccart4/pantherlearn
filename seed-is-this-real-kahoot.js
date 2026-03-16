// seed-is-this-real-kahoot.js
// Lesson 15 — AI & Creativity unit
// Kahoot-style challenge: students compete to identify AI vs real images.
// Teacher runs the actual Kahoot on kahoot.com using images from public/images/ai-literacy/kahoot/

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Is This Real? The Kahoot Challenge",
  course: "AI Literacy",
  unit: "AI and Creativity",
  order: 15,
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
        "Apply image detection strategies from the previous lesson under time pressure",
        "Identify which detection clues are most reliable across different image categories",
        "Analyze why certain AI-generated images are harder to detect than others",
        "Reflect on how detection skills translate to real-world media literacy"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "Last lesson you learned strategies for spotting AI-generated images: checking hands, text, shadows, skin texture, and context clues.\n\nToday you put those skills to the test — **competitively.** We're running a Kahoot quiz where every image is either AI-generated or a real photograph. You'll have limited time to decide.\n\nLet's see who's been paying attention."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Quick review: Name 3 things you look for when trying to tell if an image is AI-generated.",
      placeholder: "1. ...\n2. ...\n3. ..."
    },

    // ═══════════════════════════════════════════════════════
    // PRE-GAME STRATEGY
    // ═══════════════════════════════════════════════════════
    {
      id: "section-strategy",
      type: "section_header",
      title: "Strategy Check",
      subtitle: "~5 minutes",
      icon: "🧠"
    },
    {
      id: "strategy-text",
      type: "text",
      content: "Before we start, let's sharpen our strategy. In a Kahoot, you only have seconds to decide. You can't zoom in, you can't reverse image search, you can't take your time. So you need a quick mental checklist."
    },
    {
      id: "strategy-callout",
      type: "callout",
      icon: "⚡",
      style: "tip",
      content: "**Speed Detection Checklist:**\n\n1. **First impression** — Does it feel \"too perfect\"? Too cinematic? Too clean?\n2. **Scan for text** — Any writing in the image? Is it gibberish?\n3. **Check edges** — Where objects meet backgrounds, do things blend or blur unnaturally?\n4. **Look at people** — Skin too smooth? Hair edges weird? Hands visible?\n5. **Trust your gut** — If something feels off, it probably is."
    },

    // ═══════════════════════════════════════════════════════
    // THE KAHOOT
    // ═══════════════════════════════════════════════════════
    {
      id: "section-kahoot",
      type: "section_header",
      title: "The Kahoot Challenge",
      subtitle: "~20 minutes",
      icon: "🏆"
    },
    {
      id: "kahoot-text",
      type: "text",
      content: "Your teacher will launch the Kahoot now. Join using the game PIN displayed on the screen.\n\nFor each image, you'll answer: **AI-Generated or Real Photograph?**\n\nThe images span categories: people, animals, food, landscapes, street scenes, and sports. Some are easy. Some will fool you."
    },
    {
      id: "kahoot-callout",
      type: "callout",
      icon: "📋",
      style: "objective",
      content: "**Kahoot Categories:**\n\n- Portraits and people\n- Animals and pets\n- Food photography\n- Landscapes and nature\n- Urban/street scenes\n- Action/sports\n\nEach round: one image, two choices — **AI or Real**. Think fast."
    },
    {
      id: "kahoot-tip",
      type: "callout",
      icon: "💡",
      style: "insight",
      content: "**Pro tip:** During the Kahoot, pay attention to which images fool the most people. After each round, your teacher will reveal the answer — look at the image again and try to spot the clues you missed. This is how you calibrate your detection skills."
    },

    // ═══════════════════════════════════════════════════════
    // POST-GAME ANALYSIS
    // ═══════════════════════════════════════════════════════
    {
      id: "section-analysis",
      type: "section_header",
      title: "Post-Game Analysis",
      subtitle: "~10 minutes",
      icon: "📊"
    },
    {
      id: "analysis-text",
      type: "text",
      content: "Now that the Kahoot is over, let's analyze the results. The goal isn't just to win — it's to understand WHY some images are harder to detect than others."
    },
    {
      id: "analysis-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "How did you do? What was your accuracy? Which image fooled you the most, and why?",
      placeholder: "I got about... right. The image that fooled me most was... because..."
    },
    {
      id: "analysis-q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which category of AI images tends to be HARDEST to detect?",
      options: [
        "Landscapes and nature — AI is great at scenery",
        "Close-up portraits — AI faces are now nearly perfect",
        "Action shots — motion blur hides AI artifacts",
        "All of the above — it depends on the specific image, not the category"
      ],
      correctIndex: 3,
      explanation: "There's no single \"easy\" category anymore. AI has improved across all types. Landscapes can fool you with their beauty, portraits with their detail, and action shots with their blur. The best approach is to use multiple detection strategies regardless of the image type."
    },
    {
      id: "analysis-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about the AI images that fooled the MOST people in the class. What made them convincing? What was missing that would have given them away?",
      placeholder: "The most convincing AI images worked because... What was missing..."
    },

    // ═══════════════════════════════════════════════════════
    // BIG PICTURE
    // ═══════════════════════════════════════════════════════
    {
      id: "section-bigpicture",
      type: "section_header",
      title: "The Bigger Picture",
      subtitle: "~5 minutes",
      icon: "🌍"
    },
    {
      id: "bigpicture-text",
      type: "text",
      content: "Here's the uncomfortable truth: **AI image generation is improving faster than human detection ability.** The artifacts we check for today — weird hands, bad text, smooth skin — will be fixed in the next model update.\n\nSo what do we do? We can't just rely on spotting visual glitches. We need a broader media literacy approach:"
    },
    {
      id: "bigpicture-callout",
      type: "callout",
      icon: "🛡️",
      style: "insight",
      content: "**Beyond Visual Detection:**\n\n- **Source verification** — Where did this image come from? Is the source trustworthy?\n- **Context checking** — Does this image match other reporting on the same event?\n- **Metadata analysis** — Tools can check if an image has camera data or AI generation signatures\n- **Healthy skepticism** — Don't share dramatic images without verification, even if they look real\n- **AI watermarking** — Some companies (Google, OpenAI) are embedding invisible watermarks in AI images. This may become standard."
    },
    {
      id: "bigpicture-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "If AI images become completely undetectable by eye, what systems or rules should society put in place? Think about news, social media, courts, and schools.",
      placeholder: "I think we should... because..."
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "",
      icon: "🎯"
    },
    {
      id: "wrapup-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What's the MOST important takeaway from these two lessons on AI-generated images?",
      options: [
        "AI images are easy to spot if you know the tricks",
        "You should never trust any image you see online",
        "Visual detection skills matter, but source verification and critical thinking are even more important as AI improves",
        "AI image generation should be banned because it's too dangerous"
      ],
      correctIndex: 2,
      explanation: "Visual detection skills are useful NOW, but they have an expiration date as AI improves. The lasting skill is critical thinking: checking sources, verifying context, and maintaining healthy skepticism. That's real media literacy."
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
          term: "AI Artifact",
          definition: "A visual glitch or error in an AI-generated image — such as extra fingers, garbled text, or inconsistent shadows. These are tells that the image was created by AI rather than captured by a camera."
        },
        {
          term: "AI Watermarking",
          definition: "An invisible digital signature embedded in AI-generated images that can be detected by software but not by the human eye. Some companies are implementing this to help identify AI content."
        },
        {
          term: "Source Verification",
          definition: "The practice of checking where an image or piece of information originated, whether the source is trustworthy, and whether other reputable sources confirm the same claim."
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
  const lessonId = "is-this-real-kahoot";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
