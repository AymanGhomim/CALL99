import { Calendar, ChevronDown, Clock, RotateCw, Settings2 } from "lucide-react";
import {
  CATEGORY_OPTIONS,
  CHANNEL_CHAR_LIMITS,
  CHANNEL_OPTIONS,
  RECURRENCE_END_MODES,
  RECURRENCE_OPTIONS,
  RECURRENCE_UNIT_OPTIONS,
  SEND_TIME_MODES,
} from "./constants";

const inputBase =
  "h-14 w-full rounded-2xl border border-[#E5DCDC] bg-white text-sm font-semibold text-[#262626] outline-none transition-colors placeholder:text-[#8E8E8E] placeholder:font-normal focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8] disabled:text-[#3d3434]";

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-right text-sm font-semibold text-[#262626]">
      {children}
    </label>
  );
}

/**
 * وسيلة الإرسال — a two-segment control (not separate pill buttons): the
 * whole thing sits in one rounded gray track and the active segment renders
 * as a raised white card, matching the mockup's SMS/App toggle exactly.
 */
function ChannelToggle({ value, onChange, readOnly }) {
  return (
    <div>
      <FieldLabel>وسيلة الإرسال</FieldLabel>
      <div className="flex items-center gap-1 rounded-2xl bg-[#F3EEEE] p-1">
        {CHANNEL_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={readOnly}
              onClick={() => onChange(option.value)}
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed ${
                active
                  ? "bg-white text-[#75262d] shadow-sm"
                  : "bg-transparent text-[#8E8E8E] hover:text-[#3d3434]"
              }`}
            >
              {option.label}
              <Icon size={16} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TitleField({ value, onChange, readOnly, error }) {
  return (
    <div>
      <FieldLabel>عنوان الإشعار</FieldLabel>
      <input
        type="text"
        value={value}
        disabled={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder="أدخل عنواناً جذاباً..."
        className={`${inputBase} px-4 text-right ${
          error ? "border-rose-300 focus:border-rose-400" : ""
        }`}
      />
      {error && <p className="mt-1.5 text-right text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}

function MessageField({ value, onChange, readOnly, channel }) {
  const limit = CHANNEL_CHAR_LIMITS[channel] ?? CHANNEL_CHAR_LIMITS.app;
  const used = value.length;
  const remaining = Math.max(limit - used, 0);
  const isSms = channel === "sms";

  return (
    <div>
      <FieldLabel>نص الرسالة</FieldLabel>
      <textarea
        rows={3}
        value={value}
        disabled={readOnly}
        maxLength={limit}
        onChange={(event) => onChange(event.target.value)}
        placeholder="اكتب محتوى الرسالة هنا بالتفصيل..."
        className="w-full resize-none rounded-2xl border border-[#E5DCDC] bg-white p-4 text-sm text-[#262626] outline-none transition-colors placeholder:text-[#8E8E8E] focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8] disabled:text-[#3d3434]"
      />
      <p className="mt-1.5 text-right text-xs font-medium text-gray-400">
        {isSms ? `تبقي ${remaining} حرفاً` : `تم استخدام ${used} / ${limit} حرف`}
      </p>
    </div>
  );
}

function CategoryField({ value, onChange, readOnly }) {
  return (
    <div>
      <FieldLabel>الفئة المستهدفة</FieldLabel>
      <div className="flex flex-wrap items-center gap-3">
        {CATEGORY_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={readOnly}
              onClick={() => onChange(option.value)}
              className={`flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-colors duration-200 disabled:cursor-not-allowed ${
                active
                  ? "bg-[#642326] text-white"
                  : "border border-[#E5DCDC] bg-white text-[#3d3434] hover:bg-[#f7ecee]"
              }`}
            >
              {option.label}
              <Icon size={16} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RadioDot({ checked }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        checked ? "border-[#642326]" : "border-[#D8CFCF]"
      }`}
    >
      {checked && <span className="h-2.5 w-2.5 rounded-full bg-[#642326]" />}
    </span>
  );
}

