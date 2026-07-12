// Mock data for the Packages ("الباقات") page. Shaped the same way as the
// other *.data.jsx files (users.data, orders.data, ...) so the page follows
// the same fetch-later-swap-in-real-API pattern already used across the app.

import { Archive, CheckCircle2, XCircle } from "lucide-react";

// Shaped exactly like usersStats / dashboardStats so this can be passed
// straight into the existing <StatsGrid /> component (StatCard per item)
// instead of a page-specific stats wrapper.
export const packagesStats = [
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

// Extra fields (description, imagesCount, videosCount, durationValue/Unit,
// priceValue, isDefault) power the Package dialogs (create/edit/view) while
// the original fields (duration, price, media strings) keep feeding the
// table exactly as before, so nothing else on the page needs to change.
export const packagesList = [
  {
    id: 1,
    name: "الباقه الاساسيه",
    code: "PKG-2024-008",
    description: "باقه مجانيه للبدء بعدد محدود من الخدمات بدون مده انتهاء.",
    servicesCount: 3,
    imagesCount: 4,
    videosCount: 0,
    duration: "غير محدود",
    durationValue: 0,
    durationUnit: "شهور",
    price: "مجاني",
    priceValue: 0,
    media: "4 صور",
    hasBanner: false,
    status: "نشط",
    isDefault: true,
  },
  {
    id: 2,
    name: "الباقه الفضيه",
    code: "PKG-2024-008",
    description: "باقه متوسطه تناسب مقدمي الخدمة الجدد بعدد خدمات وصور أكبر.",
    servicesCount: 12,
    imagesCount: 20,
    videosCount: 2,
    duration: "3 اشهر",
    durationValue: 3,
    durationUnit: "شهور",
    price: "64 ريال",
    priceValue: 64,
    media: "20 صوره + 2فيديو",
    hasBanner: false,
    status: "نشط",
    isDefault: false,
  },
  {
    id: 3,
    name: "الباقه الذهبيه",
    code: "PKG-2024-008",
    description: "اكتب وصفا موجزا لخدماتالباقه............",
    servicesCount: 30,
    imagesCount: 60,
    videosCount: 10,
    duration: "3 اشهر",
    durationValue: 3,
    durationUnit: "شهور",
    price: "960 ريال",
    priceValue: 960,
    media: "60 صوره +10 فيديو",
    hasBanner: true,
    status: "غير نشط",
    isDefault: false,
  },
  {
    id: 4,
    name: "الباقه البلاتينيه",
    code: "PKG-2024-011",
    description: "الباقه الاعلى تشمل جميع الخدمات وبنر اعلاني مميز.",
    servicesCount: 45,
    imagesCount: 100,
    videosCount: 20,
    duration: "6 اشهر",
    durationValue: 6,
    durationUnit: "شهور",
    price: "1500 ريال",
    priceValue: 1500,
    media: "100 صوره +20 فيديو",
    hasBanner: true,
    status: "نشط",
    isDefault: false,
  },
];

export const durationUnitOptions = ["شهور", "سنه", "غير محدود"];
