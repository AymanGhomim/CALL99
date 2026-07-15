import FiltersBar from "../ui/FiltersBar";
import { useTranslation } from "react-i18next";

interface PackagesFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions?: string[];
  service: string;
  onServiceChange: (value: string) => void;
  serviceOptions?: string[];
  onFilter: () => void;
}

export default function PackagesFiltersBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions = [],
  service,
  onServiceChange,
  serviceOptions = [],
  onFilter,
}: PackagesFiltersBarProps) {
  const { t } = useTranslation();
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: t("filters.searchPlan"),
      }}
      fields={[
        {
          key: "status",
          type: "select",
          placeholder: t("filters.allStatuses"),
          value: status,
          onChange: onStatusChange,
          options: statusOptions,
        },
        {
          key: "service",
          type: "select",
          placeholder: t("filters.serviceType"),
          value: service,
          onChange: onServiceChange,
          options: serviceOptions,
        },
      ]}
      onFilter={onFilter}
    />
  );
}
