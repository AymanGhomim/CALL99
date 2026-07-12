import { Menu } from "lucide-react";

export default function MobileTopBar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#f2e8e8] bg-white px-4 py-3 lg:hidden">
      <span className="text-lg font-extrabold text-[#75262d]">CALL99</span>

      <button
        type="button"
        onClick={onMenuClick}
        aria-label="فتح القائمة"
        className="rounded-lg p-2 text-[#75262d] transition hover:bg-[#fbf7f7]"
      >
        <Menu size={22} />
      </button>
    </header>
  );
}
