import { Bell, CalendarClock, ChevronDown, Settings2, UsersRound } from "lucide-react";

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

function TitleField({ value, onChange, readOnly, error }) {
  return (
    <div>
      <FieldLabel>عنوان الإشعار</FieldLabel>
      <div className="flex items-center gap-3">
        <IconSlot icon={Bell} />
        <input
          type="text"
          value={value}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder="مثال: عرض نهاية الأسبوع الخاص"
          className={`${inputBase} px-4 text-right ${
            error ? "border-rose-300 focus:border-rose-400" : ""
          }`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-right text-xs font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
}

function AudienceField({ value, onChange, readOnly, options, error }) {
  return (
    <div>
      <FieldLabel>المستلمون</FieldLabel>
      <div className="flex items-center gap-3">
        <IconSlot icon={UsersRound} />
        <div className="relative w-full">
          <select
            value={value}
            disabled={readOnly}
            onChange={(event) => onChange(event.target.value)}
            className={`${inputBase} appearance-none pl-12 pr-4 text-right ${
              error ? "border-rose-300 focus:border-rose-400" : ""
            }`}
          >
            <option value="" disabled>
              اختر فئة المستلمين
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-right text-xs font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
}

function DescriptionField({ value, onChange, readOnly }) {
  return (
    <div>
      <FieldLabel>نص الرسالة</FieldLabel>
      <textarea
        rows={3}
        value={value}
        disabled={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder="اكتب محتوى الإشعار الذي سيصل إلى المستخدمين............"
        className="w-full resize-none rounded-2xl border border-[#E5DCDC] bg-white p-4 text-sm text-[#262626] outline-none transition-colors placeholder:text-[#8E8E8E] focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8] disabled:text-[#3d3434]"
      />
    </div>
  );
}

function TimeField({ value, onChange, readOnly, error }) {
  return (
    <div>
      <FieldLabel>موعد الإرسال</FieldLabel>
      <div className="flex items-center gap-3">
        <IconSlot icon={CalendarClock} />
        <input
          type="text"
          value={value}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder="مثال: غداً، 10:00 صباحاً — أو اتركه فارغاً للإرسال الفوري"
          className={`${inputBase} px-4 text-right ${
            error ? "border-rose-300 focus:border-rose-400" : ""
          }`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-right text-xs font-medium text-rose-500">{error}</p>
      )}
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
          checked ? "right-1" : "right-6"
        }`}
      />
    </button>
  );
}

function StatusRow({ isActive, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <ToggleSwitch checked={isActive} onChange={onChange} />

      <div className="text-right">
        <div className="flex items-center justify-end gap-1.5 text-sm font-semibold text-[#262626]">
          حالة الإشعار
          <Settings2 size={16} className="text-gray-400" />
        </div>
        <p
          className={`mt-0.5 text-sm font-bold ${isActive ? "text-emerald-600" : "text-red-500"}`}
        >
          {isActive ? "نشط حالياً" : "غير نشط"}
        </p>
      </div>
    </div>
  );
}

/**
 * Shared fields for the create / edit / view Notification dialogs. `readOnly`
 * renders every field disabled (view mode); everything else stays a single
 * source of truth so the three dialog states can never drift visually.
 */
export default function NotificationForm({
  form,
  errors = {},
  onChange,
  readOnly = false,
  audienceOptions = [],
}) {
  return (
    <div className="flex flex-col gap-5">
      <TitleField
        value={form.title}
        onChange={(value) => onChange("title", value)}
        readOnly={readOnly}
        error={errors.title}
      />

      <AudienceField
        value={form.audience}
        onChange={(value) => onChange("audience", value)}
        readOnly={readOnly}
        options={audienceOptions}
        error={errors.audience}
      />

      <DescriptionField
        value={form.description}
        onChange={(value) => onChange("description", value)}
        readOnly={readOnly}
      />

      <TimeField
        value={form.time}
        onChange={(value) => onChange("time", value)}
        readOnly={readOnly}
        error={errors.time}
      />

      {!readOnly && (
        <StatusRow
          isActive={form.isActive}
          onChange={(value) => onChange("isActive", value)}
        />
      )}
    </div>
  );
}
