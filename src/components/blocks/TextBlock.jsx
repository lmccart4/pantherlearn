// src/components/blocks/TextBlock.jsx
import { renderMarkdown } from "../../lib/utils";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";

export default function TextBlock({ block }) {
  const translated = useTranslatedText(block.content);
  return <div className="text-block" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translated) }} />;
}
