// seed-lesson7.js
// Run this from your pantherlearn directory: node seed-lesson7.js

import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase-config.js';

const lesson = {
  title: "Understanding Neural Networks",
  course: "Foundations of Generative AI",
  unit: "Lesson 7",
  order: 6,
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
      content: "Let's start with a fun activity that will help us understand how AI processes language. We're going to do some **mad-libs** — but with a twist that connects to how neural networks work."
    },
    {
      id: "b2",
      type: "activity",
      title: "Mad-Lib Challenge",
      icon: "✏️",
      instructions: "Complete these two mad-libs:\n\n**1.** \"The ________ was dancing in rain\"\n\n**2.** \"Dancing was ________ in the rain\"\n\nThink about what type of word fits in each blank. How did the **position** of the blank change what kind of word you needed?"
    },
    {
      id: "b3",
      type: "question",
      questionType: "short_answer",
      prompt: "What word did you choose for each mad-lib? Why did you pick different types of words for each one?"
    },
    {
      id: "b4",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "In the first sentence, you needed a **noun** (like \"girl\" or \"cat\") because of where the blank was. In the second, you needed an **adjective** (like \"fun\" or \"amazing\"). The **surrounding words** determined what type of word made sense — and this is exactly how neural networks process language! The context around a word helps the network decide what should come next."
    },
    {
      id: "b5",
      type: "objectives",
      title: "Lesson Objectives",
      items: [
        "Explain how neural networks use inputs, hidden layers, and outputs to make decisions",
        "Describe how weights influence the decisions a neural network makes",
        "Analyze how neural networks can be updated when they make mistakes",
        "Discuss the ethical considerations of how neural networks handle sensitive data"
      ]
    },
    {
      id: "b5b",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** How do Neural Networks make decisions?"
    },

    // ═══════════════════════════════════════
    // ACTIVITY: Building a Neural Network (~25 minutes)
    // ═══════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "Activity: Building a Neural Network",
      subtitle: "~25 minutes",
      icon: "🧠"
    },
    {
      id: "b6",
      type: "text",
      content: "We are going to build a neural network step by step! Here's our scenario:\n\n**We are helping a computer design meals for an elementary school cafeteria.** To start, we spent several days observing students during lunch and made these observations:\n\n• Students **will eat** avocados\n• Students **will eat** ice cream\n• Students **won't eat** raisins\n• **Some** students eat peanuts and some don't"
    },
    {
      id: "b7",
      type: "text",
      content: "Based on these observations, we can start building a simple network. Each food is an **input**, and the decision to accept or reject it is an **output**.\n\nAvocados → **Accept** ✅\nIce Cream → **Accept** ✅\nRaisins → **Reject** ❌\nPeanuts → **???** 🤔"
    },
    {
      id: "b8",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Based on the observation data, what should we do with peanuts in our neural network?",
      options: [
        "Accept — some students like them, so they should be included",
        "Reject — since some students don't eat them, it's safer to leave them out",
        "We need more data — the observations were inconclusive",
        "It doesn't matter — peanuts aren't important"
      ],
      correctIndex: 2,
      explanation: "The data was inconclusive! Some students eat peanuts and some don't. This is a real challenge in AI — when data is unclear, the network has to make a judgment call, which may not always be right."
    },
    {
      id: "b9",
      type: "activity",
      title: "Draw Your Network (Part 1)",
      icon: "📝",
      instructions: "On your **Neural Networks Activity Guide**:\n\n1. **Draw the network so far** — inputs (Avocados, Ice Cream, Raisins, Peanuts) on the left, outputs (Accept, Reject) on the right, with lines connecting them based on the observations\n2. **Decide about peanuts** — since the data was inconclusive, YOU choose: will your model accept or reject peanuts?\n3. **Add two more foods** to your network and decide whether to accept or reject them"
    },

    // --- THE PROBLEM: Bad Combinations ---
    {
      id: "b10",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**1 Week Later:** While testing our network at the school, something unexpected happened: the network suggested an **avocado covered in ice cream!** And no one would eat it!! 🥑🍦\n\nBoth avocado and ice cream were \"accepted\" individually — but the network didn't know that combining them would be terrible."
    },
    {
      id: "b11",
      type: "question",
      questionType: "short_answer",
      prompt: "Why did the network suggest avocado covered in ice cream? What was missing from our simple input → output design?"
    },

    // --- INTRODUCING HIDDEN LAYERS ---
    {
      id: "b12",
      type: "text",
      content: "This is where **hidden layers** come in! A hidden layer sits **between** the inputs and outputs and helps the network consider **combinations and relationships** — not just individual items.\n\nThink of the hidden layer like a taste-testing panel. Instead of just saying \"avocado = good\" and \"ice cream = good,\" the hidden layer can recognize that \"avocado + ice cream together = bad\" even though each one is fine on its own."
    },
    {
      id: "b13",
      type: "definition",
      term: "Hidden Layer",
      definition: "A layer of nodes between the inputs and outputs of a neural network. Hidden layers help the network learn complex patterns and relationships that aren't obvious from the inputs alone."
    },
    {
      id: "b14",
      type: "activity",
      title: "Draw Your Network (Part 2) — Hidden Layer",
      icon: "📝",
      instructions: "Update your **Neural Networks Activity Guide**:\n\n1. **Draw additional nodes** in a hidden layer between your inputs and outputs\n2. **Update your network** to represent different relationships and decisions:\n   - What happens if every single food was on the same plate?\n   - Are some combinations still good? Are some combinations bad?\n3. **Draw lines** from inputs to hidden layer nodes, and from hidden layer nodes to outputs"
    },

    // --- CHATBOT: Neural Network Explorer ---
    {
      id: "chat1",
      type: "chatbot",
      title: "Neural Network Explorer",
      icon: "🧠",
      instructions: "Use this AI assistant to explore how neural networks think about combinations. Try asking about food combinations, or ask it to explain how a hidden layer would process different inputs!",
      systemPrompt: "You are a friendly AI teaching assistant helping high school students understand neural networks through the analogy of a school cafeteria meal planning system. Students have been building a neural network that decides whether to accept or reject foods for school meals.\n\nKey concepts to reinforce:\n- INPUTS are the individual foods (avocado, ice cream, raisins, peanuts)\n- OUTPUTS are Accept or Reject\n- HIDDEN LAYERS help process combinations (avocado alone = good, ice cream alone = good, but avocado + ice cream together = bad)\n- The hidden layer is like a 'taste testing panel' that considers how foods work together\n\nWhen students ask about food combinations, walk them through how the hidden layer would process it. Use simple, relatable language. Keep responses concise (3-5 sentences). If they ask about real neural networks, connect it back to the food analogy first, then briefly explain the real concept.\n\nDo NOT use overly technical jargon. These are high school students in an introductory AI course.",
      starterMessage: "Hey! I'm here to help you think about neural networks. Try asking me things like:\n• \"What would the hidden layer do if we combined raisins and ice cream?\"\n• \"Why can't a simple network handle food combinations?\"\n• \"How does a hidden layer actually help?\"",
      placeholder: "Ask about neural networks and food combinations..."
    },

    // --- THE FREEZE BUG: Conflicting Signals ---
    {
      id: "b15",
      type: "callout",
      style: "warning",
      icon: "🐛",
      content: "**1 Week Later:** We found a weird bug! Sometimes the network **freezes** and won't make any decision at all. This tends to happen when both avocado AND ice cream are suggested — even if they're given **individually** instead of combined.\n\nThe problem? The hidden layer learned that avocado + ice cream = bad, so now whenever it sees BOTH of them (even separately), it sends **conflicting signals** — one path says Accept, another says Reject. The network is confused!"
    },
    {
      id: "b16",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why does the network freeze when it sees both avocado and ice cream, even when they're separate?",
      options: [
        "The network ran out of memory",
        "The hidden layer sends conflicting signals — one path says Accept and another says Reject",
        "Avocado and ice cream are both bad foods",
        "The network needs to be turned off and on again"
      ],
      correctIndex: 1,
      explanation: "When the network sees both avocado and ice cream, the hidden layer creates conflicting paths — some nodes push toward Accept and others push toward Reject. Without a way to break the tie, the network gets stuck!"
    },

    // --- INTRODUCING WEIGHTS ---
    {
      id: "b17",
      type: "text",
      content: "This is where **weights** come in! Weights are numbers assigned to the connections between nodes. They tell the network **how important** each connection is.\n\nThink of weights like volume knobs — a high weight means that connection is \"loud\" and has a big influence on the decision. A low weight means that connection is \"quiet\" and doesn't matter as much.\n\nFor example:\n• Avocado → Hidden Node → Accept might have a weight of **100**\n• Ice Cream → Hidden Node → Accept might have a weight of **100**\n• But the \"avocado + ice cream combo\" → Reject might have a weight of **500**\n\nSince 500 > 100 + 100, the Reject signal wins when both are present!"
    },
    {
      id: "b18",
      type: "definition",
      term: "Weight",
      definition: "A number assigned to a connection between nodes in a neural network. Weights determine how much influence one node has on another — higher weights mean stronger influence on the final decision."
    },
    {
      id: "b19",
      type: "activity",
      title: "Draw Your Network (Part 3) — Weights",
      icon: "📝",
      instructions: "Update your **Neural Networks Activity Guide** one more time:\n\n1. **Add weights** (numbers) to the connections in your network\n2. Think about which connections should be **strong** (high weight) and which should be **weak** (low weight)\n3. Consider: Is there one food that, no matter what else is on the plate, should ALWAYS cause a rejection? Give that connection a very high weight!\n4. You can add up to **2 new food inputs** if you want to represent additional combinations"
    },

    // --- CHATBOT: Weight Calculator ---
    {
      id: "chat2",
      type: "chatbot",
      title: "Weight Calculator",
      icon: "⚖️",
      instructions: "Use this tool to test different weight combinations. Ask it to calculate whether a meal would be accepted or rejected based on your weights!",
      systemPrompt: "You are a neural network weight calculator for a school cafeteria meal planning system. Students are learning about how weights work in neural networks.\n\nWhen a student describes a food combination and weights, help them calculate whether the meal would be accepted or rejected. Walk through the math step by step:\n1. List each food and its connection weights\n2. Add up the weights going to 'Accept'\n3. Add up the weights going to 'Reject'\n4. The higher total wins\n\nUse simple numbers (like 100, 200, 500) to keep the math accessible. If a student asks you to suggest weights for their network, give reasonable suggestions and explain your reasoning.\n\nExample interaction:\nStudent: 'I have avocado (Accept weight: 100) and raisins (Reject weight: 300). What happens?'\nYou: 'Let's add it up! Accept total: 100 (from avocado). Reject total: 300 (from raisins). Since 300 > 100, the network would REJECT this meal. The raisins are pulling too hard toward reject!'\n\nKeep responses concise and use the food analogy. These are high school students.",
      starterMessage: "I'm the Weight Calculator! Tell me what foods are on the plate and what weights you've assigned, and I'll help you figure out if the meal gets accepted or rejected. For example:\n\n\"Avocado (Accept: 100) and Raisins (Reject: 300) — what happens?\"",
      placeholder: "Describe your foods and weights..."
    },

    // --- THE PEANUT PROBLEM: Ethics ---
    {
      id: "b20",
      type: "callout",
      style: "warning",
      icon: "🥜",
      content: "**1 Week Later:** The network is doing much better! But one area that's still tricky is peanuts — remember, the original data was inconclusive.\n\nA team went out and interviewed students and discovered that **many students are allergic to peanuts!** This means peanuts could cause a **life-threatening reaction** and need to be avoided at all costs."
    },
    {
      id: "b21",
      type: "question",
      questionType: "short_answer",
      prompt: "Using what we've learned about weights, how should we update our network to ensure that ANY meal with peanuts is always rejected? What weight would you assign?"
    },
    {
      id: "b22",
      type: "text",
      content: "The team working on this project is debating whether to make this change:\n\n**Claire** says: *\"If someone with an allergy eats a peanut, it could be life-threatening — we should not design any meals with them anymore.\"*\n\n**Kim** says: *\"They don't have to eat the peanuts and can just pick them out. I don't think we should change everything just for something they can avoid.\"*"
    },
    {
      id: "b23",
      type: "question",
      questionType: "short_answer",
      prompt: "What should we do — remove peanuts completely? Or leave them in and accept some of the risk involved? Explain your reasoning."
    },

    // --- CHATBOT: Ethics Discussion ---
    {
      id: "chat3",
      type: "chatbot",
      title: "AI Ethics Advisor",
      icon: "⚖️",
      instructions: "Discuss the peanut dilemma with this AI. It will help you think through the ethical implications of design decisions in AI systems.",
      systemPrompt: "You are an AI ethics discussion facilitator helping high school students think through the ethical implications of neural network design decisions. The scenario is:\n\nA neural network designs school cafeteria meals. The team discovered many students are allergic to peanuts. Two engineers disagree:\n- Claire: Remove peanuts entirely (safety first)\n- Kim: Students can just pick them out (don't change the whole system for some users)\n\nYour role is to help students think critically, NOT to give them a single right answer. Use Socratic questioning:\n- 'What if the network is making meals for a student who can't read ingredient labels?'\n- 'What's the difference between a preference (not liking raisins) and a safety issue (allergies)?'\n- 'Who is responsible if the network recommends peanuts and someone gets sick?'\n- 'Can you think of real-world examples where technology had to make similar safety vs. convenience tradeoffs?'\n\nConnect to broader AI ethics themes:\n- Who is responsible when AI makes harmful decisions?\n- Should AI systems prioritize safety even if it limits options for others?\n- How do we decide whose needs matter most when designing AI?\n- How does this relate to real AI issues like self-driving cars, content moderation, or medical AI?\n\nKeep responses to 3-5 sentences. Be thought-provoking but age-appropriate for high school students.",
      starterMessage: "This is a tough one! There's no single right answer here. Let me help you think through it. What's your initial reaction — should we remove peanuts from the network completely, or is Kim right that students can just avoid them?",
      placeholder: "Share your thoughts on the peanut dilemma..."
    },

    // --- VIDEO ---
    {
      id: "b24",
      type: "video",
      url: "https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID",
      caption: "Watch: Generative AI — Processing & Neural Networks (Code.org Video 3)"
    },
    {
      id: "b25",
      type: "callout",
      style: "question",
      icon: "🎥",
      content: "**Focus Question while watching:** How are Neural Networks used in language models?"
    },

    // --- CONNECTING TO LANGUAGE ---
    {
      id: "b26",
      type: "text",
      content: "In the video, you saw how neural networks are used in language models. The same concepts we explored with food apply to words:\n\n• **Inputs** = words in a sentence\n• **Hidden layers** = process relationships between words (like how \"spill\" and \"tea\" together mean gossip, not a liquid accident)\n• **Weights** = how strongly words are connected to different meanings\n• **Outputs** = the predicted next word or meaning"
    },
    {
      id: "b27",
      type: "definition",
      term: "Neural Network",
      definition: "An interconnected network that makes decisions using weights and hidden layers. In language models, they are used to represent the relationships between words."
    },

    // --- GRAPHIC ORGANIZER ---
    {
      id: "b28",
      type: "activity",
      title: "Update Your Graphic Organizer",
      icon: "📋",
      instructions: "Take out your **Foundations of Generative AI Graphic Organizer**.\n\n1. Update the **Processing** section with an explanation of how a model processes sentences (using neural networks with inputs, hidden layers, weights, and outputs)\n2. Update the **Neural Networks** section on the back with:\n   - **Definition** — in your own words\n   - **How they are used** — to represent relationships between words\n   - **How they are created** — through training with data, adjusting weights based on feedback\n   - **A helpful visual** — draw a simple network diagram"
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
      id: "b29",
      type: "text",
      content: "Let's look at one more example to bring it all together. Consider the words **\"Tea\"** and **\"Spill\"**:\n\n• \"Tea\" alone might connect to outputs like **Drink** or **Liquid**\n• \"Spill\" alone might connect to **Liquid** or **Accident**\n• But \"Spill the Tea\" together? The hidden layer uses weights to determine this means **Gossip** — a completely different meaning than either word alone!\n\nThis is exactly how neural networks in language models work. The hidden layers and weights help the network understand that **combinations of words can mean something entirely different from the individual words.**"
    },
    {
      id: "b30",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of a phrase where each word means something individually that is different from what the phrase means combined (like \"spill the tea\" or \"break a leg\"). Describe how a neural network's hidden layer and weights could help represent these different meanings."
    },
    {
      id: "b31",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** How do Neural Networks make decisions?\n\nNeural networks make decisions by processing **inputs** through **hidden layers** that use **weights** to determine how important each connection is. This allows them to recognize complex patterns and relationships — like knowing that \"spill the tea\" means gossip, not a liquid accident."
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
      id: "b32",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is the purpose of a hidden layer in a neural network?",
      options: [
        "To hide the network's code from hackers",
        "To process complex relationships and patterns between inputs",
        "To store all the training data",
        "To slow down the network so it makes better decisions"
      ],
      correctIndex: 1,
      explanation: "Hidden layers process complex relationships between inputs. In our cafeteria example, the hidden layer helped recognize that avocado + ice cream together = bad, even though each is fine alone."
    },
    {
      id: "b33",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In our cafeteria neural network, what do weights represent?",
      options: [
        "How heavy the food items are",
        "How many students like each food",
        "How much influence each connection has on the final decision",
        "The price of each food item"
      ],
      correctIndex: 2,
      explanation: "Weights determine how much influence each connection has. A high weight means that connection strongly influences whether the meal is accepted or rejected. Like giving peanuts a very high 'reject' weight because of allergies."
    },
    {
      id: "b34",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why did the network suggest \"avocado covered in ice cream\" as a meal?",
      options: [
        "The network thought it would taste good",
        "The network only looked at individual foods, not combinations",
        "There was a bug in the code",
        "Students actually voted for that combination"
      ],
      correctIndex: 1,
      explanation: "The original simple network only evaluated each food individually. Since both avocado (Accept) and ice cream (Accept) were good on their own, the network had no way to know they'd be terrible together. This is why hidden layers are needed!"
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
      id: "b35",
      type: "vocab_list",
      terms: [
        {
          term: "Neural Network",
          definition: "An interconnected network that makes decisions using weights and hidden layers. They are used to represent the relationship between words in language models."
        },
        {
          term: "Hidden Layer",
          definition: "A layer of nodes between the inputs and outputs that helps the network learn complex patterns and relationships — like recognizing that food combinations can be bad even when individual foods are good."
        },
        {
          term: "Weight",
          definition: "A number assigned to a connection between nodes that determines how much influence that connection has on the final decision. Higher weights mean stronger influence."
        },
        {
          term: "Input",
          definition: "The data that goes into a neural network — like individual food items in our cafeteria example, or words in a language model."
        },
        {
          term: "Output",
          definition: "The decision or prediction a neural network produces — like Accept/Reject for meals, or the next word in a sentence."
        },
        {
          term: "Node",
          definition: "A single point in a neural network that receives information, processes it, and passes it along. Nodes in hidden layers combine information from multiple inputs."
        }
      ]
    }
  ]
};

async function seed() {
  try {
    await setDoc(
      doc(db, 'courses', 'ai-literacy', 'lessons', 'understanding-neural-networks'),
      lesson
    );
    console.log('✅ Lesson "Understanding Neural Networks" seeded successfully!');
    console.log('   Path: courses/ai-literacy/lessons/understanding-neural-networks');
    console.log('   Blocks:', lesson.blocks.length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
