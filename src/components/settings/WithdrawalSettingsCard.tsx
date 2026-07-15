import { WalletCards } from "lucide-react";
import type { WithdrawalSettings } from "../../data/settings.data";
import SettingsField from "./SettingsField";
import { useTranslation } from "react-i18next";

interface WithdrawalSettingsCardProps {
  settings: WithdrawalSettings;
  onChange: <Key extends keyof WithdrawalSettings>(key: Key, value: WithdrawalSettings[Key]) => void;
}

export default function WithdrawalSettingsCard({ settings, onChange }: WithdrawalSettingsCardProps) {
  const { t } = useTranslation();
  return (
    <section className="rounded-2xl border border-[#f2e8e8] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="text-start">
          <h2 className="text-2xl font-extrabold text-[#75262d]">{t("settings.withdrawals")}</h2>
          <p className="mt-1 text-sm font-medium text-gray-400">{t("settings.withdrawalsHint")}</p>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f4ebec] text-[#75262d]"><WalletCards size={25} /></span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SettingsField label={t("settings.freezeThreshold")} value={settings.freezeThreshold} onChange={(value) => onChange("freezeThreshold", value)} suffix={t("common.sar")} hint={t("settings.freezeThresholdHint")} />
        <SettingsField label={t("settings.weeklyLimit")} value={settings.weeklyLimit} onChange={(value) => onChange("weeklyLimit", value)} suffix={t("common.sar")} hint={t("settings.weeklyLimitHint")} />
        <SettingsField label={t("settings.minimumWithdrawal")} value={settings.minimumWithdrawal} onChange={(value) => onChange("minimumWithdrawal", value)} suffix={t("common.sar")} hint={t("settings.minimumWithdrawalHint")} />
      </div>

      <div className="mt-8 border-t border-[#eee7e7] pt-7">
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-[#faf9f9] p-5">
          <div className="text-start">
            <p className="font-extrabold text-[#3d3434]">{t("settings.autoFreeze")}</p>
            <p className="mt-1 text-sm text-gray-400">{t("settings.autoFreezeHint")}</p>
          </div>
          <button type="button" role="switch" aria-checked={settings.autoFreezeEnabled} onClick={() => onChange("autoFreezeEnabled", !settings.autoFreezeEnabled)} className={`relative h-7 w-12 shrink-0 rounded-full transition ${settings.autoFreezeEnabled ? "bg-[#75262d]" : "bg-gray-300"}`}>
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${settings.autoFreezeEnabled ? "right-1" : "right-6"}`} />
          </button>
        </label>
      </div>
    </section>
  );
}
