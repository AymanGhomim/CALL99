import Badge from "../ui/Badge";

export default function ProviderPackageCard({ pkg }) {
  return (
    <div className="rounded-xl border border-[#f2e8e8] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-right text-base font-extrabold text-[#221b1b]">الباقة الحالية</h3>

      <div className="mb-4 rounded-lg bg-[#fbf1f1] py-3 text-center text-base font-extrabold text-[#75262d]">
        {pkg.name}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between border-b border-[#f2e8e8] pb-2.5">
          <span className="font-bold text-[#221b1b]">{pkg.price}</span>
          <span className="text-gray-500">السعر</span>
        </div>
        <div className="flex items-center justify-between border-b border-[#f2e8e8] pb-2.5">
          <span className="font-bold text-[#221b1b]">{pkg.startDate}</span>
          <span className="text-gray-500">تاريخ البداية</span>
        </div>
        <div className="flex items-center justify-between border-b border-[#f2e8e8] pb-2.5">
          <span className="font-bold text-[#221b1b]">{pkg.endDate}</span>
          <span className="text-gray-500">تاريخ الانتهاء</span>
        </div>
        <div className="flex items-center justify-between">
          <Badge tone="success" size="sm">
            {pkg.status}
          </Badge>
          <span className="text-gray-500">الحالة</span>
        </div>
      </div>
    </div>
  );
}
