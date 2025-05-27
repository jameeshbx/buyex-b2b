// src/components/ui/radio-group.tsx
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from "@/lib/utils"; // Optional helper if you're using classnames

export const RadioGroup = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>) => (
  <RadioGroupPrimitive.Root
    className={cn("flex gap-4", className)}
    {...props}
  />
);

export const RadioGroupItem = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>) => (
  <RadioGroupPrimitive.Item
    className={cn(
      "h-4 w-4 rounded-full border border-gray-400 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="h-2 w-2 bg-blue-500 rounded-full" />
  </RadioGroupPrimitive.Item>
);
