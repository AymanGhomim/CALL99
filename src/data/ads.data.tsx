import { AlarmClockOff, CalendarClock, CheckCircle2, Megaphone } from "lucide-react";

export const adsStats = [
  {
    title: "إجمالي الاعلانات",
    value: "1,240",
    icon: <Megaphone size={22} />,
    iconBg: "#f2eaea",
    iconColor: "#75262d",
    change: "+3 الشهر الحالي",
    changeType: "up",
  },
  {
    title: "الاعلانات النشطه",
    value: 24,
    icon: <CheckCircle2 size={22} />,
    iconBg: "#e8f8ef",
    iconColor: "#22c55e",
    change: "تشكل 75% من الإجمالي",
    changeType: "up",
  },
  {
    title: "الاعلانات المجدوله",
    value: 342,
    icon: <CalendarClock size={22} />,
    iconBg: "#eaf2fc",
    iconColor: "#3b82f6",
    change: "لشهر يوليو",
    changeType: "neutral",
  },
  {
    title: "الاعلانات غير النشطه",
    value: 6,
    icon: <AlarmClockOff size={22} />,
    iconBg: "#fbeaea",
    iconColor: "#ef4444",
    change: "تحتاج إلى مراجعة",
    changeType: "down",
  },
];
