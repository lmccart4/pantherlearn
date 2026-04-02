// src/lib/theme.js — Theme (light/dark) utilities
const STORAGE_KEY = 'pantherlearn-theme';

export function getTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  } catch {
    return 'dark';
  }
}

export function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch { /* localStorage unavailable */ }
  document.documentElement.dataset.theme = theme;
}

// Apply immediately on import (runs before React render)
const saved = getTheme();
if (saved === 'light') {
  document.documentElement.dataset.theme = 'light';
}
