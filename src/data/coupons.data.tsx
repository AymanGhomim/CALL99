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

export const couponDiscountDistribution = [
  { name: "نسبة مئوية (87 كوبون)", value: 87, color: "#75262d" },
  { name: "مبلغ ثابت (41 كوبون)", value: 41, color: "#f8d58e" },
];

export const couponUsageData = [
  { name: "يناير", value: 34 },
  { name: "فبراير", value: 42 },
  { name: "مارس", value: 49 },
  { name: "أبريل", value: 57 },
  { name: "مايو", value: 66 },
  { name: "يونيو", value: 74 },
];

export const couponStatusOptions = ["نشط", "غير نشط"];
export const couponDiscountTypeOptions = ["نسبة مئوية", "مبلغ ثابت"];

export const initialCoupons = [
  {
    id: 1,
    code: "77777777",
    description: "خصم 20% على جميع الخدمات",
    discountType: "نسبة مئوية",
    discountValue: "20%",
    services: "جميع الخدمات",
    maxDiscount: "100 ريال",
    minOrder: "100 ريال",
    usageLimit: 3,
    startDate: "2026/06/20",
    endDate: "2026/06/20",
    status: "نشط",
  },
  {
    id: 2,
    code: "77777777",
    description: "خصم 20% على جميع الخدمات",
    discountType: "نسبة مئوية",
    discountValue: "20%",
    services: "جميع الخدمات",
    maxDiscount: "100 ريال",
    minOrder: "100 ريال",
    usageLimit: 3,
    startDate: "2026/06/20",
    endDate: "2026/06/20",
    status: "نشط",
  },
  {
    id: 3,
    code: "77777777",
    description: "خصم 10 ريال للعملاء الجدد",
    discountType: "مبلغ ثابت",
    discountValue: "10 ريال",
    services: "جميع الخدمات",
    maxDiscount: "100 ريال",
    minOrder: "100 ريال",
    usageLimit: 3,
    startDate: "2026/06/20",
    endDate: "2026/06/20",
    status: "غير نشط",
  },
];
