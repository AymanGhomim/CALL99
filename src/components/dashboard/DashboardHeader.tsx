import { useTranslation } from "react-i18next";

export default function DashboardHeader() {
  const { t } = useTranslation();
  return (
    <header className="mb-7 text-start">
      <h1 className="text-3xl font-extrabold text-[#75262d]">{t("modules.dashboard.title")}</h1>
      <p className="mt-1 text-sm font-medium text-gray-500">
        {t("modules.dashboard.subtitle")}
      </p>
    </header>
  );
}
