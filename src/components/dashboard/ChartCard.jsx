export default function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`rounded-xl border border-[#f2e8e8] bg-white p-6 shadow-sm ${className}`}>
      <h3 className="mb-5 text-right text-lg font-extrabold text-[#221b1b]">{title}</h3>
      {children}
    </div>
  );
}
