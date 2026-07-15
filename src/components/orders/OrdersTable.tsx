import { Eye, XCircle } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { ORDER_STATUS_TONE } from "../../constants/statusTones";
import type { OrderRecord } from "../../types/entities";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

interface OrdersTableProps {
  rows: OrderRecord[];
  totalCount: number;
  currentPage?: number;
  totalPages?: number;
  onView?: (order: OrderRecord) => void;
  onCancel?: (order: OrderRecord) => void;
}

export default function OrdersTable({
  rows,
  totalCount,
  currentPage = 1,
  totalPages = 1,
  onView,
  onCancel,
}: OrdersTableProps) {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useLocale();
  const columns = [
    { key: "orderNo", label: t("orders.orderNumber"), cellClassName: "font-extrabold text-[#75262d]" },
    { key: "customerName", label: t("orders.customer"), cellClassName: "font-semibold text-[#3d3434]" },
    { key: "providerName", label: t("orders.provider"), cellClassName: "font-semibold text-[#3d3434]" },
    statusColumn<OrderRecord>(ORDER_STATUS_TONE, { label: t("common.status") }),
    { key: "price", label: t("orders.price"), render: (row: OrderRecord) => formatCurrency(Number(row.price)) },
    { key: "date", label: t("orders.date"), render: (row: OrderRecord) => formatDate(row.date) },
    actionsColumn((row: OrderRecord) => [
      { icon: Eye, title: t("common.view"), tone: "success", onClick: () => onView?.(row) },
      { icon: XCircle, title: t("orders.cancel"), tone: "danger", onClick: () => onCancel?.(row) },
    ]),
  ];

  return (
    <DataTable
      title={t("orders.list")}
      columns={columns}
      rows={rows}
      pagination={{ currentPage, totalPages, totalCount, itemLabel: t("orders.item") }}
    />
  );
}
