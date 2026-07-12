import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfileTopBar({
  title = "ملف المستخدم",
  subtitle = "عرض وإدارة معلومات المستخدم",
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-7 flex items-center justify-between">
      <div className="text-right">
        <h1 className="text-3xl font-extrabold text-[#75262d]">{title}</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-lg border border-[#e7dede] bg-white px-4 py-2 text-sm font-bold text-[#3d3434] shadow-sm transition-colors hover:bg-[#fbf7f7]"
      >
        <ArrowLeft size={16} />
        رجوع
      </button>
    </div>
  );
}
