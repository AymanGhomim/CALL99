import { Eye, Pencil, XCircle } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { DASHBOARD_ORDER_STATUS_TONE } from "../../constants/statusTones";
import type { DashboardOrder } from "../../types/dashboard";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

export default function LatestOrdersTable({ rows }: { rows: DashboardOrder[] }) {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useLocale();
  const columns = [
    { key: "orderNo", label: t("dashboard.orderNumber"), cellClassName: "font-extrabold text-[#75262d]" },
    { key: "client", label: t("dashboard.customer"), cellClassName: "font-semibold text-[#3d3434]" },
    { key: "provider", label: t("dashboard.provider"), cellClassName: "font-semibold text-[#3d3434]" },
    statusColumn(DASHBOARD_ORDER_STATUS_TONE, { label: t("common.status") }),
    { key: "price", label: t("tables.price") },
    { key: "date", label: t("common.date") },
    actionsColumn(() => [
      { icon: Eye, title: t("common.view"), tone: "success" },
      { icon: Pencil, title: t("common.edit"), tone: "neutral" },
      { icon: XCircle, title: t("common.cancel"), tone: "danger" },
    ]),
  ];

  return (
    <DataTable
      title={t("dashboard.latestOrders")}
      columns={columns}
      rows={rows.map((row, index) => ({ ...row, price: formatCurrency(Number.parseFloat(row.price.replace(/[^\d.]/g, ""))), date: formatDate("2026-05-23", { dateStyle: "medium" }), id: `${row.orderNo}-${index}` }))}
      pagination={{ currentPage: 1, totalPages: 3, totalCount: 2482 }}
    />
  );
}
