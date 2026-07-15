import { Ban } from "lucide-react";

export default function BlockUserButton({ onClick, label = "حظر المستخدم" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2e8e8] bg-white py-4 text-sm font-bold text-red-500 shadow-sm transition-colors hover:bg-red-50"
    >
      {label}
      <Ban size={17} />
    </button>
  );
}
