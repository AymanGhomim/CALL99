import { AlertTriangle, CalendarClock, ClipboardList, ShieldCheck, UsersRound } from "lucide-react";
import StatCard from "../dashboard/StatCard";


function ChangeLabel({ text }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-emerald-500">↗</span>
      {text}
    </span>
  );
}

export default function ProvidersStatsSection({ stats }) {
  return (
    <div className="mb-6">
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
      >
        <StatCard
          title="إجمالي الطلبات"
          value={stats.totalRequests.value}
          change={<ChangeLabel text={stats.totalRequests.change} />}
          icon={<ClipboardList />}
          iconBg="#f1eafb"
          iconColor="#8b5cf6"
        />
        <StatCard
          title="قيد المراجعه"
          value={stats.underReview.value}
          change={<ChangeLabel text={stats.underReview.change} />}
          icon={<CalendarClock />}
          iconBg="#e8f8ef"
          iconColor="#16a34a"
        />
        <StatCard
          title="مستندات ناقصه"
          value={stats.missingDocuments.value}
          change={<ChangeLabel text={stats.missingDocuments.change} />}
          icon={<AlertTriangle />}
          iconBg="#fbeaea"
          iconColor="#ef4444"
        />
        <StatCard
          title="بانتظار التحقق"
          value={stats.awaitingVerification.value}
          icon={<ShieldCheck size={24} />}
          iconBg="#f1eafb"
          iconColor="#8b5cf6"
        />
        <StatCard
          title="قيد مراجعة المستندات"
          value={stats.documentsReview.value}
          icon={<UsersRound size={24} />}
          iconBg="#fdf1e3"
          iconColor="#c9862e"
        />
      </div>
    </div>
  );
}
