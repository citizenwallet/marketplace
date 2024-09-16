import resources from "@/i18n.json";

export function getTranslations(lang: string) {
  return (
    resources[lang as keyof typeof resources]?.translation ||
    resources.en.translation
  );
}

type TranslationKeys = keyof typeof resources.en.translation;

export const Translator = (lang: string) => {
  const translations = getTranslations(lang);
  return (key: TranslationKeys): string => {
    return translations[key] || key;
  };
};
