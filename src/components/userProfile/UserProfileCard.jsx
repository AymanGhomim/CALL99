import { Calendar, Phone, User } from "lucide-react";

export default function UserProfileCard({
  name,
  phone,
  memberSince,
  status = "نشط",
}) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-[#f2e8e8] bg-white p-8 shadow-sm">
      {/* Left side: Avatar with status badge */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="h-16 w-16 rounded-full bg-[#221b1b]" />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
            {status}
          </span>
        </div>

        {/* Profile info */}
        <div className="text-right">
          <h2 className="text-xl font-extrabold text-[#221b1b]">{name}</h2>
          <div className="mt-2 flex flex-col items-end gap-1.5 text-sm text-gray-500">
            <span className="flex items-center gap-2" dir="ltr">
              {phone}
              <Phone size={14} className="text-gray-400" />
            </span>
            <span className="flex items-center gap-2">
              {memberSince}
              <Calendar size={14} className="text-gray-400" />
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Decorative accent icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbf1f1] text-[#75262d]">
        <User size={26} />
      </div>
    </div>
  );
}
