import { Eye, XCircle } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { ORDER_STATUS_TONE } from "../../constants/statusTones";

export default function OrdersTable({
  rows,
  totalCount,
  currentPage = 1,
  totalPages = 1,
  onView,
  onCancel,
}) {
  const columns = [
    { key: "orderNo", label: "رقم الطلب", cellClassName: "font-extrabold text-[#75262d]" },
    { key: "customerName", label: "العميل", cellClassName: "font-semibold text-[#3d3434]" },
    { key: "providerName", label: "مقدم الخدمة", cellClassName: "font-semibold text-[#3d3434]" },
    statusColumn(ORDER_STATUS_TONE, { label: "الحالة" }),
    { key: "price", label: "السعر", render: (row) => `${row.price} ريال` },
    { key: "date", label: "التاريخ" },
    actionsColumn((row) => [
      { icon: Eye, title: "عرض", tone: "success", onClick: () => onView?.(row) },
      { icon: XCircle, title: "إلغاء الطلب", tone: "danger", onClick: () => onCancel?.(row) },
    ]),
  ];

  return (
    <DataTable
      title="قائمة الطلبات"
      columns={columns}
      rows={rows}
      pagination={{ currentPage, totalPages, totalCount, itemLabel: "طلب" }}
    />
  );
}
