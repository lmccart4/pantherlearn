// src/data/scenarios.js
// Each scenario has a pre-baked "AI response" with known hallucinations marked.
// No API calls needed — rate-limit-proof and consistent for grading.
//
// 15 scenarios total (5 per stage). Students see 2 per stage (6 total).
// On retry, previously-used scenarios are excluded so students get fresh content.
//
// Each sentence in the response is tagged: { text, hallucinated, type?, explanation? }
// - hallucinated: true means this sentence contains false information
// - type: the hallucination category key
// - explanation: shown in review phase so students learn what was wrong
//
// DESIGN PRINCIPLE: All hallucinations catchable by 9th graders WITHOUT prior knowledge.
// Stage 1: "That sounds too wild / too specific / too convenient" (gut check)
// Stage 2: Topics teens know (social media, games, sports, movies) — use everyday knowledge
// Stage 3: Red flag patterns (fake studies, "exactly X%", made-up official reports) — spot the trick

// ═══════════════════════════════════════════════════════════════
// SCENARIO BANK — 5 per stage
// ═══════════════════════════════════════════════════════════════

export const SCENARIO_BANK = {
  1: [
    {
      id: "s1a",
      title: "Famous Inventions",
      topic: "the history of the lightbulb",
      prompt: "Tell me about the history of the lightbulb. Who invented it and when?",
      difficulty: "easy",
      maxPoints: 15,
      hints: [
        "Does anything sound too impressive to be true?",
        "Are specific claims backed up or just stated confidently?",
        "Do any numbers seem surprisingly large or small?",
      ],
      sentences: [
        { text: "The invention of the lightbulb is often attributed to Thomas Edison, who patented his incandescent lightbulb in 1879.", hallucinated: false },
        { text: "However, Edison wasn't working alone — over 20 inventors had created earlier versions of incandescent lamps before him.", hallucinated: false },
        { text: "One key predecessor was Humphry Davy, who demonstrated the first electric arc lamp in 1802.", hallucinated: false },
        { text: "Edison's major breakthrough was discovering that a platinum and diamond composite filament could burn for over 6 months straight without replacement.", hallucinated: true, type: "invented_detail", explanation: "Edison used carbonized materials (cotton thread, then bamboo) for his filaments, not platinum and diamond. His early filaments lasted only about 13-14 hours, not 6 months. This sounds too impressive to be real." },
        { text: "Edison's Menlo Park laboratory, located in New Jersey, became known as the \"Invention Factory\" and employed a team of skilled researchers.", hallucinated: false },
        { text: "By the time Edison died in 1931, his lightbulb design had earned him over $500 million in royalties, making him the wealthiest American of his era.", hallucinated: true, type: "exaggerated_stat", explanation: "While Edison was wealthy, $500 million in royalties and 'wealthiest American' are both fabricated. Edison earned significant money but was not the wealthiest American — that title belonged to people like John D. Rockefeller and Andrew Carnegie." },
        { text: "Today, LED bulbs have largely replaced incandescent bulbs because they use about 75% less energy and last 25 times longer.", hallucinated: false },
      ],
    },
    {
      id: "s1b",
      title: "Animal Facts",
      topic: "octopuses and their intelligence",
      prompt: "Tell me some interesting facts about how smart octopuses are.",
      difficulty: "easy",
      maxPoints: 15,
      hints: [
        "Do any animal abilities sound too human-like?",
        "Are any claims surprisingly extreme?",
        "Does anything sound like it belongs in a movie, not real life?",
      ],
      sentences: [
        { text: "Octopuses are widely considered the most intelligent invertebrates on Earth.", hallucinated: false },
        { text: "They have about 500 million neurons, with roughly two-thirds of those neurons located in their eight arms rather than their central brain.", hallucinated: false },
        { text: "Researchers at the Monterey Bay Aquarium observed an octopus unscrew a childproof pill bottle from the inside in under 2 minutes to reach food inside.", hallucinated: true, type: "invented_detail", explanation: "While octopuses can open jars and solve puzzles, the specific claim about unscrewing a childproof pill bottle from the inside is fabricated. It sounds impressive but too specific and dramatic to be real." },
        { text: "Octopuses can change both the color and texture of their skin in milliseconds, using specialized cells called chromatophores.", hallucinated: false },
        { text: "They have been observed using coconut shells as portable shelters, which is considered one of the first examples of tool use in invertebrates.", hallucinated: false },
        { text: "Most octopuses live only 1-2 years, which is surprisingly short for such intelligent creatures.", hallucinated: false },
        { text: "In captivity, octopuses have been known to recognize and spray water at specific staff members they dislike, showing the ability to hold grudges for up to 6 months.", hallucinated: true, type: "exaggerated_stat", explanation: "While octopuses can squirt water at people and seem to recognize individual humans, the claim about 'holding grudges for up to 6 months' is exaggerated and unverified. The '6 months' timeframe is made up to sound scientific." },
      ],
    },
    {
      id: "s1c",
      title: "Space Exploration",
      topic: "the International Space Station",
      prompt: "Tell me about the International Space Station. How big is it and who uses it?",
      difficulty: "easy",
      maxPoints: 15,
      hints: [
        "Do any comparisons sound too dramatic?",
        "Are any 'firsts' or records suspicious?",
        "Does anything sound like it's trying too hard to impress you?",
      ],
      sentences: [
        { text: "The International Space Station (ISS) is the largest human-made structure in space, orbiting Earth at an altitude of roughly 250 miles.", hallucinated: false },
        { text: "Construction began in 1998 with the launch of the Russian Zarya module.", hallucinated: false },
        { text: "The station is approximately the size of a football field, measuring 356 feet end to end.", hallucinated: false },
        { text: "The ISS travels at about 17,500 miles per hour, completing one orbit around Earth every 90 minutes.", hallucinated: false },
        { text: "Astronauts on the ISS can see the Great Wall of China with the naked eye, making it one of their favorite landmarks to photograph.", hallucinated: true, type: "invented_detail", explanation: "The Great Wall of China is NOT visible from the ISS with the naked eye — this is one of the most common myths about the wall. It's too narrow (about 15-30 feet wide) to be seen from 250 miles up without magnification." },
        { text: "Since November 2000, the station has been continuously occupied, making it the longest uninterrupted human presence in space.", hallucinated: false },
        { text: "In 2022, NASA announced that the ISS would be deorbited by crashing it into the Pacific Ocean in 2030, where it will create a crater on the ocean floor visible from passing ships.", hallucinated: true, type: "invented_detail", explanation: "While NASA does plan to deorbit the ISS around 2030 into a remote area of the Pacific (called the 'spacecraft cemetery'), it will NOT create a visible crater on the ocean floor. Most of it will burn up during reentry, and debris will simply sink." },
      ],
    },
    {
      id: "s1d",
      title: "Ancient Civilizations",
      topic: "ancient Egypt and the pyramids",
      prompt: "Tell me about the ancient Egyptian pyramids. How were they built?",
      difficulty: "easy",
      maxPoints: 15,
      hints: [
        "Do any numbers seem suspiciously large?",
        "Does anything contradict what you've heard before?",
        "Are any 'discoveries' described too dramatically?",
      ],
      sentences: [
        { text: "The Great Pyramid of Giza was built around 2560 BC as a tomb for Pharaoh Khufu.", hallucinated: false },
        { text: "Standing at 481 feet when completed, it was the tallest structure on Earth for over 3,800 years.", hallucinated: false },
        { text: "The pyramid is made of approximately 2.3 million limestone blocks, each weighing an average of 2.5 tons.", hallucinated: false },
        { text: "The Great Pyramid contains approximately 85 internal chambers and passages, most of which remain unexplored to this day.", hallucinated: true, type: "invented_detail", explanation: "The Great Pyramid has only three known main chambers (the King's Chamber, the Queen's Chamber, and the Subterranean Chamber) plus connecting passages and some recently discovered voids. 85 chambers is a wildly inflated number — if there were that many, it would be one of the biggest archaeological stories in history." },
        { text: "Recent evidence suggests the blocks were transported using a system of internal ramps that spiraled up inside the pyramid structure.", hallucinated: false },
        { text: "The pyramids were originally covered in white polished limestone casing stones that made them shine brilliantly in the sunlight.", hallucinated: false },
        { text: "Archaeologists believe that the workers who built the pyramids were aliens or possessed technology more advanced than anything we have today, based on the precision of the construction.", hallucinated: true, type: "invented_detail", explanation: "No credible archaeologist believes aliens built the pyramids. This is a popular conspiracy theory, not science. The pyramids were built by skilled Egyptian laborers using ramps, sledges, and clever engineering." },
      ],
    },
    {
      id: "s1e",
      title: "Famous Scientists",
      topic: "Albert Einstein's life and discoveries",
      prompt: "Tell me about Albert Einstein. What were his major discoveries?",
      difficulty: "easy",
      maxPoints: 15,
      hints: [
        "Are famous quotes actually from who they say?",
        "Do any achievements sound too extreme?",
        "Does anything sound like a movie plot?",
      ],
      sentences: [
        { text: "Albert Einstein was born on March 14, 1879, in Ulm, Germany.", hallucinated: false },
        { text: "In 1905, often called his \"miracle year,\" Einstein published four groundbreaking papers that revolutionized physics.", hallucinated: false },
        { text: "His theory of special relativity introduced the famous equation E=mc², showing the relationship between energy and mass.", hallucinated: false },
        { text: "Einstein won the Nobel Prize in Physics in 1921 for his discovery of the photoelectric effect, not for relativity.", hallucinated: false },
        { text: "As a child, Einstein failed math class repeatedly and was told by his teachers that he would never amount to anything.", hallucinated: true, type: "invented_detail", explanation: "This is one of the most popular myths about Einstein. He was actually excellent at math from a young age. He mastered calculus by age 15. The 'failed math' story is completely fabricated but gets repeated constantly." },
        { text: "His general theory of relativity, published in 1915, predicted that massive objects warp the fabric of space-time.", hallucinated: false },
        { text: "Einstein fled Nazi Germany in 1933 and spent the rest of his career in the United States, where he died in 1955.", hallucinated: false },
        { text: "After his death, Einstein's brain was stolen from the hospital by the pathologist who performed the autopsy, who kept it in a jar for over 20 years.", hallucinated: true, type: "exaggerated_stat", explanation: "This one is actually TRUE — pathologist Thomas Harvey did remove Einstein's brain without proper permission and kept it for decades. It sounds too wild to be real, but it is. Students who flag this learn that sometimes the truth sounds like a hallucination." },
      ],
    },
  ],

  2: [
    {
      id: "s2a",
      title: "Social Media",
      topic: "the history of social media apps",
      prompt: "Tell me about the history of social media. How did apps like Instagram, TikTok, and Snapchat get started?",
      difficulty: "medium",
      maxPoints: 20,
      hints: [
        "Are apps being credited to the right people?",
        "Do any launch dates or timelines feel off?",
        "Are any statistics suspiciously round or impressive?",
      ],
      sentences: [
        { text: "Instagram was launched in October 2010 by Kevin Systrom and Mike Krieger as a photo-sharing app.", hallucinated: false },
        { text: "It gained 25,000 users on its first day and reached 1 million users within two months.", hallucinated: false },
        { text: "Facebook (now Meta) acquired Instagram in 2012 for approximately $1 billion.", hallucinated: false },
        { text: "Snapchat was created in 2011 by Evan Spiegel, Bobby Murphy, and Reggie Brown while they were students at Stanford University.", hallucinated: false },
        { text: "TikTok was created by Mark Zuckerberg's team at Meta in 2016 as a competitor to Snapchat, before being sold to the Chinese company ByteDance in 2018.", hallucinated: true, type: "false_attribution", explanation: "TikTok was NOT created by Mark Zuckerberg or Meta. It was developed by ByteDance, a Chinese tech company, and launched internationally in 2017 after ByteDance merged it with Musical.ly in 2018. Zuckerberg has nothing to do with TikTok — he actually competes against it." },
        { text: "YouTube, which launched in 2005, was the first major platform to let users upload and share video content, and Google bought it in 2006 for $1.65 billion.", hallucinated: false },
        { text: "A 2023 Pew Research study found that 95% of American teens use at least one social media platform, with YouTube and TikTok being the most popular.", hallucinated: false },
        { text: "Twitter was originally called \"FriendFeed\" before co-founder Jack Dorsey renamed it in 2006, and the very first tweet ever sent said \"just setting up my twttr.\"", hallucinated: true, type: "invented_detail", explanation: "Twitter was NEVER called 'FriendFeed.' FriendFeed was a completely different service. Twitter's early working name was 'twttr' (without vowels). The first tweet by Jack Dorsey really did say 'just setting up my twttr' — but the 'FriendFeed' origin story is completely made up." },
      ],
    },
    {
      id: "s2b",
      title: "Video Games",
      topic: "the history of video games",
      prompt: "Tell me about the history of video games. How did gaming become so popular?",
      difficulty: "medium",
      maxPoints: 20,
      hints: [
        "Are games being credited to the right companies?",
        "Do any sales numbers seem too extreme?",
        "Are any 'firsts' actually firsts?",
      ],
      sentences: [
        { text: "The video game industry traces its origins to the 1970s, with arcade games like Pong (1972) and Space Invaders (1978) bringing gaming to the mainstream.", hallucinated: false },
        { text: "Nintendo revived the struggling industry with the Nintendo Entertainment System (NES) in 1985, led by the massive success of Super Mario Bros.", hallucinated: false },
        { text: "The PlayStation, released by Sony in 1994, brought CD-based gaming to the mainstream and sold over 100 million units worldwide.", hallucinated: false },
        { text: "Minecraft, created by Markus \"Notch\" Persson, was first released in 2011 and has since become the best-selling video game of all time with over 300 million copies sold.", hallucinated: false },
        { text: "Fortnite, developed by Epic Games, became a cultural phenomenon in 2017 and at its peak had over 350 million registered accounts.", hallucinated: false },
        { text: "The Nintendo Switch, released in 2017, was the first gaming console ever to work as both a handheld and a home console — a concept no company had attempted before.", hallucinated: true, type: "invented_detail", explanation: "The Switch was NOT the first hybrid console. The Sega Nomad (1995) could play Genesis cartridges portably, and Nintendo's own Wii U (2012) had off-TV play on its GamePad. The Switch was the most SUCCESSFUL hybrid console, but calling it the first is wrong." },
        { text: "The global gaming industry generated over $180 billion in revenue in 2023, making it larger than the movie and music industries combined.", hallucinated: false },
        { text: "Roblox, which launched in 2006, was originally designed as educational software to teach kids physics, before its creators realized players preferred building games over completing lessons.", hallucinated: true, type: "invented_detail", explanation: "Roblox was NOT originally educational physics software. Co-founders David Baszucki and Erik Cassel had previously created a physics simulation called 'Interactive Physics,' but Roblox itself was always designed as a platform for user-created games. The story mixes up their earlier project with Roblox's actual origin." },
      ],
    },
    {
      id: "s2c",
      title: "Smartphones",
      topic: "how smartphones changed the world",
      prompt: "How did smartphones change everyday life? Tell me about their history and impact.",
      difficulty: "medium",
      maxPoints: 20,
      hints: [
        "Are inventions credited to the right companies?",
        "Do any features sound like they came earlier or later than claimed?",
        "Are any comparisons too dramatic?",
      ],
      sentences: [
        { text: "The first iPhone was released on June 29, 2007, and is widely credited with starting the modern smartphone era.", hallucinated: false },
        { text: "Before the iPhone, BlackBerry and Palm were the dominant smartphone brands, popular mainly with business professionals.", hallucinated: false },
        { text: "Google's Android operating system, first released in 2008, now powers roughly 72% of smartphones worldwide.", hallucinated: false },
        { text: "The App Store launched in 2008 with about 500 apps; today it has over 1.8 million apps available for download.", hallucinated: false },
        { text: "Samsung released the first smartphone with a front-facing camera for selfies in 2003, five years before Apple added one to the iPhone 4 in 2010.", hallucinated: true, type: "invented_detail", explanation: "While front-facing cameras did exist on some phones before the iPhone 4, Samsung did not introduce the first one in 2003. Several manufacturers had front-facing cameras in the early 2000s for video calling (like the Sony Ericsson Z1010 in 2003), but attributing this specifically to Samsung with that date is fabricated." },
        { text: "Today, there are approximately 6.8 billion smartphone users worldwide — meaning roughly 85% of the global population owns one.", hallucinated: false },
        { text: "The average American checks their phone about 96 times per day, or roughly once every 10 minutes during waking hours.", hallucinated: false },
        { text: "Apple's Siri, introduced in 2011, was the first voice assistant on any device — the concept of talking to a computer didn't exist in any consumer product before Siri.", hallucinated: true, type: "invented_detail", explanation: "Siri was NOT the first voice assistant. Dragon NaturallySpeaking existed since the 1990s for speech recognition, and even on phones, Google had voice search before Siri. The claim that 'talking to a computer didn't exist' before 2011 ignores decades of voice technology." },
      ],
    },
    {
      id: "s2d",
      title: "Sports",
      topic: "basketball and the NBA",
      prompt: "Tell me about the history of basketball and the NBA. Who are some of the greatest players?",
      difficulty: "medium",
      maxPoints: 20,
      hints: [
        "Are records attributed to the right players?",
        "Do any career details seem mixed up?",
        "Are any statistics surprisingly extreme?",
      ],
      sentences: [
        { text: "Basketball was invented in 1891 by James Naismith, a Canadian physical education instructor working in Springfield, Massachusetts.", hallucinated: false },
        { text: "The NBA was founded in 1946 (originally as the BAA) and has grown into one of the most popular professional sports leagues in the world.", hallucinated: false },
        { text: "Michael Jordan, widely considered the greatest basketball player of all time, won six NBA championships with the Chicago Bulls in the 1990s.", hallucinated: false },
        { text: "LeBron James became the NBA's all-time leading scorer in February 2023, surpassing Kareem Abdul-Jabbar's record of 38,387 points.", hallucinated: false },
        { text: "Stephen Curry revolutionized the game by popularizing the three-point shot, and holds the NBA record for most career three-pointers made.", hallucinated: false },
        { text: "Kobe Bryant scored 81 points in a single game against the Toronto Raptors in 2006 — the highest-scoring game in NBA history.", hallucinated: true, type: "exaggerated_stat", explanation: "Kobe's 81 points is real and incredible, but it's NOT the highest-scoring game in NBA history. Wilt Chamberlain scored 100 points in a single game on March 2, 1962. Kobe's 81 is the second-highest. If you know about Wilt's 100-point game, you can catch this." },
        { text: "The NBA Draft Lottery was introduced in 1985, and the very first pick that year was Patrick Ewing, selected by the New York Knicks.", hallucinated: false },
        { text: "The three-point line was added to the NBA in 1979, but it was originally positioned at exactly 30 feet from the basket — 6 feet farther than it is today — because the league wanted to discourage long-range shooting.", hallucinated: true, type: "invented_detail", explanation: "The three-point line was added in 1979, but it was NOT originally at 30 feet. The NBA three-point line has been at 23 feet 9 inches (with some brief changes), and the league added it to ENCOURAGE long-range shooting, not discourage it. The claim gets the distance and the purpose completely backwards." },
      ],
    },
    {
      id: "s2e",
      title: "Movies & Streaming",
      topic: "how movies and streaming changed entertainment",
      prompt: "Tell me about how Netflix and streaming services changed the movie industry.",
      difficulty: "medium",
      maxPoints: 20,
      hints: [
        "Are companies and founders being mixed up?",
        "Do any 'firsts' sound suspicious?",
        "Are any numbers too perfectly round?",
      ],
      sentences: [
        { text: "Netflix was founded in 1997 by Reed Hastings and Marc Randolph, originally as a DVD-by-mail rental service.", hallucinated: false },
        { text: "Netflix began streaming video content in 2007, fundamentally changing how people watch movies and TV shows.", hallucinated: false },
        { text: "The company's first original series, House of Cards, premiered in 2013 and proved that a streaming service could produce award-winning content.", hallucinated: false },
        { text: "Blockbuster, once the dominant video rental chain with over 9,000 stores, famously turned down an opportunity to buy Netflix for $50 million in 2000.", hallucinated: false },
        { text: "Disney+ launched in November 2019 and gained 10 million subscribers on its first day, partly driven by the debut of The Mandalorian.", hallucinated: false },
        { text: "Netflix's recommendation algorithm was invented by a single engineer named Jared Kaplan in 2006, who won a $1 million Netflix Prize for creating the system that suggests what you should watch next.", hallucinated: true, type: "invented_detail", explanation: "The Netflix Prize was real ($1 million, awarded in 2009), but it was won by a TEAM called 'BellKor's Pragmatic Chaos,' not a single person named Jared Kaplan. Also, Netflix already had a recommendation system before the prize — the contest was about improving it. The fake individual name makes it sound like a neat story but it's fabricated." },
        { text: "As of 2024, Netflix has approximately 260 million paid subscribers in over 190 countries.", hallucinated: false },
        { text: "The rise of streaming caused U.S. movie theater attendance to drop by about 50% between 2002 and 2023, with the COVID-19 pandemic accelerating the decline.", hallucinated: true, type: "exaggerated_stat", explanation: "While movie theater attendance has declined, a 50% drop overstates the pre-pandemic trend. Attendance was declining gradually (about 20-25% from peak to 2019). The pandemic caused a massive temporary drop, but attributing a clean '50%' decline to streaming alone is misleading and exaggerated." },
      ],
    },
  ],

  3: [
    {
      id: "s3a",
      title: "Sleep & Teen Health",
      topic: "why sleep matters for teenagers",
      prompt: "Why is sleep so important for teenagers? How much sleep do teens actually need?",
      difficulty: "hard",
      maxPoints: 25,
      hints: [
        "Are cited studies and organizations real?",
        "Do any statistics seem suspiciously exact?",
        "Do any health claims sound too extreme or too perfect?",
      ],
      sentences: [
        { text: "The American Academy of Sleep Medicine recommends that teenagers aged 13-18 get 8-10 hours of sleep per night for optimal health.", hallucinated: false },
        { text: "During sleep, the brain consolidates memories and processes information learned during the day, which is why sleep is critical for academic performance.", hallucinated: false },
        { text: "Teenagers experience a biological shift in their circadian rhythm called \"sleep phase delay,\" which makes them naturally want to fall asleep later and wake up later.", hallucinated: false },
        { text: "This is why many sleep researchers advocate for later school start times — the American Academy of Pediatrics recommends middle and high schools start no earlier than 8:30 AM.", hallucinated: false },
        { text: "A 2021 Stanford Sleep Lab study found that students who slept exactly 9.5 hours per night scored precisely 31% higher on standardized tests than students who slept 6 hours.", hallucinated: true, type: "fake_study", explanation: "No Stanford study found these exact numbers. 'Exactly 9.5 hours' and 'precisely 31% higher' are red flags — real sleep studies produce ranges and approximate effects, not suspiciously precise figures. Sleep does help academic performance, but the specific study and numbers are fabricated." },
        { text: "Only about 15% of American teenagers report getting the recommended 8-10 hours of sleep on school nights, according to the CDC.", hallucinated: false },
        { text: "Blue light from phone and computer screens can suppress melatonin production, making it harder to fall asleep, which is why experts recommend putting screens away 30-60 minutes before bed.", hallucinated: false },
        { text: "Sleep deprivation in teens has been classified by the World Health Organization as a \"Stage 1 public health crisis\" since 2019, placing it in the same category as smoking and obesity.", hallucinated: true, type: "invented_detail", explanation: "The WHO has NOT classified teen sleep deprivation as a 'Stage 1 public health crisis' — that classification doesn't even exist. While teen sleep deprivation is a serious concern, the official-sounding 'Stage 1' label and the comparison to smoking and obesity are fabricated to make it sound more authoritative." },
        { text: "Chronic sleep deprivation in teenagers is linked to increased rates of anxiety, depression, obesity, and weakened immune function.", hallucinated: false },
      ],
    },
    {
      id: "s3b",
      title: "Music Streaming",
      topic: "how streaming changed the music industry",
      prompt: "How did music streaming change the music industry? Tell me about Spotify, Apple Music, and how artists make money.",
      difficulty: "hard",
      maxPoints: 25,
      hints: [
        "Are platforms and founders being credited correctly?",
        "Do any payment figures seem too clean?",
        "Are any 'firsts' or records actually real?",
      ],
      sentences: [
        { text: "Spotify was founded in 2006 in Stockholm, Sweden, by Daniel Ek and Martin Lorentzon, and launched its streaming service in 2008.", hallucinated: false },
        { text: "Before streaming, music piracy through services like Napster (1999-2001) and LimeWire had devastated the music industry, causing album sales to plummet.", hallucinated: false },
        { text: "Spotify uses a \"pro-rata\" payment model, where all subscription revenue goes into one pool and is divided based on each artist's share of total streams.", hallucinated: false },
        { text: "Artists on Spotify earn an average of about $0.003 to $0.005 per stream, meaning a song needs roughly 250-350 streams to earn one dollar.", hallucinated: false },
        { text: "Apple Music launched in 2015 and currently has approximately 88 million subscribers, making it the second-largest music streaming platform behind Spotify.", hallucinated: false },
        { text: "Drake holds the record for the most-streamed artist on Spotify, but the most-streamed song of all time is \"Blinding Lights\" by The Weeknd, which surpassed 4 billion streams.", hallucinated: false },
        { text: "When Taylor Swift removed her music from Spotify in 2014 over payment disputes, Spotify's co-founder Daniel Ek personally called her and offered to pay her exactly $50 million per year to return, which she declined until 2017.", hallucinated: true, type: "invented_detail", explanation: "Taylor Swift really did remove her music from Spotify in 2014 and return in 2017, but the claim that Daniel Ek offered her 'exactly $50 million per year' is completely fabricated. The actual negotiations were private and far more complex. The suspiciously round, dramatic number should be a red flag." },
        { text: "Vinyl records have made a surprising comeback alongside streaming — in 2023, vinyl sales in the U.S. exceeded $1.2 billion, the highest since the 1980s.", hallucinated: false },
        { text: "A 2023 report by the Recording Industry Association of America found that streaming now accounts for 84% of all U.S. recorded music revenue, up from just 7% in 2012, making it the fastest format transition in entertainment history — faster than VHS to DVD, or cable to streaming TV.", hallucinated: true, type: "exaggerated_stat", explanation: "The streaming revenue percentages (84% in 2023, small fraction in 2012) are approximately correct. But the claim that it's 'the fastest format transition in entertainment history — faster than VHS to DVD or cable to streaming TV' is fabricated and impossible to verify. It sounds authoritative by comparing to other transitions, but the ranking is made up." },
      ],
    },
    {
      id: "s3c",
      title: "School & Education",
      topic: "interesting facts about schools around the world",
      prompt: "Tell me some interesting facts about how schools work in different countries.",
      difficulty: "hard",
      maxPoints: 25,
      hints: [
        "Are any school practices described too perfectly?",
        "Do any country-specific claims sound too neat to be true?",
        "Are any statistics suspiciously precise?",
      ],
      sentences: [
        { text: "In Finland, children don't start formal schooling until age 7, and the country consistently ranks among the top education systems in the world.", hallucinated: false },
        { text: "Finnish students have very little homework compared to American students, and there are no standardized tests until age 16.", hallucinated: false },
        { text: "In Japan, students are responsible for cleaning their own classrooms and school hallways — there are no janitors in most Japanese schools.", hallucinated: false },
        { text: "South Korea has one of the most intensive education cultures in the world, with many students attending private after-school academies called \"hagwons\" until late at night.", hallucinated: false },
        { text: "In 2018, Finland passed the \"Digital Wellness in Education Act,\" which legally requires all schools to give students a 15-minute outdoor break for every 45 minutes of screen time, backed by a fine of €5,000 per violation.", hallucinated: true, type: "invented_detail", explanation: "No such law exists. Finnish schools DO value outdoor breaks and recess (typically 15 minutes every 45 minutes), but there is no 'Digital Wellness in Education Act' with fines. The specific law name, the euro amount, and 'per violation' framing are all fabricated to sound official. Real education policies rarely come with per-violation fines like this." },
        { text: "The average school year in the United States is about 180 days, while Japan's school year is approximately 243 days.", hallucinated: false },
        { text: "In many countries, including Germany and Austria, students are tracked into different school types (academic, technical, or vocational) as early as age 10 based on their academic performance.", hallucinated: false },
        { text: "According to a 2022 OECD report, the United States spends more per student on K-12 education than any other country — approximately $16,000 per year — yet ranks exactly 27th out of 38 OECD nations in math proficiency.", hallucinated: true, type: "exaggerated_stat", explanation: "The U.S. does spend among the highest per student globally, and it does rank below many OECD nations in math. But 'exactly 27th' is suspiciously precise — OECD rankings vary by year, by test (PISA vs. TIMSS), and by how you measure. The 'exactly' framing makes a rough comparison sound like a hard fact." },
        { text: "India has the largest school system in the world, with over 1.5 million schools serving approximately 260 million students.", hallucinated: false },
      ],
    },
    {
      id: "s3d",
      title: "AI & Algorithms",
      topic: "how social media algorithms work",
      prompt: "How do social media algorithms decide what you see in your feed? How does the AI behind TikTok and Instagram work?",
      difficulty: "hard",
      maxPoints: 25,
      hints: [
        "Are technical explanations accurate or oversimplified?",
        "Do any internal details about companies sound too specific to be public?",
        "Are any cause-and-effect claims too dramatic?",
      ],
      sentences: [
        { text: "Social media algorithms are AI systems that analyze your behavior — what you like, share, comment on, and how long you watch — to predict what content will keep you engaged.", hallucinated: false },
        { text: "TikTok's \"For You\" page algorithm is considered especially powerful because it can learn your preferences within 30-60 minutes of use, even for brand-new accounts.", hallucinated: false },
        { text: "Instagram's feed algorithm considers multiple factors including your relationship with the poster, how recent the post is, and how likely you are to engage with that type of content.", hallucinated: false },
        { text: "YouTube's recommendation algorithm is responsible for approximately 70% of all watch time on the platform, meaning most videos people watch are suggested by AI, not searched for.", hallucinated: false },
        { text: "In 2022, a leaked internal TikTok document revealed that the app's algorithm assigns every user a secret \"addiction score\" from 1-100, and users scoring above 80 are deliberately shown more controversial content to maximize engagement.", hallucinated: true, type: "invented_detail", explanation: "No such leaked document or 'addiction score' exists. While TikTok's algorithm does optimize for engagement (and there have been real concerns about its effects on mental health), the specific claim about a secret 1-100 'addiction score' and the 80-point threshold are completely fabricated. It sounds believable because it fits our fears about social media, which is exactly how convincing hallucinations work." },
        { text: "The term \"filter bubble,\" coined by internet activist Eli Pariser in 2011, describes how algorithms can trap users in an echo chamber of content that only reinforces their existing beliefs.", hallucinated: false },
        { text: "Meta (Facebook/Instagram) employs over 40,000 content moderators worldwide to review posts flagged by AI systems.", hallucinated: false },
        { text: "According to the Surgeon General's 2023 advisory, teens who spend more than 3 hours per day on social media face exactly double the risk of anxiety and depression symptoms compared to teens who spend less than 1 hour.", hallucinated: true, type: "exaggerated_stat", explanation: "The Surgeon General did issue a 2023 advisory about social media and youth mental health, and research does show a correlation between heavy social media use and mental health risks. But 'exactly double the risk' with those specific hour thresholds is fabricated. Real studies show increased risk but with ranges and nuance, not clean doublings. The word 'exactly' paired with a dramatic multiplier is a classic red flag." },
        { text: "In 2024, the European Union's Digital Services Act began requiring major platforms like TikTok and Instagram to give users the option to see a non-algorithmic, chronological feed.", hallucinated: false },
      ],
    },
    {
      id: "s3e",
      title: "Space Exploration",
      topic: "Mars missions and the future of space travel",
      prompt: "Tell me about Mars exploration. What have we learned and what's planned for the future?",
      difficulty: "hard",
      maxPoints: 25,
      hints: [
        "Are achievements attributed to the right missions or agencies?",
        "Do any future plans sound too specific or too certain?",
        "Are any records or 'firsts' suspicious?",
      ],
      sentences: [
        { text: "NASA's Perseverance rover landed on Mars on February 18, 2021, in Jezero Crater, a site scientists believe was once an ancient lake bed.", hallucinated: false },
        { text: "Perseverance carried Ingenuity, a small helicopter that became the first aircraft to achieve powered, controlled flight on another planet.", hallucinated: false },
        { text: "Mars is about 140 million miles from Earth on average, and depending on orbital positions, it takes signals between 4 and 24 minutes to travel between the two planets.", hallucinated: false },
        { text: "The Curiosity rover, which landed in 2012, discovered that Mars once had liquid water on its surface and the chemical ingredients necessary for life.", hallucinated: false },
        { text: "SpaceX CEO Elon Musk has stated his goal of sending humans to Mars by the 2030s, with the Starship rocket being developed as the vehicle for the mission.", hallucinated: false },
        { text: "In 2023, NASA's MAVEN spacecraft detected trace amounts of methane gas in Mars's atmosphere that follow a seasonal pattern — conclusive proof that microbial life currently exists beneath the Martian surface.", hallucinated: true, type: "exaggerated_stat", explanation: "Methane HAS been detected on Mars (by Curiosity, not MAVEN in 2023), and it does show seasonal variation, which is genuinely intriguing. However, methane can be produced by geological processes too — it is NOT 'conclusive proof' of microbial life. Scientists consider it an interesting lead, not proof. The jump from 'we found methane' to 'proof of life' is a massive exaggeration." },
        { text: "A round trip to Mars with current technology would take approximately 21 months — about 7 months each way for travel, plus time waiting for the planets to realign for the return journey.", hallucinated: false },
        { text: "Mars has the largest volcano in the solar system, Olympus Mons, which stands about 72,000 feet tall — nearly 2.5 times the height of Mount Everest.", hallucinated: false },
        { text: "NASA and the European Space Agency jointly announced in 2024 that the first permanent human habitat on Mars, called \"Ares Base,\" will be constructed entirely by robots beginning in 2031, with the first human residents arriving in 2035.", hallucinated: true, type: "invented_detail", explanation: "No such announcement has been made. There is no plan called 'Ares Base,' no 2031 construction date, and no 2035 arrival date. While NASA and ESA do collaborate on Mars research, these specific names and dates are completely fabricated. Official-sounding project names and precise future dates are a common pattern in AI hallucinations." },
      ],
    },
  ],
};

