// seed-lesson.js
// Run this from your pantherlearn-app directory: node seed-lesson.js
// Make sure firebase.jsx has your config and you've done npm install

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ⬇️ PASTE YOUR FIREBASE CONFIG HERE ⬇️
const firebaseConfig = {
  apiKey: "AIzaSyAlxvGxLIBUrVO3WWmEcslFpSygeYVeHpY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "293205883325",
  appId: "1:293205883325:web:c0c21ece0b4fc26f673ad4",
  measurementId: "G-5Y6BKF09HF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const lesson = {
  title: "Talking to Machines",
  course: "Problem Solving with AI",
  unit: "Lesson 1",
  order: 0,
  blocks: [
    // --- WARM UP ---
    { id: "section-warmup", type: "section_header", title: "Warm Up", subtitle: "~10 minutes", icon: "🔥" },
    { id: "b1", type: "text", content: "Before we dive into AI, let's play a quick improv game that will help us understand how AI actually works." },
    {
      id: "b2", type: "activity", title: "Yes, And…", icon: "🎭",
      instructions: "Start with this sentence:\n\n**\"A mysterious talking cat started showing up to math class.\"**\n\nIn your group, take turns building on the story. Each person must start their sentence with **\"Yes, and…\"**\n\nFor example:\n• Opening: \"A mysterious talking cat started showing up to math class.\"\n• Student 1: \"Yes, and he said his name is Whiskers.\"\n• Student 2: \"Yes, and he happens to be very good at multiplication.\"\n• Student 1: \"Yes, and he has a sister who started showing up to English class.\""
    },
    { id: "b3", type: "question", questionType: "short_answer", prompt: "Summarize the story your group came up with. What were the last two sentences of your conversation?" },
    {
      id: "b4", type: "callout", style: "insight", icon: "💡",
      content: "Every group started with the same sentence — but probably ended up with very different stories. This is actually how generative AI works. AI is like a **\"Yes, and…\" machine**. It builds on existing text by finding a word or phrase that would make sense to come next."
    },
    // --- OBJECTIVES ---
    {
      id: "b5", type: "objectives", title: "Lesson Objectives",
      items: [
        "Explain that AI models use probability and statistics to generate responses",
        "Experiment with different prompts to observe how AI's responses change",
        "Analyze patterns in AI-generated responses to explain how input prompts influence outputs",
        "Refine AI-generated outputs by iterating on prompts and recognizing patterns"
      ]
    },
    { id: "b5b", type: "callout", style: "question", icon: "❓", content: "**Question of the Day:** How can I use AI effectively?" },
    // --- ACTIVITY: AI PREDICTIONS ---
    { id: "section-activity", type: "section_header", title: "Activity: AI Predictions", subtitle: "~10 minutes", icon: "🤖" },
    { id: "b6", type: "video", url: "https://www.youtube.com/embed/nOCCpSCCMlk", caption: "Watch: Problem Solving with AI" },
    { id: "b7", type: "definition", term: "Artificial Intelligence (AI)", definition: "A technology that mimics human intelligence, performing tasks such as understanding language, recognizing patterns, and making decisions." },
    {
      id: "b8", type: "text",
      content: "Let's think about how AI generates text. Consider this sentence:\n\n**\"The dog barked at the…\"**\n\nWhat word do you think comes next? Most people predict common words like *squirrel*, *mailman*, or *stranger*. AI does something very similar — it looks at patterns in millions of sentences and picks the word that is **most likely** to come next.\n\nLet's try it! Use the AI chat below to ask the AI to complete the sentence."
    },
    // --- CHATBOT: Next word prediction ---
    {
      id: "chat1", type: "chatbot",
      title: "AI Predictions Lab",
      icon: "🔮",
      instructions: "Ask the AI to generate the next word in the sentence: **\"The dog barked at the…\"** Then try asking it several more times. Do you get the same answer? Try other sentence starters too!",
      systemPrompt: "You are a simple AI assistant being used in a classroom lesson about how AI predicts the next word in a sentence. When a student gives you an incomplete sentence, complete it naturally with just a few words — keep responses short (1-2 sentences max). If they ask you to complete 'The dog barked at the...' just naturally finish the sentence. Be friendly and encourage them to try different sentence starters. Keep all responses brief and age-appropriate for high school students.",
      starterMessage: "Hi! I'm ready to help complete sentences. Try giving me an incomplete sentence like \"The dog barked at the...\" and I'll predict what comes next!",
      placeholder: "Type a sentence for the AI to complete..."
    },
    {
      id: "b9", type: "question", questionType: "multiple_choice",
      prompt: "You typed \"The dog barked at the…\" into the AI chat. Which BEST describes how the AI chose its response?",
      options: [
        "It understood the scene and imagined a dog barking",
        "It used probability to predict the most likely next word based on patterns",
        "It randomly picked a word from a dictionary",
        "It asked a human behind the scenes for the answer"
      ],
      correctIndex: 1,
      explanation: "AI uses probability to predict the most likely next words. Based on patterns in language, it picks words that commonly follow the given phrase."
    },
    { id: "b10", type: "definition", term: "Probability", definition: "The likelihood that a specific outcome might occur. AI uses probability to determine which word or phrase is most likely to come next in a sequence." },
    {
      id: "b11", type: "text",
      content: "When probability-driven predictions work well, AI can complete sentences in ways that feel natural and helpful:\n\n• \"He heard a knock at the…\" → **door**\n• \"Thank…\" → **you for your help**\n• \"As the bell rang, they put down their…\" → **pencils**\n\nAI uses the computational skill of **pattern recognition** — it reads over thousands of sentences containing these phrases and starts to recognize what typically comes next."
    },
    {
      id: "b12", type: "question", questionType: "multiple_choice",
      prompt: "AI predicts the next word in a sentence by:",
      options: ["Understanding the deep meaning of every word", "Recognizing patterns in large amounts of text data", "Asking a human for the answer behind the scenes", "Randomly selecting words from a dictionary"],
      correctIndex: 1,
      explanation: "AI doesn't truly understand meaning — it recognizes statistical patterns in text. By analyzing massive amounts of text data, it learns which words commonly follow other words."
    },
    // --- FAILED PREDICTIONS ---
    { id: "b13", type: "callout", style: "warning", icon: "⚠️", content: "**But probability-driven predictions can fail.** Because AI doesn't truly understand *meaning*, it can misinterpret what you're asking for." },
    {
      id: "b14", type: "text",
      content: "Imagine asking an AI image generator to **draw \"the keys are on the table.\"**\n\nThe AI might focus on the individual words — *keys*, *on*, *table* — and draw a single key sitting literally on top of a table. It **abstracts away** the context and meaning of the sentence, focusing only on the most essential details it can identify."
    },
    { id: "b15", type: "definition", term: "Abstraction", definition: "The process of focusing on only the essential details of a problem and ignoring everything else. AI uses abstraction when processing your input, which is why it sometimes misses important context." },
    {
      id: "b16", type: "question", questionType: "multiple_choice",
      prompt: "An AI image generator is asked to draw \"the keys are on the table\" and produces an image of a single key balanced on a table. What BEST explains this result?",
      options: ["The AI is broken and needs to be fixed", "The AI abstracted the key details but missed the real-world meaning", "The AI understood the sentence perfectly", "The AI was trying to be creative with its interpretation"],
      correctIndex: 1,
      explanation: "The AI focused on the literal words (keys, on, table) through abstraction but didn't understand the real-world meaning — that keys are usually a set of keys placed casually on a table, not balanced on top."
    },
    // --- ACTIVITY: PROMPTING ---
    { id: "section-prompting", type: "section_header", title: "Activity: Prompting AI", subtitle: "~20 minutes", icon: "💬" },
    { id: "b17", type: "definition", term: "Prompt", definition: "A question, instruction, scenario, or statement provided by the user to guide the AI's response. The quality of your prompt directly affects the quality of AI's output." },
    {
      id: "b18", type: "text",
      content: "Since AI relies on patterns and probability rather than true understanding, **the way you ask matters**. A vague prompt gives AI very little to work with. A specific, detailed prompt helps AI narrow down the most relevant patterns and give you a better response.\n\nLet's experiment! Use the chatbot below to try vague vs. specific prompts."
    },
    // --- CHATBOT: Prompt Experiment ---
    {
      id: "chat2", type: "chatbot",
      title: "Prompt Experiment Lab",
      icon: "🧪",
      instructions: "Try these three levels of prompting:\n\n**Level 1:** Start vague — type \"Give me 3 gift ideas\"\n**Level 2:** Now be specific — add who it's for, their interests, your budget, the occasion\n**Level 3:** Try being even more detailed — add constraints or preferences\n\nNotice how the responses change!",
      systemPrompt: "You are a helpful AI assistant being used in a classroom lesson about prompt engineering. Students will start with vague prompts and refine them to be more specific. Respond naturally to whatever they ask. When they give vague prompts, give generic answers. When they give specific prompts, give much more tailored and useful answers. This contrast will help them learn about prompting. Keep responses concise (3-5 sentences). Be friendly and age-appropriate for high school students. Do not discuss anything inappropriate or off-topic from the lesson.",
      starterMessage: "Ready for the experiment! Start with a simple, vague prompt like \"Give me 3 gift ideas\" — then we'll see how my answers improve when you add more detail.",
      placeholder: "Try a vague prompt first, then make it more specific..."
    },
    {
      id: "b20", type: "question", questionType: "multiple_choice",
      prompt: "Which prompt would MOST LIKELY produce the most useful AI response?",
      options: [
        "\"Help me with my project\"",
        "\"Help me create a 5-slide presentation about ocean pollution for my 9th grade science class, including at least 2 statistics\"",
        "\"Make something about the ocean\"",
        "\"Presentation please\""
      ],
      correctIndex: 1,
      explanation: "The second prompt is specific about the format (5-slide presentation), topic (ocean pollution), audience (9th grade science), and requirements (2 statistics). This gives AI clear patterns to work with."
    },
    // --- CHATBOT: Prompting Practice ---
    {
      id: "chat3", type: "chatbot",
      title: "Prompting Practice — Choose Your Challenge",
      icon: "🎯",
      instructions: "Choose ONE task and practice prompting. Start generic, then get specific. Interact in at least **3 back-and-forth exchanges**.\n\n**A:** Plan a study schedule\n**B:** Brainstorm a creative writing piece\n**C:** Prepare for a class presentation\n**D (Challenge):** Debate AI on a topic of your choice",
      systemPrompt: "You are a helpful AI assistant in a high school classroom lesson about prompt engineering. Students will choose one of four tasks: (A) planning a study schedule, (B) brainstorming creative writing, (C) preparing for a class presentation, or (D) debating a topic. Help them with whichever they choose. The goal is for them to practice refining their prompts over multiple exchanges. Keep responses helpful but concise (3-6 sentences). Be encouraging about their prompting improvements. For debate option D, take an opposing position respectfully and encourage them to refine their arguments. Stay age-appropriate and on-topic.",
      starterMessage: "Choose your challenge!\n\n🅰️ Study schedule planning\n🅱️ Creative writing brainstorm\n🅲️ Presentation prep\n🅳️ Debate challenge\n\nPick one and start with your first prompt. Remember — start general, then get more specific!",
      placeholder: "Choose a challenge and start prompting..."
    },
    {
      id: "b22", type: "question", questionType: "short_answer",
      prompt: "Which challenge option did you choose? Describe how your AI conversation changed as you made your prompts more specific. What details did you add that made the biggest difference?"
    },
    // --- CHECK FOR UNDERSTANDING ---
    { id: "section-check", type: "section_header", title: "Check Your Understanding", subtitle: "", icon: "✅" },
    {
      id: "b23", type: "question", questionType: "multiple_choice",
      prompt: "Which of the following BEST describes how AI generates text responses?",
      options: [
        "AI understands language the same way humans do and crafts thoughtful replies",
        "AI uses probability to predict the most likely next word based on patterns in data",
        "AI copies and pastes answers from a database of pre-written responses",
        "AI randomly generates words and checks if they make sense"
      ],
      correctIndex: 1,
      explanation: "AI uses statistical patterns learned from massive amounts of text to predict the most probable next word in a sequence. It doesn't truly understand meaning — it's using probability."
    },
    {
      id: "b24", type: "question", questionType: "multiple_choice",
      prompt: "A student gives AI the prompt: \"Tell me about history.\" The AI responds with a very long, unfocused paragraph about many different time periods. What should the student do to get a better response?",
      options: [
        "Ask the same question again and hope for a better answer",
        "Give up and search Google instead",
        "Refine the prompt to be more specific, like \"Summarize the key causes of World War I in 3 bullet points\"",
        "Type the prompt in all capital letters so AI pays more attention"
      ],
      correctIndex: 2,
      explanation: "Refining your prompt with specific details (topic, format, length) helps AI narrow down its response. Being specific is the most effective prompting strategy."
    },
    {
      id: "b25", type: "question", questionType: "short_answer",
      prompt: "In your own words, explain how AI is like a \"Yes, and…\" improv game. Use the terms probability, patterns, and abstraction in your response."
    },
    // --- WRAP UP ---
    { id: "section-wrap", type: "section_header", title: "Wrap Up", subtitle: "~5 minutes", icon: "🎬" },
    {
      id: "b26", type: "text",
      content: "Today you learned how AI models use **probability** and **pattern recognition** to generate responses. You saw how AI is like a \"Yes, and…\" machine — building on input by predicting the most likely next word. You explored how **abstraction** can cause AI to miss real-world meaning, and you practiced **refining prompts** to get better, more useful outputs."
    },
    { id: "b27", type: "callout", style: "question", icon: "❓", content: "**Return to the Question of the Day:** How can I use AI effectively?\n\nThink about your answer — in a moment you'll share with your group." },
    { id: "b28", type: "question", questionType: "short_answer", prompt: "Rapid Roundtable: In one sentence, answer the Question of the Day — How can I use AI effectively?" },
    // --- VOCABULARY ---
    { id: "section-vocab", type: "section_header", title: "Key Vocabulary", subtitle: "", icon: "📖" },
    {
      id: "b29", type: "vocab_list",
      terms: [
        { term: "Artificial Intelligence (AI)", definition: "A technology that mimics human intelligence, performing tasks such as understanding language, recognizing patterns, and making decisions." },
        { term: "Probability", definition: "The likelihood that a specific outcome might occur." },
        { term: "Abstraction", definition: "The process of focusing on only the essential details of a problem and ignoring everything else." },
        { term: "Prompt", definition: "A question, instruction, scenario, or statement provided by the user to guide the AI's response." }
      ]
    }
  ]
};

async function seed() {
  try {
    // Write the lesson document
    await setDoc(
      doc(db, 'courses', 'ai-literacy', 'lessons', 'talking-to-machines'),
      lesson
    );
    console.log('✅ Lesson "Talking to Machines" seeded successfully!');
    console.log('   Path: courses/ai-literacy/lessons/talking-to-machines');
    console.log('   Blocks:', lesson.blocks.length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
