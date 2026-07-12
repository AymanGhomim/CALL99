import { Plus } from "lucide-react";

export default function OrdersHeader({ onAddOrder }) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-extrabold text-[#75262d]">
          إدارة الطلبات
        </h1>

        <p className="mt-2 text-base text-[#7a6f6f]">
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
