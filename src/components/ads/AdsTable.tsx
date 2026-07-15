import { Ban, Eye, Pencil, Play } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { AD_STATUS_TONE } from "../../constants/statusTones";
import type { AdRecord } from "../dialogs/AdDialog/constants";
import { useTranslation } from "react-i18next";

interface AdsTableProps {
  rows: AdRecord[];
  totalCount: number;
  currentPage?: number;
  totalPages?: number;
  onView?: (ad: AdRecord) => void;
  onEdit?: (ad: AdRecord) => void;
  onToggleStatus?: (ad: AdRecord) => void;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export default function AdsTable({
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
}: AdsTableProps) {
  const { t } = useTranslation();
  const columns = [
    {
      key: "name",
      label: t("tables.adName"),
      cellClassName: "font-extrabold text-[#3d3434]",
    },
    { key: "service", label: t("tables.service"), cellClassName: "text-gray-600" },
    { key: "startDate", label: t("tables.startDate"), cellClassName: "text-gray-600" },
    { key: "endDate", label: t("tables.endDate"), cellClassName: "text-gray-600" },
    statusColumn(AD_STATUS_TONE, { label: t("common.status") }),
    actionsColumn((row: AdRecord) => {
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
      title={t("tables.adsList")}
      columns={columns}
      rows={rows}
      loading={loading}
      emptyMessage={emptyMessage ?? t("tables.noAds")}
      pagination={{ currentPage, totalPages, totalCount, shownCount: rows.length || 10, itemLabel: t("tables.itemAd"), onPageChange }}
    />
  );
}
