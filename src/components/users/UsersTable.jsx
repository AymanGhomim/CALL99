import { Ban, Eye, Pencil, XCircle } from "lucide-react";
import DataTable from "../ui/DataTable";
import { linkColumn, phoneColumn, statusColumn, actionsColumn } from "../../utils/tableColumns";
import { USER_ROLE_TONE } from "../../constants/statusTones";

export default function UsersTable({
  rows,
  totalCount,
  currentPage = 1,
  totalPages = 1,
  onView,
  onEdit,
  onBlock,
  onDelete,
}) {
  const columns = [
    linkColumn({ key: "name", label: "اسم المستخدم", to: (row) => `/users/${row.id}` }),
    phoneColumn(),
    statusColumn(USER_ROLE_TONE, { key: "role", label: "الدور" }),
    { key: "ordersCount", label: "عدد الطلبات", render: (row) => `${row.ordersCount} طلب` },
    { key: "createdAt", label: "تاريخ الإنشاء" },
    statusColumn(
      { نشط: "success", "غير نشط": "danger" },
      { label: "الحالة" },
    ),
    actionsColumn((row) => [
      { icon: Eye, title: "عرض", tone: "success", onClick: () => onView?.(row) },
      { icon: Pencil, title: "تعديل", tone: "neutral", onClick: () => onEdit?.(row) },
      { icon: Ban, title: "حظر", tone: "danger", onClick: () => onBlock?.(row) },
      { icon: XCircle, title: "حذف", tone: "danger", onClick: () => onDelete?.(row) },
    ]),
  ];

  return (
    <DataTable
      title="قائمة المستخدمين"
      columns={columns}
      rows={rows}
      pagination={{ currentPage, totalPages, totalCount, itemLabel: "مستخدم" }}
    />
  );
}
