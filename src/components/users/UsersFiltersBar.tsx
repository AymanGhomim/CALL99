import FiltersBar from "../ui/FiltersBar";
import { useTranslation } from "react-i18next";

interface UsersFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  roleOptions?: string[];
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions?: string[];
  onFilter: () => void;
}

export default function UsersFiltersBar({
  search,
  onSearchChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  role,
  onRoleChange,
  roleOptions = [],
  status,
  onStatusChange,
  statusOptions = [],
  onFilter,
}: UsersFiltersBarProps) {
  const { t } = useTranslation();
  return (
    <FiltersBar
      search={{ value: search, onChange: onSearchChange, placeholder: t("filters.searchNamePhone") }}
      fields={[
        { key: "from", type: "date", value: dateFrom, onChange: onDateFromChange },
        { key: "to", type: "date", value: dateTo, onChange: onDateToChange },
        { key: "status", type: "select", value: status, onChange: onStatusChange, placeholder: t("filters.selectStatus"), options: statusOptions },
        { key: "role", type: "select", value: role, onChange: onRoleChange, placeholder: t("filters.selectRole"), options: roleOptions },
      ]}
      onFilter={onFilter}
    />
  );
}
