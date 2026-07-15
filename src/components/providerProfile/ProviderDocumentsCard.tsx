import { ExternalLink, FileText } from "lucide-react";
import Badge from "../ui/Badge";
import { PROVIDER_DOCUMENT_STATUS_TONE } from "../../constants/statusTones";
import type { ProviderDocumentInfo } from "../../types/entities";
import { useTranslation } from "react-i18next";
import { translateStatus } from "../../i18n/translateEnum";

export default function ProviderDocumentsCard({ documents }: { documents: ProviderDocumentInfo[] }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-[#f2e8e8] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-start text-base font-extrabold text-[#221b1b]">{t("provider.documents")}</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {documents.map((doc) => (
          <div key={doc.label} className="text-center">
            <a
              href={doc.url || undefined}
              target={doc.url ? "_blank" : undefined}
              rel={doc.url ? "noreferrer" : undefined}
              aria-disabled={!doc.url}
              className={`flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-lg border border-[#eee5e5] bg-[#faf6f6] text-[#75262d] ${doc.url ? "cursor-pointer transition hover:border-[#75262d]" : "cursor-default opacity-60"}`}
            >
              <FileText size={32} />
              <span className="max-w-full truncate px-2 text-[11px] text-gray-500">{doc.fileName ?? doc.mimeType ?? doc.label}</span>
              {doc.url && <ExternalLink size={14} />}
            </a>
            <p className="mt-2 text-xs font-semibold text-gray-500">{doc.label}</p>
            <Badge tone={PROVIDER_DOCUMENT_STATUS_TONE[doc.status] ?? "neutral"} size="sm" className="mt-1">
              {translateStatus(doc.status, t)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
