import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-[1200px]",
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`mx-auto w-full ${maxWidth} overflow-hidden rounded-[30px] border border-[#f1e7e8] bg-white shadow-[0_16px_50px_rgba(0,0,0,0.22)]`}
      >
        <div className="flex items-center justify-between border-b border-[#f1e8e8] px-6 py-4">
          <div className="text-[18px] font-extrabold text-[#75262d]">
            {title}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#75262d] transition hover:bg-[#f7ecee]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[84vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
