import StatCard from "./StatCard";
import type { StatCardData } from "../../types/dashboard";

export default function StatsGrid({ stats }: { stats: StatCardData[] }) {
  return (
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
    >
      {stats.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  );
}
