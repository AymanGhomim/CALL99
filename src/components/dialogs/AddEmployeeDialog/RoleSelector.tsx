export default function RoleSelector({ options, value, onChange }) {
  return (
    <div>
      <label className="mb-3 block text-right text-sm font-semibold text-[#262626]">
        الدور الاصلاحي
      </label>

      <div className="flex flex-wrap items-center gap-3">
        {options.map((option) => {
          const isActive = option.id === value;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={isActive}
              className={`flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-bold transition-colors duration-200 ${
                isActive
                  ? "border-[#75262d] bg-[#75262d] text-white"
                  : "border-[#E5DCDC] bg-white text-[#3d3434] hover:border-[#75262d]/40"
              }`}
            >
              {option.label}
              <Icon size={18} strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
