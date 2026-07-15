import { useState, type FormEvent } from "react";
import { ArrowLeft, Check, Clock3, UploadCloud, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { translateStatus } from "../../i18n/translateEnum";
import Badge from "../../components/ui/Badge";
import { getWithdrawalDetails } from "../../data/withdrawalDetails.data";
import useLocale from "../../i18n/useLocale";

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
  const { t } = useTranslation();
  const { formatCurrency } = useLocale();
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
      toast.error(t("withdrawalDetails.completeFields"));
      return;
    }
    setStatus("تمت الموافقة");
    toast.success(t("withdrawalDetails.transferSuccess"));
  };

  const rejectRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error(t("withdrawalDetails.enterReason"));
      return;
    }
    setStatus("مرفوض");
    toast.success(t("withdrawalDetails.rejectSuccess"));
  };

  return (
    <section className="pb-8">
      <header className="mb-7 flex flex-wrap-reverse items-start justify-between gap-4">
        <div className="text-right">
          <div className="mb-2 flex items-center justify-end gap-2 text-xs text-gray-400">
            <span className="font-bold text-[#75262d]">{t("withdrawalDetails.requestDetails")}</span><span>/</span>
            <Link to="/wallet/withdrawals" className="hover:text-[#75262d]">{t("modules.withdrawals.title")}</Link><span>/</span>
            <Link to="/wallet" className="hover:text-[#75262d]">{t("modules.wallet.title")}</Link>
          </div>
          <h1 className="text-3xl font-extrabold text-[#75262d]">{t("withdrawalDetails.title")}</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">{t("withdrawalDetails.subtitle")}</p>
        </div>
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-xl border border-[#e7dede] bg-white px-4 py-2.5 text-sm font-bold text-gray-500 transition hover:bg-[#fbf7f7]">
          <ArrowLeft size={16} /> {t("common.back")}
        </button>
      </header>

      <div className={`${cardClass} mb-6`}>
        <h2 className="mb-6 text-start text-xl font-extrabold">{t("withdrawalDetails.requestDetails")}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label={t("tables.orderNumber")} value={details.requestNo} />
          <DetailItem label={t("withdrawalDetails.requestDate")} value={details.requestedAt} />
          <div className="text-start"><p className="text-xs text-gray-400">{t("withdrawalDetails.requestStatus")}</p><div className="mt-2"><Badge tone={status === "مرفوض" ? "danger" : status === "تمت الموافقة" ? "success" : "info"}>{translateStatus(status, t)}</Badge></div></div>
          <DetailItem label={t("withdrawalDetails.requestedAmount")} value={formatCurrency(details.amount)} />
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="mb-6 text-start text-xl font-extrabold">{t("withdrawalDetails.providerData")}</h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label={t("withdrawalDetails.providerNumber")} value={details.provider.id} />
          <DetailItem label={t("common.name")} value={details.provider.name} />
          <DetailItem label={t("withdrawalDetails.mobile")} value={details.provider.phone} />
          <DetailItem label={t("common.email")} value={details.provider.email} />
          <DetailItem label={t("withdrawalDetails.bank")} value={details.provider.bank} />
          <DetailItem label={t("withdrawalDetails.accountName")} value={details.provider.accountName} />
          <div className="sm:col-span-2"><DetailItem label={t("withdrawalDetails.iban")} value={details.provider.iban} /></div>
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="mb-5 text-start text-xl font-extrabold">{t("withdrawalDetails.duesSummary")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [t("withdrawalDetails.totalProfit"), formatCurrency(details.summary.totalProfit), "bg-emerald-50"],
            [t("withdrawalDetails.totalWithdrawals"), formatCurrency(details.summary.totalWithdrawals), "bg-blue-50"],
            [t("withdrawalDetails.remainingBalance"), formatCurrency(details.summary.remainingBalance), "bg-violet-50"],
            [t("withdrawalDetails.requestedAmount"), formatCurrency(details.summary.requestedAmount), "bg-amber-50"],
          ].map(([label, value, color]) => <div key={label} className={`rounded-xl p-4 text-right ${color}`}><p className="text-xs text-gray-500">{label}</p><p className="mt-1 text-lg font-extrabold">{value}</p></div>)}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form onSubmit={submitTransfer} className={cardClass}>
          <h2 className="mb-2 flex items-center justify-start gap-2 text-xl font-extrabold"><span>{t("withdrawalDetails.executeTransfer")}</span><Check className="text-emerald-600" /></h2>
          <p className="mb-5 text-start text-sm text-gray-400">{t("withdrawalDetails.transferHint")}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-start text-sm font-semibold">{t("withdrawalDetails.transferNumber")} *<input value={transactionId} onChange={(event) => setTransactionId(event.target.value)} placeholder={t("withdrawalDetails.transferNumberPlaceholder")} className="mt-2 h-12 w-full rounded-xl border border-[#e7dede] px-4 outline-none focus:border-[#75262d]" /></label>
            <label className="text-start text-sm font-semibold">{t("withdrawalDetails.transferDate")} *<input type="date" value={transferDate} onChange={(event) => setTransferDate(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#e7dede] px-4 outline-none focus:border-[#75262d]" /></label>
          </div>
          <label className="mt-4 block cursor-pointer rounded-xl border-2 border-dashed border-[#eadfdf] bg-[#fcfafa] p-7 text-center text-sm text-gray-400">
            <UploadCloud className="mx-auto mb-2" />{proofName || t("withdrawalDetails.uploadProof")}
            <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => setProofName(event.target.files?.[0]?.name ?? "")} />
          </label>
          <label className="mt-4 block text-start text-sm font-semibold">{t("withdrawalDetails.optionalNotes")}<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 h-24 w-full resize-none rounded-xl border border-[#e7dede] p-4 outline-none focus:border-[#75262d]" /></label>
          <button className="mt-4 h-12 w-full rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700">{t("withdrawalDetails.transferred")}</button>
        </form>

        <form onSubmit={rejectRequest} className={`${cardClass} flex flex-col`}>
          <h2 className="mb-2 flex items-center justify-start gap-2 text-xl font-extrabold"><span>{t("withdrawalDetails.reject")}</span><X className="text-red-500" /></h2>
          <p className="mb-5 text-start text-sm text-gray-400">{t("withdrawalDetails.rejectHint")}</p>
          <label className="block flex-1 text-start text-sm font-semibold">{t("withdrawalDetails.rejectionReason")} *<textarea value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder={t("withdrawalDetails.rejectionPlaceholder")} className="mt-2 h-44 w-full resize-none rounded-xl border border-[#e7dede] p-4 outline-none focus:border-red-400" /></label>
          <button className="mt-auto h-12 w-full rounded-xl bg-red-500 font-bold text-white hover:bg-red-600">{t("withdrawalDetails.reject")}</button>
        </form>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="mb-7 flex items-center gap-2 text-xl font-extrabold">{t("withdrawalDetails.history")} <Clock3 size={20} /></h2>
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          {[t("statuses.created"), t("statuses.underReview"), t("withdrawalDetails.transferSuccess"), t("statuses.approved")].map((step, index) => (
            <div key={step} className={index <= 1 ? "font-bold text-blue-600" : "font-semibold text-gray-400"}><span className={`mx-auto mb-2 block h-3 w-3 rounded-full ${index <= 1 ? "bg-blue-500" : "bg-gray-200"}`} />{step}</div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-sm font-medium text-amber-700">
        <strong className="block">⚠️ {t("withdrawalDetails.important")}</strong> {t("withdrawalDetails.importantHint")}
      </div>
    </section>
  );
}
