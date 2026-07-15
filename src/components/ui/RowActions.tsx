import type { LucideIcon } from "lucide-react";

const toneClasses = {
  success: "text-emerald-500",
  danger: "text-red-500",
  neutral: "text-gray-500",
} as const;

export type ActionTone = keyof typeof toneClasses;

export interface RowAction {
  icon: LucideIcon;
  title: string;
  tone?: ActionTone | string;
  onClick?: () => void;
  size?: number;
}

export default function RowActions({ actions = [] }: { actions?: Array<RowAction | null | false | undefined> }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {actions.filter((action): action is RowAction => Boolean(action)).map(({ icon: Icon, title, tone = "neutral", onClick, size = 17 }) => (
        <button key={title} type="button" title={title} onClick={onClick}>
          <Icon size={size} className={toneClasses[tone as ActionTone] ?? toneClasses.neutral} />
        </button>
      ))}
    </div>
  );
}
