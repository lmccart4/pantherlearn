// src/lib/perfMode.js — Performance Mode utilities
const STORAGE_KEY = 'pantherlearn-perf-mode';

export function isPerfMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPerfMode(enabled) {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch { /* localStorage unavailable */ }
  if (enabled) {
    document.documentElement.classList.add('perf-mode');
  } else {
    document.documentElement.classList.remove('perf-mode');
  }
}

// Apply immediately on import (runs before React render)
if (isPerfMode()) {
  document.documentElement.classList.add('perf-mode');
}
