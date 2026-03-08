// seed-wevideo-gaming.js
// Creates the "Gaming: Make Your Case" WeVideo lesson
// in the Digital Literacy course.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-wevideo-gaming.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Gaming: Make Your Case",
  course: "Digital Literacy",
  unit: "Video Production",
  order: 1,
  visible: false,
  blocks: [
    // --- WARM UP ---
    { id: "section-warmup", type: "section_header", title: "Warm Up", subtitle: "~5 minutes", icon: "🔥" },
    {
      id: "b1", type: "text",
      content: "Last week you learned the basics of WeVideo — importing media, trimming clips, adding text, and exporting. This week, you're leveling up.\n\nYour challenge: create a **persuasive video** that takes a clear position on the question:\n\n**\"Is gaming beneficial for young people?\"**"
    },
    {
      id: "q-warmup", type: "question", questionType: "short_answer",
      prompt: "Quick take: Do you think gaming is beneficial for young people? Write 1-2 sentences with your initial opinion. (There's no wrong answer — we'll develop this further.)",
      difficulty: "remember"
    },
    {
      id: "callout-qotd", type: "callout", style: "question", icon: "❓",
      content: "**Question of the Day:** What makes a video argument convincing — and how can editing techniques strengthen your message?"
    },

    // --- OBJECTIVES ---
    {
      id: "b-objectives", type: "objectives", title: "Learning Objectives",
      items: [
        "Develop a clear thesis and supporting arguments for a persuasive video",
        "Use advanced WeVideo features (transitions, voiceover, B-roll, text overlays) to strengthen your message",
        "Structure a video with an intro, evidence, counterargument, and conclusion",
        "Evaluate the difference between opinion and evidence-based arguments"
      ]
    },

    // --- ACTIVITY 1: BUILD YOUR ARGUMENT ---
    { id: "section-argument", type: "section_header", title: "Activity: Build Your Argument", subtitle: "~10 minutes", icon: "🧠" },
    {
      id: "b2", type: "text",
      content: "Before you open WeVideo, you need a **plan**. The best persuasive videos don't just state an opinion — they back it up with evidence and address the other side.\n\nLet's start by exploring both sides of the gaming debate."
    },
    {
      id: "sort-arguments", type: "sorting",
      icon: "🎮",
      title: "For or Against Gaming?",
      instructions: "Classify each claim as an argument **FOR** gaming being beneficial or **AGAINST** it. Think carefully — some might surprise you!",
      leftLabel: "FOR Gaming",
      rightLabel: "AGAINST Gaming",
      items: [
        { text: "Gaming can improve problem-solving and strategic thinking skills", correct: "left" },
        { text: "Excessive screen time is linked to sleep problems in teens", correct: "right" },
        { text: "Multiplayer games build teamwork and communication skills", correct: "left" },
        { text: "Gaming can lead to sedentary lifestyles and reduced physical activity", correct: "right" },
        { text: "Some games teach history, science, and coding concepts", correct: "left" },
        { text: "In-game purchases can encourage unhealthy spending habits", correct: "right" },
        { text: "Gaming communities provide social connection for isolated teens", correct: "left" },
        { text: "Violent games may desensitize players to real-world violence", correct: "right" },
        { text: "Esports scholarships are growing at colleges nationwide", correct: "left" },
        { text: "Gaming addiction is recognized as a disorder by the WHO", correct: "right" }
      ]
    },
    {
      id: "q-position", type: "question", questionType: "multiple_choice",
      prompt: "Which position will YOU argue in your video?",
      difficulty: "remember",
      options: [
        "Gaming IS beneficial for young people",
        "Gaming is NOT beneficial for young people",
        "Gaming is beneficial WITH limits/conditions",
        "Still deciding — need more research"
      ],
      correctIndex: 0,
      explanation: "There's no wrong answer here! Any position can make a strong video — what matters is how well you support it with evidence."
    },
    {
      id: "q-thesis", type: "question", questionType: "short_answer",
      prompt: "Write your **thesis statement** — one clear sentence that states your position AND your main reason. Example: \"Gaming is beneficial for young people because it develops critical thinking skills that transfer to academics and careers.\"",
      difficulty: "apply"
    },

    // --- ACTIVITY 2: PLAN YOUR VIDEO ---
    { id: "section-plan", type: "section_header", title: "Activity: Plan Your Video", subtitle: "~10 minutes", icon: "📋" },
    {
      id: "b3", type: "text",
      content: "A strong persuasive video follows this structure:\n\n1. **Hook** (5-10 sec) — Grab attention with a surprising fact, question, or bold statement\n2. **Thesis** (5-10 sec) — State your position clearly\n3. **Evidence 1** (15-20 sec) — Your strongest supporting point + proof\n4. **Evidence 2** (15-20 sec) — Another supporting point + proof\n5. **Counterargument** (10-15 sec) — Acknowledge the other side, then explain why your position is stronger\n6. **Conclusion** (5-10 sec) — Restate your thesis and leave the viewer thinking"
    },
    {
      id: "callout-tip", type: "callout", style: "insight", icon: "💡",
      content: "**Pro tip:** Your video should be **60-90 seconds** total. That's short! Every second counts, so plan carefully. Persuasive videos aren't about saying everything — they're about saying the right things well."
    },
    {
      id: "sketch-storyboard", type: "sketch",
      title: "Quick Storyboard",
      instructions: "Sketch a rough storyboard for your video. Draw 4-6 boxes and in each one, write or sketch:\n\n• What the viewer SEES (image, clip, text on screen)\n• What the viewer HEARS (voiceover, music, sound effect)\n\nThis doesn't need to be artistic — stick figures and notes are fine!",
      canvasHeight: 450
    },
    {
      id: "chat-scripthelper", type: "chatbot",
      icon: "✍️",
      title: "Script Helper",
      starterMessage: "I'm here to help you write your video script! Tell me your position on gaming and I'll help you draft a hook, talking points, or counterargument. What do you need help with?",
      systemPrompt: "You are a script-writing assistant helping high school students create a 60-90 second persuasive video about whether gaming is beneficial for young people. Help them with: writing attention-grabbing hooks, developing evidence-based arguments, crafting counterarguments, writing concise voiceover scripts, and structuring their video. Keep responses concise (3-5 sentences). When they share their position, help them strengthen it with specific examples. Do NOT write the entire script for them — guide them and suggest improvements. Stay on topic (gaming debate + video production). Be encouraging and age-appropriate.",
      instructions: "Use this AI assistant to help you draft parts of your script. Try asking for help with:\n\n• A strong opening hook\n• Evidence to support your position\n• How to address the counterargument\n• A memorable closing line",
      placeholder: "Ask for help with your script..."
    },

    // --- ACTIVITY 3: WEVIDEO ADVANCED TECHNIQUES ---
    { id: "section-advanced", type: "section_header", title: "Level Up: Advanced WeVideo Techniques", subtitle: "~5 minutes", icon: "🎬" },
    {
      id: "b4", type: "text",
      content: "You already know the basics. Here are **advanced techniques** that will make your persuasive video more professional and convincing:"
    },
    { id: "def-broll", type: "definition", term: "B-Roll", definition: "Supplemental footage that plays OVER your voiceover to illustrate what you're saying. Example: While you say \"gaming builds teamwork,\" show a clip of players collaborating. WeVideo's stock media library has free clips you can use." },
    { id: "def-textoverlay", type: "definition", term: "Text Overlay", definition: "Text that appears on screen to emphasize key points, show statistics, or display quotes. In WeVideo: click the Text button (T) above the timeline to add customizable text layers." },
    { id: "def-transition", type: "definition", term: "Transitions", definition: "Visual effects between clips (fade, dissolve, wipe). Use sparingly — 1-2 types max. In WeVideo: drag transitions from the Transitions panel between clips on your timeline." },
    {
      id: "callout-voiceover", type: "callout", style: "insight", icon: "🎙️",
      content: "**Recording Voiceover in WeVideo:** Click the microphone icon above the timeline. Speak clearly and at a steady pace. Record in a quiet space — background noise ruins voiceovers. You can re-record sections without starting over."
    },
    {
      id: "checklist-techniques", type: "checklist",
      title: "Advanced Techniques to Include in Your Video",
      items: [
        "At least ONE text overlay showing a key statistic or quote",
        "At least ONE piece of B-roll (stock footage or image) over your voiceover",
        "A transition between your intro and first evidence section",
        "Background music that matches your tone (keep it LOW — voice comes first)",
        "Voiceover narration for at least part of your video"
      ]
    },

    // --- PRODUCTION TIME ---
    { id: "section-produce", type: "section_header", title: "Production Time!", subtitle: "~10 minutes", icon: "🎥" },
    {
      id: "activity-produce", type: "activity",
      icon: "🎥",
      title: "Create Your Video in WeVideo",
      instructions: "Open WeVideo and start building your persuasive video.\n\n**Remember:**\n• Target length: 60-90 seconds\n• Follow your storyboard plan\n• Use at least 2 advanced techniques from the checklist\n• Include your thesis statement clearly (spoken or on-screen text)\n• Address the counterargument\n\n**Need stock media?** In WeVideo, go to the Stock Media tab to search for free images, videos, and music clips.\n\n**Saving:** WeVideo auto-saves your project. When you're ready to submit, go to Finish > Set your title > Export."
    },
    {
      id: "external-wevideo", type: "external_link",
      icon: "🎬",
      title: "Open WeVideo",
      url: "https://www.wevideo.com/",
      description: "Open WeVideo in a new tab to start editing your video",
      buttonLabel: "Launch WeVideo",
      openInNewTab: true
    },

    // --- CHECK YOUR UNDERSTANDING ---
    { id: "section-check", type: "section_header", title: "Check Your Understanding", subtitle: "", icon: "✅" },
    {
      id: "q-check1", type: "question", questionType: "multiple_choice",
      prompt: "What is the purpose of including a counterargument in a persuasive video?",
      difficulty: "understand",
      options: [
        "To confuse the viewer about your position",
        "To show you understand both sides, which makes YOUR argument stronger",
        "To give equal time to the opposing view",
        "It's not important — you should only present your side"
      ],
      correctIndex: 1,
      explanation: "Addressing the counterargument shows credibility. When viewers see that you've considered the other side and still hold your position, they're more likely to trust your argument."
    },
    {
      id: "q-check2", type: "question", questionType: "multiple_choice",
      prompt: "Which is the BEST use of B-roll in a persuasive video about gaming?",
      difficulty: "analyze",
      options: [
        "Playing random gaming clips throughout the entire video",
        "Showing gameplay footage while your voiceover discusses how gaming builds problem-solving skills",
        "Using B-roll instead of voiceover so you don't have to talk",
        "Adding as many stock clips as possible to fill time"
      ],
      correctIndex: 1,
      explanation: "B-roll is most effective when it visually supports what you're saying. Showing gameplay during a voiceover about gaming skills creates a connection between your evidence and what the viewer sees."
    },
    {
      id: "q-reflection", type: "question", questionType: "short_answer",
      prompt: "Describe your video so far. What is your thesis? What advanced techniques did you use? What part are you most proud of, and what would you improve with more time?",
      difficulty: "evaluate"
    },

    // --- WRAP UP ---
    { id: "section-wrap", type: "section_header", title: "Wrap Up", subtitle: "~5 minutes", icon: "🎬" },
    {
      id: "b-summary", type: "text",
      content: "Today you went beyond the basics of video editing to create a **persuasive video** with a clear structure: hook, thesis, evidence, counterargument, and conclusion.\n\nYou used advanced WeVideo techniques like **B-roll**, **text overlays**, **transitions**, and **voiceover** to make your argument more convincing. These aren't just video skills — they're **communication skills** you'll use in presentations, interviews, and professional work."
    },
    {
      id: "callout-revisit", type: "callout", style: "question", icon: "❓",
      content: "**Return to the Question of the Day:** What makes a video argument convincing — and how can editing techniques strengthen your message?\n\nShare your answer with your group."
    },
    {
      id: "q-exit", type: "question", questionType: "short_answer",
      prompt: "Exit Ticket: Compare your initial warm-up opinion about gaming to the argument in your video. How did your thinking change (or get stronger) through the process of building evidence and planning your video?",
      difficulty: "evaluate"
    },

    // --- VOCABULARY ---
    { id: "section-vocab", type: "section_header", title: "Key Vocabulary", subtitle: "", icon: "📖" },
    {
      id: "vocab", type: "vocab_list",
      terms: [
        { term: "Thesis Statement", definition: "A clear, one-sentence declaration of your position and main reason. The backbone of any persuasive argument." },
        { term: "B-Roll", definition: "Supplemental footage that plays over your narration to visually support your message." },
        { term: "Text Overlay", definition: "On-screen text used to highlight key statistics, quotes, or points during a video." },
        { term: "Voiceover", definition: "Narration recorded separately and layered over visuals, rather than speaking directly to camera." },
        { term: "Counterargument", definition: "Acknowledging the opposing viewpoint in your argument, then explaining why your position is still stronger." },
        { term: "Persuasive Media", definition: "Any content (video, article, ad) designed to convince the audience to adopt a particular viewpoint or take action." },
        { term: "Hook", definition: "The opening seconds of a video designed to grab attention — a surprising fact, bold question, or dramatic visual." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection('courses').doc('digital-literacy')
      .collection('lessons').doc('wevideo-gaming')
      .set(lesson);
    console.log('✅ Lesson "Gaming: Make Your Case" seeded successfully!');
    console.log('   Path: courses/digital-literacy/lessons/wevideo-gaming');
    console.log('   Blocks:', lesson.blocks.length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
