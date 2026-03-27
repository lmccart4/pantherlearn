// src/contexts/TranslationContext.jsx
import { createContext, useContext, useState, useCallback, useRef } from "react";
import { auth } from "../lib/firebase";

const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文", flag: "🇹🇼" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇧🇷" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
];

const TranslationContext = createContext(null);

export function TranslationProvider({ children, cloudFunctionUrl }) {
  const [language, setLanguage] = useState("en");
  const cache = useRef({}); // { "es:Hello": "Hola" }
  const pending = useRef({}); // dedup in-flight requests

  const translate = useCallback(
    async (texts) => {
      if (language === "en" || !cloudFunctionUrl) return texts;

      const results = new Array(texts.length);
      const toTranslate = [];
      const toTranslateIdx = [];

      // Check cache first
      texts.forEach((text, i) => {
        if (!text || typeof text !== "string") {
          results[i] = text;
          return;
        }
        const key = `${language}:${text}`;
        if (cache.current[key]) {
          results[i] = cache.current[key];
        } else {
          toTranslate.push(text);
          toTranslateIdx.push(i);
        }
      });

      if (toTranslate.length === 0) return results;

      // Dedup: create a key for this batch
      const batchKey = `${language}:${toTranslate.join("|")}`;
      if (pending.current[batchKey]) {
        const translated = await pending.current[batchKey];
        translated.forEach((t, j) => {
          results[toTranslateIdx[j]] = t;
        });
        return results;
      }

      const promise = (async () => {
        try {
          const user = auth.currentUser;
          const idToken = user ? await user.getIdToken() : null;
          const res = await fetch(cloudFunctionUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(idToken ? { "Authorization": `Bearer ${idToken}` } : {}),
            },
            body: JSON.stringify({
              texts: toTranslate,
              targetLanguage: language,
              sourceLanguage: "en",
            }),
          });
          const data = await res.json();
          if (data.translations) {
            // Cache each translation
            data.translations.forEach((t, j) => {
              cache.current[`${language}:${toTranslate[j]}`] = t;
            });
            return data.translations;
          }
          return toTranslate; // fallback to original
        } catch {
          return toTranslate;
        } finally {
          delete pending.current[batchKey];
        }
      })();

      pending.current[batchKey] = promise;
      const translated = await promise;
      translated.forEach((t, j) => {
        results[toTranslateIdx[j]] = t;
      });
      return results;
    },
    [language, cloudFunctionUrl]
  );

  const translateOne = useCallback(
    async (text) => {
      if (!text || language === "en") return text;
      const [result] = await translate([text]);
      return result;
    },
    [translate, language]
  );

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage, translate, translateOne, languages: LANGUAGES }}
    >
      {language === "ar" && (
        <style>{`[data-translatable] { direction: rtl; text-align: right; }`}</style>
      )}
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
}
