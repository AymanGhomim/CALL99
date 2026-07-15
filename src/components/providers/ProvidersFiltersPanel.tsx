import FiltersBar from "../ui/FiltersBar";
import { useTranslation } from "react-i18next";

interface ProvidersFiltersPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  providerType: string;
  onProviderTypeChange: (value: string) => void;
  providerTypeOptions?: string[];
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions?: string[];
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  onFilter: () => void;
}

export default function ProvidersFiltersPanel({
  search,
  onSearchChange,
  providerType,
  onProviderTypeChange,
  providerTypeOptions = [],
  status,
  onStatusChange,
  statusOptions = [],
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onFilter,
}: ProvidersFiltersPanelProps) {
  const { t } = useTranslation();
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: t("filters.searchProviderRequest"),
      }}
      fields={[
        { key: "from", type: "date", value: dateFrom, onChange: onDateFromChange },
        { key: "to", type: "date", value: dateTo, onChange: onDateToChange },
        { key: "status", type: "select", value: status, onChange: onStatusChange, placeholder: t("filters.selectStatus"), options: statusOptions },
        {
          key: "providerType",
          type: "select",
          value: providerType,
          onChange: onProviderTypeChange,
          placeholder: t("filters.serviceType"),
          options: providerTypeOptions,
        },
      ]}
      onFilter={onFilter}
    />
  );
}
