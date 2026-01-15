import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white/70 text-neutral-900 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:-translate-y-[1px] dark:bg-neutral-900/50 dark:text-neutral-100 dark:backdrop-blur-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("p-4 border-b/60 dark:border-neutral-800/60", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn("text-sm font-semibold tracking-wide", className)}>{children}</h3>;
}

export function CardContent({ className, children }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
