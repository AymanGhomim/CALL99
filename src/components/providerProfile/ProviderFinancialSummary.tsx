import { Banknote, Landmark, Percent, ReceiptText } from "lucide-react";
import FinancialSummaryCard from "../cards/FinancialSummaryCard";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

export default function ProviderFinancialSummary({
  totalRevenue,
  totalOrders,
  commissions,
  netProfit,
  totalRevenueLabel,
  onViewReport,
}: { totalRevenue: number | string; totalOrders: number; commissions: number | string; netProfit: number | string; totalRevenueLabel?: string; onViewReport?: () => void }) {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  return (
    <FinancialSummaryCard
      onViewReport={onViewReport}
      rows={[
        { label: totalRevenueLabel ?? t("provider.totalRevenue"), value: formatCurrency(totalRevenue), icon: <Banknote size={18} /> },
        { label: t("provider.totalOrders"), value: totalOrders, icon: <ReceiptText size={18} /> },
        { label: t("provider.commissions"), value: formatCurrency(commissions), icon: <Percent size={18} /> },
        { label: t("provider.netProfit"), value: formatCurrency(netProfit), icon: <Landmark size={18} /> },
      ]}
    />
  );
}
