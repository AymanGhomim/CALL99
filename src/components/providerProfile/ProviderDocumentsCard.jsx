import Badge from "../ui/Badge";
import { PROVIDER_DOCUMENT_STATUS_TONE } from "../../constants/statusTones";

export default function ProviderDocumentsCard({ documents }) {
  return (
    <div className="rounded-xl border border-[#f2e8e8] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-right text-base font-extrabold text-[#221b1b]">المستندات</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {documents.map((doc, index) => (
          <div key={doc.label} className="text-center">
            <div
              className="aspect-[4/5] w-full rounded-lg"
              style={{
                background:
                  index % 2 === 0
                    ? "linear-gradient(160deg,#7a4a2b,#1c1208)"
                    : "linear-gradient(160deg,#3a3a3a,#0a0a0a)",
              }}
            />
            <p className="mt-2 text-xs font-semibold text-gray-500">{doc.label}</p>
            <Badge tone={PROVIDER_DOCUMENT_STATUS_TONE[doc.status] ?? "neutral"} size="sm" className="mt-1">
              {doc.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
