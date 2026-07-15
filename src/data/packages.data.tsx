import { Archive, CheckCircle2, XCircle } from "lucide-react";
import type { StatCardData } from "../types/dashboard";

export const packagesStats: StatCardData[] = [
  {
    title: "إجمالي الباقات",
    value: 24,
    icon: <Archive size={22} />,
    iconBg: "#f2eaea",
    iconColor: "#75262d",
    change: "+3 الشهر الحالي",
    changeType: "up",
  },
  {
    title: "الباقات النشطه",
    value: 24,
    icon: <CheckCircle2 size={22} />,
    iconBg: "#e8f8ef",
    iconColor: "#22c55e",
    change: "تشكل 75% من الإجمالي",
    changeType: "up",
  },
  {
    title: "الباقات غير النشطه",
    value: 6,
    icon: <XCircle size={22} />,
    iconBg: "#fbeaea",
    iconColor: "#ef4444",
    change: "تحتاج إلى مراجعة",
    changeType: "down",
  },
];

export const statusOptions = ["نشط", "غير نشط"];

// Kept in sync with the service vocabulary already used on the Orders page
// (src/data/orders.data.jsx) so filters read consistently across the app.
export const serviceTypeOptions = ["غسيل سيارات", "ونش", "صيانة", "تأجير"];
