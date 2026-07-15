import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  X,
  XCircle,
} from "lucide-react";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import type { ProviderDocument, ProviderRequest } from "./ProvidersRequestsTable";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";
import { translateStatus, translateValue } from "../../i18n/translateEnum";

interface Props {
  open: boolean;
  request: ProviderRequest | null;
  onClose: () => void;
  onApprove: (request: ProviderRequest) => void | Promise<void>;
  onReject: (request: ProviderRequest, reason: string) => void | Promise<void>;
  loading?: boolean;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#faf8f8] p-4 text-right">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 font-bold text-[#3d3434]">{value}</p>
    </div>
  );
}

function DocumentPreview({ document, onClose }: { document: ProviderDocument; onClose: () => void }) {
  const { t } = useTranslation();
  const label = document.id === "national-id" ? t("provider.nationalId")
    : document.id === "commercial-register" ? t("provider.commercialRegistration")
      : document.id === "bank-account" ? t("provider.bankCertificate") : document.label;
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eee5e5] px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              aria-label={t("common.close")}
            >
              <X size={20} />
            </button>
            <a
              href={document.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-[#75262d] px-4 py-2 text-sm font-bold text-[#75262d]"
            >
              {t("provider.openNewWindow")}
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="text-right">
            <p className="font-extrabold text-[#3d3434]">{label}</p>
            <p className="text-xs text-gray-400">{document.fileName}</p>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-[#f5f2f2] p-4">
          {document.mimeType === "application/pdf" ? (
            <iframe src={document.url} title={label} className="h-[72vh] w-full rounded-xl bg-white shadow-sm" />
          ) : (
            <img src={document.url} alt={label} className="mx-auto max-h-[72vh] max-w-full rounded-xl bg-white object-contain shadow-sm" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProviderRequestReviewDialog({ open, request, onClose, onApprove, onReject, loading = false }: Props) {
  const { t } = useTranslation();
  const { direction } = useLocale();
  const [status, setStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<ProviderDocument | null>(null);

  useEffect(() => {
    setStatus(request?.status ?? "");
    setRejectionReason(request?.rejectionReason ?? "");
    setSelectedDocument(null);
  }, [request, open]);

  if (!request) return null;

  const documents = request.documents ?? [];
  const documentLabel = (document: ProviderDocument) =>
    document.id === "national-id" ? t("provider.nationalId")
      : document.id === "commercial-register" ? t("provider.commercialRegistration")
        : document.id === "bank-account" ? t("provider.bankCertificate") : document.label;
  const isPending = request.status !== "تم القبول" && request.status !== "مرفوض";
  const extraDetails = [
    [t("provider.providerType"), request.providerType ? translateValue(request.providerType, t) : ""],
    [t("common.email"), request.email ?? ""],
    [t("provider.city"), request.city ?? ""],
    [t("provider.address"), request.address ?? ""],
    [t("provider.companyName"), request.companyName ?? ""],
    [t("provider.responsibleName"), request.responsibleName ?? ""],
    [t("provider.identityNumber"), request.nationalId ?? ""],
    [t("provider.commercialRegisterNumber"), request.commercialRegistrationNumber ?? ""],
    [t("provider.vatNumber"), request.vatNumber ?? ""],
    [t("provider.licenseNumber"), request.licenseNumber ?? ""],
  ].filter((detail): detail is [string, string] => Boolean(detail[1]));

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={t("provider.reviewRequest")}
        maxWidth="max-w-[680px]"
      >
        <div dir={direction}>
          <div className="mb-6 flex items-center justify-between rounded-xl bg-[#fbf7f7] p-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">{t("tables.orderNumber")}</p>
              <p className="mt-1 text-lg font-extrabold text-[#75262d]">{request.orderNo}</p>
            </div>
            <Badge tone={status === "تم القبول" ? "success" : status === "مرفوض" ? "danger" : "warning"}>
              {translateStatus(status, t)}
            </Badge>
          </div>

          <h3 className="mb-4 text-start text-lg font-extrabold">{t("provider.providerData")}</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Detail label={t("tables.provider")} value={request.providerName} />
            <Detail label={t("common.phone")} value={request.phone} />
            <Detail label={t("tables.serviceType")} value={translateValue(request.serviceType, t)} />
            <Detail label={t("provider.submissionDate")} value={request.date} />
          </div>

          {extraDetails.length > 0 && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {extraDetails.map(([label, value]) => <Detail key={label} label={label} value={value} />)}
            </div>
          )}

          <section className="mt-5 rounded-xl border border-[#eee5e5] p-4">
            <div className="mb-4 flex items-center justify-between">
              <Badge tone="neutral">{t("provider.documentCount", { count: documents.length })}</Badge>
              <div className="flex items-center gap-2 font-bold text-[#3d3434]">
                {t("provider.submittedDocuments")}
                <FileCheck2 size={19} className="text-emerald-500" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {documents.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => setSelectedDocument(document)}
                  className="group overflow-hidden rounded-xl border border-[#eee5e5] bg-white text-right transition hover:-translate-y-0.5 hover:border-[#75262d] hover:shadow-md"
                >
                  <div className="relative flex h-28 items-center justify-center bg-[#faf6f6]">
                    <FileText size={38} className="text-[#75262d]" />
                    <span className="absolute left-2 top-2 rounded-lg bg-white p-2 text-[#75262d] shadow-sm">
                      <Eye size={16} />
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-extrabold text-[#3d3434]">{documentLabel(document)}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#75262d]">{t("provider.viewDocument")}</span>
                      <span className={`text-[11px] ${document.status === "تم التحقق" ? "text-emerald-600" : document.status === "مرفوض" ? "text-red-600" : "text-amber-600"}`}>
                        {translateStatus(document.status, t)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              {documents.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#e7dede] p-6 text-center text-sm text-gray-400 sm:col-span-3">
                  {loading ? t("common.loading") : t("provider.noDocuments")}
                </div>
              )}
            </div>
          </section>

          {isPending && (
            <label className="mt-4 block text-right text-sm font-bold">
              {t("provider.rejectionReason")}
              <textarea value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder={t("provider.rejectionPlaceholder")} className="mt-2 h-24 w-full resize-none rounded-xl border border-[#e7dede] p-4 outline-none focus:border-red-400" />
            </label>
          )}

          <div className="mt-6 flex flex-wrap gap-3 border-t border-[#eee7e7] pt-5">
            {isPending ? <>
              <button type="button" disabled={loading} onClick={() => onApprove(request)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-bold text-white disabled:opacity-50"><CheckCircle2 size={18} />{t("provider.acceptProvider")}</button>
              <button type="button" disabled={loading || !rejectionReason.trim()} onClick={() => onReject(request, rejectionReason.trim())} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 font-bold text-white disabled:opacity-50"><XCircle size={18} />{t("provider.rejectRequest")}</button>
            </> : (
              <button type="button" onClick={onClose} className="h-12 w-full rounded-xl border border-[#75262d] px-5 font-bold text-[#75262d]">{t("common.close")}</button>
            )}
          </div>
        </div>
      </Modal>

      {selectedDocument && (
        <DocumentPreview document={selectedDocument} onClose={() => setSelectedDocument(null)} />
      )}
    </>
  );
}
