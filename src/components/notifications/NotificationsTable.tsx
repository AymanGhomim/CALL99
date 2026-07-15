import { Ban, Eye, Pencil, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import DataTable, { type DataTableColumn } from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { NOTIFICATION_STATUS_TONE } from "../../constants/statusTones";
import type { RowAction } from "../ui/RowActions";
import type { NotificationRecord } from "../dialogs/NotificationDialog/constants";

type NotificationAction = (notification: NotificationRecord) => void;

interface NotificationsTableProps {
  rows: NotificationRecord[];
  totalCount: number;
  currentPage?: number;
  totalPages?: number;
  onView?: NotificationAction;
  onEdit?: NotificationAction;
  onToggleStatus?: NotificationAction;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function buildActions(row: NotificationRecord, props: Pick<NotificationsTableProps, "onView" | "onEdit" | "onToggleStatus">, t: TFunction): RowAction[] {
  const viewAction: RowAction = { icon: Eye, title: t("common.view"), tone: "success", onClick: () => props.onView?.(row) };
  if (["مكتمل", "مرسلة"].includes(row.status)) return [viewAction];

  if (row.status === "فشل") {
    return [viewAction, { icon: Pencil, title: t("common.edit"), tone: "neutral", onClick: () => props.onEdit?.(row) }];
  }

  if (row.status === "مجدولة") {
    return [
      viewAction,
      { icon: Pencil, title: t("common.edit"), tone: "neutral", onClick: () => props.onEdit?.(row) },
      { icon: Ban, title: t("notifications.pause"), tone: "danger", onClick: () => props.onToggleStatus?.(row) },
    ];
  }

  return [
    viewAction,
    { icon: Pencil, title: t("common.edit"), tone: "neutral", onClick: () => props.onEdit?.(row) },
    { icon: RotateCcw, title: t("notifications.reactivate"), tone: "success", onClick: () => props.onToggleStatus?.(row) },
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
  onPageChange,
  loading = false,
  emptyMessage,
}: NotificationsTableProps) {
  const { t } = useTranslation();
  const columns: DataTableColumn<NotificationRecord>[] = [
    {
      key: "title",
      label: t("notifications.title"),
      cellClassName: "max-w-[320px]",
      render: (row) => <div><p className="font-extrabold text-[#3d3434]">{row.title}</p><p className="mt-0.5 truncate text-xs font-medium text-gray-400">{row.description}</p></div>,
    },
    { key: "time", label: t("notifications.time"), cellClassName: "text-gray-600 whitespace-nowrap" },
    statusColumn<NotificationRecord>(NOTIFICATION_STATUS_TONE, { label: t("common.status") }),
    { key: "recipients", label: t("notifications.recipients"), align: "center", cellClassName: "font-bold text-[#3d3434]" },
    actionsColumn<NotificationRecord>((row) => buildActions(row, { onView, onEdit, onToggleStatus }, t)),
  ];

  return (
    <DataTable
      title={t("notifications.log")}
      columns={columns}
      rows={rows}
      loading={loading}
      emptyMessage={emptyMessage}
      pagination={{ currentPage, totalPages, totalCount, shownCount: 20, itemLabel: t("notifications.item"), onPageChange }}
    />
  );
}
