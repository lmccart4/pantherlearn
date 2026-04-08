// seed-dl-unit5-content-creation.js
// Digital Literacy — Unit 5: Content Creation (Lessons 22-31)
// Run: node scripts/seed-dl-unit5-content-creation.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ═══════════════════════════════════════════════════════════════
// LESSON 22: Who's Watching? — Understanding Your Audience
// ═══════════════════════════════════════════════════════════════

const lesson22 = {
  title: "Who's Watching? — Understanding Your Audience",
  questionOfTheDay: "If you posted the same exact video on TikTok, LinkedIn, and a school website — would it work on all three? Why or why not?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 21,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "👁️",
      title: "Who's Watching?",
      subtitle: "Understanding Your Audience",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify how different audiences change the way content should be designed",
        "Analyze real-world content and identify its target audience",
        "Create an audience profile for a content project",
      ],
    },
    {
      id: uid(), type: "callout",
      icon: "🤔", style: "question",
      content: "**Think About It:** If you posted the same exact video on TikTok, LinkedIn, and a school website — would it work on all three? Why or why not?",
    },
    {
      id: uid(), type: "text",
      content: "Same message, different audience = **completely different content.** This is the #1 rule of content creation.\n\nBefore making anything, every good creator asks:\n1. **Who am I talking to?** (age, interests, platform)\n2. **What do they care about?** (problems, desires, trends)\n3. **Where will they see this?** (TikTok vs email vs poster)\n4. **What do I want them to do?** (follow, buy, learn, share)\n\nEvery design choice — colors, words, layout, length — should be based on these answers.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "A fitness brand creates two versions of the same ad: one with bright colors and slang, another with muted tones and professional language. What's the most likely reason?",
      options: [
        "They couldn't decide which one looked better",
        "They're targeting different audiences — teens vs. working adults",
        "One is the rough draft and one is the final version",
        "The designer made a mistake",
      ],
      correctIndex: 1,
      explanation: "Different audiences respond to different visual and verbal cues. Teens connect with bright, energetic content and casual language. Working adults prefer clean, professional design. Same product, different audience = different content strategy.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🔍",
      title: "Audience Detective",
      subtitle: "Identify who content was made for",
    },
    {
      id: uid(), type: "activity",
      icon: "🕵️",
      title: "Audience Detective Activity",
      instructions: "For each content piece your teacher shows, identify:\n\n1. **Target audience** — Age range and interests\n2. **Platform** — Where was this designed to appear?\n3. **Goal** — Is it trying to sell, inform, entertain, or persuade?\n4. **Proof** — Name one specific design choice (color, language, layout) that tells you who it's for\n\nWork in groups of 3. You'll analyze 5 different content pieces.",
    },
    {
      id: "q-detective", type: "question",
      questionType: "short_answer",
      prompt: "Pick one of the content pieces you analyzed. Who was the target audience, and what specific design choice proved it? Be detailed.",
    },

    {
      id: uid(), type: "section_header",
      icon: "📝",
      title: "Your Audience Profile",
      subtitle: "Build one for your content project",
    },
    {
      id: uid(), type: "text",
      content: "Now it's your turn. Pick a topic you care about — something you'd actually want to create content around. Then define your audience:\n\n**Your audience profile should include:**\n- **Target audience** — Be specific. Not \"everyone\" or \"teens.\" Try: \"high school students interested in sneaker culture\" or \"parents who want quick dinner recipes.\"\n- **Platform** — Where would you post this? Why that platform?\n- **Goal** — What do you want your audience to DO after seeing your content?\n- **3 design decisions** — Based on your audience, what choices would you make about colors, tone, style, or format?\n\n**Save this profile — you'll use it for the rest of the unit.**",
    },
    {
      id: "q-audience", type: "question",
      questionType: "short_answer",
      prompt: "Write your audience profile: (1) Your topic, (2) Your specific target audience, (3) The platform you'd use, (4) The goal of your content, and (5) Three design decisions based on your audience.",
    },
    {
      id: "q-exit", type: "question",
      questionType: "short_answer",
      prompt: "Exit ticket: Pick one social media account you follow. Who is their target audience and how do you know? Give 2 specific examples from their content.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 23: The Hook — Grabbing Attention in 3 Seconds
// ═══════════════════════════════════════════════════════════════

const lesson23 = {
  title: "The Hook — Grabbing Attention in 3 Seconds",
  questionOfTheDay: "You have 3 seconds before someone scrolls past your content. What do you do?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 22,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🪝",
      title: "The Hook",
      subtitle: "Grabbing Attention in 3 Seconds",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why the first 3 seconds of any content determine success or failure",
        "Identify hook techniques used in professional content",
        "Write and design 3 different hooks for the same topic",
      ],
    },
    {
      id: uid(), type: "text",
      content: "The average person decides whether to keep watching or scroll past in about **3 seconds.** That's it. Your hook is the single most important part of any content you create.\n\n**5 hook types that work:**\n\n1. **Bold claim** — \"Nobody talks about this...\" / \"This changed everything\"\n2. **Question** — \"Have you ever wondered why...?\"\n3. **Visual shock** — Unexpected image, bright colors, fast motion\n4. **Conflict/tension** — \"I tried X and it went wrong\"\n5. **Pattern interrupt** — Something unexpected that breaks the scroll\n\nThe hook isn't just words — it's visual, audio, and text working together.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "Which of these is the strongest hook for a video about saving money?",
      options: [
        "\"Today I'm going to talk about how to save money.\"",
        "\"I saved $3,000 in 90 days — and I'm 16.\"",
        "\"Money is important. Let's discuss saving.\"",
        "\"Hi everyone, welcome back to my channel.\"",
      ],
      correctIndex: 1,
      explanation: "\"I saved $3,000 in 90 days — and I'm 16\" works because it combines a specific result ($3,000), a time frame (90 days), and a surprise factor (age 16). It makes you think \"How?\" — and that curiosity keeps you watching. The others are generic and give no reason to stay.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🧪",
      title: "Hook Lab",
      subtitle: "Practice writing hooks that stop the scroll",
    },
    {
      id: uid(), type: "activity",
      icon: "✍️",
      title: "Hook Lab — Write 3 Hooks",
      instructions: "Using the audience profile topic from Lesson 22, create 3 different hooks:\n\n1. **A text hook** — A headline or opening line that would stop someone from scrolling\n2. **A visual hook** — Sketch or describe the first image someone sees (what grabs the eye?)\n3. **A video hook** — Write the script for the first 5 seconds of a video\n\nRemember: each hook should be designed for YOUR specific audience. A hook for teens looks different than one for parents.",
    },
    {
      id: "q-hooks", type: "question",
      questionType: "short_answer",
      prompt: "Write your 3 hooks: (1) A text hook (headline/opening line), (2) A visual hook (describe what someone sees first), and (3) A video hook (first 5 seconds, scripted).",
    },
    {
      id: "q-pair", type: "question",
      questionType: "short_answer",
      prompt: "You shared your best hook with a partner. What was their rating (1-5 on 'would I stop scrolling')? What feedback did they give you?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 24: Visual Hierarchy — Designing Content That Guides the Eye
// ═══════════════════════════════════════════════════════════════

const lesson24 = {
  title: "Visual Hierarchy — Designing Content That Guides the Eye",
  questionOfTheDay: "When you look at a poster or a website, what do your eyes look at first — and why?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 23,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "👁️",
      title: "Visual Hierarchy",
      subtitle: "Designing Content That Guides the Eye",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define visual hierarchy and explain why it matters in content design",
        "Identify the 4 key principles: size, color, contrast, spacing",
        "Redesign a poorly structured layout using visual hierarchy principles",
      ],
    },
    {
      id: uid(), type: "text",
      content: "Visual hierarchy is how you control **where someone's eye goes** when they look at your content. Without it, people don't know what to look at first — and they leave.\n\n**The 4 levers of visual hierarchy:**\n\n1. **Size** — Bigger = more important. Headlines > subheads > body text.\n2. **Color** — Bright or contrasting colors draw the eye first. Use sparingly.\n3. **Contrast** — Light on dark (or vice versa) creates focal points.\n4. **Spacing** — White space isn't wasted space. It tells the eye where to look next.\n\n**The squint test:** Squint at your design. Whatever you can still see = what stands out. If it's the wrong thing, fix your hierarchy.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "A flyer has a large red headline, medium blue subheading, and small gray body text. Which principle of visual hierarchy is being used most?",
      options: [
        "Spacing only",
        "Size, color, and contrast working together",
        "Just color — the rest doesn't matter",
        "None — this is random design",
      ],
      correctIndex: 1,
      explanation: "All three principles work together: size (large > medium > small), color (red draws more attention than blue, which draws more than gray), and contrast (different colors create visual separation). Good design uses multiple principles at once.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🔍",
      title: "Squint Test Challenge",
      subtitle: "Test real designs for hierarchy",
    },
    {
      id: uid(), type: "activity",
      icon: "👀",
      title: "Squint Test Challenge",
      instructions: "Your teacher will show 4 designs on the projector. For each one, write down:\n\n1. What you see **first** (the dominant element)\n2. What you see **second**\n3. What the designer **wanted** you to see first\n\nDid the hierarchy work or fail? Discuss as a class after all 4.",
    },
    {
      id: "q-squint", type: "question",
      questionType: "short_answer",
      prompt: "Pick one of the 4 designs from the Squint Test Challenge. Did the visual hierarchy work? What would you change to make it clearer?",
    },

    {
      id: uid(), type: "section_header",
      icon: "🎨",
      title: "Redesign Challenge",
      subtitle: "Fix a broken layout",
    },
    {
      id: uid(), type: "text",
      content: "**Your challenge:** You'll receive a \"bad\" flyer in Canva — same content, but terrible hierarchy. Everything is the same size, same color, no spacing.\n\nRedesign it using the 4 principles:\n- **Clear headline** that dominates the layout\n- **One accent color** used intentionally (not everywhere)\n- **Adequate white space** so it doesn't feel cramped\n- **Information in logical reading order** (what do they need to see first, second, third?)",
    },
    {
      id: "q-redesign", type: "question",
      questionType: "short_answer",
      prompt: "Describe 3 specific changes you made to the flyer and which visual hierarchy principle each change uses (size, color, contrast, or spacing).",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 25: Infographics — Turning Data Into a Story
// ═══════════════════════════════════════════════════════════════

const lesson25 = {
  title: "Infographics — Turning Data Into a Story",
  questionOfTheDay: "Why does a well-designed infographic convince people more than a paragraph of statistics?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 24,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "📊",
      title: "Infographics",
      subtitle: "Turning Data Into a Story",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain what makes an infographic effective vs. just a decorated chart",
        "Identify the 5 key components of a strong infographic",
        "Begin creating an infographic using data from the spreadsheets unit",
      ],
    },
    {
      id: uid(), type: "text",
      content: "An infographic isn't just a pretty chart. It's data + design + storytelling working together to communicate one clear message.\n\n**5 parts of every good infographic:**\n\n1. **Headline** — One clear takeaway, not a vague title. \"65% of teens check their phone within 5 min of waking up\" > \"Phone Usage Statistics\"\n2. **Data** — The actual numbers. Must be accurate and sourced.\n3. **Visuals** — Icons, charts, illustrations that MATCH the data (not decorative clip art).\n4. **Flow** — Top to bottom or left to right. The eye should follow a clear path.\n5. **Source** — Where the data came from. No source = no credibility.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "Which is a better headline for an infographic about student sleep habits?",
      options: [
        "Sleep Statistics",
        "73% of high schoolers get less than 8 hours of sleep on school nights",
        "All About Sleep",
        "Sleep: A Research Project",
      ],
      correctIndex: 1,
      explanation: "A strong infographic headline makes a specific, data-driven claim. \"73% of high schoolers get less than 8 hours of sleep\" tells you exactly what the infographic is about and makes you want to learn more. The others are vague titles that could be about anything.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🔬",
      title: "Infographic Autopsy",
      subtitle: "Analyze what works and what doesn't",
    },
    {
      id: uid(), type: "activity",
      icon: "🔬",
      title: "Infographic Autopsy",
      instructions: "Your table group will receive a printed infographic. Label these elements:\n\n1. **Headline** — Is it specific or vague?\n2. **Data** — Is it clear? Is it sourced?\n3. **Flow** — Where does your eye go first, second, third?\n4. **One thing you'd change** — What would make it stronger?\n\nEach group will share their \"one thing\" with the class.",
    },
    {
      id: "q-autopsy", type: "question",
      questionType: "short_answer",
      prompt: "What's the one thing your group would change about the infographic you analyzed? Why would that improvement make it more effective?",
    },

    {
      id: uid(), type: "section_header",
      icon: "🛠️",
      title: "Build Your Infographic",
      subtitle: "Day 1 of 2 — Layout and data selection",
    },
    {
      id: uid(), type: "text",
      content: "**Build your own infographic** using data from one of these sources:\n- Your spreadsheets project from the Data unit\n- A provided dataset (screen time stats, school data, sports stats)\n\n**Today's focus:** Pick your data, write your headline, and set up the layout in Canva.\n\n**Requirements:**\n- Headline with a specific claim (not a vague title)\n- At least 3 data points visualized\n- Source credited\n- Clear visual flow\n\n**Tomorrow:** Polish, peer review, and final export.",
    },
    {
      id: "q-headline", type: "question",
      questionType: "short_answer",
      prompt: "What data did you choose for your infographic? Write the specific headline claim you'll use (not a vague title — a real data-driven statement).",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 26: Infographic Workshop + Peer Review
// ═══════════════════════════════════════════════════════════════

const lesson26 = {
  title: "Infographic Workshop + Peer Review",
  questionOfTheDay: "What's the difference between 'I like it' and actually useful feedback?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 25,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🔄",
      title: "Infographic Workshop",
      subtitle: "Peer Review + Polish",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply peer feedback to improve a design",
        "Evaluate content using specific design criteria (not just 'it looks nice')",
        "Finalize an infographic ready for presentation",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Good feedback vs. bad feedback:**\n\n**Bad:** \"It looks good.\" / \"I don't like the colors.\"\n\n**Good:** \"The headline is vague — try making it a specific stat.\" / \"The flow breaks in the middle because the font size doesn't change.\"\n\nThe rule: feedback must be **specific** and **actionable.** Tell them WHAT to fix and HOW.",
    },

    {
      id: uid(), type: "section_header",
      icon: "📝",
      title: "Peer Review",
      subtitle: "Structured feedback from 2 classmates",
    },
    {
      id: uid(), type: "activity",
      icon: "📝",
      title: "Structured Peer Review",
      instructions: "You'll review TWO classmates' infographics. For each one, rate these criteria 1-3:\n\n| Criteria | 1 (Needs Work) | 2 (Getting There) | 3 (Strong) |\n|---|---|---|---|\n| **Headline** | Vague or missing | Somewhat specific | Clear, specific claim |\n| **Data** | Unclear or unsourced | Partially clear | Clear, sourced, accurate |\n| **Visual hierarchy** | No clear flow | Some structure | Eye follows a clear path |\n| **Design** | Cluttered or bare | Decent but inconsistent | Clean, intentional, polished |\n\nPlus: write **2 specific suggestions** for each review. Then discuss face-to-face with your partner.",
    },
    {
      id: "q-feedback", type: "question",
      questionType: "short_answer",
      prompt: "What was the most useful piece of feedback you received? How will you apply it to improve your infographic?",
    },

    {
      id: uid(), type: "section_header",
      icon: "✨",
      title: "Revision Time",
      subtitle: "Apply feedback and polish",
    },
    {
      id: uid(), type: "text",
      content: "**You have 15 minutes to revise.** You must address at least 1 piece of feedback from each reviewer.\n\nWhen you're done:\n1. Export as PNG from Canva\n2. Submit to Google Classroom\n\nThis is your final infographic — make it count.",
    },
    {
      id: "q-final", type: "question",
      questionType: "short_answer",
      prompt: "What two changes did you make based on peer feedback? Which specific suggestion prompted each change?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 27: Thumbnail & Cover Art — The Art of the Click
// ═══════════════════════════════════════════════════════════════

const lesson27 = {
  title: "Thumbnail & Cover Art — The Art of the Click",
  questionOfTheDay: "Why do YouTubers spend more time on their thumbnail than their title?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 26,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🖼️",
      title: "Thumbnail & Cover Art",
      subtitle: "The Art of the Click",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why thumbnails and cover images drive engagement more than the content itself",
        "Identify design patterns used in high-performing thumbnails",
        "Create thumbnail/cover images for a real or hypothetical project",
      ],
    },
    {
      id: uid(), type: "text",
      content: "The thumbnail is the most important image in all of content creation. It's the first thing anyone sees — and it determines whether they click.\n\n**Thumbnail rules that actually work:**\n\n1. **Faces with emotion** — Human faces (especially exaggerated expressions) get clicks. This is psychology, not opinion.\n2. **3 elements max** — Face + text + one object. More than that = visual noise.\n3. **Contrast with the platform** — YouTube is white/red. Your thumbnail needs to NOT blend in.\n4. **Text is optional but bold** — If you use text, 5 words max, huge font, high contrast.\n5. **Promise something** — The thumbnail should make you curious: \"What happened?\" or \"I need to know.\"",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "What's the maximum number of elements a good thumbnail should have?",
      options: [
        "1 — keep it as simple as possible",
        "3 — face + text + one object",
        "5 — the more information, the better",
        "No limit — fill every inch of space",
      ],
      correctIndex: 1,
      explanation: "Three elements is the sweet spot: a face (draws the eye), text (adds context), and one object or background (supports the story). More than three and the thumbnail becomes visual noise — especially at the small sizes it appears on phones.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🔥",
      title: "Thumbnail Roast",
      subtitle: "Rate real thumbnails and explain why",
    },
    {
      id: uid(), type: "activity",
      icon: "🔥",
      title: "Thumbnail Roast",
      instructions: "Your teacher will show 6 thumbnails on the projector. For each one:\n\n- Rate it 1-5\n- Explain WHY using today's principles (faces, element count, contrast, text, curiosity)\n\nAt least 2 of the 6 will be \"bad\" examples. Can you spot them?",
    },
    {
      id: "q-roast", type: "question",
      questionType: "short_answer",
      prompt: "Which thumbnail from the Roast was the weakest? What specific rule did it break, and how would you fix it?",
    },

    {
      id: uid(), type: "section_header",
      icon: "🎨",
      title: "Create Your Thumbnails",
      subtitle: "Design 2 thumbnails in Canva",
    },
    {
      id: uid(), type: "text",
      content: "**Design 2 thumbnails in Canva:**\n\n1. A **YouTube thumbnail** for a video about your audience profile topic (1280x720px)\n2. A **podcast cover OR Instagram post cover** for the same topic (1080x1080px)\n\n**Requirements:**\n- 3 elements max\n- Readable at small size (phone screen)\n- Passes the squint test from Lesson 24\n\n**Shrink test:** When you're done, shrink your thumbnail to phone size. Can you still read it? Does it still grab attention?",
    },
    {
      id: "q-thumbnails", type: "question",
      questionType: "short_answer",
      prompt: "Describe your YouTube thumbnail: What 3 elements did you use? Does it pass the shrink test (readable at phone size)?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 28: Writing for Screens — Captions, Copy, and CTAs
// ═══════════════════════════════════════════════════════════════

const lesson28 = {
  title: "Writing for Screens — Captions, Copy, and CTAs",
  questionOfTheDay: "Why do the best social media captions sound like they're talking to one person, not a crowd?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 27,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "✍️",
      title: "Writing for Screens",
      subtitle: "Captions, Copy, and CTAs",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Distinguish between writing for print vs. writing for screens",
        "Write effective captions, short-form copy, and calls-to-action (CTAs)",
        "Apply the 'scroll-stop' writing framework to their own content",
      ],
    },
    {
      id: uid(), type: "text",
      content: "Writing for screens is not like writing an essay. Different rules apply.\n\n**Screen writing rules:**\n1. **Short sentences.** Period. Like this.\n2. **Front-load the good stuff.** Instagram cuts captions after 2 lines. The hook goes FIRST.\n3. **One idea per post.** Not three. One.\n4. **Conversational tone.** Write like you talk. \"You know when...\" > \"It has come to our attention that...\"\n5. **Every post needs a CTA.** Tell them what to do: save this, share with a friend, drop a comment, click the link.\n\n**CTA types:** Follow, Share, Save, Comment, Click, Tag, DM, Buy\n\nIf you don't ask, they won't act.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "What does CTA stand for in content creation?",
      options: [
        "Creative Text Addition",
        "Call to Action",
        "Content Target Audience",
        "Click Through Analytics",
      ],
      correctIndex: 1,
      explanation: "CTA = Call to Action. It's the part of your content that tells the viewer what to DO next: follow, share, save, comment, click, buy. Every piece of content should have one. Without a CTA, people enjoy your content and then... scroll away.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🔧",
      title: "Caption Surgery",
      subtitle: "Fix bad captions using the rules",
    },
    {
      id: uid(), type: "activity",
      icon: "✂️",
      title: "Caption Surgery",
      instructions: "Rewrite these 3 bad captions using today's rules:\n\n**Bad Caption 1:** \"So today I wanted to share some thoughts about why I think that everyone should really consider trying to get more sleep because research shows that it's important for your health and also for your grades and your ability to focus in school.\"\n\n**Bad Caption 2:** \"Check out our new product! It has lots of features. Buy now. Also follow us. And share this. Don't forget to comment. Link in bio.\"\n\n**Bad Caption 3:** \"Photo from last weekend.\"\n\nFor each: make it short, add a hook, keep ONE idea, and include ONE clear CTA.",
    },
    {
      id: "q-surgery", type: "question",
      questionType: "short_answer",
      prompt: "Write your rewritten version of Caption 1. How did you apply the screen writing rules?",
    },

    {
      id: uid(), type: "section_header",
      icon: "📝",
      title: "Write Your Copy",
      subtitle: "3 pieces for your topic",
    },
    {
      id: uid(), type: "text",
      content: "Write 3 pieces of copy for your audience profile topic:\n\n1. **Instagram caption** — Max 150 characters for the visible part, plus a CTA\n2. **YouTube video description** — The first 2 lines that show before \"Show more\"\n3. **One-liner pitch** — The single sentence that explains your content to someone who's never seen it",
    },
    {
      id: "q-copy", type: "question",
      questionType: "short_answer",
      prompt: "Write all 3: (1) Your Instagram caption with CTA, (2) Your YouTube description first 2 lines, and (3) Your one-liner pitch.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 29: Content Planning — Building a Content Calendar
// ═══════════════════════════════════════════════════════════════

const lesson29 = {
  title: "Content Planning — Building a Content Calendar",
  questionOfTheDay: "Why do successful creators post on a schedule instead of whenever they feel like it?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 28,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "📅",
      title: "Content Planning",
      subtitle: "Building a Content Calendar",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why consistent posting matters more than viral moments",
        "Create a 1-week content calendar with varied content types",
        "Identify the relationship between content pillars and audience engagement",
      ],
    },
    {
      id: uid(), type: "text",
      content: "Creators who post 3-5x/week grow 2-3x faster than those who post randomly. But how do you come up with that much content? Two concepts:\n\n**Content pillars** — 3-5 categories that all your content falls into.\n- A fitness creator: Workouts, Nutrition Tips, Motivation, Behind-the-Scenes\n- A gaming creator: Gameplay, Reviews, Tutorials, Memes\n\nPillars keep you from running out of ideas AND keep your content balanced.\n\n**Content calendar** — Map out what you'll post, when, and on which platform. It doesn't have to be complex — a simple grid works. The point: you don't come up with ideas day-of. It's planned.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "A food creator's content pillars are: Recipes, Kitchen Tips, Restaurant Reviews, and Behind-the-Scenes. Why is having pillars better than just posting whatever comes to mind?",
      options: [
        "It isn't — random content is more authentic",
        "Pillars ensure variety, prevent content burnout, and give the audience a reason to follow",
        "Pillars make content take longer to create",
        "You only need one pillar — just recipes would be enough",
      ],
      correctIndex: 1,
      explanation: "Content pillars ensure your feed has variety (not the same type of post every day), prevent you from running out of ideas (you rotate through categories), and give your audience multiple reasons to follow you. Someone might not care about recipes but loves your restaurant reviews.",
    },

    {
      id: uid(), type: "section_header",
      icon: "📝",
      title: "Build Your Content Calendar",
      subtitle: "Plan a full week of content",
    },
    {
      id: "q-pillars", type: "question",
      questionType: "short_answer",
      prompt: "Define 3-4 content pillars for your topic. For each one, explain what type of content falls into that category.",
    },
    {
      id: uid(), type: "activity",
      icon: "📅",
      title: "1-Week Content Calendar",
      instructions: "Build a 1-week content calendar in Google Sheets or on paper:\n\n| Day | Platform | Content Pillar | Post Type | Description |\n|---|---|---|---|---|\n| Mon | Instagram | Pillar 1 | Infographic | [brief idea] |\n| Tue | TikTok | Pillar 2 | Short video | [brief idea] |\n| ... | ... | ... | ... | ... |\n\n**Requirements:**\n- At least 5 posts across the week\n- At least 2 different platforms\n- At least 3 different pillars used\n- Mix of content types (image, video, text, carousel)",
    },
    {
      id: "q-calendar", type: "question",
      questionType: "short_answer",
      prompt: "List your 7-day content calendar: for each day, give the platform, pillar, post type, and a one-sentence description of the content.",
    },
    {
      id: "q-hardest", type: "question",
      questionType: "short_answer",
      prompt: "Which day on your calendar would be the hardest to create? Why? What skill would you need to develop?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 30: Production Day — Create One Piece of Portfolio Content
// ═══════════════════════════════════════════════════════════════

const lesson30 = {
  title: "Production Day — Create One Portfolio Content Piece",
  questionOfTheDay: "What separates 'student project' quality from something you'd actually follow online?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 29,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🎬",
      title: "Production Day",
      subtitle: "Create One Polished Content Piece",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply audience analysis, hooks, visual hierarchy, and copywriting to create one polished content piece",
        "Execute a content plan from ideation through final export",
        "Self-assess against the unit's design principles",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Today you produce ONE polished content piece** from your content calendar. This goes in your portfolio.\n\nBefore you start, write a quick **production brief:**\n- What am I making? (infographic, thumbnail + caption, short video storyboard)\n- Who is it for? (audience from Lesson 22)\n- What's the hook? (from Lesson 23)\n- What's the CTA? (from Lesson 28)\n\nIf you can't answer these, you're not ready to create yet.",
    },
    {
      id: "q-brief", type: "question",
      questionType: "short_answer",
      prompt: "Write your production brief: (1) What are you making? (2) Who is it for? (3) What's the hook? (4) What's the CTA?",
    },

    {
      id: uid(), type: "section_header",
      icon: "⏱️",
      title: "Production Time — 30 Minutes",
      subtitle: "Create your content piece",
    },
    {
      id: uid(), type: "activity",
      icon: "🎨",
      title: "Create Your Content",
      instructions: "Use your full toolkit from this unit:\n- Audience profile (Lesson 22)\n- Strong hook (Lesson 23)\n- Visual hierarchy principles (Lesson 24)\n- Good copy + CTA (Lesson 28)\n\nAs you work, keep asking yourself:\n- \"Who is this for?\"\n- \"What's the first thing someone sees? Is that what I want?\"\n- \"What do I want someone to DO after seeing this?\"\n\nIf you answer \"I don't know\" to any of these — revisit your brief.",
    },

    {
      id: uid(), type: "section_header",
      icon: "📋",
      title: "Self-Assessment",
      subtitle: "Rate your own work honestly",
    },
    {
      id: "q-selfassess", type: "question",
      questionType: "short_answer",
      prompt: "Rate yourself 1-3 on each principle: (1) Clear target audience, (2) Strong hook, (3) Visual hierarchy works, (4) Copy is concise with CTA, (5) Would you actually post this? Explain your lowest rating — what would you improve?",
    },
    {
      id: uid(), type: "callout",
      icon: "📤", style: "action",
      content: "**Export and submit** your content piece to Google Classroom. Tomorrow is Showcase Day!",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 31: Content Showcase + Unit Wrap-Up
// ═══════════════════════════════════════════════════════════════

const lesson31 = {
  title: "Content Showcase + Unit Wrap-Up",
  questionOfTheDay: "Now that you know how content is designed on purpose — will you ever scroll the same way again?",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 30,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🏆",
      title: "Content Showcase",
      subtitle: "Gallery Walk + Unit Wrap-Up",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Present and explain design decisions behind a content piece",
        "Give structured feedback using unit vocabulary (audience, hook, hierarchy, CTA)",
        "Reflect on growth from basic tool use to intentional content creation",
      ],
    },

    {
      id: uid(), type: "section_header",
      icon: "🖼️",
      title: "Gallery Walk",
      subtitle: "12 minutes — view at least 8 pieces",
    },
    {
      id: uid(), type: "activity",
      icon: "🖼️",
      title: "Gallery Walk + Feedback",
      instructions: "All content pieces are displayed on Chromebooks around the room.\n\n**Walk around and view at least 8 pieces.** For each one, leave feedback on the shared Google Form:\n- Student name\n- One thing that works (use unit vocabulary: audience, hook, hierarchy, copy, CTA)\n- One suggestion for improvement\n\nThen: 5-6 volunteers will present their work to the class (2 min each). Explain who it's for, what the hook is, and what design choices you made.",
    },
    {
      id: "q-feedback", type: "question",
      questionType: "short_answer",
      prompt: "Pick one classmate's content piece that stood out. What worked well? Use at least 2 vocabulary terms from this unit in your answer.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🪞",
      title: "Unit Reflection",
      subtitle: "How you've grown as a content creator",
    },
    {
      id: "q-reflect1", type: "question",
      questionType: "short_answer",
      prompt: "What's the biggest difference between how you created content at the start of the year vs. now?",
    },
    {
      id: "q-reflect2", type: "question",
      questionType: "short_answer",
      prompt: "Which principle from this unit (audience, hooks, hierarchy, copy) changed how you think about content the most? Why?",
    },
    {
      id: "q-reflect3", type: "question",
      questionType: "short_answer",
      prompt: "Look at your content calendar — which piece would you most want to actually create and post? What would you need to make it real?",
    },
    {
      id: uid(), type: "callout",
      icon: "🚀", style: "highlight",
      content: "**Next unit:** You know how to create content that grabs attention. Next up — what if you could turn that into a business? We're learning how people your age build real businesses online.",
    },
  ],
};


// ═══════════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════════

const lessons = [
  { slug: "understanding-your-audience", data: lesson22 },
  { slug: "the-hook", data: lesson23 },
  { slug: "visual-hierarchy", data: lesson24 },
  { slug: "infographics", data: lesson25 },
  { slug: "infographic-workshop", data: lesson26 },
  { slug: "thumbnail-cover-art", data: lesson27 },
  { slug: "writing-for-screens", data: lesson28 },
  { slug: "content-calendar", data: lesson29 },
  { slug: "production-day-content", data: lesson30 },
  { slug: "content-showcase", data: lesson31 },
];

async function main() {
  console.log("🚀 Seeding Digital Literacy Unit 5: Content Creation (Lessons 22-31)...\n");

  for (const { slug, data } of lessons) {
    const ref = db.collection("courses").doc(COURSE_ID).collection("lessons").doc(slug);
    await safeLessonWrite(db, COURSE_ID, slug, { ...data, updatedAt: new Date() });
    console.log(`✅ ${data.title}`);
    console.log(`   courses/${COURSE_ID}/lessons/${slug} — ${data.blocks.length} blocks`);
  }

  console.log(`\n🎉 Done! ${lessons.length} lessons seeded for Unit 5: Content Creation.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
