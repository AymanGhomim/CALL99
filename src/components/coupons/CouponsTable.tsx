import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import DataTable from "../ui/DataTable";

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: string;
  discountValue: string;
  services: string;
  maxDiscount: string;
  minOrder: string;
  usageLimit: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface CouponsTableProps {
  rows: Coupon[];
  onView: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

export default function CouponsTable({ rows, onView, onEdit, onDelete }: CouponsTableProps) {
  const columns = [
    { key: "code", label: "الكوبون", cellClassName: "font-extrabold text-[#3d3434]" },
    { key: "description", label: "الوصف" },
    { key: "discountType", label: "نوع الخصم", align: "center" },
    { key: "discountValue", label: "قيمة الخصم", align: "center" },
    { key: "services", label: "الخدمات", align: "center" },
    { key: "maxDiscount", label: "الحد الأقصى", align: "center" },
    { key: "minOrder", label: "الحد الأدنى", align: "center" },
    { key: "usageLimit", label: "حد الاستخدام", align: "center" },
    { key: "startDate", label: "تاريخ البداية", align: "center" },
    { key: "endDate", label: "تاريخ النهاية", align: "center" },
    {
      key: "status",
      label: "الحالة",
      align: "center",
      render: (row: Coupon) => (
        <Badge tone={row.status === "نشط" ? "success" : "danger"}>{row.status}</Badge>
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      align: "center",
      render: (row: Coupon) => (
        <div className="flex items-center justify-center gap-3">
          <button type="button" title="عرض" onClick={() => onView(row)}>
            <Eye size={18} className="text-emerald-500" />
          </button>
          <button type="button" title="تعديل" onClick={() => onEdit(row)}>
            <Pencil size={17} className="text-gray-700" />
          </button>
          <button type="button" title="حذف" onClick={() => onDelete(row)}>
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="قائمة الكوبونات"
      columns={columns}
      rows={rows}
      minWidth="1320px"
      pagination={{ currentPage: 1, totalPages: 3, totalCount: 20, itemLabel: "كوبون" }}
    />
  );
}