export const HALLUCINATION_TYPES = [
  { key: "wrong_date", label: "Wrong Date/Number", emoji: "📅", description: "A date, year, or statistic that's incorrect", color: "#f87171" },
  { key: "false_attribution", label: "False Attribution", emoji: "🗣️", description: "Something attributed to the wrong person or source", color: "#fb923c" },
  { key: "invented_detail", label: "Invented Detail", emoji: "🪄", description: "A fact or detail that sounds real but was made up", color: "#c084fc" },
  { key: "misquote", label: "Misquote", emoji: "💬", description: "A quote that's wrong or attributed to the wrong person", color: "#38bdf8" },
  { key: "fake_study", label: "Fake Study/Source", emoji: "📊", description: "A study, paper, or source that doesn't exist", color: "#34d399" },
  { key: "wrong_process", label: "Wrong Process/Mechanism", emoji: "⚙️", description: "A scientific or technical process described incorrectly", color: "#fbbf24" },
  { key: "exaggerated_stat", label: "Exaggerated Statistic", emoji: "📈", description: "A real stat that's been inflated or deflated", color: "#f472b6" },
  { key: "wrong_terminology", label: "Wrong Terminology", emoji: "📝", description: "A technical term used incorrectly", color: "#a78bfa" },
  { key: "fake_tradition", label: "Fake Tradition/Practice", emoji: "🎭", description: "A cultural practice or tradition that doesn't exist", color: "#fb7185" },
  { key: "invented_term", label: "Invented Term", emoji: "🔤", description: "A word, name, or term that was fabricated", color: "#2dd4bf" },
];

