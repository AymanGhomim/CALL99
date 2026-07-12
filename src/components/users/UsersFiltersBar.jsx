import FiltersBar from "../ui/FiltersBar";

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
}) {
  return (
    <FiltersBar
      search={{ value: search, onChange: onSearchChange, placeholder: "ابحث بالاسم او رقم الهاتف" }}
      fields={[
        { key: "from", type: "date", value: dateFrom, onChange: onDateFromChange },
        { key: "to", type: "date", value: dateTo, onChange: onDateToChange },
        { key: "status", type: "select", value: status, onChange: onStatusChange, placeholder: "اختر الحاله", options: statusOptions },
        { key: "role", type: "select", value: role, onChange: onRoleChange, placeholder: "اختر الدور", options: roleOptions },
      ]}
      onFilter={onFilter}
    />
  );
}
