import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import RowActions from "../components/ui/RowActions";

/**
 * Column-config factories for <DataTable />.
 *
 * Every *Table.jsx file used to redefine the same handful of column shapes
 * (a status badge, a linked name, a phone number, an actions row) with
 * near-identical JSX. These helpers build that config once so each table
 * file only lists what's actually different about it.
 */

// Badge column driven by a STATUS -> tone map (see constants/statusTones.js).
export function statusColumn(toneMap, { key = "status", label = "الحالة" } = {}) {
  return {
    key,
    label,
    align: "center",
    render: (row) => <Badge tone={toneMap[row[key]] ?? "neutral"}>{row[key]}</Badge>,
  };
}

// Bold name/title that links elsewhere (user profile, provider profile...).
export function linkColumn({ key, label, to, className = "font-extrabold text-[#3d3434]" }) {
  return {
    key,
    label,
    cellClassName: className,
    render: (row) => (
      <Link to={to(row)} className="transition-colors hover:text-[#75262d]">
        {row[key]}
      </Link>
    ),
  };
}

// Phone numbers stay LTR even inside an RTL row.
export function phoneColumn({ key = "phone", label = "رقم الهاتف", className } = {}) {
  return {
    key,
    label,
    cellClassName: className,
    render: (row) => (
      <span className="block text-right" dir="ltr">
        {row[key]}
      </span>
    ),
  };
}

// "الإجراءات" column: pass a (row) => [{ icon, title, tone, onClick }] factory.
export function actionsColumn(buildActions, { label = "الإجراءات" } = {}) {
  return {
    key: "actions",
    label,
    align: "center",
    render: (row) => <RowActions actions={buildActions(row)} />,
  };
}
