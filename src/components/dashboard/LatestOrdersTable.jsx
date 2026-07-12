import { Eye, Pencil, XCircle } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { DASHBOARD_ORDER_STATUS_TONE } from "../../constants/statusTones";

export default function LatestOrdersTable({ rows }) {
  const columns = [
    { key: "orderNo", label: "رقم الطلب", cellClassName: "font-extrabold text-[#75262d]" },
    { key: "client", label: "العميل", cellClassName: "font-semibold text-[#3d3434]" },
    { key: "provider", label: "مقدم الخدمة", cellClassName: "font-semibold text-[#3d3434]" },
    statusColumn(DASHBOARD_ORDER_STATUS_TONE, { label: "الحالة" }),
    { key: "price", label: "السعر" },
    { key: "date", label: "التاريخ" },
    actionsColumn(() => [
      { icon: Eye, title: "عرض", tone: "success" },
      { icon: Pencil, title: "تعديل", tone: "neutral" },
      { icon: XCircle, title: "إلغاء", tone: "danger" },
    ]),
  ];

  return (
    <DataTable
      title="آخر الطلبات المنفذة"
      columns={columns}
      rows={rows.map((row, index) => ({ ...row, id: `${row.orderNo}-${index}` }))}
      pagination={{ currentPage: 1, totalPages: 3, totalCount: 2482, itemLabel: "طلب" }}
    />
  );
}
