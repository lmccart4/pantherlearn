// seed-lesson8.js
// Run this from your pantherlearn directory: node seed-lesson8.js
// Make sure you have your Firebase config set up

import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase-config.js';

const lesson = {
  title: "Attention is All You Need",
  course: "Foundations of Generative AI",
  unit: "Lesson 8",
  order: 7,
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
      content: "Look at the image below. **What animal do you see?**\n\nThis is a famous optical illusion — some people see a duck, and others see a rabbit. It's the same drawing, but what you \"see\" depends on what you focus on."
    },
    {
      id: "b2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When you first looked at the duck/rabbit illusion, which animal did you see?",
      options: [
        "A duck",
        "A rabbit",
        "I saw both at the same time",
        "I'm not sure what I saw"
      ],
      correctIndex: -1,
      explanation: "There's no wrong answer here! The point is that the same image can be interpreted different ways depending on what you focus on."
    },
    {
      id: "b3",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Suppose I wanted you to see this as a duck.** What could I have done to make that clearer? I could have added **context** — like putting the image next to a pond, or showing other ducks nearby. Context helps us decide the meaning of something we're looking at."
    },
    {
      id: "b4",
      type: "text",
      content: "This happens with language too! Consider this sentence:\n\n**\"I saw the man with the telescope\"**\n\nThis sentence has two completely different meanings:\n\n• I used a telescope to see the man (\"with the telescope\" describes how I saw him)\n• I saw a man who was holding a telescope (\"with the telescope\" describes the man)\n\nWithout more context, we can't be sure which meaning is intended. **Context is everything.**"
    },
    {
      id: "b5",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** How does a language model determine the meaning of words within a sentence?"
    },

    // ═══════════════════════════════════════
    // ACTIVITY: ATTENTION (~25 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "Activity: Words in Context",
      subtitle: "~25 minutes",
      icon: "🎯"
    },
    {
      id: "b6",
      type: "text",
      content: "We are exploring how words can have **multiple meanings**, but we can usually determine the intended meaning based on **context clues** in the sentence. This could be from looking at other words in the sentence or the grammar of the sentence."
    },
    {
      id: "b7",
      type: "text",
      content: "Read the two passages below. Both use the word **\"bat\"** — but with very different meanings:\n\n**Passage 1:** *The bases were loaded when Carmen was sent up to bat. Her team was losing, but the team could win if Carmen hit a home run. Anticipation in the park was high — Carmen could bat better than anyone else on the team. After a deep breath, Carmen grabbed the bat while the team cheered her on.*\n\n**Passage 2:** *The bat lived in a cave in the park. The bat could hang upside down in the cave. The park rangers worked as a team to make sure that no humans could enter the cave in a way that would disturb the bat. Park visitors could not park near the cave.*"
    },
    {
      id: "b8",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Passage 1, which meaning of \"bat\" is being used?",
      options: [
        "A flying animal that sleeps during the day",
        "A sports equipment / the action of hitting in baseball",
        "A swatting motion, like what a cat does with toys",
        "A type of cave-dwelling insect"
      ],
      correctIndex: 1,
      explanation: "Context clues like \"bases were loaded,\" \"home run,\" \"team,\" and \"grabbed the bat\" all point to the baseball meaning. The word 'bat' appears as both a verb (to bat) and a noun (the bat) — both in the sports context."
    },
    {
      id: "b9",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Passage 2, which meaning of \"bat\" is being used?",
      options: [
        "A flying animal that sleeps during the day",
        "A sports equipment / the action of hitting in baseball",
        "A swatting motion, like what a cat does with toys",
        "A type of cave-dwelling insect"
      ],
      correctIndex: 0,
      explanation: "Context clues like \"lived in a cave,\" \"hang upside down,\" and \"disturb the bat\" all point to the flying animal meaning. Notice how the same words (park, team, could) appear in both passages but don't change the meaning of 'bat' — it's the OTHER words that matter most."
    },
    {
      id: "b10",
      type: "text",
      content: "The word **bat** can mean many things:\n\n**A)** What you use to hit things in sports games\n**B)** A flying animal that sleeps during the day and is awake at night\n**C)** A swatting motion, like what a cat does when it plays with toys\n\nNow consider this sentence:\n\n*\"The tiny animal was overwhelmed with confetti and it attempted to **bat** away the glitter with its little paws\"*"
    },
    {
      id: "b11",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which meaning of \"bat\" is being used in this sentence?\n\n\"The tiny animal was overwhelmed with confetti and it attempted to bat away the glitter with its little paws\"",
      options: [
        "What you use to hit things in sports games",
        "A flying animal that sleeps during the day and is awake at night",
        "A swatting motion, like what a cat does when it plays with toys"
      ],
      correctIndex: 2,
      explanation: "The words \"attempted to,\" \"away,\" and \"with its little paws\" all tell us that 'bat' here means a swatting motion. The grammar matters too — 'to bat' is a verb here, not a noun."
    },
    {
      id: "b12",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at the sentence again: \"The tiny animal was overwhelmed with confetti and it attempted to bat away the glitter with its little paws.\"\n\nWhich specific words helped you determine that \"bat\" means a swatting motion? List at least 3 context clue words and explain why each one helped."
    },

    // --- CHATBOT: Context Clue Explorer ---
    {
      id: "chat1",
      type: "chatbot",
      title: "Context Clue Explorer",
      icon: "🔍",
      instructions: "Try giving the AI a word with multiple meanings and ask it to use that word in different sentences. Then ask which other words in the sentence helped determine the meaning. Try words like: **bark, light, spring, run, bank, crane, match, pitch, ring, seal**",
      systemPrompt: "You are a helpful vocabulary and context clues assistant for a high school AI Literacy class. Students are learning about how context determines word meaning — this connects to how AI attention mechanisms work.\n\nWhen a student gives you a word with multiple meanings:\n1. First, list 2-3 different meanings of the word\n2. Write a clear sentence for EACH meaning where context clues make the intended meaning obvious\n3. For each sentence, point out which specific words serve as context clues\n\nIf a student asks you to explain how context clues work, use the example of 'bat' — it can mean a sports tool, a flying animal, or a swatting motion. Show how surrounding words change its meaning.\n\nKeep responses focused and age-appropriate. Use formatting (bold for key words) to make context clues stand out. Always encourage the student to try more words.\n\nIMPORTANT: Connect this back to AI when relevant — explain that language models do something similar called 'attention' where they look at surrounding words to determine what each word means in context.",
      starterMessage: "Hi! I'm here to help you explore how context changes the meaning of words. Give me any word that has multiple meanings — like **bark**, **light**, **spring**, or **bank** — and I'll show you how surrounding words determine which meaning is intended!\n\nThis is actually how AI language models figure out word meanings too!",
      placeholder: "Type a word with multiple meanings..."
    },

    // --- CONNECTING TO AI ---
    {
      id: "section-connecting",
      type: "section_header",
      title: "Connecting to AI: Embeddings → Attention",
      subtitle: "~10 minutes",
      icon: "🧠"
    },
    {
      id: "b13",
      type: "text",
      content: "In our activity, we wrote down the potential meanings and uses of a word (like the three meanings of \"bat\"). **How does a language model represent this same thing?**\n\nRemember from our last lesson — the answer is **embeddings!** Embeddings are a set of numbers used to represent a word in a Large Language Model. They capture the meaning of words as numbers."
    },
    {
      id: "b14",
      type: "definition",
      term: "Embedding",
      definition: "A set of numbers used to represent a word in a Large Language Model. Words with similar meanings have similar embeddings. (Review from Lesson 6)"
    },
    {
      id: "b15",
      type: "text",
      content: "And in our activity, we drew **arrows** from context clue words to the target word to show how other words help determine meaning. **How does a language model represent these relationships?**\n\nThe answer is **neural networks!** Neural networks are interconnected networks that make decisions using weights and hidden layers. They represent the relationships between words."
    },
    {
      id: "b16",
      type: "definition",
      term: "Neural Network",
      definition: "An interconnected network that makes decisions using weights and hidden layers. In a language model, neural networks represent the relationships between words. (Review from Lesson 7)"
    },

    // --- VIDEO ---
    {
      id: "b17",
      type: "video",
      url: "https://www.youtube.com/embed/PLACEHOLDER_ATTENTION_VIDEO",
      caption: "Watch: Generative AI — Video 4: Attention (Code.org)"
    },
    {
      id: "b18",
      type: "question",
      questionType: "short_answer",
      prompt: "Focus Question: What is attention in a language model? Answer in your own words after watching the video."
    },

    // --- ATTENTION DEFINITION ---
    {
      id: "b19",
      type: "definition",
      term: "Attention",
      definition: "A process that updates the meaning of each word by using the context from other words in the input. The attention mechanism allows a language model to understand that the same word (like 'bat') can mean different things depending on the surrounding words."
    },
    {
      id: "b20",
      type: "text",
      content: "Here's how attention works with our \"bat\" example:\n\nWhen the model reads **\"The bat lived in a cave in the park\"**, the attention process looks at all the other words — *lived*, *cave*, *park* — and updates the embedding for \"bat\" to be closer to the \"flying animal\" meaning.\n\nBut when it reads **\"Carmen grabbed the bat while the team cheered\"**, the attention process sees *grabbed*, *team*, *cheered* — and updates the embedding for \"bat\" to be closer to the \"sports equipment\" meaning.\n\n**The same word gets different number representations depending on context.** This is the key insight of the attention mechanism!"
    },
    {
      id: "b21",
      type: "text",
      content: "Think of it this way:\n\n**Before attention:** The word \"bat\" has one generic embedding — a set of numbers that tries to capture ALL its possible meanings at once (sports: 0.53, animal: 0.58, verb: 0.42, computer: 0.21).\n\n**After attention:** The model reads the full sentence and updates those numbers. In \"The bat lived in a cave,\" the animal dimension might jump from 0.58 to 0.95, while sports drops from 0.53 to 0.05.\n\nAttention is the process that makes this update happen. It's what allows the model to understand words **in context**, not just in isolation."
    },

    // --- CHATBOT: Attention Simulator ---
    {
      id: "chat2",
      type: "chatbot",
      title: "Attention Simulator",
      icon: "🎯",
      instructions: "Ask the AI to show you how the attention process would work on different sentences. Try giving it sentences with ambiguous words and ask it to explain which words the model would \"pay attention to\" and how the meaning changes.",
      systemPrompt: "You are an AI attention mechanism simulator for a high school AI Literacy class. Students have just learned that attention is a process that updates word meanings using context from other words.\n\nWhen a student gives you a sentence:\n1. Identify any words that could have multiple meanings\n2. Show a SIMPLIFIED attention analysis:\n   - List the target word and its possible meanings\n   - Show which other words in the sentence the model would 'pay attention to'\n   - Use arrows notation like: 'lived → bat' means 'lived' helps determine bat's meaning\n   - Show how the embedding numbers might change (use simple made-up numbers)\n   - Example: Before attention: bat = {sports: 0.5, animal: 0.5, swatting: 0.3}\n   - Example: After attention: bat = {sports: 0.1, animal: 0.9, swatting: 0.05}\n3. Explain in plain language which meaning the model would choose and why\n\nIf students ask general questions about attention, explain it simply: attention is how a language model looks at ALL the words in a sentence to figure out what each individual word means in THAT specific context.\n\nUse the \"bat\" example they already know if they need a starting point. Keep explanations clear and avoid overly technical jargon. The key takeaway is: same word + different context = different meaning, and attention is the process that makes this work.\n\nAlways encourage students to try their own sentences with tricky words!",
      starterMessage: "I'm an Attention Simulator! Give me any sentence, and I'll show you how a language model's attention mechanism would analyze it — figuring out which words help determine the meaning of other words.\n\nTry a sentence with an ambiguous word, like:\n• \"I need to **bank** on my friend's help\"\n• \"She had to **duck** under the fence\"\n• \"The **bark** was loud and sharp\"\n\nOr make up your own!",
      placeholder: "Type a sentence for attention analysis..."
    },

    // ═══════════════════════════════════════
    // WRAP UP (~10 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~10 minutes",
      icon: "🏁"
    },
    {
      id: "b22",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about the LLM diagram with Input → Processing → Storage → Output.\n\nUpdate your understanding: How do **Storage** (embeddings) and **Processing** (neural networks + attention) work together when a language model reads a sentence? Try to incorporate the attention process in your explanation."
    },
    {
      id: "b23",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** How does a language model determine the meaning of words within a sentence?\n\n**Answer:** Through the **attention** process! When a language model reads a sentence, it uses attention to look at all the other words and update each word's embedding (number representation) based on context. This is how the model knows that \"bat\" means a flying animal in one sentence and a piece of sports equipment in another."
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
      id: "b24",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is \"attention\" in a language model?",
      options: [
        "The amount of time the model spends reading each word",
        "A process that updates the meaning of each word by using context from other words in the input",
        "A way to make the model pay more attention to longer sentences",
        "A technique that removes unimportant words from the sentence"
      ],
      correctIndex: 1,
      explanation: "Attention is a process that updates the meaning (embedding) of each word by looking at the context provided by other words in the input. It's how the model figures out what a word means in a specific sentence."
    },
    {
      id: "b25",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Consider these two sentences:\n\n1. \"The crane flew over the lake at sunset.\"\n2. \"The crane lifted the steel beam to the top floor.\"\n\nHow would the attention mechanism handle the word \"crane\" differently in each sentence?",
      options: [
        "It wouldn't — 'crane' always means the same thing",
        "In sentence 1, words like 'flew,' 'lake,' and 'sunset' would shift crane's meaning toward 'bird.' In sentence 2, 'lifted,' 'steel beam,' and 'top floor' would shift it toward 'machine.'",
        "The model would just guess randomly",
        "The model would skip the word 'crane' because it's ambiguous"
      ],
      correctIndex: 1,
      explanation: "This is exactly how attention works! The surrounding context words (flew/lake vs. lifted/steel beam) cause the attention mechanism to update the embedding of 'crane' differently in each sentence, shifting it toward the intended meaning."
    },
    {
      id: "b26",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Before the attention process, the word \"spring\" might have an embedding like:\n{season: 0.4, water: 0.3, jump: 0.3, coil: 0.3}\n\nAfter reading the sentence \"The hikers found a natural spring in the mountains,\" what would the updated embedding most likely look like?",
      options: [
        "{season: 0.9, water: 0.1, jump: 0.05, coil: 0.05}",
        "{season: 0.1, water: 0.9, jump: 0.05, coil: 0.05}",
        "{season: 0.1, water: 0.1, jump: 0.9, coil: 0.05}",
        "{season: 0.25, water: 0.25, jump: 0.25, coil: 0.25}"
      ],
      correctIndex: 1,
      explanation: "The context words 'hikers,' 'found,' 'natural,' and 'mountains' all point to the water source meaning of 'spring.' The attention mechanism would update the embedding to strongly favor the 'water' dimension while reducing the others."
    },
    {
      id: "b27",
      type: "question",
      questionType: "short_answer",
      prompt: "Come up with your own example of a word with multiple meanings. Write two sentences that use the word differently. Then explain which context clue words in each sentence would help the attention mechanism determine the correct meaning."
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
      id: "b28",
      type: "vocab_list",
      terms: [
        {
          term: "Attention",
          definition: "A process that updates the meaning of each word by using the context from the other words in the input. It allows a language model to understand that the same word can mean different things in different sentences."
        },
        {
          term: "Context",
          definition: "The surrounding words, phrases, or situation that help determine the meaning of a particular word or expression."
        },
        {
          term: "Embedding (review)",
          definition: "A set of numbers used to represent a word in a Large Language Model. Embeddings are updated by the attention process based on context."
        },
        {
          term: "Neural Network (review)",
          definition: "An interconnected network that makes decisions using weights and hidden layers. Neural networks power the attention mechanism that processes relationships between words."
        }
      ]
    }
  ]
};

async function seed() {
  try {
    await setDoc(
      doc(db, 'courses', 'ai-literacy', 'lessons', 'attention-is-all-you-need'),
      lesson
    );
    console.log('✅ Lesson "Attention is All You Need" seeded successfully!');
    console.log('   Path: courses/ai-literacy/lessons/attention-is-all-you-need');
    console.log('   Blocks:', lesson.blocks.length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
