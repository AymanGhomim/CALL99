import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CircleDollarSign,
  Mail,
  MapPinned,
  Phone,
  Star,
} from "lucide-react";

import Badge from "../ui/Badge";
import Button from "../ui/Button/Button";
import Modal from "../ui/Modal";
import UserProfileCard from "../userProfile/UserProfileCard";
import UserOrdersStats from "../userProfile/UserOrdersStats";
import UserOrdersTable from "../userProfile/UserOrdersTable";
import UserFinancialSummary from "../userProfile/UserFinancialSummary";
import ProviderInfoCard from "../providerProfile/ProviderInfoCard";
import ProviderQuickInfoRow from "../providerProfile/ProviderQuickInfoRow";
import ProviderDetailsGrid from "../providerProfile/ProviderDetailsGrid";
import ProviderOrdersStats from "../providerProfile/ProviderOrdersStats";
import ProviderOrdersTable from "../providerProfile/ProviderOrdersTable";
import ProviderFinancialSummary from "../providerProfile/ProviderFinancialSummary";
import ProviderReviewsCard from "../providerProfile/ProviderReviewsCard";
import { ORDER_STATUS_TONE } from "../../constants/statusTones";
import { usersList } from "../../data/users.data";
import {
  getUserOrders,
  getUserProfileExtras,
} from "../../data/userProfile.data";
import {
  getProviderOrders,
  getProviderProfile,
} from "../../data/providerProfile.data";

const FALLBACK_ORDER = {
  orderNo: "#ORD-1001",
  status: "جديد",
  serviceType: "غسيل سيارات",
  bookingType: "عميل",
  createdDate: "12/07/2026 09:30",
  scheduledDate: "13/07/2026 11:00",
  completedDate: "13/07/2026 14:30",
  description:
    "تنظيف داخلي وخارجي للسيارة مع إزالة البقع الصعبة ومعالجة الزجاج الداخلي.",
  notes: "يرجى تجهيز السيارة في موقف خاص قبل الساعة 11 صباحًا.",
  pricingModel: "سعر ثابت",
  paymentTime: "الدفع عند الاستلام",
  estimatedPrice: "150 ر.س",
  finalPrice: "150 ر.س",
  platformFee: "15 ر.س",
  providerEarnings: "135 ر.س",
  paymentGateway: "مدى",
  transactionNumber: "TXN-924812",
  refundAmount: "0 ر.س",
  walletAmount: "0 ر.س",
  provider: {
    name: "شركة النظافة",
    phone: "01022222222",
    email: "provider@carservices.sa",
    address: "الرياض، شارع الملك فهد، بجوار مركز التسوق",
    rating: 4.9,
    avatar: "SN",
  },
  customer: {
    name: "أحمد محمد",
    phone: "01011111111",
    email: "customer@carservices.sa",
    address: "جدة، حي الزهراء، شارع النخيل",
    avatar: "AM",
  },
  timeline: [
    { label: "تم إنشاء الطلب", time: "09:30 AM", tone: "info" },
    { label: "بانتظار الموافقة", time: "10:00 AM", tone: "warning" },
    { label: "تم القبول", time: "10:30 AM", tone: "success" },
    { label: "في الطريق", time: "11:00 AM", tone: "sky" },
    { label: "مكتمل", time: "14:30 PM", tone: "success" },
  ],
  attachments: {
    customerImages: [
      "/images/logo.png",
      "/images/logo.png",
      "/images/logo.png",
    ],
    providerImages: ["/images/logo.png", "/images/logo.png"],
    inspectionImages: [
      "/images/logo.png",
      "/images/logo.png",
      "/images/logo.png",
    ],
  },
  customerLocation: "جدة، حي الزهراء",
  providerLocation: "الرياض، شارع الملك فهد",
  distance: "18.4 كم",
  mapsLink: "https://maps.google.com/?q=Riyadh±King+Fahad+Street",
};

const tabsList = [
  { key: "customerImages", label: "صور العميل" },
  { key: "providerImages", label: "صور مقدم الخدمة" },
  { key: "inspectionImages", label: "صور التفتيش" },
];

function Field({ label, value, className = "", containerClassName = "" }) {
  return (
    <div
      className={`rounded-[18px] border border-[#f1e7e8] bg-[#fcf8f8] p-3.5 ${containerClassName}`}
    >
      <div className="text-[11px] font-bold text-[#9f8a8a]">{label}</div>
      <div
        className={`mt-1 text-sm font-bold leading-6 text-[#3d3434] ${className}`}
      >
        {value}
      </div>
    </div>
  );
}

