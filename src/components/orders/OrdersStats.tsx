import StatsGrid from "../dashboard/StatsGrid";
import type { StatCardData } from "../../types/dashboard";

export default function OrdersStats({ stats }: { stats: StatCardData[] }) {
  return (
    <div className="mb-7">
      <StatsGrid stats={stats} />
    </div>
  );
}
