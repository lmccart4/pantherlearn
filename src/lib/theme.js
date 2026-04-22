// src/lib/theme.js — Savanna Signal theme + role
const THEME_KEY = 'pantherlearn-theme';
const ROLE_KEY = 'pantherlearn-role';

function prefersDark() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function getTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* noop */ }
  return prefersDark() ? 'dark' : 'light';
}

export function setTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* noop */ }
  document.documentElement.dataset.theme = theme;
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function getRole() {
  try {
    const saved = localStorage.getItem(ROLE_KEY);
    if (saved === 'teacher' || saved === 'guardian' || saved === 'student') return saved;
  } catch { /* noop */ }
  return 'student';
}

export function setRole(role) {
  try { localStorage.setItem(ROLE_KEY, role); } catch { /* noop */ }
  if (role && role !== 'student') {
    document.documentElement.dataset.role = role;
  } else {
    delete document.documentElement.dataset.role;
  }
}

// Apply immediately (before React renders)
const theme = getTheme();
document.documentElement.dataset.theme = theme;
const role = getRole();
if (role && role !== 'student') {
  document.documentElement.dataset.role = role;
}
