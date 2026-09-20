import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Check, Clock, AlertCircle } from "lucide-react";


interface MicrotopicRowProps {
  microtopic: any;
  onStatusChange?: (id: string, status: string) => void;
}

export function MicrotopicRow({
  microtopic,
  onStatusChange,
}: MicrotopicRowProps) {
  const statusIcon = {
    COMPLETED: <Check className="h-3 w-3 text-green-600" />,
    IN_PROGRESS: <Clock className="h-3 w-3 text-blue-600" />,
    REVISION_REQUIRED: <AlertCircle className="h-3 w-3 text-yellow-600" />,
    NOT_STARTED: null,
  };

  return (
    <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-accent">
      <div className="flex items-center gap-2">
        {statusIcon[microtopic.status as keyof typeof statusIcon]}
        <span className="text-sm">{microtopic.title}</span>
      </div>
      <StatusBadge
        status={microtopic.status as any}
        className="text-xs"
      />
    </div>
  );
}