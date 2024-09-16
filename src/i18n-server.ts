import { createInstance } from "i18next";
import resources from "./i18n";

export function getServerSideI18n(lang: string) {
  const i18nInstance = createInstance();
  i18nInstance.init({
    resources,
    lng: lang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
  return i18nInstance;
}
