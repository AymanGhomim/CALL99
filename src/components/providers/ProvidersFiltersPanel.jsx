import FiltersBar from "../ui/FiltersBar";

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
}) {
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: "ابحث برقم الطلب أو اسم مقدم الخدمة أو رقم الجوال",
      }}
      fields={[
        { key: "from", type: "date", value: dateFrom, onChange: onDateFromChange },
        { key: "to", type: "date", value: dateTo, onChange: onDateToChange },
        { key: "status", type: "select", value: status, onChange: onStatusChange, placeholder: "اختر الحاله", options: statusOptions },
        {
          key: "providerType",
          type: "select",
          value: providerType,
          onChange: onProviderTypeChange,
          placeholder: "نوع مقدم الخدمه",
          options: providerTypeOptions,
        },
      ]}
      onFilter={onFilter}
    />
  );
}
