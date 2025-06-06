import * as React from "react";

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement>;

export function Avatar({ className = "", ...props }: AvatarProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gray-200 w-10 h-10 ${className}`}
      {...props}
    />
  );
}

export function AvatarFallback({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className="flex items-center justify-center w-full h-full text-gray-500"
      {...props}
    >
      {children}
    </span>
  );
}