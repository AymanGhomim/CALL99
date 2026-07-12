import { Link } from "react-router-dom";

export default function WithdrawalsHeader() {
  return (
    <header className="mb-7 text-right">
      <div className="mb-3 flex items-center justify-end gap-2 text-sm font-medium text-gray-400">
        <span className="font-bold text-[#75262d]">طلبات سحب الرصيد</span>
        <span>/</span>
        <Link to="/wallet" className="transition hover:text-[#75262d]">الإدارة المالية</Link>
      </div>
      <h1 className="text-3xl font-extrabold text-[#75262d]">طلبات سحب الرصيد</h1>
      <p className="mt-1 text-sm font-medium text-gray-500">
        عرض وإدارة جميع طلبات سحب الرصيد المقدمة من مقدمي الخدمات
      </p>
    </header>
  );
}
