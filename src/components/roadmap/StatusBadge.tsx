import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { Status } from "@/types";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<
  Status,
  { label: string; className: string }
> = {
  NOT_STARTED: { label: "Not Started", className: "bg-gray-100 text-gray-800" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-800" },
  REVISION_REQUIRED: { label: "Revision Required", className: "bg-yellow-100 text-yellow-800" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge className={cn(config.className, className)}>{config.label}</Badge>
  );
}