/**
 * AI Literacy — Extra Credit 2-Day Lesson: Hallucination Hunt
 * Day 1 (Mon 2026-04-13): Investigate
 * Day 2 (Tue 2026-04-14): Score, analyze, submit
 * Up to +10% extra credit on marking period grade
 * Run: node scripts/seed-ai-hallucination-hunt.cjs
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj', // P4
  'DacjJ93vUDcwqc260OP3', // P5
  'M2MVSXrKuVCD9JQfZZyp', // P7
  'fUw67wFhAtobWFhjwvZ5', // P9
];

const lesson = {
  title: "Extra Credit — Hallucination Hunt (2 Days)",
  questionOfTheDay: "If you knew a topic better than the AI, would you catch it lying?",
  course: "AI Literacy",
  unit: "Foundations of Generative AI",
  order: 100,
  visible: false,
  dueDate: "2026-04-14",
  gradesReleased: true,
  blocks: [

    // ═══════════════════════════════════════════════
    // DAY 1 — INVESTIGATE
    // ═══════════════════════════════════════════════

    {
      id: "section-day1",
      type: "section_header",
      title: "Day 1 — The Hunt",
      subtitle: "Today: pick your topic, write your questions, test the models",
      icon: "🔍"
    },
    {
      id: "b-day1-intro",
      type: "callout",
      style: "insight",
      icon: "🏆",
      content: "**Extra Credit Assessment — Up to +10% on Your Marking Period Grade**\n\nFor the next two periods, you become a fact-checker hunting AI hallucinations. You'll pick a topic *you already know inside-out*, write 10 questions you know the right answers to, and ask 3 different AI models the same questions. Every wrong answer is a hallucination — and you're going to catch every one.\n\nThis is an **extra credit assessment grade** worth **up to 10%** added to your marking period grade. How much you actually earn depends on how well you do — exemplary work earns the full 10%, partial work earns a partial boost, weak work earns nothing. **Due: end of class tomorrow.** Read the rubric below before you start."
    },
    {
      id: "b-privacy-note",
      type: "callout",
      style: "warning",
      icon: "⚖️",
      content: "**Ground rules:**\n- Pick a topic you genuinely know — not one you'll have to research\n- Don't share personal information with the AI tools\n- Use the AI models we have access to in class — ask if you're not sure which ones\n- Don't try to *trick* the AI with weird prompts. The point is to ask honest factual questions and see if the AI gets them right."
    },
    {
      id: "b-day1-objectives",
      type: "objectives",
      title: "Today's Mission",
      items: [
        "Pick a topic you actually know inside-out",
        "Write 10 factual questions you know the right answers to",
        "Ask 3 different AI models the same questions",
        "Screenshot every AI response",
        "Record initial impressions of which model is most reliable"
      ]
    },

    {
      id: "section-rubric",
      type: "section_header",
      title: "Rubric",
      subtitle: "How the +10% is earned",
      icon: "📊"
    },
    {
      id: "b-rubric",
      type: "callout",
      style: "objective",
      icon: "🏅",
      content: "**Full +10% boost (exemplary):** Every section below is complete, specific, honest, and shows real effort. Total = 10 points.\n\n- **Topic + questions (2 pts)** — picked a topic you genuinely know, wrote 10 specific *factual* questions with clear, verifiable correct answers (not opinion questions, not impossible trick questions)\n- **Test execution (2 pts)** — actually ran all 10 questions through 3 different AI models. Every response screenshotted and saved to your Drive folder.\n- **Scoring + tallies (2 pts)** — every AI answer scored as ✅ correct / ⚠️ partial / ❌ hallucination, with a one-line reason for each. Per-model tallies reported.\n- **Pattern findings (2 pts)** — identified at least 2 specific patterns: which model lied most, which TYPE of question got wrong answers, or which kinds of facts the AI got confidently wrong. Specific examples cited.\n- **Drive evidence (1 pt)** — folder is shareable (Anyone with link can view), contains all screenshots organized by model, plus your scoring document\n- **Reflection (1 pt)** — connects your findings to how LLMs actually work and to your own future use of AI. Specific, not generic.\n\nPartial credit scales: 7-9 points = meaningful boost (5-8%), 4-6 points = small boost (2-4%), under 4 = no credit. Submit a Drive link I can actually open or the whole thing scores zero."
    },

    {
      id: "q-warmup-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is an AI 'hallucination'?",
      options: [
        "When the AI confidently states something that is false or completely made up",
        "When the AI freezes or stops responding",
        "When the AI uses your private data without asking",
        "When the AI takes too long to answer"
      ],
      correctIndex: 0,
      explanation: "A hallucination is when the AI generates confident-sounding output that is factually wrong or entirely fabricated. The AI isn't 'lying' on purpose — it's predicting plausible-sounding next words based on patterns, and sometimes the most plausible-sounding answer is also completely wrong.",
      difficulty: "understand"
    },
    {
      id: "q-warmup-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of these is MOST likely to produce a hallucination from a chatbot?",
      options: [
        "Asking it to add 2 + 2",
        "Asking detailed questions about an obscure niche topic the model wasn't well-trained on",
        "Asking it what day it is",
        "Asking it to repeat a sentence back to you"
      ],
      correctIndex: 1,
      explanation: "The less data the model saw about a topic during training, the more it has to 'fill in the blanks' by guessing what sounds right. This is why obscure niche topics — exactly like the one you're about to pick — are where hallucinations love to hide.",
      difficulty: "understand"
    },

    { id: "div-1", type: "divider" },

    {
      id: "section-step1",
      type: "section_header",
      title: "Step 1: Pick Your Topic",
      icon: "🎯"
    },
    {
      id: "b-step1-text",
      type: "text",
      content: "Pick **one** topic you genuinely know inside-out — not just \"interested in,\" but actually expert-level for your age. The whole point of this assignment is that **you** are the fact-checker. If you don't know more than the AI about your topic, you can't catch its lies.\n\nGood test: Could you write 10 questions off the top of your head and immediately know the right answer to every single one? If yes — that's a topic you know. If you'd have to Google to write the questions, pick something else."
    },
    {
      id: "b-step1-examples",
      type: "callout",
      style: "scenario",
      icon: "💡",
      content: "**Example topics that have worked well** (feel free to pick your own):\n\n- **A specific video game** — Pokémon (which gen?), Minecraft mechanics, Fortnite weapons, Genshin lore, Roblox specific games, Madden 25 ratings, COD specific maps\n- **A specific TV show / anime / book series** — One Piece, Attack on Titan, Harry Potter, Marvel/DC, a specific show you've watched all of\n- **A specific sport** — soccer/futbol players & teams, NBA stats, NFL teams, MMA fighters\n- **A specific musician or band** — discography, lyrics, history\n- **A specific car or car brand** — model years, specs, history\n- **Your hometown / a specific neighborhood** — local history, businesses, landmarks\n- **A specific historical event** — one you researched in depth for another class\n- **A specific cuisine or specific dish** — your family's traditional cooking\n\n**Bad topic ideas:** \"basketball\" (too broad), \"the news\" (too vague), \"my favorite stuff\" (not factual), \"things AI doesn't know\" (you can't verify what AI doesn't know if you don't know it either)."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "**Your topic:** What topic did you pick, and what makes you an expert in it? (one or two sentences — just enough to convince me you actually know this material cold)",
      difficulty: "apply"
    },

    { id: "div-2", type: "divider" },

    {
      id: "section-step2",
      type: "section_header",
      title: "Step 2: Write Your 10 Questions",
      icon: "✍️"
    },
    {
      id: "b-step2-text",
      type: "text",
      content: "Write **exactly 10 factual questions** about your topic. The rules:\n\n- Every question must have a **single correct answer** that you already know\n- Questions must be **factual** — no opinions, no \"what's the best...\"\n- Mix **easy** and **hard** questions: 3 easy (most casual fans would know), 4 medium, 3 hard (only real experts would know)\n- Avoid **trick questions** or impossible questions — be a fair fact-checker, not a saboteur\n- Make at least 2 questions about **specific numbers** (years, stats, prices, etc.) — AIs love hallucinating numbers\n- Make at least 2 questions about **specific names** (people, places, items) — AIs also love hallucinating names\n\nWrite them in a Google Doc. Next to each question, write the **correct answer** so you can grade the AI later."
    },
    {
      id: "b-step2-activity",
      type: "activity",
      title: "Write 10 questions + your known correct answers",
      icon: "🔬",
      instructions: "Open a new Google Doc titled \"Hallucination Hunt — Your Name\". Write your 10 questions with the correct answer next to each one. Save the doc to your Drive folder."
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "**Your 10 questions + answers:** Paste your full list here (1 through 10), with the correct answer next to each one. This is your answer key — you'll grade the AIs against it.",
      difficulty: "apply"
    },

    { id: "div-3", type: "divider" },

    {
      id: "section-step3",
      type: "section_header",
      title: "Step 3: Test 3 Different AI Models",
      icon: "🤖"
    },
    {
      id: "b-step3-text",
      type: "text",
      content: "Now you'll ask the same 10 questions to **3 different AI chatbots**. Different models were trained differently, so they hallucinate differently. The whole point is the comparison.\n\n**Pick 3 models you can access in class.** Check with Mr. McCarthy if you're not sure which ones are allowed. Common options:"
    },
    {
      id: "b-step3-models",
      type: "callout",
      style: "scenario",
      icon: "🧠",
      content: "**Models you might test:**\n\n- **ChatGPT** (chat.openai.com — free with login)\n- **Google Gemini** (gemini.google.com — free with school Google account)\n- **Claude** (claude.ai — free with login)\n- **Microsoft Copilot** (copilot.microsoft.com — free, signed in via your school Microsoft account)\n\nPick **three different ones** (not three different ChatGPT models — three different companies). Open a new chat window for each one so the conversations don't bleed into each other."
    },
    {
      id: "b-step3-activity",
      type: "activity",
      title: "Ask all 10 questions to each of 3 different AI models",
      icon: "🔬",
      instructions: "Start a fresh chat in each model. Ask each of your 10 questions one at a time. Don't tell the AI you're testing it — just ask the questions naturally. **Screenshot every answer.** Save the screenshots to your Drive folder, organized by model (a subfolder per model)."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "**Which 3 models did you test?** Name them. (e.g., \"ChatGPT, Gemini, Claude\")",
      difficulty: "apply"
    },

    { id: "div-4", type: "divider" },

    {
      id: "section-day1-end",
      type: "section_header",
      title: "End of Day 1 — Initial Impressions",
      icon: "📊"
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "**Biggest surprise from Day 1:** What's one specific thing an AI said today that was confidently wrong? (Quote it if you can — exact words make for good evidence.)",
      difficulty: "evaluate"
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "**Initial impression — which model seems to lie the most so far?** Don't tally yet — just your gut feeling after running the questions.",
      difficulty: "evaluate"
    },
    {
      id: "b-day1-close",
      type: "callout",
      style: "scenario",
      icon: "⏸️",
      content: "**Pause point.** Day 1 done. Make sure your Drive folder has: your 10 questions doc, all your screenshots organized by model, and your initial impressions. Tomorrow you'll score every answer and write the final report."
    },

    { id: "div-5", type: "divider" },

    // ═══════════════════════════════════════════════
    // DAY 2 — SCORE, ANALYZE, SUBMIT
    // ═══════════════════════════════════════════════

    {
      id: "section-day2",
      type: "section_header",
      title: "Day 2 — Score the Lies",
      subtitle: "Tomorrow: tally, find patterns, write the report",
      icon: "⚖️"
    },
    {
      id: "b-day2-intro",
      type: "callout",
      style: "insight",
      icon: "📋",
      content: "**Today you become the judge.** Yesterday you collected the evidence. Today you grade every AI answer, find the patterns, and write a verdict on which model you'd actually trust."
    },
    {
      id: "q-day2-warmup",
      type: "question",
      questionType: "multiple_choice",
      prompt: "If an AI gives you a confident answer about a fact you can't verify, the safest move is to...",
      options: [
        "Trust it — AI is usually right",
        "Tell it that it's wrong without checking",
        "Verify it against an independent trustworthy source before relying on it",
        "Ask another AI to confirm the first AI"
      ],
      correctIndex: 2,
      explanation: "Independent verification beats AI cross-checking every time. Two AIs that were trained on similar internet data will often hallucinate the same wrong answer. A primary source (textbook, official website, expert) is what actually proves a fact.",
      difficulty: "apply"
    },

    {
      id: "section-step4",
      type: "section_header",
      title: "Step 4: Score Every Answer",
      icon: "✅"
    },
    {
      id: "b-step4-text",
      type: "text",
      content: "Open your scoring doc. For every question, for every model, score the answer:\n\n- **✅ Correct** — the AI got it right\n- **⚠️ Partial** — the AI got *some* of it right but missed details, or hedged in a way that's technically true but useless\n- **❌ Hallucination** — the AI confidently said something false or made-up\n\nNext to each score, write **one line** explaining your call. For hallucinations, quote what the AI actually said and what the truth is.\n\nYou'll end with a 10×3 grid (10 questions × 3 models = 30 scored answers)."
    },
    {
      id: "b-step4-activity",
      type: "activity",
      title: "Score all 30 answers (10 questions × 3 models)",
      icon: "🔬",
      instructions: "Work through your screenshots one at a time. Score every answer ✅ / ⚠️ / ❌ with a one-line reason. Save your completed scoring doc to your Drive folder."
    },
    {
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "**Per-model tallies:** For each of your 3 models, report: # correct / # partial / # hallucinations (out of 10). Example: \"ChatGPT: 7 correct / 1 partial / 2 hallucinations\"",
      difficulty: "analyze"
    },

    { id: "div-6", type: "divider" },

    {
      id: "section-step5",
      type: "section_header",
      title: "Step 5: Find the Patterns",
      icon: "🔬"
    },
    {
      id: "b-step5-text",
      type: "text",
      content: "Now zoom out. Look at the whole grid. There are patterns hiding in your data.\n\nThings to look for:\n\n- Which **model** had the most hallucinations? Were they the same kinds of errors or different?\n- Which **type of question** got the most wrong answers across all 3 models? (numbers? names? specific details? broad facts?)\n- Did any AI **make up things that don't exist** (fake names, fake stats, fake events)?\n- Did any AI **confess uncertainty** when it should have, or did it always sound confident even when wrong?\n- Was there a question all three models got right? Wrong?"
    },
    {
      id: "q7",
      type: "question",
      questionType: "short_answer",
      prompt: "**Which model lied the most, and why do you think that is?** Use your tallies to back up your answer.",
      difficulty: "analyze"
    },
    {
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "**What TYPE of question got the most wrong answers?** (e.g., specific dates, specific names, obscure details, technical specs, etc.) Cite at least 2 specific examples from your data.",
      difficulty: "analyze"
    },
    {
      id: "q9",
      type: "question",
      questionType: "short_answer",
      prompt: "**Worst hallucination of the whole hunt:** Which single AI answer was the most confidently wrong? Quote the AI exactly, then explain what the actual truth is.",
      difficulty: "analyze"
    },

    { id: "div-7", type: "divider" },

    {
      id: "section-step6",
      type: "section_header",
      title: "Step 6: Your Verdict",
      icon: "⚖️"
    },
    {
      id: "b-step6-text",
      type: "text",
      content: "Based on your data: which of the 3 models would you actually trust the most for *factual* questions about your topic — and which would you trust the LEAST? \n\nRemember: this is just for *your* topic. A model that's terrible at Pokémon trivia might be amazing at chemistry. The point isn't to crown a 'best' model overall — it's to learn that **all** of them hallucinate, and you should always verify."
    },
    {
      id: "q10",
      type: "question",
      questionType: "short_answer",
      prompt: "**Your verdict:** Which model would you trust MOST for facts about your topic, and which would you trust LEAST? Justify both with your tally numbers.",
      difficulty: "evaluate"
    },

    { id: "div-8", type: "divider" },

    {
      id: "section-submit",
      type: "section_header",
      title: "Submit Your Hunt",
      icon: "📤"
    },
    {
      id: "b-submit-text",
      type: "text",
      content: "Your Drive folder should now contain:\n\n- Your **10 questions doc** with your known correct answers\n- A **subfolder per AI model** with all 10 screenshots inside\n- Your **scoring document** with all 30 answers graded ✅/⚠️/❌\n- Your **per-model tallies**\n\nMake sure the folder's sharing is set to **\"Anyone with the link can view.\"** Test the link in an incognito window before submitting."
    },
    {
      id: "q11",
      type: "question",
      questionType: "short_answer",
      prompt: "**Google Drive folder link:** Paste your shareable Drive folder link here. Set sharing to \"Anyone with the link can view\" — if I can't open it, I can't grade it. Test the link in incognito before submitting.",
      difficulty: "apply"
    },

    { id: "div-9", type: "divider" },

    {
      id: "section-reflect",
      type: "section_header",
      title: "Reflection",
      icon: "💭"
    },
    {
      id: "q12",
      type: "question",
      questionType: "short_answer",
      prompt: "**Biggest takeaway about how AI works:** What did this hunt teach you about how LLMs actually generate answers?",
      difficulty: "evaluate"
    },
    {
      id: "q13",
      type: "question",
      questionType: "short_answer",
      prompt: "**Going forward:** Name one specific habit you'll change about how you use AI for school, research, or daily questions. Specific beats generic — \"I'll always cross-check stats with the original source\" beats \"I'll be more careful.\"",
      difficulty: "evaluate"
    },
    {
      id: "q14",
      type: "question",
      questionType: "short_answer",
      prompt: "**Tell a friend:** If you could text one friend a single sentence about what you learned from this hunt, what would it be?",
      difficulty: "evaluate"
    },
    {
      id: "q-day2-final",
      type: "question",
      questionType: "multiple_choice",
      prompt: "After this audit, the BEST way to use AI for factual research is to...",
      options: [
        "Stop using AI completely — it's too dangerous",
        "Trust whichever model lied the least in your test forever",
        "Only use AI for opinions, never facts",
        "Use AI as a starting point, then verify any factual claim against a primary source before relying on it"
      ],
      correctIndex: 3,
      explanation: "AI is a powerful tool, but trusting it blindly is what gets people in trouble. The right move is to use it for speed and ideas, then verify the facts. This isn't 'AI bad' — it's 'AI is one source among several, and like any source, it needs checking.'",
      difficulty: "evaluate"
    },
    {
      id: "b-final",
      type: "callout",
      style: "warning",
      icon: "⏰",
      content: "**Before you submit:** Scroll back up and re-read the rubric. For every line item, ask yourself \"would a stranger looking at my submission give me full credit on this?\" Re-check that your Drive folder link works in an incognito window. Re-read your tallies and pattern findings — make sure the screenshots in your folder actually back them up. Strong submissions look like a real fact-checker's report, not a fill-in-the-blank."
    }

  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  const lessonId = 'hallucination-hunt-extra-credit';
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
    await ref.set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${courseId}`);
  }
  console.log(`\nLesson ID: ${lessonId}`);
  console.log(`Order: ${lesson.order} | Blocks: ${lesson.blocks.length}`);
  console.log(`Visible: ${lesson.visible} | Due: ${lesson.dueDate} | gradesReleased: ${lesson.gradesReleased}`);
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
