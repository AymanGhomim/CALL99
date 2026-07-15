export const supportedLanguages = ["ar", "en"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const LANGUAGE_STORAGE_KEY = "app-language";

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return typeof value === "string" && supportedLanguages.includes(value as SupportedLanguage);
}

export function getLanguageDirection(language: SupportedLanguage): "rtl" | "ltr" {
  return language === "ar" ? "rtl" : "ltr";
}

export function getIntlLocale(language: SupportedLanguage): "ar-SA" | "en-US" {
  return language === "ar" ? "ar-SA" : "en-US";
}
