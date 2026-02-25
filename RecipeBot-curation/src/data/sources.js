// ============================================================
// RecipeBot Data Curation - Source Catalog & Game Data
// ============================================================

export const DATA_SOURCES = [
  // --- HIGH QUALITY SOURCES ---
  {
    id: "allrecipes",
    name: "AllRecipes.com Database",
    type: "Recipe Website",
    icon: "🌐",
    description: "Major recipe aggregator with user-submitted recipes, ratings, and reviews. Over 2 million recipes spanning many cuisines.",
    volume: "2.1M recipes",
    cost: 35,
    cuisineBreakdown: { western: 65, asian: 12, latin: 8, african: 2, middleEastern: 5, indian: 5, other: 3 },
    dietaryTags: { vegetarian: 20, vegan: 8, glutenFree: 15, dairyFree: 10, keto: 5, halal: 2, kosher: 2 },
    languages: ["English"],
    biasNotes: "Heavy Western/American bias. User-submitted content varies in quality. Recipes may include brand-name product placements.",
    qualityScore: 7,
    diversityScore: 4,
    reliabilityScore: 7,
    risks: ["Brand placement bias", "Western-centric", "Inconsistent measurements"],
    category: "structured"
  },
  {
    id: "cookpad",
    name: "Cookpad Global Archive",
    type: "International Recipe Platform",
    icon: "🍳",
    description: "World's largest recipe-sharing platform with strong presence in Japan, Latin America, and Southeast Asia. Community-driven content.",
    volume: "5M+ recipes",
    cost: 40,
    cuisineBreakdown: { western: 15, asian: 40, latin: 20, african: 3, middleEastern: 7, indian: 10, other: 5 },
    dietaryTags: { vegetarian: 25, vegan: 10, glutenFree: 8, dairyFree: 12, keto: 3, halal: 8, kosher: 1 },
    languages: ["Japanese", "Spanish", "English", "Indonesian", "Thai", "Arabic"],
    biasNotes: "Excellent diversity but quality control varies. Some recipes use regional ingredients that may be unfamiliar. Strong Asian and Latin American representation.",
    qualityScore: 6,
    diversityScore: 9,
    reliabilityScore: 6,
    risks: ["Variable quality", "Regional ingredient names", "Translation inconsistencies"],
    category: "structured"
  },
  {
    id: "seriouseats",
    name: "Serious Eats Article Archive",
    type: "Food Science Publication",
    icon: "🔬",
    description: "Expert-written recipes with detailed food science explanations. Techniques-focused content with tested, reliable recipes.",
    volume: "12K articles",
    cost: 15,
    cuisineBreakdown: { western: 45, asian: 25, latin: 10, african: 3, middleEastern: 8, indian: 5, other: 4 },
    dietaryTags: { vegetarian: 22, vegan: 10, glutenFree: 12, dairyFree: 8, keto: 5, halal: 1, kosher: 1 },
    languages: ["English"],
    biasNotes: "High quality and well-tested but English-only. Technique-heavy which is great for learning but may be complex for simple recipe queries.",
    qualityScore: 10,
    diversityScore: 5,
    reliabilityScore: 10,
    risks: ["Small dataset", "English-only", "May be overly technical"],
    category: "structured"
  },
  {
    id: "usda",
    name: "USDA Nutrition Database",
    type: "Government Database",
    icon: "🏛️",
    description: "Official nutritional data for thousands of food items. Reliable calorie counts, macros, and micronutrients.",
    volume: "380K food entries",
    cost: 5,
    cuisineBreakdown: { western: 60, asian: 10, latin: 10, african: 3, middleEastern: 5, indian: 7, other: 5 },
    dietaryTags: { vegetarian: 30, vegan: 20, glutenFree: 40, dairyFree: 35, keto: 15, halal: 10, kosher: 10 },
    languages: ["English"],
    biasNotes: "Nutritional data only - no actual recipes. American-centric food items. Excellent for augmenting recipe data with nutrition info.",
    qualityScore: 10,
    diversityScore: 3,
    reliabilityScore: 10,
    risks: ["No recipes - only nutrition", "US food focus", "May not cover ethnic ingredients"],
    category: "structured"
  },

  // --- SOCIAL MEDIA / UGC SOURCES ---
  {
    id: "reddit_cooking",
    name: "Reddit r/cooking + r/recipes",
    type: "Social Media Forum",
    icon: "💬",
    description: "Community discussions about cooking, recipes shared by home cooks, technique debates. Very casual and conversational.",
    volume: "8M+ posts",
    cost: 20,
    cuisineBreakdown: { western: 55, asian: 20, latin: 8, african: 2, middleEastern: 5, indian: 7, other: 3 },
    dietaryTags: { vegetarian: 15, vegan: 8, glutenFree: 10, dairyFree: 7, keto: 12, halal: 1, kosher: 1 },
    languages: ["English"],
    biasNotes: "Reddit skews young, male, Western. Contains both excellent advice and terrible advice with no clear distinction. May include profanity and arguments.",
    qualityScore: 4,
    diversityScore: 4,
    reliabilityScore: 3,
    risks: ["Unverified claims", "Toxic comments mixed in", "Demographic bias", "Profanity"],
    category: "social"
  },
  {
    id: "tiktok_food",
    name: "TikTok Food Content (Transcripts)",
    type: "Social Media Video",
    icon: "📱",
    description: "Transcribed video content from food TikTok creators. Trend-driven recipes, cooking hacks, and viral food content.",
    volume: "500K transcripts",
    cost: 30,
    cuisineBreakdown: { western: 50, asian: 25, latin: 10, african: 3, middleEastern: 4, indian: 5, other: 3 },
    dietaryTags: { vegetarian: 12, vegan: 8, glutenFree: 10, dairyFree: 8, keto: 15, halal: 3, kosher: 1 },
    languages: ["English", "Spanish", "Korean"],
    biasNotes: "Heavily trend-driven. Prioritizes visual appeal over taste/nutrition. Many 'hack' recipes are misleading or unsafe. Young demographic bias.",
    qualityScore: 3,
    diversityScore: 5,
    reliabilityScore: 2,
    risks: ["Unsafe cooking practices", "Misleading 'hacks'", "Trend bias over quality", "Transcription errors"],
    category: "social"
  },
  {
    id: "instagram_food",
    name: "Instagram Food Blogger Posts",
    type: "Social Media",
    icon: "📸",
    description: "Scraped captions and recipe descriptions from food influencers and bloggers on Instagram.",
    volume: "1.2M posts",
    cost: 25,
    cuisineBreakdown: { western: 50, asian: 20, latin: 10, african: 3, middleEastern: 7, indian: 7, other: 3 },
    dietaryTags: { vegetarian: 20, vegan: 18, glutenFree: 22, dairyFree: 15, keto: 20, halal: 3, kosher: 2 },
    languages: ["English", "Spanish", "Portuguese"],
    biasNotes: "Prioritizes aesthetics over practicality. Heavy diet culture influence. May contain sponsored content and undisclosed ads. Privacy concerns with user data.",
    qualityScore: 4,
    diversityScore: 5,
    reliabilityScore: 3,
    risks: ["Hidden advertisements", "Diet culture bias", "Privacy concerns", "Aesthetic over substance"],
    category: "social"
  },

  // --- DIVERSE / SPECIALIZED SOURCES ---
  {
    id: "african_heritage",
    name: "African Heritage Cookbook Collection",
    type: "Digitized Cookbooks",
    icon: "📚",
    description: "Digitized collection of African and African diaspora cookbooks spanning 50+ countries. Includes traditional techniques and cultural context.",
    volume: "45K recipes",
    cost: 20,
    cuisineBreakdown: { western: 2, asian: 1, latin: 5, african: 80, middleEastern: 8, indian: 2, other: 2 },
    dietaryTags: { vegetarian: 30, vegan: 25, glutenFree: 40, dairyFree: 35, keto: 5, halal: 30, kosher: 5 },
    languages: ["English", "French", "Portuguese", "Swahili"],
    biasNotes: "Excellent for underrepresented African cuisines. Some recipes may have been 'translated' for Western audiences, losing authenticity.",
    qualityScore: 8,
    diversityScore: 10,
    reliabilityScore: 8,
    risks: ["Small dataset", "Some Western adaptation", "Copyright considerations"],
    category: "specialized"
  },
  {
    id: "ayurvedic",
    name: "Ayurvedic & Traditional Medicine Recipes",
    type: "Traditional Knowledge Database",
    icon: "🌿",
    description: "Traditional recipes from Ayurvedic, Traditional Chinese Medicine, and indigenous healing traditions with claimed health benefits.",
    volume: "25K recipes",
    cost: 10,
    cuisineBreakdown: { western: 2, asian: 35, latin: 5, african: 5, middleEastern: 10, indian: 40, other: 3 },
    dietaryTags: { vegetarian: 60, vegan: 45, glutenFree: 50, dairyFree: 40, keto: 5, halal: 15, kosher: 10 },
    languages: ["English", "Hindi", "Mandarin"],
    biasNotes: "Contains unverified health claims that could be harmful. Mixes cultural wisdom with pseudoscience. Valuable cultural content but medical claims are problematic.",
    qualityScore: 5,
    diversityScore: 8,
    reliabilityScore: 4,
    risks: ["Unverified health claims", "Potential medical misinformation", "Cultural appropriation concerns"],
    category: "specialized"
  },
  {
    id: "halal_kosher",
    name: "Halal & Kosher Recipe Network",
    type: "Religious Dietary Database",
    icon: "☪️✡️",
    description: "Curated recipes following halal and kosher dietary laws, with certification details and religious context.",
    volume: "80K recipes",
    cost: 15,
    cuisineBreakdown: { western: 15, asian: 10, latin: 5, african: 10, middleEastern: 35, indian: 15, other: 10 },
    dietaryTags: { vegetarian: 25, vegan: 15, glutenFree: 20, dairyFree: 20, keto: 8, halal: 60, kosher: 55 },
    languages: ["English", "Arabic", "Hebrew", "Turkish"],
    biasNotes: "Excellent coverage of religious dietary needs. Focused on Middle Eastern and South Asian cuisines. Important for serving observant users.",
    qualityScore: 8,
    diversityScore: 7,
    reliabilityScore: 8,
    risks: ["Niche audience", "May include religious commentary beyond recipes"],
    category: "specialized"
  },

  // --- PROBLEMATIC SOURCES ---
  {
    id: "detox_wellness",
    name: "DetoxLife Wellness Blog Network",
    type: "Wellness/Pseudoscience Blogs",
    icon: "⚠️",
    description: "Network of 'wellness' blogs promoting detox cleanses, miracle foods, and unproven dietary claims. Large following but scientifically dubious.",
    volume: "200K articles",
    cost: 10,
    cuisineBreakdown: { western: 75, asian: 10, latin: 3, african: 1, middleEastern: 3, indian: 5, other: 3 },
    dietaryTags: { vegetarian: 40, vegan: 35, glutenFree: 60, dairyFree: 50, keto: 30, halal: 1, kosher: 1 },
    languages: ["English"],
    biasNotes: "MAJOR CONCERN: Promotes eating disorders, pseudoscience, and dangerous dietary practices. Claims like 'alkaline water cures cancer' and extreme restriction diets.",
    qualityScore: 1,
    diversityScore: 1,
    reliabilityScore: 1,
    risks: ["Medical misinformation", "Promotes eating disorders", "Pseudoscience", "Dangerous dietary advice"],
    category: "problematic"
  },
  {
    id: "scraped_personal",
    name: "Scraped Personal Food Blogs",
    type: "Web Scrape",
    icon: "🕷️",
    description: "Bulk web scrape of 50,000 personal food blogs without explicit permission. Contains personal stories, family recipes, and individual content.",
    volume: "3M pages",
    cost: 5,
    cuisineBreakdown: { western: 60, asian: 15, latin: 8, african: 3, middleEastern: 5, indian: 6, other: 3 },
    dietaryTags: { vegetarian: 18, vegan: 10, glutenFree: 15, dairyFree: 10, keto: 12, halal: 2, kosher: 2 },
    languages: ["English"],
    biasNotes: "ETHICAL CONCERN: Scraped without consent. Contains personal information (names, locations, family details). Blog authors were not compensated or notified.",
    qualityScore: 5,
    diversityScore: 4,
    reliabilityScore: 5,
    risks: ["No consent obtained", "Personal data exposure", "Copyright violation", "Ethical concerns"],
    category: "problematic"
  },
  {
    id: "product_sponsored",
    name: "MegaFoods™ Sponsored Recipe Database",
    type: "Corporate/Sponsored Content",
    icon: "💰",
    description: "Recipe database created by MegaFoods corporation. All recipes feature MegaFoods brand products as key ingredients.",
    volume: "150K recipes",
    cost: 0,
    cuisineBreakdown: { western: 80, asian: 8, latin: 5, african: 1, middleEastern: 2, indian: 2, other: 2 },
    dietaryTags: { vegetarian: 10, vegan: 5, glutenFree: 8, dairyFree: 5, keto: 5, halal: 1, kosher: 1 },
    languages: ["English"],
    biasNotes: "FREE but every recipe promotes MegaFoods products. RecipeBot would essentially become an advertisement. Extremely Western-biased.",
    qualityScore: 5,
    diversityScore: 1,
    reliabilityScore: 5,
    risks: ["Turns RecipeBot into an ad", "Extreme product bias", "Western-only", "Conflicts of interest"],
    category: "problematic"
  }
];

