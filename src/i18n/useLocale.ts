import { useTranslation } from "react-i18next";
import { getIntlLocale, isSupportedLanguage, type SupportedLanguage } from "./types";

export default function useLocale() {
  const { i18n } = useTranslation();
  const language: SupportedLanguage = isSupportedLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : "ar";
  const locale = getIntlLocale(language);

  const formatCurrency = (value: number | string) => {
    const numericValue = typeof value === "number"
      ? value
      : Number.parseFloat(value.replace(/[^\d.-]/g, ""));

    if (!Number.isFinite(numericValue)) {
      return language === "en" ? String(value).replace(/ر\.س|ريال/g, "SAR") : String(value);
    }

    if (language === "en") {
      const formattedNumber = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue);
      return `${formattedNumber} SAR`;
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const formatTimeText = (value: string) => language === "en"
    ? value
      .replace(/\s*ص(?:باحًا|باحاً)?(?=$|[\s،,|])/g, " AM")
      .replace(/\s*م(?:ساءً|ساءً)?(?=$|[\s،,|])/g, " PM")
    : value;

  return {
    language,
    locale,
    direction: language === "ar" ? "rtl" as const : "ltr" as const,
    formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      const date = value instanceof Date ? value : new Date(value);
      return Number.isNaN(date.getTime())
        ? String(value)
        : new Intl.DateTimeFormat(locale, options ?? { dateStyle: "medium" }).format(date);
    },
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value),
    formatCurrency,
    formatTimeText,
  };
}
