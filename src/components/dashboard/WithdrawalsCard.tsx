import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

export default function WithdrawalsCard() {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  return (
    <div className="rounded-xl bg-[#75262d] p-8 text-white shadow-sm">
      <h3 className="text-2xl font-extrabold">{t("dashboard.withdrawalsTitle")}</h3>
      <p className="mt-2 text-sm text-white/75">
        {t("dashboard.withdrawalsDescription")}
      </p>

      <div className="mt-8 flex flex-col items-start gap-4 rounded-xl bg-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-start">
          <p className="text-xs text-white/70">{t("dashboard.totalAmount")}</p>
          <p className="text-2xl font-extrabold">{formatCurrency(12540)}</p>
        </div>
        <Link to="/wallet/withdrawals" className="w-full rounded-lg bg-white px-5 py-3 text-center text-sm font-bold text-[#75262d] lg:w-auto">
          {t("dashboard.reviewRequests")}
        </Link>
      </div>
    </div>
  );
}
