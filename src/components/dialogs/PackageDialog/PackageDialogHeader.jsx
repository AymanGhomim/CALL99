export default function PackageDialogHeader({ title, subtitle }) {
  return (
    <div className="text-right">
      <h2 className="text-[18px] font-extrabold text-[#75262d]">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm font-normal text-[#9c9c9c]">{subtitle}</p>
      )}
    </div>
  );
}
