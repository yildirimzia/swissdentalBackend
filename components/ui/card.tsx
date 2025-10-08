import { clsx } from "clsx";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-100/50 shadow-soft hover:shadow-medium transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
}
