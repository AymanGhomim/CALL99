import { Calendar, ChevronDown, ListFilter, Search } from "lucide-react";

const inputBase =
  "h-12 w-full rounded-lg border border-[#e7dede] bg-white text-sm outline-none focus:border-[#75262d]";
const iconBase =
  "pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400";

function DateField({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-[150px]">
      <Calendar size={17} className={`${iconBase} right-4`} />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${inputBase} pl-3 pr-11 text-gray-500`}
      />
    </div>
  );
}

function SelectField({ value, onChange, placeholder, options }) {
  return (
    <div className="relative w-full sm:w-[160px]">
      <ChevronDown size={16} className={`${iconBase} left-4`} />
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${inputBase} appearance-none px-4 text-gray-500`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function SearchField({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full min-w-0 flex-1 sm:min-w-[220px]">
      <Search size={18} className={`${iconBase} right-4`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`${inputBase} pl-4 pr-11 text-[#3d3434] placeholder:text-gray-400`}
      />
    </div>
  );
}

export default function FiltersBar({
  search,
  fields = [],
  onFilter,
  filterLabel = "تصفية",
  className = "",
}) {
  return (
    <div
      className={`mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-[#f2e8e8] bg-white p-4 shadow-sm ${className}`}
    >
      {search && <SearchField {...search} />}

      {fields.map((field) =>
        field.type === "date" ? (
          <DateField
            key={field.key}
            value={field.value}
            onChange={field.onChange}
          />
        ) : (
          <SelectField
            key={field.key}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            options={field.options}
          />
        ),
      )}

      <button
        type="button"
        onClick={onFilter}
        className="flex h-12 items-center gap-2 rounded-lg bg-[#642326] px-5 text-sm font-bold text-white transition-colors hover:bg-[#542029]"
      >
        <ListFilter size={16} />
        {filterLabel}
      </button>
    </div>
  );
}
