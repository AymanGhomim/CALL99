import {
  Briefcase,
  Calendar,
  Check,
  Gem,
  Image,
  Settings2,
  Tag,
  Video,
} from "lucide-react";

import { DESCRIPTION_MAX_LENGTH, DURATION_UNIT_OPTIONS } from "./constants";

const inputBase =
  "h-14 w-full rounded-2xl border border-[#E5DCDC] bg-white text-sm font-semibold text-[#262626] outline-none transition-colors placeholder:text-[#8E8E8E] placeholder:font-normal focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8] disabled:text-[#3d3434]";

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-right text-sm font-semibold text-[#262626]">
      {children}
    </label>
  );
}

function IconSlot({ icon: Icon }) {
  if (!Icon || typeof Icon !== "function") {
    return null;
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f7ecee] text-[#75262d]">
      <Icon size={20} />
    </div>
  );
}

function NameField({ value, onChange, readOnly, error }) {
  return (
    <div>
      <FieldLabel>اسم الباقه</FieldLabel>
      <div className="flex items-center gap-3">
        <IconSlot icon={Gem} />
        <input
          type="text"
          value={value}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder="مثال:الباقه الماسيه"
          className={`${inputBase} px-4 text-right ${
            error ? "border-rose-300 focus:border-rose-400" : ""
          }`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-right text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}

function DescriptionField({ value, onChange, readOnly }) {
  const remaining = DESCRIPTION_MAX_LENGTH - value.length;

  return (
    <div>
      <FieldLabel>وصف الباقه</FieldLabel>
      <textarea
        rows={3}
        value={value}
        disabled={readOnly}
        maxLength={DESCRIPTION_MAX_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        placeholder="اكتب وصفا موجزا لخدماتالباقه............"
        className="w-full resize-none rounded-2xl border border-[#E5DCDC] bg-white p-4 text-sm text-[#262626] outline-none transition-colors placeholder:text-[#8E8E8E] focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8] disabled:text-[#3d3434]"
      />
      {!readOnly && (
        <p className="mt-1.5 text-right text-xs font-medium text-gray-400">
          تبقي {remaining} حرفاً
        </p>
      )}
    </div>
  );
}

function CounterField({ label, icon, value, onChange, readOnly }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <IconSlot icon={icon} />
        <input
          type="number"
          min={0}
          value={value}
          disabled={readOnly}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`${inputBase} px-4 text-center`}
        />
      </div>
    </div>
  );
}

function CountersRow({ form, onChange, readOnly }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <CounterField
        label="عدد الصور"
        icon={Image}
        value={form.imagesCount}
        onChange={(value) => onChange("imagesCount", value)}
        readOnly={readOnly}
      />
      <CounterField
        label="عدد الفيديو"
        icon={Video}
        value={form.videosCount}
        onChange={(value) => onChange("videosCount", value)}
        readOnly={readOnly}
      />
      <CounterField
        label="عدد الخدمات"
        icon={Briefcase}
        value={form.servicesCount}
        onChange={(value) => onChange("servicesCount", value)}
        readOnly={readOnly}
      />
    </div>
  );
}

function BannerField({ checked, onChange, readOnly }) {
  if (readOnly) {
    return (
      <div>
        <FieldLabel>بنر إعلاني</FieldLabel>
        <div
          className={`flex h-14 items-center gap-2 rounded-2xl px-4 text-sm font-bold ${
            checked
              ? "bg-[#642326] text-white"
              : "border border-[#E5DCDC] bg-white text-gray-400"
          }`}
        >
          <Check size={16} />
          {checked ? "مفعل" : "غير مفعل"}
        </div>
      </div>
    );
  }

  return (
    <label className="flex h-14 cursor-pointer items-center gap-3 rounded-2xl border border-[#E5DCDC] bg-white px-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 shrink-0 rounded-md border-2 border-[#E5DCDC] accent-[#642326]"
      />
      <span className="text-sm font-semibold text-[#262626]">بنر اعلاني</span>
    </label>
  );
}

function DurationPriceRow({ form, onChange, readOnly }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>مدة الباقة</FieldLabel>
        <div className="flex items-center gap-3">
          <IconSlot icon={Calendar} />
          <input
            type="number"
            min={0}
            value={form.durationValue}
            disabled={readOnly}
            onChange={(event) =>
              onChange("durationValue", Number(event.target.value))
            }
            className={`${inputBase} px-4 text-center`}
          />
          <select
            value={form.durationUnit}
            disabled={readOnly}
            onChange={(event) => onChange("durationUnit", event.target.value)}
            className="h-14 w-28 shrink-0 rounded-2xl border border-[#E5DCDC] bg-white px-2 text-center text-sm font-semibold text-[#262626] outline-none focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8] disabled:text-[#3d3434]"
          >
            {DURATION_UNIT_OPTIONS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FieldLabel>سعر الباقة</FieldLabel>
        <div className="flex items-center gap-3">
          <IconSlot icon={Tag} />
          <input
            type="number"
            min={0}
            value={form.priceValue}
            disabled={readOnly}
            onChange={(event) =>
              onChange("priceValue", Number(event.target.value))
            }
            className={`${inputBase} px-4 text-center`}
          />
          <span className="flex h-14 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#E5DCDC] bg-[#fcf8f8] text-sm font-bold text-[#75262d]">
            ر.س
          </span>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-[#642326]" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
          checked ? "left-1" : "left-6"
        }`}
      />
    </button>
  );
}

function StatusRow({ isActive, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-right">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#262626]">
          <Settings2 size={16} className="text-gray-400" />
          <span>حالة الباقة</span>
        </div>

        <p
          className={`mt-0.5 text-sm font-bold ${
            isActive ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isActive ? "نشط حالياً" : "غير نشط"}
        </p>
      </div>

      <ToggleSwitch checked={isActive} onChange={onChange} />
    </div>
  );
}

/**
 * Shared fields for the create / edit / view Package dialogs. `readOnly`
 * renders every field disabled (view mode); everything else stays a single
 * source of truth so the three dialog states can never drift visually.
 */
export default function PackageForm({
  form,
  errors = {},
  onChange,
  readOnly = false,
}) {
  return (
    <div className="flex flex-col gap-5">
      <NameField
        value={form.name}
        onChange={(value) => onChange("name", value)}
        readOnly={readOnly}
        error={errors.name}
      />

      <DescriptionField
        value={form.description}
        onChange={(value) => onChange("description", value)}
        readOnly={readOnly}
      />

      <CountersRow form={form} onChange={onChange} readOnly={readOnly} />

      <BannerField
        checked={form.hasBanner}
        onChange={(value) => onChange("hasBanner", value)}
        readOnly={readOnly}
      />

      <DurationPriceRow form={form} onChange={onChange} readOnly={readOnly} />

      {!readOnly && (
        <StatusRow
          isActive={form.isActive}
          onChange={(value) => onChange("isActive", value)}
        />
      )}
    </div>
  );
}
