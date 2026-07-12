import ActivityItem from "./ActivityItem";

export default function ActivityTimeline({ items }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[#f2e8e8] bg-white p-10 text-center text-sm font-medium text-gray-400 shadow-sm">
        لا يوجد نشاط مطابق لبحثك
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
