import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import CommissionSettingsCard from "../../components/settings/CommissionSettingsCard";
import WithdrawalSettingsCard from "../../components/settings/WithdrawalSettingsCard";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  defaultCommissionRate,
  initialCommissionSettings,
  initialWithdrawalSettings,
  type CommissionSetting,
  type WithdrawalSettings,
} from "../../data/settings.data";

export default function Settings() {
  const { t } = useTranslation();
  const [commissions, setCommissions] = useState<CommissionSetting[]>(initialCommissionSettings);
  const [defaultRate, setDefaultRate] = useState(defaultCommissionRate);
  const [withdrawalSettings, setWithdrawalSettings] = useState<WithdrawalSettings>(initialWithdrawalSettings);
  const [commissionPendingDelete, setCommissionPendingDelete] = useState<CommissionSetting | null>(null);

  const updateCommission = (id: number, rate: number) => {
    setCommissions((current) => current.map((commission) => commission.id === id ? { ...commission, rate } : commission));
  };

  const addCommission = () => {
    setCommissions((current) => [
      ...current,
      { id: Math.max(0, ...current.map((item) => item.id)) + 1, service: t("settings.newService", { number: current.length + 1 }), rate: defaultRate },
    ]);
  };

  const updateWithdrawalSetting = <Key extends keyof WithdrawalSettings>(key: Key, value: WithdrawalSettings[Key]) => {
    setWithdrawalSettings((current) => ({ ...current, [key]: value }));
  };

  const resetSettings = () => {
    toast.error(t("settings.restoreUnavailable"));
  };

  const saveSettings = () => {
    if (withdrawalSettings.minimumWithdrawal > withdrawalSettings.weeklyLimit) {
      toast.error(t("settings.minimumError"));
      return;
    }
    toast.error(t("settings.saveUnavailable"));
  };

  const confirmDeleteCommission = () => {
    if (!commissionPendingDelete) return;

    setCommissions((current) => current.filter((commission) => commission.id !== commissionPendingDelete.id));
    setCommissionPendingDelete(null);
    toast.success(t("settings.deleteSuccess"));
  };

  return (
    <section className="pb-8">
      <header className="mb-7 flex flex-wrap-reverse items-start justify-between gap-4">
        <div className="text-start">
          <h1 className="text-3xl font-extrabold text-[#75262d]">{t("settings.title")}</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">{t("settings.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={saveSettings} className="flex h-12 items-center gap-2 rounded-xl bg-[#642326] px-6 text-sm font-bold text-white transition hover:bg-[#542029]"><Save size={17} /> {t("common.saveChanges")}</button>
          <button type="button" onClick={resetSettings} className="flex h-12 items-center gap-2 rounded-xl border border-[#75262d] bg-white px-6 text-sm font-bold text-[#75262d] transition hover:bg-[#fbf3f4]"><RotateCcw size={17} /> {t("settings.restore")}</button>
        </div>
      </header>

      <CommissionSettingsCard
        commissions={commissions}
        defaultRate={defaultRate}
        onDefaultRateChange={(value) => setDefaultRate(Math.min(100, value))}
        onRateChange={updateCommission}
        onAdd={addCommission}
        onRemove={(id) => {
          const commission = commissions.find((item) => item.id === id);
          if (commission) setCommissionPendingDelete(commission);
        }}
      />

      <WithdrawalSettingsCard settings={withdrawalSettings} onChange={updateWithdrawalSetting} />

      <ConfirmDialog
        open={commissionPendingDelete !== null}
        onClose={() => setCommissionPendingDelete(null)}
        onConfirm={confirmDeleteCommission}
        icon={Trash2}
        title={t("settings.confirmDelete")}
        description={t("settings.deleteQuestion", { service: commissionPendingDelete?.service ?? "" })}
        confirmLabel={t("settings.deleteCommission")}
        tone="danger"
      />
    </section>
  );
}
