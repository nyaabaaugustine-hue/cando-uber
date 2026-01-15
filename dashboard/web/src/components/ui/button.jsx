import React from "react";
import { cn } from "@/lib/utils";

export default function Button({
  className,
  variant = "default",
  size = "md",
  asChild,
  loading = false,
  children,
  ...props
}) {
  const Comp = asChild ? "span" : "button";
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 gap-2";
  const sizes = {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-3",
    md: "h-9 px-4",
    lg: "h-10 px-5",
    icon: "h-9 w-9"
  };
  const variants = {
    default: "bg-black text-white hover:bg-black/90",
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-neutral-300 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
    ghost: "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
  };
  const disabled = props.disabled || loading;
  return (
    <Comp
      className={cn(base, sizes[size] || sizes.md, variants[variant] || variants.default, className)}
      disabled={disabled}
      {...props}
    >
      {loading && (
        <svg
          className={cn("animate-spin", size === "lg" ? "h-5 w-5" : "h-4 w-4")}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
        </svg>
      )}
      {children}
    </Comp>
  );
}
