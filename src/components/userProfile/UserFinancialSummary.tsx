import { Banknote, Percent, ReceiptText } from "lucide-react";
import FinancialSummaryCard from "../cards/FinancialSummaryCard";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

export default function UserFinancialSummary({
  totalExpenses,
  totalOrders,
  commissions,
  onViewReport,
}: { totalExpenses: string; totalOrders: number; commissions: string; onViewReport?: () => void }) {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  return (
    <FinancialSummaryCard
      onViewReport={onViewReport}
      rows={[
        { label: t("common.totalExpenses"), value: formatCurrency(totalExpenses), icon: <Banknote size={18} /> },
        { label: t("stats.totalOrders"), value: totalOrders, icon: <ReceiptText size={18} /> },
        { label: t("provider.commissions"), value: formatCurrency(commissions), icon: <Percent size={18} /> },
      ]}
    />
  );
}
