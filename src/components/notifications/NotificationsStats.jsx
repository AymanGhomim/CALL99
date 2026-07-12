import StatsGrid from "../dashboard/StatsGrid";

export default function NotificationsStats({ stats }) {
  return (
    <div className="mb-7">
      <StatsGrid stats={stats} />
    </div>
  );
}
