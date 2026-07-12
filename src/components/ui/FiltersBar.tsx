import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ListFilter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

interface SearchConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

interface FilterField {
  key: string;
  type: "date" | "select";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: string[];
}

interface FiltersBarProps {
  search?: SearchConfig;
  fields?: FilterField[];
  onFilter?: () => void;
  filterLabel?: string;
  className?: string;
}

const inputBase =
  "h-12 w-full rounded-lg border border-[#e7dede] bg-white text-sm outline-none focus:border-[#75262d]";
const iconBase = "pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400";

function DateField({ value, onChange }: Pick<FilterField, "value" | "onChange">) {
  return (
    <div className="relative w-full">
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputBase} px-4 text-gray-500`}
      />
    </div>
  );
}

function SelectField({
  value,
  onChange,
  placeholder = "اختر",
  options = [],
}: Pick<FilterField, "value" | "onChange" | "placeholder" | "options">) {
  return (
    <div className="relative w-full">
      <ChevronDown size={16} className={`${iconBase} left-4`} />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputBase} appearance-none px-4 text-gray-500`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SearchField({ value, onChange, placeholder }: SearchConfig) {
  return (
    <div className="relative min-w-0 flex-1 sm:min-w-[220px]">
      <Search size={18} className={`${iconBase} right-4`} />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputBase} !border-transparent pl-4 pr-11 text-[#3d3434] shadow-none ring-0 placeholder:text-gray-400 focus:!border-transparent focus:outline-none focus:ring-0`}
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
}: FiltersBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeFiltersCount = fields.filter((field) => field.value !== "").length;

  const getFieldLabel = (field: FilterField) => {
    if (field.key === "from") return "من تاريخ";
    if (field.key === "to") return "إلى تاريخ";
    return field.placeholder ?? "اختر القيمة";
  };

  const openFilters = () => {
    setDraftValues(Object.fromEntries(fields.map((field) => [field.key, field.value])));
    setIsOpen(true);
  };

  const applyFilters = () => {
    fields.forEach((field) => field.onChange(draftValues[field.key] ?? ""));
    setIsOpen(false);
    onFilter?.();
  };

  const clearFilters = () => {
    setDraftValues(Object.fromEntries(fields.map((field) => [field.key, ""])));
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative mb-5 flex items-center gap-3 rounded-2xl border-0 bg-white p-3 shadow-[0_4px_18px_rgba(117,38,45,0.05)] sm:p-4 ${className}`}
    >
      {search && <SearchField {...search} />}

      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openFilters())}
        aria-expanded={isOpen}
        className={`relative flex h-12 shrink-0 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md ${
          isOpen
            ? "bg-[#542029] text-white shadow-md"
            : "bg-[#642326] text-white"
        }`}
      >
        <ListFilter size={16} />
        {filterLabel}
        {activeFiltersCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-extrabold text-[#642326]">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && fields.length > 0 && (
        <div className="absolute left-3 right-3 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-[#eadfdf] bg-white shadow-[0_18px_50px_rgba(80,25,30,0.16)] sm:left-4 sm:right-auto sm:w-[580px]">
          <div className="flex items-center justify-between border-b border-[#f3eaea] bg-[#fcf9f9] px-5 py-4">
            <div className="flex items-center gap-3 text-right">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e8e9] text-[#75262d]">
                <SlidersHorizontal size={19} />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-[#352b2b]">تصفية النتائج</h3>
                <p className="mt-0.5 text-xs font-medium text-gray-400">اختر ما يناسبك للوصول للنتائج بسرعة</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق"
              className="rounded-xl border border-transparent p-2 text-gray-400 transition hover:border-[#eadfdf] hover:bg-white hover:text-[#75262d]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            {fields.map((field) => {
              const onDraftChange = (value: string) =>
                setDraftValues((current) => ({ ...current, [field.key]: value }));

              return (
                <div key={field.key}>
                  <label className="mb-2 block text-right text-xs font-bold text-[#554848]">
                    {getFieldLabel(field)}
                  </label>
                  {field.type === "date" ? (
                    <DateField value={draftValues[field.key] ?? ""} onChange={onDraftChange} />
                  ) : (
                    <SelectField
                      value={draftValues[field.key] ?? ""}
                      onChange={onDraftChange}
                      placeholder={field.placeholder}
                      options={field.options}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 border-t border-[#f2e8e8] bg-[#fcfafa] px-5 py-4">
            <button
              type="button"
              onClick={applyFilters}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#642326] text-sm font-bold text-white shadow-sm transition hover:bg-[#542029] hover:shadow-md"
            >
              <Check size={16} />
              تطبيق التصفية
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e7dede] bg-white px-4 text-sm font-semibold text-[#75262d] transition hover:border-[#d8c6c6] hover:bg-[#fbf7f7]"
            >
              <RotateCcw size={15} />
              مسح
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
