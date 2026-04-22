// src/lib/utils.js
import katex from "katex";
import "katex/dist/katex.min.css";
import { isPerfMode } from "./perfMode";

function renderKaTeX(text) {
  const DOLLAR_PLACEHOLDER = "\u0000ESC_DOLLAR\u0000";
  // Protect escaped dollar signs (\$) so KaTeX doesn't treat them as math delimiters
  text = text.replace(/\\\$/g, DOLLAR_PLACEHOLDER);

  // In performance mode, strip $ delimiters and show plain text math
  if (isPerfMode()) {
    return text
      .replace(/\$\$(.+?)\$\$/gs, (_, expr) => `<div class="perf-math">${expr.trim()}</div>`)
      .replace(/(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)/g, (_, expr) => expr.trim())
      .replaceAll(DOLLAR_PLACEHOLDER, "$");
  }
  // Block math: $$...$$
  text = text.replace(/\$\$(.+?)\$\$/gs, (_, expr) => {
    try { return katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false }); }
    catch { return expr; }
  });
  // Inline math: $...$  (not preceded/followed by $)
  text = text.replace(/(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)/g, (_, expr) => {
    try { return katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false }); }
    catch { return expr; }
  });
  // Restore escaped dollars as literal $
  return text.replaceAll(DOLLAR_PLACEHOLDER, "$");
}

function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeHref(url) {
  // Only allow safe protocols — reject javascript:, data:, vbscript:, etc.
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("http:") || trimmed.startsWith("https:") || trimmed.startsWith("mailto:")) {
    return url;
  }
  // Relative URLs (no protocol) are allowed
  if (!trimmed.includes(":")) return url;
  return "#";
}

function inlineMarkdown(text) {
  return escapeHTML(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/!\[(.+?)\]\((.+?)\)/g, (_, alt, src) =>
      `<img src="${sanitizeHref(src)}" alt="${alt}" style="max-width:100%;border-radius:8px;margin:8px 0" loading="lazy" />`
    )
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, label, url) =>
      `<a href="${sanitizeHref(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`
    );
}

export function renderMarkdown(text) {
  if (!text) return "";
  // Split into lines to detect markdown tables
  const lines = text.split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    // Detect markdown table: row of |cells|, followed by |---|, followed by more |cells|
    if (
      lines[i].trim().startsWith("|") &&
      i + 1 < lines.length &&
      /^\|[\s:]*-+[\s:]*/.test(lines[i + 1].trim())
    ) {
      const parseRow = (line) =>
        line.split("|").slice(1, -1).map((c) => c.trim());

      const headers = parseRow(lines[i]);
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(parseRow(lines[i]));
        i++;
      }

      let table = '<table class="md-table"><thead><tr>';
      headers.forEach((h) => { table += `<th>${inlineMarkdown(h)}</th>`; });
      table += "</tr></thead><tbody>";
      rows.forEach((row) => {
        table += "<tr>";
        row.forEach((cell) => { table += `<td>${inlineMarkdown(cell)}</td>`; });
        table += "</tr>";
      });
      table += "</tbody></table>";
      out.push(table);
    } else {
      // Normal line — apply inline markdown
      out.push(inlineMarkdown(lines[i]));
      i++;
    }
  }

  return renderKaTeX(out.join("<br/>"));
}

export function uid() {
  return crypto.randomUUID().slice(0, 8);
}

// Render plain student text with clickable URLs. Does NOT parse markdown —
// student input is untrusted; we only auto-link http(s) / www URLs.
export function linkifyText(text) {
  if (text === null || text === undefined) return null;
  const str = String(text);
  if (!str) return str;
  const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
  const parts = [];
  let lastIdx = 0;
  let match;
  let key = 0;
  while ((match = urlRegex.exec(str)) !== null) {
    if (match.index > lastIdx) parts.push(str.slice(lastIdx, match.index));
    const raw = match[0].replace(/[.,;:!?)\]]+$/, ""); // strip trailing punctuation
    const href = raw.startsWith("http") ? raw : `https://${raw}`;
    parts.push(
      <a
        key={`lnk-${key++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ color: "var(--amber)", textDecoration: "underline", wordBreak: "break-all" }}
      >
        {raw}
      </a>
    );
    // push the trailing punctuation we stripped so formatting survives
    const trailing = match[0].slice(raw.length);
    if (trailing) parts.push(trailing);
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < str.length) parts.push(str.slice(lastIdx));
  return parts.length > 0 ? parts : str;
}