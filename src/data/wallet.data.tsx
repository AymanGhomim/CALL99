import { Coins, Landmark, LineChart, WalletCards } from "lucide-react";

export const walletStats = [
  {
    title: "إجمالي الإيرادات",
    value: "240,000,000 ر.س",
    change: "+12.5% عن الشهر الماضي",
    icon: <LineChart />,
    iconBg: "#eaf2ff",
    iconColor: "#3b82f6",
  },
  {
    title: "أرباح مقدمي الخدمة",
    value: "1,500,000 ر.س",
    change: "تشكل 75% من الإجمالي",
    icon: <WalletCards />,
    iconBg: "#e7f8f1",
    iconColor: "#10b981",
  },
  {
    title: "عمولة المنصة",
    value: "490,000 ر.س",
    change: "تشكل 25% من الإجمالي",
    changeType: "warning",
    icon: <Coins />,
    iconBg: "#fff4df",
    iconColor: "#f59e0b",
  },
  {
    title: "إجمالي السحوبات",
    value: "1,120,000 ر.س",
    change: "تم تحويلها بنجاح",
    changeType: "down",
    icon: <Landmark />,
    iconBg: "#fdebec",
    iconColor: "#ef4444",
  },
];

export const transactionStatusOptions = ["مكتمل", "فشل", "في الانتظار"];
export const transactionServiceOptions = ["غسيل سيارات", "صيانة", "تأجير سيارات"];
export const paymentTypeOptions = ["تحصيل", "تسوية", "استرداد", "تفويض مسبق"];

export const initialTransactions = [
  { id: 1, transactionNo: "#ORD-9421", orderNo: "#ORD-9421", customer: "أحمد محمد علي", provider: "أحمد محمد علي", gateway: "Paymob", paymentMethod: "Visa ****4242", amount: "150 ريال", type: "تحصيل", status: "مكتمل", createdAt: "23 مايو 2026", createdDate: "2026-05-23", service: "غسيل سيارات" },
  { id: 2, transactionNo: "#ORD-9422", orderNo: "#ORD-9421", customer: "سارة أحمد حسن", provider: "أحمد محمد علي", gateway: "Paymob", paymentMethod: "Visa ****4242", amount: "150 ريال", type: "تسوية", status: "فشل", createdAt: "23 مايو 2026", createdDate: "2026-05-23", service: "صيانة" },
  { id: 3, transactionNo: "#ORD-9423", orderNo: "#ORD-9421", customer: "عمر خالد إبراهيم", provider: "أحمد محمد علي", gateway: "Paymob", paymentMethod: "Visa ****4242", amount: "150 ريال", type: "استرداد", status: "في الانتظار", createdAt: "23 مايو 2026", createdDate: "2026-05-23", service: "تأجير سيارات" },
  { id: 4, transactionNo: "#ORD-9424", orderNo: "#ORD-9421", customer: "نورهان مصطفى محمود", provider: "أحمد محمد علي", gateway: "Paymob", paymentMethod: "Visa ****4242", amount: "150 ريال", type: "تفويض مسبق", status: "مكتمل", createdAt: "23 مايو 2026", createdDate: "2026-05-23", service: "صيانة" },
];

export const withdrawalRequests = [
  { id: 1, provider: "مركز النخبة لصيانة السيارات", reference: "#WDL-552", date: "24 يوليو 2024", amount: "1,250 ر.س", status: "قيد الانتظار" },
  { id: 2, provider: "ورشة الأمان التقنية", reference: "#WDL-551", date: "23 يوليو 2024", amount: "1,250 ر.س", status: "تم القبول" },
  { id: 3, provider: "خدمات القطر السريع", reference: "#WDL-550", date: "22 يوليو 2024", amount: "1,250 ر.س", status: "مرفوض" },
];
