import StatCard from "./StatCard";

export default function StatsGrid({ stats }) {
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
