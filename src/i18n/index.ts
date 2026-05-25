import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "ar"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18n_lang",
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Apply RTL + lang attribute whenever language changes
i18n.on("languageChanged", (lng) => {
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

// Apply on initial load
const initialLang = i18n.language?.split("-")[0] || "en";
document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
document.documentElement.lang = initialLang;

export default i18n;
