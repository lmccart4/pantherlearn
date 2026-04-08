// seed-digital-literacy.js
// Creates the Digital Literacy Period 3 course + 5 lessons
// Run: node seed-digital-literacy.js
//
// ⬇️ SET YOUR TEACHER UID before running ⬇️

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

// ⬇️ SET YOUR TEACHER UID HERE ⬇️
const MY_TEACHER_UID = "M2sNE8iH1aZ57L8z8Snp1Sj8cFD2";

// ═══════════════════════════════════════════════════════════════
// COURSE DOCUMENT
// ═══════════════════════════════════════════════════════════════

const course = {
  title: "Digital Literacy",
  description: "Video production, AI awareness, and digital storytelling",
  icon: "🎬",
  order: 1,
  ownerUid: MY_TEACHER_UID,
  sections: {
    "period-3": {
      name: "Period 3",
      enrollCode: "DGTL-P3" + Math.random().toString(36).substring(2, 4).toUpperCase()
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// LESSON 1: AI Is Everywhere (Week 2, Day 1)
// ═══════════════════════════════════════════════════════════════

const lesson1 = {
  title: "AI Is Everywhere",
  course: "Digital Literacy",
  unit: "Week 2: AI & Video Production",
  unitOrder: 1,
  order: 0,
  blocks: [
    // --- INTRO ---
    {
      id: "L1-section-intro",
      type: "section_header",
      title: "Introduction",
      subtitle: "~10 minutes",
      icon: "🤖"
    },
    {
      id: "L1-b1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify examples of AI that you interact with daily",
        "Define artificial intelligence in your own words",
        "Choose an AI topic for your explainer video project"
      ]
    },
    {
      id: "L1-b2",
      type: "callout",
      icon: "🤔",
      style: "question",
      content: "**Think About It:** How many times did you interact with AI today — before even getting to school?\n\nTake 30 seconds to think... (Hint: It's probably more than you think!)"
    },
    {
      id: "L1-b3",
      type: "question",
      questionType: "short_answer",
      prompt: "List at least 3 ways you interacted with AI before getting to school today. Think about your phone, apps, music, navigation, etc.",
      points: 5
    },

    // --- AI YOU ALREADY USE ---
    {
      id: "L1-section-examples",
      type: "section_header",
      title: "AI You Already Use",
      subtitle: "Everyday AI examples",
      icon: "📱"
    },
    {
      id: "L1-b4",
      type: "text",
      content: "You probably use AI dozens of times every day without even thinking about it. Here are some common examples:\n\n**🎵 Spotify / Apple Music** — Recommends songs based on what you like\n\n**📱 Face ID / Unlock** — Recognizes YOUR face specifically\n\n**🗺 Google Maps** — Predicts traffic and suggests the fastest routes\n\n**📷 Photo Filters** — Detects faces and applies effects in real time\n\n**💬 Autocomplete** — Predicts what you'll type next\n\n**📺 TikTok / YouTube** — Decides what videos to show you based on your behavior"
    },
    {
      id: "L1-b5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of these is the BEST example of AI making a decision for you?",
      options: [
        "Using a calculator to add numbers",
        "TikTok choosing which videos appear on your For You Page",
        "Turning on your phone's flashlight",
        "Sending a text message to a friend"
      ],
      correctIndex: 1,
      explanation: "TikTok's algorithm analyzes your behavior — what you watch, how long you watch, what you skip — and uses that data to predict and decide what content to show you next. That's AI making decisions based on patterns in data. The other options are straightforward commands with no learning or prediction involved.",
      points: 5
    },

    // --- WHAT IS AI ---
    {
      id: "L1-section-definition",
      type: "section_header",
      title: "What Even IS AI?",
      subtitle: "Defining artificial intelligence",
      icon: "🧠"
    },
    {
      id: "L1-b6",
      type: "definition",
      term: "Artificial Intelligence (AI)",
      definition: "Computers that can learn from data and make decisions. Instead of following exact rules, AI finds patterns and makes predictions."
    },
    {
      id: "L1-b7",
      type: "text",
      content: "There's an important difference between traditional programming and AI:\n\n**Traditional Programming:** \"If the user types X, do Y.\" — The programmer writes every rule.\n\n**AI / Machine Learning:** \"Learn from millions of examples what users probably want.\" — The system discovers patterns on its own.\n\nFor example, a traditional spam filter might have a rule like \"if the email contains 'free money,' mark it as spam.\" An AI spam filter learns from millions of emails what spam *looks like* and can catch new types of spam it's never seen before."
    },
    {
      id: "L1-b8",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What's the key difference between traditional programming and AI?",
      options: [
        "AI is faster than traditional programs",
        "Traditional programs use the internet, AI doesn't",
        "AI learns from data and finds patterns instead of following pre-written rules",
        "There is no difference — they work the same way"
      ],
      correctIndex: 2,
      explanation: "The key distinction is that traditional programs follow explicit rules written by a programmer, while AI systems learn patterns from data and can make predictions about new situations they haven't explicitly been programmed for.",
      points: 5
    },

    // --- BIG QUESTIONS ---
    {
      id: "L1-section-questions",
      type: "section_header",
      title: "The Big Questions",
      subtitle: "Things worth thinking about",
      icon: "❓"
    },
    {
      id: "L1-b9",
      type: "text",
      content: "As we explore AI this week, keep these big questions in mind:\n\n**🔴 Is AI helpful or creepy?** (or both?)\n\n**🔵 Who decides what AI shows you?** — Someone designed the algorithm. What are their goals?\n\n**🟣 Can you trust AI-generated content?** — How do you know if something was made by a human or AI?\n\n**🟢 How is AI changing jobs & creativity?** — What happens when AI can write, draw, and compose music?"
    },
    {
      id: "L1-b10",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick ONE of the big questions above. What's your initial reaction or opinion? There's no wrong answer — just think honestly about it.",
      points: 5
    },

    // --- YOUR PROJECT ---
    {
      id: "L1-section-project",
      type: "section_header",
      title: "Your Project This Week",
      subtitle: "AI Explainer Video",
      icon: "🎬"
    },
    {
      id: "L1-b11",
      type: "callout",
      icon: "🎥",
      style: "highlight",
      content: "**This week's project:** Create a **60–90 second explainer video** about AI in everyday life using WeVideo.\n\nYou'll pick ONE AI topic, explain how it works simply, share your opinion (helpful, concerning, or \"it depends\"), and use visuals, voiceover, and/or text to make it engaging."
    },
    {
      id: "L1-b12",
      type: "text",
      content: "**Video Topic Ideas:**\n\n• How TikTok's algorithm decides what you see\n• AI in healthcare: diagnosing diseases\n• AI art generators: creative tool or theft?\n• Self-driving cars: are they ready?\n• Voice assistants (Siri/Alexa) — always listening?\n• ChatGPT & AI writing tools\n• Deepfakes: can you trust what you see?\n• Facial recognition: security vs. privacy\n\n*Or choose your own! Check with me if you're unsure.*"
    },

    // --- TODAY'S ACTIVITY ---
    {
      id: "L1-section-activity",
      type: "section_header",
      title: "Today's Activity",
      subtitle: "Brainstorm & Plan",
      icon: "✏️"
    },
    {
      id: "L1-b13",
      type: "activity",
      icon: "📝",
      title: "Brainstorm & Choose Your Topic",
      instructions: "Complete these steps:\n\n**1. Brainstorm** — List 5+ ways AI affects YOUR life\n\n**2. Watch** — Short clips showing AI in action (your teacher will share links)\n\n**3. Explore** — Research one AI topic that interests you\n\n**4. Choose** — Pick your video topic and angle\n\n**5. Plan** — Start your video outline on the handout"
    },
    {
      id: "L1-b14",
      type: "question",
      questionType: "short_answer",
      prompt: "What AI topic did you choose for your explainer video? Why does it interest you?",
      points: 5
    },
    {
      id: "L1-b15",
      type: "question",
      questionType: "short_answer",
      prompt: "What angle or opinion will you take in your video? Will you argue AI is helpful, concerning, or 'it depends'? Explain briefly.",
      points: 5
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 2: WeVideo Basics (Week 2, Day 2)
// ═══════════════════════════════════════════════════════════════

const lesson2 = {
  title: "WeVideo Basics",
  course: "Digital Literacy",
  unit: "Week 2: AI & Video Production",
  unitOrder: 1,
  order: 1,
  blocks: [
    // --- INTRO ---
    {
      id: "L2-section-intro",
      type: "section_header",
      title: "Getting Started with WeVideo",
      subtitle: "Learn the editing tool for your AI explainer video",
      icon: "🎬"
    },
    {
      id: "L2-b1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Navigate the WeVideo editor interface",
        "Use basic editing tools: trim, split, add text, add music, and transitions",
        "Create a short practice video to build editing skills"
      ]
    },

    // --- WHAT IS WEVIDEO ---
    {
      id: "L2-section-what",
      type: "section_header",
      title: "What is WeVideo?",
      subtitle: "A browser-based video editor",
      icon: "🌐"
    },
    {
      id: "L2-b2",
      type: "text",
      content: "**WeVideo** is a browser-based video editor — no downloads needed! It works right in your browser, which means it runs on Chromebooks and any computer with internet access.\n\nKey features you'll use:\n\n• **Drag-and-drop timeline editing** — arrange clips by dragging them\n• **Add text, music, and transitions** — make your videos look polished\n• **Works on Chromebooks** — no special software required\n• **Free version** has everything you need for this project"
    },
    {
      id: "L2-b3",
      type: "callout",
      icon: "🌐",
      style: "action",
      content: "**Go to:** [wevideo.com](https://www.wevideo.com) → Sign in with your Google account"
    },

    // --- THE INTERFACE ---
    {
      id: "L2-section-interface",
      type: "section_header",
      title: "The Interface",
      subtitle: "Know your workspace",
      icon: "🖥️"
    },
    {
      id: "L2-b4",
      type: "text",
      content: "WeVideo's editor has three main areas:\n\n**📁 Media Library** (left panel)\nThis is where you upload videos and images, and access stock content like photos, video clips, and music.\n\n**👁️ Preview Window** (center)\nWatch your video as you build it. You'll see changes in real time here.\n\n**🎞️ Timeline** (bottom)\nThis is where the magic happens. You arrange your clips in order, trim them, split them, and adjust timing. Think of it like a horizontal storyboard."
    },

    // --- KEY SKILLS ---
    {
      id: "L2-section-skills",
      type: "section_header",
      title: "Key Editing Skills",
      subtitle: "The 5 tools you need to know",
      icon: "🔧"
    },
    {
      id: "L2-b5",
      type: "text",
      content: "**✂️ Trimming** — Drag the edges of a clip to shorten it. This removes content from the beginning or end.\n\n**🔪 Splitting** — Place the playhead where you want to cut, then press the **S key** (or click the split button). This cuts a clip into two pieces so you can remove a section in the middle.\n\n**🔤 Adding Text** — Click the **Text** tab in the media panel, choose a text style, and drag it onto your timeline. Double-click to edit what it says.\n\n**🎵 Adding Music** — Click the **Audio** tab, browse the free music library, and drag a track below your video on the timeline.\n\n**🔄 Transitions** — Drag a transition (like fade or dissolve) between two clips on the timeline."
    },
    {
      id: "L2-b6",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which keyboard shortcut splits a clip in WeVideo?",
      options: [
        "T key",
        "S key",
        "X key",
        "Spacebar"
      ],
      correctIndex: 1,
      explanation: "Press the S key to split a clip at the current playhead position. This is one of the most useful shortcuts you'll use while editing!",
      points: 5
    },

    // --- PRACTICE ---
    {
      id: "L2-section-practice",
      type: "section_header",
      title: "Practice: 15-Second Clip",
      subtitle: "Build your first video",
      icon: "🎯"
    },
    {
      id: "L2-b7",
      type: "activity",
      icon: "🎬",
      title: "Create a 15-Second Practice Video",
      instructions: "Create a short practice video in WeVideo that includes:\n\n✅ A title slide with your name\n✅ At least one image or video clip\n✅ Background music\n✅ One transition between clips\n\n**You have 20 minutes.** This doesn't need to be perfect — it's practice! The goal is to get comfortable with the tools."
    },
    {
      id: "L2-b8",
      type: "question",
      questionType: "short_answer",
      prompt: "What was the hardest part of creating your practice clip? What would you do differently next time?",
      points: 5
    },

    // --- PRO TIPS ---
    {
      id: "L2-section-tips",
      type: "section_header",
      title: "Pro Tips",
      subtitle: "Work smarter, not harder",
      icon: "💡"
    },
    {
      id: "L2-b9",
      type: "callout",
      icon: "💡",
      style: "tip",
      content: "**5 Pro Tips for WeVideo:**\n\n1. **Ctrl/Cmd + Z** to undo — your best friend when you make a mistake\n2. **Double-click** a clip for more editing options (speed, color, etc.)\n3. **Keep music volume low** if you're adding voiceover — the voice should always be louder\n4. **Save often** — WeVideo auto-saves, but don't rely on it\n5. **Preview frequently** — watch your video as you edit to catch issues early"
    },
    {
      id: "L2-b10",
      type: "callout",
      icon: "📅",
      style: "highlight",
      content: "**Tomorrow:** We'll learn storytelling structure — how to organize your explainer video so it actually grabs attention and keeps viewers watching."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 3: Storytelling Structure (Week 2, Day 3)
// ═══════════════════════════════════════════════════════════════

const lesson3 = {
  title: "Storytelling Structure",
  course: "Digital Literacy",
  unit: "Week 2: AI & Video Production",
  unitOrder: 1,
  order: 2,
  blocks: [
    // --- INTRO ---
    {
      id: "L3-section-intro",
      type: "section_header",
      title: "Storytelling Structure",
      subtitle: "Make your explainer video actually engaging",
      icon: "📖"
    },
    {
      id: "L3-b1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply the Hook → Context → Examples → Takeaway structure to your video",
        "Write a compelling hook that grabs attention in the first 3 seconds",
        "Create a complete video script with visual planning"
      ]
    },

    // --- THE EXPLAINER FORMULA ---
    {
      id: "L3-section-formula",
      type: "section_header",
      title: "The Explainer Formula",
      subtitle: "A proven structure for explainer videos",
      icon: "🧪"
    },
    {
      id: "L3-b2",
      type: "text",
      content: "Every great explainer video follows a simple structure. Here's the formula:\n\n**🔴 HOOK** (0–10 seconds) — Grab attention immediately. Make them stop scrolling.\n\n**🔵 CONTEXT** (10–30 seconds) — Set up the topic. What is this about and why should they care?\n\n**🟢 EXAMPLES** (30–60 seconds) — Show how it works. Give real-world examples, screenshots, or demonstrations.\n\n**🟡 TAKEAWAY** (60–90 seconds) — Share your opinion and wrap up with a memorable conclusion."
    },
    {
      id: "L3-b3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "According to the Explainer Formula, what should come FIRST in your video?",
      options: [
        "Your opinion on the topic",
        "A hook that grabs attention",
        "Examples of how it works",
        "Background context about the topic"
      ],
      correctIndex: 1,
      explanation: "The hook comes first! You have about 3 seconds before someone decides to keep watching or scroll past. Your hook needs to immediately grab their attention — then you can set up the context, give examples, and share your takeaway.",
      points: 5
    },

    // --- THE HOOK ---
    {
      id: "L3-section-hook",
      type: "section_header",
      title: "The Hook",
      subtitle: "You have 3 seconds. Make them count!",
      icon: "🪝"
    },
    {
      id: "L3-b4",
      type: "text",
      content: "You have **3 seconds** before someone scrolls past your video. Here are four types of hooks that work:\n\n**🔴 Surprising stat** — \"95% of people don't realize...\"\n\n**🔴 Bold question** — \"Is your phone spying on you?\"\n\n**🔴 Controversial take** — \"AI art isn't stealing — here's why\"\n\n**🔴 Relatable moment** — \"Ever wonder why TikTok knows you so well?\"\n\nThe best hooks create a gap between what the viewer knows and what they want to know. They think, *\"Wait, what?\"* — and then they keep watching."
    },
    {
      id: "L3-b5",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your hook — the exact words that will open your video. Try to grab attention in one sentence!",
      points: 10
    },

    // --- SCRIPT YOUR VIDEO ---
    {
      id: "L3-section-script",
      type: "section_header",
      title: "Script Your Video",
      subtitle: "15 minutes — then share hooks!",
      icon: "✍️"
    },
    {
      id: "L3-b6",
      type: "activity",
      icon: "📝",
      title: "Write Your Video Script",
      instructions: "On your handout (or here), write out:\n\n**1. Your hook** (word-for-word — this is what you'll actually say)\n\n**2. Key points to explain** — What does the viewer need to understand about your topic?\n\n**3. Your opinion/stance** — Is this AI helpful, concerning, or \"it depends\"?\n\n**4. Takeaway message** — What's the ONE thing you want viewers to remember?\n\n⏱️ You have **15 minutes**. Then we'll share hooks with the class!"
    },
    {
      id: "L3-b7",
      type: "question",
      questionType: "short_answer",
      prompt: "Write out your full video script. Include your hook, 2-3 key points you'll explain, your opinion, and your takeaway message.",
      points: 15
    },

    // --- VISUAL PLANNING ---
    {
      id: "L3-section-visuals",
      type: "section_header",
      title: "Visual Planning",
      subtitle: "What will viewers SEE while you talk?",
      icon: "👁️"
    },
    {
      id: "L3-b8",
      type: "text",
      content: "A video is more than just talking — viewers need something interesting to look at! Plan what appears on screen during each part of your script:\n\n**🔤 Text on screen** — Key points, stats, or important words\n\n**🎞️ Stock footage** — WeVideo has a built-in library, or use Pexels.com for free clips\n\n**📱 Screenshots** — Show the actual apps you're talking about\n\n**🔷 Graphics** — Icons, shapes, and arrows to illustrate your points"
    },
    {
      id: "L3-b9",
      type: "question",
      questionType: "short_answer",
      prompt: "For each section of your video (Hook, Context, Examples, Takeaway), briefly describe what visuals you plan to use. What will viewers SEE on screen?",
      points: 10
    },
    {
      id: "L3-b10",
      type: "callout",
      icon: "📅",
      style: "highlight",
      content: "**Tomorrow: Production Day!**\n\nBring:\n✅ Your completed script\n✅ Your visual ideas\n✅ Headphones"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 4: Production Day 1 (Week 2, Day 4)
// ═══════════════════════════════════════════════════════════════

const lesson4 = {
  title: "Production Day 1",
  course: "Digital Literacy",
  unit: "Week 2: AI & Video Production",
  unitOrder: 1,
  order: 3,
  blocks: [
    // --- INTRO ---
    {
      id: "L4-section-intro",
      type: "section_header",
      title: "Production Day 1",
      subtitle: "Record, gather visuals, start editing",
      icon: "🎬"
    },
    {
      id: "L4-b1",
      type: "objectives",
      title: "Today's Goals",
      items: [
        "Record your voiceover (or plan text-only approach)",
        "Gather screenshots, stock footage, and visuals",
        "Start assembling clips on the WeVideo timeline"
      ]
    },

    // --- RECORDING TIPS ---
    {
      id: "L4-section-recording",
      type: "section_header",
      title: "Recording Tips",
      subtitle: "Get a clean voiceover",
      icon: "🎙️"
    },
    {
      id: "L4-b2",
      type: "text",
      content: "If you're recording voiceover, follow these tips for the best results:\n\n**1. Find a quiet spot** — Background noise ruins recordings. A corner of the room or a closet works great.\n\n**2. Speak clearly at a steady pace** — Don't rush. Talk like you're explaining something to a friend.\n\n**3. Record in sections** — Don't try to record the whole thing in one take. Break it into chunks: hook, context, examples, takeaway.\n\n**4. Do 2–3 takes** — Your second or third take is almost always better than your first.\n\n**5. Use headphones to monitor** — Plug in headphones so you can hear what the recording actually sounds like."
    },
    {
      id: "L4-b3",
      type: "callout",
      icon: "💡",
      style: "tip",
      content: "**Don't want to record your voice?** That's okay! You can create an effective video using only text on screen and background music. Just make sure the text is large, appears in small chunks, and stays on screen long enough to read."
    },

    // --- WORK TIME ---
    {
      id: "L4-section-work",
      type: "section_header",
      title: "Work Time: 35 Minutes",
      subtitle: "Focus on building your video",
      icon: "⏱️"
    },
    {
      id: "L4-b4",
      type: "activity",
      icon: "🎬",
      title: "Build Your Video",
      instructions: "Use class time to work on your video in this priority order:\n\n**Priority 1: Record voiceover** — Use WeVideo's built-in recorder or your phone. Record in sections following your script.\n\n**Priority 2: Gather visuals** — Search WeVideo's stock library, take screenshots of apps, or find free images on Pexels.com.\n\n**Priority 3: Start editing** — Drop your voiceover and visuals onto the timeline. Start arranging them in the Hook → Context → Examples → Takeaway order.\n\nDon't worry about making it perfect today — focus on getting the pieces in place."
    },
    {
      id: "L4-b5",
      type: "question",
      questionType: "short_answer",
      prompt: "Quick progress check: What did you accomplish today? What still needs to be done tomorrow?",
      points: 5
    },

    // --- BEFORE YOU LEAVE ---
    {
      id: "L4-section-exit",
      type: "section_header",
      title: "Before You Leave",
      subtitle: "Exit checklist",
      icon: "✅"
    },
    {
      id: "L4-b6",
      type: "callout",
      icon: "☑️",
      style: "checklist",
      content: "**Before you leave, make sure you have:**\n\n☐ Voiceover recorded (or text planned)\n☐ Some visuals gathered and uploaded\n☐ Project saved in WeVideo\n\n**Tomorrow: Finish editing + Export your final video!**"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 5: Finish & Share (Week 2, Day 5)
// ═══════════════════════════════════════════════════════════════

const lesson5 = {
  title: "Finish & Share",
  course: "Digital Literacy",
  unit: "Week 2: AI & Video Production",
  unitOrder: 1,
  order: 4,
  blocks: [
    // --- INTRO ---
    {
      id: "L5-section-intro",
      type: "section_header",
      title: "Finish & Share",
      subtitle: "Complete your video and celebrate!",
      icon: "🎉"
    },
    {
      id: "L5-b1",
      type: "objectives",
      title: "Today's Plan",
      items: [
        "Finish editing your explainer video (15 min)",
        "Export your video from WeVideo (5 min)",
        "Watch classmates' videos and discuss (20 min)",
        "Submit your work and reflect (5 min)"
      ]
    },

    // --- FINISH EDITING ---
    {
      id: "L5-section-finish",
      type: "section_header",
      title: "Finish Editing",
      subtitle: "15 minutes to wrap up",
      icon: "✂️"
    },
    {
      id: "L5-b2",
      type: "callout",
      icon: "⏱️",
      style: "action",
      content: "**You have 15 minutes** to finish editing. Focus on:\n\n• Making sure your video is between 60–90 seconds\n• Checking that text is readable and stays on screen long enough\n• Ensuring music isn't too loud over voiceover\n• Adding any final transitions or effects"
    },

    // --- HOW TO EXPORT ---
    {
      id: "L5-section-export",
      type: "section_header",
      title: "How to Export",
      subtitle: "Save your final video",
      icon: "📤"
    },
    {
      id: "L5-b3",
      type: "text",
      content: "When your video is ready, export it from WeVideo:\n\n**Step 1:** Click **\"Finish\"** (top right corner of the editor)\n\n**Step 2:** Choose **720p quality** (this is the max for the free version)\n\n**Step 3:** Click **\"Export\"**\n\n**Step 4:** Wait for processing — this takes about 2–5 minutes\n\n**Step 5:** Once it's done, click **Download** to save the video file to your computer"
    },
    {
      id: "L5-b4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When exporting from the free version of WeVideo, what's the maximum video quality?",
      options: [
        "480p",
        "720p",
        "1080p",
        "4K"
      ],
      correctIndex: 1,
      explanation: "The free version of WeVideo exports at 720p maximum. That's HD quality and looks great for an explainer video. Paid versions support 1080p and 4K.",
      points: 5
    },

    // --- SCREENING ---
    {
      id: "L5-section-screening",
      type: "section_header",
      title: "Screening Time!",
      subtitle: "Watch and celebrate each other's work",
      icon: "🎬"
    },
    {
      id: "L5-b5",
      type: "activity",
      icon: "🎬",
      title: "Video Screening & Discussion",
      instructions: "Volunteers will share their videos with the class. As you watch each video, think about:\n\n• **What was the hook?** Did it grab your attention?\n• **What did you learn?** Did the video explain the topic clearly?\n• **What editing technique stood out?** Was there a cool transition, text effect, or visual choice?\n\nBe supportive — everyone worked hard this week!"
    },
    {
      id: "L5-b6",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick ONE classmate's video you watched. What was their hook, and what's one thing they did well?",
      points: 5
    },

    // --- SUBMIT ---
    {
      id: "L5-section-submit",
      type: "section_header",
      title: "Submit Your Work",
      subtitle: "Upload to Google Classroom",
      icon: "📎"
    },
    {
      id: "L5-b7",
      type: "callout",
      icon: "📎",
      style: "action",
      content: "**Upload to Google Classroom:**\n\n✅ Your exported video file (.mp4)\n✅ Completed handouts (all days)\n✅ Your script document"
    },

    // --- REFLECTION ---
    {
      id: "L5-section-reflect",
      type: "section_header",
      title: "Week 2 Reflection",
      subtitle: "What you accomplished",
      icon: "🎉"
    },
    {
      id: "L5-b8",
      type: "text",
      content: "**This week you:**\n\n✅ Explored AI in everyday life — discovering how algorithms shape what you see, hear, and do\n\n✅ Learned WeVideo editing — trimming, splitting, adding text, music, and transitions\n\n✅ Created an explainer video — researched a topic, wrote a script, and produced a complete video\n\nThese are real skills used in content creation, marketing, education, and journalism."
    },
    {
      id: "L5-b9",
      type: "question",
      questionType: "short_answer",
      prompt: "What's one thing you learned this week that surprised you — either about AI or about video editing?",
      points: 5
    },
    {
      id: "L5-b10",
      type: "question",
      questionType: "short_answer",
      prompt: "If you could redo your video, what would you change or improve?",
      points: 5
    },
    {
      id: "L5-b11",
      type: "callout",
      icon: "🚀",
      style: "highlight",
      content: "**Next week:** CapCut + Gaming & Esports!"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════════

async function seed() {
  try {
    console.log("🚀 Seeding Digital Literacy course...\n");

    // 1. Create course document
    await db.collection('courses').doc('digital-literacy').set(course, { merge: true });
    console.log("✅ Course created: courses/digital-literacy");
    console.log(`   Section: Period 3 → ${course.sections['period-3'].enrollCode}`);

    // 2. Seed lessons
    const lessons = [
      { slug: "ai-is-everywhere", data: lesson1 },
      { slug: "wevideo-basics", data: lesson2 },
      { slug: "storytelling-structure", data: lesson3 },
      { slug: "production-day-1", data: lesson4 },
      { slug: "finish-and-share", data: lesson5 },
    ];

    for (const { slug, data } of lessons) {
      await safeLessonWrite(db, 'digital-literacy', slug, data);
      console.log(`✅ Lesson seeded: courses/digital-literacy/lessons/${slug}`);
      console.log(`   "${data.title}" — ${data.blocks.length} blocks`);
    }

    console.log("\n🎉 Done! Digital Literacy course + 5 lessons seeded.");
    console.log("   Refresh your app to see the course on your dashboard.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  }
}

seed();
