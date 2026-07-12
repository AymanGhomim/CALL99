import { Eye } from "lucide-react";
import Badge from "../ui/Badge";
import DataTable from "../ui/DataTable";

export interface Withdrawal {
  id: number;
  requestNo: string;
  provider: string;
  method: string;
  status: string;
  amount: string;
  date: string;
  service: string;
}

interface WithdrawalsTableProps {
  rows: Withdrawal[];
  onView: (withdrawal: Withdrawal) => void;
}

const statusTones = { "تمت الموافقة": "success", "مرفوض": "danger", "قيد المعالجة": "info" } as const;

export default function WithdrawalsTable({ rows, onView }: WithdrawalsTableProps) {
  const columns = [
    { key: "requestNo", label: "رقم الطلب", cellClassName: "font-extrabold text-[#75262d]" },
    { key: "provider", label: "مقدم الخدمة", cellClassName: "font-bold text-[#3d3434]" },
    { key: "method", label: "طريقة السحب", align: "center", cellClassName: "font-bold text-[#3d3434]" },
    { key: "status", label: "الحالة", align: "center", render: (row: Withdrawal) => <Badge tone={statusTones[row.status as keyof typeof statusTones] ?? "neutral"}>{row.status}</Badge> },
    { key: "amount", label: "المبلغ", align: "center" },
    { key: "date", label: "التاريخ", align: "center" },
    {
      key: "actions",
      label: "الإجراءات",
      align: "center",
      render: (row: Withdrawal) => (
        <button type="button" title="عرض الطلب" onClick={() => onView(row)} className="inline-flex rounded-lg p-2 transition hover:bg-emerald-50">
          <Eye size={19} className="text-emerald-500" />
        </button>
      ),
    },
  ];

  return <DataTable title="طلبات السحب" columns={columns} rows={rows} minWidth="900px" pagination={{ currentPage: 1, totalPages: 3, totalCount: 2482, itemLabel: "طلب" }} />;
}
