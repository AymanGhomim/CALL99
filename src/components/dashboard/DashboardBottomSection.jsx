import WithdrawalsCard from "./WithdrawalsCard";
import RecentActivityCard from "./RecentActivityCard";

export default function DashboardBottomSection({ activities }) {
  return (
    <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
      <WithdrawalsCard />
      <RecentActivityCard activities={activities} />
    </div>
  );
}
