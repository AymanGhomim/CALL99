import { Ban, Eye, RotateCcw, XCircle } from "lucide-react";
import DataTable from "../ui/DataTable";
import { linkColumn, phoneColumn, statusColumn, actionsColumn } from "../../utils/tableColumns";
import { USER_ROLE_TONE } from "../../constants/statusTones";
import type { UserRecord } from "../../types/entities";
import { useTranslation } from "react-i18next";

interface UsersTableProps {
  rows: UserRecord[];
  totalCount: number;
  currentPage?: number;
  totalPages?: number;
  onView?: (user: UserRecord) => void;
  onBlock?: (user: UserRecord) => void;
  onDelete?: (user: UserRecord) => void;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export default function UsersTable({
  rows,
  totalCount,
  currentPage = 1,
  totalPages = 1,
  onView,
  onBlock,
  onDelete,
  onPageChange,
  loading = false,
  emptyMessage,
}: UsersTableProps) {
  const { t } = useTranslation();
  const columns = [
    linkColumn({
      key: "name",
      label: t("tables.userName"),
      to: (row: UserRecord) => `/users/${row.id}`,
    }),
    phoneColumn<UserRecord>({ label: t("common.phone") }),
    statusColumn<UserRecord>(USER_ROLE_TONE, { key: "role", label: t("common.role") }),
    { key: "ordersCount", label: t("tables.ordersCount"), render: (row: UserRecord) => row.ordersCount },
    { key: "createdAt", label: t("common.createdAt") },
    statusColumn<UserRecord>(
      { نشط: "success", محظور: "danger", "غير نشط": "danger" },
      { label: t("common.status") },
    ),
    actionsColumn((row: UserRecord) => [
      { icon: Eye, title: t("common.view"), tone: "success", onClick: () => onView?.(row) },
      {
        icon: row.status === "محظور" ? RotateCcw : Ban,
        title: t(row.status === "محظور" ? "tables.unblock" : "tables.block"),
        tone: row.status === "محظور" ? "success" : "danger",
        onClick: () => onBlock?.(row),
      },
      { icon: XCircle, title: t("common.delete"), tone: "danger", onClick: () => onDelete?.(row) },
    ]),
  ];

  return (
    <DataTable
      title={t("tables.usersList")}
      columns={columns}
      rows={rows}
      loading={loading}
      emptyMessage={emptyMessage ?? t("tables.noUsers")}
      pagination={{ currentPage, totalPages, totalCount, itemLabel: t("tables.itemUser"), shownCount: rows.length || 10, onPageChange }}
    />
  );
}
