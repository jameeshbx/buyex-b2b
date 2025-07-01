// src/components/ui/select.tsx
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from '@radix-ui/react-icons';
import { cn } from "@/lib/utils"; // Optional helper if you're using classnames

export const Select = SelectPrimitive.Root;

export const SelectTrigger = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) => (
  <SelectPrimitive.Trigger
    className={cn(
      "inline-flex items-center justify-between px-4 py-2 border rounded w-[200px] text-sm",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <ChevronDownIcon />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

export const SelectValue = SelectPrimitive.Value;

export const SelectContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn("bg-white border rounded shadow-md", className)}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex justify-center">
        <ChevronUpIcon />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex justify-center">
        <ChevronDownIcon />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

export const SelectItem = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item
    className={cn(
      "px-4 py-2 hover:bg-gray-100 flex items-center justify-between cursor-pointer",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator>
      <CheckIcon />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
);
