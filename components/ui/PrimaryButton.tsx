import type { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  fullWidth,
  className = "",
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`pressed-effect flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 font-headline-md text-on-primary transition-all hover:opacity-95 disabled:opacity-50 ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
