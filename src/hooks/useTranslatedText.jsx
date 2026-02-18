// src/hooks/useTranslatedText.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "../contexts/TranslationContext";

const BATCH_SIZE = 25; // max strings per translation request

export function useTranslatedText(text) {
  const { translateOne, language } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text || language === "en") {
      setTranslated(text);
      return;
    }
    let cancelled = false;
    translateOne(text).then((t) => {
      if (!cancelled) setTranslated(t);
    });
    return () => { cancelled = true; };
  }, [text, language, translateOne]);

  return translated;
}

export function useTranslatedTexts(texts) {
  const { translate, language } = useTranslation();
  const [translated, setTranslated] = useState(texts);

  useEffect(() => {
    if (!texts || !texts.length || language === "en") {
      setTranslated(texts);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        // Split into chunks to avoid overloading the translation endpoint
        const results = new Array(texts.length);
        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
          const chunk = texts.slice(i, i + BATCH_SIZE);
          const chunkResult = await translate(chunk);
          chunkResult.forEach((t, j) => { results[i + j] = t; });
        }
        if (!cancelled) setTranslated(results);
      } catch {
        if (!cancelled) setTranslated(texts);
      }
    })();

    return () => { cancelled = true; };
  }, [JSON.stringify(texts), language, translate]);

  return translated;
}

export function TranslatedText({ children, as: Tag = "span", ...props }) {
  const translated = useTranslatedText(typeof children === "string" ? children : "");
  return <Tag data-translatable {...props}>{translated}</Tag>;
}
