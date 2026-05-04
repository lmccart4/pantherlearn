// src/components/blocks/CalloutBlock.jsx
// Migrated to use the Savanna <Callout> primitive.
import { renderMarkdown } from "../../lib/utils";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { Callout } from "../savanna/index.jsx";

// Map authoring styles → savanna tones.
// "insight" is the default in the lesson editor; surface it as a warm "warn" tone
// (matches the previous .callout-insight skin which used --status-warn).
const TONE_MAP = {
  insight: "warn",
  warning: "danger",
  question: "info",
  info: "info",
  success: "success",
  tip: "warn",
};

export default function CalloutBlock({ block }) {
  const translated = useTranslatedText(block.content);
  const tone = TONE_MAP[block.style] || "info";
  return (
    <Callout tone={tone} icon={block.icon}>
      <div
        data-translatable
        dangerouslySetInnerHTML={{ __html: renderMarkdown(translated) }}
      />
    </Callout>
  );
}
