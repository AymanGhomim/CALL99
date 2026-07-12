import { Plus, Save, Pencil } from "lucide-react";
import { PACKAGE_DIALOG_MODES } from "./constants";

const primaryButtonClass =
  "flex h-14 items-center justify-center gap-2 rounded-xl bg-[#642326] px-8 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#542029] disabled:cursor-not-allowed disabled:opacity-70";

const cancelButtonClass =
  "h-14 rounded-xl border border-[#E5DCDC] bg-white px-8 text-sm font-bold text-[#3d3434] transition-colors duration-200 hover:bg-[#f7ecee]";

export default function PackageDialogFooter({ mode, onCancel, submitting, onEditClick }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f1e8e8] pt-5">
      <button type="button" onClick={onCancel} className={cancelButtonClass}>
        إلغاء
      </button>

      {mode === PACKAGE_DIALOG_MODES.CREATE && (
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          انشاء باقه
          <Plus size={18} strokeWidth={2.5} />
        </button>
      )}

      {mode === PACKAGE_DIALOG_MODES.EDIT && (
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          حفظ الباقه
          <Save size={18} />
        </button>
      )}

      {mode === PACKAGE_DIALOG_MODES.VIEW && (
        <button type="button" onClick={onEditClick} className={primaryButtonClass}>
          تعديل الباقه
          <Pencil size={18} />
        </button>
      )}
    </div>
  );
}
