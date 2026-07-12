import { CalendarDays, MapPin, MessageSquareText, Smartphone, UsersRound } from "lucide-react";

const CHANNEL_META = {
  sms: { label: "SMS رسالة", icon: MessageSquareText },
  app: { label: "تطبيق الهاتف", icon: Smartphone },
};

function InfoCard({ icon: Icon, label, value, valueClassName = "text-[#262626]" }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-[#FAF7F7] p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
        {label}
        {Icon && <Icon size={14} />}
      </div>
      <p className={`text-sm font-extrabold ${valueClassName}`}>{value}</p>
    </div>
  );
}

function TextBlock({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-right text-sm font-semibold text-[#262626]">{label}</p>
      <div className="rounded-2xl bg-[#FAF7F7] p-4 text-right text-sm leading-6 text-[#3d3434]">
        {children}
      </div>
    </div>
  );
}

function AudienceTag({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF2FC] px-4 py-2 text-xs font-bold text-[#3b82f6]">
      {children}
      {Icon && <Icon size={14} />}
    </span>
  );
}

function StatCard({ value, label, valueClassName }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-[#FAF7F7] py-5 text-center">
      <p className={`text-xl font-extrabold ${valueClassName}`}>{value}</p>
      <p className="text-xs font-semibold text-gray-400">{label}</p>
    </div>
  );
}

/**
 * Read-only "تفاصيل الإشعار" layout used for VIEW mode. Distinct from
 * NotificationForm (create/edit) — the mockup for this state isn't a
 * disabled form, it's a dedicated summary + engagement-stats screen.
 */
export default function NotificationDetailsView({ notification }) {
  if (!notification) {
    return null;
  }

  const channelMeta = CHANNEL_META[notification.channel] ?? CHANNEL_META.app;
  const stats = notification.stats ?? {};
  const audienceTags = notification.audienceTags ?? [
    { label: notification.audience ?? "جميع المستخدمين", icon: UsersRound },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InfoCard icon={CalendarDays} label="تاريخ الإرسال" value={notification.time ?? "—"} />
        <InfoCard
          icon={() => <span className="h-2 w-2 rounded-full bg-emerald-500" />}
          label="حالة الإرسال"
          value={notification.deliveryStatus ?? "تم الإرسال بنجاح"}
          valueClassName="text-emerald-600"
        />
        <InfoCard icon={channelMeta.icon} label="قناة الإرسال" value={channelMeta.label} />
      </div>

      <TextBlock label="عنوان الإشعار">{notification.title}</TextBlock>

      <TextBlock label="محتوى الرسالة">{notification.description}</TextBlock>

      <div>
        <p className="mb-2 text-right text-sm font-semibold text-[#262626]">الجمهور المستهدف:</p>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {audienceTags.map((tag, index) => (
            <AudienceTag key={`${tag.label}-${index}`} icon={tag.icon ?? MapPin}>
              {tag.label}
            </AudienceTag>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-right text-sm font-semibold text-[#262626]">إحصائيات الوصول والتفاعل</p>
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={stats.clickRate ?? "—"} label="معدل النقر" valueClassName="text-[#3b82f6]" />
          <StatCard value={stats.readRate ?? "—"} label="معدل القراءة" valueClassName="text-emerald-600" />
          <StatCard
            value={stats.totalRecipients ?? notification.recipients ?? "—"}
            label="إجمالي المستلمين"
            valueClassName="text-[#262626]"
          />
        </div>
      </div>
    </div>
  );
}
