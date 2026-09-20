import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80": variant === "default",
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "border-transparent bg-red-500 text-white hover:bg-red-500/80": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
};

export default Badge;