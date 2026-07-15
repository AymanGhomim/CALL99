import type { ButtonHTMLAttributes } from "react";

export default function Button({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#642326] text-base font-bold text-white transition-colors duration-200 hover:bg-[#542029] ${className}`}
    >
      {children}
    </button>
  );
}
