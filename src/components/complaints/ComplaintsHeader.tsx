import { Plus } from "lucide-react";

interface ComplaintsHeaderProps {
  onAdd: () => void;
}

export default function ComplaintsHeader({ onAdd }: ComplaintsHeaderProps) {
  return (
    <header className="mb-7 flex flex-wrap-reverse items-center justify-between gap-4">
      <div className="text-right">
        <h1 className="text-3xl font-extrabold text-[#75262d]">إدارة الشكاوى</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          تحكم في جميع الشكاوى والتنبيهات المرسلة من المستخدمين
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="flex h-14 min-w-56 items-center justify-center gap-2 rounded-xl bg-[#642326] px-6 text-sm font-bold text-white transition hover:bg-[#542029]"
      >
        <Plus size={19} />
        تقديم شكوى جديدة
      </button>
    </header>
  );
}
