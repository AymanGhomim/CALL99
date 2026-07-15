import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Badge, { type BadgeTone } from "../components/ui/Badge";
import type { DataTableColumn } from "../components/ui/DataTable";
import RowActions, { type RowAction } from "../components/ui/RowActions";
import i18n from "../i18n";
import { translateStatus } from "../i18n/translateEnum";

interface ColumnOptions {
  key?: string;
  label?: string;
  className?: string;
}

function getValue<T extends object>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

function asReactNode(value: unknown): ReactNode {
  return value as ReactNode;
}

function resolveBadgeTone(tone: string | undefined): BadgeTone {
  const tones: BadgeTone[] = ["success", "warning", "danger", "info", "sky", "purple", "neutral"];
  return tones.includes(tone as BadgeTone) ? tone as BadgeTone : "neutral";
}

export function statusColumn<T extends object = object>(
  toneMap: Readonly<Record<string, string>>,
  { key = "status", label = i18n.t("common.status") }: ColumnOptions = {},
): DataTableColumn<T> {
  return {
    key,
    label,
    align: "center",
    render: (row) => {
      const value = String(getValue(row, key) ?? "");
      return <Badge tone={resolveBadgeTone(toneMap[value])}>{translateStatus(value, i18n.t.bind(i18n))}</Badge>;
    },
  };
}

interface LinkColumnOptions<T extends object> extends ColumnOptions {
  key: string;
  label: string;
  to: (row: T) => string;
}

export function linkColumn<T extends object>({
  key,
  label,
  to,
  className = "font-extrabold text-[#3d3434]",
}: LinkColumnOptions<T>): DataTableColumn<T> {
  return {
    key,
    label,
    cellClassName: className,
    render: (row) => (
      <Link to={to(row)} className="transition-colors hover:text-[#75262d]">
        {asReactNode(getValue(row, key))}
      </Link>
    ),
  };
}

export function phoneColumn<T extends object = object>({
  key = "phone",
  label = i18n.t("common.phone"),
  className,
}: ColumnOptions = {}): DataTableColumn<T> {
  return {
    key,
    label,
    cellClassName: className,
    render: (row) => <span className="block text-right" dir="ltr">{asReactNode(getValue(row, key))}</span>,
  };
}

export function actionsColumn<T extends object>(
  buildActions: (row: T) => Array<RowAction | null | false | undefined>,
  { label = i18n.t("common.actions") }: Pick<ColumnOptions, "label"> = {},
): DataTableColumn<T> {
  return {
    key: "actions",
    label,
    align: "center",
    render: (row) => <RowActions actions={buildActions(row)} />,
  };
}
