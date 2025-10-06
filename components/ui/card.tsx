import { clsx } from "clsx";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-3xl bg-white/90 p-6 shadow-medium backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
