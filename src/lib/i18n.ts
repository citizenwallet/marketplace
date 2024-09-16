import { headers } from "next/headers";
import resources from "@/i18n.json";

const availableLanguages = ["en", "fr"];

export function getTranslations(lang: string) {
  return (
    resources[lang as keyof typeof resources]?.translation ||
    resources.en.translation
  );
}

type TranslationKeys = keyof typeof resources.en.translation;

export const Translator = (lang?: string) => {
  lang = lang || getLanguage();
  const translations = getTranslations(lang);
  return (key: TranslationKeys): string => {
    return translations[key] || key;
  };
};

export function getLanguageFromHeaders() {
  const headersList = headers();
  const acceptLanguage = headersList.get("accept-language");
  if (acceptLanguage) {
    const [browserLang] = acceptLanguage.split(",");
    const [langCode] = browserLang.split("-");
    return langCode;
  }
}

export function getLanguage(lang?: string) {
  lang = lang || getLanguageFromHeaders();
  if (lang && availableLanguages.includes(lang)) {
    return lang;
  }
  return "en";
}