function SendTimeModeRow({ value, onChange, readOnly }) {
  return (
    <div className="flex items-center justify-end gap-8">
      <label className="flex cursor-pointer items-center gap-2">
        <span className="text-sm font-semibold text-[#262626]">إرسال الآن</span>
        <input
          type="radio"
          className="sr-only"
          disabled={readOnly}
          checked={value === SEND_TIME_MODES.NOW}
          onChange={() => onChange(SEND_TIME_MODES.NOW)}
        />
        <RadioDot checked={value === SEND_TIME_MODES.NOW} />
      </label>

      <label className="flex cursor-pointer items-center gap-2">
        <span className="text-sm font-semibold text-[#262626]">إرسال مجدول</span>
        <input
          type="radio"
          className="sr-only"
          disabled={readOnly}
          checked={value === SEND_TIME_MODES.SCHEDULED}
          onChange={() => onChange(SEND_TIME_MODES.SCHEDULED)}
        />
        <RadioDot checked={value === SEND_TIME_MODES.SCHEDULED} />
      </label>
    </div>
  );
}

function ScheduleDateTimeRow({ form, onChange, readOnly, errors }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>تاريخ الإرسال</FieldLabel>
        <div className="relative">
          <input
            type="date"
            value={form.sendDate}
            disabled={readOnly}
            onChange={(event) => onChange("sendDate", event.target.value)}
            className={`${inputBase} px-4 text-right ${
              errors.sendDate ? "border-rose-300 focus:border-rose-400" : ""
            }`}
          />
          <Calendar
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        {errors.sendDate && (
          <p className="mt-1.5 text-right text-xs font-medium text-rose-500">{errors.sendDate}</p>
        )}
      </div>

      <div>
        <FieldLabel>وقت الإرسال</FieldLabel>
        <div className="relative">
          <input
            type="time"
            value={form.sendTime}
            disabled={readOnly}
            onChange={(event) => onChange("sendTime", event.target.value)}
            className={`${inputBase} px-4 text-right ${
              errors.sendTime ? "border-rose-300 focus:border-rose-400" : ""
            }`}
          />
          <Clock
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        {errors.sendTime && (
          <p className="mt-1.5 text-right text-xs font-medium text-rose-500">{errors.sendTime}</p>
        )}
      </div>
    </div>
  );
}

