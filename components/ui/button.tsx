"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-soft hover:shadow-dental active:scale-95 focus-visible:ring-primary-300",
        outline:
          "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600 shadow-sm hover:shadow-medium active:scale-95 focus-visible:ring-primary-200",
        ghost:
          "text-charcoal hover:bg-mint-pale hover:text-primary-600 active:scale-95",
        destructive:
          "bg-gradient-to-r from-error-500 to-error-600 text-white hover:from-error-600 hover:to-error-700 shadow-soft hover:shadow-medium active:scale-95 focus-visible:ring-error-300",
        success:
          "bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 shadow-soft hover:shadow-medium active:scale-95 focus-visible:ring-success-300",
      },
      size: {
        sm: "h-9 px-4 text-xs gap-1.5",
        md: "h-11 px-6 gap-2",
        lg: "h-13 px-8 text-base gap-2.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={clsx(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
