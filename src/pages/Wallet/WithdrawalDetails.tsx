import { useState, type FormEvent } from "react";
import { ArrowLeft, Check, Clock3, UploadCloud, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import { getWithdrawalDetails } from "../../data/withdrawalDetails.data";

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="text-right">
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className="mt-1 font-semibold text-[#3d3434]">{value}</p>
    </div>
  );
}

const cardClass = "rounded-2xl border border-[#f2e8e8] bg-white p-6 shadow-sm";

export default function WithdrawalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const details = getWithdrawalDetails(Number(id));
  const [status, setStatus] = useState(details.status);
  const [transactionId, setTransactionId] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [notes, setNotes] = useState("");
  const [proofName, setProofName] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const submitTransfer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!transactionId || !transferDate || !proofName) {
      toast.error("أكمل بيانات التحويل وارفع إثبات العملية");
      return;
    }
    setStatus("تمت الموافقة");
    toast.success("تم تنفيذ التحويل بنجاح");
  };

  const rejectRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error("أدخل سبب رفض الطلب");
      return;
    }
    setStatus("مرفوض");
    toast.success("تم رفض طلب السحب");
  };

  return (
    <section className="pb-8">
      <header className="mb-7 flex flex-wrap-reverse items-start justify-between gap-4">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-xl border border-[#e7dede] bg-white px-4 py-2.5 text-sm font-bold text-gray-500 transition hover:bg-[#fbf7f7]">
          <ArrowLeft size={16} /> رجوع
        </button>
        <div className="text-right">
          <div className="mb-2 flex items-center justify-end gap-2 text-xs text-gray-400">
            <span className="font-bold text-[#75262d]">تفاصيل الطلب</span><span>/</span>
            <Link to="/wallet/withdrawals" className="hover:text-[#75262d]">طلبات سحب الرصيد</Link><span>/</span>
            <Link to="/wallet" className="hover:text-[#75262d]">الإدارة المالية</Link>
          </div>
          <h1 className="text-3xl font-extrabold text-[#75262d]">تفاصيل طلب سحب رصيد</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">عرض تفاصيل طلب السحب ومراجعة البيانات قبل تنفيذ التحويل</p>
        </div>
      </header>

      <div className={`${cardClass} mb-6`}>
        <h2 className="mb-6 text-right text-xl font-extrabold">بيانات الطلب</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="رقم الطلب" value={details.requestNo} />
          <DetailItem label="تاريخ الطلب" value={details.requestedAt} />
          <div className="text-right"><p className="text-xs text-gray-400">حالة الطلب</p><div className="mt-2"><Badge tone={status === "مرفوض" ? "danger" : status === "تمت الموافقة" ? "success" : "info"}>{status}</Badge></div></div>
          <DetailItem label="المبلغ المطلوب" value={details.amount} />
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="mb-6 text-right text-xl font-extrabold">بيانات مقدم الخدمة</h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="رقم مقدم الخدمة" value={details.provider.id} />
          <DetailItem label="الاسم" value={details.provider.name} />
          <DetailItem label="رقم الجوال" value={details.provider.phone} />
          <DetailItem label="البريد الإلكتروني" value={details.provider.email} />
          <DetailItem label="البنك" value={details.provider.bank} />
          <DetailItem label="اسم صاحب الحساب" value={details.provider.accountName} />
          <div className="sm:col-span-2"><DetailItem label="رقم الآيبان" value={details.provider.iban} /></div>
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="mb-5 text-right text-xl font-extrabold">ملخص المستحقات</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["إجمالي الأرباح", details.summary.totalProfit, "bg-emerald-50"],
            ["إجمالي المسحوبات", details.summary.totalWithdrawals, "bg-blue-50"],
            ["الرصيد المتبقي", details.summary.remainingBalance, "bg-violet-50"],
            ["المبلغ المطلوب", details.summary.requestedAmount, "bg-amber-50"],
          ].map(([label, value, color]) => <div key={label} className={`rounded-xl p-4 text-right ${color}`}><p className="text-xs text-gray-500">{label}</p><p className="mt-1 text-lg font-extrabold">{value}</p></div>)}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form onSubmit={submitTransfer} className={cardClass}>
          <h2 className="mb-2 flex items-center justify-end gap-2 text-xl font-extrabold"><span>تنفيذ التحويل</span><Check className="text-emerald-600" /></h2>
          <p className="mb-5 text-right text-sm text-gray-400">أدخل بيانات التحويل بعد إتمام العملية</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-right text-sm font-semibold">رقم التحويل *<input value={transactionId} onChange={(event) => setTransactionId(event.target.value)} placeholder="أدخل رقم التحويل البنكي" className="mt-2 h-12 w-full rounded-xl border border-[#e7dede] px-4 outline-none focus:border-[#75262d]" /></label>
            <label className="text-right text-sm font-semibold">تاريخ التحويل *<input type="date" value={transferDate} onChange={(event) => setTransferDate(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#e7dede] px-4 outline-none focus:border-[#75262d]" /></label>
          </div>
          <label className="mt-4 block cursor-pointer rounded-xl border-2 border-dashed border-[#eadfdf] bg-[#fcfafa] p-7 text-center text-sm text-gray-400">
            <UploadCloud className="mx-auto mb-2" />{proofName || "اختر صورة أو اسحب وأفلت إثبات التحويل"}
            <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => setProofName(event.target.files?.[0]?.name ?? "")} />
          </label>
          <label className="mt-4 block text-right text-sm font-semibold">ملاحظات (اختياري)<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 h-24 w-full resize-none rounded-xl border border-[#e7dede] p-4 outline-none focus:border-[#75262d]" /></label>
          <button className="mt-4 h-12 w-full rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700">تم التحويل</button>
        </form>

        <form onSubmit={rejectRequest} className={`${cardClass} flex flex-col`}>
          <h2 className="mb-2 flex items-center justify-end gap-2 text-xl font-extrabold"><span>رفض الطلب</span><X className="text-red-500" /></h2>
          <p className="mb-5 text-right text-sm text-gray-400">سيتم رفض الطلب وإشعار مقدم الخدمة</p>
          <label className="block flex-1 text-right text-sm font-semibold">سبب الرفض *<textarea value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="أدخل سبب رفض الطلب..." className="mt-2 h-44 w-full resize-none rounded-xl border border-[#e7dede] p-4 outline-none focus:border-red-400" /></label>
          <button className="mt-auto h-12 w-full rounded-xl bg-red-500 font-bold text-white hover:bg-red-600">رفض الطلب</button>
        </form>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="mb-7 flex items-center justify-end gap-2 text-xl font-extrabold">سجل الطلب <Clock3 size={20} /></h2>
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          {["تم الإنشاء", "قيد المراجعة", "تم تنفيذ التحويل", "تمت الموافقة"].map((step, index) => (
            <div key={step} className={index <= 1 ? "font-bold text-blue-600" : "font-semibold text-gray-400"}><span className={`mx-auto mb-2 block h-3 w-3 rounded-full ${index <= 1 ? "bg-blue-500" : "bg-gray-200"}`} />{step}</div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-sm font-medium text-amber-700">
        <strong className="block">⚠️ ملاحظة مهمة</strong> تأكد من صحة بيانات التحويل قبل تأكيد العملية، ولا يمكن التراجع بعد التأكيد.
      </div>
    </section>
  );
}
