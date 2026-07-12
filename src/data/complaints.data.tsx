import { CalendarClock, CheckCircle2, EyeOff, Flag } from "lucide-react";

export const complaintsStats = [
  {
    title: "شكاوى جديدة",
    value: "1,240",
    change: "+3 الشهر الحالي",
    icon: <Flag />,
    iconBg: "#f2e8e9",
    iconColor: "#75262d",
  },
  {
    title: "تم حلها",
    value: 24,
    change: "تشكل 75% من الإجمالي",
    icon: <CheckCircle2 />,
    iconBg: "#e7f8f1",
    iconColor: "#10b981",
  },
  {
    title: "قيد المعالجة",
    value: 342,
    change: "لشهر يوليو",
    changeType: "neutral",
    icon: <CalendarClock />,
    iconBg: "#eaf2ff",
    iconColor: "#3b82f6",
  },
  {
    title: "مرفوضة",
    value: 6,
    change: "تحتاج إلى مراجعة",
    changeType: "down",
    icon: <EyeOff />,
    iconBg: "#fdebec",
    iconColor: "#ef4444",
  },
];

export const complaintStatusOptions = ["نشط", "قيد المعالجة", "مرفوضة"];

export const initialComplaints = [
  {
    id: 1,
    ticketNo: "#ORD-9421",
    customer: "أحمد محمد علي",
    type: "تأخير في التوصيل",
    orderNo: "#ORD-9421",
    date: "22 يوليو 2026",
    status: "نشط",
  },
  {
    id: 2,
    ticketNo: "#ORD-9422",
    customer: "أحمد محمد علي",
    type: "جودة الخدمة منخفضة",
    orderNo: "#ORD-9421",
    date: "22 يوليو 2026",
    status: "قيد المعالجة",
  },
  {
    id: 3,
    ticketNo: "#ORD-9423",
    customer: "أحمد محمد علي",
    type: "تأخير في التوصيل",
    orderNo: "#ORD-9421",
    date: "22 يوليو 2026",
    status: "قيد المعالجة",
  },
  {
    id: 4,
    ticketNo: "#ORD-9424",
    customer: "أحمد محمد علي",
    type: "تأخير في التوصيل",
    orderNo: "#ORD-9421",
    date: "22 يوليو 2026",
    status: "قيد المعالجة",
  },
  {
    id: 5,
    ticketNo: "#ORD-9425",
    customer: "أحمد محمد علي",
    type: "تأخير في التوصيل",
    orderNo: "#ORD-9421",
    date: "22 يوليو 2026",
    status: "مرفوضة",
  },
];
