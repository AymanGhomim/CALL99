import type { ActivityCategory } from "../../types/dashboard";

interface ActivityCategoryTabsProps {
  categories: ActivityCategory[];
  value: string;
  onChange: (value: string) => void;
}

export default function ActivityCategoryTabs({ categories, value, onChange }: ActivityCategoryTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      {categories.map((category) => {
        const isActive = value === category.value;
        const Icon = category.icon;

        return (
          <button
            key={category.value || "all"}
            type="button"
            onClick={() => onChange(category.value)}
            className={`flex h-12 items-center gap-2 rounded-xl border px-5 text-sm font-bold transition-colors ${
              isActive
                ? "border-[#642326] bg-[#642326] text-white"
                : "border-[#e7dede] bg-white text-[#3d3434] hover:bg-[#f7ecee]"
            }`}
          >
            {Icon && <Icon size={16} />}
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
