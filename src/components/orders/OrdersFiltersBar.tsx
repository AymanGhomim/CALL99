import FiltersBar from "../ui/FiltersBar";
import { useTranslation } from "react-i18next";

interface OrdersFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions?: string[];
  service: string;
  onServiceChange: (value: string) => void;
  serviceOptions?: string[];
  role: string;
  onRoleChange: (value: string) => void;
  roleOptions?: string[];
  onFilter: () => void;
}

export default function OrdersFiltersBar({
  search,
  onSearchChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  status,
  onStatusChange,
  statusOptions = [],
  service,
  onServiceChange,
  serviceOptions = [],
  role,
  onRoleChange,
  roleOptions = [],
  onFilter,
}: OrdersFiltersBarProps) {
  const { t } = useTranslation();
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: t("filters.searchNamePhone"),
      }}
      fields={[
        {
          key: "from",
          type: "date",
          value: dateFrom,
          onChange: onDateFromChange,
        },
        {
          key: "to",
          type: "date",
          value: dateTo,
          onChange: onDateToChange,
        },
        {
          key: "status",
          type: "select",
          placeholder: t("filters.selectStatus"),
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
        {
          key: "role",
          type: "select",
          placeholder: t("filters.selectRole"),
          value: role,
          onChange: onRoleChange,
          options: roleOptions,
        },
      ]}
      onFilter={onFilter}
    />
  );
}
