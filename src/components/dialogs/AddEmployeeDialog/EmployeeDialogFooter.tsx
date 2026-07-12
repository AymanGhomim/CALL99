import { Plus } from "lucide-react";

export default function EmployeeDialogFooter({ onCancel, submitting }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#f1e8e8] pt-5">
      <button
        type="button"
        onClick={onCancel}
        className="h-14 rounded-xl border border-[#E5DCDC] bg-white px-8 text-sm font-bold text-[#3d3434] transition-colors duration-200 hover:bg-[#f7ecee]"
      >
        إلغاء
      </button>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#642326] px-10 text-base font-bold text-white transition-colors duration-200 hover:bg-[#542029] disabled:cursor-not-allowed disabled:opacity-70"
      >
        اضافه
        <Plus size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
