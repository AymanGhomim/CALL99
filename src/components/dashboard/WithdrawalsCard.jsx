export default function WithdrawalsCard() {
  return (
    <div className="rounded-xl bg-[#75262d] p-8 text-white shadow-sm">
      <h3 className="text-2xl font-extrabold">إجمالي المسحوبات المعلقة</h3>
      <p className="mt-2 text-sm text-white/75">
        يوجد حالياً 8 طلبات سحب في انتظار المراجعة المالية
      </p>

      <div className="mt-8 flex flex-col items-start gap-4 rounded-xl bg-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-left">
          <p className="text-xs text-white/70">المبلغ الكلي</p>
          <p className="text-2xl font-extrabold">12,540.00 ر.س</p>
        </div>
        <button className="w-full rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#75262d] lg:w-auto">
          مراجعة الطلبات
        </button>
      </div>
    </div>
  );
}
