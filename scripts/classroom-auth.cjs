// One-time script to get a Google OAuth refresh token for Classroom API.
// Run: node scripts/classroom-auth.cjs
// Signs in via browser, saves refresh token to .classroom-token.json

const http = require("http");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load credentials
const envPath = path.join(__dirname, "..", ".env.classroom");
const env = {};
fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
  const [key, ...val] = line.split("=");
  if (key && val.length) env[key.trim()] = val.join("=").trim();
});

const CLIENT_ID = env.CLASSROOM_CLIENT_ID;
const CLIENT_SECRET = env.CLASSROOM_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3847/callback";
const SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.rosters.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.students",
  "https://www.googleapis.com/auth/classroom.coursework.me",
  "https://www.googleapis.com/auth/classroom.topics.readonly",
  "https://www.googleapis.com/auth/classroom.announcements.readonly",
].join(" ");

const TOKEN_PATH = path.join(__dirname, "..", ".classroom-token.json");

// Build auth URL
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline&prompt=consent`;

console.log("Opening browser for Google sign-in...\n");

// Start local server to catch the callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:3847`);
  if (url.pathname !== "/callback") return;

  const code = url.searchParams.get("code");
  if (!code) {
    res.end("No code received. Try again.");
    server.close();
    return;
  }

  // Exchange code for tokens
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) {
      res.end(`Error: ${tokens.error_description || tokens.error}`);
      server.close();
      process.exit(1);
      return;
    }

    fs.writeFileSync(TOKEN_PATH, JSON.stringify({
      refresh_token: tokens.refresh_token,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }, null, 2));

    console.log("Refresh token saved to .classroom-token.json");
    res.end("Success! You can close this tab. Refresh token saved.");
  } catch (err) {
    console.error("Token exchange failed:", err.message);
    res.end("Token exchange failed: " + err.message);
  }

  server.close();
  process.exit(0);
});

server.listen(3847, () => {
  console.log("Waiting for callback on http://localhost:3847/callback ...");
  // Open browser
  try {
    execSync(`open "${authUrl}"`);
  } catch {
    console.log("\nOpen this URL manually:\n" + authUrl);
  }
});
