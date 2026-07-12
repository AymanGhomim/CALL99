import { Plus } from "lucide-react";

export default function OrdersHeader({ onAddOrder }) {
  return (
    <div className="mb-7 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-[#75262d]">
          إدارة الطلبات
        </h1>

        <p className="mt-1 text-sm font-medium text-gray-500">
          تحكم في جميع الطلبات والرسائل المرسلة للمستخدمين
        </p>
      </div>

      {onAddOrder && (
        <button
          type="button"
          onClick={onAddOrder}
          className="flex items-center gap-2 rounded-xl bg-[#75262d] px-5 py-3 font-bold text-white transition hover:bg-[#642028]"
        >
          <Plus size={18} />
          إنشاء طلب
        </button>
      )}
    </div>
  );
}
