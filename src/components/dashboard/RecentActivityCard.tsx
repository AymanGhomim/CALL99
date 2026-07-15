import { Clock3, UserPlus, ShoppingCart } from "lucide-react";
import type { RecentActivity } from "../../types/dashboard";
import { useTranslation } from "react-i18next";

const icons = [UserPlus, ShoppingCart];

export default function RecentActivityCard({ activities }: { activities: RecentActivity[] }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-[#f2e8e8] bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-start gap-2">
        <Clock3 size={18} className="text-[#75262d]" />
        <h3 className="text-xl font-extrabold">{t("dashboard.recentActivity")}</h3>
      </div>

      <div className="space-y-5 text-sm">
        {activities.map((activity, index) => {
          const Icon = icons[index] ?? Clock3;
          return (
            <div key={activity.title} className="flex gap-3 text-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fbf7f7] text-[#75262d]">
                <Icon size={16} />
              </div>
              <div>
                <p className="font-extrabold">{activity.title}</p>
                <p className="mt-1 text-gray-500">{activity.description}</p>
                <p className="mt-1 font-bold text-[#75262d]">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
