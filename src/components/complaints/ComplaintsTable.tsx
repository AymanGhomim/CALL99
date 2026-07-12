import { Eye, Pencil } from "lucide-react";
import Badge from "../ui/Badge";
import DataTable from "../ui/DataTable";

export interface Complaint {
  id: number;
  ticketNo: string;
  customer: string;
  type: string;
  orderNo: string;
  date: string;
  status: string;
}

interface ComplaintsTableProps {
  rows: Complaint[];
  onView: (complaint: Complaint) => void;
  onEdit: (complaint: Complaint) => void;
}

const statusTone = {
  "نشط": "success",
  "قيد المعالجة": "warning",
  "مرفوضة": "danger",
} as const;

export default function ComplaintsTable({ rows, onView, onEdit }: ComplaintsTableProps) {
  const columns = [
    { key: "ticketNo", label: "رقم التذكرة", cellClassName: "font-extrabold text-[#75262d]" },
    { key: "customer", label: "العميل", cellClassName: "font-bold text-[#3d3434]" },
    { key: "type", label: "نوع الشكوى" },
    { key: "orderNo", label: "رقم الطلب", align: "center", cellClassName: "font-extrabold text-[#75262d]" },
    { key: "date", label: "التاريخ", align: "center" },
    {
      key: "status",
      label: "الحالة",
      align: "center",
      render: (row: Complaint) => (
        <Badge tone={statusTone[row.status as keyof typeof statusTone] ?? "neutral"}>{row.status}</Badge>
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      align: "center",
      render: (row: Complaint) => (
        <div className="flex items-center justify-center gap-4">
          <button type="button" title="عرض" onClick={() => onView(row)}>
            <Eye size={19} className="text-emerald-500" />
          </button>
          <button type="button" title="تعديل" onClick={() => onEdit(row)}>
            <Pencil size={17} className="text-gray-700" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="سجل الشكاوى"
      columns={columns}
      rows={rows}
      minWidth="900px"
      pagination={{ currentPage: 1, totalPages: 3, totalCount: 2482, itemLabel: "شكوى" }}
    />
  );
}
