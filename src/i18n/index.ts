import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar/translation.json";
import en from "./locales/en/translation.json";
import {
  LANGUAGE_STORAGE_KEY,
  getLanguageDirection,
  isSupportedLanguage,
  type SupportedLanguage,
} from "./types";

function readStoredLanguage(): SupportedLanguage {
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(storedLanguage) ? storedLanguage : "ar";
  } catch {
    return "ar";
  }
}

export function applyDocumentLanguage(language: SupportedLanguage): void {
  const direction = getLanguageDirection(language);
  document.documentElement.lang = language;
  document.documentElement.dir = direction;
  document.body.dir = direction;
}

export const initialLanguage = readStoredLanguage();
applyDocumentLanguage(initialLanguage);

void i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: "ar",
  supportedLngs: ["ar", "en"],
  interpolation: { escapeValue: false },
  returnNull: false,
});

i18n.on("languageChanged", (value) => {
  const language: SupportedLanguage = isSupportedLanguage(value) ? value : "ar";
  applyDocumentLanguage(language);
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The active language still works when storage is unavailable.
  }
});

export async function changeLanguage(language: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(language);
}

export function getCurrentLanguage(): SupportedLanguage {
  return isSupportedLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : "ar";
}

export default i18n;
