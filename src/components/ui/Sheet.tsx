"use client";

import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute inset-0 flex justify-end">
        {children}
      </div>
    </div>
  );
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right" | "top" | "bottom";
}

function SheetContent({
  className,
  side = "right",
  children,
  ...props
}: SheetContentProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full max-w-md flex-col bg-card shadow-lg",
        side === "right" && "ml-auto",
        side === "left" && "mr-auto",
        side === "top" && "mt-auto",
        side === "bottom" && "mb-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SheetHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      {children}
    </div>
  );
}

function SheetTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

function SheetTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger };
