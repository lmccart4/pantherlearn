#!/usr/bin/env node
// Pre-build guard: verify required VITE_FIREBASE_* env vars are set BEFORE
// Vite inlines them into the bundle. Without this check, building from a
// worktree (where .env is gitignored and not copied) silently produces a
// bundle with undefined API keys, which crashes in production with
// "Firebase: Error (auth/invalid-api-key)".
//
// Real incident: 2026-04-13. See:
// docs/superpowers/specs/2026-04-13-admin-users-tab-design.md (related work)
// https://pantherlearn.web.app (site was broken ~25 min)

const fs = require("fs");
const path = require("path");

// Load .env files the same way Vite does: .env.local overrides .env, and
// process.env wins over both. Vite uses a real parser (dotenv), but a naive
// key=value split is enough for the check: we're only looking for presence.
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line) => {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (!m) return;
      out[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    });
  return out;
}

const here = path.resolve(__dirname, "..");
const merged = {
  ...loadEnvFile(path.join(here, ".env")),
  ...loadEnvFile(path.join(here, ".env.local")),
  ...process.env,
};

const REQUIRED = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
];

const missing = REQUIRED.filter((k) => !merged[k] || merged[k].trim() === "");

if (missing.length) {
  console.error("");
  console.error("✗ Build aborted — required env vars are missing:");
  missing.forEach((k) => console.error("    " + k));
  console.error("");
  console.error("  This usually means .env is not present in the working");
  console.error("  directory. If you're in a git worktree, copy .env from");
  console.error("  the main checkout:");
  console.error("");
  console.error("    cp " + path.join(path.dirname(here), "pantherlearn") + "/.env " + here + "/");
  console.error("");
  console.error("  Without these vars, Vite will bake `undefined` into the");
  console.error("  bundle and the deployed site will crash on first load");
  console.error("  with 'Firebase: Error (auth/invalid-api-key)'.");
  console.error("");
  process.exit(1);
}

console.log("✓ build env check: all required VITE_FIREBASE_* vars present");
