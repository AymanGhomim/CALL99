import { Download, Eye, RotateCcw } from "lucide-react";
import Badge from "../ui/Badge";
import DataTable from "../ui/DataTable";
import { useTranslation } from "react-i18next";
import { translateLegacyText } from "../../i18n/translateEnum";
import useLocale from "../../i18n/useLocale";

export interface Transaction {
  id: number;
  transactionNo: string;
  orderNo: string;
  customer: string;
  provider: string;
  gateway: string;
  paymentMethod: string;
  amount: string;
  type: string;
  status: string;
  createdAt: string;
  createdDate: string;
  service: string;
}

interface TransactionsTableProps {
  rows: Transaction[];
  onView: (transaction: Transaction) => void;
  onRefund: (transaction: Transaction) => void;
  onDownload: (transaction: Transaction) => void;
}

const statusTone = { "مكتمل": "success", "فشل": "danger", "في الانتظار": "warning" } as const;
const typeTone = { "تحصيل": "sky", "تسوية": "purple", "استرداد": "danger", "تفويض مسبق": "info" } as const;

export default function TransactionsTable({ rows, onView, onRefund, onDownload }: TransactionsTableProps) {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  const columns = [
    { key: "transactionNo", label: t("finance.transactionNumber"), cellClassName: "font-bold text-[#75262d]" },
    { key: "orderNo", label: t("tables.orderNumber"), cellClassName: "font-bold text-[#75262d]" },
    { key: "customer", label: t("tables.customer") }, { key: "provider", label: t("tables.provider") },
    { key: "gateway", label: t("finance.gateway"), align: "center" },
    { key: "paymentMethod", label: t("finance.paymentMethod"), align: "center" },
    { key: "amount", label: t("finance.amount"), align: "center", render: (row: Transaction) => formatCurrency(row.amount) },
    { key: "type", label: t("finance.transactionType"), align: "center", render: (row: Transaction) => <Badge tone={typeTone[row.type as keyof typeof typeTone] ?? "neutral"}>{translateLegacyText(row.type, t)}</Badge> },
    { key: "status", label: t("common.status"), align: "center", render: (row: Transaction) => <Badge tone={statusTone[row.status as keyof typeof statusTone] ?? "neutral"}>{translateLegacyText(row.status, t)}</Badge> },
    { key: "createdAt", label: t("common.createdAt"), align: "center" },
    {
      key: "actions",
      label: t("common.actions"),
      align: "center",
      render: (row: Transaction) => (
        <div className="flex items-center justify-center gap-3">
          <button type="button" title={t("common.view")} onClick={() => onView(row)}><Eye size={18} className="text-emerald-500" /></button>
          <button type="button" title={t("finance.refund")} onClick={() => onRefund(row)}><RotateCcw size={17} className="text-amber-500" /></button>
          <button type="button" title={t("finance.download")} onClick={() => onDownload(row)}><Download size={17} className="text-blue-500" /></button>
        </div>
      ),
    },
  ];

  return <DataTable title={t("finance.transactions")} columns={columns} rows={rows} minWidth="1360px" pagination={{ currentPage: 1, totalPages: 3, totalCount: 2482, itemLabel: t("finance.itemTransaction") }} />;
}
