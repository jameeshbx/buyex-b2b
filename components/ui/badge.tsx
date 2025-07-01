import React from "react"

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ 
  className = "", 
  ...props 
}) => (
  <span
    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${className}`}
    {...props}
  />
)