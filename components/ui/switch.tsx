// src/components/ui/switch.tsx
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils"; // optional className utility

export const Switch = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) => (
  <SwitchPrimitive.Root
    className={cn(
      "w-10 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="block w-4 h-4 bg-white rounded-full shadow transform transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
  </SwitchPrimitive.Root>
);
