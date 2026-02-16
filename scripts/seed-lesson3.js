// seed-lesson3.js
// Run from your pantherlearn-app directory: node seed-lesson3.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
  title: "Inputs & Training Data",
  course: "Problem Solving with AI",
  unit: "Lesson 3",
  order: 2,
  blocks: [

    // =========================================================
    // WARM UP (~10 minutes)
    // =========================================================
    { id: "section-warmup", type: "section_header", title: "Warm Up", subtitle: "~10 minutes", icon: "🔥" },

    {
      id: "b1", type: "text",
      content: "In the last lesson, you tested an AI chatbot on different newsroom tasks and discovered that AI has real **strengths** (structured writing, following patterns) and real **limitations** (factual accuracy, creativity, local knowledge).\n\nBut here's a deeper question: **How does AI know any words at all?** Where does all that language come from?"
    },

    {
      id: "b2", type: "callout", style: "scenario", icon: "🎲",
      content: "**Scrabble Challenge:** In the board game Scrabble, you score points by creating words from random letters. Calvin (from Calvin and Hobbes) once tried to play \"ZQFMGB\" and claimed it was a real word — a worm found in New Guinea!\n\nThe question is: How do *you* decide what counts as a real word? And how would a *computer* decide?"
    },

    {
      id: "b3", type: "text",
      content: "Look at the list below. Sort them in your head — which are **real words** and which are **not words**?\n\n1. banana\n2. aka7sj23ksw\n3. cherimoya\n4. wierd\n5. reykjavik\n6. shirt\n7. @&!*@^#\n8. ullaakkut\n9. ATM\n10. yá'át'ééh"
    },

    {
      id: "b4", type: "question", questionType: "short_answer",
      prompt: "Which items from the list did you classify as 'words' and which as 'not words'? Was it easy to decide for all of them? Which ones were tricky, and why?"
    },

    {
      id: "b5", type: "text",
      content: "**Here's the twist:** Most of these are actually real words!\n\n- **cherimoya** = a tropical fruit\n- **reykjavik** = the capital of Iceland\n- **ullaakkut** = \"good morning\" in Inuktitut (an Inuit language)\n- **yá'át'ééh** = \"hello\" in Navajo\n- **ATM** = an acronym (Automated Teller Machine)\n- **wierd** = a common misspelling, but still shows up in text data\n\nThe only clear non-words are **aka7sj23ksw** (random characters) and **@&!*@^#** (symbols).\n\nIf it was hard for *you* to decide, imagine how hard it is for a computer! A computer doesn't \"know\" any words — it has to **learn** them from data."
    },

    {
      id: "b6", type: "callout", style: "question", icon: "❓",
      content: "**Question of the Day:** How does a computer recognize words used in language?\n\nKeep this question in mind as you work through today's activities."
    },

    // =========================================================
    // ACTIVITY: TOKENIZATION DEMO (~5 minutes)
    // =========================================================
    { id: "section-tokens", type: "section_header", title: "Activity: How AI Reads Text", subtitle: "~5 minutes", icon: "🔤" },

    {
      id: "b7", type: "text",
      content: "Before AI can do anything with your words, it first has to **break your text into pieces** it can process. This is called **tokenization**.\n\nLet's see how this works with an example prompt:\n\n`What is a recipe for cooking chili? Make sure it isn't spicy!`"
    },

    {
      id: "b8", type: "text",
      content: "**Step 1 — Word-level tokens:**\nThe AI first splits the text by spaces:\n\n| What | is | a | recipe | for | cooking | chili? | Make | sure | it | isn't | spicy! |\n\n**Step 2 — Sub-word tokens:**\nBut AI models actually break words down even further into **sub-word tokens**:\n\n| What | is | a | recipe | for | cook | ing | chili | ? | Make | sure | it | is | n't | spicy | ! |\n\nNotice how \"cooking\" became \"cook\" + \"ing\" and \"isn't\" became \"is\" + \"n't\". Punctuation also gets its own token. This is how the AI can handle words it's never seen before — by recognizing familiar **pieces** of words."
    },

    {
      id: "b9", type: "question", questionType: "multiple_choice",
      prompt: "Why do AI models break words into sub-word pieces (like 'cook' + 'ing') instead of keeping whole words?",
      options: [
        "It makes the text shorter",
        "It helps the model handle new or unfamiliar words by recognizing common word parts",
        "It removes unnecessary words from the sentence",
        "It translates the words into a different language"
      ],
      correctAnswer: 1,
      explanation: "By breaking words into common sub-word pieces, the model can understand words it hasn't seen before. For example, even if it never saw 'overcooking,' it knows 'over,' 'cook,' and 'ing' separately."
    },

    // =========================================================
    // ACTIVITY: CURATING TRAINING DATA (~20 minutes)
    // =========================================================
    { id: "section-activity", type: "section_header", title: "Activity: Curating Training Data", subtitle: "~20 minutes", icon: "📚" },

    {
      id: "b10", type: "text",
      content: "Now that you know AI breaks text into tokens, here's the big question: **Where does AI get all the text it learns from?**\n\nYou are now responsible for **training a new large language model** to represent language. This requires large amounts of data that it can use to recognize important words and phrases.\n\nYour task is to **curate language data from your daily life** so the language model can answer questions about the world around you."
    },

    {
      id: "b11", type: "text",
      content: "**Example:** Think about a city bus stop. What text could an AI find there?\n\n- Street signs → \"2nd St,\" \"Cherry\"\n- Bus ads → \"Broadway Village,\" \"Foothills Mall\"\n- Stop sign → \"STOP\"\n- Schedule board → route numbers, times, destinations\n\nAll of this text is **data** that could help an AI learn words and phrases about transportation, geography, and daily life."
    },

    {
      id: "b12", type: "question", questionType: "short_answer",
      prompt: "Think about YOUR CLASSROOM right now. What are 3 data sources (things with text on them) that an AI could learn words from? For each source, list 2–3 words the AI would learn."
    },

    {
      id: "b13", type: "question", questionType: "short_answer",
      prompt: "Now think about YOUR HOME. What are 3 data sources an AI could learn words from at your house? (Think: magazines, instruction manuals, food packaging, mail, posters, etc.) For each source, list 2–3 words."
    },

    // --- Chatbot: Build a word cloud ---
    {
      id: "chat1", type: "chatbot",
      title: "🤖 Training Data Explorer",
      systemPrompt: "You are a friendly AI assistant helping a high school student understand training data for language models. The student has been thinking about what data sources exist in their daily life (classroom, home, bus stops, etc.) and what words an AI could learn from them. Help them explore this topic. When they share data sources and words, affirm their thinking and push them to think about what types of knowledge those words represent (everyday vocabulary, specialized terms, brand names, etc.). Ask follow-up questions like 'What kind of questions could an AI answer if it learned those words?' Keep responses under 150 words. Be encouraging and conversational.",
      starterMessage: "Hey! So you've been thinking about all the text data around you. What data sources did you come up with? I'm curious what words you found!"
    },

    {
      id: "b14", type: "text",
      content: "**Group Discussion:** Now let's think bigger. If we wanted our language model to handle specific **real-world tasks**, we'd need to make sure it was trained on the right data.\n\nFor each task below, think about what **data sources** would be needed to teach an AI the right words and knowledge."
    },

    // --- Task-specific data source questions ---
    {
      id: "b15", type: "question", questionType: "short_answer",
      prompt: "What data sources should we use to make sure our model can... GIVE A RECIPE AND STEPS FOR MAKING CHILI?\n\n(Think: Where would a computer find text about cooking? What kind of documents contain recipe words like 'simmer,' 'tablespoon,' and 'cumin'?)"
    },

    {
      id: "b16", type: "question", questionType: "short_answer",
      prompt: "What data sources should we use to make sure our model can... RECOMMEND PLACES TO HIKE IN THE SOUTHWEST?\n\n(Think: What websites, books, or documents contain words about trails, national parks, and desert landscapes?)"
    },

    {
      id: "b17", type: "question", questionType: "short_answer",
      prompt: "What data sources should we use to make sure our model can... HELP WITH YOUR MATH HOMEWORK?\n\n(Think: Where would a computer find text about equations, formulas, and step-by-step problem solving?)"
    },

    {
      id: "b18", type: "question", questionType: "short_answer",
      prompt: "What data sources should we use to make sure our model can... GIVE RELATIONSHIP ADVICE?\n\n(Think: This is a tricky one! Where would an AI find text about emotions, communication, and human relationships? What are the risks of learning from certain sources?)"
    },

    // --- Key insight ---
    {
      id: "b19", type: "callout", style: "insight", icon: "💡",
      content: "**Key Insight:** No matter how many data sources we find, there are always **limits** to what a model can learn. The internet is the most common data source for LLMs because it has the largest amount of text — but even the internet doesn't represent all languages, cultures, or types of knowledge equally."
    },

    {
      id: "b20", type: "question", questionType: "short_answer",
      prompt: "If we wanted our model to know the LARGEST number of words possible, what do you think is the best data source to use? Why? And what might still be missing from that source?"
    },

    // =========================================================
    // ETHICAL CHECKPOINT (~5 minutes)
    // =========================================================
    { id: "section-ethics", type: "section_header", title: "Ethical Checkpoint", subtitle: "~5 minutes", icon: "⚖️" },

    {
      id: "b21", type: "text",
      content: "Let's pause and think critically about training data. The data we feed into an AI shapes **everything** it can and can't do."
    },

    {
      id: "b22", type: "question", questionType: "multiple_choice",
      prompt: "If an AI was mostly trained on English-language websites, what would likely happen when someone asks it a question in Navajo?",
      options: [
        "It would answer perfectly because it learned 'yá'át'ééh' from the warm-up",
        "It would struggle because its training data doesn't include much Navajo text",
        "It would automatically translate the question into English first",
        "It wouldn't be able to read the input at all"
      ],
      correctAnswer: 1,
      explanation: "AI models can only work well with languages and topics that were well-represented in their training data. If very little Navajo text was included, the model would struggle with that language — even though Navajo is a real, living language spoken by over 170,000 people."
    },

    {
      id: "b23", type: "question", questionType: "multiple_choice",
      prompt: "What is the BIGGEST risk of using internet data to train a language model?",
      options: [
        "The internet has too much text for a computer to process",
        "Internet data is always accurate and reliable",
        "Internet data may contain biases, misinformation, or underrepresent certain groups",
        "Internet data only contains formal, academic language"
      ],
      correctAnswer: 2,
      explanation: "The internet reflects human biases — some communities, languages, and perspectives are overrepresented while others are underrepresented. This means AI trained on internet data can inherit and amplify those same biases."
    },

    {
      id: "b24", type: "question", questionType: "short_answer",
      prompt: "Think about the word-sorting activity from the warm-up. The words 'ullaakkut' (Inuktitut) and 'yá'át'ééh' (Navajo) are real words — but many people didn't recognize them. How does this connect to the problem of training data? What happens when certain languages or cultures are underrepresented in AI training data?"
    },

    // =========================================================
    // WRAP UP (~5 minutes)
    // =========================================================
    { id: "section-wrapup", type: "section_header", title: "Wrap Up", subtitle: "~5 minutes", icon: "🏁" },

    {
      id: "b25", type: "text",
      content: "**Video: Input & Pretraining**\n\nWatch the Code.org concept video on Input & Pretraining.\n\n**Focus Question:** What is the pre-training stage of a language model?"
    },

    {
      id: "b26", type: "question", questionType: "short_answer",
      prompt: "After watching the video — What is the 'pre-training' stage of a language model? Describe it in your own words."
    },

    {
      id: "b27", type: "text",
      content: "**Key Takeaways:**\n\n- AI models learn language from **training data** — large collections of text from books, websites, articles, and more.\n- Before processing text, AI **tokenizes** it — breaking words into smaller pieces called tokens.\n- The **quality and diversity** of training data determines what an AI can and can't do well.\n- If a language, culture, or topic is **underrepresented** in the training data, the AI will struggle with it.\n- The internet is the largest data source for LLMs, but it doesn't represent all human knowledge equally."
    },

    {
      id: "b28", type: "callout", style: "question", icon: "❓",
      content: "**Return to the Question of the Day:** How does a computer recognize words used in language?\n\nNow you know: Computers recognize words by being trained on massive amounts of text data. They break text into **tokens** (sub-word pieces), learn **patterns** in how those tokens appear together, and build a statistical model of language. But they can only recognize what was in their training data."
    },

    {
      id: "b29", type: "question", questionType: "short_answer",
      prompt: "Journal Prompt: Update your understanding of the 'Input' stage of generative AI. What goes INTO a language model before it can generate any output? How does the choice of training data affect what the model can do?"
    },

    // =========================================================
    // VOCABULARY
    // =========================================================
    { id: "section-vocab", type: "section_header", title: "Vocabulary", subtitle: "", icon: "📖" },

    {
      id: "vocab", type: "vocab_list",
      terms: [
        { term: "Training Data", definition: "The large collection of text (books, websites, articles, code, etc.) that is fed into a language model so it can learn patterns in language." },
        { term: "Tokenization", definition: "The process of breaking text into smaller pieces (tokens) that a language model can process. Tokens can be words, sub-words, or individual characters." },
        { term: "Token", definition: "A single piece of text that a language model processes. Tokens can be whole words ('banana'), word parts ('cook' + 'ing'), or punctuation ('!')." },
        { term: "Pre-training", definition: "The first stage of building a language model, where it learns general language patterns from a massive dataset before being fine-tuned for specific tasks." },
        { term: "Data Curation", definition: "The process of selecting, organizing, and preparing data that will be used to train an AI model." },
        { term: "Bias (in AI)", definition: "When an AI system produces unfair or skewed results because its training data overrepresents some groups or perspectives and underrepresents others." }
      ]
    }
  ]
};

async function seed() {
  try {
    await setDoc(
      doc(db, 'courses', 'ai-literacy', 'lessons', 'inputs-and-training-data'),
      lesson
    );
    console.log('✅ Lesson "Inputs & Training Data" seeded successfully!');
    console.log('   Path: courses/ai-literacy/lessons/inputs-and-training-data');
    console.log('   Blocks:', lesson.blocks.length);
    console.log('   Chatbots: 1 (Training Data Explorer)');
    console.log('   Questions:', lesson.blocks.filter(b => b.type === 'question').length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
