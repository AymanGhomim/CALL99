import { Eye } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { ORDER_STATUS_TONE } from "../../constants/statusTones";

export default function UserOrdersTable({ rows, totalCount, currentPage = 1, totalPages = 1, onView }) {
  const columns = [
    { key: "orderNo", label: "رقم الطلب", cellClassName: "font-extrabold text-[#75262d]" },
    { key: "service", label: "الخدمه", cellClassName: "font-semibold text-[#3d3434]" },
    { key: "provider", label: "مقدم الخدمه", cellClassName: "font-semibold text-[#3d3434]" },
    statusColumn(ORDER_STATUS_TONE, { label: "الحاله" }),
    { key: "price", label: "السعر" },
    { key: "date", label: "التاريخ" },
    actionsColumn((row) => [
      { icon: Eye, title: "عرض", tone: "success", onClick: () => onView?.(row) },
    ]),
  ];

  return (
    <DataTable
      title="قائمه الطلبات"
      columns={columns}
      rows={rows}
      pagination={{ currentPage, totalPages, totalCount, itemLabel: "طلب" }}
    />
  );
}
