// src/components/ui/textarea.tsx
import React from 'react';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => (
  <textarea
    ref={ref}
    className="w-full min-h-[100px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
));

Textarea.displayName = 'Textarea';
