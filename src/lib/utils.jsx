// src/lib/utils.js

function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

      const formatCell = (c) =>
        escapeHTML(c)
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>")
          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

      let table = '<table class="md-table"><thead><tr>';
      headers.forEach((h) => { table += `<th>${formatCell(h)}</th>`; });
      table += "</tr></thead><tbody>";
      rows.forEach((row) => {
        table += "<tr>";
        row.forEach((cell) => { table += `<td>${formatCell(cell)}</td>`; });
        table += "</tr>";
      });
      table += "</tbody></table>";
      out.push(table);
    } else {
      // Normal line — apply inline markdown
      out.push(
        escapeHTML(lines[i])
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>")
          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      );
      i++;
    }
  }

  return out.join("<br/>");
}

export function uid() {
  return crypto.randomUUID().slice(0, 8);
}