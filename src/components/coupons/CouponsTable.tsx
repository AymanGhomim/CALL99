import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import DataTable from "../ui/DataTable";
import { useTranslation } from "react-i18next";
import { translateStatus } from "../../i18n/translateEnum";

export interface Coupon {
  id: string | number;
  code: string;
  description: string;
  discountType: string;
  discountValue: string;
  services: string;
  maxDiscount: string;
  minOrder: string;
  usageLimit: number;
  maxTotalUsage: number;
  totalUsage: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface CouponsTableProps {
  rows: Coupon[];
  onView: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export default function CouponsTable({ rows, onView, onEdit, onDelete, currentPage = 1, totalPages = 1, totalCount = 0, onPageChange, loading = false, emptyMessage }: CouponsTableProps) {
  const { t } = useTranslation();
  const columns = [
    { key: "code", label: t("tables.coupon"), cellClassName: "font-extrabold text-[#3d3434]" },
    { key: "description", label: t("tables.description") },
    { key: "discountType", label: t("tables.discountType"), align: "center" },
    { key: "discountValue", label: t("tables.discountValue"), align: "center" },
    { key: "services", label: t("tables.services"), align: "center" },
    { key: "maxDiscount", label: t("tables.maxDiscount"), align: "center" },
    { key: "minOrder", label: t("tables.minOrder"), align: "center" },
    { key: "usageLimit", label: t("tables.usageLimit"), align: "center" },
    { key: "startDate", label: t("tables.startDate"), align: "center" },
    { key: "endDate", label: t("tables.endDate"), align: "center" },
    {
      key: "status",
      label: t("common.status"),
      align: "center",
      render: (row: Coupon) => (
        <Badge tone={row.status === "نشط" ? "success" : "danger"}>{translateStatus(row.status, t)}</Badge>
      ),
    },
    {
      key: "actions",
      label: t("common.actions"),
      align: "center",
      render: (row: Coupon) => (
        <div className="flex items-center justify-center gap-3">
          <button type="button" title={t("common.view")} onClick={() => onView(row)}>
            <Eye size={18} className="text-emerald-500" />
          </button>
          <button type="button" title={t("common.edit")} onClick={() => onEdit(row)}>
            <Pencil size={17} className="text-gray-700" />
          </button>
          <button type="button" title={t("common.delete")} onClick={() => onDelete(row)}>
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title={t("tables.couponsList")}
      columns={columns}
      rows={rows}
      loading={loading}
      emptyMessage={emptyMessage ?? t("tables.noCoupons")}
      minWidth="1320px"
      pagination={{ currentPage, totalPages, totalCount, shownCount: rows.length || 10, itemLabel: t("tables.itemCoupon"), onPageChange }}
    />
  );
}
