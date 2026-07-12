import { Ban, Eye, Pencil, Play } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { AD_STATUS_TONE } from "../../constants/statusTones";

export default function AdsTable({
  rows,
  totalCount,
  currentPage = 1,
  totalPages = 1,
  onView,
  onEdit,
  onToggleStatus,
}) {
  const columns = [
    {
      key: "name",
      label: "اسم الاعلان",
      cellClassName: "font-extrabold text-[#3d3434]",
    },
    { key: "service", label: "الخدمه", cellClassName: "text-gray-600" },
    { key: "startDate", label: "تاريخ البدء", cellClassName: "text-gray-600" },
    { key: "endDate", label: "تاريخ الانتهاء", cellClassName: "text-gray-600" },
    statusColumn(AD_STATUS_TONE, { label: "الحاله" }),
    actionsColumn((row) => {
      const isActive = row.status === "نشط";
      return [
        { icon: Eye, title: "عرض", tone: "success", onClick: () => onView?.(row) },
        { icon: Pencil, title: "تعديل", tone: "neutral", onClick: () => onEdit?.(row) },
        {
          icon: isActive ? Ban : Play,
          title: isActive ? "إيقاف الاعلان" : "تفعيل الاعلان",
          tone: isActive ? "danger" : "success",
          onClick: () => onToggleStatus?.(row),
        },
      ];
    }),
  ];

  return (
    <DataTable
      title="سجل الاعلانات"
      columns={columns}
      rows={rows}
      pagination={{ currentPage, totalPages, totalCount, itemLabel: "اعلان" }}
    />
  );
}
