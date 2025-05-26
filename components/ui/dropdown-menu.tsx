// src/components/ui/dropdown-menu.tsx
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      className={`bg-white border rounded shadow-md w-48 py-2 ${className}`}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);
export const DropdownMenuItem = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>) => (
  <DropdownMenuPrimitive.Item
    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${className}`}
    {...props}
  />
);
