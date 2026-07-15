import { Eye, Pencil } from "lucide-react";
import Badge from "../ui/Badge";
import DataTable from "../ui/DataTable";
import type { TicketRecord } from "../../data/tickets.data";
import { useTranslation } from "react-i18next";
import { translateStatus } from "../../i18n/translateEnum";

const statusTones = { مفتوحة: "danger", "قيد المعالجة": "warning", "بانتظار العميل": "info", مغلقة: "success" } as const;

interface TicketsTableProps {
  rows: TicketRecord[];
  onView: (ticket: TicketRecord) => void;
  onEdit: (ticket: TicketRecord) => void;
}

export default function TicketsTable({ rows, onView, onEdit }: TicketsTableProps) {
  const { t } = useTranslation();
  const columns = [
    { key: "ticketNo", label: t("tables.ticketNumber"), cellClassName: "font-extrabold text-[#75262d]" },
    { key: "orderNo", label: t("tables.orderNumber"), cellClassName: "font-extrabold text-[#75262d]" },
    { key: "service", label: t("tables.service"), cellClassName: "font-bold text-[#3d3434]" },
    { key: "customer", label: t("tables.customer"), cellClassName: "font-bold text-[#3d3434]" },
    { key: "subject", label: t("tables.subject") },
    { key: "createdAt", label: t("common.createdAt"), align: "center" },
    { key: "status", label: t("common.status"), align: "center", render: (row: TicketRecord) => <Badge tone={statusTones[row.status as keyof typeof statusTones] ?? "neutral"}>{translateStatus(row.status, t)}</Badge> },
    { key: "actions", label: t("common.actions"), align: "center", render: (row: TicketRecord) => <div className="flex items-center justify-center gap-4"><button type="button" title={t("common.view")} onClick={() => onView(row)}><Eye size={19} className="text-emerald-500" /></button><button type="button" title={t("common.edit")} onClick={() => onEdit(row)}><Pencil size={17} className="text-gray-700" /></button></div> },
  ];

  return <DataTable title={t("tables.latestTickets")} columns={columns} rows={rows} minWidth="1050px" pagination={{ currentPage: 1, totalPages: 3, totalCount: 2482, itemLabel: t("tables.itemTicket") }} />;
}
