import { useEffect } from "react";

const toneStyles = {
  primary: { bg: "#f7ecee", fg: "#75262d", confirmBg: "bg-[#642326] hover:bg-[#542029]" },
  danger: { bg: "#fbeaea", fg: "#ef4444", confirmBg: "bg-red-500 hover:bg-red-600" },
  success: { bg: "#e8f8ef", fg: "#22c55e", confirmBg: "bg-emerald-500 hover:bg-emerald-600" },
};

/**
 * Small centered confirmation popup: icon + title + description + cancel/confirm.
 * Generic and reusable (used for "set as default", but works for any yes/no prompt).
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  icon: Icon,
  title,
  description,
  cancelLabel = "الغاء",
  confirmLabel = "تاكيد",
  tone = "primary",
  loading = false,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const styles = toneStyles[tone] ?? toneStyles.primary;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="mx-auto w-full max-w-[420px] rounded-[28px] border border-[#f1e7e8] bg-white p-7 text-center shadow-[0_16px_50px_rgba(0,0,0,0.22)]"
      >
        {Icon && (
          <div
            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: styles.bg }}
          >
            <Icon size={30} style={{ color: styles.fg }} />
          </div>
        )}

        <h3 className="text-lg font-extrabold text-[#75262d]">{title}</h3>

        {description && (
          <p className="mx-auto mt-3 max-w-[320px] text-sm font-medium leading-6 text-gray-400">
            {description}
          </p>
        )}

        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-xl border border-[#E5DCDC] bg-white text-sm font-bold text-[#3d3434] transition-colors duration-200 hover:bg-[#f7ecee]"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`h-12 flex-1 rounded-xl text-sm font-bold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${styles.confirmBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
