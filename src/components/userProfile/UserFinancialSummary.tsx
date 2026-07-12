import { Banknote, Percent, ReceiptText } from "lucide-react";
import FinancialSummaryCard from "../cards/FinancialSummaryCard";

export default function UserFinancialSummary({
  totalExpenses,
  totalOrders,
  commissions,
  onViewReport,
}) {
  return (
    <FinancialSummaryCard
      onViewReport={onViewReport}
      rows={[
        { label: "إجمالي المصروفات", value: totalExpenses, icon: <Banknote size={18} /> },
        { label: "إجمالي الطلبات", value: totalOrders, icon: <ReceiptText size={18} /> },
        { label: "العمولات", value: commissions, icon: <Percent size={18} /> },
      ]}
    />
  );
}
