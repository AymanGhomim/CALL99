import FiltersBar from "../ui/FiltersBar";

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
}) {
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: "ابحث بالاسم أو رقم الهاتف",
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
          placeholder: "اختر الحالة",
          value: status,
          onChange: onStatusChange,
          options: statusOptions,
        },
        {
          key: "service",
          type: "select",
          placeholder: "نوع الخدمة",
          value: service,
          onChange: onServiceChange,
          options: serviceOptions,
        },
        {
          key: "role",
          type: "select",
          placeholder: "اختر الدور",
          value: role,
          onChange: onRoleChange,
          options: roleOptions,
        },
      ]}
      onFilter={onFilter}
    />
  );
}
