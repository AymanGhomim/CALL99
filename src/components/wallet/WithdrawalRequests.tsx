import Badge from "../ui/Badge";
import { Link } from "react-router-dom";

interface WithdrawalRequest {
  id: number;
  provider: string;
  reference: string;
  date: string;
  amount: string;
  status: string;
}

const tones = { "قيد الانتظار": "warning", "تم القبول": "success", "مرفوض": "danger" } as const;

export default function WithdrawalRequests({ requests }: { requests: WithdrawalRequest[] }) {
  return (
    <section className="mt-7 overflow-hidden rounded-xl border border-[#f2e8e8] bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-xl font-extrabold text-[#75262d]">السحوبات</h2>
        <Badge tone="danger">8 طلبات معلقة</Badge>
      </div>
      <h3 className="bg-[#75262d] px-6 py-4 text-right text-lg font-bold text-white">طلبات سحب الرصيد</h3>
      <div>
        {requests.map((request) => (
          <article key={request.id} className="flex items-center justify-between gap-5 border-b border-[#f2e8e8] px-6 py-5 last:border-b-0">
            <div className="text-right">
              <h4 className="font-extrabold text-[#75262d]">{request.provider}</h4>
              <p className="mt-1 text-xs text-gray-400">{request.reference} | {request.date}</p>
            </div>
            <div className="shrink-0 text-left">
              <p className="font-bold text-[#75262d]">{request.amount}</p>
              <Badge tone={tones[request.status as keyof typeof tones] ?? "neutral"} size="sm">{request.status}</Badge>
            </div>
          </article>
        ))}
      </div>
      <Link to="/wallet/withdrawals" className="block w-full bg-[#75262d] py-4 text-center text-sm font-bold text-white transition hover:bg-[#642326]">مشاهدة جميع الطلبات</Link>
    </section>
  );
}
