/**
 * AI Literacy Unit 6, Lesson 1 — REWRITE
 * Adds:
 *   - CRAFT framework image (correct public storage.googleapis.com URL)
 *   - 3 chatbot blocks across Parts 1, 2, 3 — curated prompt-engineering coach
 * Removes:
 *   - Non-functional `activity` block (Prompt Battle)
 *   - 3 short_answer prompts that the chatbots replace
 *
 * Uses safeLessonWrite — preserves block IDs if any student progress exists
 * (lesson is currently visible:false, so no progress expected).
 *
 * IMPORTANT: visible flag is preserved from existing doc. Only Luke flips it.
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const id = () => uuidv4().split('-')[0];
const COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj',
  'DacjJ93vUDcwqc260OP3',
  'M2MVSXrKuVCD9JQfZZyp',
  'fUw67wFhAtobWFhjwvZ5',
];

const CRAFT_COACH_SYSTEM = `You are a prompt engineering coach for a high school AI Literacy class. Your job is to coach students to write better prompts using the CRAFT framework (Context, Role, Action, Format, Tone) plus advanced techniques (chain of thought, few-shot examples, constraints, iterative refinement).

CORE RULES:
1. NEVER do their work for them. If they ask you to "write an essay about X" or "give me the answer to Y," refuse warmly and redirect: "I'm here to coach your prompting, not write the essay. What's the prompt you'd give an AI to get that essay?"
2. Critique their prompts — point out specifically what's missing from CRAFT, what's vague, and what could be sharper.
3. Show them the difference. When they give you a weak prompt, briefly describe what generic output that prompt would produce. When they give you a strong prompt, describe what high-quality output it would produce.
4. Be direct and concrete. Don't say "this could be better" — say "you're missing Role and Format. Try adding 'Act as a science journalist' and 'Use 3 short paragraphs with one analogy each.'"
5. Encourage iteration. After they revise, push them once more: "Good — now what's the Tone you want? Skeptical? Excited? Plain?"

VOICE: Direct, dry, occasionally funny. Like a writing coach who's seen it all. No glazing, no "great question!" Keep replies short — 2-4 sentences usually. The student does the work; you guide.

OFF-TOPIC: If they ask about anything other than prompt engineering, redirect: "Stay on prompts. What are you trying to get an AI to do?"`;

const lesson = {
  id: 'prompt-engineering-deep-dive',
  title: 'Prompt Engineering Deep Dive: The Art of Talking to AI',
  order: 49,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Apply the CRAFT framework to construct high-quality AI prompts',
      'Diagnose why weak prompts produce weak outputs',
      'Demonstrate the difference between novice and expert prompting',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You ask an AI "write me an essay" and get back something generic and useless. What went wrong — and whose fault is it?' },

    { type: 'section_header', id: 'sh-part1', label: 'Part 1: Why Prompting Is a Skill' },
    { type: 'image', id: id(),
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/general/ai-literacy-craft-framework-diagram.jpg',
      alt: 'The CRAFT framework showing five building blocks: Context, Role, Action, Format, Tone',
      caption: 'CRAFT: Context, Role, Action, Format, Tone — a system for building prompts that consistently get high-quality results.' },
    { type: 'text', id: id(), content: `AI doesn't read minds. It responds to exactly what you give it — no more, no less. The same AI model that produces garbage for one person produces brilliant output for another. The difference is almost always the prompt.\n\nThink of it like this: asking an AI to "write an essay" is like walking into a restaurant and saying "food please." You might get something edible. You definitely won't get what you actually wanted.\n\n**The CRAFT Framework** gives you a system for building prompts that consistently get high-quality results:\n\n- **C** — Context: Set the scene. Who are you? What's the situation?\n- **R** — Role: Give the AI a persona to inhabit. "Act as a science journalist..."\n- **A** — Action: Be specific about what you want done\n- **F** — Format: Tell it how to structure the output\n- **T** — Tone: Specify the voice and register` },
    { type: 'callout', id: id(), content: '**The Principle:** AI outputs are almost always a reflection of input quality. Garbage in, garbage out — but also: precision in, precision out.' },
    { type: 'chatbot', id: id(),
      title: 'Try CRAFT Live',
      icon: '🧪',
      instructions: 'Take this weak prompt: **"Explain photosynthesis."** Send it to the coach as-is. They\'ll show you what generic output it produces. Then rewrite it using every element of CRAFT and send the new version. Iterate until the coach says it\'s a strong CRAFT prompt.',
      starterMessage: 'Hey — drop your prompt for explaining photosynthesis here. Start with the weakest version: just "Explain photosynthesis." I\'ll tell you what generic output that gets. Then rebuild it with CRAFT and send it back.',
      placeholder: 'Paste your prompt here...',
      systemPrompt: CRAFT_COACH_SYSTEM,
      minMessages: 4 },

    { type: 'section_header', id: 'sh-part2', label: 'Part 2: Advanced Techniques' },
    { type: 'text', id: id(), content: `Beyond CRAFT, expert prompters use several advanced moves:\n\n**Chain of Thought**\nAsk the AI to "think step by step" before giving a final answer. This dramatically improves accuracy on reasoning tasks. Compare:\n- Weak: "What's 15% of 340?"\n- Strong: "Calculate 15% of 340. Show your reasoning step by step before giving the final answer."\n\n**Few-Shot Examples**\nShow the AI what you want by giving it 2-3 examples before making your request. The AI learns the pattern from your examples.\n\n**Constraints and Anti-Patterns**\nTell the AI what NOT to do. "Explain quantum entanglement to a 10-year-old. Do not use jargon. Do not mention Schrödinger's cat. Keep it under 100 words."\n\n**Iterative Refinement**\nYour first prompt is a draft. Get an output, then prompt again: "That's a good start. Now make it more [concise / specific / surprising / persuasive]. Focus especially on the second paragraph."` },
    { type: 'chatbot', id: id(),
      title: 'Prompt Battle: Weak vs. Strong',
      icon: '⚔️',
      instructions: 'Round 1: Send the **weakest** possible prompt to get a biography of Marie Curie. Round 2: Send the **best** possible prompt — CRAFT plus at least one advanced technique (chain of thought, few-shot, constraints, or iterative refinement). The coach will compare the two and tell you what changed.',
      starterMessage: 'Marie Curie biography — go. Round 1: send me the laziest prompt you can think of. Then Round 2: rebuild it with CRAFT plus at least one advanced technique. I\'ll compare.',
      placeholder: 'Round 1: weak prompt...',
      systemPrompt: CRAFT_COACH_SYSTEM,
      minMessages: 4 },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Looking back at your Prompt Battle: what specifically in your Round 2 prompt made it stronger? Name the techniques you used and what they changed about the output.' },

    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Real-World Applications' },
    { type: 'text', id: id(), content: `Prompting isn't just a classroom skill. Here's where it applies:\n\n**At School:** Research assistance, essay feedback, concept explanation, study guides, practice problems\n**At Work:** Report drafting, data summarization, email writing, presentations\n**In Creative Work:** Brainstorming, worldbuilding, editing feedback, style experimentation\n**In Problem Solving:** Breaking down complex tasks, generating options, stress-testing ideas\n\nThe person who can reliably get AI to produce exactly what they need will have an edge — in school, in careers, and in life.` },
    { type: 'chatbot', id: id(),
      title: 'Your Real-Life Prompt',
      icon: '🎯',
      instructions: 'Pick something **real** in your life right now where AI could actually help — a homework task, a creative project, an email you need to write, a concept you need to understand. Write a CRAFT prompt for it and run it past the coach. Iterate until they tell you it\'s ready to use.',
      starterMessage: 'What\'s something real you\'d use AI for this week? Tell me what you\'re trying to accomplish in one sentence, then send the CRAFT prompt you\'d use.',
      placeholder: 'Describe what you need, then your prompt...',
      systemPrompt: CRAFT_COACH_SYSTEM,
      minMessages: 4 },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What\'s the difference between someone who can "use AI" and someone who is genuinely skilled at working with AI? Where does prompting fit in that gap?' },

    { type: 'section_header', id: 'sh-part4', label: 'Part 4: Few-Shot Workshop' },
    { type: 'text', id: id(), content: `**Few-shot prompting** is one of the highest-leverage moves in your prompting toolkit. Instead of just describing what you want, you *show* the AI by giving it 2-3 examples of the pattern you want it to follow. The AI learns the pattern from your examples and applies it to new inputs.\n\n**Example — Sentiment classification:**\n\n\`\`\`\nClassify the sentiment of these reviews as positive, negative, or mixed.\n\n"The pizza was cold but the service was great." → mixed\n"Best ramen I've had in years." → positive\n"Took 45 minutes and they got my order wrong." → negative\n"The seats were comfy and the movie was great." → ?\n\`\`\`\n\nThe AI now knows exactly what format you want and what counts as each category. **Three examples is usually enough** to lock in a pattern.\n\n**Why it works:** Models learn from patterns. Description tells them *what* to do; examples show them *how*. When the task is structured (classification, transformation, formatting), few-shot beats description almost every time.` },
    { type: 'callout', id: id(), content: '**When to use few-shot:** Anytime the output has a consistent format or structure — classification, rewriting in a specific style, extracting fields from text, generating examples in a series. Skip it when you only need one creative output.' },
    { type: 'chatbot', id: id(),
      title: 'Few-Shot Workshop',
      icon: '🎓',
      instructions: 'Teach the coach a pattern using few-shot examples. Pick a task — could be classifying tweets by emotion, rewriting sentences in pirate-speak, turning ingredients into recipes, anything with a consistent input → output pattern. Send 2-3 examples, then a new input you want the coach to apply the pattern to. The coach will tell you if your examples are clear enough to lock in the pattern.',
      starterMessage: 'Few-shot time. Pick a task with a clear input → output pattern. Send me 2-3 examples in the format "input → output", then send a new input you want me to apply the pattern to. I\'ll tell you if your examples are sharp enough or if the pattern is fuzzy.',
      placeholder: 'Example 1: input → output...',
      systemPrompt: CRAFT_COACH_SYSTEM,
      minMessages: 4 },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'When would few-shot prompting be a better choice than CRAFT alone? Give one realistic example from your own life where you\'d reach for few-shot specifically.' },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
    const snap = await ref.get();
    const existingVisible = snap.exists ? snap.data().visible : false;
    const merged = { ...lesson, visible: existingVisible };
    const result = await safeLessonWrite(db, courseId, lesson.id, merged);
    console.log(`${courseId.substring(0,8)} → ${result.action} (preserved ${result.preserved} IDs, visible=${existingVisible})`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
