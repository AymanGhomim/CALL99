import StatsGrid from "../dashboard/StatsGrid";

export default function AdsStats({ stats }) {
  return (
    <div className="mb-7">
      <StatsGrid stats={stats} />
    </div>
  );
}
