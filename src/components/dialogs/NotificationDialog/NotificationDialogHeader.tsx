export default function NotificationDialogHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 text-right">
      <div>
        <h2 className="text-[18px] font-extrabold text-[#75262d]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm font-normal text-[#9c9c9c]">{subtitle}</p>}
      </div>
      {Icon && <Icon size={18} className="text-[#75262d]" />}
    </div>
  );
}
