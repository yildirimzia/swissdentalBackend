"use client";

import { clsx } from "clsx";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "success" | "warning" | "gray";
}

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  const toneClass = {
    default: "bg-primary-100 text-primary-700",
    success: "bg-success-100 text-success-700",
    warning: "bg-warning-100 text-warning-700",
    gray: "bg-gray-100 text-gray-700",
  }[tone];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        toneClass,
        className,
      )}
      {...props}
    />
  );
}
