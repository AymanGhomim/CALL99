import { Eye } from "lucide-react";
import DataTable from "../ui/DataTable";
import { statusColumn, actionsColumn } from "../../utils/tableColumns";
import { ORDER_STATUS_TONE } from "../../constants/statusTones";
import type { ProviderOrder } from "../../types/entities";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

interface ProviderOrdersTableProps {
  rows: ProviderOrder[];
  totalCount: number;
  currentPage?: number;
  totalPages?: number;
  onView?: (order: ProviderOrder) => void;
}

export default function ProviderOrdersTable({ rows, totalCount, currentPage = 1, totalPages = 1, onView }: ProviderOrdersTableProps) {
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
  const columns = [
    { key: "orderNo", label: t("tables.orderNumber"), cellClassName: "font-extrabold text-[#75262d]" },
    { key: "customer", label: t("tables.customer"), cellClassName: "font-semibold text-[#3d3434]" },
    { key: "service", label: t("tables.service"), cellClassName: "font-semibold text-[#3d3434]" },
    statusColumn<ProviderOrder>(ORDER_STATUS_TONE, { label: t("common.status") }),
    { key: "price", label: t("tables.price"), render: (row: ProviderOrder) => formatCurrency(row.price) }, { key: "date", label: t("common.date") },
    actionsColumn((row: ProviderOrder) => [
      { icon: Eye, title: t("common.view"), tone: "success", onClick: () => onView?.(row) },
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
