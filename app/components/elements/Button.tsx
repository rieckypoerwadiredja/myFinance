import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          {
            "bg-primary text-white hover:bg-primary-hover": variant === "primary",
            "bg-surface-container-low hover:bg-surface-container-high text-on-surface": variant === "secondary",
            "border border-outline-variant/15 bg-surface-container-lowest hover:bg-surface-container-high": variant === "outline",
            "bg-transparent hover:bg-surface-container-high text-on-surface-variant": variant === "ghost",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-5 py-2.5 text-sm": size === "md",
            "h-12 px-8 py-3 text-base": size === "lg",
            "h-8 w-8 p-1.5 rounded-lg": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };