import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MobileTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#f2e8e8] bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2">
        <img
          src="/images/logo.png"
          alt="CALL99"
          className="h-9 w-9 rounded-lg object-contain"
        />
        <span className="text-lg font-extrabold text-[#75262d]">CALL99</span>
      </div>

      <button
        type="button"
        onClick={onMenuClick}
        aria-label={t("navigation.open")}
        className="rounded-lg p-2 text-[#75262d] transition hover:bg-[#fbf7f7]"
      >
        <Menu size={22} />
      </button>
    </header>
  );
}
