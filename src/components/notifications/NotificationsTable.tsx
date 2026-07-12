import { Ban, Eye, Pause, Pencil, RotateCcw } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { NOTIFICATION_STATUS_TONE } from "../../constants/statusTones";

function buildActions(row, { onView, onEdit, onToggleStatus, onResend }) {
  if (row.status === "مكتمل") {
    return [
      { icon: Eye, title: "عرض", tone: "success", onClick: () => onView?.(row) },
      { icon: Pencil, title: "تعديل", tone: "neutral", onClick: () => onEdit?.(row) },
      { icon: RotateCcw, title: "إعادة الإرسال", tone: "neutral", onClick: () => onResend?.(row) },
    ];
  }

  if (row.status === "مجدولة") {
    return [
      { icon: Eye, title: "عرض", tone: "success", onClick: () => onView?.(row) },
      { icon: Pencil, title: "تعديل", tone: "neutral", onClick: () => onEdit?.(row) },
      { icon: Ban, title: "إلغاء الجدولة", tone: "danger", onClick: () => onToggleStatus?.(row) },
    ];
  }

  const isActive = row.status === "نشط";

  return [
    { icon: Eye, title: "عرض", tone: "success", onClick: () => onView?.(row) },
    { icon: Pencil, title: "تعديل", tone: "neutral", onClick: () => onEdit?.(row) },
    {
      icon: isActive ? Pause : RotateCcw,
      title: isActive ? "إيقاف الإشعار" : "إعادة التفعيل",
      tone: isActive ? "danger" : "success",
      onClick: () => onToggleStatus?.(row),
    },
  ];
}

export default function NotificationsTable({
  rows,
  totalCount,
  currentPage = 1,
  totalPages = 1,
  onView,
  onEdit,
  onToggleStatus,
  onResend,
}) {
  const columns = [
    {
      key: "title",
      label: "العنوان",
      cellClassName: "max-w-[320px]",
      render: (row) => (
        <div>
          <p className="font-extrabold text-[#3d3434]">{row.title}</p>
          <p className="mt-0.5 truncate text-xs font-medium text-gray-400">{row.description}</p>
        </div>
      ),
    },
    { key: "time", label: "الوقت", cellClassName: "text-gray-600 whitespace-nowrap" },
    statusColumn(NOTIFICATION_STATUS_TONE, { label: "الحالة" }),
    {
      key: "recipients",
      label: "إجمالي المستلمين",
      align: "center",
      cellClassName: "font-bold text-[#3d3434]",
    },
    actionsColumn((row) => buildActions(row, { onView, onEdit, onToggleStatus, onResend })),
  ];

  return (
    <DataTable
      title="سجل الإشعارات"
      columns={columns}
      rows={rows}
      pagination={{ currentPage, totalPages, totalCount, itemLabel: "إشعار" }}
    />
  );
}
