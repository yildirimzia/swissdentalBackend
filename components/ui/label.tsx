"use client";

import { clsx } from "clsx";
import { LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={clsx(
        "inline-flex items-center gap-2 text-sm font-bold text-charcoal-light transition-colors",
        className,
      )}
      {...props}
    />
  );
}
