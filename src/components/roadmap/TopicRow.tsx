import { StatusBadge } from "./StatusBadge";
import Progress from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import { ProgressRing } from "./ProgressRing";
import { MicrotopicRow } from "./MicrotopicRow";

interface TopicRowProps {
  topic: any;
  onStatusChange?: (topicId: string, status: string) => void;
}

export function TopicRow({ topic, onStatusChange }: TopicRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="ml-6 border-l-2 pl-4 space-y-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">{topic.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress
                value={topic.completionPct}
                className="w-32 h-1.5"
              />
              <span className="text-xs text-muted-foreground">
                {Math.round(topic.completionPct)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={topic.status as any} />
          <ProgressRing percentage={topic.completionPct} size={36} />
        </div>
      </div>

      {isExpanded && (
        <div className="ml-6 space-y-1">
          {topic.microtopics.map((mt) => (
            <MicrotopicRow key={mt.id} microtopic={mt} />
          ))}
        </div>
      )}
    </div>
  );
}