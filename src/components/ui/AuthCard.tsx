export default function AuthCard({ children }) {
  return (
    <div className="w-full max-w-[560px] rounded-[26px] border border-[#EEE5E5] bg-white px-6 py-7 shadow-[0_5px_25px_rgba(0,0,0,.04)] sm:px-10 sm:py-9">
      {children}
    </div>
  );
}