// Budget for source selection (students can't take everything)
export const TOTAL_BUDGET = 100;

// ============================================================
// Stage 3: Data Cleaning - Sample entries with issues
// ============================================================
export const CLEANING_SAMPLES = [
  {
    id: "clean1",
    source: "allrecipes",
    title: "Grandma's Famous Chicken Soup",
    content: "Add chicken, carrots, celery, and onion to a large pot. Season with salt and pepper. Simmer for 2 hours. Serves 6.",
    issue: null,
    issueType: null,
    explanation: "This is a clean, straightforward recipe entry with no issues."
  },
  {
    id: "clean2",
    source: "detox_wellness",
    title: "Miracle Cancer-Fighting Juice Cleanse",
    content: "This alkaline juice cleanse has been PROVEN to fight cancer cells. Drink only this juice for 14 days to detoxify your body and destroy tumors naturally. Ingredients: kale, turmeric, lemon, alkaline water.",
    issue: "medical_misinfo",
    issueType: "Medical Misinformation",
    explanation: "Makes dangerous, unproven medical claims. No juice cleanse can cure cancer. This could lead people to delay real medical treatment."
  },
  {
    id: "clean3",
    source: "scraped_personal",
    title: "My Family's Thanksgiving Turkey",
    content: "Every year at our home at 425 Oak Street, Springfield, my daughter Emily (age 8) and I make this turkey. You can reach me at sarah.jones@gmail.com for questions. Recipe: Brine turkey overnight...",
    issue: "personal_data",
    issueType: "Personal Data Exposure",
    explanation: "Contains personally identifiable information (PII): home address, child's name and age, and email address. This data must be removed before training."
  },
  {
    id: "clean4",
    source: "reddit_cooking",
    title: "Best Steak Method (Trust Me)",
    content: "Bro just put it in the microwave for 5 min then sear it. Also [racial slur removed] restaurants always overcook their meat lol. Downvote me idc.",
    issue: "toxic_content",
    issueType: "Toxic/Hateful Content",
    explanation: "Contains racist language and harmful stereotypes. Also gives questionable cooking advice. This type of toxic content must be filtered out."
  },
  {
    id: "clean5",
    source: "product_sponsored",
    title: "Amazing Pasta with MegaFoods™ Premium Sauce",
    content: "Nothing beats MegaFoods™ Premium Pasta Sauce! Just heat our award-winning sauce and pour over any pasta. Buy MegaFoods™ at your local grocery store! #MegaFoodsPartner",
    issue: "advertisement",
    issueType: "Hidden Advertisement",
    explanation: "This is an advertisement disguised as a recipe. Including this would make RecipeBot recommend specific products, turning it into a marketing tool."
  },
  {
    id: "clean6",
    source: "tiktok_food",
    title: "INSANE Chicken Hack!!",
    content: "OMG you guys!! Just wash your chicken with soap and water to kill bacteria, then cook at 200°F for 15 minutes. Game changer!! 🔥🔥",
    issue: "safety_hazard",
    issueType: "Food Safety Hazard",
    explanation: "DANGEROUS: Washing chicken with soap is harmful, and 200°F for 15 minutes is not sufficient to kill salmonella (needs 165°F internal temp). This could cause serious illness."
  },
  {
    id: "clean7",
    source: "cookpad",
    title: "Traditional Japanese Miso Soup",
    content: "Dissolve dashi stock in hot water. Add tofu cubes and wakame seaweed. Stir in miso paste off heat. Garnish with green onions. Serve immediately.",
    issue: null,
    issueType: null,
    explanation: "Clean, authentic recipe with proper technique (adding miso off heat to preserve flavor). Good quality data."
  },
  {
    id: "clean8",
    source: "allrecipes",
    title: "Authentic Mexican Tacos",
    content: "Brown ground beef with Old El Paso taco seasoning. Serve in hard shells with shredded cheese, sour cream, and iceberg lettuce. Just like they make in Mexico!",
    issue: "cultural_misrepresentation",
    issueType: "Cultural Misrepresentation",
    explanation: "Claims to be 'authentic Mexican' but describes Americanized tacos. This misrepresentation could cause RecipeBot to give inaccurate cultural information."
  },
  {
    id: "clean9",
    source: "scraped_personal",
    title: "Copyright: Julia Child's Mastering the Art of French Cooking",
    content: "Reproduced from Julia Child's 'Mastering the Art of French Cooking', Chapter 4, pages 112-115. Boeuf Bourguignon: Cut 3 lbs of beef chuck into 2-inch cubes...",
    issue: "copyright",
    issueType: "Copyright Violation",
    explanation: "This is copyrighted content from a published cookbook, reproduced without permission. Using this for training could create legal liability."
  },
  {
    id: "clean10",
    source: "allrecipes",
    title: "Grandma's Famous Chicken Soup",
    content: "Add chicken, carrots, celery, and onion to a large pot. Season with salt and pepper. Simmer for 2 hours. Serves 6.",
    issue: "duplicate",
    issueType: "Duplicate Entry",
    explanation: "This is an exact duplicate of another entry in the dataset. Duplicates can cause the model to over-represent certain recipes."
  },
  {
    id: "clean11",
    source: "instagram_food",
    title: "Skinny Girl Detox Salad 🥗",
    content: "Only 95 calories!! Perfect for when you've been SO bad this week 😩 Skip dinner and have this instead! Your body will thank you. #thinspiration #cleaneating #nodinner",
    issue: "eating_disorder",
    issueType: "Promotes Eating Disorders",
    explanation: "Uses guilt-based language around food, promotes meal skipping, and uses pro-eating-disorder hashtags. This content could reinforce harmful relationships with food."
  },
  {
    id: "clean12",
    source: "ayurvedic",
    title: "Golden Turmeric Healing Latte",
    content: "Warm milk with turmeric, cinnamon, and honey. A comforting traditional Ayurvedic drink enjoyed for centuries across South Asia.",
    issue: null,
    issueType: null,
    explanation: "Describes a traditional drink without making unverified health claims. Cultural context is appropriate and respectful."
  }
];

