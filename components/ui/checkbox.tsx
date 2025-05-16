import React, { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
        className
      )}
      {...props}
    />
  )
})

Checkbox.displayName = "Checkbox"
