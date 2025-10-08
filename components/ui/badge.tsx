"use client";

import { clsx } from "clsx";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "success" | "warning" | "gray";
}

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  const toneClass = {
    default: "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border border-primary-200/50 shadow-sm",
    success: "bg-gradient-to-r from-success-100 to-success-50 text-success-700 border border-success-200/50 shadow-sm",
    warning: "bg-gradient-to-r from-warning-100 to-warning-50 text-warning-700 border border-warning-200/50 shadow-sm",
    gray: "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200/50 shadow-sm",
  }[tone];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105",
        toneClass,
        className,
      )}
      {...props}
    />
  );
}
