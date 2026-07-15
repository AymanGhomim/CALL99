import { BriefcaseBusiness, CheckCircle2, Clock3, Eye } from "lucide-react";
import type { StatCardData } from "../types/dashboard";

export interface TicketRecord {
  id: number;
  ticketNo: string;
  orderNo: string;
  service: string;
  customer: string;
  subject: string;
  createdAt: string;
  status: string;
  description: string;
}

export const ticketStatusOptions = ["مفتوحة", "قيد المعالجة", "بانتظار العميل", "مغلقة"];
export const ticketServiceOptions = ["غسيل", "سطحة", "صيانة سريعة", "تأجير السيارات"];

export const ticketsStats: StatCardData[] = [
  { title: "إجمالي التذاكر", value: 342, change: "+18%", icon: <BriefcaseBusiness />, iconBg: "#eaf2ff", iconColor: "#3b82f6" },
  { title: "مفتوحة", value: 200, change: "+3 الشهر الحالي", icon: <Eye />, iconBg: "#fff3e8", iconColor: "#f97316" },
  { title: "قيد المعالجة", value: 200, change: "+3 الشهر الحالي", icon: <Clock3 />, iconBg: "#fff9df", iconColor: "#d99a00" },
  { title: "تم حلها", value: 24, change: "تشكل 75% من الإجمالي", icon: <CheckCircle2 />, iconBg: "#e5f8f2", iconColor: "#10b981" },
  { title: "بانتظار العميل", value: 189, change: "+3 الشهر الحالي", icon: <Clock3 />, iconBg: "#eaf2ff", iconColor: "#3b82f6" },
];

export const initialTickets: TicketRecord[] = [
  { id: 1, ticketNo: "#TKT-9421", orderNo: "#ORD-9421", service: "غسيل", customer: "أحمد محمد علي", subject: "تأخير في التوصيل", createdAt: "22 يوليو 2026", status: "مغلقة", description: "تأخر مقدم الخدمة عن الموعد المحدد للتوصيل." },
  { id: 2, ticketNo: "#TKT-9422", orderNo: "#ORD-9421", service: "سطحة", customer: "أحمد محمد علي", subject: "جودة الخدمة منخفضة", createdAt: "22 يوليو 2026", status: "قيد المعالجة", description: "الخدمة المقدمة لم تكن بالمستوى المطلوب." },
  { id: 3, ticketNo: "#TKT-9423", orderNo: "#ORD-9421", service: "صيانة سريعة", customer: "أحمد محمد علي", subject: "تأخير في التوصيل", createdAt: "22 يوليو 2026", status: "قيد المعالجة", description: "لم يصل مقدم الخدمة في الوقت المتفق عليه." },
  { id: 4, ticketNo: "#TKT-9424", orderNo: "#ORD-9421", service: "صيانة سريعة", customer: "أحمد محمد علي", subject: "تأخير في التوصيل", createdAt: "22 يوليو 2026", status: "قيد المعالجة", description: "يوجد تأخير في إنهاء الطلب." },
  { id: 5, ticketNo: "#TKT-9425", orderNo: "#ORD-9421", service: "تأجير السيارات", customer: "أحمد محمد علي", subject: "تأخير في التوصيل", createdAt: "22 يوليو 2026", status: "مفتوحة", description: "لم يتم تسليم السيارة في الموعد." },
];