function PersonCard({
  person,
  title,
  accent = "#75262d",
  showRating = true,
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-[22px] border border-[#f1e7e8] bg-[#fcfbfb] p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-extrabold text-white"
          style={{ backgroundColor: accent }}
        >
          {person?.avatar ?? "NA"}
        </div>

        <div>
          <div className="text-lg font-extrabold text-[#3d3434]">
            {person?.name}
          </div>
          <div className="mt-1 text-xs font-semibold text-[#8a7777]">
            {title}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {showRating && (
          <div className="flex items-center gap-2 text-sm text-[#3d3434]">
            <Star size={16} className="text-amber-500" />
            <span className="font-semibold">{person?.rating ?? "4.8"}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-[#3d3434]">
          <Phone size={16} className="text-[#75262d]" />
          <span className="font-semibold">{person?.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#3d3434] sm:col-span-2">
          <Mail size={16} className="text-[#75262d]" />
          <span className="font-semibold">{person?.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#3d3434] sm:col-span-2">
          <MapPinned size={16} className="text-[#75262d]" />
          <span className="font-semibold">{person?.address}</span>
        </div>
      </div>

      {actionLabel && (
        <div className="mt-4">
          <Button
            type="button"
            className="!w-auto h-10 rounded-lg px-5 text-sm"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

function UserProfileInlineView({ customerName, onBack }) {
  const user = useMemo(() => {
    const matchedUser = usersList.find((item) => item.name === customerName);
    return (
      matchedUser ??
      usersList.find((item) => item.role === "عميل") ??
      usersList[0]
    );
  }, [customerName]);

  const extras = useMemo(() => getUserProfileExtras(), []);
  const orders = useMemo(() => getUserOrders(user.name), [user.name]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-full bg-[#f8f1f2] px-3 py-2 text-sm font-extrabold text-[#75262d]"
        >
          <ArrowLeft size={16} />
          رجوع لتفاصيل الطلب
        </button>

        <div className="text-lg font-extrabold text-[#75262d]">
          ملف المستخدم
        </div>
      </div>

      <UserProfileCard
        name={user.name}
        phone={extras.phone}
        memberSince={extras.memberSince}
        status={extras.status}
      />

      <UserOrdersStats
        totalOrders={extras.totalOrders}
        cancelledOrders={extras.cancelledOrders}
        scheduledOrders={extras.scheduledOrders}
        completedOrders={extras.completedOrders}
      />

      <div className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
        <div className="mb-4 text-lg font-extrabold text-[#75262d]">
          الطلبات المرتبطة
        </div>
        <UserOrdersTable
          rows={orders.slice(0, 4)}
          totalCount={orders.length}
          currentPage={1}
          totalPages={1}
        />
      </div>

      <UserFinancialSummary
        totalExpenses={extras.financialSummary.totalExpenses}
        totalOrders={extras.financialSummary.totalOrders}
        commissions={extras.financialSummary.commissions}
        onViewReport={() => {}}
      />
    </div>
  );
}

function ProviderProfileInlineView({ customerName, providerName, onBack }) {
  const provider = useMemo(() => getProviderProfile(), []);
  const orders = useMemo(
    () => getProviderOrders([customerName]),
    [customerName],
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-full bg-[#f8f1f2] px-3 py-2 text-sm font-extrabold text-[#75262d]"
        >
          <ArrowLeft size={16} />
          رجوع لتفاصيل الطلب
        </button>

        <div className="text-lg font-extrabold text-[#75262d]">
          ملف مقدم الخدمة
        </div>
      </div>

      <ProviderInfoCard
        name={providerName}
        status={provider.status}
        memberSince={provider.memberSince}
        rating={provider.rating}
        reviewsCount={provider.reviewsCount}
        basicInfo={provider.basicInfo}
      />

      <ProviderQuickInfoRow
        mainService={provider.mainService}
        commercialRegisterNo={provider.commercialRegisterNo}
        providerType={provider.providerType}
      />

      <ProviderDetailsGrid
        galleryCount={provider.galleryCount}
        documents={provider.documents}
        services={provider.services}
        currentPackage={provider.currentPackage}
      />

      <ProviderOrdersStats
        cancelledOrders={provider.stats.cancelledOrders}
        completedOrders={provider.stats.completedOrders}
        totalOrders={provider.stats.totalOrders}
        scheduledOrders={provider.stats.scheduledOrders}
        activeOrders={provider.stats.activeOrders}
      />

      <div className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
        <div className="mb-4 text-lg font-extrabold text-[#75262d]">
          طلبات مقدم الخدمة
        </div>
        <ProviderOrdersTable
          rows={orders}
          totalCount={orders.length}
          currentPage={1}
          totalPages={1}
        />
      </div>

      <ProviderFinancialSummary
        totalRevenue={provider.financialSummary.totalRevenue}
        totalOrders={provider.financialSummary.totalOrders}
        commissions={provider.financialSummary.commissions}
        netProfit={provider.financialSummary.netProfit}
        onViewReport={() => {}}
      />

      <ProviderReviewsCard reviews={provider.reviews} onViewAll={() => {}} />
    </div>
  );
}

export default function OrderViewDialog({ open, onClose, order }) {
  const [activeTab, setActiveTab] = useState("customerImages");
  const [dialogView, setDialogView] = useState("order");

  useEffect(() => {
    if (open) {
      setDialogView("order");
    }
  }, [open]);

  const details = useMemo(() => {
    const price = order?.price ?? FALLBACK_ORDER.finalPrice;

    return {
      ...FALLBACK_ORDER,
      ...order,
      status: order?.status ?? FALLBACK_ORDER.status,
      orderNo: order?.orderNo ?? FALLBACK_ORDER.orderNo,
      serviceType: order?.service ?? FALLBACK_ORDER.serviceType,
      bookingType: order?.role ?? FALLBACK_ORDER.bookingType,
      createdDate: order?.date ?? FALLBACK_ORDER.createdDate,
      estimatedPrice: `${price} ر.س`,
      finalPrice: `${price} ر.س`,
      provider: {
        ...FALLBACK_ORDER.provider,
        name: order?.providerName ?? FALLBACK_ORDER.provider.name,
        phone: order?.providerPhone ?? FALLBACK_ORDER.provider.phone,
      },
      customer: {
        ...FALLBACK_ORDER.customer,
        name: order?.customerName ?? FALLBACK_ORDER.customer.name,
        phone: order?.customerPhone ?? FALLBACK_ORDER.customer.phone,
      },
    };
  }, [order]);

  const provider = details.provider ?? FALLBACK_ORDER.provider;
  const customer = details.customer ?? FALLBACK_ORDER.customer;
  const timeline = details.timeline ?? FALLBACK_ORDER.timeline;
  const attachments = details.attachments ?? FALLBACK_ORDER.attachments;

  const activeGallery = attachments?.[activeTab] ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        dialogView === "order"
          ? "تفاصيل الطلب"
          : dialogView === "user"
            ? "ملف المستخدم"
            : "ملف مقدم الخدمة"
      }
      maxWidth="max-w-[1200px]"
    >
      {dialogView === "user" ? (
        <UserProfileInlineView
          customerName={details.customer?.name}
          onBack={() => setDialogView("order")}
        />
      ) : dialogView === "provider" ? (
        <ProviderProfileInlineView
          customerName={details.customer?.name}
          providerName={details.provider?.name}
          onBack={() => setDialogView("order")}
        />
      ) : (
        <div className="space-y-5 text-right" dir="rtl">
          <section className="rounded-[24px] border border-[#f1e7e8] bg-[#f8f1f2] p-5 shadow-sm">
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <div className="text-[11px] font-extrabold text-[#9f8a8a]">
                  رقم الطلب
                </div>
                <div className="text-2xl font-extrabold text-[#75262d]">
                  {details.orderNo}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={ORDER_STATUS_TONE[details.status] ?? "neutral"}>
                  {details.status}
                </Badge>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#75262d] shadow-sm">
                  {details.serviceType}
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#3d3434] shadow-sm">
                  {details.bookingType}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="تاريخ الإنشاء" value={details.createdDate} />
              <Field label="تاريخ الموعد" value={details.scheduledDate} />
              <Field label="تاريخ الاكتمال" value={details.completedDate} />
              <Field label="نوع الخدمة" value={details.serviceType} />
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <PersonCard
              person={provider}
              title="بيانات مقدم الخدمة"
              accent="#75262d"
              showRating
              actionLabel="عرض ملف مقدم الخدمة"
              onAction={() => setDialogView("provider")}
            />
            <PersonCard
              person={customer}
              title="بيانات العميل"
              accent="#4c8f70"
              showRating={false}
              actionLabel="عرض ملف المستخدم"
              onAction={() => setDialogView("user")}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
              <div className="mb-4 text-lg font-extrabold text-[#75262d]">
                بيانات الطلب
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="تاريخ الإنشاء" value={details.createdDate} />
                <Field label="تاريخ الموعد" value={details.scheduledDate} />
                <Field label="تاريخ الاكتمال" value={details.completedDate} />
                <Field
                  label="الوصف"
                  value={details.description}
                  containerClassName="sm:col-span-2"
                />
                <Field
                  label="ملاحظات"
                  value={details.notes}
                  containerClassName="sm:col-span-2"
                />
              </div>
            </section>

            <section className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#75262d]">
                <CircleDollarSign size={18} />
                الدفع
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="نموذج التسعير" value={details.pricingModel} />
                <Field label="وقت الدفع" value={details.paymentTime} />
                <Field label="السعر المقدر" value={details.estimatedPrice} />
                <Field label="السعر النهائي" value={details.finalPrice} />
                <Field label="رسوم المنصة" value={details.platformFee} />
                <Field
                  label="مكاسب مقدم الخدمة"
                  value={details.providerEarnings}
                />
                <Field label="بوابة الدفع" value={details.paymentGateway} />
                <Field label="رقم المعاملة" value={details.transactionNumber} />
                <Field label="مبلغ الاسترداد" value={details.refundAmount} />
                <Field label="مبلغ المحفظة" value={details.walletAmount} />
              </div>
            </section>
          </div>

          <section className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
            <div className="mb-4 text-lg font-extrabold text-[#75262d]">
              المسار
            </div>

            <div className="relative space-y-4 pr-8">
              <div className="absolute right-[11px] top-2 h-[calc(100%-1rem)] w-[2px] bg-[#eed9dc]" />

              {timeline.map((item, index) => (
                <div key={`${item.label}-${index}`} className="relative">
                  <span
                    className="absolute -right-8 top-1 h-6 w-6 rounded-full border-4 border-white"
                    style={{
                      backgroundColor:
                        item.tone === "success"
                          ? "#22c55e"
                          : item.tone === "warning"
                            ? "#f59e0b"
                            : item.tone === "sky"
                              ? "#38bdf8"
                              : item.tone === "info"
                                ? "#3b82f6"
                                : "#75262d",
                    }}
                  />

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-extrabold text-[#3d3434]">
                      {item.label}
                    </div>
                    <div className="text-xs font-bold text-[#8a7777]">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
            <div className="mb-4 text-lg font-extrabold text-[#75262d]">
              المرفقات
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {tabsList.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${
                    activeTab === tab.key
                      ? "bg-[#75262d] text-white"
                      : "bg-[#f8f1f2] text-[#75262d]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeGallery.map((src, index) => (
                <div
                  key={`${activeTab}-${index}`}
                  className="overflow-hidden rounded-[18px] border border-[#f1e7e8] bg-[#fbf7f7]"
                >
                  <img
                    src={src}
                    alt={`${activeTab}-${index}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ))}

              {activeGallery.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#e7d2d4] bg-[#fbf7f7] p-8 text-center text-sm font-bold text-[#8a7777]">
                  لا توجد صور لهذا القسم.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
            <div className="mb-4 text-lg font-extrabold text-[#75262d]">
              الخريطة
            </div>

            <div className="relative h-56 overflow-hidden rounded-[22px] border border-[#efe2e4] bg-gradient-to-br from-[#f5eaeb] via-[#f8f0f2] to-[#f4f2f2] p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(117,38,45,0.14),_transparent_55%)]" />
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(117,38,45,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(117,38,45,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
              <div className="relative flex h-full items-center justify-center">
                <div className="text-center">
                  <MapPinned size={28} className="mx-auto text-[#75262d]" />
                  <div className="mt-2 text-sm font-extrabold text-[#75262d]">
                    خريطة مؤقتة
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[#8a7777]">
                    مسار الموقع وموعد الاستلام
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="موقع العميل" value={details.customerLocation} />
              <Field
                label="موقع مقدم الخدمة"
                value={details.providerLocation}
              />
              <Field label="المسافة" value={details.distance} />
              <Field
                label="رابط خرائط جوجل"
                value={
                  <a
                    href={details.mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#75262d] underline"
                  >
                    افتح في خرائط جوجل
                  </a>
                }
                className="break-all"
              />
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="!w-auto h-11 rounded-lg px-8 text-sm"
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
