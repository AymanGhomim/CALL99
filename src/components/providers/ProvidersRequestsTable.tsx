import { Eye } from "lucide-react";
import DataTable from "../ui/DataTable";
import { linkColumn, phoneColumn, statusColumn, actionsColumn } from "../../utils/tableColumns";
import { PROVIDER_REQUEST_STATUS_TONE } from "../../constants/statusTones";
import { useTranslation } from "react-i18next";

export interface ProviderRequest {
  id: string | number; orderNo: string; providerName: string; serviceType: string;
  phone: string; date: string; status: string; rejectionReason?: string;
  documents?: ProviderDocument[];
  providerType?: string; email?: string; city?: string; address?: string;
  companyName?: string; responsibleName?: string; nationalId?: string;
  commercialRegistrationNumber?: string; vatNumber?: string; licenseNumber?: string;
}

export interface ProviderDocument {
  id: string;
  label: string;
  fileName: string;
  url: string;
  status: "تم التحقق" | "بانتظار التحقق" | "مرفوض";
  mimeType?: string;
}

interface ProvidersRequestsTableProps {
  rows: ProviderRequest[];
  totalCount: number;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  onView?: (request: ProviderRequest) => void;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const providerRequestTones = { ...PROVIDER_REQUEST_STATUS_TONE, "تم القبول": "success", "مرفوض": "danger" };

export default function ProvidersRequestsTable({
  rows,
  totalCount,
  currentPage = 1,
  totalPages = 1,
  pageSize = 20,
  onView,
  onPageChange,
  loading = false,
  emptyMessage,
}: ProvidersRequestsTableProps) {
  const { t } = useTranslation();
  const columns = [
    { key: "orderNo", label: t("tables.orderNumber"), cellClassName: "font-extrabold text-[#75262d]" },
    linkColumn({ key: "providerName", label: t("tables.provider"), to: (row: ProviderRequest) => `/providers/${row.id}` }),
    { key: "serviceType", label: t("tables.serviceType") },
    phoneColumn({ label: t("common.phone") }),
    { key: "date", label: t("tables.requestDate") },
    statusColumn(providerRequestTones, { label: t("common.status") }),
    actionsColumn((row: ProviderRequest) => [{ icon: Eye, title: t("common.view"), tone: "success", onClick: () => onView?.(row) }]),
  ];
  return <DataTable title={t("tables.pendingRequests")} columns={columns} rows={rows} loading={loading} emptyMessage={emptyMessage} pagination={{ currentPage, totalPages, totalCount, shownCount: pageSize, itemLabel: t("tables.itemOrder"), onPageChange }} />;
}
