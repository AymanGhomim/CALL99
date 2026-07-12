import { Clock3, ListFilter, Search } from "lucide-react";

export default function ActivityHeader({ search, onSearchChange, onFilter }) {
  return (
    <header className="mb-6 flex flex-wrap-reverse items-center justify-between gap-4">
      <div className="text-right">
        <h1 className="flex items-center justify-end gap-2 text-3xl font-extrabold text-[#75262d]">
          <Clock3 size={22} className="text-[#75262d]" />
          النشاط الأخير في النظام
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          تابع جميع الأنشطة والإجراءات الأخيرة في النظام
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full min-w-0 sm:w-[340px]">
          <Search
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="بحث عن نشاط"
            className="h-12 w-full rounded-lg border border-[#e7dede] bg-white pl-4 pr-11 text-sm text-[#3d3434] outline-none placeholder:text-gray-400 focus:border-[#75262d]"
          />
        </div>

        <button
          type="button"
          onClick={onFilter}
          className="flex h-12 items-center gap-2 rounded-lg bg-[#642326] px-5 text-sm font-bold text-white transition-colors hover:bg-[#542029]"
        >
          <ListFilter size={16} />
          تصفية
        </button>
      </div>
    </header>
  );
}
