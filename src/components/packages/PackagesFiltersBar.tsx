import FiltersBar from "../ui/FiltersBar";

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
}) {
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: "ابحث باسم الباقه",
      }}
      fields={[
        {
          key: "status",
          type: "select",
          placeholder: "كل الحالات",
          value: status,
          onChange: onStatusChange,
          options: statusOptions,
        },
        {
          key: "service",
          type: "select",
          placeholder: "نوع الخدمه",
          value: service,
          onChange: onServiceChange,
          options: serviceOptions,
        },
      ]}
      onFilter={onFilter}
    />
  );
}
