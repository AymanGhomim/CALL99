import { Ban, Eye, Pencil, Play, XCircle, CheckCircle2 } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { PACKAGE_STATUS_TONE } from "../../constants/statusTones";
import type { PackageRecord } from "../dialogs/PackageDialog/constants";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

interface PackagesTableProps {
  rows: PackageRecord[];
  totalCount: number;
  currentPage?: number;
  totalPages?: number;
  onView?: (pkg: PackageRecord) => void;
  onEdit?: (pkg: PackageRecord) => void;
  onToggleStatus?: (pkg: PackageRecord) => void;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export default function PackagesTable({
  rows,
  totalCount,
  currentPage = 1,
  totalPages = 1,
  onView,
  onEdit,
  onToggleStatus,
  onPageChange,
  loading = false,
  emptyMessage,
}: PackagesTableProps) {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  const columns = [
    {
      key: "name",
      label: t("tables.planName"),
      render: (row: PackageRecord) => (
        <div className="text-start">
          <p className="font-extrabold text-[#3d3434]">{row.name}</p>
          <p className="mt-0.5 text-xs font-medium text-gray-400">{t("tables.identifier", { code: row.code })}</p>
        </div>
      ),
    },
    { key: "servicesCount", label: t("tables.services"), align: "center", cellClassName: "text-gray-600" },
    { key: "duration", label: t("tables.duration"), align: "center", cellClassName: "text-gray-600" },
    { key: "price", label: t("tables.price"), align: "center", cellClassName: "text-gray-600", render: (row: PackageRecord) => row.priceValue > 0 ? formatCurrency(row.priceValue) : t("common.free") },
    { key: "media", label: t("tables.media"), align: "center", cellClassName: "text-gray-600" },
    {
      key: "hasBanner",
      label: t("tables.adBanner"),
      align: "center",
      render: (row: PackageRecord) =>
        row.hasBanner ? (
          <CheckCircle2 size={20} className="mx-auto text-emerald-500" />
        ) : (
          <XCircle size={20} className="mx-auto text-red-500" />
        ),
    },
    statusColumn<PackageRecord>(PACKAGE_STATUS_TONE, { label: t("common.status") }),
    actionsColumn((row: PackageRecord) => {
      const isActive = row.status === "نشط";
      return [
        { icon: Eye, title: t("common.view"), tone: "success", onClick: () => onView?.(row) },
        { icon: Pencil, title: t("common.edit"), tone: "neutral", onClick: () => onEdit?.(row) },
        {
          icon: isActive ? Ban : Play,
          title: t(isActive ? "tables.deactivate" : "tables.activate"),
          tone: isActive ? "danger" : "success",
          onClick: () => onToggleStatus?.(row),
        },
      ];
    }),
  ];

  return (
    <DataTable
      title={t("tables.plansList")}
      columns={columns}
      rows={rows}
      loading={loading}
      emptyMessage={emptyMessage ?? t("tables.noPlans")}
      pagination={{ currentPage, totalPages, totalCount, shownCount: rows.length || 10, itemLabel: t("tables.itemPlan"), onPageChange }}
    />
  );
}