export const STAGE_INTROS = {
  1: {
    title: "Stage 1: Warm Up",
    subtitle: "Trust your gut",
    description: "You'll see an AI-generated response about a real topic. Some sentences contain false information. You don't need to know the answers — just look for things that sound too impressive, too specific, or too convenient. If it feels off, flag it!",
    icon: "🔍",
  },
  2: {
    title: "Stage 2: Getting Harder",
    subtitle: "Use what you already know",
    description: "These topics are things you deal with every day — social media, games, phones, sports, movies. The hallucinations are trickier now, mixing real facts with made-up details. Trust what you know and watch for things that don't add up.",
    icon: "🧐",
  },
  3: {
    title: "Stage 3: Expert Mode",
    subtitle: "Spot the pattern, not just the fact",
    description: "The hardest scenarios. The AI uses tricks like fake studies with suspiciously exact numbers, made-up official reports, and claims that sound authoritative but are fabricated. You don't need to know the right answer — just recognize the red flags.",
    icon: "🏆",
  },
};

// ═══════════════════════════════════════════════════════════════
// SCENARIO SELECTION — picks 2 per stage, excludes previously used
// ═══════════════════════════════════════════════════════════════

const ROUNDS_PER_STAGE = 2;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildScenarios(excludeIds = []) {
  const selected = [];
  for (const stage of [1, 2, 3]) {
    const available = SCENARIO_BANK[stage].filter(s => !excludeIds.includes(s.id));
    const pool = available.length >= ROUNDS_PER_STAGE ? available : SCENARIO_BANK[stage];
    const picked = shuffle(pool).slice(0, ROUNDS_PER_STAGE);
    picked.forEach(s => selected.push({ ...s, stage }));
  }
  return selected;
}
