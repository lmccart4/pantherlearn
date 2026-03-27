/**
 * AI Literacy — AI Storybook: Creative Writing & Image Generation
 * Unit: AI and Creativity | Order: 18 | Visible: false
 * Due: 2026-03-25 (Wed)
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj', // P4
  'DacjJ93vUDcwqc260OP3', // P5
  'M2MVSXrKuVCD9JQfZZyp', // P7
  'fUw67wFhAtobWFhjwvZ5', // P9
];

const lesson = {
  id: 'ai-storybook-creative',
  title: 'AI Storybook: Creative Writing & Image Generation',
  order: 18,
  visible: false,
  dueDate: '2026-03-25',
  blocks: [
    // --- WARM-UP ---
    { type: 'section_header', id: 'sh-warmup', label: 'Warm-Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Use AI as a creative partner to write and illustrate a short story',
      'Craft specific prompts that guide AI toward your creative vision',
      'Distinguish between AI-assisted creation and AI-generated output',
      'Reflect on ownership and ethics of AI-created content',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You\'ve seen AI generate images and music. Today you become the creative director. What\'s the difference between asking AI to "make something" vs. guiding AI to help you create YOUR vision?' },

    // --- FROM BLANK PAGE TO STORY ---
    { type: 'section_header', id: 'sh-writing', label: 'From Blank Page to Story' },
    { type: 'text', id: id(), content: `Every creative project starts somewhere. A blank page, a half-formed idea, a "what if." AI can help you get from that spark to a finished product — but only if you stay in the driver's seat.\n\n**AI as brainstorm partner, not author.** The best use of AI in creative writing is the same as the best use of a writing partner: bouncing ideas, exploring directions, getting unstuck. The human provides the theme, tone, audience, and creative direction. The AI provides speed, variations, and raw material to refine.\n\n**What the human brings:**\n- The idea — what the story is about and why it matters\n- The voice — tone, style, emotional register\n- The audience — who is this for?\n- Creative judgment — what to keep, what to cut, what to push further\n\n**What the AI brings:**\n- Speed — drafts in seconds, not hours\n- Variations — "try it darker," "make the ending ambiguous," "add a twist"\n- Raw material — a starting point you can shape, not a finished product\n\n**The ethical line is clear.** AI-assisted writing — where you direct, curate, and refine — is ethical. AI-generated writing — where you paste the output and submit it as your own with no creative input — is not. Today, you\'re doing the first one.\n\nThe tool you\'ll use is Google\'s **Gemini Storybook Gem**. You give Gemini your creative direction — genre, characters, setting, mood — and it writes the story AND generates illustrations. But here\'s the key: you iterate. You push back. You ask for changes. The AI drafts; you direct.` },

    // --- STORYBOOK GEM INSTRUCTIONS ---
    { type: 'callout', id: id(), variant: 'info', content: `**How to use the Gemini Storybook Gem:**\n\n1. Click the link below to open the Storybook Gem\n2. Sign in with your Google account\n3. Tell Gemini what kind of story you want — genre, characters, setting, mood\n4. Gemini will write the story AND generate illustrations for each page\n5. Iterate: ask for changes, different art styles, revised scenes, new endings\n6. Your goal: create a short illustrated story (4–6 pages) that reflects YOUR creative vision\n\n**Be specific.** "Write me a story" will get you generic output. "Write a suspense story set in a high school where the main character discovers their teacher is a time traveler — dark humor, short chapters, twist ending" will get you something worth refining.` },

    // --- EXTERNAL LINK ---
    { type: 'external_link', id: 'ext-storybook-gem',
      icon: '📖',
      title: 'Gemini Storybook Gem',
      url: 'https://gemini.google.com/gem/storybook',
      description: 'Open the Gemini Storybook Gem to create your AI-illustrated story',
      buttonLabel: 'Open Storybook',
      openInNewTab: true },

    // --- REFLECTION QUESTIONS ---
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What was your creative vision for your story? Describe the theme, mood, and audience you chose — and why.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Show an example of how you directed the AI. Paste one prompt where you asked Gemini to change something specific about the story or illustrations. What did you ask for and what did you get back?' },

    // --- IMAGE GENERATION ---
    { type: 'section_header', id: 'sh-image-gen', label: 'Image Generation' },
    { type: 'text', id: id(), content: `The Storybook Gem generates images automatically as part of your story — but AI image generation is a skill worth practicing on its own.\n\n**Good prompts are specific.** They include subject, style, mood, and composition:\n- "A watercolor painting of a lonely lighthouse on a rocky cliff during a thunderstorm, dramatic lighting, muted blues and grays"\n- "A pixel-art scene of a bustling futuristic marketplace with neon signs and alien vendors, top-down perspective"\n\n**Bad prompts are vague:**\n- "A cool picture"\n- "Something interesting"\n\n**Iteration is key.** Your first prompt is a starting point. Look at what the AI gives you and refine: "Make the sky darker," "Add more detail to the foreground," "Switch to a comic book style." Each round gets you closer to your vision.\n\nUse the tool below to experiment with standalone image generation. Try different styles, subjects, and levels of detail. See how specific vs. vague prompts change the output.` },

    // --- IMAGE GEN TOOL ---
    { id: 'image-gen-studio', type: 'image_gen', scored: false },

    // --- IMAGE PROMPT REFLECTION ---
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Compare two of your generated images — one from an early prompt and one from a refined prompt. What did you change in the prompt, and how did the output improve?' },

    // --- ETHICS CHECK ---
    { type: 'section_header', id: 'sh-ethics', label: 'The Ethics Check' },
    { type: 'callout', id: id(), variant: 'warning', content: `**Think about what you just did.**\n\nYou created a story and illustrations using AI. But who owns it?\n\n- If Gemini wrote the words, is the story yours?\n- If the AI generated illustrations trained on real artists\' work, who deserves credit?\n- Does it matter how much you directed the process vs. how much you accepted the default output?\n\nThere\'s no easy answer — and that\'s the point. Tomorrow we\'ll dig into the legal and ethical debate around AI-generated art and who really owns it.` },

    // --- FINAL REFLECTION ---
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You spent today creating with AI. In one honest sentence: how much of the final product was YOUR creative vision vs. the AI\'s output?' },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
    const snap = await ref.get();
    if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
    await ref.set(lesson);
    console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
