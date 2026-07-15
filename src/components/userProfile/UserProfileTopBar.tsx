import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { translateLegacyText } from "../../i18n/translateEnum";

export default function UserProfileTopBar({ title, subtitle }: { title?: string; subtitle?: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resolvedTitle = title ? translateLegacyText(title, t) : t("modules.profile.title");
  const resolvedSubtitle = subtitle ? translateLegacyText(subtitle, t) : t("modules.profile.subtitle");

  return (
    <div className="mb-7 flex items-center justify-between">
      <div className="text-start">
        <h1 className="text-3xl font-extrabold text-[#75262d]">{resolvedTitle}</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">{resolvedSubtitle}</p>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-lg border border-[#e7dede] bg-white px-4 py-2 text-sm font-bold text-[#3d3434] shadow-sm transition-colors hover:bg-[#fbf7f7]"
      >
        <ArrowLeft size={16} />
        {t("common.back")}
      </button>
    </div>
  );
}
