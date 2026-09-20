import Progress from "@/components/ui/Progress";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import { ProgressRing } from "./ProgressRing";
import { TopicRow } from "./TopicRow";

interface PhaseCardProps {
  phase: any;
  onStatusChange?: (topicId: string, status: string) => void;
}

export function PhaseCard({ phase, onStatusChange }: PhaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <h3 className="font-semibold">{phase.title}</h3>
            <p className="text-sm text-muted-foreground">
              {phase.objective}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ProgressRing percentage={phase.completionPct} size={48} />
          <StatusBadge status={getPhaseStatus(phase)} className="hidden sm:block" />
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {phase.topics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getPhaseStatus(phase: any): "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "REVISION_REQUIRED" {
  if (phase.topics.every((t) => t.status === "COMPLETED")) return "COMPLETED";
  if (phase.topics.some((t) => t.status !== "NOT_STARTED")) return "IN_PROGRESS";
  return "NOT_STARTED";
}