import FiltersBar from "../ui/FiltersBar";

export default function NotificationsFiltersBar({
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
        placeholder: "ابحث بالعنوان",
      }}
      fields={[
        {
          key: "status",
          type: "select",
          placeholder: "الكل",
          value: status,
          onChange: onStatusChange,
          options: statusOptions,
        },
      ]}
      onFilter={onFilter}
    />
  );
}