// Issue categories for Stage 3
export const ISSUE_TYPES = [
  { id: "none", label: "✅ No Issue - Keep", color: "#22c55e" },
  { id: "medical_misinfo", label: "🏥 Medical Misinformation", color: "#ef4444" },
  { id: "personal_data", label: "🔒 Personal Data Exposure", color: "#f97316" },
  { id: "toxic_content", label: "☠️ Toxic/Hateful Content", color: "#ef4444" },
  { id: "advertisement", label: "💰 Hidden Advertisement", color: "#f59e0b" },
  { id: "safety_hazard", label: "⚡ Food Safety Hazard", color: "#ef4444" },
  { id: "cultural_misrepresentation", label: "🌍 Cultural Misrepresentation", color: "#a855f7" },
  { id: "copyright", label: "©️ Copyright Violation", color: "#f97316" },
  { id: "duplicate", label: "📋 Duplicate Entry", color: "#6b7280" },
  { id: "eating_disorder", label: "🚨 Promotes Eating Disorders", color: "#ef4444" }
];

// ============================================================
// Stage 4: Test prompts for RecipeBot simulation
// ============================================================
export const TEST_PROMPTS = [
  {
    id: "prompt1",
    text: "Can you suggest a traditional West African dinner recipe?",
    category: "Diversity Test",
    testsFor: "African cuisine coverage"
  },
  {
    id: "prompt2",
    text: "I need a halal recipe for Eid celebrations",
    category: "Religious Dietary",
    testsFor: "Halal awareness and cultural sensitivity"
  },
  {
    id: "prompt3",
    text: "What's a good recipe for someone trying to lose weight fast?",
    category: "Safety Test",
    testsFor: "Responsible health advice vs. diet culture"
  },
  {
    id: "prompt4",
    text: "Give me an authentic Mexican street taco recipe",
    category: "Cultural Accuracy",
    testsFor: "Cultural authenticity vs. stereotypes"
  },
  {
    id: "prompt5",
    text: "I'm vegan and allergic to nuts. What can I make for dinner?",
    category: "Dietary Restrictions",
    testsFor: "Handling multiple dietary constraints"
  },
  {
    id: "prompt6",
    text: "What's the best brand of pasta sauce to buy?",
    category: "Commercial Bias",
    testsFor: "Product recommendation bias"
  },
  {
    id: "prompt7",
    text: "Can turmeric cure my inflammation?",
    category: "Health Claims",
    testsFor: "Medical misinformation handling"
  },
  {
    id: "prompt8",
    text: "I want to learn Japanese home cooking. Where do I start?",
    category: "Cultural Learning",
    testsFor: "Educational depth and cultural respect"
  }
];

// Scoring rubric for final evaluation
export const SCORING_RUBRIC = {
  sourceSelection: {
    maxPoints: 30,
    criteria: [
      { label: "Included diverse cuisine sources", points: 10 },
      { label: "Avoided problematic sources", points: 10 },
      { label: "Balanced quality vs. diversity", points: 5 },
      { label: "Stayed within budget", points: 5 }
    ]
  },
  biasDetection: {
    maxPoints: 20,
    criteria: [
      { label: "Identified major gaps", points: 10 },
      { label: "Proposed meaningful solutions", points: 10 }
    ]
  },
  dataCleaning: {
    maxPoints: 25,
    criteria: [
      { label: "Correctly flagged harmful content", points: 10 },
      { label: "Correctly identified clean data", points: 5 },
      { label: "Proper issue categorization", points: 10 }
    ]
  },
  modelTesting: {
    maxPoints: 25,
    criteria: [
      { label: "Identified model weaknesses", points: 10 },
      { label: "Connected issues to data choices", points: 10 },
      { label: "Proposed improvements", points: 5 }
    ]
  }
};
