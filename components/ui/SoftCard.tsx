import type { HTMLAttributes } from "react";

interface SoftCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SoftCard({ children, className = "", ...props }: SoftCardProps) {
  return (
    <div
      className={`rounded-card border border-surface-container-low bg-surface-container-lowest p-stack-md soft-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
