import { Download, Eye, RotateCcw } from "lucide-react";
import Badge from "../ui/Badge";
import DataTable from "../ui/DataTable";

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
  const columns = [
    { key: "transactionNo", label: "رقم المعاملة", cellClassName: "font-bold text-[#75262d]" },
    { key: "orderNo", label: "رقم الطلب", cellClassName: "font-bold text-[#75262d]" },
    { key: "customer", label: "العميل" },
    { key: "provider", label: "مقدم الخدمة" },
    { key: "gateway", label: "بوابة الدفع", align: "center" },
    { key: "paymentMethod", label: "وسيلة الدفع", align: "center" },
    { key: "amount", label: "المبلغ", align: "center" },
    { key: "type", label: "نوع العملية", align: "center", render: (row: Transaction) => <Badge tone={typeTone[row.type as keyof typeof typeTone] ?? "neutral"}>{row.type}</Badge> },
    { key: "status", label: "الحالة", align: "center", render: (row: Transaction) => <Badge tone={statusTone[row.status as keyof typeof statusTone] ?? "neutral"}>{row.status}</Badge> },
    { key: "createdAt", label: "تاريخ الإنشاء", align: "center" },
    {
      key: "actions",
      label: "الإجراءات",
      align: "center",
      render: (row: Transaction) => (
        <div className="flex items-center justify-center gap-3">
          <button type="button" title="عرض" onClick={() => onView(row)}><Eye size={18} className="text-emerald-500" /></button>
          <button type="button" title="استرداد" onClick={() => onRefund(row)}><RotateCcw size={17} className="text-amber-500" /></button>
          <button type="button" title="تحميل" onClick={() => onDownload(row)}><Download size={17} className="text-blue-500" /></button>
        </div>
      ),
    },
  ];

  return <DataTable title="المعاملات المالية الأخيرة" columns={columns} rows={rows} minWidth="1360px" pagination={{ currentPage: 1, totalPages: 3, totalCount: 2482, itemLabel: "معاملة" }} />;
}
