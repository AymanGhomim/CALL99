import { Eye, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import DataTable, { type DataTableColumn } from "../ui/DataTable";
import Badge from "../ui/Badge";
import { actionsColumn } from "../../utils/tableColumns";
import useLocale from "../../i18n/useLocale";

export interface ReadyReply {
  id: number;
  title: string;
  text: string;
  usage: number;
  lastUpdated: string;
  status: "نشط" | "غير نشط";
  translationId?: number;
}

interface ReadyRepliesTableProps {
  rows: ReadyReply[];
  onView: (reply: ReadyReply) => void;
  onEdit: (reply: ReadyReply) => void;
}

export default function ReadyRepliesTable({ rows, onView, onEdit }: ReadyRepliesTableProps) {
  const { t } = useTranslation();
  const { formatDate } = useLocale();
  const localizedTitle = (row: ReadyReply) => row.translationId ? t(`readyReplies.items.${row.translationId}.title`, { defaultValue: row.title }) : row.title;
  const localizedText = (row: ReadyReply) => row.translationId ? t(`readyReplies.items.${row.translationId}.text`, { defaultValue: row.text }) : row.text;

  const columns: DataTableColumn<ReadyReply>[] = [
    { key: "title", label: t("readyReplies.replyTitle"), cellClassName: "font-extrabold text-[#75262d]", render: localizedTitle },
    { key: "text", label: t("readyReplies.replyText"), cellClassName: "max-w-[360px]", render: (row) => <p className="line-clamp-2 text-sm leading-6 text-[#3d3434]">{localizedText(row)}</p> },
    { key: "usage", label: t("readyReplies.usage"), align: "center", cellClassName: "font-extrabold text-[#75262d]" },
    { key: "lastUpdated", label: t("readyReplies.lastUpdated"), align: "center", render: (row) => formatDate(row.lastUpdated, { dateStyle: "medium" }) },
    { key: "status", label: t("common.status"), align: "center", render: (row) => <Badge tone={row.status === "نشط" ? "success" : "danger"}>{t(row.status === "نشط" ? "statuses.active" : "statuses.inactive")}</Badge> },
    actionsColumn<ReadyReply>((row) => [
      { icon: Eye, title: t("common.view"), tone: "success", onClick: () => onView({ ...row, title: localizedTitle(row), text: localizedText(row) }) },
      { icon: Pencil, title: t("common.edit"), tone: "neutral", onClick: () => onEdit({ ...row, title: localizedTitle(row), text: localizedText(row) }) },
    ]),
  ];

  return (
    <DataTable
      title={t("readyReplies.list")}
      columns={columns}
      rows={rows}
      minWidth="980px"
      pagination={{ currentPage: 1, totalPages: 1, totalCount: rows.length, shownCount: rows.length, itemLabel: t("readyReplies.item") }}
    />
  );
}
