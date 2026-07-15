import { BadgeCheck, ClipboardList, ListChecks } from "lucide-react";

export const couponsStats = [
  {
    title: "إجمالي عدد الكوبونات",
    value: 24,
    change: "+3 الشهر الحالي",
    icon: <ClipboardList />,
    iconBg: "#f5edff",
    iconColor: "#8b5cf6",
  },
  {
    title: "إجمالي مرات الاستخدام",
    value: 2000,
    change: "+3 الشهر الحالي",
    icon: <ListChecks />,
    iconBg: "#e9f9f0",
    iconColor: "#16a34a",
  },
  {
    title: "الكوبونات النشطة",
    value: 6,
    change: "+3 الشهر الحالي",
    icon: <BadgeCheck />,
    iconBg: "#fff4e9",
    iconColor: "#f97316",
  },
];
