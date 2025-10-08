"use client";

import { clsx } from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm text-charcoal placeholder:text-gray-400 transition-all duration-200 shadow-sm hover:border-gray-300 focus:border-primary-500 focus:bg-mint-pale/30 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:shadow-dental disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
