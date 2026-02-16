// seed-lesson4.js
// Run from your pantherlearn-app directory: node seed-lesson4.js

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
  title: "Bias in the Machine",
  course: "Problem Solving with AI",
  unit: "Lesson 4",
  order: 3,
  blocks: [

    // =========================================================
    // WARM UP (~10 minutes)
    // =========================================================
    { id: "section-warmup", type: "section_header", title: "Warm Up", subtitle: "~10 minutes", icon: "🔥" },

    {
      id: "b1", type: "text",
      content: "In the last lesson, you learned that AI models learn language from **training data** — massive collections of text. You also saw that the **quality and diversity** of that data determines what an AI can and can't do.\n\nToday, we're going to dig deeper into a critical problem: What happens when training data **isn't balanced**? What happens when certain voices, cultures, or perspectives are overrepresented — or left out entirely?"
    },

    {
      id: "b2", type: "callout", style: "scenario", icon: "✈️",
      content: "**Scenario:** Imagine you're visiting a country where you don't know the language, but you plan to learn it during your stay. You'll be randomly assigned to one of 3 places to stay:\n\n🏨 **A hotel room** with a bakery and restaurant on the ground floor\n🌾 **A barn on a fruit farm** with a shop that repairs farm equipment\n🏢 **An apartment** across from a florist with several young children"
    },

    {
      id: "b3", type: "question", questionType: "short_answer",
      prompt: "As you try to learn the language by listening to conversations around you:\n\n1. What are some words you think you'll learn NO MATTER where you stay?\n2. What are some SPECIALIZED words you'll learn BECAUSE of where you're staying?"
    },

    {
      id: "b4", type: "text",
      content: "**Plot twist:** The travel company has changed their policy — now you can **choose** which place to live."
    },

    {
      id: "b5", type: "question", questionType: "multiple_choice",
      prompt: "Of the three choices, which would you choose to stay at while learning the language?",
      options: [
        "A hotel room with a bakery and restaurant on the ground floor",
        "A barn on a fruit farm with a shop that repairs farm equipment",
        "An apartment across from a florist with several young children"
      ],
      correctAnswer: -1,
      explanation: "There's no wrong answer here! But notice: your CHOICE of where to stay determines what words you learn. This is exactly how bias works in AI — the data you choose to train on shapes what the model knows and doesn't know."
    },

    {
      id: "b6", type: "callout", style: "insight", icon: "💡",
      content: "**Key Connection:** Your choice of where to stay is like choosing training data for an AI. If you only stay at the bakery, you'll learn lots of food words but miss farming vocabulary. If you only stay on the farm, you'll miss restaurant and city language.\n\nThe same thing happens with AI: **the data we choose shapes what the model knows — and what it gets wrong.**"
    },

    {
      id: "b7", type: "callout", style: "question", icon: "❓",
      content: "**Question of the Day:** How do our choices about input data influence a large language model?\n\nKeep this question in mind as you work through today's activities."
    },

    // =========================================================
    // ACTIVITY PART 1: RECIPEBOT DATA CURATION (~10 minutes)
    // =========================================================
    { id: "section-activity1", type: "section_header", title: "Activity: RecipeBot Data Curation", subtitle: "~10 minutes", icon: "🤖" },

    {
      id: "b8", type: "text",
      content: "We've been hired to help create a brand new language model called **RecipeBot**. This chatbot will help people discover new recipes or suggest different types of cuisines based on people's preferences.\n\nOur job is to **curate the online data sources** used to train the model. This means looking at a lot of food websites!"
    },

    {
      id: "b9", type: "callout", style: "objective", icon: "🎯",
      content: "**Your Task:** Think like an AI engineer. You need to find recipe websites that could be used as training data for RecipeBot. As you browse, look for **specific words and phrases** that would help the chatbot understand recipes — words like \"Naan,\" \"Ounce,\" \"Bake,\" \"Simmer,\" etc."
    },

    {
      id: "b10", type: "question", questionType: "short_answer",
      prompt: "Think of a recipe website or food blog you've visited before (or imagine one). What is the website, and what are at least 10 recipe-related words that a language model could learn from that site?\n\n(Think about: ingredient names, cooking techniques, measurements, cuisine types, equipment)"
    },

    {
      id: "b11", type: "question", questionType: "short_answer",
      prompt: "Look at the recipe words you listed. What TYPE of cuisine or cooking style do they mostly represent? (For example: American, Italian, Indian, Mexican, Chinese, vegan, comfort food, etc.) What cuisines or styles might be MISSING from your list?"
    },

    // =========================================================
    // VIDEO: ALGORITHMIC BIAS WITH DR. RAJI (~5 minutes)
    // =========================================================
    { id: "section-video", type: "section_header", title: "Video: Algorithmic Bias", subtitle: "~5 minutes", icon: "🎬" },

    {
      id: "b12", type: "text",
      content: "**Watch:** Algorithmic Bias with Deborah Raji (Code.org)\n\nDr. Deborah Raji is an AI researcher who studies how bias shows up in AI systems. As you watch, pay attention to her definition of bias and the examples she gives."
    },

    {
      id: "b13", type: "callout", style: "definition", icon: "📝",
      content: "**Bias** (in AI): When a model favors certain information over others. A common source of bias in a large language model is the data used in pre-training."
    },

    {
      id: "b14", type: "question", questionType: "short_answer",
      prompt: "After watching the video — What is an example of bias that Dr. Raji discusses? How does it connect to the idea that training data shapes what AI knows?"
    },

    // =========================================================
    // ACTIVITY PART 2: IDENTIFYING BIAS IN DATA SOURCES (~15 min)
    // =========================================================
    { id: "section-activity2", type: "section_header", title: "Activity: Identifying Bias", subtitle: "~15 minutes", icon: "🔍" },

    {
      id: "b15", type: "text",
      content: "After seeing how easy it is for bias to unintentionally creep into our data sources, the RecipeBot company is now being more careful about the data they decide to use for their chatbot.\n\nThe company has asked for resources that could be used as training data. **Your new job is to identify potential sources of bias** in these collections.\n\nFor each data source below, you'll analyze it using three questions:\n- What is a potential **bias** with this collection of data?\n- What voices or experiences are being **prioritized**?\n- What voices or experiences are being **left out**?"
    },

    // --- Data Source 1: Man vs Food ---
    {
      id: "b16", type: "callout", style: "scenario", icon: "👩‍🦰",
      content: "**Data Source Suggestion #1:**\n\n\"Man vs Food is a TV food and travel show that visits diner restaurants in the US and leaves reviews. I found an archive of their food reviews and some of their recipes. I think we should include this in the RecipeBot training data!\""
    },

    {
      id: "b17", type: "question", questionType: "short_answer",
      prompt: "Analyze the 'Man vs Food' data source:\n\n1. What is a potential BIAS with this collection of data?\n2. What voices or experiences are being PRIORITIZED?\n3. What voices or experiences are being LEFT OUT?\n4. Should we include this in RecipeBot's training data? Why or why not?"
    },

    // --- Data Source 2: UNESCO ---
    {
      id: "b18", type: "callout", style: "scenario", icon: "👦🏿",
      content: "**Data Source Suggestion #2:**\n\n\"UNESCO is an organization founded in 1945 focused on different worldwide cultures. I found articles and recipes curated by UNESCO from around the world. This is a very diverse dataset we should add to RecipeBot's training data!\""
    },

    {
      id: "b19", type: "question", questionType: "short_answer",
      prompt: "Analyze the UNESCO data source:\n\n1. What is a potential BIAS with this collection of data? (Hint: Think about what 'curated' means — who decided what to include?)\n2. What voices or experiences are being PRIORITIZED?\n3. What voices or experiences are being LEFT OUT?\n4. Should we include this in RecipeBot's training data? Why or why not?"
    },

    // --- Data Source 3: Ina Garten ---
    {
      id: "b20", type: "callout", style: "scenario", icon: "👦🏻",
      content: "**Data Source Suggestion #3:**\n\n\"Ina Garten is a cookbook author who's written tons of recipes from around the world. I found a collection of PDFs of her cookbooks — we can use those in the data for RecipeBot.\""
    },

    {
      id: "b21", type: "question", questionType: "short_answer",
      prompt: "Analyze the Ina Garten cookbook data source:\n\n1. What is a potential BIAS with this collection of data? (Hint: One author = one perspective)\n2. What voices or experiences are being PRIORITIZED?\n3. What voices or experiences are being LEFT OUT?\n4. Should we include this in RecipeBot's training data? Why or why not?"
    },

    // --- Data Source 4: "Just use everything" ---
    {
      id: "b22", type: "callout", style: "scenario", icon: "👩🏻",
      content: "**Data Source Suggestion #4:**\n\n\"What's the big deal? Let's just include everything we can find on the internet and not leave anything out. That won't be biased then, right?\""
    },

    {
      id: "b23", type: "question", questionType: "short_answer",
      prompt: "This is actually the closest to how real large language models are trained — using as much internet data as possible. But is this person correct that using ALL the data means it won't be biased?\n\nExplain why or why not. (Hint: Think about whose recipes are most commonly posted online, in what languages, and from which countries.)"
    },

    // --- Chatbot: Bias Detective ---
    {
      id: "chat1", type: "chatbot",
      title: "🔍 Bias Detective",
      systemPrompt: "You are a friendly AI assistant helping a high school student think critically about bias in AI training data. The student has been analyzing data sources for a hypothetical 'RecipeBot' language model and learning about how bias enters AI systems through training data choices. Help them think deeper about: (1) how the data we choose shapes what AI knows, (2) why 'just using everything from the internet' doesn't eliminate bias, (3) real-world consequences of biased AI (e.g., facial recognition, hiring algorithms, language translation). Ask Socratic questions to push their thinking. If they suggest a new data source, help them identify potential biases in it. Keep responses under 150 words. Be encouraging but push critical thinking.",
      starterMessage: "Hey! You've been analyzing data sources for RecipeBot. I'm curious — after looking at all those suggestions, what's the biggest thing that surprised you about how bias gets into AI training data?"
    },

    // =========================================================
    // ETHICAL CHECKPOINT (~5 minutes)
    // =========================================================
    { id: "section-ethics", type: "section_header", title: "Ethical Checkpoint", subtitle: "~5 minutes", icon: "⚖️" },

    {
      id: "b24", type: "question", questionType: "multiple_choice",
      prompt: "A company builds a recipe chatbot trained mostly on English-language food blogs from the United States. A user asks it: 'What's a traditional recipe for jollof rice?' What is the MOST likely problem with the chatbot's response?",
      options: [
        "The chatbot won't understand the question at all",
        "The chatbot might give an Americanized version that doesn't reflect the authentic West African dish",
        "The chatbot will refuse to answer because it only knows American food",
        "The chatbot will give a perfect recipe because jollof rice is popular on the internet"
      ],
      correctAnswer: 1,
      explanation: "When training data is dominated by one culture's perspective, the AI might 'know' about dishes from other cultures but represent them through a filtered lens — giving Americanized or simplified versions rather than authentic recipes from the culture of origin."
    },

    {
      id: "b25", type: "question", questionType: "multiple_choice",
      prompt: "Which of the following is the BEST strategy for reducing bias in RecipeBot's training data?",
      options: [
        "Only use data from one trusted cookbook author",
        "Use as many different sources as possible from diverse cuisines, cultures, languages, and perspectives",
        "Only use data that has been verified by professional chefs",
        "Remove all cultural references from the training data so it stays neutral"
      ],
      correctAnswer: 1,
      explanation: "The best approach is to intentionally seek out diverse sources — from different cultures, languages, cooking traditions, and perspectives. No single source is perfect, but a diverse collection helps balance out individual biases."
    },

    // =========================================================
    // WRAP UP (~5 minutes)
    // =========================================================
    { id: "section-wrapup", type: "section_header", title: "Wrap Up", subtitle: "~5 minutes", icon: "🏁" },

    {
      id: "b26", type: "text",
      content: "**Transfer Challenge:** Another student not in this class has decided to try and make their own chatbot that can discuss and recommend **movies**."
    },

    {
      id: "b27", type: "question", questionType: "short_answer",
      prompt: "What is ONE piece of bias-related advice you would give that student when curating their training data for a movie recommendation chatbot?\n\n(Think about: What types of movies might be overrepresented? What voices or genres might get left out? How could that affect the chatbot's recommendations?)"
    },

    {
      id: "b28", type: "callout", style: "question", icon: "❓",
      content: "**Return to the Question of the Day:** How do our choices about input data influence a large language model?\n\nNow you know: Every choice about what data to include (or leave out) shapes what the model learns. Bias isn't always intentional — it can come from choosing data sources that overrepresent certain perspectives, cultures, or experiences. Even using 'everything on the internet' creates bias because the internet itself isn't a balanced representation of all human knowledge."
    },

    {
      id: "b29", type: "text",
      content: "**Key Takeaways:**\n\n- **Bias** happens when a model favors certain information over others, usually because of imbalances in training data.\n- Every data source has **some** bias — what matters is being **aware** of it and actively working to include diverse perspectives.\n- Even using \"all the data on the internet\" doesn't eliminate bias, because the internet itself overrepresents certain languages, cultures, and viewpoints.\n- As AI users and future builders, we have a **responsibility** to think critically about whose voices are included and whose are left out."
    },

    {
      id: "b30", type: "question", questionType: "short_answer",
      prompt: "Journal Prompt: Think back to the warm-up scenario about learning a language in a foreign country. How is choosing where you stay similar to choosing training data for an AI? What did you learn today about how bias enters AI systems?"
    },

    // =========================================================
    // VOCABULARY
    // =========================================================
    { id: "section-vocab", type: "section_header", title: "Vocabulary", subtitle: "", icon: "📖" },

    {
      id: "vocab", type: "vocab_list",
      terms: [
        { term: "Bias (in AI)", definition: "When a model favors certain information over others. A common source of bias in a large language model is the data used in pre-training." },
        { term: "Algorithmic Bias", definition: "Systematic errors in an AI system that create unfair outcomes, often because the training data doesn't equally represent all groups or perspectives." },
        { term: "Data Curation", definition: "The process of selecting, organizing, and preparing data for training an AI model. The choices made during curation directly affect what the model learns." },
        { term: "Representation", definition: "How well a dataset reflects the diversity of the real world — including different cultures, languages, perspectives, and experiences." },
        { term: "Overrepresentation", definition: "When certain groups, perspectives, or types of content appear much more frequently in training data than others, causing the model to favor them." },
        { term: "Underrepresentation", definition: "When certain groups, perspectives, or types of content are missing or rare in training data, causing the model to perform poorly for those groups." }
      ]
    }
  ]
};

async function seed() {
  try {
    await setDoc(
      doc(db, 'courses', 'ai-literacy', 'lessons', 'bias-in-the-machine'),
      lesson
    );
    console.log('✅ Lesson "Bias in the Machine" seeded successfully!');
    console.log('   Path: courses/ai-literacy/lessons/bias-in-the-machine');
    console.log('   Blocks:', lesson.blocks.length);
    console.log('   Chatbots: 1 (Bias Detective)');
    console.log('   Questions:', lesson.blocks.filter(b => b.type === 'question').length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
