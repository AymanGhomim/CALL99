import { Plus } from "lucide-react";

export default function AdsHeader({ onAddAd }) {
  return (
    <header className="mb-7 flex flex-wrap-reverse items-center justify-between gap-4">
      <div className="text-right">
        <h1 className="text-3xl font-extrabold text-[#75262d]">إدارة الاعلانات</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          تحكم في جميع الحملات الاعلانيه والمساحات الترويجيه للتطبيق
        </p>
      </div>

      <button
        type="button"
        onClick={onAddAd}
        className="flex h-14 items-center gap-2 rounded-xl bg-[#642326] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#542029]"
      >
        <Plus size={18} />
        اضافه اعلان جديد
      </button>
    </header>
  );
}
