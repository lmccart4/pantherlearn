// src/lib/ttsTextExtractor.js
// Pure utility — extracts readable text from lesson blocks for TTS.

/**
 * Strip markdown formatting from text:
 *   **bold** → bold, *italic* → italic, [text](url) → text,
 *   ![alt](url) → "", `code` → code, ```blocks``` → content,
 *   HTML tags → "", headings (#) → text
 */
function stripMarkdown(md) {
  if (!md) return "";
  return md
    .replace(/```[\s\S]*?```/g, "")       // code blocks
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/#{1,6}\s+/g, "")             // headings
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2") // bold/italic
    .replace(/`([^`]+)`/g, "$1")           // inline code
    .replace(/<[^>]+>/g, "")               // HTML tags
    .replace(/^[-*+]\s+/gm, "")           // list bullets
    .replace(/^\d+\.\s+/gm, "")           // numbered lists
    .replace(/^>\s+/gm, "")               // blockquotes
    .replace(/\n{2,}/g, "\n")             // multiple newlines
    .trim();
}

/**
 * Extract readable text from a single block.
 * Returns a plain string (empty string for non-readable blocks).
 */
export function extractBlockText(block) {
  if (!block) return "";

  switch (block.type) {
    case "text":
      return stripMarkdown(block.content);

    case "section_header": {
      const parts = [];
      if (block.title) parts.push(block.title);
      if (block.subtitle) parts.push(block.subtitle);
      return parts.join(". ");
    }

    case "definition": {
      const parts = [];
      if (block.term) parts.push(block.term);
      if (block.definition) parts.push(stripMarkdown(block.definition));
      return parts.join(": ");
    }

    case "callout":
      return stripMarkdown(block.content);

    case "objectives": {
      const parts = [];
      if (block.title) parts.push(block.title);
      if (block.items?.length) {
        parts.push(block.items.join(". "));
      }
      return parts.join(". ");
    }

    case "activity": {
      const parts = [];
      if (block.title) parts.push(block.title);
      if (block.instructions) parts.push(stripMarkdown(block.instructions));
      return parts.join(". ");
    }

    case "vocab_list": {
      if (!block.terms?.length) return "";
      return block.terms
        .map((t) => `${t.term}: ${t.definition}`)
        .join(". ");
    }

    case "question": {
      const parts = [];
      if (block.prompt) parts.push(stripMarkdown(block.prompt));
      if (block.options?.length) {
        parts.push(
          block.options
            .map((opt, i) => `Option ${i + 1}: ${typeof opt === "string" ? opt : opt.text || opt.label || ""}`)
            .join(". ")
        );
      }
      if (block.explanation) parts.push(`Explanation: ${stripMarkdown(block.explanation)}`);
      return parts.join(". ");
    }

    case "checklist": {
      const parts = [];
      if (block.title) parts.push(block.title);
      if (block.items?.length) {
        parts.push(block.items.map((item) => (typeof item === "string" ? item : item.text || "")).join(". "));
      }
      return parts.join(". ");
    }

    case "sorting": {
      const parts = [];
      if (block.title) parts.push(block.title);
      if (block.instructions) parts.push(stripMarkdown(block.instructions));
      return parts.join(". ");
    }

    case "external_link": {
      const parts = [];
      if (block.title) parts.push(block.title);
      if (block.description) parts.push(block.description);
      return parts.join(". ");
    }

    // Non-readable block types
    case "video":
    case "image":
    case "divider":
    case "embed":
    case "simulation":
    case "sketch":
    case "bar_chart":
    case "data_table":
    case "calculator":
    case "evidence_upload":
      return "";

    default:
      // Fallback: try common text fields
      return stripMarkdown(block.content || block.text || block.title || "");
  }
}

/**
 * Extract all readable text from a lesson's blocks.
 * Returns an array of { blockId, text } for blocks that have text.
 */
export function extractLessonText(blocks) {
  if (!blocks?.length) return [];

  return blocks
    .map((block) => ({
      blockId: block.id,
      text: extractBlockText(block),
    }))
    .filter((entry) => entry.text.length > 0);
}
