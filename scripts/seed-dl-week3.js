// seed-dl-week3.js
// Seeds Digital Literacy Lessons 6-10: Week 3 — Gaming & Esports using CapCut
// Run: node scripts/seed-dl-week3.js
//
// Temporarily opens Firestore rules, seeds lessons, then restores original rules.

// SECURITY FIX: Uses Firebase Admin SDK instead of deploying open rules to production.
// The Admin SDK bypasses security rules server-side, so no rule changes are needed.
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = getFirestore();

// ═══════════════════════════════════════════════════════════════
// LESSON 6: Gaming & Esports (Week 3, Day 1)
// ═══════════════════════════════════════════════════════════════

const lesson6 = {
  title: "Gaming & Esports",
  course: "Digital Literacy",
  unit: "Week 3: Gaming & Esports",
  unitOrder: 2,
  order: 5,
  blocks: [
    // --- INTRO ---
    {
      id: "L6-section-intro",
      type: "section_header",
      title: "Gaming & Esports",
      subtitle: "A $184 billion industry",
      icon: "🎮"
    },
    {
      id: "L6-b1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Understand the scale and impact of the gaming industry",
        "Explore career paths in gaming and esports",
        "Evaluate the benefits and concerns of gaming culture",
        "Choose a topic and begin planning your gaming video project"
      ]
    },

    // --- INDUSTRY OVERVIEW ---
    {
      id: "L6-section-industry",
      type: "section_header",
      title: "The Gaming Industry by the Numbers",
      subtitle: "Bigger than movies and music combined",
      icon: "📊"
    },
    {
      id: "L6-b2",
      type: "text",
      content: "Gaming isn't just a hobby anymore — it's one of the biggest industries in the world:\n\n**💰 $184 Billion** — Annual global gaming revenue\n\n**👀 540 Million** — Esports viewers worldwide\n\n**💵 $1.8 Million** — Average salary of a top esports pro\n\n**🌍 2.7 Billion** — Global gamers (that's 1 in 3 people on Earth)\n\nTo put this in perspective, the global film industry makes about $100 billion per year. Gaming is nearly double that."
    },
    {
      id: "L6-b3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Approximately how many people worldwide play video games?",
      options: [
        "500 million",
        "1.2 billion",
        "2.7 billion",
        "5 billion"
      ],
      correctIndex: 2,
      explanation: "About 2.7 billion people play video games globally — that's roughly 1 in 3 people on Earth. Gaming spans all ages, platforms (mobile, console, PC), and regions of the world.",
      points: 5
    },

    // --- CAREER PATHS ---
    {
      id: "L6-section-careers",
      type: "section_header",
      title: "Careers in Gaming",
      subtitle: "More than just playing",
      icon: "💼"
    },
    {
      id: "L6-b4",
      type: "text",
      content: "When people think of gaming careers, they think of pro players. But there are dozens of career paths in the industry:\n\n**🎮 Pro Player** — Compete in tournaments for prize money and sponsorships\n\n**📺 Streamer / Content Creator** — Build an audience on Twitch, YouTube, or TikTok\n\n**💻 Game Developer** — Design, code, and build games (artists, programmers, writers)\n\n**📋 Team Manager** — Manage esports rosters, schedules, contracts, and strategy\n\n**🎙️ Caster / Commentator** — Provide live commentary for esports events (like a sports announcer)\n\n**📣 Marketing & Community** — Promote games, run social media, organize events"
    },
    {
      id: "L6-b5",
      type: "question",
      questionType: "short_answer",
      prompt: "Which gaming career path interests you the most? Why? If none of them appeal to you, explain why not.",
      points: 5
    },

    // --- THE DEBATE ---
    {
      id: "L6-section-debate",
      type: "section_header",
      title: "The Great Gaming Debate",
      subtitle: "Benefits vs. Concerns",
      icon: "⚖️"
    },
    {
      id: "L6-b6",
      type: "text",
      content: "Gaming is one of those topics where people have strong opinions. Let's look at both sides:\n\n**Benefits of Gaming:**\n- Improves hand-eye coordination and reaction time\n- Develops problem-solving and critical thinking skills\n- Builds teamwork and communication (in team-based games)\n- Creates real career opportunities and scholarships\n- Provides community and social connection\n\n**Concerns About Gaming:**\n- Risk of addiction and excessive screen time\n- Sedentary lifestyle and health impacts\n- Toxic behavior and online harassment\n- Loot boxes and predatory monetization (gambling mechanics)\n- Unrealistic expectations about becoming a pro"
    },
    {
      id: "L6-b7",
      type: "question",
      questionType: "short_answer",
      prompt: "Do you think gaming is overall more beneficial or more concerning for young people? Pick a side and give at least 2 reasons to support your argument.",
      points: 10
    },

    // --- WEEK PROJECT ---
    {
      id: "L6-section-project",
      type: "section_header",
      title: "Your Project This Week",
      subtitle: "Create a gaming video with CapCut",
      icon: "🎬"
    },
    {
      id: "L6-b8",
      type: "callout",
      icon: "🎥",
      style: "highlight",
      content: "**This week's project:** Create a **30–60 second gaming video** using CapCut.\n\nYou'll choose a gaming topic, plan your content, and use CapCut's editing tools to produce a polished, engaging video."
    },
    {
      id: "L6-b9",
      type: "text",
      content: "**Video Topic Ideas:**\n\n• **My Gaming Journey** — How you got into gaming, what you play, what it means to you\n• **Day in the Life of a Gamer** — What a typical gaming session looks like\n• **Esports Breakdown** — Explain an esports game to someone who's never watched\n• **Career Spotlight** — Deep dive into one gaming career path\n• **Hot Take** — Your controversial gaming opinion, defended with evidence\n• **Tutorial / Tips** — Teach a skill, strategy, or technique from a game you play\n\n*Or choose your own! Check with me if you're unsure.*"
    },

    // --- TODAY'S ACTIVITY ---
    {
      id: "L6-section-activity",
      type: "section_header",
      title: "Today's Activity",
      subtitle: "Explore, research, and plan",
      icon: "✏️"
    },
    {
      id: "L6-b10",
      type: "activity",
      icon: "📝",
      title: "Research & Plan Your Video",
      instructions: "Complete these steps today:\n\n**1. Discuss** — Talk with your table group: What games do you play? What's your relationship with gaming?\n\n**2. Explore & Research** — Look into your topic. Find interesting stats, facts, or examples you could include in your video.\n\n**3. Choose Your Topic** — Pick your video topic and angle from the list above (or create your own).\n\n**4. Plan Your Storyboard** — Sketch out 4-6 scenes: What will viewers see and hear in each part of your video?\n\n**5. Share** — Tell your partner what topic you chose and describe your first scene."
    },
    {
      id: "L6-b11",
      type: "question",
      questionType: "short_answer",
      prompt: "What topic did you choose for your gaming video? Describe your plan in 2-3 sentences — what's the main idea and how will you structure it?",
      points: 5
    },
    {
      id: "L6-b12",
      type: "callout",
      icon: "📅",
      style: "highlight",
      content: "**Tomorrow:** CapCut Basics — you'll learn the editing tool you'll use to create your video!"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 7: CapCut Basics (Week 3, Day 2)
// ═══════════════════════════════════════════════════════════════

const lesson7 = {
  title: "CapCut Basics",
  course: "Digital Literacy",
  unit: "Week 3: Gaming & Esports",
  unitOrder: 2,
  order: 6,
  blocks: [
    // --- INTRO ---
    {
      id: "L7-section-intro",
      type: "section_header",
      title: "CapCut Basics",
      subtitle: "Learn the editing tool for your gaming video",
      icon: "✂️"
    },
    {
      id: "L7-b1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Set up CapCut and navigate the editing interface",
        "Use core editing features: auto captions, transitions, text, and music",
        "Create a 15-second practice clip using at least 4 editing techniques"
      ]
    },

    // --- WHY CAPCUT ---
    {
      id: "L7-section-why",
      type: "section_header",
      title: "Why CapCut?",
      subtitle: "The editor behind viral content",
      icon: "🔥"
    },
    {
      id: "L7-b2",
      type: "text",
      content: "CapCut has become the go-to video editor for creators on TikTok, YouTube Shorts, and Instagram Reels. Here's why we're using it:\n\n**🆓 100% Free** — No watermarks, no premium tier needed for what we're doing\n\n**✨ Trendy Effects** — The same effects you see in viral videos\n\n**🗣️ Auto Captions** — Automatically generates subtitles from your voice\n\n**🎵 Music Library** — Built-in library of trending sounds and songs\n\n**📱 Works Everywhere** — Phone, tablet, and web browser (capcut.com)"
    },
    {
      id: "L7-b3",
      type: "callout",
      icon: "🌐",
      style: "action",
      content: "**Go to:** [capcut.com](https://www.capcut.com) → Sign in with your Google account\n\nCreate a new project and explore the interface for 2 minutes before we continue."
    },

    // --- KEY FEATURES ---
    {
      id: "L7-section-features",
      type: "section_header",
      title: "Key Features",
      subtitle: "The 5 tools you need to know",
      icon: "🔧"
    },
    {
      id: "L7-b4",
      type: "text",
      content: "Here are the five CapCut features you'll use most:\n\n**🗣️ Auto Captions** — Click \"Text\" → \"Auto captions\" to automatically generate subtitles from spoken audio. You can customize the font, size, and style.\n\n**🔄 Transitions** — Click between two clips and choose from dozens of smooth transitions. Swipe, fade, glitch, zoom — the options are endless.\n\n**✨ Effects** — Browse video effects (glitch, blur, VHS retro), body effects (background removal), and filters (color grading presets).\n\n**🔤 Text & Stickers** — Add animated text, titles, and stickers. Great for labels, callouts, and emphasis.\n\n**🎵 Music** — Browse CapCut's music library by mood, genre, or trending. Drag a track onto your timeline and adjust volume."
    },
    {
      id: "L7-b5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which CapCut feature automatically generates subtitles from spoken audio?",
      options: [
        "Effects",
        "Auto Captions",
        "Stickers",
        "Transitions"
      ],
      correctIndex: 1,
      explanation: "Auto Captions uses speech recognition to automatically generate subtitles from your voiceover or spoken audio. You can find it under the Text menu. It's one of CapCut's most popular features because captions make videos more accessible and engaging.",
      points: 5
    },

    // --- PRACTICE ---
    {
      id: "L7-section-practice",
      type: "section_header",
      title: "Practice: 15-Second Clip",
      subtitle: "Build your first CapCut project",
      icon: "🎯"
    },
    {
      id: "L7-b6",
      type: "activity",
      icon: "🎬",
      title: "Create a 15-Second Practice Clip",
      instructions: "Create a short practice video in CapCut that includes ALL of these:\n\n✅ **2 or more clips/images** — Use stock footage from CapCut's library or upload your own\n✅ **One transition** between clips — Try a swipe, fade, or glitch transition\n✅ **Text overlay with your name** — Use an animated text style\n✅ **Background music** — Pick a track from CapCut's music library\n\n**You have 20 minutes.** This is practice — experiment and have fun with it! The goal is to get comfortable with the tools before you start your real video."
    },
    {
      id: "L7-b7",
      type: "question",
      questionType: "short_answer",
      prompt: "Which CapCut feature was the easiest to use? Which one do you want to learn more about?",
      points: 5
    },

    // --- TRENDING TECHNIQUES ---
    {
      id: "L7-section-trending",
      type: "section_header",
      title: "Trending Techniques Preview",
      subtitle: "Level up your editing tomorrow",
      icon: "🚀"
    },
    {
      id: "L7-b8",
      type: "text",
      content: "Tomorrow we'll dive into advanced techniques. Here's a preview of what's coming:\n\n**⚡ Velocity Edits** — Speed ramping: slow-mo into fast-forward for dramatic effect\n\n**🎵 Beat Sync** — Cutting clips perfectly to the beat of your music\n\n**🔍 Zoom Transitions** — Smooth zooms that transition between scenes\n\n**🔤 Text Tracking** — Text that follows movement in your video\n\n**📱 Split Screen** — Show multiple angles or clips side by side\n\nThese are the techniques that make videos look professional and go viral."
    },

    // --- END OF CLASS ---
    {
      id: "L7-section-checklist",
      type: "section_header",
      title: "End-of-Class Checklist",
      subtitle: "Make sure you're ready for tomorrow",
      icon: "✅"
    },
    {
      id: "L7-b9",
      type: "callout",
      icon: "☑️",
      style: "checklist",
      content: "**Before you leave, confirm:**\n\n☐ Logged into CapCut (capcut.com)\n☐ Created a project\n☐ Added media (clips or images)\n☐ Applied at least one transition\n☐ Added text overlay\n☐ Added background music\n☐ Exported your test clip (or saved the project)"
    },
    {
      id: "L7-b10",
      type: "callout",
      icon: "📅",
      style: "highlight",
      content: "**Tomorrow:** Advanced Editing — velocity edits, beat sync, effects, and more!"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 8: Advanced Editing (Week 3, Day 3)
// ═══════════════════════════════════════════════════════════════

const lesson8 = {
  title: "Advanced Editing",
  course: "Digital Literacy",
  unit: "Week 3: Gaming & Esports",
  unitOrder: 2,
  order: 7,
  blocks: [
    // --- INTRO ---
    {
      id: "L8-section-intro",
      type: "section_header",
      title: "Advanced Editing",
      subtitle: "Techniques that make videos go viral",
      icon: "🎬"
    },
    {
      id: "L8-b1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply velocity edits (speed ramping) to create dramatic moments",
        "Sync video cuts to music beats for professional pacing",
        "Use effects, overlays, and filters to enhance your video's visual style"
      ]
    },

    // --- VELOCITY EDITS ---
    {
      id: "L8-section-velocity",
      type: "section_header",
      title: "Velocity Edits",
      subtitle: "Speed ramping for dramatic effect",
      icon: "⚡"
    },
    {
      id: "L8-b2",
      type: "text",
      content: "Velocity edits are one of the most popular editing techniques on TikTok and YouTube. They involve changing the speed of your clip — slowing down for dramatic moments and speeding up for energy.\n\n**How to do it in CapCut:**\n\n1. **Select your clip** on the timeline\n2. **Tap/click \"Speed\"** in the editing menu\n3. **Choose \"Curve\"** (not \"Normal\" — Curve gives you control over speed changes)\n4. **Pick a preset** (like \"Montage\" or \"Hero\") or create a custom curve\n5. **Drag the curve points** up for fast, down for slow\n\nThe key to a good velocity edit: slow down on the most impactful moment, then speed up to build energy."
    },
    {
      id: "L8-b3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In CapCut, which speed option gives you control over speed changes within a single clip?",
      options: [
        "Normal",
        "Curve",
        "Reverse",
        "Freeze"
      ],
      correctIndex: 1,
      explanation: "The \"Curve\" option lets you create custom speed changes within a single clip — dragging points up speeds it up, dragging down slows it down. \"Normal\" only lets you set one constant speed for the entire clip.",
      points: 5
    },

    // --- BEAT SYNC ---
    {
      id: "L8-section-beats",
      type: "section_header",
      title: "Beat Sync",
      subtitle: "Cut to the music",
      icon: "🎵"
    },
    {
      id: "L8-b4",
      type: "text",
      content: "Professional editors cut their clips to match the beat of the music. This makes videos feel rhythmic, intentional, and satisfying to watch.\n\n**How to beat sync in CapCut:**\n\n1. **Add your music first** — Pick a track with a clear beat\n2. **Select the audio track** and tap \"Edit audio\"\n3. **Tap \"Beats\"** — CapCut can auto-detect beats, or you can tap them manually\n4. **Yellow markers** appear on the timeline at each beat\n5. **Align your clip cuts** to these markers — each new clip or transition should start on a beat\n\nThe result: every visual change happens exactly when the music hits, creating a seamless, professional feel."
    },
    {
      id: "L8-b5",
      type: "question",
      questionType: "short_answer",
      prompt: "Why do you think cutting clips to the beat of music makes a video feel more professional? What effect does it have on the viewer?",
      points: 5
    },

    // --- EFFECTS & OVERLAYS ---
    {
      id: "L8-section-effects",
      type: "section_header",
      title: "Effects & Overlays",
      subtitle: "Add visual style",
      icon: "✨"
    },
    {
      id: "L8-b6",
      type: "text",
      content: "CapCut has a massive library of effects to enhance your video's look. Here's what's available:\n\n**🌀 Video Effects** — Glitch, blur, VHS retro, shake, and more. These add energy and style to your clips.\n\n**🧍 Body Effects** — Green screen, background removal, and body tracking. Great for putting yourself in different environments.\n\n**🎨 Filters** — Color grading presets that change the mood of your footage. Warm, cool, vintage, cinematic — pick one that matches your video's vibe.\n\n**💫 Overlays** — Light leaks, dust particles, film grain, and sparkles. Layer these on top of your footage for a polished look.\n\nRemember: less is more. One or two well-chosen effects look professional. Ten effects on every clip looks chaotic."
    },

    // --- WORK TIME ---
    {
      id: "L8-section-work",
      type: "section_header",
      title: "Work Time: 30 Minutes",
      subtitle: "Build your gaming video",
      icon: "⏱️"
    },
    {
      id: "L8-b7",
      type: "activity",
      icon: "🎬",
      title: "Build Your Gaming Video",
      instructions: "Use class time to work on your gaming video. Focus on applying at least 2 of the techniques we covered today:\n\n**Your video should include:**\n✅ At least one velocity edit (speed ramp)\n✅ Cuts that match the beat of your music\n✅ Text or captions to support your content\n✅ At least one effect or filter\n\n**You have 30 minutes.** Get the structure in place today — tomorrow is your final production day."
    },
    {
      id: "L8-b8",
      type: "question",
      questionType: "short_answer",
      prompt: "Which advanced technique (velocity edit, beat sync, or effects) did you try today? How did it turn out?",
      points: 5
    },
    {
      id: "L8-b9",
      type: "callout",
      icon: "📅",
      style: "highlight",
      content: "**Tomorrow:** Production Day — your last full work day to finish and polish your video!"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 9: Production Day (Week 3, Day 4)
// ═══════════════════════════════════════════════════════════════

const lesson9 = {
  title: "Production Day",
  course: "Digital Literacy",
  unit: "Week 3: Gaming & Esports",
  unitOrder: 2,
  order: 8,
  blocks: [
    // --- INTRO ---
    {
      id: "L9-section-intro",
      type: "section_header",
      title: "Production Day",
      subtitle: "Finish, polish, and export",
      icon: "🎬"
    },
    {
      id: "L9-b1",
      type: "objectives",
      title: "Today's Goals",
      items: [
        "Complete all editing on your gaming video",
        "Polish your video using the final checklist",
        "Export at 1080p and submit your video link"
      ]
    },

    // --- FINAL CHECKLIST ---
    {
      id: "L9-section-checklist",
      type: "section_header",
      title: "Final Video Checklist",
      subtitle: "Make sure your video hits every mark",
      icon: "✅"
    },
    {
      id: "L9-b2",
      type: "callout",
      icon: "☑️",
      style: "checklist",
      content: "**Your video must include:**\n\n☐ **30-60 seconds** in length (not too short, not too long)\n☐ **Clear story or message** — the viewer should understand your point\n☐ **2+ editing techniques** — velocity edits, beat sync, effects, transitions, etc.\n☐ **Text or captions** — titles, labels, or auto-generated subtitles\n☐ **Music that fits** — matches the mood and energy of your content\n☐ **Balanced audio** — music isn't drowning out your voice (if you have voiceover)\n☐ **No awkward pauses** — trim dead space and keep the pacing tight"
    },

    // --- POLISHING TIPS ---
    {
      id: "L9-section-polish",
      type: "section_header",
      title: "Polishing Tips",
      subtitle: "The difference between good and great",
      icon: "💎"
    },
    {
      id: "L9-b3",
      type: "text",
      content: "Before you export, take 5 minutes to polish your video with these tips:\n\n**👀 Watch with fresh eyes** — Play your video from the beginning like you're seeing it for the first time. Does it make sense? Is it engaging?\n\n**🔊 Check audio levels** — Music should be background-level if you have voiceover. Your voice should always be the loudest thing.\n\n**✂️ Trim the fat** — Every second should earn its place. If a clip doesn't add anything, cut it.\n\n**🎬 End strong** — Your last 3 seconds matter almost as much as your first 3. End with a clear statement, a visual punch, or a call to action.\n\n**🤝 Get feedback** — Show your video to a neighbor and ask: \"Does this make sense? What's confusing?\""
    },
    {
      id: "L9-b4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When adding voiceover with background music, which audio should be loudest?",
      options: [
        "The music should always be loudest",
        "Both should be at equal volume",
        "Your voice should always be the loudest",
        "It doesn't matter — viewers will figure it out"
      ],
      correctIndex: 2,
      explanation: "Your voice should always be the loudest element. Background music is just that — background. If viewers can't hear what you're saying, your message is lost. A good rule: music at about 20-30% volume when voiceover is playing.",
      points: 5
    },

    // --- WORK TIME ---
    {
      id: "L9-section-work",
      type: "section_header",
      title: "Work Time: 35 Minutes",
      subtitle: "Finish and export",
      icon: "⏱️"
    },
    {
      id: "L9-b5",
      type: "activity",
      icon: "🎬",
      title: "Finish & Export Your Video",
      instructions: "Use class time to finish your video and export it:\n\n**1. Final edits** (20 min) — Apply the polishing tips above. Make your last adjustments.\n\n**2. Get peer feedback** (5 min) — Show your neighbor. Ask what works and what's confusing.\n\n**3. Export** (5 min) — Export your video at **1080p** quality.\n\n**4. Upload to Google Drive** (5 min) — Upload your exported video file, set sharing to **\"Anyone with the link\"**, and copy the share link."
    },

    // --- UPLOAD & SUBMIT ---
    {
      id: "L9-section-submit",
      type: "section_header",
      title: "Upload & Submit",
      subtitle: "Share your video link",
      icon: "📤"
    },
    {
      id: "L9-b6",
      type: "text",
      content: "**How to upload and get your link:**\n\n1. Export your video from CapCut at **1080p**\n2. Open **Google Drive** (drive.google.com)\n3. Click **\"+ New\"** → **\"File upload\"** → Select your video file\n4. Wait for it to finish uploading\n5. **Right-click** the file → **\"Share\"** → **\"General access\"** → Change to **\"Anyone with the link\"**\n6. Click **\"Copy link\"**\n7. Paste the link below!"
    },
    {
      id: "L9-b7",
      type: "question",
      questionType: "short_answer",
      prompt: "Paste your Google Drive video link here. Make sure sharing is set to \"Anyone with the link\" so your teacher can view it.",
      points: 15
    },
    {
      id: "L9-b8",
      type: "callout",
      icon: "📅",
      style: "highlight",
      content: "**Tomorrow:** Showcase Day! We'll watch each other's videos, give feedback, and reflect on everything we've learned over the past 3 weeks."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 10: Showcase Day! (Week 3, Day 5)
// ═══════════════════════════════════════════════════════════════

const lesson10 = {
  title: "Showcase Day!",
  course: "Digital Literacy",
  unit: "Week 3: Gaming & Esports",
  unitOrder: 2,
  order: 9,
  blocks: [
    // --- INTRO ---
    {
      id: "L10-section-intro",
      type: "section_header",
      title: "Showcase Day!",
      subtitle: "Watch, celebrate, and reflect",
      icon: "🎉"
    },
    {
      id: "L10-b1",
      type: "objectives",
      title: "Today's Schedule",
      items: [
        "Final uploads and last-minute submissions (5 min)",
        "Video screenings and peer feedback (25 min)",
        "Course reflection — looking back on all 3 weeks (10 min)",
        "Final submissions (5 min)"
      ]
    },

    // --- FINAL UPLOADS ---
    {
      id: "L10-section-uploads",
      type: "section_header",
      title: "Final Uploads",
      subtitle: "5 minutes — last chance!",
      icon: "📤"
    },
    {
      id: "L10-b2",
      type: "callout",
      icon: "⏰",
      style: "action",
      content: "**If you haven't submitted your video link yet:**\n\nExport from CapCut → Upload to Google Drive → Set sharing to \"Anyone with the link\" → Paste the link in yesterday's lesson.\n\n**You have 5 minutes.** After that, we start screenings!"
    },

    // --- SCREENING ---
    {
      id: "L10-section-screening",
      type: "section_header",
      title: "Video Screenings",
      subtitle: "25 minutes — watch and discuss",
      icon: "🎬"
    },
    {
      id: "L10-b3",
      type: "activity",
      icon: "🎬",
      title: "Video Screenings & Peer Feedback",
      instructions: "As we watch each video, think about:\n\n**🪝 What was the hook?** — Did the first few seconds grab your attention?\n\n**📖 What was the message?** — Could you clearly understand the creator's point?\n\n**✨ What technique stood out?** — Velocity edits? Beat sync? Effects? Captions?\n\n**💡 What's one thing they did really well?** — Be specific and supportive.\n\nBe respectful and encouraging — everyone put real work into these videos!"
    },
    {
      id: "L10-b4",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick ONE classmate's video that stood out to you. What was their topic, and what's one specific thing they did well (editing technique, storytelling, creativity, etc.)?",
      points: 5
    },

    // --- COURSE REFLECTION ---
    {
      id: "L10-section-reflection",
      type: "section_header",
      title: "Course Reflection",
      subtitle: "Looking back on 3 weeks",
      icon: "🪞"
    },
    {
      id: "L10-b5",
      type: "text",
      content: "Over the past 3 weeks, you've covered a LOT of ground:\n\n**Week 1: Social Media & Mental Health + Canva**\nYou explored how social media affects mental health, learned about algorithms and dopamine loops, and created graphics using Canva.\n\n**Week 2: AI & Video Production + WeVideo**\nYou discovered AI in everyday life, learned video editing fundamentals in WeVideo, and produced an AI explainer video.\n\n**Week 3: Gaming & Esports + CapCut**\nYou explored the gaming industry, learned advanced editing techniques in CapCut, and created a polished gaming video.\n\nEach week built on the last — you now have real, practical skills in graphic design, video editing, and digital literacy."
    },
    {
      id: "L10-b6",
      type: "question",
      questionType: "short_answer",
      prompt: "Which of the three weekly projects was your favorite (Canva graphic, WeVideo explainer, or CapCut gaming video)? Why?",
      points: 5
    },
    {
      id: "L10-b7",
      type: "question",
      questionType: "short_answer",
      prompt: "What's one skill you learned in this course that you'll actually use outside of school? How will you use it?",
      points: 5
    },
    {
      id: "L10-b8",
      type: "question",
      questionType: "short_answer",
      prompt: "If there was a Week 4, what topic would you want to explore? Why?",
      points: 5
    },

    // --- FINAL SUBMISSION ---
    {
      id: "L10-section-submit",
      type: "section_header",
      title: "Final Submission Checklist",
      subtitle: "Make sure everything is turned in",
      icon: "📋"
    },
    {
      id: "L10-b9",
      type: "callout",
      icon: "☑️",
      style: "checklist",
      content: "**Before you leave, make sure you've submitted:**\n\n☐ Gaming video link (from yesterday's lesson)\n☐ All written responses in today's lesson\n☐ All written responses from Lessons 6-9\n\nIf anything is missing, go back and complete it now!"
    },

    // --- CONGRATULATIONS ---
    {
      id: "L10-section-congrats",
      type: "section_header",
      title: "Congratulations!",
      subtitle: "You did it!",
      icon: "🏆"
    },
    {
      id: "L10-b10",
      type: "callout",
      icon: "🎓",
      style: "highlight",
      content: "**You now have real skills in:**\n\n🎨 **Graphic Design** — Creating professional visuals with Canva\n\n🎬 **Video Editing** — Producing polished videos with WeVideo and CapCut\n\n🤖 **AI Literacy** — Understanding how AI works and impacts your daily life\n\nThese aren't just school skills — they're skills used in marketing, content creation, journalism, and dozens of other careers. Nice work this semester!"
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════════

async function seed() {
  try {
    console.log("\n🚀 Seeding Digital Literacy Week 3 lessons (6-10)...\n");

    const lessons = [
      { slug: "gaming-and-esports", data: lesson6 },
      { slug: "capcut-basics", data: lesson7 },
      { slug: "advanced-editing", data: lesson8 },
      { slug: "production-day-capcut", data: lesson9 },
      { slug: "showcase-day", data: lesson10 },
    ];

    for (const { slug, data } of lessons) {
      await db.doc(`courses/digital-literacy/lessons/${slug}`).set(data);
      console.log(`✅ Lesson seeded: courses/digital-literacy/lessons/${slug}`);
      console.log(`   "${data.title}" — ${data.blocks.length} blocks, order: ${data.order}`);
    }

    console.log("\n🎉 Done! 5 lessons (Week 3: Gaming & Esports) seeded.");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    process.exit(0);
  }
}

seed();
