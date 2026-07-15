import { CalendarClock, CheckCircle2, ClipboardList, ShieldCheck, XCircle } from "lucide-react";
import StatCard from "../dashboard/StatCard";
import { useTranslation } from "react-i18next";

interface ProviderRequestStats {
  total: { value: number | string };
  pendingReview: { value: number | string };
  rejected: { value: number | string };
  awaitingVerification: { value: number | string };
  approved: { value: number | string };
}

export default function ProvidersStatsSection({ stats }: { stats: ProviderRequestStats }) {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
      >
        <StatCard
          title={t("provider.totalApplications")}
          value={stats.total.value}
          icon={<ClipboardList />}
          iconBg="#f1eafb"
          iconColor="#8b5cf6"
        />
        <StatCard
          title={t("provider.pendingReview")}
          value={stats.pendingReview.value}
          icon={<CalendarClock />}
          iconBg="#e8f8ef"
          iconColor="#16a34a"
        />
        <StatCard
          title={t("provider.rejectedApplications")}
          value={stats.rejected.value}
          icon={<XCircle />}
          iconBg="#fbeaea"
          iconColor="#ef4444"
        />
        <StatCard
          title={t("provider.awaitingVerification")}
          value={stats.awaitingVerification.value}
          icon={<ShieldCheck size={24} />}
          iconBg="#f1eafb"
          iconColor="#8b5cf6"
        />
        <StatCard
          title={t("provider.approvedApplications")}
          value={stats.approved.value}
          icon={<CheckCircle2 size={24} />}
          iconBg="#fdf1e3"
          iconColor="#c9862e"
        />
      </div>
    </div>
  );
}
