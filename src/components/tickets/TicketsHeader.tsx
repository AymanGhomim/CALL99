import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TicketsHeader({ onAdd }: { onAdd: () => void }) {
  const { t } = useTranslation();
  return (
    <header className="mb-7 flex flex-wrap-reverse items-center justify-between gap-4">
      <div className="text-start">
        <h1 className="text-3xl font-extrabold text-[#75262d]">{t("modules.tickets.title")}</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">{t("modules.tickets.subtitle")}</p>
      </div>
      <button type="button" onClick={onAdd} className="flex h-14 min-w-64 items-center justify-center gap-2 rounded-xl bg-[#642326] px-6 text-sm font-bold text-white transition hover:bg-[#542029]">
        <Plus size={19} /> {t("modules.tickets.add")}
      </button>
    </header>
  );
}
