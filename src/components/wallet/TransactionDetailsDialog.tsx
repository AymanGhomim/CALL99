import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import type { Transaction } from "./TransactionsTable";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";
import { translateLegacyText } from "../../i18n/translateEnum";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TransactionDetailsDialog({ transaction, onClose }: TransactionDetailsDialogProps) {
  const { t } = useTranslation();
  const { direction, formatCurrency } = useLocale();
  const details = transaction ? [
    [t("finance.transactionNumber"), transaction.transactionNo], [t("tables.orderNumber"), transaction.orderNo],
    [t("tables.customer"), transaction.customer], [t("tables.provider"), transaction.provider],
    [t("finance.gateway"), transaction.gateway], [t("finance.paymentMethod"), transaction.paymentMethod],
    [t("finance.amount"), formatCurrency(transaction.amount)], [t("finance.transactionType"), translateLegacyText(transaction.type, t)],
    [t("common.createdAt"), transaction.createdAt], [t("tables.service"), translateLegacyText(transaction.service, t)],
  ] : [];

  return (
    <Modal open={transaction !== null} onClose={onClose} title={t("finance.transactionDetails")} maxWidth="max-w-[680px]">
      {transaction && <div dir={direction} className="space-y-5">
        <div className="flex items-center justify-between rounded-2xl bg-[#faf6f6] p-4">
          <strong className="text-lg text-[#75262d]">{transaction.transactionNo}</strong>
          <Badge tone={transaction.status === "مكتمل" ? "success" : transaction.status === "فشل" ? "danger" : "warning"}>{translateLegacyText(transaction.status, t)}</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {details.map(([label, value]) => <div key={label} className="rounded-xl border border-[#eee5e5] p-4 text-right"><p className="text-xs text-gray-400">{label}</p><p className="mt-1 font-bold text-[#3d3434]">{value}</p></div>)}
        </div>
        <button type="button" onClick={onClose} className="h-11 rounded-xl bg-[#75262d] px-7 font-bold text-white">{t("common.close")}</button>
      </div>}
    </Modal>
  );
}
