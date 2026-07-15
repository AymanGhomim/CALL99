import { Percent, Plus, Trash2 } from "lucide-react";
import type { CommissionSetting } from "../../data/settings.data";
import SettingsField from "./SettingsField";
import { useTranslation } from "react-i18next";

interface CommissionSettingsCardProps {
  commissions: CommissionSetting[];
  defaultRate: number;
  onDefaultRateChange: (value: number) => void;
  onRateChange: (id: number, value: number) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
}

export default function CommissionSettingsCard({ commissions, defaultRate, onDefaultRateChange, onRateChange, onAdd, onRemove }: CommissionSettingsCardProps) {
  const { t } = useTranslation();
  return (
    <section className="mb-7 rounded-2xl border border-[#f2e8e8] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="text-start">
          <h2 className="text-2xl font-extrabold text-[#75262d]">{t("settings.commissions")}</h2>
          <p className="mt-1 text-sm font-medium text-gray-400">{t("settings.commissionsHint")}</p>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f4ebec] text-2xl font-extrabold text-[#75262d]"><Percent /></span>
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.85fr)]">
        <div className="overflow-hidden rounded-xl border border-[#e7dede]">
          <div className="grid grid-cols-[1fr_160px] bg-[#75262d] px-5 py-4 text-sm font-bold text-white">
            <span className="text-start">{t("filters.serviceType")}</span><span className="text-center">{t("settings.commissionRate")}</span>
          </div>
          {commissions.map((commission) => (
            <div key={commission.id} className="grid grid-cols-[1fr_160px] items-center border-b border-[#eee7e7] px-5 py-3 last:border-b-0">
              <div className="flex items-center justify-between gap-3 text-right font-semibold text-gray-500">
                <span>{commission.service}</span>
                <button type="button" title={t("settings.deleteService")} onClick={() => onRemove(commission.id)} className="text-gray-300 transition hover:text-red-500"><Trash2 size={15} /></button>
              </div>
              <div className="mx-auto flex h-9 w-28 overflow-hidden rounded-lg border border-[#e7dede]">
                <input type="number" min={0} max={100} value={commission.rate} onChange={(event) => onRateChange(commission.id, Math.min(100, Math.max(0, Number(event.target.value) || 0)))} className="w-full px-2 text-center outline-none" />
                <span className="flex items-center px-2 text-gray-400">%</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <SettingsField label={t("settings.defaultRate")} value={defaultRate} onChange={onDefaultRateChange} suffix="%" />
          <p className="mt-3 text-start text-sm leading-6 text-gray-400">{t("settings.defaultRateHint")}</p>
          <button type="button" onClick={onAdd} className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#75262d] font-bold text-[#75262d] transition hover:bg-[#fbf3f4]">
            <Plus size={18} /> {t("settings.addCommission")}
          </button>
        </div>
      </div>
    </section>
  );
}
