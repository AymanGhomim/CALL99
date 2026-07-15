import { CalendarClock, CheckCircle2, ClipboardList, XCircle } from "lucide-react";
import CenterStatCard from "../ui/CenterStatCard";

interface UserOrdersStatsProps {
  totalOrders: number;
  cancelledOrders: number;
  scheduledOrders: number;
  completedOrders: number;
}

export default function UserOrdersStats({ totalOrders, cancelledOrders, scheduledOrders, completedOrders }: UserOrdersStatsProps) {
  return (
    <div className="mb-6">
      <CenterStatCard
        size="lg"
        title="إجمالي الطلبات"
        value={totalOrders}
        icon={<ClipboardList size={26} />}
        iconBg="#fbeaea"
        iconColor="#75262d"
      />

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <CenterStatCard
          title="الطلبات الملغاة"
          value={cancelledOrders}
          icon={<XCircle size={22} />}
          iconBg="#fbeaea"
          iconColor="#ef4444"
        />
        <CenterStatCard
          title="الطلبات المجدولة"
          value={scheduledOrders}
          icon={<CalendarClock size={22} />}
          iconBg="#eaf2fc"
          iconColor="#3b82f6"
        />
        <CenterStatCard
          title="الطلبات المكتملة"
          value={completedOrders}
          icon={<CheckCircle2 size={22} />}
          iconBg="#eef1f4"
          iconColor="#64748b"
        />
      </div>
    </div>
  );
}
