import { Banknote, Landmark, Percent, ReceiptText } from "lucide-react";
import FinancialSummaryCard from "../cards/FinancialSummaryCard";

export default function ProviderFinancialSummary({
  totalRevenue,
  totalOrders,
  commissions,
  netProfit,
  onViewReport,
}) {
  return (
    <FinancialSummaryCard
      onViewReport={onViewReport}
      rows={[
        { label: "إجمالي الإيرادات", value: totalRevenue, icon: <Banknote size={18} /> },
        { label: "إجمالي الطلبات", value: totalOrders, icon: <ReceiptText size={18} /> },
        { label: "العمولات", value: commissions, icon: <Percent size={18} /> },
        { label: "صافي الأرباح", value: netProfit, icon: <Landmark size={18} /> },
      ]}
    />
  );
}
