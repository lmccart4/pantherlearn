// seed-lesson6.js
// Run this from your pantherlearn directory: node seed-lesson6.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ⬇️ PASTE YOUR FIREBASE CONFIG HERE (same as src/lib/firebase.jsx) ⬇️
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
  title: "Understanding Embeddings",
  course: "Foundations of Generative AI",
  unit: "Lesson 6",
  order: 5,
  blocks: [
    // ═══════════════════════════════════════
    // WARM UP (~10 minutes)
    // ═══════════════════════════════════════
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
      content: "We're going to play a game called **Mind Meld!** This game will help us think about how words can be \"close\" or \"far apart\" in meaning — which is exactly how AI thinks about language."
    },
    {
      id: "b2",
      type: "activity",
      title: "Mind Meld",
      icon: "🧠",
      instructions: "Here's how it works:\n\n1. **Find a partner.** Both people think of a word.\n2. **Countdown from 3 together**, then both people say their word at the same time.\n3. **Using these two words as a starting point**, think of a new word. The goal is to say the **same word**, which means finding a word \"close\" or \"in between\" the two words you said.\n4. **Repeat** until you both say the same word, or until you've gone through 8 rounds.\n\n**Example:**\n• Person A says: \"Ocean\" / Person B says: \"Sky\"\n• Both think of something between ocean and sky...\n• Person A says: \"Blue\" / Person B says: \"Blue\" — Mind Meld!"
    },
    {
      id: "b3",
      type: "question",
      questionType: "short_answer",
      prompt: "How many rounds did it take you and your partner to reach a Mind Meld? What were the two starting words and what was your matching word?"
    },
    {
      id: "b4",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Why does this game work?** When you hear two words, your brain automatically understands their meanings and finds connections between them. You intuitively know which words are \"close\" to each other. But how would a *computer* do this? Computers don't understand meaning the way we do — they work with numbers."
    },
    {
      id: "b5",
      type: "text",
      content: "Think about the word **\"Frog.\"** It connects to many different categories of meaning:\n\n• **Amphibian** — toad, lizard, river\n• **Cooking** — legs, breaded, boil\n• **Fairy Tales** — princess, kiss, spell, prince\n• **Voice** — hoarse, raspy, croak\n\nThe word \"frog\" sits at the intersection of all these meaning categories. A single word can have many different connections depending on context. This is what makes language so rich — and so challenging for computers."
    },
    {
      id: "b6",
      type: "text",
      content: "Here's another way to think about word connections. Consider these 16 words:\n\n**Boat, Car, Plane, Train, Down, Game, In, Onboard, Dash, Drop, Pinch, Splash, Blue, Goose, Rasp, Straw**\n\nCan you group them into 4 categories of 4? (This is from the NYT Connections game!)\n\nThe groups are: *Means of transportation* (Boat, Car, Plane, Train), *Willing to participate* (Down, Game, In, Onboard), *Little bit in a recipe* (Dash, Drop, Pinch, Splash), and *___berry* (Blue, Goose, Rasp, Straw).\n\nWords that seem unrelated on the surface can be deeply connected through shared meaning!"
    },

    // --- QUESTION OF THE DAY ---
    {
      id: "b7",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** How do computers represent the meanings of words?"
    },

    // ═══════════════════════════════════════
    // ACTIVITY: Character Quiz (~25 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "Activity: Character Quiz",
      subtitle: "~25 minutes",
      icon: "🎭"
    },
    {
      id: "b8",
      type: "text",
      content: "We're going to discover how computers represent meaning by doing something similar ourselves — turning characters into **lists of numbers**.\n\nYou'll rate a character you know well on several trait scales (1–10), then compare your numbers to classmates' characters to see which ones are most similar."
    },

    // --- PART 1 ---
    {
      id: "b9",
      type: "activity",
      title: "Part 1: Create Your Character Profile",
      icon: "📝",
      instructions: "**Go to Lesson 6, Level 2** on Code.org.\n\n1. Choose a character you are familiar with (from a movie, book, TV show, video game, etc.)\n2. Rate your character on each trait scale by clicking a number (1–10):\n   • Good ←→ Evil\n   • Funny ←→ Serious\n   • Brave ←→ Timid\n   • Outgoing ←→ Shy\n   • Stubborn ←→ Quitter\n3. Come up with **two additional traits** and add them to the bottom\n4. When finished, press the **\"Ready for Part 2\"** button"
    },

    // --- PART 2 ---
    {
      id: "b10",
      type: "activity",
      title: "Part 2: Rate Other Characters",
      icon: "🚶",
      instructions: "Now it's time to collect data from your classmates!\n\n1. Walk around the room and find someone else's quiz to complete\n2. Type in your character's name and rate their traits as your character\n3. When you're done, press **\"Done! Next Character!\"**\n4. Continue filling out quizzes for at least 3 different classmates\n5. When you return to your seat, press **\"Ready for Part 3\"**"
    },

    // --- PART 3 ---
    {
      id: "b11",
      type: "activity",
      title: "Part 3: Compare Characters",
      icon: "📊",
      instructions: "Now look at the data you've collected!\n\nAnswer these questions with a neighbor:\n\n1. For each character: which traits are **close together**? Which traits are **far apart**?\n2. Which character overall do you think is **most similar** to yours?\n3. Which character overall do you think is **most different** from yours?"
    },
    {
      id: "b12",
      type: "question",
      questionType: "short_answer",
      prompt: "Which character was MOST similar to yours? How could you tell just by looking at the numbers?"
    },

    // --- COMPARING NUMBER ARRAYS ---
    {
      id: "section-compare",
      type: "section_header",
      title: "Comparing Characters as Numbers",
      subtitle: "~10 minutes",
      icon: "🔢"
    },
    {
      id: "b13",
      type: "text",
      content: "Now let's zoom out from the character names and just look at the **numbers**. When we strip away the labels, we're left with something powerful: a list of numbers that *represents* a character's traits.\n\nLook at Kim's character (red) and Hawa's character (purple) on the trait grid. Even without knowing who the characters are, you can see that their dots are far apart on most traits — meaning their characters are quite **different**."
    },
    {
      id: "b14",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Are these two characters similar?\n\nCharacter A: [9, 4, 3, 8, 1]\nCharacter B: [1, 8, 7, 2, 9]\n\n(Remember: the 5 numbers represent Good↔Evil, Funny↔Serious, Brave↔Timid, Outgoing↔Shy, Stubborn↔Quitter)",
      options: [
        "Yes — their numbers are very close",
        "No — their numbers are nearly opposite on every trait",
        "Can't tell without knowing the character names",
        "They're somewhat similar — a mix of close and far numbers"
      ],
      correctIndex: 1,
      explanation: "These characters are nearly opposite! Character A is evil (9), funny (4), timid (3), outgoing (8), and a quitter (1). Character B is the reverse on almost every trait. When the numbers are far apart across most dimensions, the characters are very different."
    },
    {
      id: "b15",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What about these two?\n\nCharacter C: [4, 4, 8, 2, 1]\nCharacter D: [3, 4, 7, 1, 2]",
      options: [
        "Very different — opposite on most traits",
        "Very similar — close on most traits",
        "Impossible to compare without more information",
        "Similar on some traits, different on others"
      ],
      correctIndex: 1,
      explanation: "These characters are very similar! The differences are only 1 point on each trait. Both are good, balanced in humor, brave, shy, and stubborn. Close numbers = similar characters."
    },
    {
      id: "b16",
      type: "question",
      questionType: "multiple_choice",
      prompt: "And these two?\n\nCharacter E: [9, 5, 2, 2, 1]\nCharacter F: [1, 8, 7, 2, 1]",
      options: [
        "Very similar — they share the same personality",
        "Very different — opposite on every trait",
        "Mixed — they share some traits (shy, stubborn) but differ on others (good/evil, brave/timid)",
        "Can't determine similarity from numbers alone"
      ],
      correctIndex: 2,
      explanation: "This is the tricky case! They match on Outgoing↔Shy (both 2) and Stubborn↔Quitter (both 1), but they're very different on Good↔Evil (9 vs 1) and Brave↔Timid (2 vs 7). Characters can be similar in some ways and different in others."
    },
    {
      id: "b17",
      type: "question",
      questionType: "short_answer",
      prompt: "How many traits do you think you'd need to make sure your character is uniquely identifiable just by the numbers? Why?"
    },

    // ═══════════════════════════════════════
    // FROM CHARACTERS TO WORDS: EMBEDDINGS
    // ═══════════════════════════════════════
    {
      id: "section-embeddings",
      type: "section_header",
      title: "From Characters to Words: Embeddings",
      subtitle: "~10 minutes",
      icon: "🧬"
    },
    {
      id: "b18",
      type: "text",
      content: "What you just did with characters is essentially what AI does with **words**.\n\nInstead of rating characters on traits like Good↔Evil or Funny↔Serious, AI models represent words using hundreds or thousands of number dimensions — things like \"living creature,\" \"canine,\" \"human,\" \"educator,\" \"verb,\" \"plural,\" and many more.\n\nFor example, the word **TIGER** might be represented as: [0.9, -0.2, 0.1, -0.7, 0.3, -0.2] — high on \"living creature,\" low on \"human.\"\n\nWhile **TEACHER** might be: [0.8, -0.1, 0.8, 0.8, -0.5, -0.9] — high on both \"living creature\" AND \"human\" AND \"educator.\""
    },
    {
      id: "b19",
      type: "video",
      url: "https://www.youtube.com/embed/wjZofJX0v4M",
      caption: "Watch: Generative AI — Video 2: Storage + Embeddings (Code.org)"
    },
    {
      id: "b20",
      type: "question",
      questionType: "short_answer",
      prompt: "Focus Question: What are embeddings and what are they used for? Answer in your own words."
    },
    {
      id: "b21",
      type: "definition",
      term: "Embedding",
      definition: "A set of numbers used to represent a word in a Large Language Model. Words with similar meanings have similar numbers, which allows the AI to understand relationships between words mathematically."
    },
    {
      id: "b22",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The key insight:** Just like you could tell which characters were similar by comparing their number lists, AI can tell which *words* are similar by comparing their embeddings. Words like \"puppy\" and \"wolf\" have similar embeddings because they share many traits (living creature, canine). Words like \"puppy\" and \"boats\" have very different embeddings."
    },

    // --- CHATBOT: Explore Embeddings ---
    {
      id: "chat1",
      type: "chatbot",
      title: "Embeddings Explorer",
      icon: "🔢",
      instructions: "Ask the AI to explain how different words would be represented as embeddings. Try questions like:\n\n• \"How would the words 'cat' and 'dog' be similar as embeddings?\"\n• \"What dimensions might be used to represent the word 'teacher'?\"\n• \"Why would 'king' and 'queen' have similar embeddings?\"\n• \"How are embeddings different from a dictionary definition?\"",
      systemPrompt: "You are a helpful AI assistant in a high school classroom lesson about word embeddings. Students are learning that AI represents words as lists of numbers (embeddings) where similar words have similar numbers. Help them understand this concept by explaining how different words would be represented, what dimensions might capture meaning, and why similar words end up with similar number patterns. Use the character quiz analogy they just did — rating characters on trait scales like Good↔Evil — to explain embeddings as rating words on meaning scales like Living↔Nonliving, Human↔Animal, etc. Keep explanations concise (3-5 sentences), concrete, and age-appropriate for high school students. Use specific number examples when helpful. Stay on topic about embeddings and word representation.",
      starterMessage: "Now that you've seen how characters can be represented as lists of numbers, let's explore how AI does the same thing with words! Ask me about any word and I'll explain what its embedding might look like and why.",
      placeholder: "Ask about how a word would be represented..."
    },
    {
      id: "b23",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick two words that you think would have SIMILAR embeddings and two words that would have VERY DIFFERENT embeddings. Explain your reasoning."
    },

    // --- GRAPHIC ORGANIZER ---
    {
      id: "b24",
      type: "activity",
      title: "Update Your Graphic Organizer",
      icon: "📋",
      instructions: "Take out your **Foundations of Generative AI Graphic Organizer**.\n\n1. Update the **Storage** section with an explanation of how a model represents words (using embeddings — lists of numbers)\n2. Update the **Embeddings** section on the back with:\n   • **Definition** — in your own words\n   • **How they are used** — to represent the meaning of words\n   • **How they are created** — learned from patterns in training data\n   • **A helpful visual** — draw or describe something that helps you remember"
    },

    // ═══════════════════════════════════════
    // WRAP UP (~5 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-wrap",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎬"
    },
    {
      id: "b25",
      type: "text",
      content: "Today you learned that computers represent the meanings of words using **embeddings** — lists of numbers where each number captures a different dimension of meaning. Words with similar meanings end up with similar numbers, just like characters with similar personalities had similar trait scores."
    },
    {
      id: "b26",
      type: "question",
      questionType: "short_answer",
      prompt: "Imagine a friend who isn't taking this class says: \"Chatbots are so magical — it knows all these words that I've never seen before. How does it even do it? It must be way smarter than me.\" What would you say in response, using what you learned today about embeddings?"
    },
    {
      id: "b27",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** How do computers represent the meanings of words?\n\nComputers use **embeddings** — lists of numbers that capture different dimensions of a word's meaning. Similar words get similar numbers, allowing AI to work with language mathematically."
    },

    // --- CHECK FOR UNDERSTANDING ---
    {
      id: "section-check",
      type: "section_header",
      title: "Check Your Understanding",
      subtitle: "",
      icon: "✅"
    },
    {
      id: "b28",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is an embedding in AI?",
      options: [
        "A picture that represents a word",
        "A set of numbers used to represent a word in a Large Language Model",
        "A dictionary definition stored in a database",
        "A recording of how a word sounds"
      ],
      correctIndex: 1,
      explanation: "An embedding is a set of numbers (a vector) that represents a word's meaning. Each number captures a different dimension of the word's meaning, allowing AI to work with language mathematically."
    },
    {
      id: "b29",
      type: "question",
      questionType: "multiple_choice",
      prompt: "The words \"puppy\" and \"kitten\" would most likely have embeddings that are:",
      options: [
        "Identical — they mean the same thing",
        "Similar — they share many traits (young, animal, pet, cute)",
        "Completely different — one is a dog and one is a cat",
        "Random — embeddings don't capture meaning"
      ],
      correctIndex: 1,
      explanation: "\"Puppy\" and \"kitten\" share many meaning dimensions — both are young animals, pets, and considered cute. Their embeddings would be similar (close numbers) on these shared traits, but differ on dimensions like \"canine\" vs \"feline.\""
    },
    {
      id: "b30",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why do AI models need hundreds or thousands of number dimensions in their embeddings, rather than just 5 like our character quiz?",
      options: [
        "More numbers make the AI run faster",
        "It's just to make the system more complicated",
        "More dimensions allow the AI to capture subtle differences in meaning and make each word uniquely identifiable",
        "Computers prefer large numbers"
      ],
      correctIndex: 2,
      explanation: "Just like you discussed needing more traits to uniquely identify characters, AI needs many dimensions to capture all the subtle differences between words. With only 5 traits, many different words might end up with the same numbers. Hundreds of dimensions ensure each word gets a unique and meaningful representation."
    },

    // --- VOCABULARY ---
    {
      id: "section-vocab",
      type: "section_header",
      title: "Key Vocabulary",
      subtitle: "",
      icon: "📖"
    },
    {
      id: "b31",
      type: "vocab_list",
      terms: [
        {
          term: "Embedding",
          definition: "A set of numbers used to represent a word in a Large Language Model. Words with similar meanings have similar embeddings."
        },
        {
          term: "Dimension",
          definition: "A single number in an embedding that captures one aspect of a word's meaning (like one trait in the character quiz)."
        },
        {
          term: "Large Language Model (LLM)",
          definition: "An AI system trained on massive amounts of text that can generate, understand, and work with human language."
        },
        {
          term: "Vector",
          definition: "A list of numbers — another name for an embedding. The word 'vector' comes from math and means an ordered set of values."
        }
      ]
    }
  ]
};

async function seed() {
  try {
    await setDoc(
      doc(db, 'courses', 'ai-literacy', 'lessons', 'understanding-embeddings'),
      lesson
    );
    console.log('✅ Lesson "Understanding Embeddings" seeded successfully!');
    console.log('   Path: courses/ai-literacy/lessons/understanding-embeddings');
    console.log('   Blocks:', lesson.blocks.length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
