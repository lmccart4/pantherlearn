// seed-lesson9.js
// Run this from your pantherlearn directory: node seed-lesson9.js
// Make sure you have your Firebase config set up

import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase-config.js';

const lesson = {
  title: "Who's Making the Choices?",
  course: "Exploring Generative AI",
  unit: "Lesson 9",
  order: 8,
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
      type: "objectives",
      content: "By the end of this lesson, you will be able to:\n\n• Analyze how language affects the choices an AI system makes when generating output."
    },
    {
      id: "b2",
      type: "text",
      content: "**Scenario:** Two students are working on a school safety project. They both prompted a chatbot to generate ideas, but got completely different responses.\n\n**Student 1 asked:** \"What helps students feel safe at school?\"\n\n**The chatbot responded with:**\n1. Supportive relationships with teachers and staff foster trust and security.\n2. Clear rules and consistent enforcement create an organized environment.\n3. Accessible mental health resources promote emotional well-being.\n\n**Student 2 asked:** \"Why do students feel unsafe at school?\"\n\n**The chatbot responded with:**\n1. Bullying and harassment create a hostile environment.\n2. Lack of adequate security measures may lead to fear.\n3. Concerns about mental health and violence impact feelings of safety."
    },
    {
      id: "b3",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at the two prompts and their responses above. What changed in the response between the two prompts? What words likely influenced how the bot responded?",
      placeholder: "Think about how 'safe' vs 'unsafe' changed the focus of the response..."
    },
    {
      id: "b4",
      type: "callout",
      style: "connection",
      content: "**Connecting to Attention:** Remember from last lesson — attention is the process that updates the meaning of each word using context from the other words in the input. The word \"safe\" and \"unsafe\" triggered the model's attention mechanism to focus on completely different patterns in its training data, even though both prompts are about the same topic (school safety)."
    },
    {
      id: "b5",
      type: "text",
      content: "**Two perspectives on this:**\n\n🟢 **AI Hype Person:** \"This shows how responsive AI can be — it listens to how we ask!\"\n\n🔴 **AI Skeptic:** \"It's just saying what it thinks we want to hear. That's not insight; that's just guessing.\""
    },
    {
      id: "b6",
      type: "question",
      questionType: "short_answer",
      prompt: "What might each person be right about? Think about the strengths and limitations of how chatbots respond to different prompts.",
      placeholder: "Consider: Is the AI actually 'listening'? Is it really just 'guessing'?"
    },
    {
      id: "b7",
      type: "callout",
      style: "question",
      content: "**Question of the Day:** How does changing a prompt affect what the chatbot says?"
    },

    // ═══════════════════════════════════════
    // ACTIVITY: Prompt Comparison (~25 min)
    // ═══════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "Activity: Prompt Comparisons",
      subtitle: "~25 minutes",
      icon: "💬"
    },
    {
      id: "b8",
      type: "text",
      content: "In this activity, you'll experiment with how changing the wording of a prompt changes the chatbot's response. You'll compare **base prompts** (neutral, open-ended) with **framed prompts** (that steer the response in a particular direction).\n\nHere are the prompt pairs to try:"
    },
    {
      id: "b9",
      type: "callout",
      style: "info",
      content: "**Prompt Comparison Table:**\n\n| Base Prompt | Framed Prompt |\n|---|---|\n| Tell me about video games. | How can video games be beneficial? |\n| What is social media? | How is social media helpful for students? |\n| Describe school spirit. | What encourages school spirit? |\n| Tell me about pets. | Why do people care so much about their pets? |\n| What's the best way to study? | What makes studying more effective? |\n| What should students know about the news? | How can students stay informed about the news? |"
    },
    {
      id: "b10",
      type: "activity",
      title: "Part 1: Base vs. Framed Prompts",
      instructions: "1. Choose one of the topics from the table above.\n2. Send the **base prompt** to the chatbot below, then send the **framed prompt**.\n3. Take notes on how the response changes in **content**, **tone**, or **focus**.\n4. Clear the chat and repeat with at least **3 different sets** of prompts."
    },

    // --- CHATBOT 1: Prompt Comparison Bot ---
    {
      id: "chat1",
      type: "chatbot",
      title: "Prompt Comparison Bot",
      icon: "🔄",
      instructions: "Try the base and framed prompts from the table above. Notice how the same topic gets a very different response depending on how you ask. Try at least 3 different pairs!",
      systemPrompt: "You are a helpful AI assistant being used by high school students in an AI Literacy class to explore how prompt wording affects AI responses. Respond naturally and helpfully to whatever the student asks. Give clear, organized responses (use numbered lists when appropriate). Keep responses concise — about 3-5 key points. Do NOT mention that you know this is a classroom exercise. Do NOT point out that the student is testing different prompts. Just respond naturally to each prompt as if it were a genuine question. Your responses should clearly demonstrate how different framing leads to different outputs — if asked a neutral question, give a balanced overview; if asked a positively-framed question, focus more on the positive aspects; if asked a negatively-framed question, focus more on the negative aspects. This natural behavior is exactly what the lesson is trying to demonstrate.",
      starterMessage: "Hi! I'm ready to help you explore any topic. Ask me anything!"
    },
    {
      id: "b11",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick one of the prompt pairs you tried. How did the chatbot's response change with the framed prompt? Why do you think that happened?",
      placeholder: "Describe what changed in the content, tone, or focus..."
    },

    // --- Part 2: Create Your Own Variations ---
    {
      id: "b12",
      type: "activity",
      title: "Part 2: Create Your Own Prompt Variations",
      instructions: "Now it's your turn to experiment! Choose 1 topic and create your own variations to see how it impacts the chatbot's response.\n\nFocus on varying:\n• **Word choice** (e.g., \"encourages\" vs. \"harms\" vs. \"effective\" vs. \"useless\")\n• **Sentence structure** (e.g., \"Tell me about...\" vs. \"What's the deal with...\" vs. \"...answer me RIGHT NOW\")\n\nUse the chatbot below and fill out the activity guide as you go."
    },

    // --- CHATBOT 2: Free Experimentation Bot ---
    {
      id: "chat2",
      type: "chatbot",
      title: "Prompt Laboratory",
      icon: "🧪",
      instructions: "Create your own prompt variations on any topic. Try changing individual words, the tone, the sentence structure, or the framing. See how each change affects the response!",
      systemPrompt: "You are a helpful AI assistant being used by high school students in an AI Literacy class to explore how prompt wording affects AI responses. Respond naturally and helpfully to whatever the student asks. Give clear, organized responses. Keep responses concise — about 3-5 key points per response. Do NOT mention that you know this is a classroom exercise. Do NOT point out that the student is testing different prompts or analyzing your behavior. Just respond naturally to each prompt as if it were a genuine question. Your responses should clearly demonstrate how different framing, word choice, tone, and sentence structure lead to different outputs. Match the energy and framing of the prompt — if someone asks aggressively, respond to that energy; if someone asks positively, lean into the positive angle; if someone is neutral, be balanced.",
      starterMessage: "Ready for your experiments! Ask me anything — try the same topic with different wording and see what happens."
    },
    {
      id: "b13",
      type: "question",
      questionType: "short_answer",
      prompt: "What prompt variations had the biggest impact on the chatbot's response? What specific words or structures seemed to matter most?",
      placeholder: "Think about word choice, sentence structure, emotional tone..."
    },

    // ═══════════════════════════════════════
    // CHECK FOR UNDERSTANDING
    // ═══════════════════════════════════════
    {
      id: "section-cfu",
      type: "section_header",
      title: "Check for Understanding",
      subtitle: "",
      icon: "✅"
    },
    {
      id: "b14",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student asks a chatbot: \"What are the dangers of social media?\" and gets a response focused on cyberbullying, addiction, and privacy risks. Another student asks: \"How does social media connect people?\" and gets a response about community building, staying in touch, and sharing ideas. Why are the responses so different?",
      options: [
        "The chatbot has different opinions depending on who asks",
        "The framing of each prompt directed the chatbot toward different aspects of the same topic",
        "The chatbot randomly generates different responses each time",
        "The second student's chatbot was a newer version"
      ],
      correctAnswer: 1,
      explanation: "The framing of the prompt — specifically the words 'dangers' vs. 'connect' — directed the chatbot's attention mechanism toward different patterns in its training data. The AI doesn't have opinions; it responds based on the language cues in the prompt."
    },
    {
      id: "b15",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the following best describes how the attention mechanism relates to prompt framing?",
      options: [
        "Attention ignores the prompt and generates random responses",
        "Attention uses the specific words in a prompt to determine which patterns and relationships to focus on when generating a response",
        "Attention only works with neutral prompts, not framed ones",
        "Attention means the chatbot remembers your previous conversations"
      ],
      correctAnswer: 1,
      explanation: "Attention is the process that looks at all the words in the input and determines their relationships. When you change the words in a prompt (like 'safe' to 'unsafe'), the attention mechanism focuses on different patterns, leading to different outputs."
    },
    {
      id: "b16",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A news organization wants to use AI to write article summaries. They notice that the prompt \"Summarize this article about climate change\" produces very different results from \"Summarize the key threats described in this climate article.\" What should they be most concerned about?",
      options: [
        "The AI is broken and needs to be fixed",
        "The framing of their prompts could unintentionally bias the summaries, which could mislead readers",
        "They should only use neutral prompts so the AI gives the 'right' answer",
        "AI can't be used for news because it always gives different answers"
      ],
      correctAnswer: 1,
      explanation: "The way prompts are framed can introduce bias into AI outputs. This is especially important in contexts like news where framing can shape public understanding. Being aware of this is key to using AI responsibly."
    },

    // --- Ethical Checkpoint ---
    {
      id: "b17",
      type: "callout",
      style: "warning",
      content: "**Ethical Checkpoint:** Consider the power of prompt framing. If the person writing the prompt can steer the AI's response just by choosing certain words, who is really \"making the choices\" — the AI or the human? What responsibility does that put on the person crafting the prompt?"
    },
    {
      id: "b18",
      type: "question",
      questionType: "short_answer",
      prompt: "Ethical Checkpoint: Imagine a company uses AI to generate product descriptions. They always prompt the AI with positively-framed questions like \"What makes this product amazing?\" instead of \"Describe this product.\" Is this a problem? Why or why not?",
      placeholder: "Think about honesty, consumer trust, and who controls the narrative..."
    },

    // ═══════════════════════════════════════
    // WRAP UP (~10 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~10 minutes",
      icon: "🎯"
    },
    {
      id: "b19",
      type: "text",
      content: "**Today, you learned about** how language affects the choices an AI system makes when generating output.\n\nYou saw that even small changes in word choice and sentence structure can dramatically shift a chatbot's response — not because the AI \"wants\" to say different things, but because the attention mechanism responds to the specific language patterns in your prompt."
    },
    {
      id: "b20",
      type: "text",
      content: "**Let's revisit our two perspectives:**\n\n🟢 **AI Hype Person:** \"This shows how responsive AI can be — it listens to how we ask!\"\n\n🔴 **AI Skeptic:** \"It's just saying what it thinks we want to hear. That's not insight; that's just guessing.\""
    },
    {
      id: "b21",
      type: "question",
      questionType: "short_answer",
      prompt: "After today's lesson, what would you say to the AI Hype Person and the AI Skeptic about how chatbots respond to prompts? Who do you agree with more, and why?",
      placeholder: "Use what you learned about attention and prompt framing to support your answer..."
    },

    // --- CHATBOT 3: Reflection Coach ---
    {
      id: "chat3",
      type: "chatbot",
      title: "Prompt Framing Advisor",
      icon: "🧠",
      instructions: "Use this chatbot to explore real-world scenarios where prompt framing matters. Ask it about situations where the way you ask a question could change the answer you get — in school, in the news, in advertising, or anywhere else.",
      systemPrompt: "You are a Prompt Framing Advisor for a high school AI Literacy class. Students have just learned that changing the words in a prompt can dramatically change an AI's output. Your role is to help them think critically about the real-world implications of this.\n\nWhen students ask about scenarios:\n1. Show them how the SAME question could be framed multiple ways\n2. Explain what kind of response each framing would likely produce\n3. Discuss the ethical implications — who benefits from certain framings?\n4. Connect back to the attention mechanism: different words activate different patterns\n\nExamples of topics to explore:\n- News headlines framing the same event differently\n- Job descriptions that attract different candidates based on wording\n- Survey questions that lead to different results\n- Marketing language that shapes perception\n- Political messaging and framing\n\nAlways encourage critical thinking. Help students see that the HUMAN writing the prompt has enormous power over what the AI produces. This means prompt literacy is a crucial skill.\n\nKeep responses clear and age-appropriate for high school students. Use concrete examples they can relate to.",
      starterMessage: "I'm your Prompt Framing Advisor! I can help you explore how prompt wording shapes AI responses in the real world.\n\nTry asking me about:\n• \"How would a news outlet frame the same story differently?\"\n• \"Show me how a survey question could be biased\"\n• \"How might a company use prompt framing in advertising?\"\n• Or bring your own scenario!"
    },
    {
      id: "b22",
      type: "callout",
      style: "question",
      content: "**Question of the Day Answer:** How does changing a prompt affect what the chatbot says?\n\nChanging the words, structure, or framing of a prompt changes which patterns the AI's attention mechanism focuses on. This shifts the content, tone, and focus of the response — even when the underlying topic is the same. The person writing the prompt has significant influence over what the AI produces."
    },
    {
      id: "b23",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which statement best captures what you learned today?",
      options: [
        "AI chatbots give random responses that can't be controlled",
        "The specific words and framing in a prompt influence which patterns the AI focuses on, changing the output",
        "AI chatbots always give the same response regardless of how you ask",
        "Only professional prompt engineers can influence AI responses"
      ],
      correctAnswer: 1,
      explanation: "The key takeaway is that prompt wording matters. Through the attention mechanism, different words activate different patterns, which means the human writing the prompt plays a major role in shaping the AI's output."
    }
  ]
};

async function seed() {
  const docRef = doc(db, 'lessons', 'lesson-9-whos-making-choices');
  await setDoc(docRef, lesson);
  console.log('✅ Lesson 9 "Who\'s Making the Choices?" seeded successfully!');
  console.log('   - Warm Up: School safety scenario, attention connection, AI Hype vs Skeptic');
  console.log('   - Activity Part 1: Base vs Framed prompt comparisons (Prompt Comparison Bot)');
  console.log('   - Activity Part 2: Free experimentation with variations (Prompt Laboratory)');
  console.log('   - Check for Understanding: 3 MC questions + Ethical Checkpoint');
  console.log('   - Wrap Up: Revisit Hype vs Skeptic + Prompt Framing Advisor chatbot');
  console.log('   - 3 Custom Chatbot Environments:');
  console.log('     1. 🔄 Prompt Comparison Bot — structured base vs framed prompt testing');
  console.log('     2. 🧪 Prompt Laboratory — free experimentation with word choice & structure');
  console.log('     3. 🧠 Prompt Framing Advisor — real-world implications exploration');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error seeding lesson:', err);
  process.exit(1);
});