function RecurrenceField({ value, onChange, readOnly }) {
  return (
    <div>
      <FieldLabel>تكرار الإشعار</FieldLabel>
      <div className="relative w-full">
        <select
          value={value}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputBase} appearance-none pl-12 pr-10 text-right`}
        >
          {RECURRENCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <RotateCw
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <ChevronDown
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}

function RecurrenceIntervalRow({ form, onChange, readOnly }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <span className="text-sm font-semibold text-[#262626]">يتكرر كل</span>
      <input
        type="number"
        min={1}
        value={form.recurrenceInterval}
        disabled={readOnly}
        onChange={(event) => onChange("recurrenceInterval", Number(event.target.value) || 1)}
        className="h-11 w-20 rounded-xl border border-[#E5DCDC] bg-white text-center text-sm font-semibold text-[#262626] outline-none focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8]"
      />
      <div className="relative">
        <select
          value={form.recurrenceUnit}
          disabled={readOnly}
          onChange={(event) => onChange("recurrenceUnit", event.target.value)}
          className="h-11 appearance-none rounded-xl border border-[#E5DCDC] bg-white py-0 pl-9 pr-4 text-sm font-semibold text-[#262626] outline-none focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8]"
        >
          {RECURRENCE_UNIT_OPTIONS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}

function RecurrenceEndRow({ form, onChange, readOnly }) {
  const setEndMode = (mode) => onChange("recurrenceEndMode", mode);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-right text-xs font-semibold text-gray-400">وقت إنهاء التكرار (اختياري)</p>

      <label className="flex cursor-pointer items-center justify-end gap-2">
        <span className="text-sm font-semibold text-[#262626]">لا ينتهي</span>
        <input
          type="radio"
          className="sr-only"
          disabled={readOnly}
          checked={form.recurrenceEndMode === RECURRENCE_END_MODES.NEVER}
          onChange={() => setEndMode(RECURRENCE_END_MODES.NEVER)}
        />
        <RadioDot checked={form.recurrenceEndMode === RECURRENCE_END_MODES.NEVER} />
      </label>

      <label className="flex cursor-pointer items-center justify-end gap-3">
        {form.recurrenceEndMode === RECURRENCE_END_MODES.AFTER && (
          <>
            <span className="text-xs font-medium text-gray-400">مرات</span>
            <input
              type="number"
              min={1}
              value={form.recurrenceEndCount}
              disabled={readOnly}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => onChange("recurrenceEndCount", event.target.value)}
              className="h-10 w-20 rounded-xl border border-[#E5DCDC] bg-white text-center text-sm font-semibold text-[#262626] outline-none focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8]"
            />
          </>
        )}
        <span className="text-sm font-semibold text-[#262626]">ينتهي بعد</span>
        <input
          type="radio"
          className="sr-only"
          disabled={readOnly}
          checked={form.recurrenceEndMode === RECURRENCE_END_MODES.AFTER}
          onChange={() => setEndMode(RECURRENCE_END_MODES.AFTER)}
        />
        <RadioDot checked={form.recurrenceEndMode === RECURRENCE_END_MODES.AFTER} />
      </label>

      <label className="flex cursor-pointer items-center justify-end gap-3">
        {form.recurrenceEndMode === RECURRENCE_END_MODES.ON_DATE && (
          <div className="relative">
            <input
              type="date"
              value={form.recurrenceEndDate}
              disabled={readOnly}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => onChange("recurrenceEndDate", event.target.value)}
              className="h-10 w-44 rounded-xl border border-[#E5DCDC] bg-white px-3 text-sm font-semibold text-[#262626] outline-none focus:border-[#75262d] disabled:cursor-not-allowed disabled:bg-[#fcf8f8]"
            />
          </div>
        )}
        <span className="text-sm font-semibold text-[#262626]">ينتهي في تاريخ</span>
        <input
          type="radio"
          className="sr-only"
          disabled={readOnly}
          checked={form.recurrenceEndMode === RECURRENCE_END_MODES.ON_DATE}
          onChange={() => setEndMode(RECURRENCE_END_MODES.ON_DATE)}
        />
        <RadioDot checked={form.recurrenceEndMode === RECURRENCE_END_MODES.ON_DATE} />
      </label>
    </div>
  );
}

function RecurrenceOptionsPanel({ form, onChange, readOnly }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#FAF7F7] p-4">
      <p className="text-right text-sm font-bold text-[#262626]">خيارات التكرار</p>
      <RecurrenceIntervalRow form={form} onChange={onChange} readOnly={readOnly} />
      <RecurrenceEndRow form={form} onChange={onChange} readOnly={readOnly} />
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
        <p className={`mt-0.5 text-sm font-bold ${isActive ? "text-emerald-600" : "text-red-500"}`}>
          {isActive ? "نشط حالياً" : "غير نشط"}
        </p>
      </div>
    </div>
  );
}

/**
 * Shared fields for the create / edit Notification dialogs. View mode uses
 * NotificationDetailsView instead — this form is only rendered for
 * create/edit, so `readOnly` only ever needs to matter if the dialog is
 * later reused for a locked/scheduled-in-flight notification.
 */
export default function NotificationForm({ form, errors = {}, onChange, readOnly = false }) {
  const isScheduled = form.sendTimeMode === SEND_TIME_MODES.SCHEDULED;
  const hasRecurrence = isScheduled && form.recurrence !== "none";

  return (
    <div className="flex flex-col gap-5">
      <ChannelToggle value={form.channel} onChange={(value) => onChange("channel", value)} readOnly={readOnly} />

      <TitleField
        value={form.title}
        onChange={(value) => onChange("title", value)}
        readOnly={readOnly}
        error={errors.title}
      />

      <MessageField
        value={form.description}
        onChange={(value) => onChange("description", value)}
        readOnly={readOnly}
        channel={form.channel}
      />

      <CategoryField
        value={form.audience}
        onChange={(value) => onChange("audience", value)}
        readOnly={readOnly}
      />

      <div className="flex flex-col gap-4">
        <FieldLabel>وقت الإرسال</FieldLabel>
        <SendTimeModeRow
          value={form.sendTimeMode}
          onChange={(value) => onChange("sendTimeMode", value)}
          readOnly={readOnly}
        />

        {isScheduled && (
          <>
            <ScheduleDateTimeRow form={form} onChange={onChange} readOnly={readOnly} errors={errors} />
            <RecurrenceField
              value={form.recurrence}
              onChange={(value) => onChange("recurrence", value)}
              readOnly={readOnly}
            />
            {hasRecurrence && (
              <RecurrenceOptionsPanel form={form} onChange={onChange} readOnly={readOnly} />
            )}
          </>
        )}
      </div>

      {!readOnly && <StatusRow isActive={form.isActive} onChange={(value) => onChange("isActive", value)} />}
    </div>
  );
}
