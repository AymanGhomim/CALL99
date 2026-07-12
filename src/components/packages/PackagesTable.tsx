import { Ban, Eye, Pencil, Play, XCircle, CheckCircle2 } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { PACKAGE_STATUS_TONE } from "../../constants/statusTones";

export default function PackagesTable({
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
      label: "اسم الباقه",
      render: (row) => (
        <div className="text-right">
          <p className="font-extrabold text-[#3d3434]">{row.name}</p>
          <p className="mt-0.5 text-xs font-medium text-gray-400">معرف: {row.code}</p>
        </div>
      ),
    },
    { key: "servicesCount", label: "الخدمات", align: "center", cellClassName: "text-gray-600" },
    { key: "duration", label: "المده", align: "center", cellClassName: "text-gray-600" },
    { key: "price", label: "السعر", align: "center", cellClassName: "text-gray-600" },
    { key: "media", label: "الصور", align: "center", cellClassName: "text-gray-600" },
    {
      key: "hasBanner",
      label: "البنر الاعلاني",
      align: "center",
      render: (row) =>
        row.hasBanner ? (
          <CheckCircle2 size={20} className="mx-auto text-emerald-500" />
        ) : (
          <XCircle size={20} className="mx-auto text-red-500" />
        ),
    },
    statusColumn(PACKAGE_STATUS_TONE, { label: "الحاله" }),
    actionsColumn((row) => {
      const isActive = row.status === "نشط";
      return [
        { icon: Eye, title: "عرض", tone: "success", onClick: () => onView?.(row) },
        { icon: Pencil, title: "تعديل", tone: "neutral", onClick: () => onEdit?.(row) },
        {
          icon: isActive ? Ban : Play,
          title: isActive ? "إيقاف الباقه" : "تفعيل الباقه",
          tone: isActive ? "danger" : "success",
          onClick: () => onToggleStatus?.(row),
        },
      ];
    }),
  ];

  return (
    <DataTable
      title="قائمه الباقات"
      columns={columns}
      rows={rows}
      pagination={{ currentPage, totalPages, totalCount, itemLabel: "باقه" }}
    />
  );
}
