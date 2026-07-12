// Mock data for the Ads ("الاعلانات") page. Shaped the same way as the
// other *.data.jsx files (packages.data, orders.data, ...) so this page
// follows the same fetch-later-swap-in-real-API pattern used across the app.

import { AlarmClockOff, CalendarClock, CheckCircle2, Megaphone } from "lucide-react";

// Shaped exactly like packagesStats so it can be dropped straight into a
// StatCard grid instead of a page-specific stats wrapper.
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

export const statusOptions = ["نشط", "مجدولة", "غير نشط"];

// Kept in sync with the service vocabulary already used on the Orders /
// Packages pages so filters read consistently across the app.
export const serviceOptions = ["صيانه سريعه", "تاجير سيارات", "غسيل", "سحب"];

export const adsList = [
  {
    id: 1,
    name: "خصم تبديل البطاريه الفوري",
    description: "خصم فوري على خدمة تبديل البطاريه في الموقع لعملاء التطبيق.",
    service: "صيانه سريعه",
    startDate: "23مايو 2026",
    endDate: "22يوليو 2026",
    status: "نشط",
  },
  {
    id: 2,
    name: "عرض ايجار العربيات اليومي",
    description: "خصم على تأجير السيارات اليومي لمقدمي خدمة تأجير السيارات.",
    service: "تاجير سيارات",
    startDate: "23مايو 2026",
    endDate: "22يوليو 2026",
    status: "مجدولة",
  },
  {
    id: 3,
    name: "عرض غسيل السيارات الصيفي",
    description: "عرض موسمي على خدمات غسيل السيارات الخارجي والداخلي.",
    service: "غسيل",
    startDate: "23مايو 2026",
    endDate: "22يوليو 2026",
    status: "مجدولة",
  },
  {
    id: 4,
    name: "عرض السحب المغطي",
    description: "تخفيض على خدمة السحب للسيارات المعطلة داخل المدينة.",
    service: "سحب",
    startDate: "23مايو 2026",
    endDate: "22يوليو 2026",
    status: "غير نشط",
  },
  {
    id: 5,
    name: "باقة صيانة الصيف الشاملة",
    description: "عرض على باقات الصيانة الدورية الشاملة قبل موسم الصيف.",
    service: "صيانه سريعه",
    startDate: "10يونيو 2026",
    endDate: "10أغسطس 2026",
    status: "نشط",
  },
  {
    id: 6,
    name: "عرض السطحة السريعة",
    description: "خصم على خدمة السطحة للطلبات الطارئة على مدار الساعة.",
    service: "سحب",
    startDate: "01يوليو 2026",
    endDate: "31يوليو 2026",
    status: "نشط",
  },
];
