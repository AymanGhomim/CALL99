import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import type { OrderRecord, ProviderOrder, UserOrder } from "../../types/entities";
import { downloadReport } from "../../utils/download";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";
import { translateStatus, translateValue } from "../../i18n/translateEnum";

interface OrderPerson {
  name: string;
  phone: string;
  email: string;
  address: string;
  avatar: string;
  rating?: number;
}

type AttachmentKey = "customerImages" | "providerImages" | "inspectionImages";
type DialogView = "order" | "user" | "provider";

interface OrderDetails {
  orderNo: string;
  status: string;
  serviceType: string;
  bookingType: string;
  createdDate: string;
  scheduledDate: string;
  completedDate: string;
  description: string;
  notes: string;
  pricingModel: string;
  paymentTime: string;
  estimatedPrice: string;
  finalPrice: string;
  platformFee: string;
  providerEarnings: string;
  paymentGateway: string;
  transactionNumber: string;
  refundAmount: string;
  walletAmount: string;
  provider: OrderPerson;
  customer: OrderPerson;
  timeline: Array<{ label: string; time: string; tone: string }>;
  attachments: Record<AttachmentKey, string[]>;
  customerLocation: string;
  providerLocation: string;
  distance: string;
  mapsLink: string;
}

const FALLBACK_ORDER: OrderDetails = {
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

const tabsList: Array<{ key: AttachmentKey; labelKey: string }> = [
  { key: "customerImages", labelKey: "orderDetails.customerImages" },
  { key: "providerImages", labelKey: "orderDetails.providerImages" },
  { key: "inspectionImages", labelKey: "orderDetails.inspectionImages" },
];

interface FieldProps {
  label: string;
  value: ReactNode;
  className?: string;
  containerClassName?: string;
}

function Field({ label, value, className = "", containerClassName = "" }: FieldProps) {
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
}: {
  person: OrderPerson;
  title: string;
  accent?: string;
  showRating?: boolean;
  actionLabel?: string;
  onAction?: () => void;
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

function UserProfileInlineView({ customerName, onBack, onOrderView }: { customerName: string; onBack: () => void; onOrderView: (order: OrderRecord) => void }) {
  const { t } = useTranslation();
  const user = useMemo(() => {
    const matchedUser = usersList.find((item) => item.name === customerName);
    return (
      matchedUser ??
      usersList.find((item) => item.role === "عميل") ??
      usersList[0]!
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
          {t("orderDetails.back")}
        </button>

        <div className="text-lg font-extrabold text-[#75262d]">
          {t("modules.profile.title")}
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
          {t("orderDetails.linkedOrders")}
        </div>
        <UserOrdersTable
          rows={orders.slice(0, 4)}
          totalCount={orders.length}
          currentPage={1}
          totalPages={1}
          onView={(order: UserOrder) => onOrderView({
            id: order.id,
            orderNo: order.orderNo,
            customerName: user.name,
            providerName: order.provider,
            customerPhone: extras.phone,
            providerPhone: t("orderDetails.unknown"),
            service: order.service,
            role: "عميل",
            status: order.status,
            price: Number.parseFloat(order.price.replace(/[^\d.]/g, "")) || 0,
            date: order.date,
          })}
        />
      </div>

      <UserFinancialSummary
        totalExpenses={extras.financialSummary.totalExpenses}
        totalOrders={extras.financialSummary.totalOrders}
        commissions={extras.financialSummary.commissions}
        onViewReport={() => downloadReport(`user-${user.id}-report.txt`, [
          [t("tables.userName"), user.name],
          [t("common.totalExpenses"), extras.financialSummary.totalExpenses],
          [t("stats.totalOrders"), extras.financialSummary.totalOrders],
          [t("provider.commissions"), extras.financialSummary.commissions],
        ])}
      />
    </div>
  );
}

function ProviderProfileInlineView({ customerName, providerName, onBack, onOrderView }: { customerName: string; providerName: string; onBack: () => void; onOrderView: (order: OrderRecord) => void }) {
  const { t } = useTranslation();
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
          {t("orderDetails.back")}
        </button>

        <div className="text-lg font-extrabold text-[#75262d]">
          {t("modules.providerProfile.title")}
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
          {t("orderDetails.providerOrders")}
        </div>
        <ProviderOrdersTable
          rows={orders}
          totalCount={orders.length}
          currentPage={1}
          totalPages={1}
          onView={(order: ProviderOrder) => onOrderView({
            id: order.id,
            orderNo: order.orderNo,
            customerName: order.customer,
            providerName,
            customerPhone: t("orderDetails.unknown"), providerPhone: t("orderDetails.unknown"),
            service: order.service,
            role: "مقدم خدمة",
            status: order.status,
            price: Number.parseFloat(order.price.replace(/[^\d.]/g, "")) || 0,
            date: order.date,
          })}
        />
      </div>

      <ProviderFinancialSummary
        totalRevenue={provider.financialSummary.totalRevenue}
        totalOrders={provider.financialSummary.totalOrders}
        commissions={provider.financialSummary.commissions}
        netProfit={provider.financialSummary.netProfit}
        onViewReport={() => downloadReport("provider-financial-report.txt", [
          [t("orders.provider"), providerName],
          [t("provider.totalRevenue"), provider.financialSummary.totalRevenue],
          [t("stats.totalOrders"), provider.financialSummary.totalOrders],
          [t("provider.commissions"), provider.financialSummary.commissions],
          [t("provider.netProfit"), provider.financialSummary.netProfit],
        ])}
      />

      <ProviderReviewsCard reviews={provider.reviews} />
    </div>
  );
}

interface OrderViewDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrderRecord | null;
}

export default function OrderViewDialog({ open, onClose, order }: OrderViewDialogProps) {
  const { t } = useTranslation();
  const { direction, formatCurrency } = useLocale();
  const [activeTab, setActiveTab] = useState<AttachmentKey>("customerImages");
  const [dialogView, setDialogView] = useState<DialogView>("order");
  const [relatedOrder, setRelatedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (open) {
      setDialogView("order");
      setRelatedOrder(null);
    }
  }, [open]);

  const details = useMemo<OrderDetails>(() => {
    const activeOrder = relatedOrder ?? order;
    const price = activeOrder?.price ?? FALLBACK_ORDER.finalPrice;

    return {
      ...FALLBACK_ORDER,
      status: activeOrder?.status ?? FALLBACK_ORDER.status,
      orderNo: activeOrder?.orderNo ?? FALLBACK_ORDER.orderNo,
      serviceType: activeOrder?.service ?? FALLBACK_ORDER.serviceType,
      bookingType: activeOrder?.role ?? FALLBACK_ORDER.bookingType,
      createdDate: activeOrder?.date ?? FALLBACK_ORDER.createdDate,
      estimatedPrice: formatCurrency(price),
      finalPrice: formatCurrency(price),
      platformFee: formatCurrency(15), providerEarnings: formatCurrency(135),
      refundAmount: formatCurrency(0), walletAmount: formatCurrency(0),
      provider: {
        ...FALLBACK_ORDER.provider,
        name: activeOrder?.providerName ?? t("orderDetails.fallbackProviderName"),
        phone: activeOrder?.providerPhone ?? FALLBACK_ORDER.provider.phone,
        address: t("orderDetails.fallbackProviderAddress"),
      },
      customer: {
        ...FALLBACK_ORDER.customer,
        name: activeOrder?.customerName ?? t("orderDetails.fallbackCustomerName"),
        phone: activeOrder?.customerPhone ?? FALLBACK_ORDER.customer.phone,
        address: t("orderDetails.fallbackCustomerAddress"),
      },
      customerLocation: t("orderDetails.fallbackCustomerLocation"),
      providerLocation: t("orderDetails.fallbackProviderLocation"),
      distance: t("orderDetails.fallbackDistance"),
    };
  }, [formatCurrency, order, relatedOrder, t]);

  const openRelatedOrder = (nextOrder: OrderRecord) => {
    setRelatedOrder(nextOrder);
    setDialogView("order");
  };

  const provider = details.provider;
  const customer = details.customer;
  const timeline = details.timeline;
  const attachments = details.attachments;

  const activeGallery = attachments[activeTab];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        dialogView === "order"
          ? t("orderDetails.title")
          : dialogView === "user"
            ? t("modules.profile.title")
            : t("modules.providerProfile.title")
      }
      maxWidth="max-w-[1200px]"
    >
      {dialogView === "user" ? (
        <UserProfileInlineView
          customerName={details.customer.name}
          onBack={() => setDialogView("order")}
          onOrderView={openRelatedOrder}
        />
      ) : dialogView === "provider" ? (
        <ProviderProfileInlineView
          customerName={details.customer.name}
          providerName={details.provider.name}
          onBack={() => setDialogView("order")}
          onOrderView={openRelatedOrder}
        />
      ) : (
        <div className="space-y-5 text-start" dir={direction}>
          <section className="rounded-[24px] border border-[#f1e7e8] bg-[#f8f1f2] p-5 shadow-sm">
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <div className="text-[11px] font-extrabold text-[#9f8a8a]">
                  {t("orders.orderNumber")}
                </div>
                <div className="text-2xl font-extrabold text-[#75262d]">
                  {details.orderNo}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={ORDER_STATUS_TONE[details.status] ?? "neutral"}>
                  {translateStatus(details.status, t)}
                </Badge>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#75262d] shadow-sm">
                  {translateValue(details.serviceType, t)}
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#3d3434] shadow-sm">
                  {translateValue(details.bookingType, t)}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={t("orderDetails.createdDate")} value={details.createdDate} />
              <Field label={t("orderDetails.scheduledDate")} value={details.scheduledDate} />
              <Field label={t("orderDetails.completedDate")} value={details.completedDate} />
              <Field label={t("orderDetails.serviceType")} value={translateValue(details.serviceType, t)} />
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <PersonCard
              person={provider}
              title={t("orderDetails.providerData")}
              accent="#75262d"
              showRating
              actionLabel={t("orderDetails.viewProvider")}
              onAction={() => setDialogView("provider")}
            />
            <PersonCard
              person={customer}
              title={t("orderDetails.customerData")}
              accent="#4c8f70"
              showRating={false}
              actionLabel={t("orderDetails.viewUser")}
              onAction={() => setDialogView("user")}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
              <div className="mb-4 text-lg font-extrabold text-[#75262d]">
                {t("orderDetails.orderData")}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("orderDetails.createdDate")} value={details.createdDate} />
                <Field label={t("orderDetails.scheduledDate")} value={details.scheduledDate} />
                <Field label={t("orderDetails.completedDate")} value={details.completedDate} />
                <Field
                  label={t("orderDetails.description")}
                  value={details.description === FALLBACK_ORDER.description ? t("orderDetails.fallbackDescription") : details.description}
                  containerClassName="sm:col-span-2"
                />
                <Field
                  label={t("orderDetails.notes")}
                  value={details.notes === FALLBACK_ORDER.notes ? t("orderDetails.fallbackNotes") : details.notes}
                  containerClassName="sm:col-span-2"
                />
              </div>
            </section>

            <section className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#75262d]">
                <CircleDollarSign size={18} />
                {t("orderDetails.payment")}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("orderDetails.pricingModel")} value={details.pricingModel === FALLBACK_ORDER.pricingModel ? t("orderDetails.fixedPrice") : details.pricingModel} />
                <Field label={t("orderDetails.paymentTime")} value={translateValue(details.paymentTime, t)} />
                <Field label={t("orderDetails.estimatedPrice")} value={details.estimatedPrice} />
                <Field label={t("orderDetails.finalPrice")} value={details.finalPrice} />
                <Field label={t("orderDetails.platformFee")} value={details.platformFee} />
                <Field
                  label={t("orderDetails.providerEarnings")}
                  value={details.providerEarnings}
                />
                <Field label={t("orderDetails.paymentGateway")} value={translateValue(details.paymentGateway, t)} />
                <Field label={t("finance.transactionNumber")} value={details.transactionNumber} />
                <Field label={t("orderDetails.refundAmount")} value={details.refundAmount} />
                <Field label={t("orderDetails.walletAmount")} value={details.walletAmount} />
              </div>
            </section>
          </div>

          <section className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
            <div className="mb-4 text-lg font-extrabold text-[#75262d]">
              {t("orderDetails.timeline")}
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
                      {translateStatus(item.label, t)}
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
              {t("orderDetails.attachments")}
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
                  {t(tab.labelKey)}
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
                  {t("orderDetails.noImages")}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#f1e7e8] bg-white p-5 shadow-sm">
            <div className="mb-4 text-lg font-extrabold text-[#75262d]">
              {t("orderDetails.map")}
            </div>

            <div className="relative h-56 overflow-hidden rounded-[22px] border border-[#efe2e4] bg-gradient-to-br from-[#f5eaeb] via-[#f8f0f2] to-[#f4f2f2] p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(117,38,45,0.14),_transparent_55%)]" />
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(117,38,45,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(117,38,45,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
              <div className="relative flex h-full items-center justify-center">
                <div className="text-center">
                  <MapPinned size={28} className="mx-auto text-[#75262d]" />
                  <div className="mt-2 text-sm font-extrabold text-[#75262d]">
                    {t("orderDetails.temporaryMap")}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[#8a7777]">
                    {t("orderDetails.routeHint")}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={t("orderDetails.customerLocation")} value={details.customerLocation} />
              <Field
                label={t("orderDetails.providerLocation")}
                value={details.providerLocation}
              />
              <Field label={t("orderDetails.distance")} value={details.distance} />
              <Field
                label={t("orderDetails.googleMaps")}
                value={
                  <a
                    href={details.mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#75262d] underline"
                  >
                    {t("orderDetails.openMaps")}
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
              {t("common.close")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
