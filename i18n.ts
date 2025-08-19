// i18n.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

import en from "./locales/en.json";
import mm from "./locales/mm.json";

const STORAGE_KEY = "APP_LANG";

const resources = {
  en: { translation: en },
  mm: { translation: mm },
};

const languageDetector: any = {
  type: "languageDetector",
  async: true,
  detect: (cb: (lng: string) => void) => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) {
          cb(saved);
        } else {
          const locales = RNLocalize.getLocales();
          const deviceLng = locales[0]?.languageCode || "en";
          cb(deviceLng.startsWith("my") ? "mm" : deviceLng);
        }
      })
      .catch((err) => {
        console.log("Error reading language from AsyncStorage", err);
        cb("en"); // fallback
      });
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => {
    AsyncStorage.setItem(STORAGE_KEY, lng).catch((err) => {
      console.log("Error saving language to AsyncStorage", err);
    });
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    // 👇 fix compatibility
    compatibilityJSON: "v4", 

    // 👇 keep translations
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "mm"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  } as any); // 👈 quick fix for TS typing


export default i18n;
