import { Eye } from "lucide-react";
import DataTable from "../ui/DataTable";
import { linkColumn, phoneColumn, statusColumn, actionsColumn } from "../../utils/tableColumns";
import { PROVIDER_REQUEST_STATUS_TONE } from "../../constants/statusTones";

export default function ProvidersRequestsTable({ rows, totalCount, currentPage = 1, totalPages = 1, onView }) {
  const columns = [
    { key: "orderNo", label: "رقم الطلب", cellClassName: "font-extrabold text-[#75262d]" },
    linkColumn({ key: "providerName", label: "مقدم الخدمه", to: (row) => `/providers/${row.id}` }),
    { key: "serviceType", label: "نوع الخدمه" },
    phoneColumn({ label: "رقم الهاتف", className: "font-extrabold text-[#221b1b]" }),
    { key: "date", label: "تاريخ الطلب" },
    statusColumn(PROVIDER_REQUEST_STATUS_TONE, { label: "الحاله" }),
    actionsColumn((row) => [
      { icon: Eye, title: "عرض", tone: "success", onClick: () => onView?.(row) },
    ]),
  ];

  return (
    <DataTable
      title="سجل الطلبات المعلقه"
      columns={columns}
      rows={rows}
      pagination={{ currentPage, totalPages, totalCount, itemLabel: "شكوي" }}
    />
  );
}
