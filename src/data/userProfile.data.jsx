import { ORDER_STATUS_OPTIONS } from "../constants/statusTones";

export const orderStatusData = [
  { name: "48 (92%) مكتملة", value: 48, color: "#75262d" },
  { name: "2 (4%) قيد التنفيذ", value: 2, color: "#f2b134" },
  { name: "2 (4%) ملغاة", value: 2, color: "#ef4444" },
];

export const monthlyActivityData = [
  { name: "يونيو", value: 46 },
  { name: "مايو", value: 100 },
  { name: "ابريل", value: 70 },
  { name: "مارس", value: 88 },
  { name: "فبراير", value: 60 },
  { name: "يناير", value: 42 },
];

export const orderStatusOptions = ORDER_STATUS_OPTIONS;

export function getUserOrders(userName) {
  return [
    { id: 1, orderNo: "#ORD-9421", service: "غسيل خارجي", provider: userName, status: "مكتمل", price: "150 ريال", date: "23مايو 2026" },
    { id: 2, orderNo: "#ORD-9421", service: "غسيل خارجي", provider: userName, status: "مجدولة", price: "150 ريال", date: "23مايو 2026" },
    { id: 3, orderNo: "#ORD-9421", service: "غسيل خارجي", provider: userName, status: "قيد التنفيذ", price: "150 ريال", date: "23مايو 2026" },
    { id: 4, orderNo: "#ORD-9421", service: "غسيل خارجي", provider: userName, status: "ملغي", price: "150 ريال", date: "23مايو 2026" },
  ];
}

export function getUserProfileExtras() {
  return {
    phone: "+966 50 123 4567",
    memberSince: "عضو منذ يناير 2024",
    status: "نشط",
    totalOrders: 1024,
    cancelledOrders: 104,
    scheduledOrders: 124,
    completedOrders: 124,
    financialSummary: {
      totalExpenses: "23,450 ر.س",
      totalOrders: 128,
      commissions: "2,345 ر.س",
    },
  };
}
