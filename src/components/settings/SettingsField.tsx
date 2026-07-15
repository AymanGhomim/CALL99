interface SettingsFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  hint?: string;
  min?: number;
}

export default function SettingsField({ label, value, onChange, suffix, hint, min = 0 }: SettingsFieldProps) {
  return (
    <label className="block text-right">
      <span className="text-sm font-bold text-[#3d3434]">{label}</span>
      <div className="mt-2 flex h-12 overflow-hidden rounded-xl border border-[#e7dede] bg-white focus-within:border-[#75262d]">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))}
          className="min-w-0 flex-1 px-4 text-right font-semibold outline-none"
        />
        <span className="flex w-20 items-center justify-center border-r border-[#e7dede] bg-[#faf8f8] text-sm font-medium text-gray-400">{suffix}</span>
      </div>
      {hint && <span className="mt-2 block text-xs font-medium leading-5 text-[#8a3d42]">{hint}</span>}
    </label>
  );
}
