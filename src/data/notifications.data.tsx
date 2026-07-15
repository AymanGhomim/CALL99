// Mock data for the Notifications ("الإشعارات") page. Shaped the same way
// as ads.data.jsx / packages.data.jsx so this page follows the same
// fetch-later-swap-in-real-API pattern used across the app.

import { MapPin, Radar, Send, UsersRound, CalendarClock } from "lucide-react";
import type { NotificationRecord } from "../components/dialogs/NotificationDialog/constants";

// Top stats row. Uses StatCard's `badge` prop (a pill, e.g. "نشط" / "94%")
// instead of the plain up/down `change` text most other pages use.
export const notificationsStats = [
  {
    title: "إجمالي المستلمين",
    value: "25.4K",
    icon: <UsersRound size={22} />,
    iconBg: "#f2eaea",
    iconColor: "#75262d",
    badge: { label: "نشط", tone: "success" },
  },
  {
    title: "المجدولة",
    value: 42,
    icon: <CalendarClock size={22} />,
    iconBg: "#eaf2fc",
    iconColor: "#3b82f6",
    badge: { label: "جديد", tone: "warning" },
  },
  {
    title: "المرسلة",
    value: "1,150",
    icon: <Send size={22} />,
    iconBg: "#e8f8ef",
    iconColor: "#22c55e",
    badge: { label: "94%", tone: "success" },
  },
  {
    title: "إجمالي الإشعارات",
    value: "1,284",
    icon: <Radar size={22} />,
    iconBg: "#f2eaea",
    iconColor: "#75262d",
    badge: { label: "+12%", tone: "success" },
  },
];

export const statusOptions = ["نشط", "مجدولة", "مكتمل", "متوقف"];

// Kept in sync with the audience vocabulary used across the app (users,
// providers...) so filters and the create-dialog read consistently.
export const audienceOptions = ["جميع المستخدمين", "العملاء", "مقدمو الخدمة", "فريق ميداني"];

export const notificationsList: NotificationRecord[] = [
  {
    id: 1,
    title: "عرض نهاية الأسبوع الخاص",
    description: "خصم 20% على خدمات الصيانة عند الحجز خلال عطلة نهاية الأسبوع.",
    audience: "الكل",
    time: "منذ ساعتين",
    status: "نشط",
    recipients: "5,430",
    channel: "app",
    deliveryStatus: "تم الإرسال بنجاح",
    audienceTags: [{ label: "كافة المستخدمين", icon: UsersRound }],
    stats: { clickRate: "11.8%", readRate: "79%", totalRecipients: "5,430" },
  },
  {
    id: 2,
    title: "تحديث تطبيق CALL99 الجديد",
    description: "يتوفر الآن تحديث جديد لتحسين تجربة الاستخدام وإصلاح بعض المشكلات.",
    audience: "الكل",
    time: "غداً، 10:00 صباحاً",
    status: "مجدولة",
    recipients: "12,100",
    channel: "app",
    deliveryStatus: "قيد الجدولة",
    audienceTags: [{ label: "كافة المستخدمين", icon: UsersRound }],
    stats: { clickRate: "—", readRate: "—", totalRecipients: "12,100" },
  },
  {
    id: 3,
    title: "تذكير بموعد الصيانة الدورية لمركبتك",
    description:
      "عزيزي العميل، نود تذكيركم بأن مركبتكم رقم (أ ب ج 1234) قد اقترب موعد صيانتها الدورية عند 50,000 كم. يرجى حجز موعد عبر التطبيق للحفاظ على أداء المحرك وضمان سلامتك على الطريق. فريق CALL99 يتمنى لكم رحلة آمنة.",
    audience: "العملاء",
    time: "14 أكتوبر 2023 | 09:45 ص",
    status: "مكتمل",
    recipients: "12,450",
    channel: "app",
    deliveryStatus: "تم الإرسال بنجاح",
    audienceTags: [
      { label: "منطقة الرياض", icon: MapPin },
      { label: "كافة العملاء", icon: UsersRound },
    ],
    stats: { clickRate: "14.2%", readRate: "88%", totalRecipients: "12,450" },
  },
  {
    id: 4,
    title: "رسالة ترحيب الأعضاء الجدد",
    description: "مرحباً بك في عائلة CALL99 الفاخرة، نتمنى لك تجربة مميزة معنا.",
    audience: "العملاء",
    time: "تلقائي (عند التسجيل)",
    status: "نشط",
    recipients: "دائم",
    channel: "app",
    deliveryStatus: "تم الإرسال بنجاح",
    audienceTags: [{ label: "كافة العملاء", icon: UsersRound }],
    stats: { clickRate: "22.4%", readRate: "95%", totalRecipients: "دائم" },
  },
  {
    id: 5,
    title: "صيانة مجدولة على الخوادم",
    description: "سيتم إيقاف الخدمة مؤقتاً غداً بين الساعة 2 و4 صباحاً لأعمال الصيانة.",
    audience: "الكل",
    time: "بعد 3 أيام، 2:00 صباحاً",
    status: "مجدولة",
    recipients: "25,400",
    channel: "sms",
    deliveryStatus: "قيد الجدولة",
    audienceTags: [{ label: "كافة المستخدمين", icon: UsersRound }],
    stats: { clickRate: "—", readRate: "—", totalRecipients: "25,400" },
  },
  {
    id: 6,
    title: "تذكير بتقييم الطلب الأخير",
    description: "شاركنا رأيك في آخر طلب صيانة تم تنفيذه لمساعدتنا على التحسين.",
    audience: "العملاء",
    time: "منذ 5 أيام",
    status: "مكتمل",
    recipients: "3,210",
    channel: "sms",
    deliveryStatus: "تم الإرسال بنجاح",
    audienceTags: [{ label: "كافة العملاء", icon: UsersRound }],
    stats: { clickRate: "9.6%", readRate: "71%", totalRecipients: "3,210" },
  },
  {
    id: 7,
    title: "تنبيه إيقاف حملة الخصومات",
    description: "تم إيقاف حملة خصومات الصيف مؤقتاً لمراجعة الأسعار.",
    audience: "المزودين",
    time: "منذ أسبوع",
    status: "متوقف",
    recipients: "1,020",
    channel: "app",
    deliveryStatus: "تم إيقافه",
    audienceTags: [{ label: "مقدمو الخدمة", icon: UsersRound }],
    stats: { clickRate: "6.3%", readRate: "58%", totalRecipients: "1,020" },
  },
];
