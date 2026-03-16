# Prompt Duel — Firebase Deployment Guide

## Architecture

```
Student Browser                    Firebase
┌──────────────┐    HTTPS     ┌──────────────────┐
│  Vite React  │ ──────────→  │  Cloud Function   │
│  (Hosting)   │              │  geminiProxy()    │
│              │  ←────────── │    ↓              │
│  Firestore   │              │  Gemini 2.5 Flash │
│  (scores/xp) │              │  (API key hidden) │
└──────────────┘              └──────────────────┘
```

- **Frontend**: Vite + React + Tailwind → Firebase Hosting
- **Backend**: Single Cloud Function proxies Gemini API (key in secrets)
- **Data**: Firestore stores leaderboard + game history
- **Auth**: None required — students just enter a name
- **Cost**: ~$0.14/class session for Gemini, Firebase free tier covers everything else

## Setup Steps

### 1. Navigate to your PantherLearn project

```bash
cd ~/Desktop/PantherLearn
```

Or wherever your Firebase project lives. The key is you're in the directory that has `firebase.json`.

### 2. Copy the Prompt Duel files

Copy the entire `prompt-duel-firebase/` folder to your desktop, then:

**Option A** — Deploy as part of PantherLearn (recommended):
Add the Cloud Function to your existing `functions/index.js` and host the frontend at a subpath.

**Option B** — Deploy as a separate Firebase project:
```bash
cd prompt-duel-firebase
firebase init
# Select: Functions + Hosting
# Use existing project: pantherlearn-d6f7c
# Functions language: JavaScript
# Public directory: dist
# Single-page app: Yes
```

### 3. Set the Gemini API key as a secret

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

Paste your Gemini API key when prompted. This stores it securely — it never appears in your code.

### 4. Deploy the Cloud Function

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

It will print the function URL, something like:
```
✓ Function URL (geminiProxy): https://geminiproxy-abc123-uc.a.run.app
```

**Copy that URL.**

### 5. Configure the frontend

Open `src/lib/firebase.js` and fill in:

1. Your Firebase config values (same ones from PantherLearn setup)
2. The Cloud Function URL you just copied

```javascript
// Replace with your actual values:
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};

export const GEMINI_PROXY_URL = "https://geminiproxy-abc123-uc.a.run.app";
```

### 6. Build and deploy the frontend

```bash
npm install
npm run build
firebase deploy --only hosting
```

### 7. Done!

Students go to `https://pantherlearn-d6f7c.web.app` (or your custom domain) and play.

## Firestore Collections Created

The game automatically creates these collections:

### `promptDuelLeaderboard`
```
{
  name: "StudentName",
  totalXP: 450,
  gamesPlayed: 3,
  bestScore: 1250,
  lastPlayed: timestamp,
  createdAt: timestamp
}
```

### `promptDuelHistory`
```
{
  playerName: "StudentName",
  playerId: "studentname",
  totalScore: 850,
  xpEarned: 150,
  rank: 2,
  totalPlayers: 4,
  rounds: [
    { round: 1, bestScore: 7, iterations: 3 },
    { round: 2, bestScore: 5, iterations: 2 },
    ...
  ],
  playedAt: timestamp
}
```

### PantherLearn XP Bridge

The `syncXPToPantherLearn()` function in `src/lib/store.js` can push XP
into your existing PantherLearn `users` collection. To enable it:

1. After a game completes, call it with the student's PantherLearn user ID
2. It increments `users/{uid}/xp` and `users/{uid}/moduleXP.promptDuel`

This is optional — right now the game uses its own leaderboard. You can
wire it up to PantherLearn auth later if you want unified XP.

## File Structure

```
prompt-duel-firebase/
├── firebase.json              ← Hosting config
├── index.html                 ← Vite entry
├── package.json               ← Frontend deps
├── vite.config.js             ← Vite config
├── tailwind.config.js         ← Tailwind config
├── postcss.config.js
├── functions/
│   ├── index.js               ← Cloud Function (Gemini proxy)
│   └── package.json           ← Function deps
└── src/
    ├── main.jsx               ← React entry
    ├── App.jsx                ← Screen router
    ├── index.css              ← Tailwind + global styles
    ├── challenges.js          ← 6 challenge rounds
    ├── lib/
    │   ├── firebase.js        ← Firebase config + function URL
    │   ├── api.js             ← Gemini proxy client + utilities
    │   └── store.js           ← Firestore persistence
    └── screens/
        ├── SetupScreen.jsx    ← Name entry + connection test
        ├── LobbyScreen.jsx    ← Game lobby + round preview
        ├── GameScreen.jsx     ← Core gameplay loop
        ├── ResultsScreen.jsx  ← Post-game scores + XP
        └── LeaderboardScreen.jsx ← Firestore leaderboard
```

## Cost Estimate

| Component | Monthly Cost (5 classes/day, 20 days) |
|-----------|--------------------------------------|
| Gemini 2.5 Flash | ~$14 |
| Firebase Hosting | Free tier |
| Cloud Functions | Free tier (2M invocations/month) |
| Firestore | Free tier (50K reads/day) |
| **Total** | **~$14/month** |
