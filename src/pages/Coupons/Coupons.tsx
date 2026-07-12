import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import CouponsCharts from "../../components/coupons/CouponsCharts";
import CouponsHeader from "../../components/coupons/CouponsHeader";
import CouponsTable, { type Coupon } from "../../components/coupons/CouponsTable";
import StatsGrid from "../../components/dashboard/StatsGrid";
import FiltersBar from "../../components/ui/FiltersBar";
import {
  couponDiscountDistribution,
  couponDiscountTypeOptions,
  couponsStats,
  couponStatusOptions,
  couponUsageData,
  initialCoupons,
} from "../../data/coupons.data";

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [discountType, setDiscountType] = useState("");

  const filteredCoupons = useMemo(
    () =>
      coupons.filter((coupon) => {
        const normalizedSearch = search.trim().toLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          coupon.code.toLowerCase().includes(normalizedSearch) ||
          coupon.description.toLowerCase().includes(normalizedSearch);
        const matchesStatus = !status || coupon.status === status;
        const matchesDiscountType = !discountType || coupon.discountType === discountType;
        return matchesSearch && matchesStatus && matchesDiscountType;
      }),
    [coupons, discountType, search, status],
  );

  const handleDelete = (coupon: Coupon) => {
    setCoupons((current) => current.filter((item) => item.id !== coupon.id));
    toast.success("تم حذف الكوبون بنجاح");
  };

  return (
    <section>
      <CouponsHeader onAdd={() => toast("سيتم فتح نموذج إضافة الكوبون")} />

      <div className="mb-7">
        <StatsGrid stats={couponsStats} />
      </div>

      <CouponsCharts distribution={couponDiscountDistribution} usage={couponUsageData} />

      <FiltersBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "ابحث باسم الكوبون أو الوصف",
        }}
        fields={[
          {
            key: "discountType",
            type: "select",
            value: discountType,
            onChange: setDiscountType,
            placeholder: "نوع الخصم",
            options: couponDiscountTypeOptions,
          },
          {
            key: "status",
            type: "select",
            value: status,
            onChange: setStatus,
            placeholder: "كل الحالات",
            options: couponStatusOptions,
          },
        ]}
      />

      <CouponsTable
        rows={filteredCoupons}
        onView={() => toast("عرض تفاصيل الكوبون")}
        onEdit={() => toast("تعديل بيانات الكوبون")}
        onDelete={handleDelete}
      />
    </section>
  );
}
