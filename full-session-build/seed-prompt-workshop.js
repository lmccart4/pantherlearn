// seed-prompt-workshop.js
// Run from your pantherlearn directory: node seed-prompt-workshop.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const lesson = {
  title: "Prompt Engineering Workshop: Speak AI",
  course: "Foundations of Generative AI",
  unit: "Lesson 13",
  order: 12,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "b1",
      type: "text",
      content: "Try this experiment right now. Open any AI chatbot and type:\n\n**\"Tell me about space.\"**\n\nNow try:\n\n**\"List 3 surprising facts about Saturn's rings that most people don't know. Format each as a numbered item with a bold title followed by a 1-sentence explanation.\"**\n\nSame topic. Wildly different results. The second prompt is **engineered**."
    },
    {
      id: "b2",
      type: "question",
      questionType: "short_answer",
      prompt: "What was different about the two responses you got? Why do you think being more specific changed the output so dramatically?",
      placeholder: "The first response was... but the second one was... because..."
    },
    {
      id: "b3",
      type: "definition",
      term: "Prompt Engineering",
      definition: "The skill of crafting instructions (prompts) that reliably produce the desired output from an AI system. It involves being specific about format, content, audience, constraints, and thinking process."
    },
    {
      id: "b4",
      type: "callout",
      icon: "💡",
      style: "insight",
      content: "**Why does this matter?** Think back to what you learned about attention and token prediction. The AI picks the most likely next token based on YOUR words. Better words = better predictions = better output. Prompt engineering is how you steer the attention mechanism."
    },
    {
      id: "section-main",
      type: "section_header",
      title: "Main Activity: Prompt Engineering Workshop",
      subtitle: "~25 minutes",
      icon: "📚"
    },
    {
      id: "b5",
      type: "text",
      content: "In this workshop, you'll tackle 9 challenges across 3 levels:\n\n**Level 1 — Foundations:** Control what the AI says, how it's formatted, and who it's speaking to.\n**Level 2 — Advanced:** Assign roles, set constraints, and define boundaries.\n**Level 3 — Expert:** Chain-of-thought reasoning, few-shot learning, and designing AI behavior.\n\nEach challenge shows you a BAD prompt and explains why it fails. Then you write a BETTER one and test it live. An AI judge evaluates whether your prompt achieved the goal."
    },
    {
      id: "b6",
      type: "embed",
      url: "https://prompt-workshop.web.app/?studentId={{studentId}}&courseId={{courseId}}&blockId=b6&lessonId=lesson-13-prompt-workshop",
      caption: "Prompt Engineering Workshop — 9 challenges across 3 difficulty levels",
      height: 750
    },
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Socratic Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "b7",
      type: "question",
      questionType: "short_answer",
      prompt: "Which prompting technique from the workshop do you think will be MOST useful to you personally? Give a specific example of when you'd use it.",
      placeholder: "The technique I'd use most is... because in my life I often need to..."
    },
    {
      id: "b8",
      type: "question",
      questionType: "short_answer",
      prompt: "In the Hallucination Lab, you learned that AI can confidently state false information. How does prompt engineering help REDUCE the risk of hallucinations? Think about chain-of-thought and specificity.",
      placeholder: "Prompt engineering helps because..."
    },
    {
      id: "b9",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student writes this prompt: 'Write about climate change.' Which technique would improve it the MOST?",
      options: [
        "Adding more words to make it longer",
        "Specifying the audience, format, length, and what aspect of climate change to focus on",
        "Saying 'please' and 'thank you' to the AI",
        "Asking the AI to be more creative"
      ],
      correctIndex: 1,
      explanation: "Specificity is the most impactful improvement. Defining the audience (who's reading it?), format (essay? list? table?), length (how many words?), and focus (causes? solutions? specific region?) transforms a vague request into an engineered prompt."
    },
    {
      id: "b10",
      type: "vocab_list",
      title: "Key Vocabulary",
      terms: [
        { term: "Prompt Engineering", definition: "The skill of crafting AI instructions that reliably produce desired outputs through specificity, formatting, constraints, and reasoning techniques." },
        { term: "Few-Shot Prompting", definition: "Teaching the AI a pattern by providing 2-3 examples before the actual task. The AI learns the pattern from the examples." },
        { term: "Chain-of-Thought", definition: "Asking the AI to 'think step by step' to improve accuracy on complex reasoning and math problems." },
        { term: "System Prompt", definition: "Instructions that define the AI's behavior, personality, and rules before a conversation begins." },
        { term: "Negative Constraint", definition: "Telling the AI what NOT to do — often more effective than only saying what to do." }
      ]
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "PERIOD_4_COURSE_ID", lessonId: "lesson-13-prompt-workshop" },
    { courseId: "PERIOD_5_COURSE_ID", lessonId: "lesson-13-prompt-workshop" },
    { courseId: "PERIOD_7_COURSE_ID", lessonId: "lesson-13-prompt-workshop" },
  ];
  for (const { courseId, lessonId } of courses) {
    await setDoc(doc(db, "courses", courseId, "lessons", lessonId), lesson);
    console.log(`✅ Seeded Prompt Workshop for course ${courseId}`);
  }
  console.log('\n📊 Activity Registry Entry:');
  console.log(JSON.stringify({
    id: "prompt-workshop",
    title: "Prompt Engineering Workshop",
    icon: "🧪",
    collection: "prompt_workshop",
    url: "https://prompt-workshop.web.app",
    course: "ai-literacy",
    maxScore: 100,
  }, null, 2));
  process.exit(0);
}

seed().catch(err => { console.error('❌ Error:', err); process.exit(1); });
