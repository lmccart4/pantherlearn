// seed-demystifying-ai-lesson.js
// Run from your pantherlearn directory: node seed-demystifying-ai-lesson.js
// Lesson 13 in Foundations of Generative AI — a project-based lesson on
// identifying and rebutting AI misconceptions.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Demystifying Generative AI",
  course: "AI Literacy",
  unit: "Foundations of Generative AI",
  order: 13,
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
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify specific misconceptions and exaggerations in real-style AI opinion writing",
        "Explain why common AI myths are inaccurate using evidence and vocabulary from this unit",
        "Apply a claim → evidence → so what? structure to write a rebuttal to an AI misconception",
        "Reflect on how misconceptions about AI spread and why correcting them matters"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "Since ChatGPT went public, a flood of opinion articles, social media posts, and news headlines have tried to explain generative AI — and many of them get it seriously wrong.\n\nSome say AI **thinks like a human**. Others claim it's **totally objective** or **basically infallible**. Some predict it will **replace every job** within a few years.\n\nWhere do these ideas come from? Partly from genuine misunderstanding. Partly from hype. And partly because AI *does* seem almost magical if you haven't looked under the hood.\n\nIn this lesson, you're going to read one of those articles — and push back."
    },
    {
      id: "wu-discuss",
      type: "callout",
      icon: "💬",
      style: "insight",
      content: "**Discuss with a partner or your group:**\n\nWhat's a misconception about generative AI that you've heard — from a friend, family member, social media post, or news headline?\n\nWhat made it sound convincing? And what do you now know that makes you question it?"
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What's one misconception about generative AI that you've heard (or maybe believed yourself before this unit)? Where did you encounter it?",
      placeholder: "I heard that AI..."
    },

    // ═══════════════════════════════════════════════════════
    // STEP 1 — READ THE ARTICLE
    // ═══════════════════════════════════════════════════════
    {
      id: "section-article",
      type: "section_header",
      title: "Step 1: Read the Article",
      subtitle: "~10 minutes",
      icon: "📰"
    },
    {
      id: "article-intro",
      type: "callout",
      icon: "🎯",
      style: "insight",
      content: "**Your task:** Read the article below. As you read, mentally flag any statements that seem exaggerated, oversimplified, or factually wrong based on what you've learned in this unit.\n\nThe article was written in the style of real AI opinion pieces — the kind that actually circulate online. The author isn't being deliberately dishonest; they just don't have a deep understanding of how generative AI works."
    },
    {
      id: "article-text",
      type: "text",
      content: "---\n\n### Generative AI: Like Magic, but Even Cooler!\n*By Alex Thunderman · Tech Enthusiast Weekly*\n\nIf you haven't tried generative AI yet, you are seriously missing out on the greatest invention in human history. I've been using it for three months, and I can honestly say — **it thinks better than most people I know.**\n\nWhen I ask ChatGPT a question, **it actually understands what I mean, just like a person would. It processes meaning, has real comprehension, and forms genuine opinions.** The reason it can do this is simple: **it's been trained on basically the entire internet, which means it knows everything that's ever been written. No fact-checking needed!**\n\nThe best part? **AI can't be biased.** Unlike humans who let emotions cloud their judgment, AI is pure logic. A computer can't play favorites or have prejudices — it just gives you the objective truth every time.\n\nSome people worry about AI making things up. **But let's be real: that only happens with older, less advanced models. The newest AI systems are basically infallible. If GPT-4 says something, you can take it to the bank.**\n\nThe future is clear: in the next few years, **AI will surpass human intelligence across every single domain. Doctors, lawyers, teachers — they should all start looking for new careers.** This technology is simply inevitable.\n\nGenerative AI isn't just a tool. **It's a mind. And the sooner we accept that and hand over the decision-making, the better off we'll all be.**\n\n---"
    },
    {
      id: "article-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "After reading, list at least 3 specific claims from the article that you think are misconceptions or exaggerations. Quote the phrases directly.",
      placeholder: "1. \"...\"\n2. \"...\"\n3. \"...\""
    },

    // ═══════════════════════════════════════════════════════
    // STEP 2 — SORT THE CLAIMS
    // ═══════════════════════════════════════════════════════
    {
      id: "section-sort",
      type: "section_header",
      title: "Step 2: Sort the Claims",
      subtitle: "~10 minutes",
      icon: "🔀"
    },
    {
      id: "sort-intro",
      type: "callout",
      icon: "👆",
      style: "tip",
      content: "**Sort each claim below:** Is it a **misconception** (something wrong or misleading), or an **accurate** statement about how AI works?\n\nSwipe or click left for **Misconception**, right for **Accurate**."
    },
    {
      id: "sort1",
      type: "sorting",
      title: "Myth or Fact?",
      icon: "🔍",
      instructions: "Sort each claim: is it a **misconception** about AI, or an **accurate** statement?",
      leftLabel: "Misconception 🚩",
      rightLabel: "Accurate ✓",
      items: [
        {
          text: "\"AI actually understands what you mean, just like a person would.\"",
          correct: "left"
        },
        {
          text: "\"AI has been trained on text data from the internet and other sources.\"",
          correct: "right"
        },
        {
          text: "\"AI can't be biased — it's pure logic and gives you objective truth.\"",
          correct: "left"
        },
        {
          text: "\"AI systems can generate confident-sounding statements that are factually incorrect.\"",
          correct: "right"
        },
        {
          text: "\"The newest AI models are basically infallible — you can trust what they say.\"",
          correct: "left"
        },
        {
          text: "\"Language models predict likely next words based on statistical patterns in training data.\"",
          correct: "right"
        },
        {
          text: "\"AI thinks better than most humans because it's processed more information.\"",
          correct: "left"
        },
        {
          text: "\"AI output should always be verified, especially for facts, citations, and high-stakes decisions.\"",
          correct: "right"
        },
        {
          text: "\"Generative AI is a mind — we should hand over decision-making to it.\"",
          correct: "left"
        },
        {
          text: "\"AI bias comes from patterns in the training data, not from AI having emotions.\"",
          correct: "right"
        }
      ]
    },

    // ═══════════════════════════════════════════════════════
    // STEP 3 — DECODE THE MISCONCEPTIONS
    // ═══════════════════════════════════════════════════════
    {
      id: "section-decode",
      type: "section_header",
      title: "Step 3: Decode the Misconceptions",
      subtitle: "~15 minutes",
      icon: "🧠"
    },
    {
      id: "decode-intro",
      type: "text",
      content: "The article contained **seven distinct misconceptions**. Let's break down what the author got wrong — and, more importantly, *why* it matters that people believe these things."
    },
    {
      id: "myth1",
      type: "callout",
      icon: "🚩",
      style: "warning",
      content: "**Misconception #1: \"It thinks better than most people I know.\"**\n\nLanguage models don't *think* at all. They predict the most statistically likely next word or token based on patterns in training data. There's no cognition, no reasoning, no awareness happening. When output sounds thoughtful, that's the result of sophisticated pattern-matching — not a mind at work.\n\n**Why it matters:** People who believe AI thinks like a human tend to trust its output without verification — including when it's confidently wrong."
    },
    {
      id: "myth2",
      type: "callout",
      icon: "🚩",
      style: "warning",
      content: "**Misconception #2: \"It actually understands what I mean, just like a person would.\"**\n\nLLMs don't grasp meaning. They identify statistical regularities in enormous amounts of text. They can *appear* to understand because they've been trained on vast human language — but there's no underlying comprehension. They're exceptionally good at producing text that *sounds* like understanding.\n\n**Why it matters:** Mistaking pattern-matching for understanding leads to over-trusting AI output in situations that require genuine reasoning."
    },
    {
      id: "myth3",
      type: "callout",
      icon: "🚩",
      style: "warning",
      content: "**Misconception #3: \"It knows everything that's ever been written. No fact-checking needed!\"**\n\nLLMs are trained on a curated sample of data with a knowledge cutoff date — not the entire internet in real time. More critically, they hallucinate: they produce confident-sounding false information without any signal that something is wrong. Fact-checking is always required.\n\n**Why it matters:** Treating AI as a source of fact — without verification — is one of the most direct pathways to spreading misinformation."
    },
    {
      id: "myth4",
      type: "callout",
      icon: "🚩",
      style: "warning",
      content: "**Misconception #4: \"AI can't be biased — it's pure logic.\"**\n\nAI systems are trained on human-generated data, which encodes historical inequities, cultural assumptions, and social biases. Research has documented AI bias in hiring tools, criminal risk scoring, facial recognition, and medical diagnosis. The AI isn't making emotional judgments — but it's reproducing patterns from data that were shaped by human bias.\n\n**Why it matters:** Calling AI \"objective\" makes biased outputs appear more authoritative, making them harder to challenge."
    },
    {
      id: "myth5",
      type: "callout",
      icon: "🚩",
      style: "warning",
      content: "**Misconception #5: \"The newest AI systems are basically infallible.\"**\n\nHallucination is a structural feature of how language models generate text — not a bug that newer models have fixed. GPT-4, Claude, Gemini, and every other state-of-the-art model hallucinate. Developers at every major AI lab openly acknowledge this as an unsolved problem.\n\n**Why it matters:** Believing AI is infallible means skipping fact-checking — directly enabling the spread of AI-generated misinformation."
    },
    {
      id: "myth6",
      type: "callout",
      icon: "🚩",
      style: "warning",
      content: "**Misconception #6: \"AI will surpass human intelligence across every domain. Doctors and teachers should find new careers.\"**\n\nThis treats a contested, speculative prediction as inevitable fact. Experts disagree sharply on timelines and outcomes for AI automation. While AI will change many jobs and may eliminate some tasks, sweeping predictions about replacing all professional roles oversimplify a complex picture.\n\n**Why it matters:** Presenting speculation as inevitability can paralyze people or push bad policy decisions."
    },
    {
      id: "myth7",
      type: "callout",
      icon: "🚩",
      style: "warning",
      content: "**Misconception #7: \"It's a mind. We should hand over the decision-making.\"**\n\nDescribing AI as a \"mind\" anthropomorphizes it in ways that obscure how it actually works. More dangerously, suggesting we surrender decision-making to AI ignores accountability, error rates, and the indispensability of human judgment — especially for consequential decisions.\n\n**Why it matters:** Misplaced trust in AI as a mind leads people to delegate decisions they should be making (and questioning) themselves."
    },
    {
      id: "pattern-callout",
      type: "callout",
      icon: "🔗",
      style: "insight",
      content: "**Notice the pattern:** Every misconception makes AI seem *more human*, *more reliable*, or *more inevitable* than it actually is. Writers like this often aren't lying — they genuinely believe what they're saying. But spreading these ideas makes it harder for everyone to use AI critically and safely."
    },

    // ═══════════════════════════════════════════════════════
    // STEP 4 — BUILD A REBUTTAL
    // ═══════════════════════════════════════════════════════
    {
      id: "section-rebuttal",
      type: "section_header",
      title: "Step 4: Build Your Rebuttal",
      subtitle: "~20 minutes",
      icon: "✍️"
    },
    {
      id: "rebuttal-intro",
      type: "text",
      content: "Now it's your turn. You're going to write a **1–2 paragraph response** to the article.\n\nA strong rebuttal doesn't just say *\"that's wrong.\"* It:\n\n1. **Identifies the specific claim** — Quote or closely paraphrase what the article says\n2. **Explains the evidence** — What do you know (from this unit) that contradicts it?\n3. **States why it matters** — What's the real-world consequence of believing this misconception?"
    },
    {
      id: "rebuttal-framework",
      type: "checklist",
      title: "Rebuttal Checklist",
      items: [
        "I chose a specific claim from the article to respond to",
        "I quoted or closely paraphrased the claim I'm rebutting",
        "I explained what the author got wrong using vocabulary from this unit",
        "I gave evidence or reasoning to back up my correction",
        "I explained why this misconception matters — what's the real-world consequence of believing it?"
      ]
    },
    {
      id: "rebuttal-example",
      type: "callout",
      icon: "💡",
      style: "tip",
      content: "**Example structure:**\n\n*\"The article claims that [quote]. This is a misconception because [evidence/explanation]. The consequence of believing this is [real-world impact].\"*\n\nHere's a strong example on the 'AI is unbiased' misconception:\n\n> *The article states that \"AI can't be biased\" because it's \"pure logic.\" This is misleading. AI systems are trained on human-generated data — data that reflects real-world inequities and cultural assumptions built up over time. Research has documented AI hiring tools that favored male candidates, facial recognition systems with higher error rates for darker skin tones, and criminal risk scores that reflected racial disparities. Calling AI \"objective\" doesn't eliminate these patterns; it hides them. The danger is that outputs appearing to come from an unbiased source get treated as more authoritative — making it harder for people to push back against decisions that may be discriminatory.*"
    },
    {
      id: "rebuttal-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Choose ONE misconception from the article and write a 1–2 paragraph rebuttal. Use specific vocabulary and concepts from this unit to support your response.",
      placeholder: "The article claims that...\n\nThis is a misconception because...\n\nThe real-world consequence of believing this is..."
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~10 minutes",
      icon: "🎯"
    },
    {
      id: "wrapup-text",
      type: "text",
      content: "Let's check what you learned — then reflect on the bigger picture."
    },
    {
      id: "quiz1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "The article says AI \"forms genuine opinions.\" What is actually happening when an AI produces a response that sounds opinionated?",
      options: [
        "The AI searches the internet for the most popular view on the topic",
        "The AI generates statistically likely word sequences based on patterns in training data",
        "The AI uses logical deduction to arrive at the most defensible position",
        "The AI expresses preferences it developed during training"
      ],
      correctIndex: 1,
      explanation: "Language models generate text by predicting likely continuations based on patterns — not by reasoning or forming views. Output that sounds opinionated is the result of pattern-matching, not genuine belief."
    },
    {
      id: "quiz2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why is calling AI \"objective\" or \"unbiased\" potentially harmful?",
      options: [
        "Because true objectivity is philosophically impossible to achieve",
        "Because it makes AI seem less impressive than it actually is",
        "Because it hides the fact that AI training data encodes human biases",
        "Because it causes AI systems to perform worse on benchmarks"
      ],
      correctIndex: 2,
      explanation: "AI systems learn from human-generated data, which reflects real-world inequities and social biases. Calling AI \"objective\" makes biased outputs seem more authoritative and harder to challenge."
    },
    {
      id: "quiz3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which statement about hallucination in current AI is most accurate?",
      options: [
        "Hallucination only occurs in smaller or older models — frontier models have solved it",
        "Hallucination is a structural feature of how LLMs work, present even in state-of-the-art models",
        "Hallucination happens when AI deliberately tries to be creative with its responses",
        "Hallucination is rare and mostly limited to obscure or niche topics"
      ],
      correctIndex: 1,
      explanation: "Hallucination — producing confident but false information — is inherent to how language models generate text. It remains an open, unsolved problem across all current frontier models, including GPT-4, Claude, and Gemini."
    },
    {
      id: "quiz4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is the strongest structure for rebutting an AI misconception?",
      options: [
        "State clearly that the claim is wrong, then move on",
        "Find a quote from a famous scientist or technologist who disagrees",
        "Ask an AI to evaluate whether the claim is accurate",
        "Identify the specific claim, explain the evidence against it, and state why the misconception matters"
      ],
      correctIndex: 3,
      explanation: "A strong rebuttal names the specific claim, provides evidence or reasoning against it, and makes clear why the misconception has real-world consequences. Simply asserting something is wrong without explanation or stakes doesn't persuade."
    },
    {
      id: "reflect1",
      type: "question",
      questionType: "short_answer",
      prompt: "What part of your rebuttal are you most satisfied with? And what's one thing you'd improve if you had more time?",
      placeholder: "I'm most satisfied with...\n\nIf I had more time, I would..."
    },
    {
      id: "reflect2",
      type: "question",
      questionType: "short_answer",
      prompt: "Why does it matter that people outside of class can read and understand AI misconceptions? What's the real-world stakes of getting this wrong?",
      placeholder: "It matters because..."
    },
    {
      id: "takeaways",
      type: "callout",
      icon: "✅",
      style: "success",
      content: "**Key Takeaways from This Lesson:**\n\n- AI doesn't think, understand, or have opinions — it predicts statistically likely text\n- AI reflects the biases in its training data; calling it \"objective\" hides this reality\n- Hallucination is structural to how LLMs work — it hasn't been solved, even in frontier models\n- AI output always requires fact-checking, especially in consequential situations\n- Anthropomorphizing AI (calling it a \"mind\") can lead to misplaced trust and poor decisions\n- A strong rebuttal names the claim, provides evidence, and explains why the misconception matters"
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "Period 4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "Period 5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "Period 7" },
  ];

  const lessonId = "demystifying-ai";

  for (const course of courses) {
    await db.collection("courses").doc(course.courseId)
      .collection("lessons").doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label} (${course.courseId})`);
  }

  console.log(`\n   Lesson ID: ${lessonId}`);
  console.log(`   Order: ${lesson.order} (Lesson 13 — Foundations of Generative AI)`);
  console.log(`   Blocks: ${lesson.blocks.length}`);
  console.log(`   Visible: false (publish via Lesson Editor when ready)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error seeding lesson:", err);
  process.exit(1);
});
