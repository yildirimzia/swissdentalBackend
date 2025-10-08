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
          "flex min-h-[120px] w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-charcoal placeholder:text-gray-400 transition-all duration-200 shadow-sm hover:border-gray-300 focus:border-primary-500 focus:bg-mint-pale/30 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:shadow-dental disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 resize-y",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
