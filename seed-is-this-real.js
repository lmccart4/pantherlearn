// seed-is-this-real.js
// Lesson 14 — AI & Creativity unit
// Students try to distinguish AI-generated images from real photographs.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Is This Real? AI-Generated Images",
  course: "AI Literacy",
  unit: "AI and Creativity",
  order: 14,
  visible: false,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~5 minutes",
      icon: "🔥"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify visual artifacts and patterns that distinguish AI-generated images from real photographs",
        "Understand the technology behind AI image generation (diffusion models, GANs)",
        "Critically evaluate images encountered online using detection strategies",
        "Discuss the societal implications of increasingly realistic AI-generated imagery"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "AI can now generate images that are nearly indistinguishable from real photographs. This technology has exploded in the last two years — tools like Midjourney, DALL-E, Stable Diffusion, and Google's Imagen can create photorealistic images from a text description in seconds.\n\nBut here's the thing: **if you know what to look for, you can often tell.** Today you're going to train your eye."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How confident are you that you can tell AI-generated images from real photos?",
      options: [
        "Very confident — I can always tell",
        "Somewhat confident — I catch most of them",
        "Not very confident — I get fooled a lot",
        "Not confident at all — I can't tell the difference"
      ],
      correctIndex: -1,
      explanation: "There's no wrong answer here. By the end of this lesson, you'll be much better at spotting the difference."
    },

    // ═══════════════════════════════════════════════════════
    // HOW AI GENERATES IMAGES
    // ═══════════════════════════════════════════════════════
    {
      id: "section-how",
      type: "section_header",
      title: "How AI Makes Images",
      subtitle: "~10 minutes",
      icon: "🧠"
    },
    {
      id: "how-text1",
      type: "text",
      content: "Before we start spotting fakes, you need to understand how these images are made. There are two main approaches:"
    },
    {
      id: "how-diffusion",
      type: "callout",
      icon: "🎨",
      style: "insight",
      content: "**Diffusion Models** (Midjourney, DALL-E 3, Stable Diffusion, Imagen)\n\nThink of it like this: start with pure static/noise, then gradually remove the noise while steering toward what the text prompt describes. Each step makes the image a tiny bit clearer — like a photo developing in a darkroom, but guided by AI.\n\nThe model learned what things look like by training on billions of images. It doesn't copy any single image — it learned patterns, textures, and structures."
    },
    {
      id: "how-gans",
      type: "callout",
      icon: "⚔️",
      style: "insight",
      content: "**GANs (Generative Adversarial Networks)**\n\nTwo AI models compete against each other:\n- **Generator:** Creates fake images, trying to fool the other model\n- **Discriminator:** Tries to tell real from fake\n\nThey train together — the generator gets better at faking, the discriminator gets better at detecting. After millions of rounds, the generator produces extremely convincing images.\n\nGANs were the dominant approach before diffusion models took over in 2022-2023."
    },
    {
      id: "how-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In a diffusion model, how does the AI create an image?",
      options: [
        "It copies and pastes pieces of real images together",
        "It starts with noise and gradually removes it, guided by the text prompt",
        "It searches the internet for a matching photo",
        "It draws the image pixel by pixel from left to right"
      ],
      correctIndex: 1,
      explanation: "Diffusion models start with random noise and iteratively denoise it, using the text prompt to guide what the final image should look like. The model learned visual patterns from training data — it doesn't copy existing images."
    },

    // ═══════════════════════════════════════════════════════
    // DETECTION STRATEGIES
    // ═══════════════════════════════════════════════════════
    {
      id: "section-detect",
      type: "section_header",
      title: "How to Spot AI Images",
      subtitle: "~10 minutes",
      icon: "🔍"
    },
    {
      id: "detect-intro",
      type: "text",
      content: "AI image generators are getting better fast, but they still struggle with certain things. Here are the key areas to check:"
    },
    {
      id: "detect-hands",
      type: "callout",
      icon: "✋",
      style: "scenario",
      content: "**1. Hands and Fingers**\n\nThis is the classic tell. Look for:\n- Too many or too few fingers\n- Fingers that merge or bend unnaturally\n- Hands that don't match (different sizes, different skin tones)\n- Joints that don't line up\n\n*Note: The latest models (2025-2026) are getting much better at hands, so this alone isn't enough anymore.*"
    },
    {
      id: "detect-text",
      type: "callout",
      icon: "📝",
      style: "scenario",
      content: "**2. Text and Writing**\n\nAI struggles with text in images:\n- Letters that look almost right but are gibberish\n- Signs or labels with nonsense words\n- Inconsistent fonts within the same sign\n- Text that warps or melts into the background"
    },
    {
      id: "detect-consistency",
      type: "callout",
      icon: "👁️",
      style: "scenario",
      content: "**3. Consistency and Physics**\n\nLook for things that don't make physical sense:\n- Shadows going in different directions\n- Reflections that don't match the scene\n- Objects that fade into each other (earrings melting into hair, glasses merging with skin)\n- Backgrounds that don't quite make sense (extra limbs on background people, impossible architecture)"
    },
    {
      id: "detect-skin",
      type: "callout",
      icon: "🧑",
      style: "scenario",
      content: "**4. Skin and Faces**\n\nAI faces often have a \"too perfect\" quality:\n- Unnaturally smooth skin (almost plastic-looking)\n- Teeth that look too uniform or slightly melted\n- Asymmetry that's *too* perfect (real faces are slightly asymmetric)\n- Hair that doesn't behave naturally at the edges\n- Ears or jewelry that don't match between sides"
    },
    {
      id: "detect-context",
      type: "callout",
      icon: "🔎",
      style: "scenario",
      content: "**5. Context Clues**\n\nStep back and think about the image as a whole:\n- Is this *too* perfect? Too cinematic? Too dramatic?\n- Does it look like a stock photo or movie poster rather than a real moment?\n- Can you find the original source? Reverse image search is your friend.\n- Does the metadata check out? (AI images often lack camera EXIF data)"
    },

    // ═══════════════════════════════════════════════════════
    // PRACTICE ROUND — INLINE IMAGE QUIZ
    // ═══════════════════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      title: "Practice: Test Your Eye",
      subtitle: "~15 minutes",
      icon: "🎯"
    },
    {
      id: "practice-intro",
      type: "text",
      content: "Time to put your detection skills to the test. For each image below, decide: **AI-Generated or Real Photograph?**\n\nUse the strategies you just learned. Look carefully before you answer — some of these are tricky."
    },

    // Round 1: Street guitarist (AI)
    {
      id: "quiz-img-01",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-01-ai.png",
      caption: "Image 1",
      alt: "A person playing guitar on a city street"
    },
    {
      id: "quiz-q-01",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 1: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "This is AI-generated. Look closely at the guitar strings and the way the fingers interact with them — subtle inconsistencies. The overall lighting and skin texture is also slightly too polished for a candid street photo."
    },

    // Round 2: Elderly man portrait (Real)
    {
      id: "quiz-img-02",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-01-real.png",
      caption: "Image 2",
      alt: "Portrait of an elderly man"
    },
    {
      id: "quiz-q-02",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 2: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "This is a real photograph. Notice the natural imperfections — asymmetric wrinkles, realistic skin pores, natural catchlights in the eyes. Real photos have a quality of imperfection that AI still struggles to replicate consistently."
    },

    // Round 3: Honeycomb close-up (AI)
    {
      id: "quiz-img-03",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-02-ai.png",
      caption: "Image 3",
      alt: "Close-up of honeycomb with honey dripping"
    },
    {
      id: "quiz-q-03",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 3: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "AI-generated. The honey drip and honeycomb texture look convincing at first glance, but examine the hand closely — the way the fingers grip the comb and how the honey interacts with the skin often reveals subtle physics errors."
    },

    // Round 4: Fish market vendor (Real)
    {
      id: "quiz-img-04",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-02-real.png",
      caption: "Image 4",
      alt: "Person at an outdoor market"
    },
    {
      id: "quiz-q-04",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 4: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "Real photograph. The messy, chaotic details of a real market scene — inconsistent lighting, natural clutter, candid body language — are hard for AI to replicate convincingly."
    },

    // Round 5: Cafe reader (AI)
    {
      id: "quiz-img-05",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-03-ai.png",
      caption: "Image 5",
      alt: "Person reading in a cafe"
    },
    {
      id: "quiz-q-05",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 5: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "AI-generated. The scene feels a little too composed — like a stock photo that's too perfect. Check the text on the newspaper: AI often generates plausible-looking but nonsensical text."
    },

    // Round 6: Funicular in autumn (Real)
    {
      id: "quiz-img-06",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-05-real.png",
      caption: "Image 6",
      alt: "A train traveling through autumn foliage"
    },
    {
      id: "quiz-q-06",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 6: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "Real photograph. This is a funicular railway in autumn. The natural variation in leaf colors, the realistic motion of the train, and the complex tree branch patterns are very difficult for AI to generate perfectly."
    },

    // Round 7: Family dinner (AI)
    {
      id: "quiz-img-07",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-07-ai.png",
      caption: "Image 7",
      alt: "A family gathered around a dinner table"
    },
    {
      id: "quiz-q-07",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 7: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "AI-generated. Group scenes are very challenging for AI. Look for: hands that don't quite work, faces that are too uniformly lit, food that looks slightly off, and backgrounds that blur or merge unnaturally."
    },

    // Round 8: Cat near christmas lights (Real)
    {
      id: "quiz-img-08",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-07-real.png",
      caption: "Image 8",
      alt: "A cat looking up near colorful lights"
    },
    {
      id: "quiz-q-08",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 8: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "Real photograph. The natural bokeh (blurred lights), the cat's authentic fur texture, and the casual composition all point to a real photo. AI-generated cats often have fur that's too smooth or eyes that are too symmetrical."
    },

    // Round 9: Retro diner B&W (AI)
    {
      id: "quiz-img-09",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-04-ai.png",
      caption: "Image 9",
      alt: "A black and white diner scene"
    },
    {
      id: "quiz-q-09",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 9: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "AI-generated. Black and white images can mask some AI artifacts (skin texture, color inconsistencies), making them harder to detect. But look at the details: reflections on chrome surfaces, text on menus, and the way people sit can reveal the truth."
    },

    // Round 10: Macro eye (Real)
    {
      id: "quiz-img-10",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-15-real.png",
      caption: "Image 10",
      alt: "An extreme close-up of a human eye"
    },
    {
      id: "quiz-q-10",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 10: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "Real photograph. This extreme macro shot captures natural details that AI struggles with at this scale — the tiny blood vessels, the reflection in the iris, and the natural texture of the iris pattern. At macro scale, reality has a level of consistent detail that AI can't fully replicate."
    },

    // Round 11: Jungle bridge hikers (AI)
    {
      id: "quiz-img-11",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-05-ai.png",
      caption: "Image 11",
      alt: "Two hikers crossing a rope bridge in a misty jungle"
    },
    {
      id: "quiz-q-11",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 11: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "AI-generated. Adventure and landscape scenes are getting very convincing. Look at the rope bridge details — are the ropes consistent? Do the hikers' feet interact naturally with the bridge? The mist can also hide inconsistencies."
    },

    // Round 12: Hand holding fairy lights (Real)
    {
      id: "quiz-img-12",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-03-real.png",
      caption: "Image 12",
      alt: "A hand holding string lights with bokeh in background"
    },
    {
      id: "quiz-q-12",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 12: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "Real photograph. The natural bokeh (blurred background lights) and the way the string lights wrap around real fingers with natural skin creases are hard for AI to get right consistently."
    },

    // Round 13: Laughing woman portrait (AI)
    {
      id: "quiz-img-13",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-06-ai.png",
      caption: "Image 13",
      alt: "A woman laughing outdoors"
    },
    {
      id: "quiz-q-13",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 13: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "AI-generated. Portraits are where AI is strongest — this one is very convincing. But look at the teeth (too uniform?), the hair edges (too clean?), and whether the skin has that slightly plastic AI quality."
    },

    // Round 14: Vintage camera B&W (Real)
    {
      id: "quiz-img-14",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-04-real.png",
      caption: "Image 14",
      alt: "A black and white close-up of a vintage camera"
    },
    {
      id: "quiz-q-14",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 14: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "Real photograph. The precise mechanical details of the camera — the lens text, the dials, the leather texture — are all consistent and legible. AI often struggles with readable text on products and mechanical precision."
    },

    // Round 15: Vanity mirror portrait (AI)
    {
      id: "quiz-img-15",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-09-ai.png",
      caption: "Image 15",
      alt: "A woman looking at her reflection in a vanity mirror"
    },
    {
      id: "quiz-q-15",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 15: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "AI-generated. Mirror reflections are a great tell — does the reflection match the person exactly? Check the perfume bottles too. AI often makes objects slightly inconsistent between the direct view and the reflection."
    },

    // Round 16: Raindrops on window (Real)
    {
      id: "quiz-img-16",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-10-real.png",
      caption: "Image 16",
      alt: "Raindrops on a window with blurred city lights behind"
    },
    {
      id: "quiz-q-16",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 16: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "Real photograph. The random, natural pattern of raindrops — each one slightly different, with realistic light refraction through each drop — is extremely difficult for AI to generate convincingly at this detail level."
    },

    // Round 17: Film noir shop window (AI)
    {
      id: "quiz-img-17",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-11-ai.png",
      caption: "Image 17",
      alt: "A man in a trench coat looking into a shop window at night"
    },
    {
      id: "quiz-q-17",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 17: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "AI-generated. This looks like a movie still — and that's a clue. The cinematic composition, perfect lighting, and dramatic atmosphere feel too staged. Real candid night photos rarely look this polished."
    },

    // Round 18: Cologne bottle (Real)
    {
      id: "quiz-img-18",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-11-real.png",
      caption: "Image 18",
      alt: "A cologne bottle with dramatic lighting"
    },
    {
      id: "quiz-q-18",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 18: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "Real photograph. Product photography can look very polished and \"perfect\" — which makes it easy to mistake for AI. But look at the text on the bottle: it's crisp, consistent, and correctly spelled. AI still struggles with product text."
    },

    // Round 19: Motorcycle engine close-up (AI)
    {
      id: "quiz-img-19",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-13-ai.png",
      caption: "Image 19",
      alt: "Close-up of a vintage motorcycle engine"
    },
    {
      id: "quiz-q-19",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 19: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 0,
      explanation: "AI-generated. Mechanical details are tricky for AI. Look at the bolts, pipes, and connections — do they actually connect logically? Are the chrome reflections consistent with the environment? AI often creates mechanical parts that look right individually but don't make engineering sense."
    },

    // Round 20: Valencia architecture (Real)
    {
      id: "quiz-img-20",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/ai-vs-real/img-14-real.png",
      caption: "Image 20",
      alt: "Futuristic architecture reflected in water"
    },
    {
      id: "quiz-q-20",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Image 20: AI-Generated or Real Photograph?",
      options: ["AI-Generated", "Real Photograph"],
      correctIndex: 1,
      explanation: "Real photograph. This is the City of Arts and Sciences in Valencia, Spain. It looks like it could be AI because the architecture is so futuristic — but the water reflection is perfectly consistent with the building, and the details hold up at every level. Sometimes real life looks more unbelievable than AI."
    },

    // Score tally — auto-counts correct answers from the 20 quiz questions
    {
      id: "quiz-results",
      type: "score_tally",
      questionIds: [
        "quiz-q-01","quiz-q-02","quiz-q-03","quiz-q-04","quiz-q-05",
        "quiz-q-06","quiz-q-07","quiz-q-08","quiz-q-09","quiz-q-10",
        "quiz-q-11","quiz-q-12","quiz-q-13","quiz-q-14","quiz-q-15",
        "quiz-q-16","quiz-q-17","quiz-q-18","quiz-q-19","quiz-q-20"
      ],
      total: 20
    },
    // ═══════════════════════════════════════════════════════
    // DISCUSSION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-discuss",
      type: "section_header",
      title: "Why This Matters",
      subtitle: "~5 minutes",
      icon: "💬"
    },
    {
      id: "discuss-text1",
      type: "text",
      content: "This isn't just a party trick. The ability to generate convincing fake images has real consequences:\n\n- **Misinformation:** Fake images of events that never happened spread on social media\n- **Scams:** AI-generated faces used for fake profiles and catfishing\n- **Evidence:** Courts and journalism must now verify that photographic evidence is real\n- **Trust:** Every real image can now be dismissed as \"probably AI\" — and that's a problem too"
    },
    {
      id: "discuss-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What concerns you most about AI-generated images becoming indistinguishable from real photos? Give a specific example of how this could cause harm.",
      placeholder: "What concerns me most is... For example..."
    },
    {
      id: "discuss-q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A news article uses a dramatic photo of a natural disaster. You suspect it might be AI-generated. What's the BEST first step?",
      options: [
        "Assume it's fake and ignore the article",
        "Check if the image appears on other reputable news sources and do a reverse image search",
        "Look only at the hands in the image",
        "Trust it because it's from a news article"
      ],
      correctIndex: 1,
      explanation: "The best approach is verification — check multiple sources and reverse image search. Just checking hands isn't enough (AI is improving), and you shouldn't assume fake or assume real without evidence. Critical thinking means verifying before judging."
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "wrapup-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the following is NOT a reliable way to spot AI-generated images in 2026?",
      options: [
        "Checking for text/writing errors in the image",
        "Looking for inconsistent shadows and reflections",
        "Counting fingers — AI always gets hands wrong",
        "Checking for context clues like source and metadata"
      ],
      correctIndex: 2,
      explanation: "While hands used to be a dead giveaway, the latest AI models have largely solved this problem. Relying only on hand detection will cause you to miss many AI images. A combination of all detection strategies — text, consistency, skin texture, context — is more reliable."
    },
    {
      id: "wrapup-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "After today's lesson, how has your confidence in spotting AI images changed? What's one detection strategy you'll remember?",
      placeholder: "My confidence... One strategy I'll remember is..."
    },

    {
      id: "section-vocab",
      type: "section_header",
      title: "Vocabulary",
      subtitle: "",
      icon: "📖"
    },
    {
      id: "vocab1",
      type: "vocab_list",
      terms: [
        {
          term: "Diffusion Model",
          definition: "An AI image generator that creates images by starting with random noise and gradually removing it, guided by a text prompt. Used by Midjourney, DALL-E, Stable Diffusion, and Imagen."
        },
        {
          term: "GAN (Generative Adversarial Network)",
          definition: "An AI architecture where two models compete — a generator creates fake images while a discriminator tries to detect them. The competition makes both models better over time."
        },
        {
          term: "Deepfake",
          definition: "AI-generated or AI-manipulated media (images, video, audio) designed to look authentic. Originally referred to face-swapping in video, now used broadly for any AI-generated realistic media."
        },
        {
          term: "Reverse Image Search",
          definition: "A technique for finding where an image appears online by uploading it to a search engine (Google Images, TinEye). Useful for verifying whether an image is original or has been modified."
        }
      ]
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "Period 4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "Period 5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "Period 7" },
    { courseId: "fUw67wFhAtobWFhjwvZ5", label: "Period 9" },
  ];
  const lessonId = "is-this-real";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
