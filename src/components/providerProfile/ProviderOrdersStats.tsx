import { CalendarClock, CheckCircle2, ClipboardList, RefreshCcw, XCircle } from "lucide-react";
import CenterStatCard from "../ui/CenterStatCard";
import type { OrderStats } from "../../types/entities";
import { useTranslation } from "react-i18next";

export default function ProviderOrdersStats({
  cancelledOrders,
  completedOrders,
  totalOrders,
  scheduledOrders,
  activeOrders,
}: Required<OrderStats>) {
  const { t } = useTranslation();
  return (
    <div className="mb-6 space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <CenterStatCard
          title={t("stats.totalOrders")}
          value={totalOrders}
          icon={<ClipboardList size={22} />}
          iconBg="#fbeaea"
          iconColor="#75262d"
        />
        <CenterStatCard
          title={t("stats.completedOrders")}
          value={completedOrders}
          icon={<CheckCircle2 size={22} />}
          iconBg="#eef1f4"
          iconColor="#64748b"
        />
        <CenterStatCard
          title={t("stats.canceledOrders")}
          value={cancelledOrders}
          icon={<XCircle size={22} />}
          iconBg="#fbeaea"
          iconColor="#ef4444"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <CenterStatCard
          title={t("stats.activeOrders")}
          value={activeOrders}
          icon={<RefreshCcw size={22} />}
          iconBg="#e8f8ef"
          iconColor="#16a34a"
        />
        <CenterStatCard
          title={t("stats.scheduledOrders")}
          value={scheduledOrders}
          icon={<CalendarClock size={22} />}
          iconBg="#eaf2fc"
          iconColor="#3b82f6"
        />
      </div>
    </div>
  );
}
