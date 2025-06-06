"use client"
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ children, ...props }, ref) => (
  <PopoverPrimitive.Content ref={ref} {...props}>
    {children}
  </PopoverPrimitive.Content>
))
PopoverContent.displayName = "PopoverContent"