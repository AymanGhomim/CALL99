import FiltersBar from "../ui/FiltersBar";
import { useTranslation } from "react-i18next";

interface AdsFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions?: string[];
  onFilter: () => void;
}

export default function AdsFiltersBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions = [],
  onFilter,
}: AdsFiltersBarProps) {
  const { t } = useTranslation();
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: t("filters.searchAd"),
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
      ]}
      onFilter={onFilter}
    />
  );
}
