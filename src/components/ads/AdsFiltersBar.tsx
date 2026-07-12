import FiltersBar from "../ui/FiltersBar";

export default function AdsFiltersBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions = [],
  onFilter,
}) {
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: "ابحث باسم الاعلان",
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
      ]}
      onFilter={onFilter}
    />
  );
}
