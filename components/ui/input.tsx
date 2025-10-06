"use client";

import { clsx } from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-charcoal placeholder:text-gray-400 shadow-inner-soft focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
