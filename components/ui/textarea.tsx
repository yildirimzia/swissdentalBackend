"use client";

import { clsx } from "clsx";
import { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          "flex min-h-[150px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-charcoal placeholder:text-gray-400 shadow-inner-soft focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
