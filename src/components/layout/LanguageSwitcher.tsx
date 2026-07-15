import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../i18n";
import useLocale from "../../i18n/useLocale";

interface LanguageSwitcherProps {
  compact?: boolean;
  inverted?: boolean;
}

export default function LanguageSwitcher({ compact = false, inverted = false }: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const { language } = useLocale();
  const nextLanguage = language === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={() => void changeLanguage(nextLanguage)}
      aria-label={t("common.changeLanguage")}
      title={t("common.changeLanguage")}
      className={`flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-bold transition sm:h-11 ${
        inverted
          ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
          : "border-[#eadfe0] bg-[#fbf8f8] text-[#68595b] hover:border-[#75262d]/25 hover:bg-[#75262d]/8 hover:text-[#75262d]"
      }`}
    >
      <Languages size={18} />
      {!compact && <span>{t("common.languageSwitch")}</span>}
    </button>
  );
}
