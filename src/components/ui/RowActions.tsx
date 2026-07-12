const toneClasses = {
  success: "text-emerald-500",
  danger: "text-red-500",
  neutral: "text-gray-500",
};

/**
 * Row of icon buttons for a table's "actions" column (view / edit / block / ...).
 * Every table used to hand-write this same button markup per action; now each
 * table just passes a list of { icon, title, tone, onClick } and this renders
 * them all the same way everywhere.
 */
export default function RowActions({ actions = [] }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {actions.filter(Boolean).map(({ icon: Icon, title, tone = "neutral", onClick, size = 17 }) => (
        <button key={title} type="button" title={title} onClick={onClick}>
          <Icon size={size} className={toneClasses[tone] ?? toneClasses.neutral} />
        </button>
      ))}
    </div>
  );
}
