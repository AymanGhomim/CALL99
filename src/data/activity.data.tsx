// Mock data for the Activity ("النشاط الاخير") page. Shaped the same way as
// the other *.data.jsx files so this page follows the same
// fetch-later-swap-in-real-API pattern used across the app.

import {
  Landmark,
  Clock3,
  Settings2,
  ShoppingCart,
  User,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

// Category filter tabs shown under the search/filter toolbar. "الكل" is the
// default (no category filtering applied).
export const activityCategories = [
  { value: "", label: "الكل" },
  { value: "طلبات الخدمات", label: "طلبات الخدمات", icon: ShoppingCart },
  { value: "المدفوعات", label: "المدفوعات", icon: Landmark },
  { value: "المستخدمين", label: "المستخدمين", icon: UsersRound },
  { value: "النظام", label: "النظام", icon: Settings2 },
];

// Each item carries its own icon/colors so the timeline row doesn't need a
// lookup table keyed by a "type" string; `dotColor` drives the small status
// dot next to the title, `iconBg`/`iconColor` drive the icon circle.
export const activityList = [
  {
    id: 1,
    title: "انضمام مقدم خدمة جديد",
    description: 'تم قبول طلب انضمام "ورشة النخبة" لتقديم خدمات الصيانة.',
    time: "11:45 ص",
    date: "23 مايو 2026",
    timeAgo: "منذ 15 دقيقة",
    category: "المستخدمين",
    icon: UserRoundPlus,
    iconBg: "#eaf2fc",
    iconColor: "#3b82f6",
    dotColor: "#3b82f6",
  },
  {
    id: 2,
    title: "اكتمال طلب غسيل",
    description: "تم تأكيد اكتمال الطلب #ORD-9419 من قبل العميل عمر خالد.",
    time: "11:45 ص",
    date: "23 مايو 2026",
    timeAgo: "منذ 15 دقيقة",
    category: "طلبات الخدمات",
    icon: ShoppingCart,
    iconBg: "#f7ecee",
    iconColor: "#75262d",
    dotColor: "#75262d",
  },
  {
    id: 3,
    title: "عملية دفع جديدة",
    description: "تمت عملية دفع بقيمة 150.00 ر.س للطلب #ORD-9421 بنجاح.",
    time: "11:45 ص",
    date: "23 مايو 2026",
    timeAgo: "منذ 30 دقيقة",
    category: "المدفوعات",
    icon: Landmark,
    iconBg: "#e8f8ef",
    iconColor: "#22c55e",
    dotColor: "#22c55e",
  },
  {
    id: 4,
    title: "طلب خدمة جديد",
    description: "تم إنشاء طلب خدمة جديد رقم #ORD-9422 من قبل سارة أحمد.",
    time: "11:45 ص",
    date: "23 مايو 2026",
    timeAgo: "منذ 45 دقيقة",
    category: "طلبات الخدمات",
    icon: Clock3,
    iconBg: "#fdf1e3",
    iconColor: "#d97706",
    dotColor: "#f59e0b",
  },
  {
    id: 5,
    title: "تسجيل مستخدم جديد",
    description: "تم تسجيل مستخدم جديد باسم محمد فهد كمقدم خدمة.",
    time: "11:45 ص",
    date: "23 مايو 2026",
    timeAgo: "منذ ساعة",
    category: "المستخدمين",
    icon: User,
    iconBg: "#f5f0fc",
    iconColor: "#a855f7",
    dotColor: "#a855f7",
  },
];
