import FiltersBar from "../ui/FiltersBar";

export default function UserOrdersFiltersBar({
  search,
  onSearchChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  onFilter,
}) {
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: "ابحث برقم الطلب أو بالاسم أو رقم الهاتف",
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
          value: statusFilter,
          onChange: onStatusFilterChange,
          placeholder: "حالة الطلب",
          options: statusOptions,
        },
      ]}
      onFilter={onFilter}
    />
  );
}
