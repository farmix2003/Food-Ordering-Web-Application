import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { tranlsationEN } from "../locales/en/translation.json";
import { translationTR } from "../locales/tr/translation.json";

i18next.use(initReactI18next).init({
  debug: true,
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: tranlsationEN,
    },
    tr: {
      translation: translationTR,
    },
  },
});
