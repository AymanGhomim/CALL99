import Badge from "../ui/Badge";
import { PROVIDER_SERVICE_STATUS_TONE } from "../../constants/statusTones";

export default function ProviderServicesCard({ services }) {
  return (
    <div className="rounded-xl border border-[#f2e8e8] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-right text-base font-extrabold text-[#221b1b]">الخدمات</h3>

      <table className="w-full text-right text-xs">
        <thead>
          <tr className="text-gray-400">
            <th className="pb-2 font-semibold">الخدمة</th>
            <th className="pb-2 font-semibold">السعر</th>
            <th className="pb-2 font-semibold">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.name} className="border-t border-[#f2e8e8]">
              <td className="py-2.5 font-bold text-[#221b1b]">{service.name}</td>
              <td className="py-2.5 text-gray-500">{service.price}</td>
              <td className="py-2.5">
                <Badge tone={PROVIDER_SERVICE_STATUS_TONE[service.status] ?? "neutral"} size="sm">
                  {service.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
