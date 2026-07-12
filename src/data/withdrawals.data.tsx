import { CalendarClock, CheckCircle2, EyeOff, Flag } from "lucide-react";

export const withdrawalsStats = [
  { title: "طلبات جديدة", value: "1,240", change: "+3 الشهر الحالي", icon: <Flag />, iconBg: "#f2e8e9", iconColor: "#75262d" },
  { title: "تمت الموافقة", value: 24, change: "تشكل 75% من الإجمالي", icon: <CheckCircle2 />, iconBg: "#e7f8f1", iconColor: "#10b981" },
  { title: "قيد المعالجة", value: 342, change: "لشهر يوليو", changeType: "neutral", icon: <CalendarClock />, iconBg: "#eaf2ff", iconColor: "#3b82f6" },
  { title: "مرفوضة", value: 6, change: "تحتاج إلى مراجعة", changeType: "down", icon: <EyeOff />, iconBg: "#fdebec", iconColor: "#ef4444" },
];

export const withdrawalServiceOptions = ["صيانة السيارات", "خدمات القطر", "غسيل السيارات"];

export const withdrawalsList = [
  { id: 1, requestNo: "#ORD-9421", provider: "أحمد محمد علي", method: "تحويل بنكي", status: "تمت الموافقة", amount: "150 ريال", date: "23 مايو 2026", service: "صيانة السيارات" },
  { id: 2, requestNo: "#ORD-9422", provider: "سارة أحمد حسن", method: "تحويل بنكي", status: "مرفوض", amount: "150 ريال", date: "23 مايو 2026", service: "غسيل السيارات" },
  { id: 3, requestNo: "#ORD-9423", provider: "عمر خالد إبراهيم", method: "تحويل بنكي", status: "قيد المعالجة", amount: "150 ريال", date: "23 مايو 2026", service: "خدمات القطر" },
  { id: 4, requestNo: "#ORD-9424", provider: "نورهان مصطفى محمود", method: "تحويل بنكي", status: "قيد المعالجة", amount: "150 ريال", date: "23 مايو 2026", service: "صيانة السيارات" },
];
