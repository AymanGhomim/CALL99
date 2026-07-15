import { Eye, Pencil } from "lucide-react";
import Badge from "../ui/Badge";
import DataTable from "../ui/DataTable";
import { useTranslation } from "react-i18next";
import { translateStatus } from "../../i18n/translateEnum";

export interface Complaint {
  id: number;
  ticketNo: string;
  customer: string;
  type: string;
  orderNo: string;
  date: string;
  status: string;
  details?: string;
  imageName?: string;
  adminNotes?: string;
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
  const { t } = useTranslation();
  const columns = [
    { key: "ticketNo", label: t("tables.ticketNumber"), cellClassName: "font-extrabold text-[#75262d]" },
    { key: "customer", label: t("tables.customer"), cellClassName: "font-bold text-[#3d3434]" },
    { key: "type", label: t("tables.complaintType") },
    { key: "orderNo", label: t("tables.orderNumber"), align: "center", cellClassName: "font-extrabold text-[#75262d]" },
    { key: "date", label: t("common.date"), align: "center" },
    {
      key: "status",
      label: t("common.status"),
      align: "center",
      render: (row: Complaint) => (
        <Badge tone={statusTone[row.status as keyof typeof statusTone] ?? "neutral"}>{translateStatus(row.status, t)}</Badge>
      ),
    },
    {
      key: "actions",
      label: t("common.actions"),
      align: "center",
      render: (row: Complaint) => (
        <div className="flex items-center justify-center gap-4">
          <button type="button" title={t("common.view")} onClick={() => onView(row)}>
            <Eye size={19} className="text-emerald-500" />
          </button>
          <button type="button" title={t("common.edit")} onClick={() => onEdit(row)}>
            <Pencil size={17} className="text-gray-700" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title={t("tables.complaintsLog")}
      columns={columns}
      rows={rows}
      minWidth="900px"
      pagination={{ currentPage: 1, totalPages: 3, totalCount: 2482, itemLabel: t("tables.itemComplaint") }}
    />
  );
}
