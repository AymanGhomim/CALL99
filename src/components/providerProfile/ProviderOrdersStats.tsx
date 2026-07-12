import { CalendarClock, CheckCircle2, ClipboardList, RefreshCcw, XCircle } from "lucide-react";
import CenterStatCard from "../ui/CenterStatCard";

export default function ProviderOrdersStats({
  cancelledOrders,
  completedOrders,
  totalOrders,
  scheduledOrders,
  activeOrders,
}) {
  return (
    <div className="mb-6 space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <CenterStatCard
          title="إجمالي الطلبات"
          value={totalOrders}
          icon={<ClipboardList size={22} />}
          iconBg="#fbeaea"
          iconColor="#75262d"
        />
        <CenterStatCard
          title="الطلبات المكتملة"
          value={completedOrders}
          icon={<CheckCircle2 size={22} />}
          iconBg="#eef1f4"
          iconColor="#64748b"
        />
        <CenterStatCard
          title="الطلبات الملغاة"
          value={cancelledOrders}
          icon={<XCircle size={22} />}
          iconBg="#fbeaea"
          iconColor="#ef4444"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <CenterStatCard
          title="الطلبات النشطة"
          value={activeOrders}
          icon={<RefreshCcw size={22} />}
          iconBg="#e8f8ef"
          iconColor="#16a34a"
        />
        <CenterStatCard
          title="الطلبات المجدولة"
          value={scheduledOrders}
          icon={<CalendarClock size={22} />}
          iconBg="#eaf2fc"
          iconColor="#3b82f6"
        />
      </div>
    </div>
  );
}
