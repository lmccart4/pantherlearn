/**
 * AI Literacy Unit 5, Lesson 4: AI in Climate Science
 * Order: 44 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-in-climate',
  title: 'AI vs. Climate Change: Our Best Tool or a New Problem?',
  order: 44,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Identify ways AI is being used to address climate change',
      'Understand the environmental cost of AI itself',
      'Evaluate the net impact of AI on the climate crisis',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What do you think is the biggest technological challenge in fighting climate change? Where could AI fit in?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: AI as a Climate Tool' },
    { type: 'text', id: id(), content: `Scientists and engineers are deploying AI across the climate fight:\n\n**Weather & Climate Modeling**\nGoogle DeepMind's GraphCast can predict 10-day global weather forecasts in under a minute — faster and often more accurate than traditional models that take hours on supercomputers. Better forecasts help communities prepare for extreme weather.\n\n**Clean Energy Optimization**\nAI manages power grids in real time, balancing solar and wind (which are unpredictable) with demand. Google uses AI to reduce the energy used for cooling its data centers by 40%.\n\n**Deforestation Detection**\nSatellite imagery + AI can detect illegal logging within hours, compared to weeks or months with human analysis. Global Forest Watch uses this to alert rangers in real time.\n\n**Carbon Capture**\nAI accelerates the search for materials that can pull CO₂ out of the atmosphere by screening millions of molecular combinations far faster than human chemists can.` },
    { type: 'callout', id: id(), content: '**Scale:** A 2021 study estimated AI could help reduce global greenhouse gas emissions by 1.5–4% by 2030 — equivalent to eliminating the emissions of Australia.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'Why is AI particularly useful for optimizing renewable energy grids?',
      options: [
        'AI generates its own renewable energy',
        'Solar and wind output fluctuates unpredictably, and AI can balance supply and demand in real time',
        'AI can store energy better than batteries',
        'Traditional computers cannot handle electricity data',
      ], correct: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: AI\'s Own Carbon Problem' },
    { type: 'text', id: id(), content: `Here's the uncomfortable truth: AI has a massive carbon footprint.\n\n**Training Large Models**\nTraining GPT-3 emitted roughly 552 tons of CO₂ — equivalent to driving 120 cars for a year. Newer, larger models are exponentially more expensive.\n\n**Inference at Scale**\nEvery time someone sends a message to an AI chatbot, servers consume power. ChatGPT processes over 10 million queries per day. That adds up fast.\n\n**Water Consumption**\nAI data centers use enormous amounts of water for cooling. Microsoft reported that training GPT-4 consumed roughly 700,000 liters of water.\n\n**The Irony**\nWe might be using a carbon-heavy technology to fight carbon — and the net math isn't always in our favor.` },
    { type: 'callout', id: id(), variant: 'warning', content: '**The Data Center Problem:** By 2030, data centers (which power AI) could consume 8% of global electricity — up from about 2% today. Whether that electricity comes from clean sources matters enormously.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Is it hypocritical to use energy-intensive AI to fight climate change? Or does the math work out if AI saves more than it costs? Explain your thinking.' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: The Net Verdict' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If AI could reduce global emissions by 4% but itself produces 2% of global emissions, is that a good trade? What other factors would you want to know before deciding?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What responsibility do AI companies have to power their data centers with renewable energy? Should this be required by law?' },
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
