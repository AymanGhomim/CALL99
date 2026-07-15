import ActivityItem from "./ActivityItem";
import type { ActivityEntry } from "../../types/dashboard";
import { useTranslation } from "react-i18next";

export default function ActivityTimeline({ items }: { items: ActivityEntry[] }) {
  const { t } = useTranslation();
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[#f2e8e8] bg-white p-10 text-center text-sm font-medium text-gray-400 shadow-sm">
        {t("activity.empty")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((activity) => (
        <ActivityItem key={activity.id} activity={{ ...activity, title: t(`activity.items.${activity.id}.title`, { defaultValue: activity.title }), description: t(`activity.items.${activity.id}.description`, { defaultValue: activity.description }), timeAgo: t(`activity.items.${activity.id}.ago`, { defaultValue: activity.timeAgo }) }} />
      ))}
    </div>
  );
}
