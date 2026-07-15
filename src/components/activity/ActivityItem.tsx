import type { ActivityEntry } from "../../types/dashboard";
import useLocale from "../../i18n/useLocale";

export default function ActivityItem({ activity }: { activity: ActivityEntry }) {
  const { formatTimeText } = useLocale();
  const Icon = activity.icon;

  return (
    <div className="rounded-xl border border-[#f2e8e8] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-1 text-right">
          <div className="flex items-center justify-start gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: activity.dotColor }}
            />
            <h3 className="text-base font-extrabold text-[#3d3434]">
              {activity.title}
            </h3>
          </div>

          <p className="mt-2 text-sm font-medium text-gray-500">
            {activity.description}
          </p>

          <p className="mt-2 text-sm font-bold text-[#75262d]">
            {activity.timeAgo}
          </p>
        </div>

        <div className="flex w-20 flex-col items-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: activity.iconBg }}
          >
            {Icon && <Icon size={22} style={{ color: activity.iconColor }} />}
          </div>

          <p className="mt-3 text-sm font-semibold text-[#3d3434]">
            {formatTimeText(activity.time)}
          </p>

          <p className="mt-1 text-xs text-gray-500">{activity.date}</p>
        </div>
      </div>
    </div>
  );
}
