/**
 * AI Literacy Unit 5, Lesson 3: AI in Art (Copyright Debate)
 * Order: 43 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-in-art',
  title: 'AI in Art: Who Owns the Brushstroke?',
  order: 43,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Understand how AI image generators are trained on human artwork',
      'Analyze the copyright and consent issues raised by AI-generated art',
      'Form an evidence-based opinion on whether AI art is ethical',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If an AI studied your artwork for years and then started making art "in your style" and selling it — without paying you or asking permission — would that be okay? Why or why not?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: How AI Art Actually Works' },
    { type: 'text', id: id(), content: `Tools like Midjourney, DALL-E, and Stable Diffusion can generate stunning images from text prompts. But where does their ability come from?\n\n**Training Data**\nThese models are trained on billions of images scraped from the internet — stock photo sites, art portfolios, social media, museum archives. The AI learns patterns, styles, and visual concepts from this data.\n\n**The Key Issue**\nMost of those images were created by human artists. Those artists were never asked for permission. They were never paid. Many don't even know their work was used.\n\nWhen you prompt an AI to generate "a painting in the style of [artist name]," the AI produces something that reflects that artist's decades of developed skill — without the artist seeing a cent.` },
    { type: 'callout', id: id(), content: '**Real Example:** Artists on ArtStation organized mass protests in 2022 after discovering AI companies had scraped their portfolios without consent. Some artists found their own distinctive styles being replicated and sold by AI tools.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'Why do AI companies argue that training on publicly available images is legal?',
      options: [
        'They paid licensing fees to every artist whose work they used',
        'They claim scraping public web content for training falls under "fair use" doctrine',
        'They only used images that were already in the public domain',
        'Courts have already ruled it is legal',
      ], correctIndex: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: The Copyright Battle' },
    { type: 'text', id: id(), content: `The legal landscape around AI art is in chaos right now. Here's where things stand:\n\n**What artists are arguing:**\n- Training on their work without consent is theft of intellectual property\n- AI companies are profiting from their labor without compensation\n- "Style" should be protected — an artist's visual identity is their livelihood\n\n**What AI companies are arguing:**\n- Humans also "train" on other art — we all learn from what we see\n- Public images on the internet are fair game under fair use\n- No individual image is copied; the AI creates something new\n\n**What the courts are sorting out:**\n- The U.S. Copyright Office ruled in 2023 that purely AI-generated images cannot be copyrighted\n- Multiple lawsuits from artists against Stable Diffusion, Midjourney, and OpenAI are pending\n- The outcome will shape the creative economy for decades` },
    { type: 'callout', id: id(), variant: 'info', content: '**The Human Twist:** Some AI art has won competitions. In 2022, Jason Allen won the Colorado State Fair fine art competition with an AI-generated image. Other artists were furious. Allen argued he still made creative decisions as the "prompter." Who do you agree with?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'One argument is that humans also learn from other artists — so AI learning from art is no different. Do you think this is a valid comparison? What\'s the same and what\'s different?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Your Take' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Should AI companies be required to compensate artists whose work was used to train their models? Design a fair system — what would it look like?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Is AI-generated art "real" art? Does the answer matter — and to whom?' },
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
